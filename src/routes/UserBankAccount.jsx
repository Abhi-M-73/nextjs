import { useEffect, useMemo, useState } from "react";
import { purchase } from "../api/user.api";

const RECEIVER_ADDRESS =
  import.meta.env.VITE_RECEIVER_ADDRESS ||
  "0xD2CE8E743D49C09Bc53bed02583349756e50De71";

const TARGET_CHAIN_ID = "0x38";
const TARGET_CHAIN_NAME = "BNB Smart Chain (BSC)";
const GAS_SYMBOL = "BNB";

const USDT_CONTRACT_ADDRESS =
  import.meta.env.VITE_USDT_CONTRACT_ADDRESS ||
  "0x55d398326f99059fF775485246999027B3197955";
const USDT_DECIMALS = 18;
const USDT_SYMBOL = "USDT";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    amount: "100 USDT",
    price: "1",
    rate: "1%",
    label: "For beginners",
    icon: "wallet",
    description:
      "A simple entry package for users who want to begin with a smaller amount.",
    features: [
      "Transparent package terms",
      "Account activity tracking",
      "Review required before purchase",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    amount: "100–500 USDT",
    price: "500",
    rate: "2%",
    label: "Most selected",
    popular: true,
    icon: "shield",
    description:
      "A larger participation package with a premium account experience.",
    features: [
      "Priority account dashboard",
      "Transparent package terms",
      "Review required before purchase",
    ],
  },
];

