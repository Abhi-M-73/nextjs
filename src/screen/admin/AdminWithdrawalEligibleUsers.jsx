import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import DynamicTable from "../../components/ui/DynamicTable";
import {
  getWithdrawalEligibleUsers,
  adminApproveWithdrawal,
  adminRejectWithdrawal,
  adminApproveAllWithdrawals,
  adminRejectAllWithdrawals,
} from "../../api/admin.api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileDown,
  Banknote,
  Search,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Fee percentage used for display only (not deducted from the approved amount)
const PAYOUT_CUT_PERCENT = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

const formatINR = (val) =>
  `₹${Math.abs(Number(val) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Default jsPDF fonts cannot render the ₹ symbol, so "Rs." is used in PDFs
const formatPdfAmount = (val) =>
  `Rs. ${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Display-only helper: wallet balance after the fee is deducted
const getPayableAmount = (mainWallet) =>
  (Number(mainWallet) || 0) * (1 - PAYOUT_CUT_PERCENT / 100);

// Escapes text before inserting it into the Word report HTML
const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const AdminWithdrawalEligibleUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Date filters
  const [datePreset, setDatePreset] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  // Users the admin has just approved. Kept client-side so the payout
  // amount and bank/UPI details stay visible after the user leaves the eligible list.
  const [payoutPending, setPayoutPending] = useState([]);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    user: null,
  });
  const [approveAmount, setApproveAmount] = useState("");

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

  // -------------------------------------------------------------------------
  // Fetch
  // -------------------------------------------------------------------------

  const fetchWithdrawalEligibleUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getWithdrawalEligibleUsers(params);
      if (res?.success) {
        setData(Array.isArray(res?.data) ? res.data : []);
      } else {
        setData([]);
        toast.error(res?.message || "Failed to load eligible users");
      }
    } catch (error) {
      console.error("Fetch eligible users error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load eligible users",
      );
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchWithdrawalEligibleUsers();
  }, [fetchWithdrawalEligibleUsers]);

  // -------------------------------------------------------------------------
  // Date presets (kept for when the preset UI is enabled)
  // -------------------------------------------------------------------------

  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (preset === "all") {
      setStartDate("");
      setEndDate("");
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
      setStartDate(
        toLocalDateStr(new Date(today.getFullYear(), today.getMonth(), 1)),
      );
      setEndDate(toLocalDateStr(today));
    }
  };

  // -------------------------------------------------------------------------
  // Client-side search (date filtering is already done by the backend)
  // -------------------------------------------------------------------------

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;

    return data.filter((row) =>
      [
        row?.name,
        row?.username,
        row?.bankDetails?.bankName,
        row?.bankDetails?.accountNumber,
        row?.bankDetails?.upiId,
      ].some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, search]);

  // KPI stats
  const weeklyStats = useMemo(() => {
    const totalUsers = filteredData.length;
    const totalWallet = filteredData.reduce(
      (sum, u) => sum + Number(u.mainWallet || 0),
      0,
    );
    const totalPayable = filteredData.reduce(
      (sum, u) => sum + getPayableAmount(u.mainWallet),
      0,
    );
    const avgPayable = totalUsers > 0 ? totalPayable / totalUsers : 0;
    return { totalUsers, totalWallet, totalPayable, avgPayable };
  }, [filteredData]);

  const getPeriodLabel = () => {
    if (datePreset === "this_week") return "This Week";
    if (datePreset === "last_week") return "Last Week";
    if (datePreset === "this_month") return "This Month";
    if (startDate || endDate)
      return `${startDate || "..."} to ${endDate || "..."}`;
    return "All Time";
  };

  // -------------------------------------------------------------------------
  // Export: PDF (Name, Username, Amount only, all users across pages)
  // -------------------------------------------------------------------------

  const handleDownloadPdf = () => {
    if (!filteredData.length) {
      toast.error("No eligible records to export!");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Amount = payable after fee (same as the "Payable Balance" column)
    const rows = filteredData.map((u, i) => [
      i + 1,
      u?.name || "-",
      (u?.username || "-").toUpperCase(),
      formatPdfAmount(getPayableAmount(u?.mainWallet)),
    ]);

    // Title block on the first page
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Withdrawal Eligible Members", 40, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      `Generated: ${new Date().toLocaleString("en-IN")}  |  Period: ${getPeriodLabel()}  |  Members: ${filteredData.length}`,
      40,
      62,
    );
    doc.setTextColor(0);

    autoTable(doc, {
      startY: 78,
      head: [["#", "Name", "Username", "Amount"]],
      body: rows,
      foot: [["", "", "Total", formatPdfAmount(weeklyStats.totalPayable)]],
      showHead: "everyPage",
      showFoot: "lastPage",
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 5,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: 20,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 40, halign: "center" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 110 },
        3: { cellWidth: 110, halign: "right" },
      },
      margin: { top: 40, left: 40, right: 40, bottom: 40 },
    });

    // Page numbers are added after the table so the total page count is known
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p += 1) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - 40, pageHeight - 20, {
        align: "right",
      });
    }

    doc.save(`Withdrawal_Eligible_${toLocalDateStr(new Date())}.pdf`);
    setShowExportMenu(false);
    toast.success(`PDF downloaded with ${filteredData.length} members`);
  };

  // -------------------------------------------------------------------------
  // Export: Word (.doc)
  // -------------------------------------------------------------------------

  const handleDownloadWord = () => {
    if (!filteredData.length) {
      toast.error("No eligible records to export!");
      return;
    }

    const period = getPeriodLabel();
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Withdrawal Eligible Report</title>
        <style>
          body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; margin: 30px; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
          h1 { color: #1e40af; font-size: 20pt; margin: 0 0 6px 0; font-weight: bold; }
          .sub { color: #64748b; font-size: 10pt; margin: 0; }
          .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .kpi-table td { padding: 12px; border: 1px solid #cbd5e1; background-color: #f8fafc; }
          .kpi-title { font-size: 9pt; text-transform: uppercase; color: #64748b; font-weight: bold; }
          .kpi-value { font-size: 16pt; font-weight: bold; color: #0f172a; margin-top: 4px; }
          h2 { color: #0f172a; font-size: 13pt; margin: 20px 0 10px 0; }
          .data-table { width: 100%; border-collapse: collapse; font-size: 10pt; }
          .data-table th { background-color: #2563eb; color: white; padding: 10px 8px; text-align: left; font-size: 9pt; border: 1px solid #2563eb; }
          .data-table td { padding: 8px; border: 1px solid #e2e8f0; }
          .data-table tr:nth-child(even) { background-color: #f8fafc; }
          .amount { font-family: 'Consolas', monospace; font-weight: bold; color: #15803d; }
          .footer { margin-top: 30px; font-size: 9pt; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BINEXT - WITHDRAWAL ELIGIBLE REPORT</h1>
          <p class="sub">Generated on: ${new Date().toLocaleString("en-IN")} | Period: <strong>${escapeHtml(period)}</strong></p>
        </div>

        <table class="kpi-table">
          <tr>
            <td>
              <div class="kpi-title">Eligible Members</div>
              <div class="kpi-value">${weeklyStats.totalUsers}</div>
            </td>
            <td>
              <div class="kpi-title">Gross Wallet Volume</div>
              <div class="kpi-value">${formatINR(weeklyStats.totalWallet)}</div>
            </td>
            <td>
              <div class="kpi-title">Net Payable (After ${PAYOUT_CUT_PERCENT}% Fee)</div>
              <div class="kpi-value" style="color: #16a34a;">${formatINR(weeklyStats.totalPayable)}</div>
            </td>
          </tr>
        </table>

        <h2>Eligible Members & Bank Details</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Member Name</th>
              <th>User ID</th>
              <th>Wallet Balance</th>
              <th>Payable (${100 - PAYOUT_CUT_PERCENT}%)</th>
              <th>Bank Name</th>
              <th>Account Number</th>
              <th>IFSC Code</th>
              <th>UPI ID</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData
              .map(
                (u, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${escapeHtml(u.name || "—")}</strong></td>
                <td>@${escapeHtml((u.username || "—").toUpperCase())}</td>
                <td class="amount">${formatINR(u.mainWallet)}</td>
                <td class="amount">${formatINR(getPayableAmount(u.mainWallet))}</td>
                <td>${escapeHtml(u.bankDetails?.bankName || "—")}</td>
                <td>${escapeHtml(u.bankDetails?.accountNumber || "—")}</td>
                <td>${escapeHtml((u.bankDetails?.ifscCode || "—").toUpperCase())}</td>
                <td>${escapeHtml(u.bankDetails?.upiId || "—")}</td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          This report contains confidential financial data for admin payout operations. Generated by Binext Admin Console.
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + docContent], {
      type: "application/msword;charset=utf-8",
    });
    saveAs(blob, `Withdrawal_Eligible_${toLocalDateStr(new Date())}.doc`);
    setShowExportMenu(false);
    toast.success("Word report downloaded successfully!");
  };

  // -------------------------------------------------------------------------
  // Export: Excel (.xlsx)
  // -------------------------------------------------------------------------

  const handleDownloadExcel = () => {
    if (!filteredData.length) {
      toast.error("No eligible records to export!");
      return;
    }

    const exportRows = filteredData.map((u, i) => ({
      "#": i + 1,
      Name: u.name || "—",
      Username: (u.username || "—").toUpperCase(),
      "Wallet Balance (₹)": Number(u.mainWallet || 0),
      "Payable Balance (₹)": Number(getPayableAmount(u.mainWallet).toFixed(2)),
      "Bank Name": u.bankDetails?.bankName || "—",
      "Account Number": u.bankDetails?.accountNumber || "—",
      "IFSC Code": (u.bankDetails?.ifscCode || "—").toUpperCase(),
      "UPI ID": u.bankDetails?.upiId || "—",
      "Direct Referrals": u.directActiveReferrals || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Eligible Withdrawals");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `Withdrawal_Eligible_${toLocalDateStr(new Date())}.xlsx`);
    setShowExportMenu(false);
    toast.success("Excel report exported successfully!");
  };

  // -------------------------------------------------------------------------
  // Approve / Reject
  // -------------------------------------------------------------------------

  const openConfirm = (type, user = null) => {
    setConfirmDialog({ open: true, type, user });
    setApproveAmount(type === "approve" ? String(user?.mainWallet ?? "") : "");
  };

  const closeConfirm = () => {
    if (actionLoading) return;
    setConfirmDialog({ open: false, type: null, user: null });
    setApproveAmount("");
  };

  const numApproveAmount = Number(approveAmount);
  const maxApproveAmount = Number(confirmDialog.user?.mainWallet) || 0;

  const isApproveAmountValid =
    confirmDialog.type !== "approve" ||
    (numApproveAmount > 0 && numApproveAmount <= maxApproveAmount);

  const buildPayoutEntry = (u, amount) => ({
    _id: u._id,
    name: u?.name,
    username: u?.username,
    bankName: u?.bankDetails?.bankName,
    accountNumber: u?.bankDetails?.accountNumber,
    ifscCode: u?.bankDetails?.ifscCode,
    upiId: u?.bankDetails?.upiId,
    payoutAmount: amount,
    approvedAt: new Date().toISOString(),
  });

  const addToPayoutPending = (entries) => {
    setPayoutPending((prev) => [...entries, ...prev]);
  };

  const removeFromPayoutPending = (id) => {
    setPayoutPending((prev) => prev.filter((p) => p._id !== id));
  };

  const handleConfirm = async () => {
    const { type, user } = confirmDialog;

    if (type === "approve" && !isApproveAmountValid) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setActionLoading(true);

      if (type === "approve") {
        await adminApproveWithdrawal(user._id, numApproveAmount);
        toast.success(
          `Approved! Pay ${formatINR(numApproveAmount)} to ${user?.name || user?.username}.`,
        );
        addToPayoutPending([buildPayoutEntry(user, numApproveAmount)]);
      } else if (type === "reject") {
        await adminRejectWithdrawal(user._id);
        toast.info("Withdrawal rejected");
      } else if (type === "approveAll") {
        const userIds = filteredData.map((u) => u._id);
        const res = await adminApproveAllWithdrawals(userIds);
        toast.success(
          `${res?.data?.length || userIds.length} withdrawals approved`,
        );
        addToPayoutPending(
          filteredData.map((u) => buildPayoutEntry(u, u?.mainWallet || 0)),
        );
      } else if (type === "rejectAll") {
        const userIds = filteredData.map((u) => u._id);
        await adminRejectAllWithdrawals(userIds);
        toast.info("All withdrawals rejected");
      }

      setConfirmDialog({ open: false, type: null, user: null });
      setApproveAmount("");
      await fetchWithdrawalEligibleUsers();
    } catch (error) {
      console.error("Withdrawal action error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Table columns
  // -------------------------------------------------------------------------

  const columns = [
    { key: "sr", label: "#", isIndex: true },
    { key: "name", label: "Name", render: (val) => val || "—" },
    {
      key: "username",
      label: "Username",
      render: (val) => val?.toUpperCase() || "—",
    },
    {
      key: "mainWallet",
      label: "Wallet Balance",
      render: (val) => (
        <span className="font-semibold text-emerald-600">{formatINR(val)}</span>
      ),
    },
    {
      key: "payableBalance",
      label: `Payable Balance (after ${PAYOUT_CUT_PERCENT}% fee)`,
      render: (_, row) => (
        <span className="font-bold text-emerald-700">
          {formatINR(getPayableAmount(row?.mainWallet))}
        </span>
      ),
    },
    {
      key: "bankName",
      label: "Bank Name",
      render: (_, row) => row?.bankDetails?.bankName || "—",
    },
    {
      key: "accountNumber",
      label: "Account Number",
      render: (_, row) => row?.bankDetails?.accountNumber || "—",
    },
    {
      key: "ifscCode",
      label: "IFSC Code",
      render: (_, row) => row?.bankDetails?.ifscCode?.toUpperCase() || "—",
    },
    {
      key: "upiId",
      label: "UPI ID",
      render: (_, row) => row?.bankDetails?.upiId || "—",
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openConfirm("approve", row)}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-100"
          >
            Approve
          </button>
          <button
            onClick={() => openConfirm("reject", row)}
            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-100"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  const payoutColumns = [
    { key: "sr", label: "#", isIndex: true },
    { key: "name", label: "Name", render: (val) => val || "—" },
    {
      key: "username",
      label: "Username",
      render: (val) => val?.toUpperCase() || "—",
    },
    {
      key: "payoutAmount",
      label: "Payout Amount",
      render: (val) => (
        <span className="font-bold text-emerald-600">{formatINR(val)}</span>
      ),
    },
    { key: "bankName", label: "Bank Name", render: (val) => val || "—" },
    {
      key: "accountNumber",
      label: "Account Number",
      render: (val) => val || "—",
    },
    {
      key: "ifscCode",
      label: "IFSC Code",
      render: (val) => val?.toUpperCase() || "—",
    },
    { key: "upiId", label: "UPI ID", render: (val) => val || "—" },
    {
      key: "markPaid",
      label: "",
      render: (_, row) => (
        <button
          onClick={() => removeFromPayoutPending(row._id)}
          className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
        >
          Mark as Paid
        </button>
      ),
    },
  ];

  const getDialogText = () => {
    const { type, user } = confirmDialog;
    if (type === "approve")
      return `Enter the amount to withdraw for ${user?.name} (${user?.username}). Wallet balance: ${formatINR(user?.mainWallet)}`;
    if (type === "reject")
      return `Are you sure you want to reject withdrawal for ${user?.name} (${user?.username})?`;
    if (type === "approveAll")
      return `Are you sure you want to approve withdrawal for ALL ${filteredData.length} eligible users? Their full wallet balance will be approved.`;
    if (type === "rejectAll")
      return `Are you sure you want to reject withdrawal for ALL ${filteredData.length} eligible users?`;
    return "";
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 overflow-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Banknote size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Withdrawal Eligible & Tracking
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Weekly withdrawal eligibility tracking and payout processing
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Download dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700"
            >
              <Download size={14} />
              <span>Download Report</span>
              <ChevronDown
                size={13}
                className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl">
                <button
                  onClick={handleDownloadPdf}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <FileDown size={15} className="text-rose-500" />
                  <div>
                    <p className="font-bold text-slate-800">Download PDF</p>
                    <p className="text-[10px] text-slate-400">
                      Name, username & amount only
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleDownloadWord}
                  className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <FileText size={15} className="text-blue-500" />
                  <div>
                    <p className="font-bold text-slate-800">
                      Word Document (.doc)
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Full report with bank details
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleDownloadExcel}
                  className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <FileSpreadsheet size={15} className="text-emerald-500" />
                  <div>
                    <p className="font-bold text-slate-800">
                      Excel Sheet (.xlsx)
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Structured data spreadsheet
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => openConfirm("approveAll")}
            disabled={!filteredData.length}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approve All
          </button>

          <button
            onClick={() => openConfirm("rejectAll")}
            disabled={!filteredData.length}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject All
          </button>

          <button
            onClick={fetchWithdrawalEligibleUsers}
            disabled={loading}
            title="Refresh"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Eligible Members
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900">
            {weeklyStats.totalUsers}
          </p>
          <span className="mt-0.5 block text-[10px] text-slate-400">
            ≥ ₹700, 2 direct active & KYC approved
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-white p-4 shadow-sm">
          <div className="absolute right-0 top-0 h-full w-2 bg-blue-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Gross Wallet Volume
          </p>
          <p className="mt-1 text-2xl font-black text-blue-700">
            {formatINR(weeklyStats.totalWallet)}
          </p>
          <span className="mt-0.5 block text-[10px] text-blue-600/80">
            {getPeriodLabel()}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-sm">
          <div className="absolute right-0 top-0 h-full w-2 bg-emerald-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Net Payable ({100 - PAYOUT_CUT_PERCENT}%)
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-700">
            {formatINR(weeklyStats.totalPayable)}
          </p>
          <span className="mt-0.5 block text-[10px] text-emerald-600/80">
            After {PAYOUT_CUT_PERCENT}% processing fee
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-white p-4 shadow-sm">
          <div className="absolute right-0 top-0 h-full w-2 bg-indigo-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Average Payout
          </p>
          <p className="mt-1 text-2xl font-black text-indigo-700">
            {formatINR(weeklyStats.avgPayable)}
          </p>
          <span className="mt-0.5 block text-[10px] text-indigo-600/80">
            Per qualified member
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm md:flex-row">
        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member, bank, account, UPI..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>
        {search && (
          <p className="text-xs text-slate-500">
            Showing {filteredData.length} of {data.length} members
          </p>
        )}
      </div>

      {/* Main table */}
      <DynamicTable
        dataKey="_id"
        title={`Withdrawal Eligible Members (${filteredData.length})`}
        data={filteredData}
        columns={columns}
        loading={loading}
      />

      {/* Payout pending section */}
      {payoutPending.length > 0 && (
        <div className="mt-8">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-slate-900">
              Payout Pending ({payoutPending.length})
            </h2>
            <p className="text-xs text-slate-500">
              These users have been approved for payout and are waiting to be
              marked as paid.
            </p>
          </div>
          <DynamicTable
            dataKey="_id"
            title="Payout Pending"
            data={payoutPending}
            columns={payoutColumns}
            loading={false}
          />
        </div>
      )}

      {/* Confirm dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {confirmDialog.type === "approve"
            ? "Approve Withdrawal"
            : "Confirm Action"}
        </DialogTitle>
        <DialogContent>
          <p className="mb-3 text-sm text-gray-600">{getDialogText()}</p>

          {confirmDialog.type === "approve" && (
            <TextField
              label="Amount to Approve"
              type="number"
              fullWidth
              size="small"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
              inputProps={{ min: 1, max: maxApproveAmount, step: "0.01" }}
              error={approveAmount !== "" && !isApproveAmountValid}
              helperText={
                approveAmount !== "" && !isApproveAmountValid
                  ? `Enter an amount between ₹1 and ${formatINR(maxApproveAmount)}`
                  : ""
              }
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeConfirm} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={
              confirmDialog.type === "reject" ||
              confirmDialog.type === "rejectAll"
                ? "error"
                : "success"
            }
            disabled={
              actionLoading ||
              (confirmDialog.type === "approve" && !isApproveAmountValid)
            }
            startIcon={
              actionLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {actionLoading ? "Processing..." : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminWithdrawalEligibleUsers;
