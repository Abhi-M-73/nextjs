import React, { useEffect, useState } from "react";
import { getWithdrawalHistory } from "../../api/user.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import {
  X,
  Copy,
  ExternalLink,
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,
  Inbox,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    iconColor: "text-emerald-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    iconColor: "text-emerald-500",
  },
  pending: {
    label: "Pending",
    icon: Clock3,
    badge: "bg-amber-50 text-amber-600 border-amber-100",
    iconColor: "text-amber-500",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badge: "bg-red-50 text-red-600 border-red-100",
    iconColor: "text-red-500",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    badge: "bg-red-50 text-red-600 border-red-100",
    iconColor: "text-red-500",
  },
};

const getStatusConfig = (status) =>
  STATUS_STYLES[status] || STATUS_STYLES.pending;

const shortenAddress = (address) => {
  if (!address) return "-";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const shortenHash = (hash) => {
  if (!hash) return "-";
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

const formatUSD = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getExplorerUrl = (network, txHash) => {
  if (!txHash) return "#";
  if (network === "BSC") return `https://bscscan.com/tx/${txHash}`;
  return "#";
};

const DetailRow = ({ label, value, mono = false }) => (
  <div className="flex justify-between items-start gap-3 text-sm py-1.5">
    <span className="text-gray-500 shrink-0">{label}</span>
    <span
      className={`text-gray-900 font-medium text-right break-all ${mono ? "font-mono text-xs" : ""}`}
    >
      {value || "-"}
    </span>
  </div>
);

const handleCopy = async (value, label = "Value") => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  } catch {
    toast.error(`Failed to copy ${label.toLowerCase()}.`);
  }
};

const WithdrawalDetailsModal = ({ withdrawal, onClose }) => {
  if (!withdrawal) return null;

  const statusConfig = getStatusConfig(withdrawal?.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border border-blue-100 shadow-xl rounded-2xl p-5 max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-all"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Amount Requested
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {formatUSD(withdrawal?.amount)} {withdrawal?.currency || "USDT"}
          </p>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${statusConfig.badge}`}
          >
            <StatusIcon size={13} className={statusConfig.iconColor} />
            {statusConfig.label}
          </span>

          <span className="text-xs font-semibold text-gray-400 uppercase">
            {withdrawal?.network}
          </span>
        </div>

        <div className="border-t border-gray-100 my-2" />

        {/* Payout details */}
        <p className="text-gray-500 text-xs uppercase tracking-wider mt-3 mb-1">
          Payout Details
        </p>

        <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mt-1">
          <span className="text-xs font-mono text-gray-700 truncate">
            {withdrawal?.userWalletAddress}
          </span>
          <button
            onClick={() =>
              handleCopy(withdrawal?.userWalletAddress, "Wallet address")
            }
            className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0"
            aria-label="Copy wallet address"
          >
            <Copy size={12} className="text-gray-500" />
          </button>
        </div>

        <DetailRow label="Wallet Type" value="Main Wallet" />

        <div className="border-t border-gray-100 my-2" />

        <DetailRow
          label="Fee"
          value={`${formatUSD(withdrawal?.fee)} ${withdrawal?.currency || "USDT"}`}
        />
        <DetailRow
          label="You Receive"
          value={`${formatUSD(withdrawal?.finalAmount)} ${withdrawal?.currency || "USDT"}`}
        />
        <DetailRow
          label="Requested On"
          value={dateFormatter(withdrawal?.createdAt)}
        />

        {withdrawal?.approvedAt && (
          <DetailRow
            label="Approved On"
            value={dateFormatter(withdrawal?.approvedAt)}
          />
        )}

        {withdrawal?.rejectedAt && (
          <DetailRow
            label="Rejected On"
            value={dateFormatter(withdrawal?.rejectedAt)}
          />
        )}

        {withdrawal?.trackId && (
          <DetailRow label="Track ID" value={withdrawal.trackId} mono />
        )}

        {withdrawal?.txHash && (
          <div className="flex items-center justify-between mt-2 bg-gray-50 rounded-xl px-3 py-2.5">
            <span className="text-xs font-mono text-gray-700 truncate">
              {shortenHash(withdrawal.txHash)}
            </span>
            <a
              href={getExplorerUrl(withdrawal?.network, withdrawal?.txHash)}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0"
              aria-label="View on explorer"
            >
              <ExternalLink size={12} className="text-blue-600" />
            </a>
          </div>
        )}

        {/* Error / rejection reason */}
        {withdrawal?.errorMessage && (
          <>
            <div className="border-t border-gray-100 my-2" />
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-3 mb-1">
              {withdrawal?.status === "rejected" ? "Rejection Reason" : "Error"}
            </p>
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mt-1">
              {withdrawal.errorMessage}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const UserWithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getWithdrawalHistory();
      if (response?.success) {
        setWithdrawals(response.data || []);
      } else {
        setError(response?.message || "Failed to load withdrawal history.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load withdrawal history.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-14">
        <Loader2 size={26} className="text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-gray-400">
          Loading withdrawal history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle size={20} className="text-red-500" />
        </div>
        <p className="text-sm font-semibold text-gray-900">{error}</p>
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center">
          <Inbox size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-900">
          No withdrawals yet
        </p>
        <p className="text-xs text-gray-400">
          Your withdrawal requests will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {withdrawals.map((w) => {
        const statusConfig = getStatusConfig(w?.status);
        const StatusIcon = statusConfig.icon;

        return (
          <div
            key={w?._id}
            className="bg-white border border-gray-100 rounded-xl p-3.5 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <ArrowUpRight size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900">
                    {formatUSD(w?.amount)} {w?.currency || "USDT"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {dateFormatter(w?.createdAt)}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 ${statusConfig.badge}`}
              >
                <StatusIcon size={11} className={statusConfig.iconColor} />
                {statusConfig.label}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-50">
              <span className="text-[11px] text-gray-500 font-mono truncate">
                {shortenAddress(w?.userWalletAddress)}
              </span>

              <button
                onClick={() => setSelectedWithdrawal(w)}
                className="text-blue-600 text-xs font-bold cursor-pointer hover:underline shrink-0"
              >
                View details →
              </button>
            </div>
          </div>
        );
      })}

      <WithdrawalDetailsModal
        withdrawal={selectedWithdrawal}
        onClose={() => setSelectedWithdrawal(null)}
      />
    </div>
  );
};

export default UserWithdrawalHistory;
