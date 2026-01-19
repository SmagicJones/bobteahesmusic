import { Link } from "react-router";
import { Login } from "../components/login/login";

import { useAuth } from "~/contexts/useAuth";
import JNCHeader from "~/components/headers/main";

export default function Home() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  return (
    <main>
      <JNCHeader />
    </main>
  );
}
