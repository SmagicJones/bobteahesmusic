import {
  type ActionFunctionArgs,
  Form,
  redirect,
  useActionData,
  Link,
} from "react-router";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import fbAuth, { db } from "~/firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      fbAuth,
      email,
      password
    );
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      displayName: null,
      createdAt: serverTimestamp(),
      role: "customer",
    });
    return redirect("/dashboard");
  } catch (err) {
    console.error("Signup error:", err);
    return {
      error:
        "Failed to create account. The email may already be in use or invalid.",
    };
  }
}

export default function Signup() {
  const actionData = useActionData() as { error?: string };
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(fbAuth, provider);
      const userRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(userRef);

      // Only create Firestore doc if it doesn't exist
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName || null,
          createdAt: serverTimestamp(),
          role: "customer",
        });
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google signup error:", err);
      setGoogleError("Failed to sign up with Google.");
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Email signup form */}
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="••••••••"
                required
              />
            </div>

            {actionData?.error && (
              <Alert variant="destructive">
                <AlertDescription>{actionData.error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </Form>

          <div className="mt-6">
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full">
                Already have an account? Sign In
              </Button>
            </Link>
          </div>

          {googleError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{googleError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// import {
//   type ActionFunctionArgs,
//   Form,
//   redirect,
//   useActionData,
// } from "react-router";
// import {
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { useState } from "react";
// import fbAuth, { db } from "~/firebase/firebaseConfig";
// import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
// import styles from "../components/login/login.module.css";

// export async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const confirmPassword = formData.get("confirmPassword") as string;

//   if (!email || !password || !confirmPassword) {
//     return { error: "All fields are required." };
//   }

//   if (password !== confirmPassword) {
//     return { error: "Passwords do not match." };
//   }

//   try {
//     // await createUserWithEmailAndPassword(fbAuth, email, password);
//     const userCredential = await createUserWithEmailAndPassword(
//       fbAuth,
//       email,
//       password
//     );
//     await setDoc(doc(db, "users", userCredential.user.uid), {
//       email: email,
//       displayName: null,
//       createdAt: serverTimestamp(),
//     });
//     return redirect("/dashboard");
//   } catch (err) {
//     console.error("Signup error:", err);
//     return {
//       error:
//         "Failed to create account. The email may already be in use or invalid.",
//     };
//   }
// }

// export default function Signup() {
//   const actionData = useActionData() as { error?: string };
//   const [googleError, setGoogleError] = useState<string | null>(null);

//   // Google Signup
//   // const handleGoogleSignup = async () => {
//   //   try {
//   //     const provider = new GoogleAuthProvider();
//   //     const result = await signInWithPopup(fbAuth, provider);
//   //     await setDoc(doc(db, "users", result.user.uid), {
//   //       email: result.user.email,
//   //       displayName: result.user.displayName,
//   //       createdAt: serverTimestamp(),
//   //     });

//   //     window.location.href = "/dashboard"; // Avoid useNavigate inside a route module
//   //   } catch (err) {
//   //     console.error("Google signup error:", err);
//   //     setGoogleError("Failed to sign up with Google.");
//   //   }
//   // };

//   const handleGoogleSignup = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(fbAuth, provider);
//       const userRef = doc(db, "users", result.user.uid);
//       const docSnap = await getDoc(userRef);

//       // Only create Firestore doc if it doesn't exist
//       if (!docSnap.exists()) {
//         await setDoc(userRef, {
//           email: result.user.email,
//           displayName: result.user.displayName || null,
//           createdAt: serverTimestamp(),
//           role: "customer", // important for dashboard filtering
//         });
//       }

//       window.location.href = "/dashboard";
//     } catch (err) {
//       console.error("Google signup error:", err);
//       setGoogleError("Failed to sign up with Google.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-gray-400 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

//       {/* Email signup form using action() */}
//       <Form
//         method="post"
//         className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md mb-6"
//       >
//         <div className="mb-4">
//           <label
//             htmlFor="email"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="password"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             htmlFor="confirmPassword"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             name="confirmPassword"
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-green-500 text-white font-semibold py-2 px-4 rounded w-full hover:bg-green-600"
//         >
//           Create Account
//         </button>

//         {actionData?.error && (
//           <p className="text-red-500 mt-4">{actionData.error}</p>
//         )}
//       </Form>

//       {/* Separator */}
//       {/* <div className="flex items-center w-full max-w-sm my-4">
//         <div className="flex-grow border-t border-gray-300"></div>
//         <span className="mx-4 text-gray-500">OR</span>
//         <div className="flex-grow border-t border-gray-300"></div>
//       </div> */}

//       {/* Google Signup */}
//       {/* <button
//         onClick={handleGoogleSignup}
//         className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded w-full max-w-sm hover:bg-blue-600 flex items-center justify-center ${styles.googleButton}`}
//       >
//         <svg
//           className="inline-block w-5 h-5 mr-2"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 48 48"
//         >
//           <path
//             fill="#EA4335"
//             d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
//           />
//           <path
//             fill="#4285F4"
//             d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
//           />
//           <path
//             fill="#FBBC05"
//             d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
//           />
//           <path
//             fill="#34A853"
//             d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
//           />
//         </svg>
//         Sign Up with Google
//       </button> */}

//       {googleError && <p className="text-red-500 mt-4">{googleError}</p>}
//     </div>
//   );
// }
