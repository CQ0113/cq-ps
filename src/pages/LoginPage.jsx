import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Chrome, Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAIL } from "../constants/auth";

function LoginPage() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithGoogle();
      const email = result.user?.email?.toLowerCase();

      if (email === ADMIN_EMAIL) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (signInError) {
      if (signInError?.code === "auth/configuration-not-found") {
        setError(
          "Google sign-in is not enabled for this Firebase project. Enable Google provider in Firebase Console > Authentication > Sign-in method."
        );
      } else {
        setError(signInError.message || "Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-panel/90 p-8"
      >
        <h1 className="text-2xl font-semibold text-zinc-100">Access Gate</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign in with Google. Only the owner email can enter the admin canvas.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Chrome size={16} />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <button
          onClick={() => navigate("/", { replace: true })}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-600"
        >
          <Eye size={16} />
          Continue as Guest
        </button>

        {error && <p className="mt-4 text-xs text-red-400">{error}</p>}
      </motion.section>
    </main>
  );
}

export default LoginPage;
