import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Impersonate = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("Impersonate token:", token);
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", "user");

      window.location.replace("/user/home");
    } else {
      window.location.replace("/auth/login");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );
};

export default Impersonate;
