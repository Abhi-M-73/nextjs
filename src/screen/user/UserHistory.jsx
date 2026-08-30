import React, { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart } from "lucide-react";
const UserDepositHistory = lazy(() => import("./UserDepositHistory"));
const UserWithdrawalHistory = lazy(() => import("./UserWithdrawalHistory"));
const UserRoiIncomeHistory = lazy(() => import("./UserRoiIncomeHistory"));
const UserReferralIncomeHistory = lazy(
  () => import("./UserReferralIncomeHistory"),
);
const UserLevelIncomeHistory = lazy(() => import("./UserLevelIncomeHistory"));
const UserReactivationCapHistory = lazy(
  () => import("./UserReactivationCapHistory"),
);

const UserHistory = () => {
  const [activeTab, setActiveTab] = useState("deposit");

  const tabs = [
    { key: "deposit", label: "Deposit" },
    { key: "withdraw", label: "Withdraw" },
    { key: "roi", label: "ROI" },
    { key: "referral", label: "Referral" },
    { key: "level", label: "Level" },
    { key: "reactivation-cap", label: "Cap" }, // shortened - "Reactivation" overflow karta tha 5-tab row mein
  ];

  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);

  const renderComponent = () => {
    switch (activeTab) {
      case "deposit":
        return <UserDepositHistory />;
      case "withdraw":
        return <UserWithdrawalHistory />;
      case "roi":
        return <UserRoiIncomeHistory />;
      case "referral":
        return <UserReferralIncomeHistory />;
      case "level":
        return <UserLevelIncomeHistory />;
      case "reactivation-cap":
        return <UserReactivationCapHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
            <PieChart size={16} className="text-white" />
          </div>
          <h2 className="text-gray-900 font-extrabold text-[17px] tracking-tight">
            Transaction History
          </h2>
        </div>

        {/* Tab bar */}
        <div className="flex bg-white border border-gray-100 rounded-full p-1 relative shadow-sm shadow-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-xs sm:text-sm py-2 px-1 rounded-full relative z-10 transition-colors duration-300 whitespace-nowrap font-semibold ${
                activeTab === tab.key
                  ? "text-white"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <motion.div
            layout
            className="absolute top-1 bottom-1 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-200"
            style={{
              width: `${100 / tabs.length}%`,
              left: `${activeIndex * (100 / tabs.length)}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Content Animation */}
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="w-9 h-9 rounded-full border-[3px] border-blue-100 border-t-blue-600 animate-spin" />
              <p className="text-sm font-medium text-gray-400">
                Loading history...
              </p>
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm shadow-gray-100"
            >
              {renderComponent()}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
};

export default UserHistory;
