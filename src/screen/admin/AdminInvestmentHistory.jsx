import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getAdminDepositHistory,
  approveDeposit,
  rejectDeposit,
} from "../../api/admin.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import DynamicTable from "../../components/ui/DynamicTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  ImageIcon,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Clock3,
  Search,
  RefreshCw,
  ChevronDown,
  Copy,
  Check,
  CreditCard,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ── Helpers ─────────────────────────────────────────────────────────────────

// Formats a Date as YYYY-MM-DD in the browser's local timezone (not UTC)
const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Returns Monday of the week for the given date (week starts on Monday)
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatINR = (value) => Number(value || 0).toLocaleString("en-IN");

// Fixed amount shown for every deposit in the UI and exports (DB values are ignored for display)
const FIXED_DEPOSIT_AMOUNT = 1199;

const EMPTY_STATS = {
  totalAmount: 0,
  totalCount: 0,
  approvedAmount: 0,
  approvedCount: 0,
  pendingAmount: 0,
  pendingCount: 0,
  rejectedAmount: 0,
  rejectedCount: 0,
};

// Recalculates card amounts from counts so totals match the fixed per-deposit amount
const withFixedAmounts = (summary) => {
  const s = { ...EMPTY_STATS, ...(summary || {}) };
  return {
    ...s,
    totalAmount: (s.totalCount || 0) * FIXED_DEPOSIT_AMOUNT,
    approvedAmount: (s.approvedCount || 0) * FIXED_DEPOSIT_AMOUNT,
    pendingAmount: (s.pendingCount || 0) * FIXED_DEPOSIT_AMOUNT,
    rejectedAmount: (s.rejectedCount || 0) * FIXED_DEPOSIT_AMOUNT,
  };
};

const DATE_PRESETS = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "this_week", label: "This Week" },
  { id: "last_week", label: "Last Week" },
  { id: "this_month", label: "This Month" },
  { id: "custom", label: "Custom Date" },
];

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const DEFAULT_ROWS = 100;

const AdminDepositHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Pagination state
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  // Ref keeps latest rows value without re-triggering the filter effect
  const rowsRef = useRef(DEFAULT_ROWS);

  // Filter state
  const [datePreset, setDatePreset] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // KPI card totals (comes from backend "summary", always matches active filters)
  const [stats, setStats] = useState(EMPTY_STATS);

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  // Copied UTR tracker
  const [copiedUtr, setCopiedUtr] = useState(null);

  // Dialog state
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Builds query params shared by the table fetch and the export fetch
  const buildFilterParams = useCallback(() => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    if (appliedSearch.trim()) params.search = appliedSearch.trim();
    return params;
  }, [startDate, endDate, statusFilter, appliedSearch]);

  // ── Main data fetcher ───────────────────────────────────────────────────
  const fetchDeposits = useCallback(
    async (pageNum = 1, limitNum = rowsRef.current) => {
      try {
        setLoading(true);
        const res = await getAdminDepositHistory({
          ...buildFilterParams(),
          page: pageNum,
          limit: limitNum,
        });

        if (res?.success) {
          setData(res?.data || []);
          // Backend sends total inside "pagination"
          setTotalRecords(res?.pagination?.total ?? res?.data?.length ?? 0);
          // Backend sends card totals as "summary"; amounts are recalculated with the fixed value
          setStats(withFixedAmounts(res?.stats));
          setPage(pageNum);
          setRows(limitNum);
          rowsRef.current = limitNum;
        } else {
          setData([]);
          setTotalRecords(0);
          setStats(EMPTY_STATS);
        }
      } catch (error) {
        console.error("Error fetching deposit history:", error);
        toast.error("Failed to load deposit history.");
        setData([]);
        setTotalRecords(0);
        setStats(EMPTY_STATS);
      } finally {
        setLoading(false);
      }
    },
    [buildFilterParams],
  );

  // Refetch from page 1 whenever any filter changes
  useEffect(() => {
    // Wait for at least one date before fetching a custom range
    if (datePreset === "custom" && !startDate && !endDate) return;
    fetchDeposits(1, rowsRef.current);
  }, [fetchDeposits, datePreset, startDate, endDate]);

  // ── Filter handlers ─────────────────────────────────────────────────────
  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (preset === "all") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "today") {
      setStartDate(toLocalDateStr(today));
      setEndDate(toLocalDateStr(today));
    } else if (preset === "this_week") {
      setStartDate(toLocalDateStr(getMonday(today)));
      setEndDate(toLocalDateStr(today));
    } else if (preset === "last_week") {
      const thisMonday = getMonday(today);
      const lastMonday = new Date(thisMonday);
      lastMonday.setDate(thisMonday.getDate() - 7);
      const lastSunday = new Date(thisMonday);
      lastSunday.setDate(thisMonday.getDate() - 1);
      setStartDate(toLocalDateStr(lastMonday));
      setEndDate(toLocalDateStr(lastSunday));
    } else if (preset === "this_month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(toLocalDateStr(firstDay));
      setEndDate(toLocalDateStr(today));
    } else if (preset === "custom") {
      // Clear dates so the user picks a fresh range
      setStartDate("");
      setEndDate("");
    }
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(searchTerm);
    setPage(1);
  };

  const handleResetFilters = () => {
    setDatePreset("all");
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setSearchTerm("");
    setAppliedSearch("");
    setPage(1);
  };

  // Table pagination change
  const handlePageChange = (event) => {
    const newRows = event.rows || rowsRef.current;
    const newPage =
      (event.page !== undefined
        ? event.page
        : Math.floor((event.first || 0) / newRows)) + 1;
    fetchDeposits(newPage, newRows);
  };

  // Copy UTR to clipboard
  const handleCopyUtr = async (utr) => {
    if (!utr) return;
    try {
      await navigator.clipboard.writeText(utr);
      setCopiedUtr(utr);
      toast.success("UTR copied to clipboard!");
      setTimeout(() => setCopiedUtr(null), 2000);
    } catch {
      toast.error("Could not copy UTR.");
    }
  };

  // ── Approve flow ────────────────────────────────────────────────────────
  const handleApproveClick = (row) => {
    setApproveTarget({
      id: row._id,
      username: row.userId?.username || "this user",
      amount: FIXED_DEPOSIT_AMOUNT,
    });
  };

  const confirmApprove = async () => {
    if (!approveTarget) return;
    try {
      setActionLoading(true);
      const res = await approveDeposit({ id: approveTarget.id });
      if (res?.success) {
        toast.success("Deposit approved successfully!");
        setApproveTarget(null);
        fetchDeposits(page, rows);
      } else {
        toast.error(res?.message || "Approval failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Approval failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Reject flow ─────────────────────────────────────────────────────────
  const handleRejectClick = (row) => {
    setRejectTarget({
      id: row._id,
      username: row.userId?.username || "this user",
    });
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }
    try {
      setActionLoading(true);
      const res = await rejectDeposit({
        id: rejectTarget.id,
        reason: rejectReason.trim(),
      });
      if (res?.success) {
        toast.success("Deposit rejected.");
        setRejectTarget(null);
        setRejectReason("");
        fetchDeposits(page, rows);
      } else {
        toast.error(res?.message || "Rejection failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Rejection failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Export (all matching records) ───────────────────────────────────────
  const fetchAllForExport = async () => {
    try {
      setExportLoading(true);
      const res = await getAdminDepositHistory({
        ...buildFilterParams(),
        all: "true",
      });
      if (res?.success && Array.isArray(res?.data)) {
        return res.data;
      }
      toast.error("Could not fetch all records, exporting current page only.");
      return data;
    } catch (err) {
      console.error("Export fetch error:", err);
      toast.error("Could not fetch all records, exporting current page only.");
      return data;
    } finally {
      setExportLoading(false);
    }
  };

  const getPeriodLabel = () => {
    if (datePreset === "today") return "Today";
    if (datePreset === "this_week") return "This Week";
    if (datePreset === "last_week") return "Last Week";
    if (datePreset === "this_month") return "This Month";
    if (startDate || endDate)
      return `${startDate || "..."} to ${endDate || "..."}`;
    return "All Time";
  };

  // Word (.doc) report
  const handleDownloadWord = async () => {
    const exportData = await fetchAllForExport();
    if (!exportData?.length) {
      toast.error("No deposit records to export!");
      return;
    }

    const period = getPeriodLabel();
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Deposit Management Report</title>
        <style>
          body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; margin: 30px; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
          h1 { color: #1e40af; font-size: 20pt; margin: 0 0 6px 0; font-weight: bold; }
          .sub { color: #64748b; font-size: 10pt; margin: 0; }
          .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .kpi-table td { padding: 12px; border: 1px solid #cbd5e1; background-color: #f8fafc; }
          .kpi-title { font-size: 9pt; text-transform: uppercase; color: #64748b; font-weight: bold; letter-spacing: 0.5px; }
          .kpi-value { font-size: 16pt; font-weight: bold; color: #0f172a; margin-top: 4px; }
          h2 { color: #0f172a; font-size: 13pt; margin: 20px 0 10px 0; }
          .data-table { width: 100%; border-collapse: collapse; font-size: 10pt; }
          .data-table th { background-color: #2563eb; color: white; padding: 10px 8px; text-align: left; font-size: 9pt; border: 1px solid #2563eb; }
          .data-table td { padding: 8px 8px; border: 1px solid #e2e8f0; }
          .data-table tr:nth-child(even) { background-color: #f8fafc; }
          .amount { font-family: 'Consolas', monospace; font-weight: bold; color: #15803d; }
          .badge-approved { color: #15803d; font-weight: bold; }
          .badge-pending { color: #b45309; font-weight: bold; }
          .badge-rejected { color: #b91c1c; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 9pt; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BINEXT - DEPOSIT MANAGEMENT REPORT</h1>
          <p class="sub">Generated on: ${new Date().toLocaleString("en-IN")} | Filter Period: <strong>${period}</strong> | Status: <strong>${statusFilter.toUpperCase()}</strong></p>
        </div>

        <table class="kpi-table">
          <tr>
            <td>
              <div class="kpi-title">Total Deposits</div>
              <div class="kpi-value">₹${formatINR(stats.totalAmount)} <span style="font-size: 11pt; color: #64748b;">(${stats.totalCount || 0} txns)</span></div>
            </td>
            <td>
              <div class="kpi-title">Approved Volume</div>
              <div class="kpi-value" style="color: #16a34a;">₹${formatINR(stats.approvedAmount)} <span style="font-size: 11pt; color: #64748b;">(${stats.approvedCount || 0})</span></div>
            </td>
            <td>
              <div class="kpi-title">Pending Verification</div>
              <div class="kpi-value" style="color: #d97706;">₹${formatINR(stats.pendingAmount)} <span style="font-size: 11pt; color: #64748b;">(${stats.pendingCount || 0})</span></div>
            </td>
            <td>
              <div class="kpi-title">Rejected Deposits</div>
              <div class="kpi-value" style="color: #dc2626;">₹${formatINR(stats.rejectedAmount)} <span style="font-size: 11pt; color: #64748b;">(${stats.rejectedCount || 0})</span></div>
            </td>
          </tr>
        </table>

        <h2>Deposit Transaction Records (${exportData.length} records)</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Name</th>
              <th>Amount (INR)</th>
              <th>UTR / Reference</th>
              <th>Method</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Admin Response</th>
            </tr>
          </thead>
          <tbody>
            ${exportData
              .map(
                (d, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>@${(d.userId?.username || "—").toUpperCase()}</td>
                <td>${d.userId?.name || "—"}</td>
                <td class="amount">₹${formatINR(FIXED_DEPOSIT_AMOUNT)}</td>
                <td>${d.utr || "—"}</td>
                <td>${d.paymentMethod || "—"}</td>
                <td class="badge-${d.status}">${(d.status || "").toUpperCase()}</td>
                <td>${d.createdAt ? new Date(d.createdAt).toLocaleString("en-IN") : "—"}</td>
                <td>${d.response || "—"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          This report contains confidential financial data for admin operations. Generated by Binext Admin Console.
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + docContent], {
      type: "application/msword;charset=utf-8",
    });
    saveAs(
      blob,
      `Deposit_Report_${datePreset}_${toLocalDateStr(new Date())}.doc`,
    );
    setShowExportMenu(false);
    toast.success("Word report downloaded successfully!");
  };

  // Excel (.xlsx) report
  const handleDownloadExcel = async () => {
    const exportData = await fetchAllForExport();
    if (!exportData?.length) {
      toast.error("No deposit records to export!");
      return;
    }

    const exportRows = exportData.map((d, i) => ({
      "#": i + 1,
      Username: (d.userId?.username || "—").toUpperCase(),
      Name: d.userId?.name || "—",
      Email: d.userId?.email || "—",
      "Amount (INR)": FIXED_DEPOSIT_AMOUNT,
      "UTR Number": d.utr || "—",
      Method: d.paymentMethod || "—",
      Status: (d.status || "").toUpperCase(),
      "Submitted Date": d.createdAt
        ? new Date(d.createdAt).toLocaleString("en-IN")
        : "—",
      "Approved / Rejected Date":
        d.approvedAt || d.rejectedAt
          ? new Date(d.approvedAt || d.rejectedAt).toLocaleString("en-IN")
          : "—",
      "Added By": d.addedBy || "—",
      "Admin Note / Response": d.response || "—",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Deposits");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(
      blob,
      `Deposit_Report_${datePreset}_${toLocalDateStr(new Date())}.xlsx`,
    );
    setShowExportMenu(false);
    toast.success("Excel report exported successfully!");
  };

  // Print / PDF
  const handlePrintPdf = () => {
    setShowExportMenu(false);
    window.print();
  };

  // ── Table columns ───────────────────────────────────────────────────────
  const columns = [
    { key: "sr", label: "#", isIndex: true },
    {
      key: "userId",
      label: "User",
      render: (val) => (
        <div className="leading-tight">
          <p className="font-semibold text-slate-800 uppercase text-xs">
            {val?.username || "N/A"}
          </p>
          <p className="text-[11px] text-slate-500">{val?.name || "—"}</p>
        </div>
      ),
    },
    {
      key: "amount_inr",
      label: "Amount",
      render: () => (
        <span className="font-bold text-slate-900 text-sm">
          ₹{formatINR(FIXED_DEPOSIT_AMOUNT)}
        </span>
      ),
    },
    {
      key: "utr",
      label: "UTR / Ref No.",
      render: (val) =>
        val ? (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {val}
            </span>
            <button
              onClick={() => handleCopyUtr(val)}
              className="text-slate-400 hover:text-slate-700 transition p-0.5"
              title="Copy UTR"
            >
              {copiedUtr === val ? (
                <Check size={13} className="text-emerald-600" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">N/A</span>
        ),
    },
    {
      key: "paymentMethod",
      label: "Method",
      render: (val) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
          {val || "—"}
        </span>
      ),
    },
    {
      key: "proofImage",
      label: "Proof",
      render: (val) => {
        // Supports both { url } objects and plain string URLs
        const url = typeof val === "string" ? val : val?.url;
        return url ? (
          <button
            onClick={() => setPreviewImage(url)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium border border-indigo-200 transition"
          >
            <ImageIcon size={13} />
            View
          </button>
        ) : (
          <span className="text-xs text-slate-400 italic">No file</span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      isBadge: true,
      render: (val) => {
        if (val === "approved") {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={12} />
              Approved
            </span>
          );
        }
        if (val === "rejected") {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              <XCircle size={12} />
              Rejected
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock3 size={12} />
            Pending
          </span>
        );
      },
    },
    {
      key: "response",
      label: "Admin Note",
      render: (val) =>
        val ? (
          <span
            className="text-xs text-slate-600 max-w-[150px] truncate block"
            title={val}
          >
            {val}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: "createdAt",
      label: "Submitted Date",
      render: (val) => dateFormatter(val),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) =>
        row.status === "pending" ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleApproveClick(row)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <CheckCircle2 size={13} />
              Approve
            </button>
            <button
              onClick={() => handleRejectClick(row)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <XCircle size={13} />
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium capitalize">
            {row.status}
          </span>
        ),
    },
  ];

  const hasActiveFilters =
    datePreset !== "all" ||
    statusFilter !== "all" ||
    appliedSearch ||
    searchTerm;

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 md:p-8">
      {/* Printable report header (visible only when printing) */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Binext Deposit Management Report
        </h1>
        <p className="text-sm text-slate-600">
          Generated: {new Date().toLocaleString("en-IN")} | Period:{" "}
          {getPeriodLabel()} | Status: {statusFilter.toUpperCase()}
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Deposit History & Management
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {rows} / Page
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Filter weekly/monthly records, verify proofs, approve deposits, and
            export reports.
          </p>
        </div>

        {/* Refresh & Export */}
        <div className="flex items-center gap-2.5 print:hidden">
          <button
            onClick={() => fetchDeposits(page, rows)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-blue-600" : ""}
            />
            Refresh
          </button>

          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu((prev) => !prev)}
              disabled={exportLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-60"
            >
              {exportLoading ? (
                <CircularProgress size={14} sx={{ color: "white" }} />
              ) : (
                <Download size={14} />
              )}
              Export Report
              <ChevronDown size={14} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Download Options
                </div>

                <button
                  onClick={handleDownloadExcel}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition text-left"
                >
                  <FileSpreadsheet size={16} className="text-emerald-600" />
                  <div>
                    <p className="font-semibold">Excel Spreadsheet (.xlsx)</p>
                    <p className="text-[10px] text-slate-400">
                      All filtered deposit records
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleDownloadWord}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition text-left"
                >
                  <FileText size={16} className="text-blue-600" />
                  <div>
                    <p className="font-semibold">Word Document (.doc)</p>
                    <p className="text-[10px] text-slate-400">
                      Formatted summary & table
                    </p>
                  </div>
                </button>

                <button
                  onClick={handlePrintPdf}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left"
                >
                  <Printer size={16} className="text-slate-600" />
                  <div>
                    <p className="font-semibold">Printable / PDF View</p>
                    <p className="text-[10px] text-slate-400">
                      Browser print or save as PDF
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Deposits
            </p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {loading ? "..." : `₹${formatINR(stats.totalAmount)}`}
            </p>
            <p className="text-xs text-slate-400">
              {stats.totalCount || 0} total requests
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Approved Volume
            </p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              {loading ? "..." : `₹${formatINR(stats.approvedAmount)}`}
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              {stats.approvedCount || 0} successful deposits
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              {stats.pendingCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              )}
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wider">
                Pending Verification
              </p>
            </div>
            <p className="text-xl font-bold text-amber-600 mt-0.5">
              {loading ? "..." : `₹${formatINR(stats.pendingAmount)}`}
            </p>
            <p className="text-xs text-amber-600 font-medium">
              {stats.pendingCount || 0} awaiting approval
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Rejected Deposits
            </p>
            <p className="text-xl font-bold text-rose-600 mt-0.5">
              {loading ? "..." : `₹${formatINR(stats.rejectedAmount)}`}
            </p>
            <p className="text-xs text-rose-500">
              {stats.rejectedCount || 0} rejected
            </p>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-6 space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Calendar size={14} /> Period:
            </span>
            {DATE_PRESETS.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleDatePresetChange(btn.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  datePreset === btn.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {STATUS_TABS.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setStatusFilter(st.id);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  statusFilter === st.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          {datePreset === "custom" && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          )}

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 flex-1 w-full"
          >
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by Username, Name, Email or UTR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition"
            >
              Search
            </button>
          </form>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline px-2 py-1 whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
        <div className="w-full overflow-x-auto">
          <DynamicTable
            dataKey="_id"
            title="Deposit History Records"
            data={data}
            columns={columns}
            loading={loading}
            lazy={true}
            totalRecords={totalRecords}
            defaultRows={DEFAULT_ROWS}
            rowsPerPageOptions={[25, 50, 100, 200]}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 px-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>
            Showing page {page} of {Math.max(1, Math.ceil(totalRecords / rows))}
          </span>
        </div>
        <span>Total Records: {totalRecords}</span>
      </div>

      {/* Approve confirmation dialog */}
      <Dialog
        open={!!approveTarget}
        onClose={() => !actionLoading && setApproveTarget(null)}
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Approve Deposit?
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-slate-600">
            Are you sure you want to approve the deposit of{" "}
            <strong className="text-emerald-600">
              ₹{formatINR(approveTarget?.amount)}
            </strong>{" "}
            for user{" "}
            <strong className="text-slate-800">
              {approveTarget?.username}
            </strong>
            ?
          </p>
          <p className="text-xs text-slate-400 mt-2">
            This will activate their package / credit their balance immediately
            and cannot be undone.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setApproveTarget(null)}
            disabled={actionLoading}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmApprove}
            variant="contained"
            color="success"
            disabled={actionLoading}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            {actionLoading ? "Approving..." : "Yes, Approve Deposit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject with reason dialog */}
      <Dialog
        open={!!rejectTarget}
        onClose={() => !actionLoading && setRejectTarget(null)}
        PaperProps={{ sx: { borderRadius: "16px", p: 1, minWidth: "340px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
          Reject Deposit
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-slate-600 mb-3">
            Enter the rejection reason for{" "}
            <strong className="text-slate-800">{rejectTarget?.username}</strong>
            :
          </p>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            placeholder="e.g. Invalid UTR, transaction amount mismatch, blurred receipt..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            variant="outlined"
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRejectTarget(null)}
            disabled={actionLoading}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            color="error"
            disabled={actionLoading}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            {actionLoading ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Proof image preview dialog */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
            py: 1.5,
          }}
        >
          <span>Payment Proof Screenshot</span>
          <button
            onClick={() => setPreviewImage(null)}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2"
          >
            ✕
          </button>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            bgcolor: "#0f172a",
          }}
        >
          {previewImage && (
            <img
              src={previewImage}
              alt="Payment Proof"
              className="max-h-[75vh] w-auto rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDepositHistory;
