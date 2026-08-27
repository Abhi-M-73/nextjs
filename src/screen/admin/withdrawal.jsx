import React, { useEffect, useState } from 'react'
import { getWithdrawalHistory } from '../../api/admin.api';
import DynamicTable from '../../components/ui/DynamicTable';
import { dateFormatter } from '../../utils/AdditionalFn';

const WithDrawal = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllUser = async () => {
    try {
      setLoading(true);
      const res = await getWithdrawalHistory();
      if (res?.success) {
        setData(res?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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
      key: "userWalletAddress",
      label: "Wallet",
      render: (val) =>
        val ? `${val.slice(0, 6)}...${val.slice(-4)}` : "—",
    },

    {
      key: "amount",
      label: "Amount",
      render: (val) => `${Number(val || 0).toFixed(2)} LLD`,
    },

    {
      key: "network",
      label: "Network",
      isBadge: true,
    },
    {
      key: "transactionHash",
      label: "Tx Hash",
      render: (val) =>
        val ? `${val.slice(0, 6)}...${val.slice(-4)}` : "—",
    },

    {
      key: "status",
      label: "Status",
      isBadge: true,
      badgeColor: "emerald", // you can map dynamic later
    },



    {
      key: "createdAt",
      label: "Created At",
      render: (val) =>
        val ? dateFormatter(val) : "—",
    },
  ];
  return (
    <div className='w-full overflow-auto p-5'>
      <DynamicTable
        title="Withdrawal History"
        data={data}
        columns={columns}
        loading={loading}
        dataKey="_id"
      />
    </div>
  )
}

export default WithDrawal
