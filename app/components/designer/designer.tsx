import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "~/firebase/firebaseConfig";
import type { AuthUser } from "~/types/authUser";

/* =======================
   Types
======================= */

interface UserData {
  id: string;
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
}

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
}

interface ProjectWithMessages {
  project: Project;
  messages: Message[];
}

interface UserWithData {
  user: UserData;
  generalMessages: Message[];
  projects: ProjectWithMessages[];
}

interface DesignerDashboardProps {
  user: AuthUser;
}

/* =======================
   Component
======================= */

export default function DesignerDashboard({ user }: DesignerDashboardProps) {
  const [usersData, setUsersData] = useState<UserWithData[]>([]);
  const [loading, setLoading] = useState(true);

  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [projectReplyText, setProjectReplyText] = useState<
    Record<string, string>
  >({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    const init = async () => {
      /* =======================
         Load users + projects ONCE
      ======================= */

      const usersSnap = await getDocs(collection(db, "users"));
      const initialUsers: UserWithData[] = [];

      for (const userDoc of usersSnap.docs) {
        const userData = { id: userDoc.id, ...userDoc.data() } as UserData;
        if (userData.role === "designer") continue;

        /* ---------- Projects ---------- */
        const projectsSnap = await getDocs(
          query(
            collection(db, "users", userDoc.id, "projects"),
            orderBy("createdAt", "desc")
          )
        );

        const projects: ProjectWithMessages[] = projectsSnap.docs.map(
          (doc) => ({
            project: { id: doc.id, ...doc.data() } as Project,
            messages: [],
          })
        );

        initialUsers.push({
          user: userData,
          generalMessages: [],
          projects,
        });
      }

      setUsersData(initialUsers);
      setLoading(false);

      /* =======================
         Attach LIVE listeners
      ======================= */

      for (const u of initialUsers) {
        /* ---------- General Messages ---------- */
        const generalQuery = query(
          collection(db, "users", u.user.id, "messages"),
          orderBy("createdAt", "desc")
        );

        unsubscribes.push(
          onSnapshot(generalQuery, (snap) => {
            const messages = snap.docs.map(
              (d) => ({ id: d.id, ...d.data() }) as Message
            );

            setUsersData((prev) =>
              prev.map((x) =>
                x.user.id === u.user.id
                  ? { ...x, generalMessages: messages }
                  : x
              )
            );
          })
        );

        /* ---------- Project Messages ---------- */
        for (const p of u.projects) {
          const projectQuery = query(
            collection(
              db,
              "users",
              u.user.id,
              "projects",
              p.project.id,
              "messages"
            ),
            orderBy("createdAt", "desc")
          );

          unsubscribes.push(
            onSnapshot(projectQuery, (snap) => {
              const messages = snap.docs.map(
                (d) => ({ id: d.id, ...d.data() }) as Message
              );

              setUsersData((prev) =>
                prev.map((x) =>
                  x.user.id !== u.user.id
                    ? x
                    : {
                        ...x,
                        projects: x.projects.map((proj) =>
                          proj.project.id === p.project.id
                            ? { ...proj, messages }
                            : proj
                        ),
                      }
                )
              );
            })
          );
        }
      }
    };

    init();

    return () => unsubscribes.forEach((u) => u());
  }, []);

  /* =======================
     Send Messages
  ======================= */

  const sendGeneralReply = async (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    const text = replyText[userId]?.trim();
    if (!text) return;

    setSubmitting((s) => ({ ...s, [userId]: true }));

    await addDoc(collection(db, "users", userId, "messages"), {
      text,
      sender: "designer",
      createdAt: serverTimestamp(),
      read: false,
    });

    setReplyText((t) => ({ ...t, [userId]: "" }));
    setSubmitting((s) => ({ ...s, [userId]: false }));
  };

  const sendProjectReply = async (
    e: React.FormEvent,
    userId: string,
    projectId: string
  ) => {
    e.preventDefault();
    const text = projectReplyText[projectId]?.trim();
    if (!text) return;

    setSubmitting((s) => ({ ...s, [projectId]: true }));

    await addDoc(
      collection(db, "users", userId, "projects", projectId, "messages"),
      {
        text,
        sender: "designer",
        createdAt: serverTimestamp(),
        read: false,
      }
    );

    setProjectReplyText((t) => ({ ...t, [projectId]: "" }));
    setSubmitting((s) => ({ ...s, [projectId]: false }));
  };

  /* =======================
     Render
  ======================= */

  if (loading) return <div className="p-6">Loading designer dashboard…</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Designer Dashboard</h1>

      {usersData.map(({ user, generalMessages, projects }) => (
        <div key={user.id} className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold">
            {user.displayName || user.email}
          </h2>

          {/* -------- General Messages -------- */}
          <section className="mt-4">
            <h3 className="font-semibold mb-2">General Messages</h3>

            {generalMessages.map((m) => (
              <div key={m.id} className="p-2 bg-gray-100 rounded mb-2">
                <strong>{m.sender}:</strong> {m.text}
              </div>
            ))}

            <form onSubmit={(e) => sendGeneralReply(e, user.id)}>
              <textarea
                className="w-full border p-2 mt-2"
                value={replyText[user.id] || ""}
                onChange={(e) =>
                  setReplyText({ ...replyText, [user.id]: e.target.value })
                }
                placeholder="Reply..."
              />
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
                Send
              </button>
            </form>
          </section>

          {/* -------- Projects -------- */}
          <section className="mt-6">
            <h3 className="font-semibold mb-2">Projects</h3>

            {projects.map(({ project, messages }) => (
              <div key={project.id} className="border rounded p-4 mb-4">
                <h4 className="font-semibold">{project.title}</h4>

                {messages.map((m) => (
                  <div key={m.id} className="p-2 bg-gray-100 rounded mb-2">
                    <strong>{m.sender}:</strong> {m.text}
                  </div>
                ))}

                <form
                  onSubmit={(e) => sendProjectReply(e, user.id, project.id)}
                >
                  <textarea
                    className="w-full border p-2 mt-2"
                    value={projectReplyText[project.id] || ""}
                    onChange={(e) =>
                      setProjectReplyText({
                        ...projectReplyText,
                        [project.id]: e.target.value,
                      })
                    }
                    placeholder="Reply to project..."
                  />
                  <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
                    Send
                  </button>
                </form>
              </div>
            ))}
          </section>
        </div>
      ))}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   Timestamp,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";
// import type { AuthUser } from "~/types/authUser";

// /* =======================
//    Interfaces
// ======================= */

// interface UserData {
//   id: string;
//   email: string;
//   displayName: string | null;
//   createdAt: Timestamp;
//   role?: string;
// }

// interface Message {
//   id: string;
//   text: string;
//   sender: "customer" | "designer";
//   createdAt: Timestamp;
//   read: boolean;
// }

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: Timestamp;
// }

// interface ProjectWithMessages {
//   project: Project;
//   messages: Message[];
// }

// interface UserWithData {
//   user: UserData;
//   generalMessages: Message[];
//   projects: ProjectWithMessages[];
// }

// interface DesignerDashboardProps {
//   user: AuthUser;
// }

// /* =======================
//    Component
// ======================= */

// export default function DesignerDashboard({ user }: DesignerDashboardProps) {
//   const [usersData, setUsersData] = useState<UserWithData[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
//   const [projectReplyText, setProjectReplyText] = useState<{
//     [key: string]: string;
//   }>({});
//   const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});

//   /* =======================
//      Fetch Users + Messages + Projects
//   ======================= */

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const usersSnap = await getDocs(collection(db, "users"));
//         const result: UserWithData[] = [];

//         for (const userDoc of usersSnap.docs) {
//           const userData = {
//             id: userDoc.id,
//             ...userDoc.data(),
//           } as UserData;

//           if (userData.role === "designer") continue;

//           /* -------- General Messages -------- */
//           const generalMessagesSnap = await getDocs(
//             query(
//               collection(db, "users", userDoc.id, "messages"),
//               orderBy("createdAt", "desc")
//             )
//           );

//           const generalMessages: Message[] = [];
//           generalMessagesSnap.forEach((doc) =>
//             generalMessages.push({
//               id: doc.id,
//               ...doc.data(),
//             } as Message)
//           );

//           /* -------- Projects -------- */
//           const projectsSnap = await getDocs(
//             query(
//               collection(db, "users", userDoc.id, "projects"),
//               orderBy("createdAt", "desc")
//             )
//           );

//           const projects: ProjectWithMessages[] = [];

//           for (const projectDoc of projectsSnap.docs) {
//             const project = {
//               id: projectDoc.id,
//               ...projectDoc.data(),
//             } as Project;

//             const messagesSnap = await getDocs(
//               query(
//                 collection(
//                   db,
//                   "users",
//                   userDoc.id,
//                   "projects",
//                   projectDoc.id,
//                   "messages"
//                 ),
//                 orderBy("createdAt", "desc")
//               )
//             );

//             const messages: Message[] = [];
//             messagesSnap.forEach((msgDoc) =>
//               messages.push({
//                 id: msgDoc.id,
//                 ...msgDoc.data(),
//               } as Message)
//             );

//             projects.push({ project, messages });
//           }

//           result.push({
//             user: userData,
//             generalMessages,
//             projects,
//           });
//         }

//         setUsersData(result);
//       } catch (err) {
//         console.error("Designer fetch failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   /* =======================
//      Send Replies
//   ======================= */

//   const sendGeneralReply = async (
//     e: React.FormEvent<HTMLFormElement>,
//     userId: string
//   ) => {
//     e.preventDefault();
//     const text = replyText[userId]?.trim();
//     if (!text) return;

//     setSubmitting({ ...submitting, [userId]: true });

//     await addDoc(collection(db, "users", userId, "messages"), {
//       text,
//       sender: "designer",
//       createdAt: serverTimestamp(),
//       read: false,
//     });

//     setReplyText({ ...replyText, [userId]: "" });
//     setSubmitting({ ...submitting, [userId]: false });
//   };

//   const sendProjectReply = async (
//     e: React.FormEvent<HTMLFormElement>,
//     userId: string,
//     projectId: string
//   ) => {
//     e.preventDefault();
//     const text = projectReplyText[projectId]?.trim();
//     if (!text) return;

//     setSubmitting({ ...submitting, [projectId]: true });

//     await addDoc(
//       collection(db, "users", userId, "projects", projectId, "messages"),
//       {
//         text,
//         sender: "designer",
//         createdAt: serverTimestamp(),
//         read: false,
//       }
//     );

//     setProjectReplyText({ ...projectReplyText, [projectId]: "" });
//     setSubmitting({ ...submitting, [projectId]: false });
//   };

//   /* =======================
//      Render
//   ======================= */

//   if (loading) {
//     return <div className="p-6">Loading designer dashboard…</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Designer Dashboard</h1>

//         <div className="space-y-10">
//           {usersData.map(({ user, generalMessages, projects }) => (
//             <div
//               key={user.id}
//               className="border border-gray-300 rounded-lg p-6"
//             >
//               {/* User Header */}
//               <div className="mb-6 border-b pb-3">
//                 <h2 className="text-xl font-semibold">
//                   {user.displayName || user.email}
//                 </h2>
//                 <p className="text-sm text-gray-500">{user.email}</p>
//               </div>

//               {/* ================= GENERAL MESSAGES ================= */}
//               <section className="mb-8">
//                 <h3 className="font-semibold mb-3">General Messages</h3>

//                 {generalMessages.length === 0 ? (
//                   <p className="text-gray-500 italic">No general messages</p>
//                 ) : (
//                   <div className="space-y-3 mb-4">
//                     {generalMessages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`p-3 rounded-lg ${
//                           msg.sender === "customer"
//                             ? "bg-blue-50 border-l-4 border-blue-500"
//                             : "bg-green-50 border-l-4 border-green-500"
//                         }`}
//                       >
//                         <p className="text-sm">{msg.text}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <form onSubmit={(e) => sendGeneralReply(e, user.id)}>
//                   <textarea
//                     value={replyText[user.id] || ""}
//                     onChange={(e) =>
//                       setReplyText({ ...replyText, [user.id]: e.target.value })
//                     }
//                     rows={2}
//                     className="w-full border rounded p-2 mb-2"
//                     placeholder="Reply to general message..."
//                     required
//                   />
//                   <button
//                     type="submit"
//                     disabled={submitting[user.id]}
//                     className="bg-green-500 text-white text-sm px-4 py-2 rounded"
//                   >
//                     Send Reply
//                   </button>
//                 </form>
//               </section>

//               {/* ================= PROJECTS ================= */}
//               <section>
//                 <h3 className="font-semibold mb-3">Projects</h3>

//                 {projects.length === 0 ? (
//                   <p className="text-gray-500 italic">No projects</p>
//                 ) : (
//                   <div className="space-y-6">
//                     {projects.map(({ project, messages }) => (
//                       <div
//                         key={project.id}
//                         className="bg-purple-50 border border-purple-300 rounded-lg p-4"
//                       >
//                         <h4 className="font-semibold">{project.title}</h4>
//                         <p className="text-sm text-gray-600 mb-3">
//                           {project.description}
//                         </p>

//                         <div className="space-y-3 mb-4">
//                           {messages.map((msg) => (
//                             <div
//                               key={msg.id}
//                               className={`p-3 rounded-lg ${
//                                 msg.sender === "customer"
//                                   ? "bg-blue-50 border-l-4 border-blue-500"
//                                   : "bg-green-50 border-l-4 border-green-500"
//                               }`}
//                             >
//                               <p className="text-sm">{msg.text}</p>
//                             </div>
//                           ))}
//                         </div>

//                         <form
//                           onSubmit={(e) =>
//                             sendProjectReply(e, user.id, project.id)
//                           }
//                         >
//                           <textarea
//                             value={projectReplyText[project.id] || ""}
//                             onChange={(e) =>
//                               setProjectReplyText({
//                                 ...projectReplyText,
//                                 [project.id]: e.target.value,
//                               })
//                             }
//                             rows={2}
//                             className="w-full border rounded p-2 mb-2"
//                             placeholder="Reply to project..."
//                             required
//                           />
//                           <button
//                             type="submit"
//                             disabled={submitting[project.id]}
//                             className="bg-green-500 text-white text-sm px-4 py-2 rounded"
//                           >
//                             Send Project Reply
//                           </button>
//                         </form>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </section>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // app/components/designer/designer.tsx
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   Timestamp,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";
// import type { AuthUser } from "~/types/authUser";

// /* =======================
//    Interfaces
// ======================= */

// interface UserData {
//   id: string;
//   email: string;
//   displayName: string | null;
//   createdAt: Timestamp;
//   role?: string;
// }

// interface Message {
//   id: string;
//   text: string;
//   sender: "customer" | "designer";
//   createdAt: Timestamp;
//   read: boolean;
// }

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: Timestamp;
// }

// interface ProjectWithMessages {
//   project: Project;
//   messages: Message[];
// }

// interface UserWithProjects {
//   user: UserData;
//   projects: ProjectWithMessages[];
// }

// interface DesignerDashboardProps {
//   user: AuthUser;
// }

// /* =======================
//    Component
// ======================= */

// export default function DesignerDashboard({ user }: DesignerDashboardProps) {
//   const [usersWithProjects, setUsersWithProjects] = useState<
//     UserWithProjects[]
//   >([]);
//   const [loading, setLoading] = useState(true);

//   // Reply state per project
//   const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
//   const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});

//   /* =======================
//      Fetch Users → Projects → Messages
//   ======================= */

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const usersSnap = await getDocs(collection(db, "users"));
//         const results: UserWithProjects[] = [];

//         for (const userDoc of usersSnap.docs) {
//           const userData = {
//             id: userDoc.id,
//             ...userDoc.data(),
//           } as UserData;

//           // Skip designers
//           if (userData.role === "designer") continue;

//           const projectsSnap = await getDocs(
//             query(
//               collection(db, "users", userDoc.id, "projects"),
//               orderBy("createdAt", "desc")
//             )
//           );

//           const projects: ProjectWithMessages[] = [];

//           for (const projectDoc of projectsSnap.docs) {
//             const project = {
//               id: projectDoc.id,
//               ...projectDoc.data(),
//             } as Project;

//             const messagesSnap = await getDocs(
//               query(
//                 collection(
//                   db,
//                   "users",
//                   userDoc.id,
//                   "projects",
//                   projectDoc.id,
//                   "messages"
//                 ),
//                 orderBy("createdAt", "desc")
//               )
//             );

//             const messages: Message[] = [];
//             messagesSnap.forEach((msgDoc) => {
//               messages.push({
//                 id: msgDoc.id,
//                 ...msgDoc.data(),
//               } as Message);
//             });

//             projects.push({ project, messages });
//           }

//           results.push({ user: userData, projects });
//         }

//         setUsersWithProjects(results);
//       } catch (err) {
//         console.error("Failed to load designer data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   /* =======================
//      Reply to Project
//   ======================= */

//   const handleReply = async (
//     e: React.FormEvent<HTMLFormElement>,
//     customerId: string,
//     projectId: string
//   ) => {
//     e.preventDefault();

//     const text = replyText[projectId]?.trim();
//     if (!text) return;

//     setSubmitting({ ...submitting, [projectId]: true });

//     try {
//       await addDoc(
//         collection(db, "users", customerId, "projects", projectId, "messages"),
//         {
//           text,
//           sender: "designer",
//           createdAt: serverTimestamp(),
//           read: false,
//         }
//       );

//       setReplyText({ ...replyText, [projectId]: "" });
//     } catch (err) {
//       console.error("Failed to send message:", err);
//       alert("Failed to send message");
//     } finally {
//       setSubmitting({ ...submitting, [projectId]: false });
//     }
//   };

//   /* =======================
//      Render
//   ======================= */

//   if (loading) {
//     return <div className="p-6">Loading designer dashboard…</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-2">Designer Dashboard</h1>
//         <p className="text-gray-600 mb-8">
//           Welcome, {user.displayName || user.email}
//         </p>

//         {usersWithProjects.length === 0 ? (
//           <p className="text-gray-500">No users or projects yet.</p>
//         ) : (
//           <div className="space-y-8">
//             {usersWithProjects.map(({ user: customer, projects }) => (
//               <div
//                 key={customer.id}
//                 className="border border-gray-300 rounded-lg p-6"
//               >
//                 {/* Customer Header */}
//                 <div className="mb-4 border-b pb-3">
//                   <h2 className="text-xl font-semibold">
//                     {customer.displayName || customer.email}
//                   </h2>
//                   <p className="text-sm text-gray-500">{customer.email}</p>
//                 </div>

//                 {/* Projects */}
//                 {projects.length === 0 ? (
//                   <p className="text-gray-500 italic">
//                     No projects for this user.
//                   </p>
//                 ) : (
//                   <div className="space-y-6">
//                     {projects.map(({ project, messages }) => (
//                       <div
//                         key={project.id}
//                         className="bg-purple-50 border border-purple-300 rounded-lg p-4"
//                       >
//                         <h3 className="text-lg font-semibold">
//                           {project.title}
//                         </h3>
//                         <p className="text-sm text-gray-600 mb-3">
//                           {project.description}
//                         </p>

//                         {/* Messages */}
//                         <div className="space-y-3 mb-4">
//                           {messages.length === 0 ? (
//                             <p className="text-sm text-gray-500">
//                               No messages yet.
//                             </p>
//                           ) : (
//                             messages.map((msg) => (
//                               <div
//                                 key={msg.id}
//                                 className={`p-3 rounded-lg ${
//                                   msg.sender === "customer"
//                                     ? "bg-blue-50 border-l-4 border-blue-500"
//                                     : "bg-green-50 border-l-4 border-green-500"
//                                 }`}
//                               >
//                                 <div className="flex justify-between text-xs text-gray-500 mb-1">
//                                   <span>
//                                     {msg.sender === "customer"
//                                       ? "Customer"
//                                       : "Designer"}
//                                   </span>
//                                   <span>
//                                     {msg.createdAt
//                                       ? new Date(
//                                           msg.createdAt.seconds * 1000
//                                         ).toLocaleString()
//                                       : "Just now"}
//                                   </span>
//                                 </div>
//                                 <p>{msg.text}</p>
//                               </div>
//                             ))
//                           )}
//                         </div>

//                         {/* Reply Form */}
//                         <form
//                           onSubmit={(e) =>
//                             handleReply(e, customer.id, project.id)
//                           }
//                           className="bg-white border rounded p-3"
//                         >
//                           <textarea
//                             value={replyText[project.id] || ""}
//                             onChange={(e) =>
//                               setReplyText({
//                                 ...replyText,
//                                 [project.id]: e.target.value,
//                               })
//                             }
//                             rows={2}
//                             className="w-full border rounded p-2 mb-2"
//                             placeholder="Reply to this project..."
//                             required
//                           />
//                           <button
//                             type="submit"
//                             disabled={submitting[project.id]}
//                             className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
//                           >
//                             {submitting[project.id] ? "Sending…" : "Send Reply"}
//                           </button>
//                         </form>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // app/components/designer/designer.tsx
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   Timestamp,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";
// import type { AuthUser } from "~/types/authUser";

// interface UserData {
//   id: string;
//   email: string;
//   displayName: string | null;
//   createdAt: Timestamp;
//   role?: string;
// }

// interface Message {
//   id: string;
//   text: string;
//   sender: "customer" | "designer";
//   createdAt: Timestamp;
//   read: boolean;
// }

// interface UserWithMessages {
//   user: UserData;
//   messages: Message[];
// }

// interface DesignerDashboardProps {
//   user: AuthUser;
// }

// export default function DesignerDashboard({ user }: DesignerDashboardProps) {
//   const [usersWithMessages, setUsersWithMessages] = useState<
//     UserWithMessages[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
//   const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editText, setEditText] = useState("");
//   const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
//     null
//   );

//   useEffect(() => {
//     const fetchAllUsersAndMessages = async () => {
//       try {
//         // Get all users
//         const usersSnapshot = await getDocs(collection(db, "users"));
//         const usersData: UserWithMessages[] = [];

//         // For each user, get their messages
//         for (const userDoc of usersSnapshot.docs) {
//           const userData = {
//             id: userDoc.id,
//             ...userDoc.data(),
//           } as UserData;

//           // Skip designers
//           if (userData.role === "designer") continue;

//           // Get messages for this user
//           const messagesRef = collection(db, "users", userDoc.id, "messages");
//           const messagesQuery = query(
//             messagesRef,
//             orderBy("createdAt", "desc")
//           );
//           const messagesSnapshot = await getDocs(messagesQuery);

//           const messages: Message[] = [];
//           messagesSnapshot.forEach((msgDoc) => {
//             messages.push({
//               id: msgDoc.id,
//               ...msgDoc.data(),
//             } as Message);
//           });

//           usersData.push({
//             user: userData,
//             messages: messages,
//           });
//         }

//         setUsersWithMessages(usersData);
//       } catch (error) {
//         console.error("Error fetching users and messages:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllUsersAndMessages();
//   }, []);

//   const handleReplySubmit = async (
//     e: React.FormEvent<HTMLFormElement>,
//     customerId: string
//   ) => {
//     e.preventDefault();
//     const reply = replyText[customerId]?.trim();
//     if (!reply) return;

//     setSubmitting({ ...submitting, [customerId]: true });
//     try {
//       await addDoc(collection(db, "users", customerId, "messages"), {
//         text: reply,
//         sender: "designer",
//         createdAt: serverTimestamp(),
//         read: false,
//       });

//       // Clear the reply text for this customer
//       setReplyText({ ...replyText, [customerId]: "" });

//       // Refresh messages
//       const messagesRef = collection(db, "users", customerId, "messages");
//       const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
//       const messagesSnapshot = await getDocs(messagesQuery);

//       const messages: Message[] = [];
//       messagesSnapshot.forEach((msgDoc) => {
//         messages.push({
//           id: msgDoc.id,
//           ...msgDoc.data(),
//         } as Message);
//       });

//       // Update the messages for this specific customer
//       setUsersWithMessages((prev) =>
//         prev.map((item) =>
//           item.user.id === customerId ? { ...item, messages } : item
//         )
//       );
//     } catch (error) {
//       console.error("Error sending reply:", error);
//       alert("Failed to send reply");
//     } finally {
//       setSubmitting({ ...submitting, [customerId]: false });
//     }
//   };

//   // Handle edit message
//   const handleEdit = (msg: Message, customerId: string) => {
//     setEditingId(msg.id);
//     setEditText(msg.text);
//     setEditingCustomerId(customerId);
//   };

//   // Handle update message
//   const handleUpdate = async (messageId: string, customerId: string) => {
//     if (!editText.trim()) return;

//     try {
//       const messageRef = doc(db, "users", customerId, "messages", messageId);
//       await updateDoc(messageRef, {
//         text: editText,
//       });

//       // Refresh messages for this customer
//       const messagesRef = collection(db, "users", customerId, "messages");
//       const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
//       const messagesSnapshot = await getDocs(messagesQuery);

//       const messages: Message[] = [];
//       messagesSnapshot.forEach((msgDoc) => {
//         messages.push({
//           id: msgDoc.id,
//           ...msgDoc.data(),
//         } as Message);
//       });

//       // Update the messages for this specific customer
//       setUsersWithMessages((prev) =>
//         prev.map((item) =>
//           item.user.id === customerId ? { ...item, messages } : item
//         )
//       );

//       setEditingId(null);
//       setEditText("");
//       setEditingCustomerId(null);
//     } catch (error) {
//       console.error("Error updating message:", error);
//       alert("Failed to update message");
//     }
//   };

//   // Handle delete message
//   const handleDelete = async (messageId: string, customerId: string) => {
//     if (!confirm("Are you sure you want to delete this message?")) return;

//     try {
//       const messageRef = doc(db, "users", customerId, "messages", messageId);
//       await deleteDoc(messageRef);

//       // Refresh messages for this customer
//       const messagesRef = collection(db, "users", customerId, "messages");
//       const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
//       const messagesSnapshot = await getDocs(messagesQuery);

//       const messages: Message[] = [];
//       messagesSnapshot.forEach((msgDoc) => {
//         messages.push({
//           id: msgDoc.id,
//           ...msgDoc.data(),
//         } as Message);
//       });

//       // Update the messages for this specific customer
//       setUsersWithMessages((prev) =>
//         prev.map((item) =>
//           item.user.id === customerId ? { ...item, messages } : item
//         )
//       );
//     } catch (error) {
//       console.error("Error deleting message:", error);
//       alert("Failed to delete message");
//     }
//   };

//   // Cancel editing
//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditText("");
//     setEditingCustomerId(null);
//   };

//   if (loading) {
//     return <div className="p-6">Loading all users and messages...</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Designer Dashboard</h1>
//         <p className="text-gray-600 mb-8">
//           Welcome, {user.displayName || user.email}!
//         </p>

//         {usersWithMessages.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             No users with messages yet.
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {usersWithMessages.map(({ user: customer, messages }) => (
//               <div
//                 key={customer.id}
//                 className="bg-white border border-gray-300 rounded-lg p-6"
//               >
//                 {/* User Header */}
//                 <div className="mb-4 pb-4 border-b">
//                   <h2 className="text-xl font-semibold">
//                     {customer.displayName || customer.email}
//                   </h2>
//                   <p className="text-sm text-gray-500">{customer.email}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Member since:{" "}
//                     {customer.createdAt
//                       ? new Date(
//                           customer.createdAt.seconds * 1000
//                         ).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                 </div>

//                 {/* Messages */}
//                 {messages.length === 0 ? (
//                   <p className="text-gray-500 italic mb-4">No messages yet</p>
//                 ) : (
//                   <div className="space-y-3 mb-4">
//                     <h3 className="font-semibold text-gray-700">
//                       Messages ({messages.length})
//                     </h3>
//                     {messages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`p-4 rounded-lg ${
//                           msg.sender === "customer"
//                             ? "bg-blue-50 border-l-4 border-blue-500"
//                             : "bg-green-50 border-l-4 border-green-500"
//                         }`}
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <span className="font-semibold text-sm">
//                             {msg.sender === "customer"
//                               ? "Customer"
//                               : "Designer"}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {msg.createdAt
//                               ? new Date(
//                                   msg.createdAt.seconds * 1000
//                                 ).toLocaleString()
//                               : "Just now"}
//                           </span>
//                         </div>

//                         {/* Edit mode */}
//                         {editingId === msg.id ? (
//                           <div className="mt-2">
//                             <textarea
//                               value={editText}
//                               onChange={(e) => setEditText(e.target.value)}
//                               className="w-full border border-gray-300 rounded p-2 text-gray-700 bg-white mb-2"
//                               rows={3}
//                             />
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() =>
//                                   handleUpdate(msg.id, customer.id)
//                                 }
//                                 className="bg-green-500 text-white text-sm py-1 px-3 rounded hover:bg-green-600"
//                               >
//                                 Save
//                               </button>
//                               <button
//                                 onClick={handleCancelEdit}
//                                 className="bg-gray-500 text-white text-sm py-1 px-3 rounded hover:bg-gray-600"
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           </div>
//                         ) : (
//                           <>
//                             <p className="text-gray-800">{msg.text}</p>

//                             {/* Show edit/delete for designer's own messages */}
//                             {msg.sender === "designer" && (
//                               <div className="flex gap-2 mt-3">
//                                 <button
//                                   onClick={() => handleEdit(msg, customer.id)}
//                                   className="bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600"
//                                 >
//                                   Edit
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleDelete(msg.id, customer.id)
//                                   }
//                                   className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600"
//                                 >
//                                   Delete
//                                 </button>
//                               </div>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Reply Form */}
//                 <form
//                   onSubmit={(e) => handleReplySubmit(e, customer.id)}
//                   className="bg-gray-50 p-4 rounded-lg border border-gray-200"
//                 >
//                   <label
//                     htmlFor={`reply-${customer.id}`}
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Reply to {customer.displayName || customer.email}
//                   </label>
//                   <textarea
//                     id={`reply-${customer.id}`}
//                     value={replyText[customer.id] || ""}
//                     onChange={(e) =>
//                       setReplyText({
//                         ...replyText,
//                         [customer.id]: e.target.value,
//                       })
//                     }
//                     className="w-full border border-gray-300 rounded p-3 text-gray-700 bg-white mb-3"
//                     rows={3}
//                     placeholder="Type your reply here..."
//                     required
//                   />
//                   <button
//                     type="submit"
//                     disabled={submitting[customer.id]}
//                     className="bg-green-500 text-white font-semibold py-2 px-6 rounded hover:bg-green-600 disabled:bg-gray-400"
//                   >
//                     {submitting[customer.id] ? "Sending..." : "Send Reply"}
//                   </button>
//                 </form>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // app/components/designer/designer.tsx
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   Timestamp,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";
// import type { AuthUser } from "~/types/authUser";

// interface UserData {
//   id: string;
//   email: string;
//   displayName: string | null;
//   createdAt: Timestamp;
//   role?: string;
// }

// interface Message {
//   id: string;
//   text: string;
//   sender: "customer" | "designer";
//   createdAt: Timestamp;
//   read: boolean;
// }

// interface UserWithMessages {
//   user: UserData;
//   messages: Message[];
// }

// interface DesignerDashboardProps {
//   user: AuthUser;
// }

// export default function DesignerDashboard({ user }: DesignerDashboardProps) {
//   const [usersWithMessages, setUsersWithMessages] = useState<
//     UserWithMessages[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
//   const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});

//   useEffect(() => {
//     const fetchAllUsersAndMessages = async () => {
//       try {
//         // Get all users
//         const usersSnapshot = await getDocs(collection(db, "users"));
//         const usersData: UserWithMessages[] = [];

//         // For each user, get their messages
//         for (const userDoc of usersSnapshot.docs) {
//           const userData = {
//             id: userDoc.id,
//             ...userDoc.data(),
//           } as UserData;

//           // Skip designers
//           if (userData.role === "designer") continue;

//           // Get messages for this user
//           const messagesRef = collection(db, "users", userDoc.id, "messages");
//           const messagesQuery = query(
//             messagesRef,
//             orderBy("createdAt", "desc")
//           );
//           const messagesSnapshot = await getDocs(messagesQuery);

//           const messages: Message[] = [];
//           messagesSnapshot.forEach((msgDoc) => {
//             messages.push({
//               id: msgDoc.id,
//               ...msgDoc.data(),
//             } as Message);
//           });

//           usersData.push({
//             user: userData,
//             messages: messages,
//           });
//         }

//         setUsersWithMessages(usersData);
//       } catch (error) {
//         console.error("Error fetching users and messages:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllUsersAndMessages();
//   }, []);

//   const handleReplySubmit = async (
//     e: React.FormEvent<HTMLFormElement>,
//     customerId: string
//   ) => {
//     e.preventDefault();
//     const reply = replyText[customerId]?.trim();
//     if (!reply) return;

//     setSubmitting({ ...submitting, [customerId]: true });
//     try {
//       await addDoc(collection(db, "users", customerId, "messages"), {
//         text: reply,
//         sender: "designer",
//         createdAt: serverTimestamp(),
//         read: false,
//       });

//       // Clear the reply text for this customer
//       setReplyText({ ...replyText, [customerId]: "" });

//       // Refresh messages
//       const messagesRef = collection(db, "users", customerId, "messages");
//       const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
//       const messagesSnapshot = await getDocs(messagesQuery);

//       const messages: Message[] = [];
//       messagesSnapshot.forEach((msgDoc) => {
//         messages.push({
//           id: msgDoc.id,
//           ...msgDoc.data(),
//         } as Message);
//       });

//       // Update the messages for this specific customer
//       setUsersWithMessages((prev) =>
//         prev.map((item) =>
//           item.user.id === customerId ? { ...item, messages } : item
//         )
//       );
//     } catch (error) {
//       console.error("Error sending reply:", error);
//       alert("Failed to send reply");
//     } finally {
//       setSubmitting({ ...submitting, [customerId]: false });
//     }
//   };

//   if (loading) {
//     return <div className="p-6">Loading all users and messages...</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Designer Dashboard</h1>
//         <p className="text-gray-600 mb-8">
//           Welcome, {user.displayName || user.email}!
//         </p>

//         {usersWithMessages.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             No users with messages yet.
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {usersWithMessages.map(({ user: customer, messages }) => (
//               <div
//                 key={customer.id}
//                 className="bg-white border border-gray-300 rounded-lg p-6"
//               >
//                 {/* User Header */}
//                 <div className="mb-4 pb-4 border-b">
//                   <h2 className="text-xl font-semibold">
//                     {customer.displayName || customer.email}
//                   </h2>
//                   <p className="text-sm text-gray-500">{customer.email}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Member since:{" "}
//                     {customer.createdAt
//                       ? new Date(
//                           customer.createdAt.seconds * 1000
//                         ).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                 </div>

//                 {/* Messages */}
//                 {messages.length === 0 ? (
//                   <p className="text-gray-500 italic mb-4">No messages yet</p>
//                 ) : (
//                   <div className="space-y-3 mb-4">
//                     <h3 className="font-semibold text-gray-700">
//                       Messages ({messages.length})
//                     </h3>
//                     {messages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`p-4 rounded-lg ${
//                           msg.sender === "customer"
//                             ? "bg-blue-50 border-l-4 border-blue-500"
//                             : "bg-green-50 border-l-4 border-green-500"
//                         }`}
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <span className="font-semibold text-sm">
//                             {msg.sender === "customer"
//                               ? "Customer"
//                               : "Designer"}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {msg.createdAt
//                               ? new Date(
//                                   msg.createdAt.seconds * 1000
//                                 ).toLocaleString()
//                               : "Just now"}
//                           </span>
//                         </div>
//                         <p className="text-gray-800">{msg.text}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Reply Form */}
//                 <form
//                   onSubmit={(e) => handleReplySubmit(e, customer.id)}
//                   className="bg-gray-50 p-4 rounded-lg border border-gray-200"
//                 >
//                   <label
//                     htmlFor={`reply-${customer.id}`}
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Reply to {customer.displayName || customer.email}
//                   </label>
//                   <textarea
//                     id={`reply-${customer.id}`}
//                     value={replyText[customer.id] || ""}
//                     onChange={(e) =>
//                       setReplyText({
//                         ...replyText,
//                         [customer.id]: e.target.value,
//                       })
//                     }
//                     className="w-full border border-gray-300 rounded p-3 text-gray-700 bg-white mb-3"
//                     rows={3}
//                     placeholder="Type your reply here..."
//                     required
//                   />
//                   <button
//                     type="submit"
//                     disabled={submitting[customer.id]}
//                     className="bg-green-500 text-white font-semibold py-2 px-6 rounded hover:bg-green-600 disabled:bg-gray-400"
//                   >
//                     {submitting[customer.id] ? "Sending..." : "Send Reply"}
//                   </button>
//                 </form>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // app/components/designer/designer.tsx
// import { useEffect, useState } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";
// // import type { useAuth } from "~/contexts/useAuth";
// import type { AuthUser } from "~/types/authUser";

// interface UserData {
//   id: string;
//   email: string;
//   displayName: string | null;
//   createdAt: Timestamp;
//   role?: string;
// }

// interface Message {
//   id: string;
//   text: string;
//   sender: "customer" | "designer";
//   createdAt: Timestamp;
//   read: boolean;
// }

// interface UserWithMessages {
//   user: UserData;
//   messages: Message[];
// }

// interface DesignerDashboardProps {
//   user: AuthUser;
// }

// export default function DesignerDashboard({ user }: DesignerDashboardProps) {
//   const [usersWithMessages, setUsersWithMessages] = useState<
//     UserWithMessages[]
//   >([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAllUsersAndMessages = async () => {
//       try {
//         // Get all users
//         const usersSnapshot = await getDocs(collection(db, "users"));
//         const usersData: UserWithMessages[] = [];

//         // For each user, get their messages
//         for (const userDoc of usersSnapshot.docs) {
//           const userData = {
//             id: userDoc.id,
//             ...userDoc.data(),
//           } as UserData;

//           // Skip designers
//           if (userData.role === "designer") continue;

//           // Get messages for this user
//           const messagesRef = collection(db, "users", userDoc.id, "messages");
//           const messagesQuery = query(
//             messagesRef,
//             orderBy("createdAt", "desc")
//           );
//           const messagesSnapshot = await getDocs(messagesQuery);

//           const messages: Message[] = [];
//           messagesSnapshot.forEach((msgDoc) => {
//             messages.push({
//               id: msgDoc.id,
//               ...msgDoc.data(),
//             } as Message);
//           });

//           usersData.push({
//             user: userData,
//             messages: messages,
//           });
//         }

//         setUsersWithMessages(usersData);
//       } catch (error) {
//         console.error("Error fetching users and messages:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllUsersAndMessages();
//   }, []);

//   if (loading) {
//     return <div className="p-6">Loading all users and messages...</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Designer Dashboard</h1>
//         <p className="text-gray-600 mb-8">
//           Welcome, {user.displayName || user.email}!
//         </p>

//         {usersWithMessages.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             No users with messages yet.
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {usersWithMessages.map(({ user: customer, messages }) => (
//               <div
//                 key={customer.id}
//                 className="bg-white border border-gray-300 rounded-lg p-6"
//               >
//                 {/* User Header */}
//                 <div className="mb-4 pb-4 border-b">
//                   <h2 className="text-xl font-semibold">
//                     {customer.displayName || customer.email}
//                   </h2>
//                   <p className="text-sm text-gray-500">{customer.email}</p>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Member since:{" "}
//                     {customer.createdAt
//                       ? new Date(
//                           customer.createdAt.seconds * 1000
//                         ).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                 </div>

//                 {/* Messages */}
//                 {messages.length === 0 ? (
//                   <p className="text-gray-500 italic">No messages yet</p>
//                 ) : (
//                   <div className="space-y-3">
//                     <h3 className="font-semibold text-gray-700">
//                       Messages ({messages.length})
//                     </h3>
//                     {messages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`p-4 rounded-lg ${
//                           msg.sender === "customer"
//                             ? "bg-blue-50 border-l-4 border-blue-500"
//                             : "bg-green-50 border-l-4 border-green-500"
//                         }`}
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <span className="font-semibold text-sm">
//                             {msg.sender === "customer"
//                               ? "Customer"
//                               : "Designer"}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {msg.createdAt
//                               ? new Date(
//                                   msg.createdAt.seconds * 1000
//                                 ).toLocaleString()
//                               : "Just now"}
//                           </span>
//                         </div>
//                         <p className="text-gray-800">{msg.text}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // app/components/designer/designer.tsx
// import type { AuthUser } from "~/contexts/useAuth"; // Changed import

// interface DesignerDashboardProps {
//   user: AuthUser; // Changed type
// }

// export default function DesignerDashboard({ user }: DesignerDashboardProps) {
//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Designer Dashboard</h1>
//         <p className="text-gray-600">
//           Welcome, {user.displayName || user.email}!
//         </p>
//         <p className="text-gray-600 mt-2">Designer features coming soon...</p>
//       </div>
//     </div>
//   );
// }

// // app/components/designer/designer.tsx
// import type { User } from "firebase/auth";

// interface DesignerDashboardProps {
//   user: User;
// }

// export default function DesignerDashboard({ user }: DesignerDashboardProps) {
//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Designer Dashboard</h1>
//         <p className="text-gray-600">
//           Welcome, {user.displayName || user.email}!
//         </p>
//         <p className="text-gray-600 mt-2">Designer features coming soon...</p>
//       </div>
//     </div>
//   );
// }
