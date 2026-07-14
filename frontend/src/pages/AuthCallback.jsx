import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import FullScreenLoader from "../components/common/FullScreenLoader";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setAuth(
        { id: payload.user_id, email: payload.email, name: "User" },
        token,
      );
      toast.success("Logged in!");
      navigate("/dashboard");
    } catch {
      navigate("/login");
    }
  }, []);

  return <FullScreenLoader message="Completing sign in..." />;
}
