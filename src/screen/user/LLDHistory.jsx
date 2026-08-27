import React, { useEffect, useState } from "react";
import { getLldHistory } from "../../api/user.api";
import { dateFormatter } from "../../utils/AdditionalFn";
import mainContent from "../../utils/mainContent";

const formatLLD = (wei) => {
    if (!wei) return "0";
    try {
        return (Number(BigInt(wei)) / 1e18).toFixed(4);
    } catch {
        return "0";
    }
};

const UserRoiHistory = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);

    const LIMIT = 6;

    const fetchData = async (pg = 1) => {
        const res = await getLldHistory({ page: pg, limit: LIMIT });
        if (res?.success) {
            setData(res.data);
            setPagination(res.pagination);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const openTx = (hash) => {
        window.open(`https://etherscan.io/tx/${hash}`, "_blank");
    };

    return (
        <div>
            {/* 🔥 LIST */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {data.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No transactions found
                    </div>
                ) : (
                    data.map((item) => (
                        <div
                            key={item._id}
                            className="bg-[#0f0f0f] border border-[var(--primary-color)]/40 rounded-2xl p-4 hover:border-[var(--primary-color)]/40 transition"
                        >
                            {/* TOP */}
                            <div className="flex justify-between mb-3">
                                <div>
                                    <p className="text-white font-semibold text-sm">
                                        LLD Purchase
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {dateFormatter(item?.createdAt)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center gap-1 justify-start">
                                        <img
                                            src={mainContent.logo}
                                            alt="LLD"
                                            className="h-5 w-5"
                                        />
                                        <p className="text-green-400 font-bold text-sm">
                                            +{formatLLD(item?.distribution?.userShare)}
                                        </p>
                                    </div>
                                   
                                    <p className="text-xs text-gray-400">
                                        ${item?.usdtEquivalent}
                                    </p>
                                </div>
                            </div>

                            {/* ETH → LLD */}
                            <div className="flex justify-between items-center bg-[#181818] rounded-xl px-3 py-2 mb-3 border border-gray-700">
                                <div>
                                    <p className="text-gray-400 text-xs">Spent</p>
                                    <p className="text-white text-sm font-semibold">
                                        {item?.ethSpent} ETH
                                    </p>
                                </div>

                                <div className="text-gray-500 text-xs">→</div>

                                <div className="text-right">
                                    <p className="text-gray-400 text-xs">Received</p>
                                    <div className="flex items-center gap-1 justify-start">
                                        <img
                                            src={mainContent.logo}
                                            alt="LLD"
                                            className="h-5 w-5"
                                        />
                                        <p className="text-green-400 text-sm font-semibold">
                                            {formatLLD(item?.distribution?.userShare)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 🔥 DISTRIBUTION BREAKDOWN */}
                            <div className="mt-3 bg-[#151515] border border-white/10 rounded-xl p-3">
                                <p className="text-gray-400 text-xs mb-2">Distribution</p>

                                <div className="space-y-1 text-xs">
                                    {/* USER */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">You <span className="text-gray-300">(85%)</span></span>
                                        <div className="flex items-center gap-1 justify-start">
                                            <img
                                                src={mainContent.logo}
                                                alt="LLD"
                                                className="h-4 w-4"
                                            />
                                            <span className="text-green-400 font-medium">
                                                {formatLLD(item.distribution?.userShare)}
                                            </span>
                                        </div>
                                        
                                    </div>

                                    {/* LAYER 1 */}
                                    <div className="flex justify-between">
                                        <span className="text-blue-400">Layer 1 <span className="text-gray-300">(5%)</span></span>
                                        <div className="flex items-center gap-1 justify-start">
                                            <img
                                                src={mainContent.logo}
                                                alt="LLD"
                                                className="h-4 w-4"
                                            />
                                            <span>
                                                {formatLLD(item.distribution?.ref1Share)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* LAYER 2 */}
                                    <div className="flex justify-between">
                                        <span className="text-purple-400">Layer 2 <span className="text-gray-300">(3%)</span></span>
                                        <div className="flex items-center gap-1 justify-start">
                                            <img
                                                src={mainContent.logo}
                                                alt="LLD"
                                                className="h-4 w-4"
                                            />
                                            <span>
                                                {formatLLD(item.distribution?.ref2Share)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* LAYER 3 */}
                                    <div className="flex justify-between">
                                        <span className="text-pink-400">Layer 3 <span className="text-gray-300">(2%)</span></span>
                                        <div className="flex items-center gap-1 justify-start">
                                            <img
                                                src={mainContent.logo}
                                                alt="LLD"
                                                className="h-4 w-4"
                                            />
                                            <span>
                                                {formatLLD(item.distribution?.ref3Share)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ADMIN */}
                                    <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
                                        <span className="text-orange-400">Platform <span className="text-gray-300">(5%)</span></span>
                                        <div className="flex items-center gap-1 justify-start">
                                            <img
                                                src={mainContent.logo}
                                                alt="LLD"
                                                className="h-4 w-4"
                                            />
                                            <span>
                                                {formatLLD(item.distribution?.adminShare)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TX LINK */}
                            <div
                                onClick={() => openTx(item.txHash)}
                                className="mt-3 text-[var(--primary-color)] font-medium text-xs text-center cursor-pointer hover:underline"
                            >
                                View TX → {item.txHash.slice(0, 12)}...
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 🔥 PAGINATION */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-4">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-40"
                    >
                        Prev
                    </button>

                    <span className="text-gray-400 text-sm">
                        Page <span className="text-white">{page}</span> /{" "}
                        {pagination.totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setPage((p) =>
                                Math.min(pagination.totalPages, p + 1)
                            )
                        }
                        disabled={page === pagination.totalPages}
                        className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserRoiHistory;
