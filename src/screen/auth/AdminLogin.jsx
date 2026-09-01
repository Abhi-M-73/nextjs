import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { BadgeCheck, Fingerprint, Lock, Mail, ShieldCheck } from "lucide-react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import BackButton from "../../components/ui/BackButton";
import { adminLogin } from "../../api/admin.api";
import { setToken, setUser } from "../../redux/slices/authSlice";
import { showSnackbar } from "../../redux/slices/snackbarSlice";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      dispatch(
        showSnackbar({
          message: "Email and password are required",
          severity: "error",
        }),
      );
      return;
    }

    try {
      setLoading(true);

      const response = await adminLogin({
        email,
        password,
      });

      if (response?.success) {
        dispatch(setUser(response?.data));
        dispatch(setToken(response?.token));
        navigate("/admin/dashboard");
      } else {
        dispatch(
          showSnackbar({
            message: response?.message || "Login failed",
            severity: "error",
          }),
        );
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Login failed. Please try again.",
          severity: "error",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#1e293b",
      backgroundColor: "#f8fafc",
      borderRadius: "14px",
      transition: "all 0.2s ease",

      "& fieldset": {
        borderColor: "#e2e8f0",
      },

      "&:hover": {
        backgroundColor: "#ffffff",
      },

      "&:hover fieldset": {
        borderColor: "#c7d2fe",
      },

      "&.Mui-focused": {
        backgroundColor: "#ffffff",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#6366f1",
        borderWidth: "1.5px",
      },
    },

    "& .MuiInputBase-input": {
      color: "#1e293b",
      WebkitTextFillColor: "#1e293b",
      caretColor: "#6366f1",

      "&::placeholder": {
        color: "#94a3b8",
        opacity: 1,
      },

      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 1000px #f8fafc inset",
        WebkitTextFillColor: "#1e293b",
        caretColor: "#6366f1",
        borderRadius: "14px",
        transitionDelay: "9999s",
        transitionProperty: "background-color, color",
      },

      "&:-webkit-autofill:hover": {
        WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
      },

      "&:-webkit-autofill:focus": {
        WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#64748b",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#4f46e5",
    },

    "& .MuiInputAdornment-root svg": {
      color: "#94a3b8",
    },
  };

  return (
    <div className="relative flex min-h-screen items-start justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 text-slate-800 sm:items-center">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-400/10 blur-[130px]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(#e2e8f0 1px, transparent 1px),
              linear-gradient(90deg, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "46px 46px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-5">
          <BackButton title="Home" />
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          {/* Top Gradient Line */}
          <div className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

          {/* Header */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 ring-1 ring-indigo-100">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
            </div>

            <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Admin Console
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in with your administrator credentials
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            autoComplete="on"
          >
            <TextField
              type="email"
              name="email"
              label="Email Address"
              variant="outlined"
              size="medium"
              fullWidth
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              sx={fieldSx}
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      edge="end"
                      disabled={loading}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{ color: "#94a3b8" }}
                          fontSize="small"
                        />
                      ) : (
                        <Visibility
                          sx={{ color: "#94a3b8" }}
                          fontSize="small"
                        />
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
                mt: 1,
                py: 1.45,
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, #4f46e5, #9333ea, #db2777)",
                boxShadow: "0 10px 24px rgba(99, 102, 241, 0.25)",
                fontSize: "0.95rem",
                fontWeight: 700,
                textTransform: "none",
                transition: "all 0.2s ease",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4338ca, #7e22ce, #be185d)",
                  boxShadow: "0 12px 28px rgba(99, 102, 241, 0.35)",
                },

                "&.Mui-disabled": {
                  background: "linear-gradient(135deg, #a5b4fc, #c4b5fd)",
                  color: "#ffffff",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#ffffff" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-center text-[11px] text-slate-400">
            <Fingerprint className="h-3.5 w-3.5 text-indigo-400" />
            <span>Access restricted to authorized personnel only</span>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Secure administrator access</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
