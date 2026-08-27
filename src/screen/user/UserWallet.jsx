import React, { useState } from "react";
import {
    ArrowUpRight,
    ArrowDownLeft,
    Network,
    TrendingUp,
    CheckCircle2,
    X,
    Copy,
    ExternalLink,
} from "lucide-react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import mainContent from "../../utils/mainContent";
import { withdrawRequest } from "../../api/user.api";
import useFetchProfile from "../../hooks/useFetchProfile";
import { showSnackbar } from "../../redux/slices/snackbarSlice";
import DepositModal from "../../components/all/DepositModel";

const UserWallet = () => {
    const { fetchUserInfo } = useFetchProfile();
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("deposit"); // deposit | withdraw
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [depositOpen, setDepositOpen] = useState(false);

    const [successData, setSuccessData] = useState(null);

    const MIN_WITHDRAWAL_AMOUNT = 50;

    const dispatch = useDispatch();

    const handleWithdraw = async () => {
        try {
            if (!amount) {
                dispatch(showSnackbar({ message: "Please enter an amount to withdraw.", severity: "error" }));
                return;
            }
            if (amount <= 0) {
                dispatch(showSnackbar({ message: "Amount must be greater than zero.", severity: "error" }));
                return;
            }
            if (parseFloat(amount) < MIN_WITHDRAWAL_AMOUNT) {
                dispatch(showSnackbar({ message: `Minimum withdrawal is ${MIN_WITHDRAWAL_AMOUNT}.`, severity: "error" }));
                return;
            }
            if (parseFloat(amount) > user?.currentEarnings) {
                dispatch(showSnackbar({ message: "Insufficient balance.", severity: "error" }));
                return;
            }

            setLoading(true);
            const response = await withdrawRequest({ amount: parseFloat(amount) });
            if (response?.success) {
                setSuccessData({
                    netAmount: response?.data?.netAmountSent || parseFloat(amount) * 0.95,
                    amount: response?.data?.amountRequested || parseFloat(amount),
                    fee: response?.data?.feeDeducted || parseFloat(amount) * 0.05,
                    txHash: response?.data?.txHash,
                    token: response?.data?.token || "LLD",
                });
                setAmount("");
                fetchUserInfo();
            }
        } catch (error) {
            dispatch(showSnackbar({ message: "Failed to process withdrawal. Try again! ❌", severity: "error" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 pb-24">
            <div className="max-w-lg mx-auto space-y-6">
                {/* Earnings Overview */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                    <h2 className="text-gray-900 font-semibold">Wallet Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 text-blue-600 text-sm">
                                <TrendingUp size={16} />
                                Total Investment
                            </div>
                            <div className="flex items-center mt-2">
                                ₹
                                <p className="text-gray-900 text-lg font-bold">
                                    {user?.totalInvestment?.toFixed(2) || 0}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 text-blue-600 text-sm">
                                <Network size={16} />
                                Total Payouts
                            </div>
                            <div className="flex items-center mt-2">
                                ₹
                                <p className="text-gray-900 text-lg font-bold">{user?.totalPayouts?.toFixed(2) || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deposit / Withdraw Tabs */}
                <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm flex gap-2">
                    <button
                        onClick={() => setActiveTab("deposit")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === "deposit"
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        <ArrowDownLeft size={16} />
                        Deposit
                    </button>
                    <button
                        onClick={() => setActiveTab("withdraw")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === "withdraw"
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        <ArrowUpRight size={16} />
                        Withdraw
                    </button>
                </div>

                {/* Deposit panel */}
                {activeTab === "deposit" && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                        <h2 className="text-gray-900 font-semibold flex items-center gap-2">
                            <ArrowDownLeft size={16} className="text-blue-600" />
                            Add Funds
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Top up your wallet to activate or upgrade your package.
                        </p>
                        <Button
                            onClick={() => setDepositOpen(true)}
                            variant="contained"
                            fullWidth
                            sx={{
                                background: "#2563eb",
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "999px",
                                py: 1.2,
                                "&:hover": { background: "#1d4ed8" },
                            }}
                        >
                            Deposit Now
                        </Button>

                        <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
                    </div>
                )}

                {/* Withdraw panel */}
                {activeTab === "withdraw" && (
                    <>
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <h2 className="text-gray-900 font-semibold mb-2">Withdrawal Feature</h2>
                            <div className="flex items-center gap-1.5 text-sm">
                                <span className="text-gray-500">Withdrawal feature are coming soone</span>
                            </div>
                        </div>
                        {/* <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <h2 className="text-gray-900 font-semibold mb-2">Withdrawal Rules</h2>
                            <div className="flex items-center gap-1.5 text-sm">
                                <span className="text-gray-500">Minimum withdrawal:</span>
                                <span className="text-gray-900 font-semibold">{MIN_WITHDRAWAL_AMOUNT}</span>
                            </div>
                        </div> */}

                        {/* <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <h2 className="text-gray-900 font-semibold flex items-center gap-2">
                                    <ArrowUpRight size={16} className="text-blue-600" />
                                    Total Stake Income
                                </h2>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <span className="text-gray-500">Balance:</span>
                                    <span className="text-gray-900 font-semibold">
                                        {user?.currentEarnings?.toFixed(2) || 0}
                                    </span>
                                </div>
                            </div>

                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
                                onWheel={(e) => e.target.blur()}
                            />

                            <Button
                                onClick={handleWithdraw}
                                disabled={loading || parseFloat(amount) > user?.currentEarnings}
                                variant="contained"
                                fullWidth
                                sx={{
                                    background: "#2563eb",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    borderRadius: "999px",
                                    py: 1.2,
                                    "&:hover": { background: "#1d4ed8" },
                                    "&.Mui-disabled": { background: "#93c5fd", color: "#fff" },
                                }}
                            >
                                {loading ? "Processing..." : "Withdraw"}
                            </Button>
                        </div> */}
                    </>
                )}
            </div>

            {successData && (
                <WithdrawalSuccessPopup
                    data={successData}
                    onClose={() => setSuccessData(null)}
                />
            )}
        </div>
    );
};

// ========================================
// PREMIUM SUCCESS POPUP - white theme
// ========================================
const WithdrawalSuccessPopup = ({ data, onClose, logo }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data.txHash || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <style>{`
        @keyframes popupFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupScaleIn {
          0% { transform: scale(0.7) translateY(40px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes checkBounce {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes ringPulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                style={{ animation: "popupFadeIn 0.3s ease-out" }}
                onClick={onClose}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
                    style={{ animation: "popupScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all"
                    >
                        <X size={16} />
                    </button>

                    <div className="p-8 pt-10">
                        <div className="relative flex items-center justify-center mb-6 h-24">
                            <div
                                className="absolute w-24 h-24 rounded-full border-2 border-blue-200"
                                style={{ animation: "ringPulse 1.5s ease-out infinite" }}
                            />
                            <div
                                className="relative w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center"
                                style={{ animation: "checkBounce 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.2s both" }}
                            >
                                <CheckCircle2 size={44} className="text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="text-center" style={{ animation: "slideUp 0.5s ease-out 0.4s both" }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-3">
                                <span className="text-blue-600 text-xs font-semibold tracking-wide uppercase">
                                    Withdrawal Successful
                                </span>
                            </div>
                            <h2 className="text-gray-900 text-2xl font-bold mb-2">
                                Your tokens are on the way! 🚀
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Transaction confirmed on the Ethereum network
                            </p>
                        </div>

                        <div
                            className="mt-6 p-5 rounded-2xl bg-blue-50 border border-blue-100"
                            style={{ animation: "slideUp 0.5s ease-out 0.5s both" }}
                        >
                            <p className="text-gray-500 text-xs uppercase tracking-wider text-center mb-2">
                                Amount Sent
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-gray-900 text-4xl font-bold">
                                    {data.amount?.toFixed(4)}
                                </span>
                                <span className="text-blue-600 text-md font-bold">{data.token}</span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2" style={{ animation: "slideUp 0.5s ease-out 0.6s both" }}>
                            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50">
                                <span className="text-gray-500 text-sm">Requested</span>
                                <span className="text-gray-900 text-sm font-semibold">
                                    {data.amount?.toFixed(4)} LLD
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-6 w-full py-3 rounded-full bg-blue-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            style={{ animation: "slideUp 0.5s ease-out 0.8s both" }}
                        >
                            Awesome, thanks!
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserWallet;