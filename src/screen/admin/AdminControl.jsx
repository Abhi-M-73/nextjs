import React, { useEffect, useState } from "react";
import { QrCode, UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ReusableButton from "../../components/ui/ReusableButton";
import { getQr, uploadQr } from "../../api/admin.api";
import ReusableForm from "../../components/ui/ReusableForm";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ── QR Preview ────────────────────────────────────────────────────────────────
const QRPreview = ({ src }) => {
  if (!src) return null;
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <p className="text-xs text-yellow-500/80 font-medium tracking-wide uppercase">
        QR Preview
      </p>
      <div className="border border-yellow-500/30 rounded-xl overflow-hidden w-44 h-44 flex items-center justify-center bg-[#1a1a1a] shadow-inner">
        <img
          src={src}
          alt="QR Code"
          className="object-contain w-full h-full p-2"
        />
      </div>
    </div>
  );
};

// ── Upload Progress Bar ───────────────────────────────────────────────────────
const UploadProgress = ({ progress }) => {
  if (progress === null) return null;
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-yellow-500/80 mb-1 font-medium">
        <span>Uploading...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-[#1a1a1a] border border-yellow-500/20 overflow-hidden">
        <div
          className="h-full bg-yellow-400 transition-all duration-200 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ── Cloudinary direct upload with progress (XHR, since fetch has no progress support) ──
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
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else {
        reject(new Error("Cloudinary upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
};

// ── Main Component ────────────────────────────────────────────────────────────
const AdminControl = () => {
  const [qrFile, setQrFile] = useState(null);
  const [qrPreviewSrc, setQrPreviewSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  useEffect(() => {
    fetchExistingQr();
  }, []);

  const fetchExistingQr = async () => {
    try {
      const res = await getQr();
      if (res?.data?.qrCode?.url) {
        setQrPreviewSrc(res.data.qrCode.url);
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      toast.error("Failed to load existing QR.");
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed for QR.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }

    setQrFile(file);
    const localUrl = URL.createObjectURL(file);
    setQrPreviewSrc(localUrl);
  };

  const handleSubmit = async () => {
    if (!qrFile) return;

    try {
      setLoading(true);
      setUploadProgress(0);

      const cloudinaryResponse = await uploadToCloudinary(
        qrFile,
        setUploadProgress,
      );

      const res = await uploadQr({
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      });

      if (res?.success) {
        toast.success("QR uploaded successfully!");
        await fetchExistingQr();
        setQrFile(null);
      } else {
        toast.error("Failed to save QR link. Please try again.");
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div
      style={{ "--btnColor": "#facc15", "--btnHoverColor": "#eab308" }}
      className="max-w-2xl mx-auto p-4"
    >
      <div className="bg-[#111111] border border-yellow-500/30 rounded-2xl p-6 space-y-5 shadow-2xl shadow-yellow-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <QrCode size={20} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold tracking-wide">
              Payment QR Code
            </h2>
            <p className="text-xs text-gray-400">
              Users will scan this to send deposits
            </p>
          </div>
        </div>

        <div className="[&_label]:text-yellow-500/90 [&_input]:border-yellow-500/30 [&_input]:bg-[#1a1a1a] [&_input]:text-white">
          <ReusableForm
            label="Upload Payment QR Code"
            name="qrFile"
            type="file"
            onChange={handleChange}
            icon={UploadCloud}
            required
            disabled={loading}
          />
        </div>

        <UploadProgress progress={uploadProgress} />

        <QRPreview src={qrPreviewSrc} />

        <ReusableButton
          label={loading ? `Uploading... ${uploadProgress ?? 0}%` : "Save QR"}
          onClick={handleSubmit}
          loading={loading}
          disabled={!qrFile || loading}
          icon={!loading ? CheckCircle2 : undefined}
          className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
        />
      </div>
    </div>
  );
};

export default AdminControl;
