// import { useEffect, useState } from "react";
// import { getWithdrawalEligibleUsers } from "../../api/admin.api";
// import DynamicTable from "../../components/ui/DynamicTable";

// const AdminWithdrawalEligibleUsers = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchWithdrawalEligibleUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await getWithdrawalEligibleUsers();
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
//     fetchWithdrawalEligibleUsers();
//   }, []);

//   const formatINR = (val) =>
//     `₹${Math.abs(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

//   const columns = [
//     { key: "sr", label: "#", isIndex: true },
//     {
//       key: "name",
//       label: "Name",
//       render: (val) => val || "—",
//     },
//     {
//       key: "username",
//       label: "Username",
//       render: (val) => val?.toUpperCase() || "—",
//     },
//     {
//       key: "mainWallet",
//       label: "Wallet Balance",
//       render: (val) => <span className="text-green-500 font-semibold">{formatINR(val)}</span>,
//     },
//     {
//       key: "bankName",
//       label: "Bank Name",
//       render: (_, row) => row?.bankDetails?.bankName || "—",
//     },
//     {
//       key: "accountNumber",
//       label: "Account Number",
//       render: (_, row) => row?.bankDetails?.accountNumber || "—",
//     },
//     {
//       key: "ifscCode",
//       label: "IFSC Code",
//       render: (_, row) => row?.bankDetails?.ifscCode?.toUpperCase() || "—",
//     },
//     {
//       key: "upiId",
//       label: "UPI ID",
//       render: (_, row) => row?.bankDetails?.upiId || "—",
//     },
//   ];

//   return (
//     <div className="w-full overflow-auto p-5">
//       <DynamicTable
//         dataKey="_id"
//         title="Withdrawal Eligible Users"
//         data={data}
//         columns={columns}
//         loading={loading}
//       />
//     </div>
//   );
// };

// export default AdminWithdrawalEligibleUsers;
import { useEffect, useState } from "react";

import DynamicTable from "../../components/ui/DynamicTable";
import {
  getWithdrawalEligibleUsers,
  adminApproveWithdrawal,
  adminRejectWithdrawal,
  adminApproveAllWithdrawals,
  adminRejectAllWithdrawals,
} from "../../api/admin.api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

const AdminWithdrawalEligibleUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    user: null,
  });

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
    `₹${Math.abs(val || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const openConfirm = (type, user = null) => {
    setConfirmDialog({ open: true, type, user });
  };

  const closeConfirm = () => {
    if (actionLoading) return;
    setConfirmDialog({ open: false, type: null, user: null });
  };

  const handleConfirm = async () => {
    const { type, user } = confirmDialog;
    try {
      setActionLoading(true);

      if (type === "approve") {
        await adminApproveWithdrawal(user._id);
        toast?.success?.("Withdrawal approved successfully");
      } else if (type === "reject") {
        await adminRejectWithdrawal(user._id);
        toast?.info?.("Withdrawal rejected");
      } else if (type === "approveAll") {
        const userIds = data.map((u) => u._id);
        const res = await adminApproveAllWithdrawals(userIds);
        toast?.success?.(`${res?.data?.length || 0} withdrawals approved`);
      } else if (type === "rejectAll") {
        const userIds = data.map((u) => u._id);
        await adminRejectAllWithdrawals(userIds);
        toast?.info?.("All withdrawals rejected");
      }

      await fetchWithdrawalEligibleUsers();
      closeConfirm();
    } catch (error) {
      console.log(error);
      toast?.error?.(error?.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

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
      render: (val) => (
        <span className="text-green-500 font-semibold">{formatINR(val)}</span>
      ),
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
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openConfirm("approve", row)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => openConfirm("reject", row)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  const getDialogText = () => {
    const { type, user } = confirmDialog;
    if (type === "approve")
      return `Are you sure you want to withdraw ${formatINR(
        user?.mainWallet,
      )} for ${user?.name} (${user?.username})?`;
    if (type === "reject")
      return `Are you sure you want to reject withdrawal for ${user?.name} (${user?.username})?`;
    if (type === "approveAll")
      return `Are you sure you want to approve withdrawal for ALL ${data.length} eligible users? This will deduct their full main wallet balance.`;
    if (type === "rejectAll")
      return `Are you sure you want to reject withdrawal for ALL ${data.length} eligible users?`;
    return "";
  };

  return (
    <div className="w-full overflow-auto p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-gray-900">
          Withdrawal Eligible Users
        </h2>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openConfirm("approveAll")}
            disabled={!data.length}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Approve All
          </button>
          <button
            onClick={() => openConfirm("rejectAll")}
            disabled={!data.length}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reject All
          </button>
        </div>
      </div>

      <DynamicTable
        dataKey="_id"
        title="Withdrawal Eligible Users"
        data={data}
        columns={columns}
        loading={loading}
      />

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-bold">Confirm Action</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600">{getDialogText()}</p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeConfirm} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={
              confirmDialog.type === "reject" ||
              confirmDialog.type === "rejectAll"
                ? "error"
                : "success"
            }
            disabled={actionLoading}
            startIcon={
              actionLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {actionLoading ? "Processing..." : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminWithdrawalEligibleUsers;
