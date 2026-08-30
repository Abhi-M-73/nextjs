import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const BASE_URL = "https://api.binext.in";
// import.meta.env.VITE_API_URL || "https://api.tokenbridge.online";

const Axios = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

Axios.interceptors.response.use(
  (response) => {
    return response.data ?? response;
  },
  (error) => {
    const status = error?.response?.status;

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    if (status === 401) {
      // Redux auth state clear
      store.dispatch(logout());

      // IMPORTANT:
      // yaha window.location.href mat karo
      // yaha localStorage.clear() bhi mat karo
    }

    if (status === 403) {
      console.error("Access denied");
    }

    if (status >= 500) {
      console.error("Server error");
    }

    return Promise.reject({
      success: false,
      status,
      message,
      raw: error,
    });
  },
);

export default Axios;
