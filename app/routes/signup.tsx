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
      password,
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
