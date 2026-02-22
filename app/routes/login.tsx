import { Navigate, redirect } from "react-router";
import { Login } from "~/components/login/login";
import { useAuth } from "~/contexts/useAuth";

export default function Go() {
  const { user } = useAuth();

  const isAuthenticated = Boolean(user);
  if (isAuthenticated) return <Navigate to="/free-stuff" replace />;
  return (
    <main className="flex justify-center items-center mb-8">
      <Login />
    </main>
  );
}
