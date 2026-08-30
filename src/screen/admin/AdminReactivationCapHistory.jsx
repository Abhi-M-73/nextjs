import { useEffect, useState } from "react";
import { getAdminReactivationCapHistory } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const AdminReactivationCapHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReactivationHistory = async () => {
    try {
      setLoading(true);
      const res = await getAdminReactivationCapHistory();
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
    fetchReactivationHistory();
  }, []);

  const formatINR = (val) =>
    `₹${Math.abs(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns = [
    { key: "sr", label: "#", isIndex: true },
    {
      key: "username",
      label: "Username",
      render: (_, row) => row?.userId?.username?.toUpperCase() || row?.userId || "—",
    },
    {
      key: "type",
      label: "Type",
      isBadge: true,
      render: (val) => (val === "earnings_cap" ? "Earnings Cap" : "Reactivation"),
    },
    {
      key: "amount",
      label: "Amount Deducted",
      render: (val) => <span className="text-red-400 font-semibold">{formatINR(val)}</span>,
    },
    {
      key: "walletBefore",
      label: "Wallet Before → After",
      render: (_, row) => `${formatINR(row.walletBefore)} → ${formatINR(row.walletAfter)}`,
    },
    {
      key: "newExpiry",
      label: "New Expiry",
      render: (val) => (val ? dateFormatter(val) : "—"),
    },

    {
      key: "earningsAtCut",
      label: "Earnings at Cap",
      render: (val) => (val ? formatINR(val) : "—"),
    },

    {
      key: "status",
      label: "Status",
      isBadge: true,
      render: (val) => val || "—",
    },

    {
      key: "createdAt",
      label: "Date",
      render: (val) => dateFormatter(val),
    },
  ];

  return (
    <div className="w-full overflow-auto p-5">
      <DynamicTable
        dataKey="_id"
        title="Reactivation & Cap History"
        data={data}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default AdminReactivationCapHistory;