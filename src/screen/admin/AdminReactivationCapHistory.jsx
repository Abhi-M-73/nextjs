import React, { useEffect, useState, useMemo } from "react";
import { getAdminReactivationCapHistory } from "../../api/admin.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import {
  Rocket,
  Search,
  RefreshCw,
  TrendingDown,
  ShieldAlert,
  RefreshCcw,
  Calendar,
  Download,
  User,
  Hash,
  CheckCircle2,
  Filter,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminReactivationCapHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'earnings_cap' | 'reactivation'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReactivationHistory = async () => {
    try {
      setLoading(true);
      const res = await getAdminReactivationCapHistory();
      if (res?.success) {
        setData(Array.isArray(res?.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Error fetching reactivation history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReactivationHistory();
  }, []);

  const formatINR = (val) =>
    `₹${Math.abs(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const user = item?.userId || {};
      const username = (user?.username || "").toLowerCase();
      const name = (user?.name || "").toLowerCase();
      const itemType = item?.type || (item?.newExpiry ? "reactivation" : "other");

      // Type filter
      if (typeFilter !== "all" && itemType !== typeFilter) {
        return false;
      }

      // Search filter (Name or User ID/Username)
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesUsername = username.includes(q);
        const matchesName = name.includes(q);
        const matchesUserId = (typeof item.userId === "string" ? item.userId : "").toLowerCase().includes(q);
        if (!matchesUsername && !matchesName && !matchesUserId) {
          return false;
        }
      }

      // Date range filter
      if (startDate || endDate) {
        const itemDate = new Date(item.createdAt || item.date);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (itemDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) return false;
        }
      }

      return true;
    });
  }, [data, search, typeFilter, startDate, endDate]);

  // Statistics
  const stats = useMemo(() => {
    const totalEvents = data.length;
    const totalDeducted = data.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );
    const capCuts = data.filter((item) => item.type === "earnings_cap").length;
    const reactivations = data.filter(
      (item) => item.type === "reactivation" || (!item.type && item.newExpiry),
    ).length;

    return { totalEvents, totalDeducted, capCuts, reactivations };
  }, [data]);

  // Export to Excel
  const handleExportExcel = () => {
    if (!filteredData.length) return;

    const rows = filteredData.map((item, idx) => ({
      "#": idx + 1,
      Name: item?.userId?.name || "—",
      "User ID (Username)": item?.userId?.username?.toUpperCase() || "—",
      Type: item.type === "earnings_cap" ? "Earnings Cap" : "Package Reactivation",
      "Amount Deducted (₹)": Number(item.amount || 0),
      "Wallet Before (₹)": Number(item.walletBefore || 0),
      "Wallet After (₹)": Number(item.walletAfter || 0),
      "Earnings at Cut (₹)": item.earningsAtCut ? Number(item.earningsAtCut) : "—",
      Status: item.status || "success",
      Date: dateFormatter(item.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reactivation History");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `Reactivation_Cap_History_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Rocket size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Reactivation & Cap History
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track package renewals, earnings cap deductions, and user balance adjustments
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportExcel}
            disabled={!filteredData.length}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download size={14} />
            Export Excel
          </button>

          <button
            onClick={fetchReactivationHistory}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Records
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats.totalEvents}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            All deduction events
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-rose-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
            Total Deducted
          </p>
          <p className="text-2xl font-black text-rose-700 mt-1">
            {formatINR(stats.totalDeducted)}
          </p>
          <span className="text-[10px] text-rose-600/80 mt-0.5 block">
            Cap cuts & renewals
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-amber-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
            Earnings Cap Reached
          </p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {stats.capCuts}
          </p>
          <span className="text-[10px] text-amber-600/80 mt-0.5 block">
            3x limit reached events
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-2 h-full bg-blue-500" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Package Reactivations
          </p>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {stats.reactivations}
          </p>
          <span className="text-[10px] text-blue-600/80 mt-0.5 block">
            Auto / Manual renewals
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "all", label: "All Events" },
            { key: "earnings_cap", label: "Earnings Cap" },
            { key: "reactivation", label: "Reactivations" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${typeFilter === tab.key
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs w-full sm:w-auto">
            <Calendar size={13} className="text-slate-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-slate-700 text-xs focus:outline-none"
              title="Start Date"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-slate-700 text-xs focus:outline-none"
              title="End Date"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-[10px] text-rose-500 font-bold ml-1 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name or User ID..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Deducted Amount</th>
                <th className="py-3.5 px-4">Wallet Before → After</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw size={20} className="animate-spin text-indigo-600" />
                      <p className="text-xs font-semibold">Loading history records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-1.5">
                      <Rocket size={30} className="text-slate-300" />
                      <p className="text-xs font-bold text-slate-600">
                        No records found
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {search || startDate || endDate
                          ? "Try adjusting your search or date range"
                          : "No reactivation or cap deduction records available yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const user = item?.userId || {};
                  const userName = user?.name || "—";
                  const userIdStr = user?.username ? `@${user.username}` : "—";
                  const isCap = item.type === "earnings_cap";

                  return (
                    <tr
                      key={item._id || index}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {index + 1}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {(userName !== "—" ? userName[0] : (user?.username || "U")[0])}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-4">
                              {userName}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {user?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* User ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 text-[11px]">
                          {userIdStr}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        {isCap ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                            <ShieldAlert size={11} /> Earnings Cap (3x)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                            <RefreshCcw size={11} /> Reactivation
                          </span>
                        )}
                      </td>

                      {/* Amount Deducted */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold font-mono text-rose-600">
                          -{formatINR(item.amount)}
                        </span>
                      </td>

                      {/* Wallet Before -> After */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <span className="text-slate-500">{formatINR(item.walletBefore)}</span>
                        <span className="text-slate-300 mx-1">➔</span>
                        <span className="font-bold text-slate-800">{formatINR(item.walletAfter)}</span>
                      </td>



                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 capitalize">
                          <CheckCircle2 size={10} /> {item.status || "success"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {dateFormatter(item.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReactivationCapHistory;