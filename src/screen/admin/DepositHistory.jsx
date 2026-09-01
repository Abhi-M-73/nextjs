import React, { useEffect, useState } from "react";
import { getDepositHistory } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";
import { dateFormatter } from "../../utils/AdditionalFn";

const DepositHistory = () => {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchAllUser = async () => {
    try {
      setLoading(true);
      const res = await getDepositHistory();
      console.log(res);
      if (res?.success) {
        setData(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  const columns = [
    { key: "sr", label: "#", isIndex: true },

    {
      key: "username",
      label: "Username",
      render: (_, row) => row?.userId?.username || "—",
    },

    {
      key: "walletAddress",
      label: "Wallet",
      render: (val) => (val ? `${val.slice(0, 6)}...${val.slice(-4)}` : "—"),
    },

    {
      key: "txHash",
      label: "Tx Hash",
      render: (val) => (val ? `${val.slice(0, 6)}...${val.slice(-4)}` : "—"),
    },

    {
      key: "stakedAmount",
      label: "Amount",
      render: (val) => `${Number(val || 0).toFixed(2)} LLD`,
    },

    {
      key: "status",
      label: "Status",
      isBadge: true,
      render: (val) => {
        switch (val) {
          case "active":
            return "Active";
        }
      },
    },

    {
      key: "createdAt",
      label: "Created At",
      render: (val) => dateFormatter(val),
    },
  ];

  return (
    <div className="w-full overflow-auto p-5">
      <DynamicTable
        dataKey="_id"
        title="Deposit History"
        data={data}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default DepositHistory;
