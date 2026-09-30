import React, { useEffect, useState, useRef } from "react";
import { addBankAccount, getBankAccount } from "../api/user.api";
import toast from "react-hot-toast";
import {
  Building2,
  CreditCard,
  Hash,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  XCircle,
  UploadCloud,
  FileText,
  Eye,
  Trash2,
  ArrowRight,
  RotateCcw,
  Loader2,
  AlertTriangle,
  Info,
  UserCheck,
  Lock,
  ExternalLink,
  X,
  BadgeCheck,
} from "lucide-react";

// Modal for viewing full-size document
const DocumentPreviewModal = ({ doc, onClose }) => {
  if (!doc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{doc.title}</h3>
              <p className="text-[11px] text-slate-400">KYC Verification Document</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 flex items-center justify-center bg-slate-900/5 min-h-[300px] max-h-[75vh] overflow-auto">
          {doc.url ? (
            <img
              src={doc.url}
              alt={doc.title}
              className="max-h-[68vh] w-auto max-w-full rounded-lg object-contain shadow-sm"
            />
          ) : (
            <div className="text-slate-400 text-sm">No preview available</div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Document Upload Box
const DocumentUploadBox = ({
  title,
  subtitle,
  file,
  previewUrl,
  existingUrl,
  onFileSelect,
  onRemove,
  onView,
  required = true,
  disabled = false,
}) => {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const currentPreview = previewUrl || existingUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-slate-700 flex items-center gap-1.5">
          {title}
          {required && <span className="text-rose-500 text-xs">*</span>}
        </label>
        {currentPreview && (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <CheckCircle2 size={11} /> Ready
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />

      {currentPreview ? (
        <div className="relative group rounded-xl border border-slate-200 bg-slate-50/70 p-3 overflow-hidden flex items-center justify-between transition-all hover:border-blue-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
              <img
                src={currentPreview}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <FileText size={20} className="text-slate-400 absolute" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {file ? file.name : `${title}.jpg`}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Document attached"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onView(currentPreview, title)}
              className="p-2 rounded-lg bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
              title="Preview document"
            >
              <Eye size={15} />
            </button>
            {!disabled && (
              <button
                type="button"
                onClick={onRemove}
                className="p-2 rounded-lg bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                title="Remove file"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 p-4 transition-all flex flex-col items-center justify-center text-center cursor-pointer group ${
            disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <UploadCloud size={20} />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            Click to upload <span className="text-slate-400 font-normal">or drag & drop</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">{subtitle || "PNG, JPG up to 10MB"}</p>
        </div>
      )}
    </div>
  );
};

const UserBankAccount = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bankData, setBankData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields
  const [form, setForm] = useState({
    bankName: "",
    bankHoldername: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  // KYC Files (File objects for upload)
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [bankPassbook, setBankPassbook] = useState(null);

  // Local object URLs for previews
  const [previewFront, setPreviewFront] = useState("");
  const [previewBack, setPreviewBack] = useState("");
  const [previewPassbook, setPreviewPassbook] = useState("");

  // Preview Modal
  const [modalDoc, setModalDoc] = useState(null);

  const fetchBankAccount = async () => {
    try {
      setLoading(true);
      const res = await getBankAccount();

      if (res?.success && res?.data) {
        const bank = res.data;
        setBankData(bank);
        setForm({
          bankName: bank.bankName || "",
          bankHoldername: bank.bankHoldername || "",
          accountNumber: bank.accountNumber || "",
          confirmAccountNumber: bank.accountNumber || "",
          ifscCode: bank.ifscCode || "",
          upiId: bank.upiId || "",
        });

        // Set existing document previews if available
        if (bank.aadhaarFront) setPreviewFront(bank.aadhaarFront);
        if (bank.aadhaarBack) setPreviewBack(bank.aadhaarBack);
        if (bank.bankPassbook) setPreviewPassbook(bank.bankPassbook);
      }
    } catch (err) {
      console.log("Error fetching bank account:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (file, type) => {
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    if (type === "front") {
      setAadhaarFront(file);
      setPreviewFront(objectUrl);
    } else if (type === "back") {
      setAadhaarBack(file);
      setPreviewBack(objectUrl);
    } else if (type === "passbook") {
      setBankPassbook(file);
      setPreviewPassbook(objectUrl);
    }
  };

  const handleRemoveFile = (type) => {
    if (type === "front") {
      setAadhaarFront(null);
      setPreviewFront("");
    } else if (type === "back") {
      setAadhaarBack(null);
      setPreviewBack("");
    } else if (type === "passbook") {
      setBankPassbook(null);
      setPreviewPassbook("");
    }
  };

  const handleOpenDocModal = (url, title) => {
    setModalDoc({ url, title });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (
      !form.bankName?.trim() ||
      !form.bankHoldername?.trim() ||
      !form.accountNumber?.trim() ||
      !form.ifscCode?.trim() ||
      !form.upiId?.trim()
    ) {
      toast.error("Please fill all bank details");
      return;
    }

    // Require documents if new KYC or re-submitting rejected KYC
    const needsDocs =
      !bankData ||
      !bankData.kycStatus ||
      bankData.kycStatus === "not_submitted" ||
      bankData.kycStatus === "rejected";

    if (needsDocs) {
      if (!aadhaarFront && !previewFront) {
        toast.error("Please upload Aadhaar Card (Front Side)");
        return;
      }
      if (!aadhaarBack && !previewBack) {
        toast.error("Please upload Aadhaar Card (Back Side)");
        return;
      }
      if (!bankPassbook && !previewPassbook) {
        toast.error("Please upload Bank Passbook or Cheque");
        return;
      }
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("bankName", form.bankName.trim());
      formData.append("bankHoldername", form.bankHoldername.trim());
      formData.append("accountNumber", form.accountNumber.trim());
      formData.append("ifscCode", form.ifscCode.trim().toUpperCase());
      formData.append("upiId", form.upiId.trim());

      if (aadhaarFront) formData.append("aadhaarFront", aadhaarFront);
      if (aadhaarBack) formData.append("aadhaarBack", aadhaarBack);
      if (bankPassbook) formData.append("bankPassbook", bankPassbook);

      const res = await addBankAccount(formData);

      toast.success(
        res?.data?.message ||
          res?.message ||
          "KYC and bank details submitted successfully!",
      );

      // Re-fetch to display the updated state (e.g. pending)
      await fetchBankAccount();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit KYC details",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
            <Loader2 size={24} className="text-blue-600 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-600">
            Loading KYC & Bank details...
          </p>
          <p className="text-xs text-slate-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  const kycStatus = bankData?.kycStatus || "not_submitted";
  const isApproved = kycStatus === "approved";
  const isPending = kycStatus === "pending";
  const isRejected = kycStatus === "rejected";

  const inputClass =
    "w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50/80 border border-slate-200 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:py-10 pb-28">
      <div className="max-w-xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Members KYC & Bank
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your verification & payout accounts
              </p>
            </div>
          </div>

          {/* Quick status pill */}
          {isApproved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold shadow-sm">
              <BadgeCheck size={16} />
              <span>Verified</span>
            </div>
          )}
          {isPending && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold shadow-sm">
              <Clock3 size={15} className="animate-pulse" />
              <span>In Review</span>
            </div>
          )}
          {isRejected && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold shadow-sm">
              <XCircle size={15} />
              <span>Rejected</span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* CASE 1: APPROVED (PREMIUM VERIFIED CARD)                      */}
        {/* ------------------------------------------------------------- */}
        {isApproved && !isEditing && (
          <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_45px_rgba(15,23,42,0.06)]">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

            <div className="p-6">
              {/* Premium Verification Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-white shadow-lg shadow-emerald-500/20">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
                      <ShieldCheck size={26} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black tracking-wide">
                          KYC VERIFIED
                        </h2>
                        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                      </div>
                      <p className="text-xs text-emerald-100 font-medium mt-0.5">
                        Your identity and bank account are fully approved
                      </p>
                    </div>
                  </div>
                  <BadgeCheck size={32} className="text-emerald-200 shrink-0 opacity-80" />
                </div>
              </div>

              {/* Verified Details Grid */}
              <div className="mt-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registered Bank Account
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">
                      Account Holder
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {bankData?.bankHoldername || "—"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">
                      Bank Name
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {bankData?.bankName || "—"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">
                      Account Number
                    </p>
                    <p className="text-sm font-mono font-bold text-slate-800 mt-1">
                      {bankData?.accountNumber || "—"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">
                      IFSC Code
                    </p>
                    <p className="text-sm font-mono font-bold text-slate-800 mt-1">
                      {bankData?.ifscCode?.toUpperCase() || "—"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 md:col-span-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">
                      UPI ID
                    </p>
                    <p className="text-sm font-mono font-bold text-blue-600 mt-1">
                      {bankData?.upiId || "—"}
                    </p>
                  </div>
                </div>

                {/* Verified Documents Previews */}
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Verified Documents
                  </h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    {bankData?.aadhaarFront && (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDocModal(
                            bankData.aadhaarFront,
                            "Aadhaar Card (Front)",
                          )
                        }
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-center flex flex-col items-center gap-1.5 transition-all group"
                      >
                        <FileText
                          size={18}
                          className="text-slate-500 group-hover:text-blue-600"
                        />
                        <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                          Aadhaar Front
                        </span>
                        <span className="text-[9px] text-blue-600 font-semibold flex items-center gap-0.5">
                          <Eye size={10} /> View
                        </span>
                      </button>
                    )}

                    {bankData?.aadhaarBack && (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDocModal(
                            bankData.aadhaarBack,
                            "Aadhaar Card (Back)",
                          )
                        }
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-center flex flex-col items-center gap-1.5 transition-all group"
                      >
                        <FileText
                          size={18}
                          className="text-slate-500 group-hover:text-blue-600"
                        />
                        <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                          Aadhaar Back
                        </span>
                        <span className="text-[9px] text-blue-600 font-semibold flex items-center gap-0.5">
                          <Eye size={10} /> View
                        </span>
                      </button>
                    )}

                    {bankData?.bankPassbook && (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDocModal(
                            bankData.bankPassbook,
                            "Bank Passbook",
                          )
                        }
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-center flex flex-col items-center gap-1.5 transition-all group"
                      >
                        <FileText
                          size={18}
                          className="text-slate-500 group-hover:text-blue-600"
                        />
                        <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                          Passbook
                        </span>
                        <span className="text-[9px] text-blue-600 font-semibold flex items-center gap-0.5">
                          <Eye size={10} /> View
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2.5 text-emerald-800 text-xs font-medium">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>
                    Payouts and withdrawals are enabled directly to this verified account.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 2: PENDING (IN REVIEW CARD)                              */}
        {/* ------------------------------------------------------------- */}
        {isPending && !isEditing && (
          <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_45px_rgba(15,23,42,0.06)]">
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

            <div className="p-6">
              {/* Review Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white shadow-lg shadow-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
                    <Clock3 size={26} className="text-white animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-wide">
                      KYC UNDER REVIEW
                    </h2>
                    <p className="text-xs text-amber-100 font-medium mt-0.5">
                      Your documents are being checked by our compliance team
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Documents Submitted</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Aadhaar front, back & passbook uploaded successfully
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 animate-pulse">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-amber-700">Under Admin Verification</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Verification typically takes between 24 to 48 business hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-slate-600">KYC Approval</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Payout account will be activated upon approval
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submitted Details Snapshot */}
              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Submitted Account Snapshot
                </h3>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Holder
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5 truncate">
                      {bankData?.bankHoldername || "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Bank
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5 truncate">
                      {bankData?.bankName || "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Account No.
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5 truncate font-mono">
                      {bankData?.accountNumber || "—"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      UPI ID
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5 truncate font-mono">
                      {bankData?.upiId || "—"}
                    </p>
                  </div>
                </div>

                {/* Uploaded Documents Preview */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {bankData?.aadhaarFront && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenDocModal(bankData.aadhaarFront, "Aadhaar Front")
                      }
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye size={12} /> Aadhaar Front
                    </button>
                  )}
                  {bankData?.aadhaarBack && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenDocModal(bankData.aadhaarBack, "Aadhaar Back")
                      }
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye size={12} /> Aadhaar Back
                    </button>
                  )}
                  {bankData?.bankPassbook && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenDocModal(bankData.bankPassbook, "Passbook")
                      }
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye size={12} /> Passbook
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 3: REJECTED NOTICE (RE-SUBMISSION PROMPT)                */}
        {/* ------------------------------------------------------------- */}
        {isRejected && !isEditing && (
          <div className="relative overflow-hidden bg-white rounded-3xl border border-rose-200 shadow-[0_12px_45px_rgba(244,63,94,0.08)]">
            <div className="h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

            <div className="p-6">
              {/* Rejection Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <XCircle size={26} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    KYC Verification Rejected
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your KYC could not be approved. Please review the reason below and re-submit.
                  </p>
                </div>
              </div>

              {/* Reason Box */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 mb-5">
                <p className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">
                  Rejection Reason from Admin
                </p>
                <p className="text-sm font-semibold text-rose-900 mt-1">
                  {bankData?.rejectionReason ||
                    "Documents were blurry or did not match the account holder name."}
                </p>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Re-submit KYC Documents
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 4: FORM VIEW (NEW SUBMISSION OR RE-SUBMISSION)          */}
        {/* ------------------------------------------------------------- */}
        {(!isApproved && !isPending && !isRejected) || isEditing ? (
          <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_45px_rgba(15,23,42,0.06)]">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500" />

            <div className="p-5 md:p-7">
              {/* Form Intro */}
              <div className="mb-6 flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <UserCheck size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    {isEditing ? "Re-submit Your Verification" : "Members KYC Verification"}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-4">
                    Please provide your bank details and upload clear copies of your Aadhaar card and passbook for approval.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Section 1: Bank Information */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <Building2 size={16} className="text-blue-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      1. Bank Account Information
                    </h2>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Bank Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Bank Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          name="bankName"
                          value={form.bankName}
                          onChange={handleChange}
                          placeholder="e.g. State Bank of India, HDFC Bank"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    {/* Bank Holder Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Bank Holder Name (As per Aadhaar) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <UserCheck
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          name="bankHoldername"
                          value={form.bankHoldername}
                          onChange={handleChange}
                          placeholder="Enter account holder's full name"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Account Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          name="accountNumber"
                          value={form.accountNumber}
                          onChange={handleChange}
                          placeholder="Enter your bank account number"
                          inputMode="numeric"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    {/* IFSC Code */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        IFSC Code <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Hash
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          name="ifscCode"
                          value={form.ifscCode}
                          onChange={handleChange}
                          placeholder="e.g. SBIN0001234"
                          className={`${inputClass} uppercase`}
                          required
                        />
                      </div>
                    </div>

                    {/* UPI ID */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        UPI ID <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Smartphone
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          name="upiId"
                          value={form.upiId}
                          onChange={handleChange}
                          placeholder="e.g. username@okaxis / username@paytm"
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Members KYC Upload */}
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      2. Members KYC Documents
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {/* Aadhaar Card – Front Side */}
                    <DocumentUploadBox
                      title="Aadhaar Card – Front Side"
                      subtitle="Upload clear front side image showing photo & name"
                      file={aadhaarFront}
                      previewUrl={previewFront}
                      onFileSelect={(f) => handleFileSelect(f, "front")}
                      onRemove={() => handleRemoveFile("front")}
                      onView={handleOpenDocModal}
                      required={true}
                    />

                    {/* Aadhaar Card – Back Side */}
                    <DocumentUploadBox
                      title="Aadhaar Card – Back Side"
                      subtitle="Upload clear back side image showing address"
                      file={aadhaarBack}
                      previewUrl={previewBack}
                      onFileSelect={(f) => handleFileSelect(f, "back")}
                      onRemove={() => handleRemoveFile("back")}
                      onView={handleOpenDocModal}
                      required={true}
                    />

                    {/* Bank Passbook Upload */}
                    <DocumentUploadBox
                      title="Bank Passbook Upload"
                      subtitle="Upload passbook front page or cancelled cheque"
                      file={bankPassbook}
                      previewUrl={previewPassbook}
                      onFileSelect={(f) => handleFileSelect(f, "passbook")}
                      onRemove={() => handleRemoveFile("passbook")}
                      onView={handleOpenDocModal}
                      required={true}
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="mt-2 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="group relative w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Uploading & Submitting KYC...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit KYC for Verification</span>
                        <ArrowRight
                          size={17}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Cancel Re-submission
                    </button>
                  )}
                </div>
              </form>

              {/* Security info */}
              <div className="mt-5 flex items-start gap-2.5 px-1">
                <Lock size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-4 text-slate-400">
                  Your Aadhaar and bank details are encrypted using banking-grade security and processed strictly for identity verification and payouts.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer Note */}
        <div className="text-center pb-4">
          <p className="text-[11px] text-slate-400">
            Need help with KYC verification? Contact 24/7 Member Support.
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {modalDoc && (
        <DocumentPreviewModal
          doc={modalDoc}
          onClose={() => setModalDoc(null)}
        />
      )}
    </div>
  );
};

export default UserBankAccount;
