import { Outlet, useNavigation } from "react-router";
import AuthProvider from "~/contexts/authProvider";

import DesktopNav from "~/components/DesktopNav";
import MobileNav from "~/components/MobileNav";

import "../styles/custom.css";
import { Footer } from "./Footer";

export default function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  return (
    <AuthProvider>
      <DesktopNav />
      <MobileNav />

      {isNavigating ? (
        <div className="min-h-screen">
          <div className="flex justify-center items-center h-screen">
            <div className="loading-spinner"></div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}

      <Footer />
    </AuthProvider>
  );
}
