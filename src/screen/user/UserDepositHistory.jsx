import { useEffect, useState } from "react";
import {
  Loader2,
  Inbox,
  CheckCircle2,
  Clock3,
  XCircle,
  ExternalLink,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import { getDepositHistory } from "../../api/user.api";

const STATUS_STYLES = {
  confirmed: {
    label: "Confirmed",
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
  failed: {
    label: "Failed",
    icon: XCircle,
    badge: "bg-red-50 text-red-600 border-red-100",
    iconColor: "text-red-500",
  },
};

const shortenHash = (hash) => {
  if (!hash) return "-";
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getExplorerUrl = (chainId, txHash) => {
  if (chainId === "0x38") {
    return `https://bscscan.com/tx/${txHash}`;
  }
  return "#";
};

const UserDepositHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getDepositHistory();

        if (response?.success) {
          setPurchases(response.data || []);
        } else {
          setError(response?.message || "Failed to load deposit history.");
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load deposit history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleCopy = async (hash) => {
    try {
      await navigator.clipboard.writeText(hash);
      toast.success("Transaction hash copied!");
    } catch {
      toast.error("Failed to copy hash.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-14">
        <Loader2 size={26} className="text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-gray-400">
          Loading deposit history...
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

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
        <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center">
          <Inbox size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-900">
          No package purchases yet
        </p>
        <p className="text-xs text-gray-400">
          Your package deposit history will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {purchases.map((item) => {
        const statusConfig =
          STATUS_STYLES[item.status] || STATUS_STYLES.pending;
        const StatusIcon = statusConfig.icon;

        return (
          <div
            key={item._id}
            className="rounded-xl border border-gray-100 p-3.5 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-extrabold text-gray-900">
                  {item.packageName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(item.createdAt)}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-extrabold text-gray-900">
                  {item.amount} {item.currency}
                </p>
                <span
                  className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusConfig.badge}`}
                >
                  <StatusIcon size={11} className={statusConfig.iconColor} />
                  {statusConfig.label}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono min-w-0">
                <span className="truncate">{shortenHash(item.txHash)}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleCopy(item.txHash)}
                  className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Copy transaction hash"
                >
                  <Copy size={12} className="text-gray-500" />
                </button>

                <a
                  href={getExplorerUrl(item.chainId, item.txHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                  aria-label="View on explorer"
                >
                  <ExternalLink size={12} className="text-blue-600" />
                </a>
              </div>
            </div>

            {item.status === "failed" && item.failureReason && (
              <p className="text-[11px] text-red-500 mt-2">
                {item.failureReason}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserDepositHistory;
