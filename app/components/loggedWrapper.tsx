import { Outlet, redirect } from "react-router";
import { isAuth } from "~/services/auth";
import Logout from "./logout/logout";

export async function clientLoader() {
  // optional: keep your artificial delay if you want
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const isLogged = await isAuth();
  if (!isLogged) {
    throw redirect("/login");
  }
}

export default function LoggedWrapper() {
  return (
    <div>
      <Outlet />
      <div className="m-4 flex justify-center items-center p-4">
        <Logout />
      </div>
    </div>
  );
}
