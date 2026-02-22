import { Link } from "react-router";
import { Login } from "../components/login/login";

import { type MetaFunction } from "react-router";
import { useAuth } from "~/contexts/useAuth";

import { Hero } from "~/components/Hero";

export const meta: MetaFunction = () => {
  return [
    { title: "bobteachesmusic - " },
    {
      name: "description",
      content:
        "guitar and bass tuition suited to your needs around Blackburn, Preston, Chorley - tuition available in person or online - make enquiry today!",
    },
  ];
};

export default function Home() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  return (
    <main>
      <Hero />
    </main>
  );
}
