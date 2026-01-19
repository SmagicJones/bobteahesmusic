// app/routes/dashboard.tsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "~/firebase/firebaseConfig";
import { useAuth } from "~/contexts/useAuth";
import UserDashboard from "~/components/user/user";
import DesignerDashboard from "~/components/designer/designer";

export default function Dashboard() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || "customer");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("customer"); // Default to customer on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (!user || loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Route to appropriate dashboard based on role
  if (role === "designer") {
    return <DesignerDashboard user={user} />;
  }

  return <UserDashboard user={user} />;
}

// import { useEffect, useState } from "react";
// import {
//   doc,
//   getDoc,
//   collection,
//   addDoc,
//   serverTimestamp,
//   Timestamp,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";
// import useAuth from "~/contexts/useAuth";

// interface UserData {
//   email: string;
//   displayName: string | null;
//   createdAt: Timestamp;
// }

// interface Message {
//   id: string;
//   text: string;
//   sender: "customer" | "designer";
//   createdAt: Timestamp;
//   read: boolean;
// }

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [messagesLoading, setMessagesLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch user document from Firestore
//   useEffect(() => {
//     if (!user) return;

//     const fetchUserData = async () => {
//       try {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//           setUserData(userDoc.data() as UserData);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   // Fetch messages in real-time
//   useEffect(() => {
//     if (!user) return;

//     const messagesRef = collection(db, "users", user.uid, "messages");
//     const q = query(messagesRef, orderBy("createdAt", "desc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const messagesData: Message[] = [];
//       snapshot.forEach((doc) => {
//         messagesData.push({
//           id: doc.id,
//           ...doc.data(),
//         } as Message);
//       });
//       setMessages(messagesData);
//       setMessagesLoading(false);
//     });

//     return () => unsubscribe();
//   }, [user]);

//   // Handle message submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!message.trim() || !user) return;

//     setSubmitting(true);
//     try {
//       await addDoc(collection(db, "users", user.uid, "messages"), {
//         text: message,
//         sender: "customer",
//         createdAt: serverTimestamp(),
//         read: false,
//       });

//       setMessage(""); // Clear the form
//     } catch (error) {
//       console.error("Error sending message:", error);
//       alert("Failed to send message");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!user || loading) {
//     return <div className="p-6">Loading...</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* User Info Section */}
//         <div className="bg-slate-100 p-6 rounded-lg mb-6">
//           <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//           <div className="space-y-2">
//             <div>
//               <strong>Email:</strong> {userData?.email || user.email}
//             </div>
//             <div>
//               <strong>Display Name:</strong>{" "}
//               {userData?.displayName || "Not set"}
//             </div>
//             <div>
//               <strong>Member Since:</strong>{" "}
//               {userData?.createdAt
//                 ? new Date(
//                     userData.createdAt.seconds * 1000
//                   ).toLocaleDateString()
//                 : "N/A"}
//             </div>
//           </div>
//         </div>

//         {/* Welcome Section */}
//         <section className="mb-6">
//           <div className="bg-slate-300 text-black p-4 rounded">
//             <h2 className="text-xl">
//               Welcome {user.displayName || user.email}!
//             </h2>
//           </div>
//         </section>

//         {/* Message Form */}
//         <section className="bg-white border border-gray-300 p-6 rounded-lg mb-6">
//           <h3 className="text-xl font-semibold mb-4">
//             Send a Message to Support
//           </h3>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label
//                 htmlFor="message"
//                 className="block text-gray-700 font-medium mb-2"
//               >
//                 Your Message
//               </label>
//               <textarea
//                 id="message"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 className="w-full border border-gray-300 rounded p-3 text-gray-700 bg-white"
//                 rows={5}
//                 placeholder="Type your message here..."
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={submitting}
//               className="bg-blue-500 text-white font-semibold py-2 px-6 rounded hover:bg-blue-600 disabled:bg-gray-400"
//             >
//               {submitting ? "Sending..." : "Send Message"}
//             </button>
//           </form>
//         </section>

//         {/* Messages Section */}
//         <section className="bg-white border border-gray-300 p-6 rounded-lg">
//           <h3 className="text-xl font-semibold mb-4">Your Messages</h3>

//           {messagesLoading ? (
//             <div className="text-center py-8 text-gray-500">
//               Loading messages...
//             </div>
//           ) : messages.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No messages yet. Send your first message above!
//             </div>
//           ) : (
//             <div className="grid gap-4">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`p-4 rounded-lg ${
//                     msg.sender === "customer"
//                       ? "bg-blue-50 border-l-4 border-blue-500"
//                       : "bg-green-50 border-l-4 border-green-500"
//                   }`}
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <span className="font-semibold text-sm">
//                       {msg.sender === "customer" ? "You" : "Support"}
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       {msg.createdAt
//                         ? new Date(
//                             msg.createdAt.seconds * 1000
//                           ).toLocaleString()
//                         : "Just now"}
//                     </span>
//                   </div>
//                   <p className="text-gray-800">{msg.text}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import {
//   doc,
//   getDoc,
//   collection,
//   addDoc,
//   serverTimestamp,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "~/firebase/firebaseConfig";
// import useAuth from "~/contexts/useAuth";

// interface UserData {
//   email: string;
//   displayName: string | null;
//   createdAt: Timestamp;
// }

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch user document from Firestore
//   useEffect(() => {
//     if (!user) return;

//     const fetchUserData = async () => {
//       try {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//           setUserData(userDoc.data() as UserData);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   // Handle message submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!message.trim() || !user) return;

//     setSubmitting(true);
//     try {
//       await addDoc(collection(db, "users", user.uid, "messages"), {
//         text: message,
//         sender: "customer",
//         createdAt: serverTimestamp(),
//         read: false,
//       });

//       setMessage(""); // Clear the form
//       alert("Message sent successfully!");
//     } catch (error) {
//       console.error("Error sending message:", error);
//       alert("Failed to send message");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!user || loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* User Info Section */}
//         <div className="bg-slate-100 p-6 rounded-lg mb-6">
//           <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//           <div className="space-y-2">
//             <div>
//               <strong>Email:</strong> {userData?.email || user.email}
//             </div>
//             <div>
//               <strong>Display Name:</strong>{" "}
//               {userData?.displayName || "Not set"}
//             </div>
//             <div>
//               <strong>Member Since:</strong>{" "}
//               {userData?.createdAt
//                 ? new Date(
//                     userData.createdAt.seconds * 1000
//                   ).toLocaleDateString()
//                 : "N/A"}
//             </div>
//           </div>
//         </div>

//         {/* Welcome Section */}
//         <section className="mb-6">
//           <div className="bg-slate-300 text-black p-4 rounded">
//             <h2 className="text-xl">
//               Welcome {user.displayName || user.email}!
//             </h2>
//           </div>
//         </section>

//         {/* Message Form */}
//         <section className="bg-white border border-gray-300 p-6 rounded-lg">
//           <h3 className="text-xl font-semibold mb-4">
//             Send a Message to Support
//           </h3>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label
//                 htmlFor="message"
//                 className="block text-gray-700 font-medium mb-2"
//               >
//                 Your Message
//               </label>
//               <textarea
//                 id="message"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 className="w-full border border-gray-300 rounded p-3 text-gray-700 bg-white"
//                 rows={5}
//                 placeholder="Type your message here..."
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={submitting}
//               className="bg-blue-500 text-white font-semibold py-2 px-6 rounded hover:bg-blue-600 disabled:bg-gray-400"
//             >
//               {submitting ? "Sending..." : "Send Message"}
//             </button>
//           </form>
//         </section>
//       </div>
//     </div>
//   );
// }

// import useAuth from "~/contexts/useAuth";

// export default function Dashboard() {
//   const { user } = useAuth();

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="bg-white">
//       <div>
//         <div>Display Name: {user.displayName}</div>
//       </div>
//       <div className="text-xl font-semibold mt-4">Dashboard</div>
//       <section>
//         <div className="grid md:grid-cols-2 gap-4 m-2">
//           <div className="bg-slate-300 text-black p-4 rounded">
//             <h2>Welcome {user.displayName ? user.displayName : user.email}</h2>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
