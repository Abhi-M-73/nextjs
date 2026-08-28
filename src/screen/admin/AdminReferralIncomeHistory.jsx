import { useEffect, useState } from "react";
import { getReferralIncomeHistory } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const AdminReferralIncomeHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReferralHistory = async () => {
    try {
      setLoading(true);
      const res = await getReferralIncomeHistory();
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
    fetchReferralHistory();
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
      key: "fromUser",
      label: "From (Referral)",
      render: (_, row) => row?.fromUser?.username?.toUpperCase() || "—",
    },

    {
      key: "baseAmount",
      label: "Package",
      render: (val) => formatINR(val),
    },

    {
      key: "amount",
      label: "Bonus Credited",
      render: (val) => formatINR(val),
    },

    {
      key: "investmentId",
      label: "Investment Status",
      isBadge: true,
      render: (val) => val?.status || "N/A",
    },

    {
      key: "createdAt",
      label: "Credited On",
      render: (val) => dateFormatter(val),
    },
  ];

  return (
    <div className="w-full overflow-auto p-5">
      <DynamicTable
        dataKey="_id"
        title="Referral Income History"
        data={data}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default AdminReferralIncomeHistory;