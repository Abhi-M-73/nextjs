import React, { useEffect, useState } from "react";
import { getLevelIncomeHistory } from "../../api/user.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import { Layers } from "lucide-react";

const UserLevelIncomeHistory = () => {
  const [levelIncomeHistory, setLevelIncomeHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLevelIncomeHistory = async () => {
    try {
      setLoading(true);
      const res = await getLevelIncomeHistory();
      if (res?.success) {
        setLevelIncomeHistory(res.data || []);
      }
    } catch (err) {
      console.log("Error fetching level income history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevelIncomeHistory();
  }, []);

  const formatINR = (val) =>
    `₹${(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-400 text-sm py-6">
          Loading income...
        </p>
      )}

      {/* Empty */}
      {!loading && levelIncomeHistory.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">No income yet</p>
      )}

      {/* List */}
      {levelIncomeHistory.map((item) => (
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
                  {dateFormatter(item.creditedAt)}
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
                {item?.fromUserId?.username ||
                  item?.fromUserId?.name ||
                  "Unknown"}
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-[10px]">Member Name</p>
              <p className="text-gray-900 uppercase text-[10px] font-medium mt-0.5">
                {item?.fromUserId?.name}
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
