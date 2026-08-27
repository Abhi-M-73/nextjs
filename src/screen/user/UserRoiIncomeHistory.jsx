import React, { useEffect, useState } from "react";
import { getRoiIncomeHistory } from "../../api/user.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import { TrendingUp } from "lucide-react";

const UserRoiIncomeHistory = () => {
  const [roiHistory, setRoiHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoiHistory = async () => {
    try {
      setLoading(true);
      const res = await getRoiIncomeHistory();
      if (res?.success) {
        setRoiHistory(res.data || []);
      }
    } catch (err) {
      console.log("Error fetching roi history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoiHistory();
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
      {!loading && roiHistory.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">
          No income yet
        </p>
      )}

      {/* List */}
      {roiHistory.map((item) => {
        const inv = item.investmentId;
        const daysCompleted = inv ? inv.totalDays - inv.remainingDays : null;

        return (
          <div
            key={item._id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
          >
            {/* Top */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">
                    Daily Cashback
                  </p>
                  <p className="text-gray-400 text-xs">
                    {dateFormatter(item.creditedOn)}
                  </p>
                </div>
              </div>

              <p className="text-green-600 font-bold text-md">
                +{formatINR(item.roiAmount)}
              </p>
            </div>

            {/* Details */}
            <div className="flex justify-between items-center text-xs bg-gray-50 rounded-lg px-3 py-2 mt-2">
              <div>
                <p className="text-gray-400">Investment</p>
                <p className="text-gray-900 font-medium mt-0.5">
                  {formatINR(item.investmentAmount)}
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-400">Rate</p>
                <p className="text-gray-900 font-medium mt-0.5">
                  {item.percentage}% daily
                </p>
              </div>

              {daysCompleted !== null && (
                <div className="text-right">
                  <p className="text-gray-400">Progress</p>
                  <p className="text-gray-900 font-medium mt-0.5">
                    Day {daysCompleted}/{inv.totalDays}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserRoiIncomeHistory;