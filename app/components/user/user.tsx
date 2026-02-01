// app/components/user/user.tsx
import { useEffect, useState } from "react";
import { Form } from "react-router";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "~/firebase/firebaseConfig";
import type { AuthUser } from "~/types/authUser";

interface UserData {
  email: string;
  displayName: string | null;
  createdAt: Timestamp;
  role?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "customer" | "designer";
  createdAt: Timestamp;
  read: boolean;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  paid?: boolean;
  paymentId?: string;
  paymentDate?: Timestamp;
  paymentAmount?: number;
  paymentCurrency?: string;
  price?: number; // ADD THIS - Price in pence
}

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: Timestamp;
//   paid?: boolean;
//   paymentId?: string;
//   paymentDate?: Timestamp;
//   paymentAmount?: number;
//   paymentCurrency?: string;
// }

interface UserDashboardProps {
  user: AuthUser;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);

  // Project messages state
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null,
  );
  const [projectMessages, setProjectMessages] = useState<{
    [key: string]: Message[];
  }>({});
  const [projectMessagesLoading, setProjectMessagesLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [projectMessageText, setProjectMessageText] = useState<{
    [key: string]: string;
  }>({});
  const [projectMessageSubmitting, setProjectMessageSubmitting] = useState<{
    [key: string]: boolean;
  }>({});
  const [editingProjectMessageId, setEditingProjectMessageId] = useState<
    string | null
  >(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectMessageText, setEditProjectMessageText] = useState("");

  // Payment notification state
  const [paymentNotification, setPaymentNotification] = useState<{
    type: "success" | "cancelled" | null;
    projectId?: string;
  }>({ type: null });

  // Handle payment success/cancel notifications
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const projectId = params.get("project_id");

    if (payment === "success") {
      setPaymentNotification({
        type: "success",
        projectId: projectId || undefined,
      });
      // Auto-expand the paid project
      if (projectId) {
        setExpandedProjectId(projectId);
      }
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
      // Auto-hide notification after 10 seconds
      setTimeout(() => setPaymentNotification({ type: null }), 10000);
    } else if (payment === "cancelled") {
      setPaymentNotification({ type: "cancelled" });
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
      // Auto-hide notification after 5 seconds
      setTimeout(() => setPaymentNotification({ type: null }), 5000);
    }
  }, []);

  // Fetch user document from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Fetch general messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, "users", user.uid, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((doc) => {
        messagesData.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });
      setMessages(messagesData);
      setMessagesLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch projects in real-time
  useEffect(() => {
    const projectsRef = collection(db, "users", user.uid, "projects");
    const q = query(projectsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData: Project[] = [];
      snapshot.forEach((doc) => {
        projectsData.push({
          id: doc.id,
          ...doc.data(),
        } as Project);
      });
      setProjects(projectsData);
      setProjectsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Fetch project messages when project is expanded
  useEffect(() => {
    if (!expandedProjectId) return;

    setProjectMessagesLoading({
      ...projectMessagesLoading,
      [expandedProjectId]: true,
    });

    const messagesRef = collection(
      db,
      "users",
      user.uid,
      "projects",
      expandedProjectId,
      "messages",
    );
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((doc) => {
        messagesData.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });
      setProjectMessages({
        ...projectMessages,
        [expandedProjectId]: messagesData,
      });
      setProjectMessagesLoading({
        ...projectMessagesLoading,
        [expandedProjectId]: false,
      });
    });

    return () => unsubscribe();
  }, [expandedProjectId, user.uid]);

  // Check if project has any files
  const projectHasFiles = (projectId: string): boolean => {
    const messages = projectMessages[projectId] || [];
    return messages.some((msg) => msg.fileUrl);
  };

  // Handle general message submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "users", user.uid, "messages"), {
        text: message,
        sender: "customer",
        createdAt: serverTimestamp(),
        read: false,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle project message submission
  const handleProjectMessageSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    projectId: string,
  ) => {
    e.preventDefault();
    const msgText = projectMessageText[projectId]?.trim();
    if (!msgText) return;

    setProjectMessageSubmitting({
      ...projectMessageSubmitting,
      [projectId]: true,
    });
    try {
      await addDoc(
        collection(db, "users", user.uid, "projects", projectId, "messages"),
        {
          text: msgText,
          sender: "customer",
          createdAt: serverTimestamp(),
          read: false,
        },
      );

      setProjectMessageText({ ...projectMessageText, [projectId]: "" });
    } catch (error) {
      console.error("Error sending project message:", error);
      alert("Failed to send message");
    } finally {
      setProjectMessageSubmitting({
        ...projectMessageSubmitting,
        [projectId]: false,
      });
    }
  };

  // Handle project creation
  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDescription.trim()) return;

    setCreatingProject(true);
    try {
      await addDoc(collection(db, "users", user.uid, "projects"), {
        title: projectTitle,
        description: projectDescription,
        createdAt: serverTimestamp(),
        paid: false, // Start as unpaid
      });

      setProjectTitle("");
      setProjectDescription("");
      setShowProjectForm(false);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
    } finally {
      setCreatingProject(false);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (projectId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This will also delete all messages associated with it.",
      )
    )
      return;

    try {
      const projectRef = doc(db, "users", user.uid, "projects", projectId);
      await deleteDoc(projectRef);

      // Clear expanded state if this project was expanded
      if (expandedProjectId === projectId) {
        setExpandedProjectId(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  // Toggle project messages view
  const toggleProjectMessages = (projectId: string) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(projectId);
    }
  };

  // General message handlers
  const handleEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.text);
  };

  const handleUpdate = async (messageId: string) => {
    if (!editText.trim()) return;

    try {
      const messageRef = doc(db, "users", user.uid, "messages", messageId);
      await updateDoc(messageRef, {
        text: editText,
      });
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("error updating message:", error);
      alert("failed to update message");
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const messageRef = doc(db, "users", user.uid, "messages", messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("failed to delete message");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // Project message handlers
  const handleEditProjectMessage = (msg: Message, projectId: string) => {
    setEditingProjectMessageId(msg.id);
    setEditingProjectId(projectId);
    setEditProjectMessageText(msg.text);
  };

  const handleUpdateProjectMessage = async (
    messageId: string,
    projectId: string,
  ) => {
    if (!editProjectMessageText.trim()) return;

    try {
      const messageRef = doc(
        db,
        "users",
        user.uid,
        "projects",
        projectId,
        "messages",
        messageId,
      );
      await updateDoc(messageRef, {
        text: editProjectMessageText,
      });
      setEditingProjectMessageId(null);
      setEditingProjectId(null);
      setEditProjectMessageText("");
    } catch (error) {
      console.error("Error updating project message:", error);
      alert("Failed to update message");
    }
  };

  const handleDeleteProjectMessage = async (
    messageId: string,
    projectId: string,
  ) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const messageRef = doc(
        db,
        "users",
        user.uid,
        "projects",
        projectId,
        "messages",
        messageId,
      );
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Error deleting project message:", error);
      alert("Failed to delete message");
    }
  };

  const handleCancelEditProjectMessage = () => {
    setEditingProjectMessageId(null);
    setEditingProjectId(null);
    setEditProjectMessageText("");
  };

  // Helper function to render file attachment with payment gate
  const renderFileAttachment = (msg: Message, projectPaid: boolean = false) => {
    if (!msg.fileUrl) return null;

    const isImage = msg.fileType?.startsWith("image/");
    const isPDF = msg.fileType === "application/pdf";
    const isLocked = !projectPaid;

    return (
      <div
        className={`mt-3 p-3 rounded-lg border ${
          isLocked
            ? "bg-gray-100 dark:bg-slate-700 border-yellow-400"
            : "bg-white dark:bg-slate-600 border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">
            {isLocked ? "🔒" : isImage ? "🖼️" : isPDF ? "📄" : "📎"}
          </span>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
              {msg.fileName || "Attached file"}
            </p>
            <p className="text-xs text-gray-500">
              {msg.fileType || "Unknown type"}
            </p>
            {isLocked && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mt-1">
                💳 Payment required to download
              </p>
            )}
          </div>
          {!isLocked && (
            <a
              href={msg.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={msg.fileName}
              className="bg-blue-500 text-white text-sm py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Download
            </a>
          )}
        </div>

        {/* Locked overlay for images */}
        {isLocked && isImage && (
          <div className="mt-2 relative">
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg z-10">
              <div className="text-center text-white">
                <p className="text-2xl mb-2">🔒</p>
                <p className="text-sm font-semibold">Preview locked</p>
              </div>
            </div>
            <img
              src={msg.fileUrl}
              alt="Locked preview"
              className="max-w-full h-auto rounded-lg border border-gray-300 blur-md"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}

        {/* Image Preview (unlocked) */}
        {!isLocked && isImage && (
          <div className="mt-2">
            <img
              src={msg.fileUrl}
              alt={msg.fileName || "Design preview"}
              className="max-w-full h-auto rounded-lg border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(msg.fileUrl, "_blank")}
              style={{ maxHeight: "400px" }}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Click to view full size
            </p>
          </div>
        )}

        {/* PDF Preview Info */}
        {isPDF && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-slate-700 rounded text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isLocked
                ? "🔒 PDF locked - Payment required"
                : "PDF document - Click download to view"}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Payment Success/Cancel Notification */}
        {paymentNotification.type && (
          <div
            className={`mb-6 p-4 rounded-lg border-2 ${
              paymentNotification.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-yellow-50 border-yellow-500 text-yellow-800"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {paymentNotification.type === "success" ? "✅" : "⚠️"}
                </span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {paymentNotification.type === "success"
                      ? "Payment Successful!"
                      : "Payment Cancelled"}
                  </h3>
                  <p className="text-sm">
                    {paymentNotification.type === "success"
                      ? "Your files are now unlocked and ready to download. Check the project below!"
                      : "Payment was cancelled. You can try again whenever you're ready."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPaymentNotification({ type: null })}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* User Info Section */}
        <div className="bg-slate-100 dark:bg-slate-500 p-6 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="space-y-2">
            <div>
              <strong>Email:</strong> {userData?.email || user.email}
            </div>
            <div>
              <strong>Display Name:</strong>{" "}
              {userData?.displayName || "Not set"}
            </div>
            <div>
              <strong>Member Since:</strong>{" "}
              {userData?.createdAt
                ? new Date(
                    userData.createdAt.seconds * 1000,
                  ).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <section className="mb-6">
          <div className="bg-slate-300 text-black p-4 rounded">
            <h2 className="text-xl">
              Welcome {user.displayName || user.email}!
            </h2>
          </div>
        </section>

        {/* Projects Section */}
        <section className="border border-gray-300 p-6 rounded-lg mb-6 dark:bg-slate-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Your Projects</h3>
            <button
              onClick={() => setShowProjectForm(!showProjectForm)}
              className="bg-purple-500 text-white font-semibold py-2 px-4 rounded hover:bg-purple-600"
            >
              {showProjectForm ? "Cancel" : "+ New Project"}
            </button>
          </div>

          {/* Project Creation Form */}
          {showProjectForm && (
            <form
              onSubmit={handleCreateProject}
              className="mb-6 p-4 bg-purple-50 rounded-lg"
            >
              <div className="mb-4">
                <label
                  htmlFor="projectTitle"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Project Title
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded p-3 text-gray-700 bg-white"
                  placeholder="e.g., Website Redesign"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="projectDescription"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded p-3 text-gray-700 bg-white"
                  rows={4}
                  placeholder="Describe your project..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={creatingProject}
                className="bg-purple-500 text-white font-semibold py-2 px-6 rounded hover:bg-purple-600 disabled:bg-gray-400"
              >
                {creatingProject ? "Creating..." : "Create Project"}
              </button>
            </form>
          )}

          {/* Projects List */}
          {projectsLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No projects yet. Create your first project!
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                const hasFiles = projectHasFiles(project.id);
                const isPaid = project.paid || false;

                return (
                  <div
                    key={project.id}
                    className={`border rounded-lg p-4 ${
                      isPaid
                        ? "bg-green-50 border-green-300"
                        : hasFiles
                          ? "bg-yellow-50 border-yellow-300"
                          : "bg-purple-50 border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {project.title}
                          </h4>
                          {isPaid && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                              ✓ PAID
                            </span>
                          )}
                          {!isPaid && hasFiles && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                              🔒 PAYMENT REQUIRED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Created:{" "}
                          {project.createdAt
                            ? new Date(
                                project.createdAt.seconds * 1000,
                              ).toLocaleDateString()
                            : "Just now"}
                        </p>
                        {project.paymentDate && (
                          <p className="text-xs text-green-600 mt-1">
                            Paid:{" "}
                            {new Date(
                              project.paymentDate.seconds * 1000,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Payment Button */}
                    {!isPaid && hasFiles && (
                      <Form
                        method="post"
                        action="/create-checkout-session"
                        className="inline"
                      >
                        <input
                          type="hidden"
                          name="amount"
                          value={project.price || 500}
                        />
                        <input type="hidden" name="userId" value={user.uid} />
                        <input
                          type="hidden"
                          name="projectId"
                          value={project.id}
                        />
                        <input
                          type="hidden"
                          name="projectTitle"
                          value={project.title}
                        />
                        <input
                          type="hidden"
                          name="userEmail"
                          value={user.email || ""}
                        />
                        <button
                          type="submit"
                          className="mt-3 bg-green-600 text-white font-semibold py-2 px-6 rounded hover:bg-green-700 mr-3"
                        >
                          💳 Pay £{((project.price || 500) / 100).toFixed(2)} to
                          Download Files
                        </button>
                      </Form>
                    )}

                    <button
                      onClick={() => toggleProjectMessages(project.id)}
                      className="mt-3 bg-purple-500 text-white text-sm py-2 px-4 rounded hover:bg-purple-600"
                    >
                      {expandedProjectId === project.id
                        ? "Hide Messages"
                        : "View Messages"}
                    </button>

                    {/* Project Messages Section */}
                    {expandedProjectId === project.id && (
                      <div className="mt-4 p-4 rounded-lg border border-purple-200">
                        <h5 className="font-semibold text-gray-700 mb-3">
                          Project Messages
                        </h5>

                        {/* Project Message Form */}
                        <form
                          onSubmit={(e) =>
                            handleProjectMessageSubmit(e, project.id)
                          }
                          className="mb-4"
                        >
                          <textarea
                            value={projectMessageText[project.id] || ""}
                            onChange={(e) =>
                              setProjectMessageText({
                                ...projectMessageText,
                                [project.id]: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded p-3 text-gray-700 bg-white dark:bg-slate-500 dark:text-white mb-2"
                            rows={3}
                            placeholder="Send a message about this project..."
                            required
                          />
                          <button
                            type="submit"
                            disabled={projectMessageSubmitting[project.id]}
                            className="bg-purple-500 text-white text-sm py-2 px-4 rounded hover:bg-purple-600 disabled:bg-gray-400"
                          >
                            {projectMessageSubmitting[project.id]
                              ? "Sending..."
                              : "Send Message"}
                          </button>
                        </form>

                        {/* Project Messages List */}
                        {projectMessagesLoading[project.id] ? (
                          <div className="text-center py-4 text-gray-500">
                            Loading messages...
                          </div>
                        ) : !projectMessages[project.id] ||
                          projectMessages[project.id].length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            No messages yet for this project.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {projectMessages[project.id].map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg ${
                                  msg.sender === "customer"
                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                    : "bg-green-50 border-l-4 border-green-500"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-sm">
                                    {msg.sender === "customer"
                                      ? "You"
                                      : "Designer"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {msg.createdAt
                                      ? new Date(
                                          msg.createdAt.seconds * 1000,
                                        ).toLocaleString()
                                      : "Just now"}
                                  </span>
                                </div>

                                {/* Edit mode for project messages */}
                                {editingProjectMessageId === msg.id &&
                                editingProjectId === project.id ? (
                                  <div className="mt-2">
                                    <textarea
                                      value={editProjectMessageText}
                                      onChange={(e) =>
                                        setEditProjectMessageText(
                                          e.target.value,
                                        )
                                      }
                                      className="w-full border border-gray-300 rounded p-2 text-gray-700 bg-white mb-2"
                                      rows={3}
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleUpdateProjectMessage(
                                            msg.id,
                                            project.id,
                                          )
                                        }
                                        className="bg-green-500 text-white text-sm py-1 px-3 rounded hover:bg-green-600"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={handleCancelEditProjectMessage}
                                        className="bg-gray-500 text-white text-sm py-1 px-3 rounded hover:bg-gray-600"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {msg.text && (
                                      <p className="text-gray-800">
                                        {msg.text}
                                      </p>
                                    )}

                                    {/* File Attachment with Payment Gate */}
                                    {renderFileAttachment(msg, isPaid)}

                                    {msg.sender === "customer" && (
                                      <div className="flex gap-2 mt-2">
                                        <button
                                          onClick={() =>
                                            handleEditProjectMessage(
                                              msg,
                                              project.id,
                                            )
                                          }
                                          className="bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteProjectMessage(
                                              msg.id,
                                              project.id,
                                            )
                                          }
                                          className="bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* General Message Form */}
        <section className="border border-gray-300 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Send a General Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 bg-white dark:bg-slate-400"
                rows={5}
                placeholder="Type your message here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white font-semibold py-2 px-6 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        {/* General Messages Section */}
        <section className="border border-gray-300 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">General Messages</h3>

          {messagesLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages yet. Send your first message above!
            </div>
          ) : (
            <div className="grid gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg ${
                    msg.sender === "customer"
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "bg-green-50 border-l-4 border-green-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">
                      {msg.sender === "customer" ? "You" : "Designer"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {msg.createdAt
                        ? new Date(
                            msg.createdAt.seconds * 1000,
                          ).toLocaleString()
                        : "Just now"}
                    </span>
                  </div>

                  {/* editing */}
                  {editingId === msg.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full border border-gray-500 rounded p-2 text-grey-700 mb-2"
                        rows={3}
                      ></textarea>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(msg.id)}
                          className="bg-green-500 text-white text-sm py-1 px-3 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white text-sm py-1 px-3 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {msg.text && <p className="text-gray-800">{msg.text}</p>}

                      {/* File Attachment - General messages always unlocked */}
                      {renderFileAttachment(msg, true)}

                      {/* only edit own messages */}
                      {msg.sender === "customer" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(msg)}
                            className="bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
