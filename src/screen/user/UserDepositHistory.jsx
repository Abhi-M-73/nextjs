import React, { useEffect, useState } from "react";
import { getDepositHistory } from "../../api/user.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import { ImageIcon, Clock, CheckCircle2, XCircle } from "lucide-react";

const statusConfig = {
  approved: {
    label: "Approved",
    className: "bg-green-50 text-green-600",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-500",
    icon: XCircle,
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-600",
    icon: Clock,
  },
};

const UserDepositHistory = () => {
  const [depositHistory, setDepositHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchDepositHistory = async () => {
    setLoading(true);
    try {
      const response = await getDepositHistory();
      if (response?.success) {
        setDepositHistory(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching deposit history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepositHistory();
  }, []);

  const formatINR = (value) =>
    `₹${(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen ">
      <div className="max-w-lg mx-auto space-y-4">
        {loading && (
          <p className="text-center text-gray-400 py-6 text-sm">
            Loading deposit history...
          </p>
        )}

        {/* Empty */}
        {!loading && depositHistory.length === 0 && (
          <p className="text-center text-gray-400 py-6 text-sm">
            No deposits found
          </p>
        )}

        {/* List */}
        {depositHistory.map((item) => {
          const status = statusConfig[item.status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <div
              key={item._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-gray-900 text-sm font-semibold">Deposit</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {dateFormatter(item.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-900 font-bold">{formatINR(item.amount_inr)}</p>
                  <span
                    className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}
                  >
                    <StatusIcon size={11} />
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Payment method + proof */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 mb-2 flex items-center justify-between text-xs">
                <div>
                  <p className="text-gray-400">Payment Method</p>
                  <p className="text-gray-900 font-medium">{item.paymentMethod}</p>
                </div>
                {item?.proofImage?.url && (
                  <button
                    onClick={() => setPreviewImage(item.proofImage.url)}
                    className="flex items-center gap-1 text-blue-600 font-medium hover:underline"
                  >
                    <ImageIcon size={13} />
                    View Proof
                  </button>
                )}
              </div>

              {/* Rejection reason, if any */}
              {item.status === "rejected" && item.response && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-xs">
                  <p className="text-red-500 font-medium">Reason:</p>
                  <p className="text-red-500">{item.response}</p>
                </div>
              )}

              {/* Approved timestamp */}
              {item.status === "approved" && item.approvedAt && (
                <p className="text-gray-400 text-xs mt-2">
                  Approved on {dateFormatter(item.approvedAt)}
                </p>
              )}

              {item.status === "pending" && item.createdAt && (
                <p className="text-gray-400 text-xs mt-2">
                  Deposit on {dateFormatter(item.createdAt)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-52 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Payment proof"
            className="max-w-full max-h-[80vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default UserDepositHistory;