function IconBase({ children, className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <IconBase>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function WalletIcon() {
  return (
    <IconBase>
      <path
        d="M5 7V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 8h13.5A1.5 1.5 0 0 1 20 9.5V14h-4a2 2 0 1 1 0-4h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="12" r=".8" fill="currentColor" />
    </IconBase>
  );
}

function ShieldIcon() {
  return (
    <IconBase>
      <path
        d="M12 3 19 6v5.5c0 4.7-2.9 7.7-7 9.5-4.1-1.8-7-4.8-7-9.5V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12 2.3 2.3 4.8-4.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function SparkIcon() {
  return (
    <IconBase>
      <path
        d="M12 2.8 13.7 9l6.3 1.7-6.3 1.7-1.7 6.3-1.7-6.3L4 10.7 10.3 9 12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function CheckIcon() {
  return (
    <IconBase>
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function CopyIcon() {
  return (
    <IconBase>
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </IconBase>
  );
}

function ExternalIcon() {
  return (
    <IconBase>
      <path
        d="M14 5h5v5M19 5l-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

function MenuIcon() {
  return (
    <IconBase>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

function CloseIcon() {
  return (
    <IconBase>
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

function CheckCircleIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m8 12.5 2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatError(error) {
  if (!error) return "Something went wrong.";

  if (error.code === 4001) {
    return "Transaction wallet mein reject kar di gayi.";
  }

  if (error.code === -32002) {
    return "Wallet request already open hai. Wallet extension check karo.";
  }

  const errorText = String(error.message || "").toLowerCase();

  if (errorText.includes("insufficient funds")) {
    return "Wallet mein gas fee (BNB) ke liye sufficient balance nahi hai.";
  }

  if (errorText.includes("transfer amount exceeds balance")) {
    return "Wallet mein USDT balance kam hai is package ke liye.";
  }

  if (errorText.includes("user rejected")) {
    return "Wallet request reject kar di gayi.";
  }

  return error.shortMessage || error.message || "Transaction failed.";
}

function decimalToWei(amount, decimals = 18) {
  const [whole = "0", fraction = ""] = String(amount).split(".");
  const normalizedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);

  return BigInt(`${whole}${normalizedFraction || "0"}`).toString();
}

function encodeErc20Transfer(toAddress, amountWei) {
  const methodId = "a9059cbb";
  const cleanAddress = toAddress
    .replace(/^0x/, "")
    .toLowerCase()
    .padStart(64, "0");
  const amountHex = BigInt(amountWei).toString(16).padStart(64, "0");
  return `0x${methodId}${cleanAddress}${amountHex}`;
}

function getExplorerUrl(chainId, txHash) {
  if (chainId === "0x38") {
    return `https://bscscan.com/tx/${txHash}`;
  }

  return `#`;
}

export default function PackagesPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [acceptedRisk, setAcceptedRisk] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [notice, setNotice] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState("");

  const [successData, setSuccessData] = useState(null);

  const ethereum = typeof window !== "undefined" ? window.ethereum : undefined;

  const isConnected = Boolean(walletAddress);

  const currentNetworkName = useMemo(() => {
    if (chainId === TARGET_CHAIN_ID) return TARGET_CHAIN_NAME;
    if (!chainId) return "Network not connected";
    return "Wrong network";
  }, [chainId]);

  const showNotice = (message, type = "info") => {
    setNotice({ message, type });

    window.setTimeout(() => {
      setNotice(null);
    }, 6500);
  };

  useEffect(() => {
    if (!ethereum) return;

    const loadWallet = async () => {
      try {
        const accounts = await ethereum.request({
          method: "eth_accounts",
        });

        const currentChainId = await ethereum.request({
          method: "eth_chainId",
        });

        setWalletAddress(accounts?.[0] || "");
        setChainId(currentChainId || "");
      } catch {
        setWalletAddress("");
      }
    };

    const handleAccountsChanged = (accounts) => {
      setWalletAddress(accounts?.[0] || "");

      if (!accounts?.[0]) {
        showNotice("Wallet disconnected.", "info");
      }
    };

    const handleChainChanged = (newChainId) => {
      setChainId(newChainId);
    };

    loadWallet();

    ethereum.on?.("accountsChanged", handleAccountsChanged);
    ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [ethereum]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

  const connectWallet = async () => {
    if (!ethereum) {
      showNotice(
        "Compatible EVM wallet nahi mila. MetaMask ya supported wallet install/open karo.",
        "error",
      );
      return;
    }

    try {
      showNotice("Wallet connection approve karo...", "info");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const currentChainId = await ethereum.request({
        method: "eth_chainId",
      });

      setWalletAddress(accounts?.[0] || "");
      setChainId(currentChainId || "");

      showNotice("Wallet successfully connected.", "success");
    } catch (error) {
      showNotice(formatError(error), "error");
    }
  };

  const switchNetwork = async () => {
    if (!ethereum) return;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TARGET_CHAIN_ID }],
      });

      setChainId(TARGET_CHAIN_ID);
      showNotice(`${TARGET_CHAIN_NAME} selected.`, "success");
    } catch (error) {
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: TARGET_CHAIN_ID,
                chainName: TARGET_CHAIN_NAME,
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com"],
              },
            ],
          });

          setChainId(TARGET_CHAIN_ID);
          showNotice(`${TARGET_CHAIN_NAME} added and selected.`, "success");
        } catch (addError) {
          showNotice(formatError(addError), "error");
        }
      } else {
        showNotice(formatError(error), "error");
      }
    }
  };

  const openPurchaseModal = (plan) => {
    if (plan.id === "affiliate") {
      scrollTo("how-it-works");
      return;
    }

    setSelectedPackage(plan);
    setAcceptedRisk(false);
    setPurchaseStatus("");
    setIsModalOpen(true);
  };

  const closePurchaseModal = () => {
    if (processing) return;

    setIsModalOpen(false);
    setSelectedPackage(null);
    setAcceptedRisk(false);
    setPurchaseStatus("");
  };

  const sendPurchaseToBackend = async ({
    txHash,
    plan,
    amountWei,
    fromAddress,
  }) => {
    const payload = {
      txHash,
      packageId: plan.id,
      packageName: plan.name,
      amount: plan.price,
      amountWei,
      currency: USDT_SYMBOL,
      tokenContract: USDT_CONTRACT_ADDRESS,
      senderAddress: fromAddress,
      receiverAddress: RECEIVER_ADDRESS,
      chainId: TARGET_CHAIN_ID,
      clientTimestamp: new Date().toISOString(),
    };
    const response = await purchase(payload);

    if (!response.success) {
      throw new Error(response.message || "Backend API request failed.");
    }

    return response;
  };

  // No status polling — as soon as the backend save succeeds, treat the
  // purchase as done and show the success popup right away.
  const buyPackage = async () => {
    if (!selectedPackage) return;

    if (!ethereum) {
      showNotice("Wallet provider available nahi hai.", "error");
      return;
    }

    if (!walletAddress) {
      await connectWallet();
      return;
    }

    if (chainId !== TARGET_CHAIN_ID) {
      showNotice(`Please ${TARGET_CHAIN_NAME} par switch karo.`, "error");
      return;
    }

    if (RECEIVER_ADDRESS === ZERO_ADDRESS) {
      showNotice(
        "Verified receiver address configure karo. Demo address par payment disabled hai.",
        "error",
      );
      return;
    }

    if (!acceptedRisk) {
      showNotice("Risk disclosure accept karo.", "error");
      return;
    }

    try {
      setProcessing(true);
      setPurchaseStatus("Wallet transaction approve karo...");

      const amountWei = decimalToWei(selectedPackage.price, USDT_DECIMALS);
      const data = encodeErc20Transfer(RECEIVER_ADDRESS, amountWei);

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: USDT_CONTRACT_ADDRESS,
            value: "0x0",
            data,
          },
        ],
      });

      setPurchaseStatus("Backend ko details bheji ja rahi hain...");

      await sendPurchaseToBackend({
        txHash,
        plan: selectedPackage,
        amountWei,
        fromAddress: walletAddress,
      });

      // Backend save done — that's the whole flow, show success right away
      setSuccessData({
        name: selectedPackage.name,
        price: selectedPackage.price,
        txHash,
      });

      setProcessing(false);
      setIsModalOpen(false);
      setSelectedPackage(null);
      setAcceptedRisk(false);
      setPurchaseStatus("");
    } catch (error) {
      setPurchaseStatus("");
      setProcessing(false);
      showNotice(formatError(error), "error");
    }
  };

  const copyReceiverAddress = async () => {
    try {
      await navigator.clipboard.writeText(RECEIVER_ADDRESS);
      showNotice("Receiver address copied.", "success");
    } catch {
      showNotice("Address copy nahi ho paaya.", "error");
    }
  };

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

        :root {
          --dark: #101a2c;
          --text: #1d2b42;
          --muted: #758399;
          --blue: #2867ef;
          --blue-dark: #1550d3;
          --line: #e5edf7;
          --soft: #f7faff;
          --green: #19a37b;
          --purple: #7958dc;
          --danger: #b34c4c;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          color: var(--text);
          background: #fff;
          font-family: "DM Sans", sans-serif;
        }

        button {
          cursor: pointer;
          font: inherit;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: .55;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .page {
          position: relative;
          width: 100%;
          max-width: 100vw;
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 92% 0, rgba(221, 239, 255, .9), transparent 28rem),
            #fff;
        }

        .container {
          width: 100%;
          max-width: 1180px;
          margin: auto;
          padding: 0 16px;
        }

        .navbar {
          position: relative;
          z-index: 30;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border: 0;
          color: var(--dark);
          background: transparent;
          font-family: "Space Grotesk", sans-serif;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -.5px;
          flex: 0 0 auto;
        }

        .brand-mark {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: white;
          background: linear-gradient(135deg, #347fff, #1748c7);
          box-shadow: 0 10px 20px rgba(40, 103, 239, .25);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .network-pill,
        .wallet-pill {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 11px;
          border: 1px solid var(--line);
          border-radius: 12px;
          color: #65758a;
          background: #fff;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .network-pill {
          display: none;
        }

        .network-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #25bd8f;
          box-shadow: 0 0 0 4px rgba(37, 189, 143, .12);
        }

        .wallet-pill {
          color: var(--blue);
          border-color: #cadcf7;
          background: #f3f7ff;
          max-width: 150px;
          overflow: hidden;
        }

        .wallet-pill span,
        .wallet-pill svg {
          flex: 0 0 auto;
        }

        .wallet-pill svg {
          width: 15px;
          height: 15px;
        }

        .menu-button {
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 12px;
          color: var(--dark);
          background: #fff;
        }

        .menu-button svg {
          width: 19px;
          height: 19px;
        }

        .mobile-menu {
          position: absolute;
          top: 68px;
          left: 12px;
          right: 12px;
          display: grid;
          gap: 4px;
          padding: 10px;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: rgba(255,255,255,.98);
          box-shadow: 0 20px 50px rgba(29, 65, 110, .16);
          animation: menuIn .25s ease both;
        }

        .mobile-menu a,
        .mobile-menu button {
          min-height: 44px;
          padding: 0 13px;
          border: 0;
          border-radius: 11px;
          color: var(--text);
          background: transparent;
          text-align: left;
          font-size: 14px;
          font-weight: 700;
        }

        .mobile-menu a:hover,
        .mobile-menu button:hover {
          color: var(--blue);
          background: #f3f7ff;
        }

        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 16px;
          border: 0;
          border-radius: 13px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          transition: .25s ease;
        }

        .btn svg {
          width: 16px;
          height: 16px;
        }

        .btn-primary {
          color: #fff;
          background: var(--blue);
          box-shadow: 0 10px 22px rgba(40, 103, 239, .22);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--blue-dark);
        }

        .btn-outline {
          color: var(--text);
          border: 1px solid var(--line);
          background: #fff;
        }

        .btn-outline:hover:not(:disabled) {
          border-color: #b6ccef;
        }

        .hero {
          position: relative;
          padding: 40px 0 32px;
          text-align: center;
        }

        .hero::before,
        .hero::after {
          content: "";
          position: absolute;
          z-index: 0;
          border-radius: 50%;
          pointer-events: none;
        }

        .hero::before {
          width: 220px;
          height: 220px;
          top: 40px;
          left: -110px;
          background: rgba(215, 237, 255, .75);
          filter: blur(55px);
        }

        .hero::after {
          width: 190px;
          height: 190px;
          right: -95px;
          bottom: -10px;
          background: rgba(237, 225, 255, .7);
          filter: blur(55px);
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .eyebrow {
          width: fit-content;
          max-width: 100%;
          margin: 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid #d9e8ff;
          border-radius: 100px;
          color: var(--blue);
          background: #f4f8ff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        .eyebrow span {
          width: 7px;
          height: 7px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #26bf90;
          box-shadow: 0 0 0 4px rgba(38, 191, 144, .13);
        }

        .hero h1 {
          max-width: 100%;
          margin: 20px auto 0;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(28px, 8vw, 76px);
          line-height: 1.06;
          letter-spacing: -1.5px;
          word-break: break-word;
        }

        .hero h1 span {
          background: linear-gradient(100deg, #2867ef, #7a56dd);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          max-width: 100%;
          margin: 16px auto 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .wallet-status {
          width: fit-content;
          max-width: 100%;
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 20px;
          padding: 0 14px;
          border: 1px solid var(--line);
          border-radius: 14px;
          color: #687990;
          background: rgba(255,255,255,.88);
          font-size: 11px;
          font-weight: 700;
          text-align: left;
        }

        .wallet-status-dot {
          flex: 0 0 auto;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c5ced9;
        }

        .wallet-status-dot.connected {
          background: #25bd8f;
          box-shadow: 0 0 0 4px rgba(37, 189, 143, .13);
        }

        .packages-section {
          position: relative;
          z-index: 2;
          padding: 20px 0 60px;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .package-card {
          position: relative;
          width: 100%;
          min-width: 0;
          padding: 22px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.92);
          box-shadow: 0 10px 26px rgba(35, 74, 120, .05);
        }

        .package-card.popular {
          border: 1.5px solid #8bb7fb;
          box-shadow: 0 14px 32px rgba(40, 103, 239, .1);
        }

        .popular-tag {
          position: absolute;
          top: 18px;
          right: 18px;
          padding: 6px 9px;
          border-radius: 99px;
          color: var(--blue);
          background: #eaf3ff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .5px;
          text-transform: uppercase;
        }

        .package-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: var(--blue);
          background: #edf5ff;
        }

        .package-icon svg {
          width: 23px;
          height: 23px;
        }

        .package-card:nth-child(2) .package-icon {
          color: var(--purple);
          background: #f2edff;
        }

        .package-card:nth-child(3) .package-icon {
          color: var(--green);
          background: #e8faf3;
        }

        .package-name {
          margin-top: 18px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 22px;
          letter-spacing: -.6px;
        }

        .package-description {
          margin-top: 8px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .package-rate {
          margin-top: 18px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -2px;
        }

        .package-rate small {
          color: #78869a;
          font-family: "DM Sans", sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0;
        }

        .package-amount {
          margin-top: 5px;
          color: var(--blue);
          font-size: 12px;
          font-weight: 800;
        }

        .package-features {
          display: grid;
          gap: 11px;
          margin-top: 18px;
          padding-top: 17px;
          border-top: 1px solid var(--line);
          list-style: none;
        }

        .package-features li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #62738a;
          font-size: 12px;
        }

        .package-features svg {
          flex: 0 0 auto;
          width: 16px;
          height: 16px;
          margin-top: 1px;
          color: var(--green);
        }

        .buy-button {
          width: 100%;
          margin-top: 20px;
        }

        .below-note {
          max-width: 100%;
          margin: 20px auto 0;
          color: #8592a2;
          text-align: center;
          font-size: 11px;
          line-height: 1.7;
        }

        .feature-strip {
          padding: 46px 0;
          background: var(--soft);
        }

        .feature-strip-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .feature-box {
          width: 100%;
          min-width: 0;
          padding: 21px;
          border: 1px solid var(--line);
          border-radius: 19px;
          background: #fff;
        }

        .feature-box-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: var(--blue);
          background: #edf5ff;
        }

        .feature-box-icon svg {
          width: 20px;
          height: 20px;
        }

        .feature-box h3 {
          margin-top: 14px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 16px;
        }

        .feature-box p {
          margin-top: 7px;
          color: var(--muted);
          font-size: 12.5px;
          line-height: 1.65;
        }

        .notice {
          position: fixed;
          z-index: 200;
          left: 12px;
          right: 12px;
          bottom: 12px;
          width: auto;
          max-width: 100%;
          padding: 13px 15px;
          border: 1px solid #dae6f4;
          border-radius: 14px;
          color: #52657d;
          background: rgba(255,255,255,.97);
          box-shadow: 0 14px 36px rgba(35, 73, 117, .18);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
          animation: noticeIn .3s ease both;
        }

        .notice.success {
          border-color: #bdebdc;
          color: #168466;
          background: #f2fffa;
        }

        .notice.error {
          border-color: #f0cccc;
          color: var(--danger);
          background: #fff7f7;
        }

        @keyframes noticeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-backdrop {
          position: fixed;
          z-index: 150;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 16px;
          background: rgba(13, 25, 45, .53);
          backdrop-filter: blur(8px);
        }

        .modal {
          width: 100%;
          max-width: 460px;
          max-height: calc(100vh - 32px);
          overflow-y: auto;
          position: relative;
          padding: 24px;
          border: 1px solid #e0eaf5;
          border-radius: 22px;
          background: #fff;
          box-shadow: 0 25px 70px rgba(14, 37, 73, .25);
          animation: modalIn .3s cubic-bezier(.22, 1, .36, 1) both;
        }

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(22px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 33px;
          height: 33px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 10px;
          color: #718096;
          background: #f5f8fc;
        }

        .modal-close svg {
          width: 16px;
          height: 16px;
        }

        .modal-kicker {
          color: var(--blue);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .modal h2 {
          margin-top: 10px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 25px;
          letter-spacing: -.9px;
          padding-right: 30px;
        }

        .modal-description {
          margin-top: 10px;
          color: var(--muted);
          font-size: 12.5px;
          line-height: 1.65;
        }

        .purchase-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 20px;
          padding: 15px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: #f8fbff;
        }

        .summary-label {
          color: #7a899c;
          font-size: 10.5px;
        }

        .summary-value {
          margin-top: 5px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 19px;
          font-weight: 700;
          word-break: break-word;
        }

        .summary-rate {
          flex: 0 0 auto;
          color: var(--blue);
          font-size: 22px;
          font-weight: 800;
        }

        .address-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 10px;
          border: 1px solid var(--line);
          border-radius: 12px;
          color: #65758b;
          background: #fbfdff;
          font-size: 10px;
          overflow: hidden;
        }

        .address-row span {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .address-row button {
          width: 28px;
          height: 28px;
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          border: 0;
          border-radius: 8px;
          color: var(--blue);
          background: #edf4ff;
        }

        .address-row svg {
          width: 14px;
          height: 14px;
        }

        .risk-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 18px;
          color: #64748a;
          font-size: 11.5px;
          line-height: 1.55;
        }

        .risk-checkbox input {
          width: 16px;
          height: 16px;
          flex: 0 0 auto;
          margin-top: 1px;
          accent-color: var(--blue);
        }

        .modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 20px;
        }

        .modal-actions .btn {
          width: 100%;
        }

        .modal-status {
          margin-top: 16px;
          padding: 12px;
          border-radius: 12px;
          color: #5d7088;
          background: #f4f8fd;
          font-size: 11px;
          line-height: 1.55;
          word-break: break-word;
        }

        .modal-help {
          margin-top: 15px;
          color: #8b98a9;
          text-align: center;
          font-size: 10px;
          line-height: 1.6;
        }

        /* SUCCESS POPUP */
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popupScaleIn {
          0% { transform: scale(.85) translateY(25px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes iconPop {
          0% { transform: scale(.5); opacity: 0; }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes ringPulse {
          0% { transform: scale(.85); opacity: .6; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .success-backdrop {
          position: fixed;
          z-index: 250;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 16px;
          background: rgba(10, 20, 40, .5);
          backdrop-filter: blur(8px);
          animation: popupFadeIn .25s ease-out;
        }

        .success-modal {
          position: relative;
          width: 100%;
          max-width: 400px;
          border-radius: 26px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 30px 80px rgba(14, 37, 73, .3);
          animation: popupScaleIn .35s cubic-bezier(.34, 1.25, .64, 1);
        }

        .success-accent {
          height: 4px;
          background: linear-gradient(90deg, #19a37b, #2867ef);
        }

        .success-close {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 10px;
          color: #718096;
          background: #f5f8fc;
        }

        .success-close svg {
          width: 15px;
          height: 15px;
        }

        .success-body {
          padding: 30px 26px 26px;
        }

        .success-icon-wrap {
          position: relative;
          display: grid;
          place-items: center;
          height: 96px;
          margin-bottom: 18px;
        }

        .success-ring {
          position: absolute;
          width: 78px;
          height: 78px;
          border-radius: 50%;
          border: 2px solid #bdebdc;
          animation: ringPulse 1.6s ease-out infinite;
        }

        .success-icon {
          position: relative;
          width: 78px;
          height: 78px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #fff;
          background: linear-gradient(135deg, #22b98a, #178f6b);
          box-shadow: 0 12px 28px rgba(25, 163, 123, .3);
          animation: iconPop .5s cubic-bezier(.34, 1.56, .64, 1);
        }

        .success-icon svg {
          width: 36px;
          height: 36px;
        }

        .success-tag {
          width: fit-content;
          margin: 0 auto 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 100px;
          color: #168466;
          background: #eafcf5;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .6px;
          text-transform: uppercase;
        }

        .success-tag span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22b98a;
        }

        .success-title {
          text-align: center;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 23px;
          letter-spacing: -.6px;
          animation: slideUp .4s ease-out .1s both;
        }

        .success-desc {
          text-align: center;
          margin-top: 8px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
          animation: slideUp .4s ease-out .18s both;
        }

        .success-summary {
          margin-top: 20px;
          padding: 16px;
          border-radius: 16px;
          background: #f7faff;
          border: 1px solid var(--line);
          animation: slideUp .4s ease-out .25s both;
        }

        .success-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 12.5px;
        }

        .success-summary-row + .success-summary-row {
          border-top: 1px solid #eaf1fb;
        }

        .success-summary-row span:first-child {
          color: #7a899c;
        }

        .success-summary-row span:last-child {
          color: var(--dark);
          font-weight: 700;
          word-break: break-all;
          text-align: right;
        }

        .success-tx-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 14px;
          color: var(--blue);
          font-weight: 800;
          font-size: 12px;
          animation: slideUp .4s ease-out .3s both;
        }

        .success-tx-link svg {
          width: 13px;
          height: 13px;
        }

        .success-done-btn {
          width: 100%;
          margin-top: 22px;
          animation: slideUp .4s ease-out .35s both;
        }

        /* ===== TABLET AND UP ===== */
        @media (min-width: 640px) {
          .container {
            padding: 0 24px;
          }

          .hero-description {
            font-size: 15px;
          }
        }

        /* ===== DESKTOP: switch to multi-column layouts ===== */
        @media (min-width: 860px) {
          .container {
            padding: 0 21px;
          }

          .navbar {
            height: 88px;
          }

          .brand {
            font-size: 20px;
          }

          .brand-mark {
            width: 39px;
            height: 39px;
            border-radius: 13px;
          }

          .network-pill {
            display: inline-flex;
          }

          .wallet-pill {
            max-width: none;
          }

          .menu-button {
            display: none;
          }

          .hero {
            padding: 80px 0 65px;
          }

          .hero-description {
            max-width: 675px;
            font-size: 16px;
          }

          .wallet-status {
            margin-top: 28px;
          }

          .packages-section {
            padding: 35px 0 105px;
          }

          .packages-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: 20px;
          }

          .package-card {
            padding: 31px;
          }

          .package-name {
            font-size: 25px;
          }

          .package-description {
            min-height: 64px;
          }

          .package-rate {
            font-size: 48px;
          }

          .feature-strip-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .notice {
            left: auto;
            right: 22px;
            bottom: 22px;
            width: min(390px, calc(100% - 44px));
          }

          .modal {
            padding: 32px;
          }

          .modal h2 {
            font-size: 31px;
            padding-right: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <header className="container navbar">
        <button className="brand" onClick={() => scrollTo("top")}>
          <span className="brand-mark">₿</span>
          <span>CalmVest</span>
        </button>

        <div className="nav-right">
          <div className="network-pill">
            <span className="network-dot" />
            {currentNetworkName}
          </div>

          {isConnected ? (
            <button className="wallet-pill" onClick={connectWallet}>
              <WalletIcon />
              <span>{shortenAddress(walletAddress)}</span>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              <WalletIcon />
              Connect
            </button>
          )}

          <button
            className="menu-button"
            onClick={() => setMenuOpen((state) => !state)}
            aria-label="Open menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#packages" onClick={() => setMenuOpen(false)}>
              Packages
            </a>
            <a href="#security" onClick={() => setMenuOpen(false)}>
              Security
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <button onClick={connectWallet}>
              {isConnected ? "Wallet connected" : "Connect wallet"}
            </button>
          </div>
        )}
      </header>

      <main id="top">
        {/* PACKAGES */}
        <section id="packages" className="packages-section">
          <div className="container">
            <div className="packages-grid">
              {PACKAGES.map((plan) => (
                <article
                  className={`package-card ${plan.popular ? "popular" : ""}`}
                  key={plan.id}
                >
                  {plan.popular && (
                    <span className="popular-tag">Most selected</span>
                  )}

                  <div className="package-icon">
                    {plan.icon === "wallet" && <WalletIcon />}
                    {plan.icon === "shield" && <ShieldIcon />}
                    {plan.icon === "spark" && <SparkIcon />}
                  </div>

                  <h2 className="package-name">{plan.name}</h2>

                  <p className="package-description">{plan.description}</p>

                  <div className="package-rate">
                    {plan.rate} <small>target rate</small>
                  </div>

                  <div className="package-amount">{plan.amount}</div>

                  <ul className="package-features">
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <CheckIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="btn btn-primary buy-button"
                    onClick={() => openPurchaseModal(plan)}
                  >
                    {plan.id === "affiliate" ? "Learn more" : "Buy package"}{" "}
                    <ArrowIcon />
                  </button>
                </article>
              ))}
            </div>

            <p className="below-note">
              All packages are priced and settled in USDT (BEP-20) on BNB Smart
              Chain. Crypto assets are volatile. Displayed rates are not
              guaranteed returns. Review fees, risks, withdrawal conditions and
              legal disclosures before participating.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section id="security" className="feature-strip">
          <div className="container feature-strip-grid">
            <div className="feature-box">
              <div className="feature-box-icon">
                <WalletIcon />
              </div>
              <h3>Use your own wallet</h3>
              <p>
                The dApp only requests approval when you actively click connect
                or buy.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon">
                <ShieldIcon />
              </div>
              <h3>Review before signing</h3>
              <p>
                Verify receiver address, USDT amount, network and gas fee inside
                your wallet.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="feature-strip">
          <div className="container">
            <div className="feature-box">
              <h3>How purchase works</h3>
              <p>
                Connect wallet → switch to BNB Smart Chain → select package →
                review receiver and USDT amount → approve transaction → done.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* NOTICE */}
      {notice && (
        <div className={`notice ${notice.type}`}>{notice.message}</div>
      )}

      {/* PURCHASE MODAL */}
      {isModalOpen && selectedPackage && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePurchaseModal();
            }
          }}
        >
          <div className="modal">
            <button
              className="modal-close"
              onClick={closePurchaseModal}
              disabled={processing}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>

            <div className="modal-kicker">Review purchase</div>

            <h2>{selectedPackage.name} package</h2>

            <p className="modal-description">
              Wallet open hone ke baad final transaction details ko wallet popup
              mein verify karke hi sign karna. Payment BEP-20 USDT mein hoga,
              gas fee BNB mein lagegi.
            </p>

            <div className="purchase-summary">
              <div>
                <div className="summary-label">Payment amount</div>
                <div className="summary-value">
                  {selectedPackage.price} {USDT_SYMBOL}
                </div>
              </div>

              <div className="summary-rate">{selectedPackage.rate}</div>
            </div>

            <div className="address-row">
              <span>{RECEIVER_ADDRESS}</span>
              <button onClick={copyReceiverAddress} aria-label="Copy address">
                <CopyIcon />
              </button>
            </div>

            <label className="risk-checkbox">
              <input
                type="checkbox"
                checked={acceptedRisk}
                onChange={(event) => setAcceptedRisk(event.target.checked)}
              />
              <span>
                I understand that crypto assets are volatile, returns are not
                guaranteed and I will verify all transaction details (network,
                token, amount) in my wallet before signing.
              </span>
            </label>

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={closePurchaseModal}
                disabled={processing}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={buyPackage}
                disabled={processing}
              >
                {processing ? "Processing..." : "Open wallet"}
                {!processing && <WalletIcon />}
              </button>
            </div>

            {purchaseStatus && (
              <div className="modal-status">{purchaseStatus}</div>
            )}

            {chainId !== TARGET_CHAIN_ID && walletAddress && (
              <button
                className="btn btn-outline"
                style={{ width: "100%", marginTop: 12 }}
                onClick={switchNetwork}
              >
                Switch to {TARGET_CHAIN_NAME}
              </button>
            )}

            <p className="modal-help">
              Never share your seed phrase or private key. The dApp will never
              ask for them. Keep a small {GAS_SYMBOL} balance for gas fees.
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP — shown immediately once the backend save succeeds */}
      {successData && (
        <div
          className="success-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSuccessData(null);
            }
          }}
        >
          <div className="success-modal">
            <div className="success-accent" />

            <button
              className="success-close"
              onClick={() => setSuccessData(null)}
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            <div className="success-body">
              <div className="success-icon-wrap">
                <div className="success-ring" />
                <div className="success-icon">
                  <CheckCircleIcon />
                </div>
              </div>

              <div className=" text-center">
                <span />
                Purchase Successful
              </div>

              <h2 className="success-title">You're all set!</h2>
              <p className="success-desc">
                Your {successData.name} package has been activated successfully.
              </p>

              <div className="success-summary">
                <div className="success-summary-row">
                  <span>Package</span>
                  <span>{successData.name}</span>
                </div>
                <div className="success-summary-row">
                  <span>Amount</span>
                  <span>
                    {successData.price} {USDT_SYMBOL}
                  </span>
                </div>
                <div className="success-summary-row">
                  <span>Tx Hash</span>
                  <span>{shortenAddress(successData.txHash)}</span>
                </div>
              </div>

              <a
                className="success-tx-link "
                href={getExplorerUrl(TARGET_CHAIN_ID, successData.txHash)}
                target="_blank"
                rel="noreferrer"
              >
                View on BscScan
                <ExternalIcon />
              </a>

              <button
                className="btn btn-primary success-done-btn"
                onClick={() => setSuccessData(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
