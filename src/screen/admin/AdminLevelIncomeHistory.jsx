// import { useEffect, useState } from "react";
// import { getLevelIncomeHistory } from "../../api/admin.api";
// import DynamicTable from "../../components/ui/DynamicTable";
// import { dateFormatter } from "../../utils/AdditionalFn";

// const AdminLevelIncomeHistory = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchLevelHistory = async () => {
//     try {
//       setLoading(true);
//       const res = await getLevelIncomeHistory();
//       if (res?.success) {
//         setData(res?.data || []);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLevelHistory();
//   }, []);

//   const formatINR = (val) =>
//     `₹${(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//   const columns = [
//     { key: "sr", label: "#", isIndex: true },

//     {
//       key: "username",
//       label: "Earned By",
//       render: (_, row) => row?.userId?.username?.toUpperCase() || "—",
//     },

//     {
//       key: "fromUsername",
//       label: "From (Downline)",
//       render: (_, row) => row?.fromUserId?.username?.toUpperCase() || "—",
//     },

//     {
//       key: "level",
//       label: "Level",
//       render: (val) => `L${val ?? "—"}`,
//     },

//     {
//       key: "investmentAmount",
//       label: "Package",
//       render: (val) => formatINR(val),
//     },

//     {
//       key: "amount",
//       label: "Income Credited",
//       render: (val) => formatINR(val),
//     },

//     {
//       key: "dayCount",
//       label: "Day",
//       render: (val) => val ?? "—",
//     },

//     {
//       key: "creditedAt",
//       label: "Credited On",
//       render: (val) => dateFormatter(val),
//     },
//   ];

//   return (
//     <div className="w-full overflow-auto p-5">
//       <DynamicTable
//         dataKey="_id"
//         title="Level Income History"
//         data={data}
//         columns={columns}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default AdminLevelIncomeHistory;

import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Banknote,
  Calendar,
  Layers,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { getLevelIncomeHistory } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const formatINR = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const AdminLevelIncomeHistory = () => {
  const [levelHistory, setLevelHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLevelHistory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getLevelIncomeHistory();

      if (response?.success) {
        setLevelHistory(Array.isArray(response?.data) ? response.data : []);
        setLastUpdated(new Date());
      } else {
        setLevelHistory([]);
      }
    } catch (error) {
      console.error("Error while fetching level income history:", error);
      setLevelHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLevelHistory();
  }, [fetchLevelHistory]);

  const totalIncome = levelHistory.reduce(
    (total, item) => total + Number(item?.amount || 0),
    0,
  );

  const totalPackageAmount = levelHistory.reduce(
    (total, item) => total + Number(item?.investmentAmount || 0),
    0,
  );

  const uniqueEarners = new Set(
    levelHistory.map((item) => item?.userId?._id).filter(Boolean),
  ).size;

  const columns = [
    {
      key: "sr",
      label: "#",
      isIndex: true,
    },
    {
      key: "username",
      label: "Earned By",
      render: (_, row) => (
        <span className="font-semibold text-slate-700">
          {row?.userId?.username?.toUpperCase() || "—"}
        </span>
      ),
    },
    {
      key: "name",
      label: "Earned By Name",
      render: (_, row) => (
        <span className="font-semibold text-slate-700">
          {row?.userId?.name?.toUpperCase() || "—"}
        </span>
      ),
    },
    {
      key: "fromUsername",
      label: "From Downline",
      render: (_, row) => (
        <span className="text-slate-600">
          {row?.fromUserId?.username?.toUpperCase() || "—"}
        </span>
      ),
    },
    {
      key: "fromName",
      label: "From Downline Name",
      render: (_, row) => (
        <span className="text-slate-600">
          {row?.fromUserId?.name?.toUpperCase() || "—"}
        </span>
      ),
    },
    {
      key: "level",
      label: "Level",
      render: (value) => (
        <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
          {value !== undefined && value !== null ? `L${value}` : "—"}
        </span>
      ),
    },
    {
      key: "investmentAmount",
      label: "Package",
      render: formatINR,
    },
    {
      key: "amount",
      label: "Income Credited",
      render: formatINR,
    },
    {
      key: "dayCount",
      label: "Day",
      render: (value) => value ?? "—",
    },
    {
      key: "createdAt",
      label: "Credited On",
      render: (value) => (value ? dateFormatter(value) : "—"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
            <TrendingUp className="h-4 w-4" />
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            Level Income Transactions
          </h2>

          <div className="ml-3 h-px flex-1 bg-slate-200" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="w-full overflow-x-auto">
            <DynamicTable
              dataKey="_id"
              title="Level Income History"
              data={levelHistory}
              columns={columns}
              loading={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>System operational</span>
            </div>

            <span>
              Total records: {levelHistory.length} · Last sync:{" "}
              {lastUpdated?.toLocaleString() || "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLevelIncomeHistory;
