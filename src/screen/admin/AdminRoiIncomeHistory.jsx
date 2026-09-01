// import { useEffect, useState } from "react";
// import { getRoiIncomeHistory } from "../../api/admin.api";
// import DynamicTable from "../../components/ui/DynamicTable";
// import { dateFormatter } from "../../utils/AdditionalFn";

// const AdminRoiIncomeHistory = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchRoiHistory = async () => {
//     try {
//       setLoading(true);
//       const res = await getRoiIncomeHistory();
//       // backend ka success flag abhi buggy hai (false aata hai valid data ke saath bhi),
//       // isliye data ki presence se render kar rahe hain jab tak backend fix na ho
//       if (res?.data) {
//         setData(res.data);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRoiHistory();
//   }, []);

//   const formatINR = (val) =>
//     `₹${(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//   const columns = [
//     { key: "sr", label: "#", isIndex: true },

//     {
//       key: "username",
//       label: "Username",
//       render: (_, row) => row?.userId?.username?.toUpperCase() || "—",
//     },

//     {
//       key: "investmentAmount",
//       label: "Investment",
//       render: (val) => formatINR(val),
//     },

//     {
//       key: "percentage",
//       label: "Daily Rate",
//       render: (val) => `${val ?? 0}%`,
//     },

//     {
//       key: "roiAmount",
//       label: "Income Credited",
//       render: (val) => formatINR(val),
//     },

//     {
//       key: "creditedOn",
//       label: "Credited On",
//       render: (val) => dateFormatter(val),
//     },
//   ];

//   return (
//     <div className="w-full overflow-auto p-5">
//       <DynamicTable
//         dataKey="_id"
//         title="ROI Income History"
//         data={data}
//         columns={columns}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default AdminRoiIncomeHistory;
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Banknote,
  Calendar,
  Percent,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { getRoiIncomeHistory } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const formatINR = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const AdminRoiIncomeHistory = () => {
  const [roiHistory, setRoiHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRoiHistory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getRoiIncomeHistory();

      // Backend success flag false hone par bhi valid data render hoga
      if (Array.isArray(response?.data)) {
        setRoiHistory(response.data);
        setLastUpdated(new Date());
      } else {
        setRoiHistory([]);
      }
    } catch (error) {
      console.error("Error while fetching ROI income history:", error);
      setRoiHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoiHistory();
  }, [fetchRoiHistory]);

  const totalInvestment = roiHistory.reduce(
    (total, item) => total + Number(item?.investmentAmount || 0),
    0,
  );

  const totalIncome = roiHistory.reduce(
    (total, item) => total + Number(item?.roiAmount || 0),
    0,
  );

  const averageDailyRate = roiHistory.length
    ? roiHistory.reduce(
        (total, item) => total + Number(item?.percentage || 0),
        0,
      ) / roiHistory.length
    : 0;

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
          {row?.userId?.username?.toUpperCase() || "—"}
        </span>
      ),
    },
    {
      key: "investmentAmount",
      label: "Investment",
      render: formatINR,
    },
    {
      key: "percentage",
      label: "Daily Rate",
      render: (value) => `${Number(value || 0).toFixed(2)}%`,
    },
    {
      key: "roiAmount",
      label: "Income Credited",
      render: formatINR,
    },
    {
      key: "creditedOn",
      label: "Credited On",
      render: (value) => (value ? dateFormatter(value) : "—"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold text-transparent">
              ROI Income History
            </h1>
            <p className="text-xs text-slate-500">
              Track daily ROI earnings credited to users
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}

            <button
              type="button"
              onClick={fetchRoiHistory}
              disabled={loading}
              title="Refresh ROI history"
              className="rounded-lg p-2 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 text-slate-600 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
            <TrendingUp className="h-4 w-4" />
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
            ROI Transactions
          </h2>

          <div className="ml-3 h-px flex-1 bg-slate-200" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="w-full overflow-x-auto">
            <DynamicTable
              dataKey="_id"
              title="ROI Income History"
              data={roiHistory}
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
              Total records: {roiHistory.length} · Last sync:{" "}
              {lastUpdated?.toLocaleString() || "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoiIncomeHistory;
