import { useEffect, useState } from "react";
import { getWithdrawalEligibleUsers } from "../../api/admin.api";
import DynamicTable from "../../components/ui/DynamicTable";

const AdminWithdrawalEligibleUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWithdrawalEligibleUsers = async () => {
    try {
      setLoading(true);
      const res = await getWithdrawalEligibleUsers();
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
    fetchWithdrawalEligibleUsers();
  }, []);

  const formatINR = (val) =>
    `₹${Math.abs(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns = [
    { key: "sr", label: "#", isIndex: true },
    {
      key: "name",
      label: "Name",
      render: (val) => val || "—",
    },
    {
      key: "username",
      label: "Username",
      render: (val) => val?.toUpperCase() || "—",
    },
    {
      key: "mainWallet",
      label: "Wallet Balance",
      render: (val) => <span className="text-green-500 font-semibold">{formatINR(val)}</span>,
    },
    {
      key: "bankName",
      label: "Bank Name",
      render: (_, row) => row?.bankDetails?.bankName || "—",
    },
    {
      key: "accountNumber",
      label: "Account Number",
      render: (_, row) => row?.bankDetails?.accountNumber || "—",
    },
    {
      key: "ifscCode",
      label: "IFSC Code",
      render: (_, row) => row?.bankDetails?.ifscCode?.toUpperCase() || "—",
    },
    {
      key: "upiId",
      label: "UPI ID",
      render: (_, row) => row?.bankDetails?.upiId || "—",
    },
  ];

  return (
    <div className="w-full overflow-auto p-5">
      <DynamicTable
        dataKey="_id"
        title="Withdrawal Eligible Users"
        data={data}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default AdminWithdrawalEligibleUsers;