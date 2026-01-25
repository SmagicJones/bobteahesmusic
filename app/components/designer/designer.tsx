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
            orderBy("createdAt", "desc"),
          ),
        );

        const projects: ProjectWithMessages[] = projectsSnap.docs.map(
          (doc) => ({
            project: { id: doc.id, ...doc.data() } as Project,
            messages: [],
          }),
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
          orderBy("createdAt", "desc"),
        );

        unsubscribes.push(
          onSnapshot(generalQuery, (snap) => {
            const messages = snap.docs.map(
              (d) => ({ id: d.id, ...d.data() }) as Message,
            );

            setUsersData((prev) =>
              prev.map((x) =>
                x.user.id === u.user.id
                  ? { ...x, generalMessages: messages }
                  : x,
              ),
            );
          }),
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
              "messages",
            ),
            orderBy("createdAt", "desc"),
          );

          unsubscribes.push(
            onSnapshot(projectQuery, (snap) => {
              const messages = snap.docs.map(
                (d) => ({ id: d.id, ...d.data() }) as Message,
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
                            : proj,
                        ),
                      },
                ),
              );
            }),
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
    projectId: string,
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
      },
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
              <div
                key={m.id}
                className="p-2 bg-gray-100 rounded mb-2 dark:bg-slate-400 "
              >
                <strong>{m.sender}:</strong> {m.text}
              </div>
            ))}

            <form onSubmit={(e) => sendGeneralReply(e, user.id)}>
              <textarea
                className="w-full border p-2 mt-2 bg-white dark:bg-slate-400 text-slate-900 rounded"
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
                  <div
                    key={m.id}
                    className="p-2 bg-gray-100 rounded mb-2 dark:bg-slate-400 rounded"
                  >
                    <strong>{m.sender}:</strong> {m.text}
                  </div>
                ))}

                <form
                  onSubmit={(e) => sendProjectReply(e, user.id, project.id)}
                >
                  <textarea
                    className="w-full border p-2 mt-2 bg-white text-slate-900 dark:bg-slate-400  rounded"
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
