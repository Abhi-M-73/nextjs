import React, { useEffect, useState } from "react";
import {
  getAdminDepositHistory,
  approveDeposit,
  rejectDeposit,
} from "../../api/admin.api";
import { dateFormatter, formatCurrency } from "../../utils/AdditionalFn";
import DynamicTable from "../../components/ui/DynamicTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle, ImageIcon } from "lucide-react";

const AdminDepositHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // confirm-approve dialog
  const [approveTarget, setApproveTarget] = useState(null); // { id, username }

  // reject dialog (with reason)
  const [rejectTarget, setRejectTarget] = useState(null); // { id, username }
  const [rejectReason, setRejectReason] = useState("");

  // image preview dialog
  const [previewImage, setPreviewImage] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getAdminDepositHistory();
      if (res?.success) {
        setData(res?.data || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load deposit history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ── Approve flow ──────────────────────────────────────────────────────
  const handleApproveClick = (row) => {
    setApproveTarget({ id: row._id, username: row.userId?.username || "this user" });
  };

  const confirmApprove = async () => {
    if (!approveTarget) return;
    try {
      setActionLoading(true);
      const res = await approveDeposit({ id: approveTarget.id });
      if (res?.success) {
        toast.success("Deposit approved successfully!");
        setApproveTarget(null);
        fetchHistory();
      } else {
        toast.error(res?.message || "Approval failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Approval failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Reject flow ───────────────────────────────────────────────────────
  const handleRejectClick = (row) => {
    setRejectTarget({ id: row._id, username: row.userId?.username || "this user" });
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }
    try {
      setActionLoading(true);
      const res = await rejectDeposit({ id: rejectTarget.id, reason: rejectReason.trim() });
      if (res?.success) {
        toast.success("Deposit rejected.");
        setRejectTarget(null);
        setRejectReason("");
        fetchHistory();
      } else {
        toast.error(res?.message || "Rejection failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Rejection failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: "sr", label: "#", isIndex: true },

    {
      key: "userId",
      label: "User",
      render: (val) => (
        <div className="leading-tight">
          <p className="font-medium uppercase" >{val?.username || "N/A"}</p>
        </div>
      ),
    },
    {
      key: "userId",
      label: "User",
      render: (val) => (
        <div className="leading-tight">
          <p className="text-xs text-green-400">{val?.email || "-"}</p>
        </div>
      ),
    },

    {
      key: "amount_inr",
      label: "Amount",
      render: (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`,
    },

    {
      key: "paymentMethod",
      label: "Method",
    },

    {
      key: "proofImage",
      label: "Proof",
      render: (val) =>
        val?.proofImage?.url ? (
          <button
            onClick={() => setPreviewImage(val.proofImage.url)}
            className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
          >
            <ImageIcon size={14} />
            View
          </button>
        ) : (
          <span className="text-xs text-gray-400">N/A</span>
        ),
    },

    {
      key: "status",
      label: "Status",
      isBadge: true,
      render: (val) =>
        val === "approved" ? "Approved" : val === "rejected" ? "Rejected" : "Pending",
    },
    {
      key: "response",
      label: "Admin Response",
      render: (val) => val || "N/A",
    },

    {
      key: "createdAt",
      label: "Submitted",
      render: (val) => dateFormatter(val),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) =>
        row.status === "pending" ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApproveClick(row)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100 transition"
            >
              <CheckCircle2 size={14} />
              Approve
            </button>
            <button
              onClick={() => handleRejectClick(row)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
            >
              <XCircle size={14} />
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400 capitalize">{row.status}</span>
        ),
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

      {/* Approve confirmation */}
      <Dialog open={!!approveTarget} onClose={() => setApproveTarget(null)}>
        <DialogTitle>Approve Deposit?</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600">
            Are you sure you want to approve this deposit for{" "}
            <span className="font-semibold">{approveTarget?.username}</span>? This will
            activate their package and cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveTarget(null)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={confirmApprove}
            variant="contained"
            color="success"
            disabled={actionLoading}
          >
            {actionLoading ? "Approving..." : "Yes, Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject with reason */}
      <Dialog open={!!rejectTarget} onClose={() => setRejectTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle>Reject Deposit</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600 mb-3">
            Rejecting deposit for <span className="font-semibold">{rejectTarget?.username}</span>.
            Please provide a reason.
          </p>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Reason for rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectTarget(null)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            variant="contained"
            color="error"
            disabled={actionLoading || !rejectReason.trim()}
          >
            {actionLoading ? "Rejecting..." : "Are you sure? Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image preview */}
      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="sm">
        <DialogContent className="flex items-center justify-center p-2">
          <img src={previewImage} alt="Payment proof" className="max-w-full max-h-[70vh] object-contain" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDepositHistory;