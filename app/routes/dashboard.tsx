// app/routes/dashboard.tsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "~/firebase/firebaseConfig";
import { useAuth } from "~/contexts/useAuth";
import UserDashboard from "~/components/user/user";
import DesignerDashboard from "~/components/designer/designer";

export default function Dashboard() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || "customer");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("customer"); // Default to customer on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (!user || loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Route to appropriate dashboard based on role
  if (role === "designer") {
    return <DesignerDashboard user={user} />;
  }

  return <UserDashboard user={user} />;
}
