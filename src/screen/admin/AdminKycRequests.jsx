import React, { useEffect, useState, useMemo } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  RefreshCw,
  FileText,
  Eye,
  ExternalLink,
  X,
  AlertTriangle,
  User,
  Building2,
  CreditCard,
  Hash,
  Smartphone,
  Check,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  getAdminKycList,
  approveAdminKyc,
  rejectAdminKyc,
} from "../../api/admin.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import toast from "react-hot-toast";

// ==========================================
// DOCUMENT FULL PREVIEW MODAL
// ==========================================
const KycReviewModal = ({
  item,
  onClose,
  onApprove,
  onReject,
  submitting,
}) => {
  const [activeDocTab, setActiveDocTab] = useState("front"); // 'front' | 'back' | 'passbook'

  if (!item) return null;

  const user = item.userId || {};
  const isPending = item.kycStatus === "pending";

  const getDocUrl = () => {
    if (activeDocTab === "front") return item.aadhaarFront;
    if (activeDocTab === "back") return item.aadhaarBack;
    if (activeDocTab === "passbook") return item.bankPassbook;
    return null;
  };

  const currentDocUrl = getDocUrl();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Review KYC Documents
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.kycStatus === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.kycStatus === "rejected"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.kycStatus || "pending"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.name || user.username || "Member"} ({user.email || "No email"})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Member & Bank Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Holder Name
              </p>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                {item.bankHoldername || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Bank Name
              </p>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                {item.bankName || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Account Number
              </p>
              <p className="text-xs font-mono font-bold text-slate-800 mt-0.5 truncate">
                {item.accountNumber || "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                IFSC / UPI
              </p>
              <p className="text-xs font-mono font-bold text-blue-600 mt-0.5 truncate">
                {item.ifscCode?.toUpperCase()} • {item.upiId}
              </p>
            </div>
          </div>

          {/* Rejection reason alert if already rejected */}
          {item.kycStatus === "rejected" && item.rejectionReason && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-800">
              <span className="font-bold">Rejection Reason: </span>
              {item.rejectionReason}
            </div>
          )}

          {/* Document Tabs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setActiveDocTab("front")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeDocTab === "front"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FileText size={14} />
                Aadhaar Front Side
                {item.aadhaarFront && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveDocTab("back")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeDocTab === "back"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FileText size={14} />
                Aadhaar Back Side
                {item.aadhaarBack && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveDocTab("passbook")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeDocTab === "passbook"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FileText size={14} />
                Bank Passbook
                {item.bankPassbook && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                )}
              </button>
            </div>

            {/* Document Image Viewer */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-900/5 min-h-[380px] max-h-[500px] flex items-center justify-center overflow-auto p-4">
              {currentDocUrl ? (
                <div className="relative group max-h-[460px] max-w-full">
                  <img
                    src={currentDocUrl}
                    alt={activeDocTab}
                    className="max-h-[460px] w-auto max-w-full rounded-xl object-contain shadow-md mx-auto"
                  />
                  <a
                    href={currentDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-md flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <ExternalLink size={13} />
                    Open Full Image
                  </a>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400">
                  <FileText size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold">No document uploaded</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    User has not provided this document
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReject(item)}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-all flex items-center gap-1.5"
            >
              <XCircle size={15} />
              Reject KYC
            </button>

            <button
              onClick={() => onApprove(item)}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              Approve KYC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// APPROVE CONFIRMATION MODAL
// ==========================================
const ApproveConfirmModal = ({ item, onClose, onConfirm, submitting }) => {
  if (!item) return null;

  const user = item.userId || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
          <CheckCircle2 size={26} />
        </div>

        <h3 className="text-lg font-extrabold text-slate-900">
          Approve Member KYC?
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-5">
          This will verify the member's account. They will be marked as{" "}
          <strong className="text-emerald-700 font-semibold">KYC Verified</strong> and can request payouts to their registered bank account.
        </p>

        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">User:</span>
            <span className="font-bold text-slate-800">
              {user.name || user.username || "Member"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Bank:</span>
            <span className="font-bold text-slate-800">{item.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Account No:</span>
            <span className="font-mono font-bold text-slate-800">
              {item.accountNumber}
            </span>
          </div>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item)}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60"
          >
            {submitting ? "Approving..." : "Yes, Approve KYC"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// REJECT REASON MODAL
// ==========================================
const RejectReasonModal = ({ item, onClose, onConfirm, submitting }) => {
  const [reason, setReason] = useState("");

  if (!item) return null;

  const user = item.userId || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    onConfirm(item, reason.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <XCircle size={26} />
        </div>

        <h3 className="text-lg font-extrabold text-slate-900">
          Reject Member KYC
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Specify why the KYC is being rejected for{" "}
          <strong className="text-slate-800">
            {user.name || user.username || "Member"}
          </strong>
          . This reason will be displayed to the user so they can correct it.
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Rejection Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Front Aadhaar is blurry, or Name does not match bank passbook"
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 resize-none"
            required
          />

          <div className="flex gap-2.5 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || submitting}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: ADMIN KYC REQUESTS
// ==========================================
const AdminKycRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'approved' | 'rejected'

  // Modals state
  const [reviewItem, setReviewItem] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchKycList = async () => {
    try {
      setLoading(true);
      const res = await getAdminKycList();
      if (res?.success) {
        setData(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Error fetching KYC list:", err);
      // Fallback empty if backend endpoint isn't up yet
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycList();
  }, []);

  // Filter and search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const user = item.userId || {};
      const status = item.kycStatus || "pending";

      // Filter by status tab
      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      // Filter by search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const usernameMatch = user.username?.toLowerCase().includes(q);
        const nameMatch = (user.name || item.bankHoldername)
          ?.toLowerCase()
          .includes(q);
        const emailMatch = user.email?.toLowerCase().includes(q);
        const bankMatch = item.bankName?.toLowerCase().includes(q);
        const accMatch = item.accountNumber?.toLowerCase().includes(q);

        return (
          usernameMatch || nameMatch || emailMatch || bankMatch || accMatch
        );
      }

      return true;
    });
  }, [data, search, statusFilter]);

  // Counts
  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter((d) => (d.kycStatus || "pending") === "pending")
      .length;
    const approved = data.filter((d) => d.kycStatus === "approved").length;
    const rejected = data.filter((d) => d.kycStatus === "rejected").length;
    return { total, pending, approved, rejected };
  }, [data]);

  // Approve action
  const handleConfirmApprove = async (item) => {
    const id = item._id;
    try {
      setSubmitting(true);
      const res = await approveAdminKyc(id);

      if (res?.success !== false) {
        toast.success(res?.message || "KYC approved successfully!");
        setData((prev) =>
          prev.map((d) =>
            d._id === id
              ? {
                  ...d,
                  kycStatus: "approved",
                  reviewedAt: new Date().toISOString(),
                }
              : d,
          ),
        );
        setApproveItem(null);
        setReviewItem(null);
      } else {
        toast.error(res?.message || "Approval failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Approval failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Reject action
  const handleConfirmReject = async (item, reason) => {
    const id = item._id;
    try {
      setSubmitting(true);
      const res = await rejectAdminKyc(id, { reason });

      if (res?.success !== false) {
        toast.success(res?.message || "KYC rejected");
        setData((prev) =>
          prev.map((d) =>
            d._id === id
              ? {
                  ...d,
                  kycStatus: "rejected",
                  rejectionReason: reason,
                  reviewedAt: new Date().toISOString(),
                }
              : d,
          ),
        );
        setRejectItem(null);
        setReviewItem(null);
      } else {
        toast.error(res?.message || "Rejection failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Rejection failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Members KYC Verification
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted Aadhaar cards and bank passbooks for approval or rejection
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchKycList}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-sm flex items-center gap-2 self-start md:self-auto transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Records
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Submissions
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats.total}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            All registered KYC records
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-amber-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
            Pending Review
          </p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {stats.pending}
          </p>
          <span className="text-[10px] text-amber-600/80 mt-0.5 block">
            Needs admin review
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-emerald-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Approved
          </p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {stats.approved}
          </p>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">
            Verified members
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-rose-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
            Rejected
          </p>
          <p className="text-2xl font-black text-rose-700 mt-1">
            {stats.rejected}
          </p>
          <span className="text-[10px] text-rose-600/80 mt-0.5 block">
            Awaiting user re-submission
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "all", label: "All", count: stats.total },
            { key: "pending", label: "Pending", count: stats.pending },
            { key: "approved", label: "Approved", count: stats.approved },
            { key: "rejected", label: "Rejected", count: stats.rejected },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                statusFilter === tab.key
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, bank or account..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Member Info</th>
                <th className="py-3.5 px-4">Bank Details</th>
                <th className="py-3.5 px-4">Uploaded Documents</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw size={20} className="animate-spin text-blue-600" />
                      <p className="text-xs font-semibold">Loading KYC requests...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-1.5">
                      <ShieldCheck size={32} className="text-slate-300" />
                      <p className="text-xs font-bold text-slate-600">
                        No KYC records found
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {search
                          ? "Try a different search term"
                          : "No members have submitted KYC under this filter"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const user = item.userId || {};
                  const status = item.kycStatus || "pending";

                  return (
                    <tr
                      key={item._id || index}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {index + 1}
                      </td>

                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {(user.username || user.name || "U")[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-4">
                              {user.name || user.username || "Member"}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              @{user.username || "—"} • {user.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Bank Details */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-bold text-slate-800">
                            {item.bankName}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500">
                            Acc: {item.accountNumber}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            IFSC: {item.ifscCode?.toUpperCase()} • UPI: {item.upiId}
                          </p>
                        </div>
                      </td>

                      {/* Documents Chips */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            onClick={() => setReviewItem(item)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer border flex items-center gap-1 transition-all ${
                              item.aadhaarFront
                                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                : "bg-slate-100 text-slate-400 border-slate-200"
                            }`}
                          >
                            <FileText size={10} /> Aadhaar Front
                          </span>

                          <span
                            onClick={() => setReviewItem(item)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer border flex items-center gap-1 transition-all ${
                              item.aadhaarBack
                                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                : "bg-slate-100 text-slate-400 border-slate-200"
                            }`}
                          >
                            <FileText size={10} /> Aadhaar Back
                          </span>

                          <span
                            onClick={() => setReviewItem(item)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer border flex items-center gap-1 transition-all ${
                              item.bankPassbook
                                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                : "bg-slate-100 text-slate-400 border-slate-200"
                            }`}
                          >
                            <FileText size={10} /> Passbook
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {dateFormatter(item.updatedAt || item.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                            <CheckCircle2 size={12} /> Approved
                          </span>
                        )}
                        {status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200">
                            <Clock3 size={12} className="animate-pulse" /> Pending
                          </span>
                        )}
                        {status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View All Docs Button */}
                          <button
                            onClick={() => setReviewItem(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors flex items-center gap-1"
                            title="View documents & review"
                          >
                            <Eye size={13} />
                            <span>Review</span>
                          </button>

                          {/* Quick Approve (if not approved) */}
                          {status !== "approved" && (
                            <button
                              onClick={() => setApproveItem(item)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="Approve KYC"
                            >
                              <Check size={14} strokeWidth={2.5} />
                            </button>
                          )}

                          {/* Quick Reject (if not rejected) */}
                          {status !== "rejected" && (
                            <button
                              onClick={() => setRejectItem(item)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="Reject KYC"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewItem && (
        <KycReviewModal
          item={reviewItem}
          onClose={() => setReviewItem(null)}
          onApprove={(item) => {
            setApproveItem(item);
          }}
          onReject={(item) => {
            setRejectItem(item);
          }}
          submitting={submitting}
        />
      )}

      {/* Approve Modal */}
      {approveItem && (
        <ApproveConfirmModal
          item={approveItem}
          onClose={() => setApproveItem(null)}
          onConfirm={handleConfirmApprove}
          submitting={submitting}
        />
      )}

      {/* Reject Modal */}
      {rejectItem && (
        <RejectReasonModal
          item={rejectItem}
          onClose={() => setRejectItem(null)}
          onConfirm={handleConfirmReject}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default AdminKycRequests;
