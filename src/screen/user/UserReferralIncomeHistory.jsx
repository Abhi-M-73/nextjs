import React, { useEffect, useState } from "react";
import { getReferralIncomeHistory } from "../../api/user.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import { Users } from "lucide-react";

const UserReferralIncomeHistory = () => {
  const [referralIncomeHistory, setReferralIncomeHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReferralIncomeHistory = async () => {
    try {
      setLoading(true);
      const res = await getReferralIncomeHistory();
      if (res?.success) {
        setReferralIncomeHistory(res.data || []);
      }
    } catch (err) {
      console.log("Error fetching referral income history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralIncomeHistory();
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
      {!loading && referralIncomeHistory.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">
          No referral income yet
        </p>
      )}

      {/* List */}
      {referralIncomeHistory.map((item) => (
        <div
          key={item._id}
          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
        >
          {/* Top */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-900 text-sm font-semibold">
                  Referral Bonus
                </p>
                <p className="text-gray-400 text-xs">
                  {dateFormatter(item.createdAt)}
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
              <p className="text-gray-400">From</p>
              <p className="text-gray-900 uppercase font-medium mt-0.5">
                {item?.fromUser?.username || item?.fromUser?.name || "Unknown"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-400">Package Amount</p>
              <p className="text-gray-900 font-medium mt-0.5">
                {formatINR("1199")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserReferralIncomeHistory;
