import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
        error?.response?.data?.message || error.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent w-full px-4">
      <div className="w-full max-w-[440px] bg-white/5 rounded-3xl shadow-xl border border-teal-800 py-8">
        <div className="w-full flex justify-between items-center mb-4 px-6">
          <Link to="/" className="text-3xl font-bold text-white">Login</Link>
          <img src={loginPageElement} className="h-20 w-20 object-cover" alt="img" />
        </div>

        <div className="px-6">
          <div className="space-y-5">
            <div>
              <label className="text-white mb-1 text-sm flex gap-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                onChange={(e) =>
                  setLoginPayload({ ...loginPayload, email: e.target.value })
                }
                value={loginPayload.email}
                placeholder="Username"
                disabled={loading}
                className={`w-full p-3 rounded-xl outline-none border-2 text-base bg-[#2b2e39] text-white placeholder-gray-400 ${
                  errors.email ? "border-red-500" : "border-gray-600"
                }`}
                onKeyDown={(e) => e.key === "Enter" && handleLoginSubmit()}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-white mb-1 text-sm flex gap-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPayload.password}
                  onChange={(e) =>
                    setLoginPayload({ ...loginPayload, password: e.target.value })
                  }
                  placeholder="Password"
                  disabled={loading}
                  className={`w-full p-3 rounded-xl outline-none border-2 text-base bg-[#2b2e39] text-white placeholder-gray-400 ${
                    errors.password ? "border-red-500" : "border-gray-600"
                  }`}
                  onKeyDown={(e) => e.key === "Enter" && handleLoginSubmit()}
                />
                {showPassword ? (
                  <FaRegEyeSlash
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-xl text-gray-400 top-1/2 -translate-y-1/2 right-4 cursor-pointer"
                  />
                ) : (
                  <FaRegEye
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-xl text-gray-400 top-1/2 -translate-y-1/2 right-4 cursor-pointer"
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#00d0fc] rounded mr-2"
                />
                Remember me
              </label>
              <Link to={"/forget-password"} className="text-gray-400 hover:text-[#00d0fc]">
                Forgot Password?
              </Link>
            </div>

            <Button
              fullWidth
              variant="contained"
              onClick={handleLoginSubmit}
              disabled={loading}
              startIcon={!loading && <LoginIcon />}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#121418" }} /> : "Sign In"}
            </Button>
            
            <div className="text-center text-sm tracking-wide mt-4 text-gray-500">
              DIDN'T HAVE AN ACCOUNT?{" "}
              <Link to={"/auth/register"} className="text-[#00d0fc] font-semibold">
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