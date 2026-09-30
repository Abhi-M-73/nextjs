import React, { useEffect, useState, useMemo, useRef } from "react";
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
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  Users,
  Banknote,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  Filter,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { dateFormatter } from "../../utils/AdditionalFn";

// Fee percentage used for display only (not deducted from the approved amount)
const PAYOUT_CUT_PERCENT = 10;

const AdminWithdrawalEligibleUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Date Filters
  const [datePreset, setDatePreset] = useState("all"); // 'all' | 'this_week' | 'last_week' | 'this_month' | 'custom'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  const fetchWithdrawalEligibleUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getWithdrawalEligibleUsers(params);
      if (res?.success) {
        setData(res?.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalEligibleUsers();
  }, [startDate, endDate]);

  const formatINR = (val) =>
    `₹${Math.abs(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Display-only helper: wallet balance after the fee is deducted
  const getPayableAmount = (mainWallet) =>
    (mainWallet || 0) * (1 - PAYOUT_CUT_PERCENT / 100);

  // Handle Preset Date Filter
  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === "all") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "this_week") {
      // Current week (starting Monday)
      const day = now.getDay();
      const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diffToMonday));
      monday.setHours(0, 0, 0, 0);

      const today = new Date();
      setStartDate(monday.toISOString().slice(0, 10));
      setEndDate(today.toISOString().slice(0, 10));
    } else if (preset === "last_week") {
      // Last week Monday to Sunday
      const day = now.getDay();
      const diffToLastMonday = now.getDate() - day - 6 + (day === 0 ? -6 : 1);
      const lastMonday = new Date(now.setDate(diffToLastMonday));
      lastMonday.setHours(0, 0, 0, 0);

      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastMonday.getDate() + 6);
      lastSunday.setHours(23, 59, 59, 999);

      setStartDate(lastMonday.toISOString().slice(0, 10));
      setEndDate(lastSunday.toISOString().slice(0, 10));
    } else if (preset === "this_month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const today = new Date();
      setStartDate(firstDay.toISOString().slice(0, 10));
      setEndDate(today.toISOString().slice(0, 10));
    }
  };

  // Filter Data Client-Side
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = (row?.name || "").toLowerCase().includes(q);
        const matchesUsername = (row?.username || "").toLowerCase().includes(q);
        const matchesBank = (row?.bankDetails?.bankName || "")
          .toLowerCase()
          .includes(q);
        const matchesAcc = (row?.bankDetails?.accountNumber || "")
          .toLowerCase()
          .includes(q);
        const matchesUpi = (row?.bankDetails?.upiId || "")
          .toLowerCase()
          .includes(q);

        if (
          !matchesName &&
          !matchesUsername &&
          !matchesBank &&
          !matchesAcc &&
          !matchesUpi
        ) {
          return false;
        }
      }

      // Date filter on client if items have timestamps
      if (startDate || endDate) {
        const itemDate = row?.updatedAt || row?.createdAt;
        if (itemDate) {
          const d = new Date(itemDate);
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (d < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (d > end) return false;
          }
        }
      }

      return true;
    });
  }, [data, search, startDate, endDate]);

  // Weekly & Overall KPI Stats
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

    return {
      totalUsers,
      totalWallet,
      totalPayable,
      avgPayable,
    };
  }, [filteredData]);

  // Report Summary Descriptor
  const getPeriodLabel = () => {
    if (startDate && endDate) return `${startDate} to ${endDate}`;
    if (datePreset === "this_week") return "This Week (Current)";
    if (datePreset === "last_week") return "Last Week";
    if (datePreset === "this_month") return "This Month";
    return "All Time";
  };

  // 1. Download Word (.doc) Report
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
        <title>Weekly Withdrawal Eligible Report</title>
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
          .footer { margin-top: 30px; font-size: 9pt; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BINEXT - WEEKLY WITHDRAWAL ELIGIBLE REPORT</h1>
          <p class="sub">Generated on: ${new Date().toLocaleString("en-IN")} | Period: <strong>${period}</strong></p>
        </div>

        <table class="kpi-table">
          <tr>
            <td>
              <div class="kpi-title">Eligible Members</div>
              <div class="kpi-value">${weeklyStats.totalUsers}</div>
            </td>
            <td>
              <div class="kpi-title">Gross Wallet Volume</div>
              <div class="kpi-value">₹${weeklyStats.totalWallet.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            </td>
            <td>
              <div class="kpi-title">Net Payable (After 10% Fee)</div>
              <div class="kpi-value" style="color: #16a34a;">₹${weeklyStats.totalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
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
              <th>Payable (90%)</th>
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
                <td><strong>${u.name || "—"}</strong></td>
                <td>@${(u.username || "—").toUpperCase()}</td>
                <td class="amount">₹${Number(u.mainWallet || 0).toFixed(2)}</td>
                <td class="amount">₹${getPayableAmount(u.mainWallet).toFixed(2)}</td>
                <td>${u.bankDetails?.bankName || "—"}</td>
                <td>${u.bankDetails?.accountNumber || "—"}</td>
                <td>${(u.bankDetails?.ifscCode || "—").toUpperCase()}</td>
                <td>${u.bankDetails?.upiId || "—"}</td>
              </tr>
            `,
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
    saveAs(
      blob,
      `Weekly_Withdrawal_Eligible_${new Date().toISOString().slice(0, 10)}.doc`,
    );
    setShowExportMenu(false);
    toast.success("Word report downloaded successfully!");
  };

  // 2. Download Excel (.xlsx) Report
  const handleDownloadExcel = () => {
    if (!filteredData.length) {
      toast.error("No eligible records to export!");
      return;
    }

    const rows = filteredData.map((u, i) => ({
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

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Eligible Withdrawals");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(
      blob,
      `Weekly_Withdrawal_Eligible_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
    setShowExportMenu(false);
    toast.success("Excel report exported successfully!");
  };

  // 3. Print / PDF Report
  const handlePrintPdf = () => {
    setShowExportMenu(false);
    window.print();
  };

  // Approval Handlers
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
  const maxApproveAmount = confirmDialog.user?.mainWallet || 0;

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
      toast?.error?.("Please enter a valid amount");
      return;
    }

    try {
      setActionLoading(true);

      if (type === "approve") {
        await adminApproveWithdrawal(user._id, numApproveAmount);
        toast?.success?.(
          `Approved! Pay ${formatINR(numApproveAmount)} to ${user?.name || user?.username}.`,
        );
        addToPayoutPending([buildPayoutEntry(user, numApproveAmount)]);
      } else if (type === "reject") {
        await adminRejectWithdrawal(user._id);
        toast?.info?.("Withdrawal rejected");
      } else if (type === "approveAll") {
        const userIds = filteredData.map((u) => u._id);
        const res = await adminApproveAllWithdrawals(userIds);
        toast?.success?.(`${res?.data?.length || 0} withdrawals approved`);

        addToPayoutPending(
          filteredData.map((u) => buildPayoutEntry(u, u?.mainWallet || 0)),
        );
      } else if (type === "rejectAll") {
        const userIds = filteredData.map((u) => u._id);
        await adminRejectAllWithdrawals(userIds);
        toast?.info?.("All withdrawals rejected");
      }

      await fetchWithdrawalEligibleUsers();
      closeConfirm();
    } catch (error) {
      console.log(error);
      toast?.error?.(error?.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

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
        <span className="text-emerald-600 font-semibold">{formatINR(val)}</span>
      ),
    },
    {
      key: "payableBalance",
      label: `Payable Balance (after ${PAYOUT_CUT_PERCENT}% fee)`,
      render: (_, row) => (
        <span className="text-emerald-700 font-bold">
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
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => openConfirm("reject", row)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 transition-colors"
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
        <span className="text-emerald-600 font-bold">{formatINR(val)}</span>
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
          className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors"
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

  return (
    <div className="w-full overflow-auto p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Print Specific Header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-black text-slate-900">
          BINEXT - WEEKLY WITHDRAWAL ELIGIBLE REPORT
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Generated on: {new Date().toLocaleString("en-IN")} | Period: {getPeriodLabel()}
        </p>
      </div>

      {/* Main Header (Hidden in Print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Banknote size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Withdrawal Eligible & Tracking
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly sales, withdrawal eligibility tracking, and payout processing
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Download Report Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
            >
              <Download size={14} />
              <span>Download Report</span>
              <ChevronDown size={13} className={showExportMenu ? "rotate-180 transition-transform" : ""} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50">
                <button
                  onClick={handlePrintPdf}
                  className="w-full px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <Printer size={15} className="text-rose-500" />
                  <div>
                    <p className="font-bold text-slate-800">Print / PDF Report</p>
                    <p className="text-[10px] text-slate-400">Save as PDF document</p>
                  </div>
                </button>

                <button
                  onClick={handleDownloadWord}
                  className="w-full px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors font-medium border-t border-slate-100"
                >
                  <FileText size={15} className="text-blue-500" />
                  <div>
                    <p className="font-bold text-slate-800">Word Document (.doc)</p>
                    <p className="text-[10px] text-slate-400">Editable Word report</p>
                  </div>
                </button>

                <button
                  onClick={handleDownloadExcel}
                  className="w-full px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors font-medium border-t border-slate-100"
                >
                  <FileSpreadsheet size={15} className="text-emerald-500" />
                  <div>
                    <p className="font-bold text-slate-800">Excel Sheet (.xlsx)</p>
                    <p className="text-[10px] text-slate-400">Structured data spreadsheet</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => openConfirm("approveAll")}
            disabled={!filteredData.length}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Approve All
          </button>

          <button
            onClick={() => openConfirm("rejectAll")}
            disabled={!filteredData.length}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Reject All
          </button>

          <button
            onClick={fetchWithdrawalEligibleUsers}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Weekly Sales / Withdrawal Tracking Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Eligible Members
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {weeklyStats.totalUsers}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            ≥ ₹700 & 2 direct active
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-blue-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Gross Wallet Volume
          </p>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {formatINR(weeklyStats.totalWallet)}
          </p>
          <span className="text-[10px] text-blue-600/80 mt-0.5 block">
            Selected date range
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-emerald-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Net Payable (90%)
          </p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {formatINR(weeklyStats.totalPayable)}
          </p>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">
            After 10% processing fee
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-indigo-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-indigo-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Average Payout
          </p>
          <p className="text-2xl font-black text-indigo-700 mt-1">
            {formatINR(weeklyStats.avgPayable)}
          </p>
          <span className="text-[10px] text-indigo-600/80 mt-0.5 block">
            Per qualified member
          </span>
        </div>
      </div>

      {/* Date Filter & Search Controls (Hidden in Print) */}
      <div className="print:hidden flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Preset Date Filter Tabs */}
        {/* <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "all", label: "All Time" },
            { key: "this_week", label: "This Week" },
            { key: "last_week", label: "Last Week" },
            { key: "this_month", label: "This Month" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleDatePresetChange(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                datePreset === tab.key
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div> */}

        {/* Custom Date Range & Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {/* <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs w-full sm:w-auto">
            <Calendar size={13} className="text-slate-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setDatePreset("custom");
                setStartDate(e.target.value);
              }}
              className="bg-transparent text-slate-700 text-xs focus:outline-none"
              title="Start Date"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setDatePreset("custom");
                setEndDate(e.target.value);
              }}
              className="bg-transparent text-slate-700 text-xs focus:outline-none"
              title="End Date"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setDatePreset("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-[10px] text-rose-500 font-bold ml-1 hover:underline"
              >
                Clear
              </button>
            )}
          </div> */}

          <div className="relative w-full sm:w-60">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member, bank, acc..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DynamicTable
        dataKey="_id"
        title={`Withdrawal Eligible Members (${filteredData.length})`}
        data={filteredData}
        columns={columns}
        loading={loading}
      />

      {/* Payout Pending Section */}
      {payoutPending.length > 0 && (
        <div className="mt-8 print:hidden">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                Payout Pending ({payoutPending.length})
              </h2>
              <p className="text-xs text-slate-500">
                These users have been approved for payout and are waiting to be marked as paid.
              </p>
            </div>
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

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-bold">
          {confirmDialog.type === "approve"
            ? "Approve Withdrawal"
            : "Confirm Action"}
        </DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600 mb-3">{getDialogText()}</p>

          {confirmDialog.type === "approve" && (
            <TextField
              label="Amount to Approve"
              type="number"
              fullWidth
              size="small"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
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
