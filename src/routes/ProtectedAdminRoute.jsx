import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAIL } from "../constants/auth";

function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-zinc-400">
        Checking access...
      </div>
    );
  }

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
