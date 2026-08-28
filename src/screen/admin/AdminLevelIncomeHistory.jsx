import { useEffect, useState } from "react";
import { getLevelIncomeHistory } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const AdminLevelIncomeHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLevelHistory = async () => {
    try {
      setLoading(true);
      const res = await getLevelIncomeHistory();
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
    fetchLevelHistory();
  }, []);

  const formatINR = (val) =>
    `₹${(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns = [
    { key: "sr", label: "#", isIndex: true },

    {
      key: "username",
      label: "Earned By",
      render: (_, row) => row?.userId?.username?.toUpperCase() || "—",
    },

    {
      key: "fromUsername",
      label: "From (Downline)",
      render: (_, row) => row?.fromUserId?.username?.toUpperCase() || "—",
    },

    {
      key: "level",
      label: "Level",
      render: (val) => `L${val ?? "—"}`,
    },

    {
      key: "investmentAmount",
      label: "Package",
      render: (val) => formatINR(val),
    },

    {
      key: "amount",
      label: "Income Credited",
      render: (val) => formatINR(val),
    },

    {
      key: "dayCount",
      label: "Day",
      render: (val) => val ?? "—",
    },

    {
      key: "creditedAt",
      label: "Credited On",
      render: (val) => dateFormatter(val),
    },
  ];

  return (
    <div className="w-full overflow-auto p-5">
      <DynamicTable
        dataKey="_id"
        title="Level Income History"
        data={data}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default AdminLevelIncomeHistory;