import React, { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
const UserDepositHistory = lazy(() => import("./UserDepositHistory"));
const UserRoiIncomeHistory = lazy(() => import("./UserRoiIncomeHistory"));
const UserReferralIncomeHistory = lazy(() => import("./UserReferralIncomeHistory"));
const UserLevelIncomeHistory = lazy(() => import("./UserLevelIncomeHistory"));

const UserHistory = () => {
  const [activeTab, setActiveTab] = useState("deposit");

  const tabs = [
    { key: "deposit", label: "Deposit" },
    { key: "roi", label: "ROI" },
    { key: "referral", label: "Referral" },
    { key: "level", label: "Level" },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);

  const renderComponent = () => {
    switch (activeTab) {
      case "deposit":
        return <UserDepositHistory />;
      case "roi":
        return <UserRoiIncomeHistory />;
      case "referral":
        return <UserReferralIncomeHistory />;
      case "level":
        return <UserLevelIncomeHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex bg-white border border-gray-200 rounded-full p-1 relative shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-sm py-2 rounded-full relative z-10 transition-colors ${
                activeTab === tab.key
                  ? "text-white font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <motion.div
            layout
            className="absolute top-1 bottom-1 rounded-full bg-blue-600"
            style={{
              width: `${100 / tabs.length}%`,
              left: `${activeIndex * (100 / tabs.length)}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Content Animation */}
        <Suspense fallback={<p className="text-center text-gray-400">Loading...</p>}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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