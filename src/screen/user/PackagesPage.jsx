import React, { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const RECEIVER_ADDRESS = "0x0000000000000000000000000000000000000000";

// Apni actual chain ke hisaab se values change karo.
const TARGET_CHAIN_ID = "0x1"; // Ethereum Mainnet
const TARGET_CHAIN_NAME = "Ethereum Mainnet";
const CURRENCY_SYMBOL = "ETH";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    amount: "1–100 USDT",
    price: "0.01",
    rate: "1%",
    description:
      "A simple entry option for users starting with a smaller amount.",
    color: "blue",
    features: [
      "Transparent package terms",
      "Account activity tracking",
      "Review required before purchase",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    amount: "500–1,000 USDT",
    price: "0.05",
    rate: "2%",
    description:
      "A larger participation option with a premium account experience.",
    color: "purple",
    popular: true,
    features: [
      "Priority account dashboard",
      "Transparent package terms",
      "Review required before purchase",
    ],
  },
  {
    id: "affiliate",
    name: "Affiliate",
    amount: "Referral program",
    price: "0.01",
    rate: "1%",
    description:
      "Referral commission program for eligible verified participants.",
    color: "green",
    features: [
      "Referral tracking",
      "Commission reporting",
      "Terms and eligibility apply",
    ],
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
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
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
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
    </svg>
  );
}

function shortenAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatError(error) {
  if (!error) return "Something went wrong.";

  if (error.code === 4001) {
    return "Transaction was rejected in your wallet.";
  }

  if (error.code === -32002) {
    return "Wallet request already open hai. Please wallet extension check karo.";
  }

  if (error.message?.toLowerCase().includes("insufficient funds")) {
    return "Wallet mein transaction fee ke liye sufficient balance nahi hai.";
  }

  return error.shortMessage || error.message || "Transaction failed.";
}

