// import { useEffect, useState } from "react";
// import { getReferralIncomeHistory } from "../../api/admin.api";
// import DynamicTable from "../../components/ui/DynamicTable";
// import { dateFormatter } from "../../utils/AdditionalFn";

// const AdminReferralIncomeHistory = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchReferralHistory = async () => {
//     try {
//       setLoading(true);
//       const res = await getReferralIncomeHistory();
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
//     fetchReferralHistory();
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
//       key: "fromUser",
//       label: "From (Referral)",
//       render: (_, row) => row?.fromUser?.username?.toUpperCase() || "—",
//     },

//     {
//       key: "baseAmount",
//       label: "Package",
//       render: (val) => formatINR(val),
//     },

//     {
//       key: "amount",
//       label: "Bonus Credited",
//       render: (val) => formatINR(val),
//     },

//     {
//       key: "investmentId",
//       label: "Investment Status",
//       isBadge: true,
//       render: (val) => val?.status || "N/A",
//     },

//     {
//       key: "createdAt",
//       label: "Credited On",
//       render: (val) => dateFormatter(val),
//     },
//   ];

//   return (
//     <div className="w-full overflow-auto p-5">
//       <DynamicTable
//         dataKey="_id"
//         title="Referral Income History"
//         data={data}
//         columns={columns}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default AdminReferralIncomeHistory;
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Banknote,
  Calendar,
  Gift,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { getReferralIncomeHistory } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const formatINR = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const AdminReferralIncomeHistory = () => {
  const [referralHistory, setReferralHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchReferralHistory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getReferralIncomeHistory();

      if (response?.success) {
        setReferralHistory(Array.isArray(response?.data) ? response.data : []);
        setLastUpdated(new Date());
      } else {
        setReferralHistory([]);
      }
    } catch (error) {
      console.error("Error while fetching referral income history:", error);
      setReferralHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferralHistory();
  }, [fetchReferralHistory]);

  const totalBonus = referralHistory.reduce(
    (total, item) => total + Number(item?.amount || 0),
    0,
  );

  const totalPackageAmount = referralHistory.reduce(
    (total, item) => total + Number(item?.baseAmount || 0),
    0,
  );

  const uniqueEarners = new Set(
    referralHistory.map((item) => item?.userId?._id).filter(Boolean),
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
      key: "fromUser",
      label: "From Referral",
      render: (_, row) => (
        <span className="text-slate-600">
          {row?.fromUser?.username?.toUpperCase() || "—"}
        </span>
      ),
    },
    {
      key: "baseAmount",
      label: "Package",
      render: formatINR,
    },
    {
      key: "amount",
      label: "Bonus Credited",
      render: formatINR,
    },
    {
      key: "investmentId",
      label: "Investment Status",
      isBadge: true,
      render: (value) => value?.status || "N/A",
    },
    {
      key: "createdAt",
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
              Referral Income History
            </h1>
            <p className="text-xs text-slate-500">
              Track referral bonuses credited to platform users
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
              onClick={fetchReferralHistory}
              disabled={loading}
              title="Refresh referral history"
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
            Referral Transactions
          </h2>

          <div className="ml-3 h-px flex-1 bg-slate-200" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="w-full overflow-x-auto">
            <DynamicTable
              dataKey="_id"
              title="Referral Income History"
              data={referralHistory}
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
              Total records: {referralHistory.length} · Last sync:{" "}
              {lastUpdated?.toLocaleString() || "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReferralIncomeHistory;
