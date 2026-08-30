import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import loginPageElement from "../../assets/LoginPageElement.png";
import toast from "react-hot-toast";
import { setToken, setUser } from "../../redux/slices/authSlice";
import mainContent from "../../utils/mainContent";
import { Button, CircularProgress } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { userLogin } from "../../api/auth.api";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginPayload, setLoginPayload] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setLoginPayload((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    let formErrors = {};
    let isValid = true;

    if (!loginPayload.email.trim()) {
      formErrors.email = "Email / Username is required";
      isValid = false;
    }
    if (!loginPayload.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleLoginSubmit = async () => {
    if (!validate()) return;
    if (loading) return;
    setLoading(true);

    try {
      const response = await userLogin({
        username: loginPayload.email.trim(),
        password: loginPayload.password,
      });

      toast.success(response?.message || "Login Successful.");
      dispatch(setUser(response?.data));
      dispatch(setToken(response?.token));

      rememberMe
        ? localStorage.setItem("savedEmail", loginPayload.email)
        : localStorage.removeItem("savedEmail");

      setTimeout(() => {
        navigate("/user/home");
      }, 1200);
    } catch (error) {
      console.log("Login error:", error?.response?.data || error.message);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-blue-50/40 w-full px-4 overflow-hidden">
      {/* Ambient glow background */}
      <div className="pointer-events-none absolute -top-40 -left-32 w-96 h-96 bg-blue-200/40 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1d4ed8 1px, transparent 1px), linear-gradient(90deg, #1d4ed8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-[440px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-100 border border-white py-8">
        {/* subtle top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

        <div className="w-full flex justify-between items-center mb-6 px-6">
          <div>
            <p className="text-[11px] font-semibold text-blue-600 tracking-[0.2em] mb-1">
              WELCOME BACK
            </p>
            <Link
              to="/"
              className="text-3xl font-extrabold text-gray-900 tracking-tight"
            >
              Login
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg" />
            <img
              src={loginPageElement}
              className="relative h-16 w-16 object-cover rounded-full ring-2 ring-blue-100"
              alt="img"
            />
          </div>
        </div>

        <div className="px-6">
          <div className="space-y-5">
            <div>
              <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
                USERNAME <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center gap-2.5 rounded-xl border transition-all duration-300 bg-gray-50 px-3.5 ${
                  errors.email
                    ? "border-red-400"
                    : focusedField === "email"
                      ? "border-blue-500 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                      : "border-gray-200"
                }`}
              >
                <HiOutlineMail
                  size={18}
                  className={
                    focusedField === "email" ? "text-blue-600" : "text-gray-400"
                  }
                />
                <input
                  type="text"
                  onChange={(e) =>
                    setLoginPayload({ ...loginPayload, email: e.target.value })
                  }
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  value={loginPayload.email}
                  placeholder="Enter your username"
                  disabled={loading}
                  className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
                  onKeyDown={(e) => e.key === "Enter" && handleLoginSubmit()}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
                PASSWORD <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center gap-2.5 rounded-xl border transition-all duration-300 bg-gray-50 px-3.5 ${
                  errors.password
                    ? "border-red-400"
                    : focusedField === "password"
                      ? "border-blue-500 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                      : "border-gray-200"
                }`}
              >
                <RiLockPasswordLine
                  size={18}
                  className={
                    focusedField === "password"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPayload.password}
                  onChange={(e) =>
                    setLoginPayload({
                      ...loginPayload,
                      password: e.target.value,
                    })
                  }
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
                  onKeyDown={(e) => e.key === "Enter" && handleLoginSubmit()}
                />
                {showPassword ? (
                  <FaRegEyeSlash
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-lg text-gray-400 hover:text-blue-600 cursor-pointer transition-colors flex-shrink-0"
                  />
                ) : (
                  <FaRegEye
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-lg text-gray-400 hover:text-blue-600 cursor-pointer transition-colors flex-shrink-0"
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded mr-2"
                />
                Remember me
              </label>
              <Link
                to={"/forget-password"}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              fullWidth
              variant="contained"
              onClick={handleLoginSubmit}
              disabled={loading}
              startIcon={!loading && <LoginIcon />}
              sx={{
                background: "linear-gradient(135deg, #2563eb, #4338ca)",
                color: "#fff",
                fontWeight: 800,
                textTransform: "none",
                borderRadius: "12px",
                py: 1.3,
                fontSize: "15px",
                boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
                  boxShadow: "0 10px 28px rgba(37,99,235,0.4)",
                },
                "&.Mui-disabled": {
                  background: "rgba(37,99,235,0.2)",
                  color: "#fff",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm tracking-wide mt-4 text-gray-500">
              DIDN'T HAVE AN ACCOUNT?{" "}
              <Link
                to={"/auth/register"}
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                SIGN UP NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
