import React, { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, ChevronDown } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("level");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabs = [
    { key: "activation", label: "Activation" },

    { key: "cashback", label: "Cashback" },
    { key: "referral", label: "Referral" },
    { key: "level", label: "Level" },
    { key: "reactivation-cap", label: "Reactivation Cap" },
    { key: "withdraw", label: "Withdraw" },
  ];

  const activeLabel = tabs.find((t) => t.key === activeTab)?.label;

  const renderComponent = () => {
    switch (activeTab) {
      case "deposit":
        return <UserDepositHistory />;

      case "cashback":
        return <UserRoiIncomeHistory />;
      case "referral":
        return <UserReferralIncomeHistory />;
      case "level":
        return <UserLevelIncomeHistory />;
      case "reactivation-cap":
        return <UserReactivationCapHistory />;
      case "withdraw":
        return <UserWithdrawalHistory />;
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

        {/* Dropdown selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm shadow-gray-100"
          >
            <span className="text-sm font-bold text-gray-900">
              {activeLabel}
            </span>
            <ChevronDown
              size={18}
              className={`text-blue-600 transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-200 overflow-hidden"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                      activeTab === tab.key
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
