import React, { useEffect, useState } from "react";
import { getReactivationCapHistory } from "../../api/user.api";
import { RefreshCcw, ShieldAlert, ArrowRight } from "lucide-react";
import { dateFormatter } from "../../utils/AdditionalFn";

const UserReactivationCapHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await getReactivationCapHistory();
            if (response?.success) {
                setHistory(response?.data || []);
            }
        } catch (error) {
            console.error("Error fetching reactivation cap history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatINR = (val) =>
        `₹${Math.abs(val || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // "type" field sirf earnings_cap entries mein aata hai, reactivation entries mein nahi -
    // newExpiry/previousExpiry se pehchano
    const getEntryType = (item) => {
        if (item.type === "earnings_cap") return "cap";
        if (item.newExpiry) return "reactivation";
        return "other";
    };

    if (loading) {
        return (
            <p className="text-center text-gray-400 text-sm py-6">Loading history...</p>
        )
    } else if (!loading && history.length === 0) {
        return (
            <p className="text-center text-gray-400 text-sm py-6">No records found</p>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 ">
            <div className="w-full mx-auto space-y-3">
                {/* List */}
                {history.map((item) => {
                    const entryType = getEntryType(item);
                    const isCap = entryType === "cap";

                    return (
                        <div
                            key={item._id}
                            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                        >
                            {/* Top row */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isCap ? "bg-red-50" : "bg-blue-50"
                                            }`}
                                    >
                                        {isCap ? (
                                            <ShieldAlert size={16} className="text-red-500" />
                                        ) : (
                                            <RefreshCcw size={16} className="text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-gray-900 text-sm font-semibold">
                                            {isCap ? "Earnings Cap Reached" : "Package Reactivation"}
                                        </p>
                                        <p className="text-gray-400 text-xs">{dateFormatter(item.createdAt)}</p>
                                    </div>
                                </div>

                                <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${item.status === "success"
                                        ? "bg-green-50 text-green-600"
                                        : "bg-red-50 text-red-500"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </div>

                            {/* Wallet before/after */}
                            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 mt-2 text-xs">
                                <div>
                                    <p className="text-gray-400">Deducted</p>
                                    <p className="text-red-500 font-semibold mt-0.5">-{formatINR(item.amount)}</p>
                                </div>

                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <span>{formatINR(item.walletBefore)}</span>
                                    <ArrowRight size={12} />
                                    <span className="font-semibold text-gray-900">{formatINR(item.walletAfter)}</span>
                                </div>
                            </div>

                            {/* Reactivation expiry dates */}
                            {entryType === "reactivation" && (
                                <div className="flex items-center justify-between bg-blue-50 rounded-xl px-3 py-2 mt-2 text-xs">
                                    <div>
                                        <p className="text-gray-500">Previous Expiry</p>
                                        <p className="text-gray-900 font-medium mt-0.5">
                                            {item.previousExpiry ? dateFormatter(item.previousExpiry) : "—"}
                                        </p>
                                    </div>
                                    <ArrowRight size={12} className="text-blue-400" />
                                    <div className="text-right">
                                        <p className="text-gray-500">New Expiry</p>
                                        <p className="text-gray-900 font-medium mt-0.5">
                                            {item.newExpiry ? dateFormatter(item.newExpiry) : "—"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Cap entries - earnings at cut */}
                            {isCap && item.earningsAtCut !== undefined && (
                                <div className="bg-red-50 rounded-xl px-3 py-2 mt-2 text-xs flex justify-between">
                                    <span className="text-gray-500">Total Earnings at Cap</span>
                                    <span className="text-gray-900 font-semibold">{formatINR(item.earningsAtCut)}</span>
                                </div>
                            )}


                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserReactivationCapHistory;