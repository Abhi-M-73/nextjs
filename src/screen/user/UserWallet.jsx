import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Network,
  TrendingUp,
  X,
  Clock3,
  Wallet,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useSelector } from "react-redux";
import useFetchProfile from "../../hooks/useFetchProfile";
import DepositModal from "../../components/all/DepositModel";

const UserWallet = () => {
  const { fetchUserInfo } = useFetchProfile();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("deposit");
  const [depositOpen, setDepositOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [activationPopup, setActivationPopup] = useState(null);

  const balance = Number(user?.mainWallet || 0);
  const totalPayouts = Number(user?.totalPayouts || 0);

  // Display amount (UI me dikhega)
  const DISPLAY_AMOUNT = 1199;
  // Actual amount (payload me jayega)
  const ACTUAL_AMOUNT = 999;

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleActivateClick = () => {
    if (user?.status) {
      setActivationPopup({ type: "already-activated" });
    } else {
      setDepositOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 pb-24">
      <div className="max-w-lg mx-auto space-y-5">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Wallet size={21} className="text-white" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              My Wallet
            </h1>

            <p className="text-xs text-slate-500 mt-0.5">
              Manage your funds and withdrawals
            </p>
          </div>
        </div>

        {/* MAIN BALANCE CARD */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 p-5 shadow-xl shadow-blue-600/15">
          <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute -right-5 -bottom-16 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Wallet size={16} className="text-white" />
                </div>

                <span className="text-xs font-semibold text-blue-100">
                  Available Balance
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                <ShieldCheck size={12} className="text-blue-100" />
                <span className="text-[9px] font-semibold text-blue-100">
                  SECURE
                </span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] text-blue-100 font-medium mb-1">
                Current Wallet Balance
              </p>

              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold text-blue-100">₹</span>

                <span className="text-3xl font-extrabold tracking-tight text-white">
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-xl bg-white/10 border border-white/10 p-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-blue-100" />
                  <span className="text-[10px] text-blue-100">
                    Total Payouts
                  </span>
                </div>

                <p className="text-sm font-bold text-white mt-1">
                  ₹{formatCurrency(totalPayouts)}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 border border-white/10 p-3">
                <div className="flex items-center gap-1.5">
                  <Network size={13} className="text-blue-100" />
                  <span className="text-[10px] text-blue-100">
                    Wallet Status
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <p className="text-sm font-bold text-white">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DEPOSIT / WITHDRAW TABS */}
        <div className="p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`relative flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === "deposit"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <ArrowDownLeft size={17} />
              Activation
            </button>

            <button
              onClick={() => setActiveTab("withdraw")}
              className={`relative flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === "withdraw"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <ArrowUpRight size={17} />
              Withdraw
            </button>
          </div>
        </div>

        {/* DEPOSIT / ACTIVATION */}
        {activeTab === "deposit" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <ArrowDownLeft size={19} className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Add Funds
                  </h2>

                  <p className="text-xs text-slate-500 mt-1 leading-5">
                    Add funds to your wallet to activate or upgrade your
                    package.
                  </p>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-start gap-2">
                  <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />

                  <p className="text-[10px] text-slate-500 leading-4">
                    Activation funds will be added to your wallet after
                    successful payment verification.
                  </p>
                </div>
              </div>

              <button
                onClick={handleActivateClick}
                className="group mt-5 w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/15 transition-all flex items-center justify-center gap-2"
              >
                <Wallet size={17} />
                Activate Now
                <ChevronRight
                  size={17}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>

              <DepositModal
                open={depositOpen}
                onClose={() => setDepositOpen(false)}
                displayAmount={DISPLAY_AMOUNT}
                actualAmount={ACTUAL_AMOUNT}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck size={13} className="text-slate-400" />

          <p className="text-[10px] text-slate-400">
            Your wallet activity is securely protected.
          </p>
        </div>
      </div>

      {successData && (
        <WithdrawalRequestPopup
          data={successData}
          onClose={() => setSuccessData(null)}
        />
      )}

      {activationPopup && (
        <ActivationStatusPopup
          type={activationPopup.type}
          onClose={() => setActivationPopup(null)}
        />
      )}
    </div>
  );
};

// ========================================
// ACTIVATION STATUS POPUP COMPONENT
// ========================================
const ActivationStatusPopup = ({ type, onClose }) => {
  const isNotActivated = type === "not-activated";

  return (
    <>
      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupScaleIn {
          0% {
            transform: scale(0.85) translateY(25px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes iconPop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          70% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes ringPulse {
          0% {
            transform: scale(0.85);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
        style={{
          animation: "popupFadeIn 0.25s ease-out",
        }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
          style={{
            animation: "popupScaleIn 0.35s cubic-bezier(0.34, 1.25, 0.64, 1)",
          }}
        >
          {/* Top Accent */}
          <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
          >
            <X size={16} />
          </button>

          <div className="p-7 pt-9">
            {/* Success Icon */}
            <div className="relative flex items-center justify-center h-24 mb-5">
              <div
                className="absolute w-20 h-20 rounded-full border-2 border-blue-200"
                style={{
                  animation: "ringPulse 1.5s ease-out infinite",
                }}
              />

              <div
                className="relative w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/25"
                style={{
                  animation: "iconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {isNotActivated ? (
                  <Info size={34} className="text-white" strokeWidth={2.3} />
                ) : (
                  <CheckCircle2
                    size={34}
                    className="text-white"
                    strokeWidth={2.3}
                  />
                )}
              </div>
            </div>

            {/* Heading */}
            <div
              className="text-center"
              style={{
                animation: "slideUp 0.4s ease-out 0.15s both",
              }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                  {isNotActivated ? "Account Status" : "Activation Status"}
                </span>
              </div>

              <h2 className="text-slate-900 text-2xl font-extrabold tracking-tight">
                {isNotActivated ? "Account Not Activated" : "Already Activated"}
              </h2>

              <p className="text-slate-500 text-xs mt-2 leading-5">
                {isNotActivated
                  ? "Your account is not activated yet. Please contact admin for activation."
                  : "Your account is already activated. You can proceed with deposits and withdrawals."}
              </p>
            </div>

            {/* Button */}
            <button
              onClick={onClose}
              className="mt-6 w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/15 transition-all active:scale-[0.98]"
              style={{
                animation: "slideUp 0.4s ease-out 0.25s both",
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ========================================
// WITHDRAWAL SUCCESS POPUP
// ========================================
const WithdrawalRequestPopup = ({ data, onClose }) => {
  return (
    <>
      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupScaleIn {
          0% {
            transform: scale(0.85) translateY(25px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes iconPop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          70% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes ringPulse {
          0% {
            transform: scale(0.85);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
        style={{
          animation: "popupFadeIn 0.25s ease-out",
        }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
          style={{
            animation: "popupScaleIn 0.35s cubic-bezier(0.34, 1.25, 0.64, 1)",
          }}
        >
          {/* Top Accent */}
          <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
          >
            <X size={16} />
          </button>

          <div className="p-7 pt-9">
            {/* Success Icon */}
            <div className="relative flex items-center justify-center h-24 mb-5">
              <div
                className="absolute w-20 h-20 rounded-full border-2 border-blue-200"
                style={{
                  animation: "ringPulse 1.5s ease-out infinite",
                }}
              />

              <div
                className="relative w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/25"
                style={{
                  animation: "iconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <Clock3 size={37} className="text-white" strokeWidth={2.3} />
              </div>
            </div>

            {/* Heading */}
            <div
              className="text-center"
              style={{
                animation: "slideUp 0.4s ease-out 0.15s both",
              }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                  Request Submitted
                </span>
              </div>

              <h2 className="text-slate-900 text-2xl font-extrabold tracking-tight">
                Withdrawal Requested
              </h2>

              <p className="text-slate-500 text-xs mt-2 leading-5">
                Your withdrawal request has been successfully submitted for
                admin approval.
              </p>
            </div>

            {/* Amount */}
            <div
              className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
              style={{
                animation: "slideUp 0.4s ease-out 0.25s both",
              }}
            >
              <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold text-center">
                Amount Requested
              </p>

              <div className="flex items-center justify-center mt-2">
                <span className="text-blue-600 text-xl font-semibold">₹</span>

                <span className="text-slate-900 text-3xl font-extrabold tracking-tight">
                  {Number(data.amount || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Status */}
            <div
              className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              style={{
                animation: "slideUp 0.4s ease-out 0.35s both",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock3 size={15} className="text-blue-600" />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                    Status
                  </p>

                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    Pending Approval
                  </p>
                </div>
              </div>

              <CheckCircle2 size={18} className="text-blue-500" />
            </div>

            {/* Info */}
            <div
              className="mt-4 flex items-start gap-2 px-1"
              style={{
                animation: "slideUp 0.4s ease-out 0.45s both",
              }}
            >
              <Info size={13} className="text-slate-400 mt-0.5 shrink-0" />

              <p className="text-[10px] leading-4 text-slate-400">
                The final amount will be processed according to your withdrawal
                fee and approval rules.
              </p>
            </div>

            {/* Button */}
            <button
              onClick={onClose}
              className="mt-6 w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/15 transition-all active:scale-[0.98]"
              style={{
                animation: "slideUp 0.4s ease-out 0.55s both",
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserWallet;
