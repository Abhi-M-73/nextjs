import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getWithdrawalHistory,
  approveWithdrawReq,
  rejectWithdrawReq,
} from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Wallet,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const DEFAULT_LIMIT = 50;

const INITIAL_FILTERS = {
  page: 1,
  limit: DEFAULT_LIMIT,
  status: "",
  startDate: "",
  endDate: "",
  search: "",
};

const EMPTY_BUCKET = { count: 0, amount: 0, fee: 0, net: 0 };

const INITIAL_STATS = {
  all: EMPTY_BUCKET,
  pending: EMPTY_BUCKET,
  approved: EMPTY_BUCKET,
  rejected: EMPTY_BUCKET,
};

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const DATE_PRESETS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "custom", label: "Custom Range" },
];

// Formats a Date as YYYY-MM-DD in the browser's local timezone (not UTC)
const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Returns Monday of the week for the given date
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
};

// Converts a preset into { startDate, endDate } strings
const getPresetRange = (preset) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (preset) {
    case "today":
      return { startDate: toLocalDateStr(today), endDate: toLocalDateStr(today) };
    case "yesterday": {
      const y = new Date(today);
      y.setDate(today.getDate() - 1);
      return { startDate: toLocalDateStr(y), endDate: toLocalDateStr(y) };
    }
    case "this_week":
      return { startDate: toLocalDateStr(getMonday(today)), endDate: toLocalDateStr(today) };
    case "last_week": {
      const thisMonday = getMonday(today);
      const lastMonday = new Date(thisMonday);
      lastMonday.setDate(thisMonday.getDate() - 7);
      const lastSunday = new Date(thisMonday);
      lastSunday.setDate(thisMonday.getDate() - 1);
      return { startDate: toLocalDateStr(lastMonday), endDate: toLocalDateStr(lastSunday) };
    }
    case "this_month":
      return {
        startDate: toLocalDateStr(new Date(today.getFullYear(), today.getMonth(), 1)),
        endDate: toLocalDateStr(today),
      };
    case "last_month":
      return {
        startDate: toLocalDateStr(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        endDate: toLocalDateStr(new Date(today.getFullYear(), today.getMonth(), 0)),
      };
    default:
      return { startDate: "", endDate: "" };
  }
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatINR = (value) => inrFormatter.format(Number(value || 0));

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
};

// Merges API stats with defaults so a missing bucket never crashes the cards
const normalizeStats = (stats) => ({
  all: { ...EMPTY_BUCKET, ...(stats?.all || {}) },
  pending: { ...EMPTY_BUCKET, ...(stats?.pending || {}) },
  approved: { ...EMPTY_BUCKET, ...(stats?.approved || {}) },
  rejected: { ...EMPTY_BUCKET, ...(stats?.rejected || {}) },
});

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

