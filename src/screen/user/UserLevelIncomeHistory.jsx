import React, { useEffect, useState } from "react";
import { getLevelIncomeHistory } from "../../api/user.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import { Layers } from "lucide-react";

const formatINR = (val) =>
  `₹${(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatTimeIST = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const UserLevelIncomeHistory = () => {
  const [levelIncomeHistory, setLevelIncomeHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLevelIncomeHistory = async () => {
    try {
      setLoading(true);
      const res = await getLevelIncomeHistory();
      if (res?.success) {
        const sorted = [...(res.data || [])].sort((a, b) => {
          if (a.level !== b.level) return a.level - b.level;
          return (
            new Date(b.creditedAt || b.createdAt) -
            new Date(a.creditedAt || a.createdAt)
          );
        });
        setLevelIncomeHistory(sorted);
      } else {
        setLevelIncomeHistory([]);
      }
    } catch (err) {
      console.log("Error fetching level income history:", err);
      setLevelIncomeHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevelIncomeHistory();
  }, []);

  const todayTotal = levelIncomeHistory.reduce(
    (sum, item) => sum + (item.amount || 0),
    0,
  );

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
      {/* Today total */}
      {!loading && levelIncomeHistory.length > 0 && (
        <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
          <p className="text-indigo-700 text-sm font-semibold">
            Today's Level Income
          </p>
          <p className="text-green-600 font-bold text-md">
            +{formatINR(todayTotal)}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-400 text-sm py-6">
          Loading income...
        </p>
      )}

      {/* Empty */}
      {!loading && levelIncomeHistory.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">
          No level income today
        </p>
      )}

      {/* List */}
      {!loading &&
        levelIncomeHistory.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
          >
            {/* Top */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Layers size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">
                    Level {item.level} Income
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatTimeIST(item.creditedAt || item.createdAt)}
                  </p>
                </div>
              </div>

              <p className="text-green-600 font-bold text-md">
                +{formatINR(item.amount)}
              </p>
            </div>

            {/* Details */}
            <div className="flex justify-between items-center text-xs bg-gray-50 rounded-lg px-3 py-2 mt-2">
              <div>
                <p className="text-gray-400 text-[10px]">Member ID</p>
                <p className="text-gray-900 text-[10px] uppercase font-medium mt-0.5">
                  {item?.fromUserId?.username || "Unknown"}
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-[10px]">Member Name</p>
                <p className="text-gray-900 uppercase text-[10px] font-medium mt-0.5">
                  {item?.fromUserId?.name || "Unknown"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-gray-400 text-[10px]">Member Validity</p>
                <p className="text-gray-900 text-[10px] font-medium mt-0.5">
                  {dateFormatter(item?.fromUserId?.packageExpiryDate) || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserLevelIncomeHistory;
