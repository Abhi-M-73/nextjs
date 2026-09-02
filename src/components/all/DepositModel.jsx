// import React, { useEffect, useState } from "react";
// import Dialog from "@mui/material/Dialog";
// import Slide from "@mui/material/Slide";
// import { QrCode, UploadCloud, X, Loader2 } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { showSnackbar } from "../../redux/slices/snackbarSlice";
// import useFetchProfile from "../../hooks/useFetchProfile";
// import { getQr, submitDeposit } from "../../api/user.api";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// const DEFAULT_AMOUNT_INR = 999;

// const uploadToCloudinary = (file, onProgress) => {
//   return new Promise((resolve, reject) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

//     const xhr = new XMLHttpRequest();
//     xhr.open(
//       "POST",
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//     );

//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         onProgress(Math.round((event.loaded * 100) / event.total));
//       }
//     };

//     xhr.onload = () => {
//       if (xhr.status >= 200 && xhr.status < 300) {
//         resolve(JSON.parse(xhr.responseText));
//       } else {
//         reject(new Error("Cloudinary upload failed"));
//       }
//     };

//     xhr.onerror = () => reject(new Error("Network error during upload"));
//     xhr.send(formData);
//   });
// };

// export default function LLDStakeModal({
//   open,
//   onClose,
//   actualAmount,
//   displayAmount,
// }) {
//   const { fetchUserInfo } = useFetchProfile();
//   const dispatch = useDispatch();

//   const [qrUrl, setQrUrl] = useState(null);
//   const [qrLoading, setQrLoading] = useState(true);

//   const [amountInr, setAmountInr] = useState(DEFAULT_AMOUNT_INR);
//   const [paymentMethod, setPaymentMethod] = useState("UPI");
//   const [screenshot, setScreenshot] = useState(null);
//   const [screenshotPreview, setScreenshotPreview] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   useEffect(() => {
//     if (!open) return;
//     fetchQr();
//   }, [open]);

//   const fetchQr = async () => {
//     try {
//       setQrLoading(true);
//       const res = await getQr();
//       setQrUrl(res?.qrCode || null);
//     } catch (err) {
//       console.error("QR fetch failed:", err);
//       dispatch(
//         showSnackbar({
//           message: "Failed to load payment QR.",
//           severity: "error",
//         }),
//       );
//     } finally {
//       setQrLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setAmountInr(DEFAULT_AMOUNT_INR);
//     setPaymentMethod("UPI");
//     setScreenshot(null);
//     setScreenshotPreview(null);
//     setUploadProgress(null);
//     setErrorMsg("");
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setErrorMsg("Only image files are allowed for payment proof.");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setErrorMsg("Screenshot must be under 5MB.");
//       return;
//     }

//     setErrorMsg("");
//     setScreenshot(file);
//     setScreenshotPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async () => {
//     if (!amountInr || Number(amountInr) <= 0) {
//       setErrorMsg("Enter a valid amount.");
//       return;
//     }
//     if (!screenshot) {
//       setErrorMsg("Please upload the payment screenshot.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setErrorMsg("");
//       setUploadProgress(0);

//       // 1. Screenshot Cloudinary pe upload karo, progress track karte hue
//       const cloudinaryRes = await uploadToCloudinary(
//         screenshot,
//         setUploadProgress,
//       );

//       // 2. Sirf yeh 4 fields backend ko bhejo
//       const res = await submitDeposit({
//         investmentAmount: Number(amountInr),
//         paymentMethod,
//         url: cloudinaryRes.secure_url,
//         public_id: cloudinaryRes.public_id,
//       });

//       if (res?.success) {
//         dispatch(
//           showSnackbar({
//             message: "Deposit submitted! Waiting for admin approval.",
//             severity: "success",
//           }),
//         );
//         await fetchUserInfo();
//         resetForm();
//         onClose();
//       } else {
//         setErrorMsg(res?.message || "Submission failed. Please try again.");
//       }
//     } catch (err) {
//       console.error("Deposit submit error:", err);
//       setErrorMsg(
//         err?.response?.data?.message ||
//           "Something went wrong. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//       setUploadProgress(null);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       TransitionComponent={Transition}
//       onClose={onClose}
//       PaperProps={{
//         className: "!rounded-3xl !max-w-md !w-full !m-4",
//       }}
//     >
//       <div className="bg-white p-6">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-5">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">Add Funds</h2>
//             <p className="text-sm text-gray-500 mt-0.5">
//               Scan the QR, pay, then submit your details below
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* QR Code */}
//         <div className="flex flex-col items-center gap-2 mb-5">
//           <div className="w-48 h-48 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
//             {qrLoading ? (
//               <Loader2 size={28} className="text-gray-400 animate-spin" />
//             ) : qrUrl ? (
//               <img
//                 src={qrUrl}
//                 alt="Payment QR"
//                 className="w-full h-full object-contain p-2"
//               />
//             ) : (
//               <div className="flex flex-col items-center gap-2 text-gray-400">
//                 <QrCode size={28} />
//                 <p className="text-xs">QR not available</p>
//               </div>
//             )}
//           </div>
//           <p className="text-xs text-gray-400">Scan with any UPI app to pay</p>
//         </div>

//         {/* Form fields */}
//         <div className="space-y-4">
//           <div>
//             <label className="text-xs font-semibold text-gray-500 mb-1 block">
//               Amount (INR)
//             </label>
//             <input
//               type="number"
//               // value={amountInr}
//               value={actualAmount}