const DetailRow = ({ label, value, valueClass = "text-gray-900 font-medium", last }) => (
  <div className={`flex justify-between py-1.5 ${last ? "" : "border-b border-gray-100"}`}>
    <span className="text-gray-500">{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);

const ModalShell = ({ onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
    >
      {children}
    </div>
  </div>
);

const StatCard = ({ title, icon: Icon, gradient, bucket, lines, active, loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-sm transition-all duration-300 hover:shadow-lg ${active ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-100"
      }`}
  >
    <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />

    <div className="mb-3 flex items-center justify-between">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <div className={`rounded-xl bg-gradient-to-br ${gradient} p-2 text-white shadow`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>

    <h3 className="text-2xl font-bold tracking-tight text-slate-900">
      {loading ? "—" : bucket.count}
      <span className="ml-1 text-xs font-medium text-slate-400">requests</span>
    </h3>

    <div className="mt-3 space-y-1 text-xs">
      {lines.map(({ label, key, className }) => (
        <div key={label} className="flex justify-between">
          <span className="text-slate-500">{label}</span>
          <span className={`font-semibold ${className || "text-slate-700"}`}>
            {loading ? "—" : formatINR(bucket[key])}
          </span>
        </div>
      ))}
    </div>
  </button>
);

// ---------------------------------------------------------------------------
// Modals
// ---------------------------------------------------------------------------

const BankDetailsModal = ({ withdrawal, onClose }) => {
  if (!withdrawal) return null;

  return (
    <ModalShell onClose={onClose}>
      <h3 className="mb-1 text-base font-semibold text-gray-900">Bank Details</h3>
      <p className="mb-3 text-sm text-gray-500">
        {withdrawal?.userId?.name || withdrawal?.userId?.username} — {formatINR(withdrawal?.amount)}
      </p>

      <div className="space-y-2 text-sm">
        <DetailRow label="Bank Name" value={withdrawal?.bankName || "—"} />
        <DetailRow label="Account Number" value={withdrawal?.accountNumber || "—"} />
        <DetailRow label="IFSC Code" value={withdrawal?.ifscCode?.toUpperCase() || "—"} />
        <DetailRow label="UPI ID" value={withdrawal?.upiId || "—"} />
        <DetailRow label="Requested Amount" value={formatINR(withdrawal?.amount)} />
        <DetailRow
          label="Fee"
          value={formatINR(withdrawal?.feeAmount)}
          valueClass="text-red-600 font-medium"
        />
        <DetailRow
          label="Payout Amount"
          value={formatINR(withdrawal?.netAmount)}
          valueClass="text-emerald-600 font-bold"
          last
        />
      </div>

      {withdrawal?.processedBy && (
        <p className="mt-3 text-xs text-gray-400">
          Processed by {withdrawal.processedBy.name || withdrawal.processedBy.username}
        </p>
      )}

      {withdrawal?.status === "rejected" && withdrawal?.rejectionReason && (
        <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-2.5">
          <p className="mb-1 text-xs uppercase tracking-wide text-red-500">Rejection Reason</p>
          <p className="text-sm text-red-600">{withdrawal.rejectionReason}</p>
        </div>
      )}

      <button
        onClick={onClose}
        className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        Close
      </button>
    </ModalShell>
  );
};

const RejectReasonModal = ({ withdrawal, onClose, onConfirm, submitting }) => {
  const [reason, setReason] = useState("");

  if (!withdrawal) return null;

  const handleSubmit = () => {
    if (!reason.trim() || submitting) return;
    onConfirm(withdrawal._id, reason.trim());
  };

  return (
    <ModalShell onClose={submitting ? undefined : onClose}>
      <h3 className="mb-1 text-base font-semibold text-gray-900">Reject Withdrawal</h3>
      <p className="mb-3 text-sm text-gray-500">
        {withdrawal?.userId?.username} — {formatINR(withdrawal?.amount)}
      </p>

      <label className="text-xs uppercase tracking-wide text-gray-500">Rejection Reason</label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        maxLength={300}
        placeholder="Enter reason for rejection..."
        className="mt-1 w-full resize-none rounded-lg border border-gray-200 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200"
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={onClose}
          disabled={submitting}
          className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!reason.trim() || submitting}
          className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </ModalShell>
  );
};

const ApproveConfirmModal = ({ withdrawal, onClose, onConfirm, submitting }) => {
  if (!withdrawal) return null;

  return (
    <ModalShell onClose={submitting ? undefined : onClose}>
      <h3 className="mb-1 text-base font-semibold text-gray-900">Approve Withdrawal?</h3>
      <p className="mb-3 text-sm text-gray-500">
        {withdrawal?.userId?.name || withdrawal?.userId?.username}
      </p>

      <div className="mb-4 space-y-2 text-sm">
        <DetailRow label="Requested Amount" value={formatINR(withdrawal?.amount)} />
        <DetailRow
          label="Fee"
          value={formatINR(withdrawal?.feeAmount)}
          valueClass="text-red-600 font-medium"
        />
        <div className="mt-1 flex items-center justify-between rounded-lg bg-emerald-50 px-2.5 py-2">
          <span className="font-semibold text-emerald-700">Pay This Much</span>
          <span className="text-base font-bold text-emerald-700">
            {formatINR(withdrawal?.netAmount)}
          </span>
        </div>
      </div>

      <p className="mb-3 text-xs text-gray-400">
        After approval, this amount stays in the "Payout Amount" column. Verify the bank/UPI
        details via "View Details" and pay exactly this amount.
      </p>

      <div className="flex gap-2">
        <button
          onClick={onClose}
          disabled={submitting}
          className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(withdrawal)}
          disabled={submitting}
          className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {submitting ? "Approving..." : "Yes, Approve"}
        </button>
      </div>
    </ModalShell>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const AdminWithdrawalRequests = () => {
  // Data
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Single source of truth for the API query
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // UI-only state
  const [datePreset, setDatePreset] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal / action state
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Ignore responses from outdated requests
  const requestIdRef = useRef(0);

  // -------------------------------------------------------------------------
  // Fetch
  // -------------------------------------------------------------------------

  const fetchWithdrawals = useCallback(async (currentFilters) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const params = {
        page: Number(currentFilters.page) || 1,
        limit: Number(currentFilters.limit) || DEFAULT_LIMIT,
      };
      if (currentFilters.status) params.status = currentFilters.status;
      if (currentFilters.startDate) params.startDate = currentFilters.startDate;
      if (currentFilters.endDate) params.endDate = currentFilters.endDate;
      if (currentFilters.search) params.search = currentFilters.search;

      const res = await getWithdrawalHistory(params);
      if (requestId !== requestIdRef.current) return;

      if (res?.success) {
        setData(Array.isArray(res.data) ? res.data : []);
        setTotalRecords(res?.pagination?.total ?? 0);
        setStats(normalizeStats(res?.stats));
        setLastUpdated(new Date());
      } else {
        setData([]);
        setTotalRecords(0);
        setStats(INITIAL_STATS);
        toast.error(res?.message || "Failed to fetch withdrawals");
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("Fetch withdrawals error:", error);
      setData([]);
      setTotalRecords(0);
      setStats(INITIAL_STATS);
      toast.error(error?.response?.data?.message || "Failed to fetch withdrawals");
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for at least one date before fetching a custom range
    if (datePreset === "custom" && !filters.startDate && !filters.endDate) return;
    fetchWithdrawals(filters);
  }, [filters, datePreset, fetchWithdrawals]);

  // Re-fetch current view (used after approve / reject so stats stay accurate)
  const refresh = () => fetchWithdrawals(filters);

  // -------------------------------------------------------------------------
  // Filter handlers (all reset to page 1)
  // -------------------------------------------------------------------------

  const handleStatusChange = (status) => {
    setFilters((prev) => (prev.status === status ? prev : { ...prev, status, page: 1 }));
  };

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    setDatePreset(preset);
    // Custom starts empty; the user picks both dates
    setFilters((prev) => ({ ...prev, ...getPresetRange(preset), page: 1 }));
  };

  const handleCustomDateChange = (field) => (e) => {
    const value = e.target.value;
    setFilters((prev) => {
      const next = { ...prev, [field]: value, page: 1 };
      if (next.startDate && next.endDate && next.startDate > next.endDate) {
        toast.error("Start date cannot be after end date");
        return prev;
      }
      return next;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const search = searchTerm.trim();
    setFilters((prev) =>
      prev.search === search && prev.page === 1 ? prev : { ...prev, search, page: 1 },
    );
  };

  const handleResetFilters = () => {
    setDatePreset("all");
    setSearchTerm("");
    setFilters((prev) => ({ ...INITIAL_FILTERS, limit: prev.limit }));
  };

  // DynamicTable sends a PrimeReact-style event ({ page, first, rows }); page is 0-based
  const handleTablePageChange = (event) => {
    if (typeof event === "number") {
      setFilters((prev) => ({ ...prev, page: event }));
      return;
    }

    const rows = Number(event?.rows) || DEFAULT_LIMIT;
    const page =
      (event?.page !== undefined ? Number(event.page) : Math.floor((event?.first || 0) / rows)) + 1;

    setFilters((prev) => {
      // Changing rows per page always restarts from page 1
      if (rows !== prev.limit) return { ...prev, limit: rows, page: 1 };
      if (page === prev.page) return prev;
      return { ...prev, page };
    });
  };

  // -------------------------------------------------------------------------
  // Approve / Reject
  // -------------------------------------------------------------------------

  const confirmApprove = async (row) => {
    const id = row?._id;
    if (!id || submitting) return;

    try {
      setSubmitting(true);
      const res = await approveWithdrawReq(id);

      if (res?.success !== false) {
        toast.success(`Approved! Pay ${formatINR(row?.netAmount)} to this user.`);
        setApproveTarget(null);
        refresh();
      } else {
        toast.error(res?.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error(error?.response?.data?.message || "Approval failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectConfirm = async (id, reason) => {
    if (!id || submitting) return;

    try {
      setSubmitting(true);
      const res = await rejectWithdrawReq(id, { rejectionReason: reason });

      if (res?.success !== false) {
        toast.success(res?.message || "Withdrawal rejected");
        setRejectTarget(null);
        refresh();
      } else {
        toast.error(res?.message || "Rejection failed");
      }
    } catch (error) {
      console.error("Reject error:", error);
      toast.error(error?.response?.data?.message || "Rejection failed");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Table columns
  // -------------------------------------------------------------------------

  const columns = [
    { key: "sr", label: "#", isIndex: true },
    {
      key: "username",
      label: "Username",
      render: (_, row) => (
        <span className="font-medium uppercase">{row?.userId?.username || "—"}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (_, row) => <span className="font-medium">{row?.userId?.email || "N/A"}</span>,
    },
    {
      key: "amount",
      label: "Requested",
      render: (val) => formatINR(val),
    },
    {
      key: "feeAmount",
      label: "Fee",
      render: (val) => <span className="font-medium text-red-600">{formatINR(val)}</span>,
    },
    {
      key: "netAmount",
      label: "Payout Amount",
      render: (val) => <span className="font-bold text-emerald-600">{formatINR(val)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const key = String(val || "").toLowerCase();
        return (
          <span
            className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE[key] || "bg-gray-100 text-gray-600"
              }`}
          >
            {val || "—"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (val) => (val ? dateFormatter(val) : "—"),
    },
    {
      key: "view",
      label: "Bank Details",
      render: (_, row) => (
        <button
          onClick={() => setViewTarget(row)}
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          View Details
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) =>
        String(row?.status || "").toLowerCase() === "pending" ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setApproveTarget(row)}
              disabled={submitting}
              className="flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              Approve
            </button>
            <button
              onClick={() => setRejectTarget(row)}
              disabled={submitting}
              className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              <XCircle size={14} />
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs capitalize text-gray-400">{row?.status}</span>
        ),
    },
  ];

  // Clicking a card toggles the matching status tab
  const statCards = [
    {
      status: "",
      title: "Total Requests",
      icon: Wallet,
      gradient: "from-indigo-500 to-purple-600",
      bucket: stats.all,
      lines: [
        { label: "Requested", key: "amount" },
        { label: "Payout value", key: "net" },
      ],
    },
    {
      status: "pending",
      title: "Pending",
      icon: Clock,
      gradient: "from-amber-400 to-orange-500",
      bucket: stats.pending,
      lines: [
        { label: "Requested", key: "amount" },
        { label: "To be paid", key: "net", className: "text-amber-600" },
      ],
    },
    {
      status: "approved",
      title: "Approved",
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-600",
      bucket: stats.approved,
      lines: [
        { label: "Requested", key: "amount" },
        { label: "Paid out", key: "net", className: "text-emerald-600" },
        { label: "Fee earned", key: "fee", className: "text-indigo-600" },
      ],
    },
    {
      status: "rejected",
      title: "Rejected",
      icon: XCircle,
      gradient: "from-rose-500 to-pink-600",
      bucket: stats.rejected,
      lines: [{ label: "Requested", key: "amount", className: "text-rose-600" }],
    },
  ];

  const hasActiveFilters =
    filters.status || filters.search || filters.startDate || filters.endDate || datePreset !== "all";

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="w-full overflow-auto p-5">
      {/* Stat cards (respect date + search filters, ignore status tab) */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            {...card}
            loading={loading}
            active={filters.status === card.status}
            onClick={() => handleStatusChange(card.status)}
          />
        ))}
      </div>

      {/* Status tabs */}
      <div className="mb-3 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() => handleStatusChange(tab.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${filters.status === tab.value
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
          <Calendar className="h-4 w-4 text-slate-400" />
          <select
            value={datePreset}
            onChange={handlePresetChange}
            className="bg-transparent text-sm text-slate-700 outline-none"
          >
            {DATE_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {datePreset === "custom" && (
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={filters.startDate}
              max={filters.endDate || undefined}
              onChange={handleCustomDateChange("startDate")}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
            />
            <span className="text-sm text-slate-500">to</span>
            <input
              type="date"
              value={filters.endDate}
              min={filters.startDate || undefined}
              onChange={handleCustomDateChange("endDate")}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
            />
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Search username, email, UPI, account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Search
          </button>
        </form>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-300"
          >
            Reset
          </button>
        )}

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Same DynamicTable API as the deposit page: lazy mode = server-side pagination */}
      <DynamicTable
        title="Withdrawal History"
        data={data}
        columns={columns}
        loading={loading}
        dataKey="_id"
        lazy={true}
        totalRecords={totalRecords}
        defaultRows={DEFAULT_LIMIT}
        rowsPerPageOptions={[25, 50, 100, 200]}
        onPageChange={handleTablePageChange}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <span>
          Page {filters.page} of {Math.max(1, Math.ceil(totalRecords / filters.limit))} · {totalRecords}{" "}
          records
        </span>
        <span>Last sync: {lastUpdated?.toLocaleString("en-IN") || "Never"}</span>
      </div>

      <BankDetailsModal withdrawal={viewTarget} onClose={() => setViewTarget(null)} />



    </div>
  );
};

export default AdminWithdrawalRequests;