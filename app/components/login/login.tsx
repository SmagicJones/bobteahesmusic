// Login.tsx with Shadcn Card styling

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import fbAuth from "~/firebase/firebaseConfig";
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

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Email/password login
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(fbAuth, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Email/Password login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setGoogleError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(fbAuth, provider);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setGoogleError("Failed to login with Google.");
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(false);
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(fbAuth, resetEmail);
      setResetSuccess(true);
      setResetEmail("");
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setResetError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setResetError("Please enter a valid email address.");
      } else {
        setResetError("Failed to send reset email. Please try again.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          {showForgotPassword ? "Reset Password" : "Login"}
        </CardTitle>
        <CardDescription>
          {showForgotPassword
            ? "Enter your email to receive a password reset link"
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showForgotPassword ? (
          <>
            {/* Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <Link to="/signup" className="block">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>

            {googleError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{googleError}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <>
            {/* Password Reset Form */}
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  type="email"
                  id="reset-email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {resetSuccess && (
                <Alert>
                  <AlertDescription>
                    Password reset email sent! Check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              {resetError && (
                <Alert variant="destructive">
                  <AlertDescription>{resetError}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={resetLoading}>
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSuccess(false);
                  setResetError(null);
                  setResetEmail("");
                }}
              >
                Back to Login
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// // Login.tsx with Forgot Password

// import { useState } from "react";
// import { Link, useNavigate } from "react-router";
// import {
//   GoogleAuthProvider,
//   signInWithPopup,
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
// } from "firebase/auth";
// import fbAuth from "~/firebase/firebaseConfig";

// export function Login() {
//   const [error, setError] = useState<string | null>(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [googleError, setGoogleError] = useState<string | null>(null);

//   // Forgot password states
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");
//   const [resetLoading, setResetLoading] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [resetError, setResetError] = useState<string | null>(null);

//   const navigate = useNavigate();

//   // Email/password login
//   const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(fbAuth, email, password);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Email/Password login error:", err);
//       setError("Invalid email or password. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google login
//   const handleGoogleLogin = async () => {
//     setGoogleError(null);
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(fbAuth, provider);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Google login error:", err);
//       setGoogleError("Failed to login with Google.");
//     }
//   };

//   // Handle password reset
//   const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setResetError(null);
//     setResetSuccess(false);
//     setResetLoading(true);

//     try {
//       await sendPasswordResetEmail(fbAuth, resetEmail);
//       setResetSuccess(true);
//       setResetEmail("");
//     } catch (err: any) {
//       console.error("Password reset error:", err);
//       if (err.code === "auth/user-not-found") {
//         setResetError("No account found with this email address.");
//       } else if (err.code === "auth/invalid-email") {
//         setResetError("Please enter a valid email address.");
//       } else {
//         setResetError("Failed to send reset email. Please try again.");
//       }
//     } finally {
//       setResetLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-gray-400 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6">
//         {showForgotPassword ? "Reset Password" : "Login"}
//       </h2>

//       {!showForgotPassword ? (
//         <>
//           {/* Email/password login form */}
//           <form
//             onSubmit={handleEmailLogin}
//             className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md mb-6"
//           >
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-gray-700 text-sm font-bold mb-2"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline bg-white"
//               />
//             </div>

//             <div className="mb-4">
//               <label
//                 htmlFor="password"
//                 className="block text-gray-700 text-sm font-bold mb-2"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline bg-white"
//               />
//             </div>

//             {/* Forgot Password Link */}
//             <div className="mb-6 text-right">
//               <button
//                 type="button"
//                 onClick={() => setShowForgotPassword(true)}
//                 className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
//               >
//                 Forgot Password?
//               </button>
//             </div>

//             <button
//               type="submit"
//               className="bg-green-500 text-white font-semibold py-2 px-4 rounded w-full hover:bg-green-600 transition duration-200"
//               disabled={loading}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </button>

//             {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
//           </form>

//           <Link to="/signup" className="w-full max-w-sm">
//             <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded w-full hover:bg-green-600 transition duration-200">
//               Sign Up
//             </button>
//           </Link>

//           {googleError && <p className="text-red-500 mt-4">{googleError}</p>}
//         </>
//       ) : (
//         <>
//           {/* Forgot Password Form */}
//           <form
//             onSubmit={handlePasswordReset}
//             className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md mb-6"
//           >
//             <p className="text-gray-600 text-sm mb-6">
//               Enter your email address and we'll send you a link to reset your
//               password.
//             </p>

//             <div className="mb-6">
//               <label
//                 htmlFor="reset-email"
//                 className="block text-gray-700 text-sm font-bold mb-2"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="reset-email"
//                 value={resetEmail}
//                 onChange={(e) => setResetEmail(e.target.value)}
//                 required
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline bg-white"
//               />
//             </div>

//             <button
//               type="submit"
//               className="bg-blue-500 text-white font-semibold py-2 px-4 rounded w-full hover:bg-blue-600 transition duration-200 mb-4"
//               disabled={resetLoading}
//             >
//               {resetLoading ? "Sending..." : "Send Reset Link"}
//             </button>

//             <button
//               type="button"
//               onClick={() => {
//                 setShowForgotPassword(false);
//                 setResetSuccess(false);
//                 setResetError(null);
//                 setResetEmail("");
//               }}
//               className="text-gray-600 hover:text-gray-800 text-sm w-full"
//             >
//               Back to Login
//             </button>

//             {resetSuccess && (
//               <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
//                 Password reset email sent! Check your inbox.
//               </div>
//             )}

//             {resetError && (
//               <p className="text-red-500 mt-4 text-sm">{resetError}</p>
//             )}
//           </form>
//         </>
//       )}
//     </div>
//   );
// }

// // come on

// import { useState } from "react";
// import { Link, useNavigate } from "react-router";
// import {
//   GoogleAuthProvider,
//   signInWithPopup,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import fbAuth from "~/firebase/firebaseConfig";
// import styles from "./login.module.css";

// export function Login() {
//   const [error, setError] = useState<string | null>(null);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [googleError, setGoogleError] = useState<string | null>(null);

//   const navigate = useNavigate();

//   // Email/password login
//   const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(fbAuth, email, password);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Email/Password login error:", err);
//       setError("Invalid email or password. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google login
//   const handleGoogleLogin = async () => {
//     setGoogleError(null);
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(fbAuth, provider);
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Google login error:", err);
//       setGoogleError("Failed to login with Google.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 bg-gray-400 min-h-screen">
//       <h2 className="text-2xl font-bold mb-6">Login</h2>

//       {/* Email/password form */}
//       <form
//         onSubmit={handleEmailLogin}
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
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline bg-white"
//           />
//         </div>

//         <div className="mb-6">
//           <label
//             htmlFor="password"
//             className="block text-gray-700 text-sm font-bold mb-2"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline bg-white"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-green-500 text-white font-semibold py-2 px-4 rounded w-full hover:bg-green-600 transition duration-200"
//           disabled={loading}
//         >
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         {error && <p className="text-red-500 mt-4">{error}</p>}
//       </form>

//       <Link to="/signup">
//         <button
//           className="bg-green-500 text-white font-semibold py-2 px-4 rounded w-full hover:bg-green-600 transition duration-200"
//           disabled={loading}
//         >
//           Sign Up
//         </button>
//       </Link>

//       {/* OR Separator */}
//       {/* <div className="flex items-center w-full max-w-sm my-4">
//         <div className="flex-grow border-t border-gray-300"></div>
//         <span className="mx-4 text-gray-500">OR</span>
//         <div className="flex-grow border-t border-gray-300"></div>
//       </div> */}

//       {/* Google Login */}
//       {/* <button
//         onClick={handleGoogleLogin}
//         className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200 w-full max-w-sm flex items-center justify-center ${styles.googleButton}`}
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
//         Continue with Google
//       </button> */}

//       {googleError && <p className="text-red-500 mt-4">{googleError}</p>}
//     </div>
//   );
// }