//               onChange={(e) => setAmountInr(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
//               onWheel={(e) => e.target.blur()}
//               disabled={loading}
//             />
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-gray-500 mb-1 block">
//               Payment Screenshot
//             </label>
//             <label
//               htmlFor="deposit-screenshot"
//               className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
//             >
//               <UploadCloud size={18} className="text-blue-600 flex-shrink-0" />
//               <span className="text-sm text-gray-600 truncate">
//                 {screenshot ? screenshot.name : "Tap to upload screenshot"}
//               </span>
//             </label>
//             <input
//               id="deposit-screenshot"
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="hidden"
//               disabled={loading}
//             />

//             {screenshotPreview && (
//               <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
//                 <img
//                   src={screenshotPreview}
//                   alt="Preview"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             )}
//           </div>

//           {uploadProgress !== null && (
//             <div>
//               <div className="flex justify-between text-xs text-gray-500 mb-1">
//                 <span>Uploading screenshot...</span>
//                 <span>{uploadProgress}%</span>
//               </div>
//               <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
//                 <div
//                   className="h-full bg-blue-600 transition-all duration-200 rounded-full"
//                   style={{ width: `${uploadProgress}%` }}
//                 />
//               </div>
//             </div>
//           )}

//           {errorMsg && (
//             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
//               {errorMsg}
//             </p>
//           )}

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
//           >
//             {loading && <Loader2 size={16} className="animate-spin" />}
//             {loading ? "Submitting..." : "Submit Deposit"}
//           </button>
//         </div>
//       </div>
//     </Dialog>
//   );
// }

import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { QrCode, UploadCloud, X, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/slices/snackbarSlice";
import useFetchProfile from "../../hooks/useFetchProfile";
import { getQr, submitDeposit } from "../../api/user.api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const DEFAULT_AMOUNT_INR = 999;

const uploadToCloudinary = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Cloudinary upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
};

export default function LLDStakeModal({
  open,
  onClose,
  actualAmount,
  displayAmount,
}) {
  const { fetchUserInfo } = useFetchProfile();
  const dispatch = useDispatch();

  const [qrUrl, setQrUrl] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);

  const [amountInr, setAmountInr] = useState(DEFAULT_AMOUNT_INR);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open) return;
    fetchQr();
  }, [open]);

  useEffect(() => {
    if (actualAmount) {
      setAmountInr(actualAmount);
    }
  }, [actualAmount]);

  const fetchQr = async () => {
    try {
      setQrLoading(true);
      const res = await getQr();
      setQrUrl(res?.qrCode || null);
    } catch (err) {
      console.error("QR fetch failed:", err);
      dispatch(
        showSnackbar({
          message: "Failed to load payment QR.",
          severity: "error",
        }),
      );
    } finally {
      setQrLoading(false);
    }
  };

  const resetForm = () => {
    setAmountInr(actualAmount || DEFAULT_AMOUNT_INR);
    setPaymentMethod("UPI");
    setScreenshot(null);
    setScreenshotPreview(null);
    setUploadProgress(null);
    setErrorMsg("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Only image files are allowed for payment proof.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Screenshot must be under 5MB.");
      return;
    }

    setErrorMsg("");
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!amountInr || Number(amountInr) <= 0) {
      setErrorMsg("Enter a valid amount.");
      return;
    }
    if (!screenshot) {
      setErrorMsg("Please upload the payment screenshot.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setUploadProgress(0);

      const cloudinaryRes = await uploadToCloudinary(
        screenshot,
        setUploadProgress,
      );

      // 2. Sirf yeh 4 fields backend ko bhejo (actualAmount = amountInr)
      const res = await submitDeposit({
        investmentAmount: Number(amountInr),
        paymentMethod,
        url: cloudinaryRes.secure_url,
        public_id: cloudinaryRes.public_id,
      });

      if (res?.success) {
        dispatch(
          showSnackbar({
            message: "Deposit submitted! Waiting for admin approval.",
            severity: "success",
          }),
        );
        await fetchUserInfo();
        resetForm();
        onClose();
      } else {
        setErrorMsg(res?.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Deposit submit error:", err);
      setErrorMsg(
        err?.response?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      PaperProps={{
        className: "!rounded-3xl !max-w-md !w-full !m-4",
      }}
    >
      <div className="bg-white p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Funds</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Scan the QR, pay, then submit your details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="w-48 h-48 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
            {qrLoading ? (
              <Loader2 size={28} className="text-gray-400 animate-spin" />
            ) : qrUrl ? (
              <img
                src={qrUrl}
                alt="Payment QR"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <QrCode size={28} />
                <p className="text-xs">QR not available</p>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400">Scan with any UPI app to pay</p>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Amount (INR)
            </label>
            {/* UI me displayAmount dikhaao (1199), lekin payload me actualAmount (999) jayega */}
            <input
              type="text"
              value={`₹${displayAmount || actualAmount}`}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white transition cursor-not-allowed"
              disabled
            />
            {/* Hidden field jo actualAmount hold karega (agar logic me zaroorat pade) */}
            <input type="hidden" value={actualAmount} readOnly />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Payment Screenshot
            </label>
            <label
              htmlFor="deposit-screenshot"
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
            >
              <UploadCloud size={18} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">
                {screenshot ? screenshot.name : "Tap to upload screenshot"}
              </span>
            </label>
            <input
              id="deposit-screenshot"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />

            {screenshotPreview && (
              <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={screenshotPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {uploadProgress !== null && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading screenshot...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Submitting..." : "Submit Deposit"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
