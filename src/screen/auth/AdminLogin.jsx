import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../../redux/slices/authSlice";
import BackButton from "../../components/ui/BackButton";
import { Button, IconButton, InputAdornment, TextField, CircularProgress } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { adminLogin } from "../../api/admin.api";
import { showSnackbar } from "../../redux/slices/snackbarSlice";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email === "" || formData.password === "") {
      dispatch(showSnackbar({ message: "All fields are required", severity: "error" }));
      return;
    }

    try {
      setLoading(true);
      const response = await adminLogin(formData);
      if (response?.success) {
        dispatch(setUser(response?.data));
        dispatch(setToken(response?.token));
        navigate("/admin/dashboard");
      } else {
        dispatch(showSnackbar({ message: response?.message || "Login failed", severity: "error" }));
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error?.response?.data?.message || error?.message || "Login failed. Please try again.",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const darkFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
  },
  "& .MuiInputBase-input": {
    color: "#fff", // 👈 explicitly input text pe color, root se inherit nahi ho raha tha
    WebkitTextFillColor: "#fff", // 👈 Safari/Chrome autofill override
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #0d0f16 inset", // autofill ka white background hata do
      WebkitTextFillColor: "#fff",
      caretColor: "#fff",
    },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#2563eb" },
};

  return (
    <div className="min-h-screen relative flex justify-center items-start px-4 text-white overflow-hidden bg-[#050810]">
      {/* Ambient background - radial glows + grid, dark security/admin feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(37,99,235,0.18), transparent 40%),
            radial-gradient(circle at 85% 15%, rgba(99,102,241,0.14), transparent 35%),
            radial-gradient(circle at 50% 100%, rgba(37,99,235,0.10), transparent 50%)
          `,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
        }}
      />
      {/* subtle top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6 py-10">
        <BackButton title="Home" />

        <div className="bg-[#0d0f16]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl shadow-black/50 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-600/10 border border-blue-600/30 flex items-center justify-center mb-1">
              <ShieldCheck size={26} className="text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-gray-400 text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              type="email"
              name="email"
              label="Email"
              variant="outlined"
              size="medium"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
               sx={darkFieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="rgba(255,255,255,0.5)" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              variant="outlined"
              size="medium"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
             sx={darkFieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} color="rgba(255,255,255,0.5)" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? (
                        <VisibilityOff sx={{ color: "rgba(255,255,255,0.5)" }} fontSize="small" />
                      ) : (
                        <Visibility sx={{ color: "rgba(255,255,255,0.5)" }} fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={!loading && <LoginIcon />}
              sx={{
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "12px",
                py: 1.3,
                mt: 1,
                boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
                "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #4338ca)" },
                "&.Mui-disabled": { background: "rgba(37,99,235,0.4)", color: "#fff" },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;