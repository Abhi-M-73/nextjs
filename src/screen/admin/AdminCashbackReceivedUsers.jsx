import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeIndianRupee, Calendar, RefreshCw, Search } from "lucide-react";
import { getCashbackReceivedUsers } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const DEFAULT_ROWS = 100;

const formatINR = (value) => {
  const amount = Number(value || 0);
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Only users whose cashback was released (completed); active & collapsed are excluded by the API
const AdminCashbackReceivedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalCashback, setTotalCashback] = useState(0);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Refs keep latest page size / search without re-creating the fetch function
  const rowsRef = useRef(DEFAULT_ROWS);
  const searchRef = useRef("");

  const fetchUsers = useCallback(
    async (pageNum = 1, limitNum = rowsRef.current) => {
      try {
        setLoading(true);

        const response = await getCashbackReceivedUsers({
          page: pageNum,
          limit: limitNum,
          search: searchRef.current || undefined,
        });

        if (Array.isArray(response?.data)) {
          setUsers(response.data);
          setTotalRecords(response?.totalRecords ?? response.data.length);
          setTotalCashback(response?.totalCashback || 0);
          setPage(pageNum);
          setRows(limitNum);
          rowsRef.current = limitNum;
          setLastUpdated(new Date());
        } else {
          setUsers([]);
          setTotalRecords(0);
          setTotalCashback(0);
        }
      } catch (error) {
        console.error("Error while fetching cashback received users:", error);
        setUsers([]);
        setTotalRecords(0);
        setTotalCashback(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchUsers(1, DEFAULT_ROWS);
  }, [fetchUsers]);

  // Debounced search, always restarts from page 1
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchRef.current === search.trim()) return;
      searchRef.current = search.trim();
      fetchUsers(1, rowsRef.current);
    }, 400);
    return () => clearTimeout(t);
  }, [search, fetchUsers]);

  // DynamicTable sends { page, first, rows }; page is 0-based
  const handlePageChange = (event) => {
    const newRows = event?.rows || rowsRef.current;
    const newPage =
      (event?.page !== undefined
        ? event.page
        : Math.floor((event?.first || 0) / newRows)) + 1;
    fetchUsers(newPage, newRows);
  };

  const columns = [
    {
      key: "sr",
      label: "#",
      isIndex: true,
    },
    {
      key: "username",
      label: "Username",
      render: (_, row) => (
        <span className="font-semibold text-slate-700">
          {row?.user?.username?.toUpperCase() || "—"}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (_, row) => row?.user?.name || "—",
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, row) => row?.user?.phone || "—",
    },
    {
      key: "completedCount",
      label: "Packages Completed",
      render: (value) => value || 0,
    },
    {
      key: "totalCashback",
      label: "Cashback Received",
      render: (value) => (
        <span className="font-semibold text-emerald-600">
          {formatINR(value)}
        </span>
      ),
    },
    {
      key: "lastReleasedAt",
      label: "Released On",
      render: (value) => (value ? dateFormatter(value) : "—"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold text-transparent">
              Cashback Received
            </h1>
            <p className="text-xs text-slate-500">
              Users whose cashback has been released
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated: {lastUpdated.toLocaleTimeString("en-IN")}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => fetchUsers(page, rows)}
              disabled={loading}
              title="Refresh"
              className="rounded-lg p-2 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Users Received
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {totalRecords}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Total Cashback Released
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {formatINR(totalCashback)}
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
            <BadgeIndianRupee className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Users
          </h2>
          <div className="ml-3 hidden h-px flex-1 bg-slate-200 sm:block" />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search username, name, phone"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="w-full overflow-x-auto">
            <DynamicTable
              dataKey="_id"
              title="Cashback Received Users"
              data={users}
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
        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>
                Page {page} of {Math.max(1, Math.ceil(totalRecords / rows))}
              </span>
            </div>
            <span>
              Total records: {totalRecords} · Last sync:{" "}
              {lastUpdated?.toLocaleString("en-IN") || "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCashbackReceivedUsers;
