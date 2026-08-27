import React, { useState, lazy, Suspense } from "react";

const UserStakeHistory = lazy(() => import("./UserStakeHistory"));
const UserWithdrawalHistory = lazy(() => import("./UserWithdrawalHistory"));

const UserTransactionHistory = () => {
    const [activeTab, setActiveTab] = useState("stake");

    const tabs = [
        { key: "stake", label: "Stake History" },
        { key: "withdraw", label: "Withdraw History" },
    ];

    const renderComponent = () => {
        switch (activeTab) {
            case "stake":
                return <UserStakeHistory />;
            case "withdraw":
                return <UserWithdrawalHistory />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex justify-center px-2 py-4">
            <div className="w-full max-w-2xl">
                <div className="mb-5">
                    <h2 className="text-md font-bold text-white tracking-wide">
                        Transaction History
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Track your staking & withdrawal activities
                    </p>
                </div>

                {/* 🔥 CARD */}
                <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 shadow-[0_0_25px_rgba(255,136,0,0.08)]">
                    <div className="flex bg-black/40 border border-white/10 rounded-full p-1 mb-5 relative">
                        <div
                            className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ${activeTab === "withdraw" ? "left-1/2" : "left-1"
                                }`}
                        />

                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`relative z-10 flex-1 text-sm py-2 rounded-full font-medium transition ${activeTab === tab.key
                                        ? "text-white"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 🔥 CONTENT */}
                    <div className="min-h-[300px]">
                        <Suspense
                            fallback={
                                <div className="flex justify-center items-center py-10">
                                    <p className="text-gray-400 text-sm">Loading...</p>
                                </div>
                            }
                        >
                            {renderComponent()}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTransactionHistory;