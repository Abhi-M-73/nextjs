import React, { useEffect, useState } from 'react'
import { getWithdrawalHistory, approveWithdrawReq, rejectWithdrawReq } from '../../api/admin.api';
import DynamicTable from '../../components/ui/DynamicTable';
import { dateFormatter } from '../../utils/AdditionalFn';

const BankDetailsModal = ({ withdrawal, onClose }) => {
  if (!withdrawal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl"
      >
        <h3 className="text-base font-semibold text-gray-900 mb-1">Bank Details</h3>
        <p className="text-sm text-gray-500 mb-3">
          {withdrawal?.userId?.name || withdrawal?.userId?.username} — ₹{Number(withdrawal?.amount || 0).toFixed(2)}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Bank Name</span>
            <span className="text-gray-900 font-medium">{withdrawal?.bankName || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Account Number</span>
            <span className="text-gray-900 font-medium">{withdrawal?.accountNumber || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">IFSC Code</span>
            <span className="text-gray-900 font-medium">{withdrawal?.ifscCode ? withdrawal.ifscCode.toUpperCase() : "—"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">UPI ID</span>
            <span className="text-gray-900 font-medium">{withdrawal?.upiId || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Fee</span>
            <span className="text-gray-900 font-medium">₹{Number(withdrawal?.feeAmount || 0).toFixed(2)}</span>
          </div>
        </div>

        {withdrawal?.status === "rejected" && withdrawal?.rejectionReason && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-100">
            <p className="text-xs text-red-500 uppercase tracking-wide mb-1">Rejection Reason</p>
            <p className="text-sm text-red-600">{withdrawal.rejectionReason}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const RejectReasonModal = ({ withdrawal, onClose, onConfirm, submitting }) => {
  const [reason, setReason] = useState("");

  if (!withdrawal) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onConfirm(withdrawal._id, reason.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl"
      >
        <h3 className="text-base font-semibold text-gray-900 mb-1">Reject Withdrawal</h3>
        <p className="text-sm text-gray-500 mb-3">
          {withdrawal?.userId?.username} — ₹{Number(withdrawal?.amount || 0).toFixed(2)}
        </p>

        <label className="text-xs text-gray-500 uppercase tracking-wide">Rejection Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Enter reason for rejection..."
          className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || submitting}
            className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminWithdrawalRequests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null); // id currently being approved
  const [rejectTarget, setRejectTarget] = useState(null); // withdrawal object being rejected
  const [viewTarget, setViewTarget] = useState(null); // withdrawal object being viewed
  const [submitting, setSubmitting] = useState(false);

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

  const handleApprove = async (row) => {
    try {
      setActionId(row._id);
      const res = await approveWithdrawReq(row._id);
      if (res?.success) {
        setData((prev) =>
          prev.map((item) =>
            item._id === row._id
              ? { ...item, status: "approved", approvedDate: new Date().toISOString() }
              : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setActionId(null);
    }
  };

  const handleRejectConfirm = async (id, reason) => {
    try {
      setSubmitting(true);
      const res = await rejectWithdrawReq(id, { rejectionReason: reason });
      if (res?.success) {
        setData((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, status: "rejected", rejectionReason: reason }
              : item
          )
        );
        setRejectTarget(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const badgeColorForStatus = (status) => {
    switch (status) {
      case "completed":
      case "approved":
        return "emerald";
      case "pending":
        return "amber";
      case "rejected":
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  const columns = [
    { key: "sr", label: "#", isIndex: true },

    {
      key: "userId",
      label: "Username",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-medium uppercase">{row?.userId?.username || "—"}</span>
        </div>
      ),
    },

    {
      key: "userId",
      label: "Email",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row?.userId?.email || ""}</span>
        </div>
      ),
    },

    {
      key: "amount",
      label: "Amount",
      render: (val, row) => `₹${Number(val || 0).toFixed(2)} ${row?.currency || "INR"}`,
    },

    {
      key: "status",
      label: "Status",
      isBadge: false,
      badgeColor: "emerald",
      render: (val, row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize w-fit
          ${row?.status === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
          ${row?.status === "approved" || row?.status === "completed" ? "bg-green-100 text-green-700" : ""}
          ${row?.status === "rejected" || row?.status === "failed" ? "bg-red-100 text-red-700" : ""}
        `}>
          {row?.status}
        </span>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",
      render: (val) =>
        val ? dateFormatter(val) : "—",
    },

    {
      key: "view",
      label: "Bank Details",
      isBadge: true,
      render: (_, row) => (
        <button
          onClick={() => setViewTarget(row)}
        >
          View Details
        </button>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (_, row) => {
        if (row?.status !== "pending") {
          return <span className="text-xs text-gray-400">—</span>;
        }
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(row)}
              disabled={actionId === row._id}
              className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {actionId === row._id ? "..." : "Approve"}
            </button>
            <button
              onClick={() => setRejectTarget(row)}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        );
      },
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

      <BankDetailsModal
        withdrawal={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      <RejectReasonModal
        withdrawal={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        submitting={submitting}
      />
    </div>
  )
}

export default AdminWithdrawalRequests