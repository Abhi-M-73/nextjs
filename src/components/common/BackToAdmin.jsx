// components/common/BackToAdmin.jsx
import { useDispatch } from "react-redux";
import { ShieldCheck } from "lucide-react";
import { setUser, setToken } from "../../redux/slices/authSlice"; // path apne hisaab se

const BackToAdmin = () => {
  const dispatch = useDispatch();

  const adminBackupToken = sessionStorage.getItem("adminBackupToken");

  // Backup nahi hai (normal user) to button dikhao hi mat
  if (!adminBackupToken) return null;

  const handleBackToAdmin = () => {
    const adminUser = sessionStorage.getItem("adminBackupUser");

    // Admin session restore
    dispatch(setToken(adminBackupToken));
    dispatch(setUser(adminUser ? JSON.parse(adminUser) : null));
    localStorage.setItem("token", adminBackupToken);
    if (adminUser) localStorage.setItem("user", adminUser);

    // Backup clear
    sessionStorage.removeItem("adminBackupToken");
    sessionStorage.removeItem("adminBackupUser");

    window.location.replace("/admin/dashboard");
  };

  return (
    <button
      type="button"
      onClick={handleBackToAdmin}
      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-amber-600"
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      Back to Admin
    </button>
  );
};

export default BackToAdmin;
