import React, { useEffect, useState } from 'react'
import { getAllUserList } from '../../api/admin.api';
import { getStakeIncomeHistory } from '../../api/admin.api';
import DynamicTable from '../../components/ui/DynamicTable';
import { dateFormatter } from '../../utils/AdditionalFn';

const StakeIncomeHistory = () => {

    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllUser = async () => {
    try {
      setLoading(true);
      const res = await getStakeIncomeHistory();
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
  key: "investmentAmount",
  label: "Amount",
  render: (val) => `${Number(val || 0).toFixed(2)} LLD`,
},

  {
    key: "roiPercent",
    label: "Staking %",
    render: (val) => `${val ?? 0}%`,
  },

  {
    key: "dailyPercent",
    label: "Daily Staking %",
    render: (val) => `${val ?? 0}%`,
  },

 {
  key: "incomeAmount",
  label: "Income",
 render: (val) => `${Number(val || 0).toFixed(2)} LLD`,
},

  {
    key: "creditedAt",
    label: "Credited At",
    render: (val) => dateFormatter(val),
  },
];

  return (
    <div className='w-full overflow-auto p-5'>
        <DynamicTable
        dataKey="_id"
        title='Stake Income History'
        data={data}
        columns={columns}
        loading={loading}
      />
    </div>
  )
}

export default StakeIncomeHistory
