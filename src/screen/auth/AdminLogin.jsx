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

  return (
    <div className="min-h-screen flex justify-center items-start px-4 bg-[#0a0a0a] text-white">
      <div className="w-full max-w-md space-y-6 py-10">
        <BackButton title="Home" />

        <div className="bg-[#121212] border border-gray-700 rounded-2xl p-7 shadow-lg space-y-6">
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} />
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} />
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
                background: "#2563eb",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "12px",
                py: 1.3,
                mt: 1,
                "&:hover": { background: "#1d4ed8" },
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