import { useEffect, useState } from "react";
import { getRoiIncomeHistory } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const AdminRoiIncomeHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoiHistory = async () => {
    try {
      setLoading(true);
      const res = await getRoiIncomeHistory();
      // backend ka success flag abhi buggy hai (false aata hai valid data ke saath bhi),
      // isliye data ki presence se render kar rahe hain jab tak backend fix na ho
      if (res?.data) {
        setData(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoiHistory();
  }, []);

  const formatINR = (val) =>
    `₹${(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns = [
    { key: "sr", label: "#", isIndex: true },

    {
      key: "username",
      label: "Username",
      render: (_, row) => row?.userId?.username?.toUpperCase() || "—",
    },

    {
      key: "investmentAmount",
      label: "Investment",
      render: (val) => formatINR(val),
    },

    {
      key: "percentage",
      label: "Daily Rate",
      render: (val) => `${val ?? 0}%`,
    },

    {
      key: "roiAmount",
      label: "Income Credited",
      render: (val) => formatINR(val),
    },

    {
      key: "creditedOn",
      label: "Credited On",
      render: (val) => dateFormatter(val),
    },
  ];

  return (
    <div className="w-full overflow-auto p-5">
      <DynamicTable
        dataKey="_id"
        title="ROI Income History"
        data={data}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default AdminRoiIncomeHistory;