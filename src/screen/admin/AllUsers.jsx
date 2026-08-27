import React, { useEffect, useState } from 'react'
import { getAllUserList } from '../../api/admin.api';
import { dateFormatter, formatCurrency } from '../../utils/AdditionalFn';
import DynamicTable from '../../components/ui/DynamicTable';

const AllUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllUser = async () => {
    try {
      setLoading(true);
      const res = await getAllUserList();
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
    { key: "username", label: "Username" },
    { key: "email", label: "email" },
    {
      key: "totalEarnings",
      label: "Total Earnings",
      render: (val) => `₹${Number(val || 0).toFixed(2)}`,
    },
    {
      key: "totalInvestment",
      label: "Total Investment",
      render: (val) => `₹${Number(val || 0).toFixed(2)}`,
    },
    {
      key: "totalPayouts",
      label: "Total Payouts",
      render: (val) => `₹${Number(val || 0).toFixed(2)}`,
    },

    {
      key: "isVerified",
      label: "Status",
      isBadge: true,
      render: (val) => {
        const isVerified = val === true || val === "true";
        return isVerified ? "Active" : "Inactive";
      }
    },
    {
      key: "createdAt",
      label: "Joined At",
      render: (val) => dateFormatter(val)
    },
  ];

  return (
    <div className='w-full overflow-auto p-5'>
      <DynamicTable
        dataKey="_id"
        title='All Users'
        data={data}
        columns={columns}
        loading={loading}
      />
    </div>
  )
}

export default AllUsers
