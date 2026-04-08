import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ADMIN_EMAIL } from "./constants/auth";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import GalaxyBackground from "./components/GalaxyBackground";
import MouseFollower from "./components/MouseFollower";

function App() {
  const { user } = useAuth();
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  return (
    <div className="relative isolate min-h-screen bg-app text-zinc-100">
      <GalaxyBackground />
      <MouseFollower />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={isAdmin ? <Navigate to="/admin" replace /> : <LoginPage />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPage />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
