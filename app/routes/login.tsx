import { Navigate, redirect } from "react-router";
import { Login } from "~/components/login/login";
import { useAuth } from "~/contexts/useAuth";

export default function Go() {
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <main className="flex justify-center items-center pt-6">
      <Login />
    </main>
  );
}
