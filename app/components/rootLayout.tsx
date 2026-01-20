import { Outlet } from "react-router";
import AuthProvider from "~/contexts/authProvider";
import DesktopNav from "~/components/DesktopNav";
import MobileNav from "~/components/MobileNav";

import "../styles/custom.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <DesktopNav />
      <MobileNav />
      <Outlet />
    </AuthProvider>
  );
}