export default function PackagesPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState("");
  const [activePackage, setActivePackage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showModal, setShowModal] = useState(false);
  const [acceptedRisk, setAcceptedRisk] = useState(false);

  const ethereum = typeof window !== "undefined" ? window.ethereum : undefined;

  useEffect(() => {
    if (!ethereum) return;

    ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        if (accounts?.[0]) setWalletAddress(accounts[0]);
      })
      .catch(() => {});

    ethereum
      .request({ method: "eth_chainId" })
      .then((id) => setChainId(id))
      .catch(() => {});

    const handleAccountsChanged = (accounts) => {
      setWalletAddress(accounts?.[0] || "");
      if (!accounts?.[0]) {
        setMessage("Wallet disconnected.");
        setMessageType("info");
      }
    };

    const handleChainChanged = (id) => {
      setChainId(id);
    };

    ethereum.on?.("accountsChanged", handleAccountsChanged);
    ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [ethereum]);

  const connectWallet = async () => {
    if (!ethereum) {
      setMessage(
        "Compatible wallet nahi mila. MetaMask ya supported EVM wallet install/open karo.",
      );
      setMessageType("error");
      return;
    }

    try {
      setMessage("Wallet connection approve karo...");
      setMessageType("info");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const currentChainId = await ethereum.request({
        method: "eth_chainId",
      });

      setWalletAddress(accounts?.[0] || "");
      setChainId(currentChainId);
      setMessage("Wallet successfully connected.");
      setMessageType("success");
    } catch (error) {
      setMessage(formatError(error));
      setMessageType("error");
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
      setMessage(`${TARGET_CHAIN_NAME} selected.`);
      setMessageType("success");
    } catch (error) {
      setMessage(formatError(error));
      setMessageType("error");
    }
  };

  const openBuyModal = (selectedPackage) => {
    setActivePackage(selectedPackage);
    setAcceptedRisk(false);
    setMessage("");
    setShowModal(true);
  };

  const sendNativePayment = async () => {
    if (!activePackage) return;

    if (!ethereum) {
      setMessage("Wallet provider available nahi hai.");
      setMessageType("error");
      return;
    }

    if (!walletAddress) {
      await connectWallet();
      return;
    }

    if (chainId !== TARGET_CHAIN_ID) {
      setMessage(`Please ${TARGET_CHAIN_NAME} par switch karo.`);
      setMessageType("error");
      return;
    }

    if (RECEIVER_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setMessage(
        "Demo receiver address configured hai. Real transaction se pehle verified receiver address add karo.",
      );
      setMessageType("error");
      return;
    }

    if (!acceptedRisk) {
      setMessage("Please risk disclosure accept karo.");
      setMessageType("error");
      return;
    }

    try {
      setProcessing(true);
      setMessage("Wallet transaction approve karo...");
      setMessageType("info");

      const valueInWei = BigInt(Math.round(Number(activePackage.price) * 1e6))
        .toString(16)
        .padStart(16, "0");

      const transactionHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: RECEIVER_ADDRESS,
            value: `0x${valueInWei}`,
          },
        ],
      });

      setMessage(`Transaction submitted: ${transactionHash.slice(0, 12)}...`);
      setMessageType("success");
      setShowModal(false);
    } catch (error) {
      setMessage(formatError(error));
      setMessageType("error");
    } finally {
      setProcessing(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setMessage("Wallet disconnected from this interface.");
    setMessageType("info");
  };

  return (
    <div className="packages-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

        :root {
          --dark: #111b2e;
          --text: #1d2b42;
          --muted: #758399;
          --blue: #2867ef;
          --blue-dark: #1550d3;
          --line: #e5edf7;
          --soft: #f7faff;
          --green: #1aa37b;
          --purple: #7958dc;
        }

        * {
          box-sizing: border-box;
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

        .packages-page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 90% 0, rgba(222, 239, 255, .9), transparent 27rem),
            #fff;
        }

        .packages-container {
          width: min(1180px, calc(100% - 42px));
          margin: auto;
        }

        .packages-nav {
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .package-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          border: 0;
          color: var(--dark);
          background: transparent;
          font-family: "Space Grotesk", sans-serif;
          font-size: 20px;
          font-weight: 700;
        }

        .brand-mark {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: #fff;
          background: linear-gradient(135deg, #347fff, #1748c7);
          box-shadow: 0 12px 25px rgba(40, 103, 239, .25);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .network-pill,
        .wallet-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 43px;
          padding: 0 13px;
          border: 1px solid var(--line);
          border-radius: 13px;
          color: #627188;
          background: #fff;
          font-size: 12px;
          font-weight: 800;
        }

        .network-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #25bd8f;
          box-shadow: 0 0 0 5px rgba(37, 189, 143, .13);
        }

        .wallet-pill {
          color: var(--blue);
          border-color: #cfe0fb;
          background: #f3f7ff;
        }

        .wallet-pill .wallet-svg {
          width: 18px;
          height: 18px;
        }

        .btn {
          min-height: 49px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 21px;
          border: 0;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 800;
          transition: .25s ease;
        }

        .btn svg {
          width: 17px;
          height: 17px;
        }

        .btn-primary {
          color: #fff;
          background: var(--blue);
          box-shadow: 0 13px 27px rgba(40, 103, 239, .24);
        }

        .btn-primary:hover {
          background: var(--blue-dark);
          transform: translateY(-3px);
          box-shadow: 0 17px 34px rgba(40, 103, 239, .32);
        }

        .btn-outline {
          color: var(--text);
          border: 1px solid var(--line);
          background: #fff;
        }

        .btn-outline:hover {
          border-color: #b8cef0;
          transform: translateY(-2px);
        }

        .hero {
          position: relative;
          padding: 85px 0 70px;
          text-align: center;
        }

        .hero::before,
        .hero::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .hero::before {
          width: 310px;
          height: 310px;
          left: -170px;
          top: 70px;
          background: rgba(218, 238, 255, .8);
          filter: blur(65px);
        }

        .hero::after {
          width: 240px;
          height: 240px;
          right: -120px;
          bottom: 0;
          background: rgba(235, 224, 255, .68);
          filter: blur(70px);
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .eyebrow {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid #d9e8ff;
          border-radius: 99px;
          color: var(--blue);
          background: #f4f8ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .eyebrow span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #26bf90;
          box-shadow: 0 0 0 5px rgba(38, 191, 144, .13);
        }

        .hero h1 {
          max-width: 850px;
          margin: 24px auto 0;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(45px, 6vw, 76px);
          line-height: 1.02;
          letter-spacing: -4px;
        }

        .hero h1 span {
          color: var(--blue);
          background: linear-gradient(100deg, #2867ef, #7a56dd);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          max-width: 650px;
          margin: 22px auto 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .wallet-status {
          width: fit-content;
          min-height: 47px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 27px;
          padding: 0 16px;
          border: 1px solid #e2eaf4;
          border-radius: 15px;
          color: #64748a;
          background: rgba(255,255,255,.85);
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(39, 76, 118, .06);
        }

        .wallet-status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: ${walletAddress ? "#25bd8f" : "#c4ccd7"};
        }

        .packages-section {
          position: relative;
          z-index: 2;
          padding: 35px 0 110px;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .package-card {
          position: relative;
          padding: 31px;
          border: 1px solid var(--line);
          border-radius: 25px;
          background: rgba(255,255,255,.9);
          box-shadow: 0 18px 42px rgba(35, 74, 120, .055);
          transition: .3s ease;
        }

        .package-card:hover {
          transform: translateY(-8px);
          border-color: #aac8f5;
          box-shadow: 0 25px 55px rgba(40, 103, 239, .14);
        }

        .package-card.popular {
          border: 1.5px solid #8bb7fb;
          box-shadow: 0 21px 50px rgba(40, 103, 239, .12);
        }

        .popular-tag {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 7px 10px;
          border-radius: 99px;
          color: var(--blue);
          background: #eaf3ff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .6px;
          text-transform: uppercase;
        }

        .package-icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          color: var(--blue);
          background: #edf5ff;
        }

        .package-icon svg {
          width: 26px;
          height: 26px;
        }

        .package-card.purple .package-icon {
          color: var(--purple);
          background: #f2edff;
        }

        .package-card.green .package-icon {
          color: var(--green);
          background: #e8faf3;
        }

        .package-name {
          margin-top: 23px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 25px;
          font-weight: 700;
          letter-spacing: -.8px;
        }

        .package-description {
          min-height: 64px;
          margin-top: 10px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .package-rate {
          margin-top: 23px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 48px;
          font-weight: 700;
          letter-spacing: -2.8px;
        }

        .package-rate small {
          color: #78869a;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0;
        }

        .package-amount {
          margin-top: 5px;
          color: var(--blue);
          font-size: 13px;
          font-weight: 800;
        }

        .package-features {
          display: grid;
          gap: 13px;
          margin-top: 23px;
          padding-top: 21px;
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
          width: 17px;
          height: 17px;
          color: var(--green);
        }

        .buy-button {
          width: 100%;
          margin-top: 27px;
        }

        .below-note {
          max-width: 700px;
          margin: 25px auto 0;
          color: #8491a1;
          text-align: center;
          font-size: 11px;
          line-height: 1.65;
        }

        .feature-strip {
          padding: 85px 0;
          background: var(--soft);
        }

        .feature-strip-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .feature-box {
          padding: 26px;
          border: 1px solid var(--line);
          border-radius: 21px;
          background: #fff;
        }

        .feature-box h3 {
          margin-top: 17px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 18px;
        }

        .feature-box p {
          margin-top: 8px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .feature-box-icon {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--blue);
          background: #edf5ff;
        }

        .feature-box-icon svg {
          width: 23px;
          height: 23px;
        }

        .alert {
          position: fixed;
          z-index: 200;
          right: 22px;
          bottom: 22px;
          max-width: min(390px, calc(100% - 44px));
          padding: 15px 17px;
          border: 1px solid #dbe7f5;
          border-radius: 15px;
          color: #52657d;
          background: rgba(255,255,255,.96);
          box-shadow: 0 18px 45px rgba(35, 73, 117, .18);
          font-size: 12px;
          font-weight: 700;
          line-height: 1.55;
          animation: alertIn .3s ease both;
        }

        .alert.success {
          border-color: #bdebdc;
          color: #168466;
          background: #f2fffa;
        }

        .alert.error {
          border-color: #f0cccc;
          color: #a34646;
          background: #fff7f7;
        }

        @keyframes alertIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-backdrop {
          position: fixed;
          z-index: 150;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(13, 25, 45, .52);
          backdrop-filter: blur(8px);
        }

        .modal {
          width: min(500px, 100%);
          position: relative;
          padding: 31px;
          border: 1px solid #e0eaf5;
          border-radius: 25px;
          background: #fff;
          box-shadow: 0 30px 90px rgba(14, 37, 73, .25);
          animation: modalIn .3s cubic-bezier(.22, 1, .36, 1) both;
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(22px) scale(.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 17px;
          width: 35px;
          height: 35px;
          border: 0;
          border-radius: 10px;
          color: #718096;
          background: #f5f8fc;
          font-size: 22px;
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
          font-size: 31px;
          letter-spacing: -1.2px;
        }

        .modal-description {
          margin-top: 10px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .purchase-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: #f8fbff;
        }

        .summary-label {
          color: #7a899c;
          font-size: 11px;
        }

        .summary-value {
          margin-top: 5px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 22px;
          font-weight: 700;
        }

        .summary-rate {
          color: var(--blue);
          font-size: 24px;
          font-weight: 800;
        }

        .risk-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 21px;
          color: #64748a;
          font-size: 12px;
          line-height: 1.55;
        }

        .risk-checkbox input {
          width: 17px;
          height: 17px;
          margin-top: 1px;
          accent-color: var(--blue);
        }

        .modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 24px;
        }

        .modal-actions .btn {
          width: 100%;
        }

        .modal-help {
          margin-top: 17px;
          color: #8b98a9;
          text-align: center;
          font-size: 10px;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .packages-grid,
          .feature-strip-grid {
            grid-template-columns: 1fr;
            max-width: 590px;
            margin: auto;
          }

          .package-card {
            padding: 29px;
          }
        }

        @media (max-width: 650px) {
          .packages-container {
            width: min(100% - 30px, 550px);
          }

          .packages-nav {
            height: 72px;
          }

          .nav-right .network-pill {
            display: none;
          }

          .hero {
            padding: 55px 0 48px;
          }

          .hero h1 {
            font-size: 47px;
            letter-spacing: -2.8px;
          }

          .hero p {
            font-size: 14px;
          }

          .wallet-status {
            max-width: 100%;
            text-align: left;
          }

          .packages-section {
            padding: 23px 0 75px;
          }

          .package-card {
            padding: 25px;
          }

          .package-rate {
            font-size: 43px;
          }

          .modal {
            padding: 26px 21px;
          }

          .modal h2 {
            font-size: 27px;
          }

          .modal-actions {
            grid-template-columns: 1fr;
          }

          .alert {
            right: 15px;
            bottom: 15px;
            max-width: calc(100% - 30px);
          }
        }
      `}</style>

      <header className="packages-container packages-nav">
        <button
          className="package-brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="brand-mark">₿</span>
          <span>CalmVest</span>
        </button>

        <div className="nav-right">
          <div className="network-pill">
            <span className="network-dot" />
            {chainId === TARGET_CHAIN_ID ? TARGET_CHAIN_NAME : "Network check"}
          </div>

          {walletAddress ? (
            <button className="wallet-pill" onClick={disconnectWallet}>
              <span className="wallet-svg">
                <WalletIcon />
              </span>
              {shortenAddress(walletAddress)}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              <WalletIcon />
              Connect wallet
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="packages-container hero-content">
            <div className="eyebrow">
              <span />
              Premium package center
            </div>

            <h1>
              Choose your plan. <span>Connect and continue.</span>
            </h1>

            <p>
              Explore all available packages, connect your compatible wallet and
              review the transaction details before approving anything.
            </p>

            <div className="wallet-status">
              <span className="wallet-status-dot" />
              {walletAddress
                ? `Connected wallet: ${shortenAddress(walletAddress)}`
                : "Wallet not connected — connect before purchasing"}
            </div>
          </div>
        </section>

        <section className="packages-section">
          <div className="packages-container">
            <div className="packages-grid">
              {PACKAGES.map((plan) => (
                <article
                  className={`package-card ${plan.color} ${
                    plan.popular ? "popular" : ""
                  }`}
                  key={plan.id}
                >
                  {plan.popular && (
                    <span className="popular-tag">Most selected</span>
                  )}

                  <div className="package-icon">
                    {plan.id === "starter" && <WalletIcon />}
                    {plan.id === "growth" && <ShieldIcon />}
                    {plan.id === "affiliate" && <ArrowIcon />}
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
                    onClick={() => openBuyModal(plan)}
                  >
                    Buy package <ArrowIcon />
                  </button>
                </article>
              ))}
            </div>

            <p className="below-note">
              Crypto assets are volatile. Rates shown on this page are not
              guaranteed returns. Review all terms, fees, risks and withdrawal
              conditions before connecting a wallet or approving a transaction.
            </p>
          </div>
        </section>

        <section className="feature-strip">
          <div className="packages-container feature-strip-grid">
            <div className="feature-box">
              <div className="feature-box-icon">
                <WalletIcon />
              </div>
              <h3>Use your own wallet</h3>
              <p>
                The dApp requests wallet approval only when you actively click
                the connect or buy button.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon">
                <ShieldIcon />
              </div>
              <h3>Review before signing</h3>
              <p>
                Always verify the network, receiver address, amount and gas fee
                inside your wallet.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-box-icon">
                <CheckIcon />
              </div>
              <h3>Clear transaction flow</h3>
              <p>
                Connect, select a package, review the summary and then approve
                the transaction in your wallet.
              </p>
            </div>
          </div>
        </section>
      </main>

      {message && <div className={`alert ${messageType}`}>{message}</div>}

      {showModal && activePackage && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="modal-kicker">Review purchase</div>
            <h2>{activePackage.name} package</h2>

            <p className="modal-description">
              Carefully review this information before opening your wallet and
              approving the transaction.
            </p>

            <div className="purchase-summary">
              <div>
                <div className="summary-label">Transaction amount</div>
                <div className="summary-value">
                  {activePackage.price} {CURRENCY_SYMBOL}
                </div>
              </div>

              <div className="summary-rate">{activePackage.rate}</div>
            </div>

            <label className="risk-checkbox">
              <input
                type="checkbox"
                checked={acceptedRisk}
                onChange={(event) => setAcceptedRisk(event.target.checked)}
              />
              <span>
                I understand that crypto assets are volatile, returns are not
                guaranteed and I will verify the transaction details in my
                wallet before approval.
              </span>
            </label>

            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={sendNativePayment}
                disabled={processing}
                style={{
                  opacity: processing ? 0.65 : 1,
                  cursor: processing ? "wait" : "pointer",
                }}
              >
                {processing ? "Waiting..." : "Open wallet"}
                {!processing && <WalletIcon />}
              </button>
            </div>

            <p className="modal-help">
              Never share your seed phrase or private key. Your wallet should
              display the final transaction details before signing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
