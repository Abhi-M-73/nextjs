// import { useState, useEffect, useRef } from "react";
// import { ethers } from "ethers";
// import { WalletBalance } from "../../utils/WalletBalance";
// import { useSelector } from "react-redux";
// import {
//   AlertTriangle,
//   Wallet,
//   Zap,
//   CheckCircle2,
//   Loader2,
//   ArrowRight,
//   Shield,
//   ExternalLink,
//   X,
//   Sparkles,
//   Crown,
//   Copy,
//   TrendingUp,
//   Users,
// } from "lucide-react";
// import { buyLLD } from "../../api/user.api";

// const CONTRACT_ADDRESS = "0x58A9996250111af893545a5cf4185E5537c7A4F5";
// const MAINNET_CHAIN_ID = "0x1";
// const ABI = [
//   "function buyWithETH(uint256 minLLD,address[3] calldata refs) external payable",
// ];

// const BOUGHT_EVENT_ABI = [
//   "event Bought(address indexed buyer, uint256 spent, uint256 received, address indexed ref1, address indexed ref2, address ref3)",
// ];

// const LLD_LOGO =
//   "https://coin-images.coingecko.com/coins/images/33625/large/Liberland_Dollar_Square_200px.png?1702532879";
// const MIN_BUY = 1;

// const calcDistribution = (totalLLD) => {
//   const userShare = (totalLLD * 85n) / 100n;
//   const lvl1 = (totalLLD * 5n) / 100n;
//   const lvl2 = (totalLLD * 3n) / 100n;
//   const lvl3 = (totalLLD * 2n) / 100n;
//   const adminShare = (totalLLD * 5n) / 100n;
//   return { userShare, lvl1, lvl2, lvl3, adminShare };
// };

// const QUICK_AMOUNTS = [10, 25, 50, 100];

// export default function BuyLLD() {
//   const { user } = useSelector((state) => state.auth);
//   const [usdtAmount, setUsdtAmount] = useState("");
//   const [ethRequired, setEthRequired] = useState(0);
//   const [ethRequiredDisplay, setEthRequiredDisplay] = useState("—");
//   const [selectedQuick, setSelectedQuick] = useState(null);

//   const ref1 = user?.uplineWallets?.[0] || "";
//   const ref2 = user?.uplineWallets?.[1] || "";
//   const ref3 = user?.uplineWallets?.[2] || "";

//   const [walletAddress, setWalletAddress] = useState(null);
//   const [ethBalance, setEthBalance] = useState(0);
//   const [balanceDisplay, setBalanceDisplay] = useState("—");
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
//   const [statusMsg, setStatusMsg] = useState("");
//   const [statusType, setStatusType] = useState("info");
//   const [isLoading, setIsLoading] = useState(false);
//   const [priceLoading, setPriceLoading] = useState(false);
//   const [txHash, setTxHash] = useState("");
//   const [ethPrice, setEthPrice] = useState(null);

//   // 🎉 Popup state
//   const [successData, setSuccessData] = useState(null);
//   const [copied, setCopied] = useState(false);

//   const debTimer = useRef(null);
//   const lastReqId = useRef(0);

//   // 🔊 Success sound
//   const playSuccessSound = () => {
//     try {
//       const AudioContext = window.AudioContext || window.webkitAudioContext;
//       const ctx = new AudioContext();
//       const notes = [
//         { freq: 523.25, time: 0, duration: 0.15 },
//         { freq: 659.25, time: 0.1, duration: 0.15 },
//         { freq: 783.99, time: 0.2, duration: 0.3 },
//       ];
//       notes.forEach(({ freq, time, duration }) => {
//         const osc = ctx.createOscillator();
//         const gain = ctx.createGain();
//         osc.type = "sine";
//         osc.frequency.value = freq;
//         gain.gain.setValueAtTime(0, ctx.currentTime + time);
//         gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + time + 0.02);
//         gain.gain.exponentialRampToValueAtTime(
//           0.001,
//           ctx.currentTime + time + duration,
//         );
//         osc.connect(gain);
//         gain.connect(ctx.destination);
//         osc.start(ctx.currentTime + time);
//         osc.stop(ctx.currentTime + time + duration);
//       });
//     } catch (err) {}
//   };

//   const formatLLD = (bigIntStr) => {
//     try {
//       return parseFloat(ethers.formatUnits(bigIntStr, 18)).toFixed(4);
//     } catch {
//       return "0.0000";
//     }
//   };

//   useEffect(() => {
//     const fetchPrice = async () => {
//       try {
//         const res = await fetch(
//           "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
//         );
//         const data = await res.json();
//         setEthPrice(Number(data?.price));
//       } catch {}
//     };
//     fetchPrice();
//     const interval = setInterval(fetchPrice, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const showStatus = (msg, type = "info") => {
//     setStatusMsg(msg);
//     setStatusType(type);
//   };

//   const checkNetwork = async () => {
//     const chainId = await window.ethereum.request({ method: "eth_chainId" });
//     const correct = chainId === MAINNET_CHAIN_ID;
//     setIsCorrectNetwork(correct);
//     return correct;
//   };

//   const switchToMainnet = async () => {
//     try {
//       await window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: MAINNET_CHAIN_ID }],
//       });
//     } catch (e) {
//       showStatus("Network switch failed: " + (e?.message || e), "err");
//     }
//   };

//   const fetchBalance = async (addr, prov) => {
//     const bal = await prov.getBalance(addr);
//     const formatted = parseFloat(ethers.formatEther(bal));
//     setEthBalance(formatted);
//     setBalanceDisplay(formatted.toFixed(6) + " ETH");
//     return formatted;
//   };

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       showStatus("MetaMask is not installed.", "err");
//       return;
//     }
//     try {
//       setIsLoading(true);
//       showStatus("Connecting wallet...", "info");
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       const netOk = await checkNetwork();
//       if (!netOk) {
//         await switchToMainnet();
//         await checkNetwork();
//       }
//       const _provider = new ethers.BrowserProvider(window.ethereum);
//       const _signer = await _provider.getSigner();
//       const address = await _signer.getAddress();
//       setProvider(_provider);
//       setSigner(_signer);
//       setWalletAddress(address);
//       await fetchBalance(address, _provider);
//       setStatusMsg("");

//       window.ethereum.on("chainChanged", async () => {
//         const correct = await checkNetwork();
//         if (correct) {
//           const p = new ethers.BrowserProvider(window.ethereum);
//           const s = await p.getSigner();
//           const a = await s.getAddress();
//           setProvider(p);
//           setSigner(s);
//           setWalletAddress(a);
//           await fetchBalance(a, p);
//         }
//       });
//       window.ethereum.on("accountsChanged", async (accounts) => {
//         if (accounts.length === 0) {
//           setWalletAddress(null);
//           setSigner(null);
//           setEthBalance(0);
//           setBalanceDisplay("—");
//           setIsCorrectNetwork(false);
//         } else {
//           const p = new ethers.BrowserProvider(window.ethereum);
//           const s = await p.getSigner();
//           setProvider(p);
//           setSigner(s);
//           setWalletAddress(accounts[0]);
//           await checkNetwork();
//           await fetchBalance(accounts[0], p);
//         }
//       });
//     } catch (e) {
//       showStatus("Connect failed: " + (e?.message || e), "err");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleQuickAmount = (amount) => {
//     setSelectedQuick(amount);
//     setUsdtAmount(String(amount));
//   };

//   useEffect(() => {
//     if (debTimer.current) clearTimeout(debTimer.current);
//     const amount = Number(usdtAmount);
//     if (!amount || amount <= 0) {
//       setEthRequired(0);
//       setEthRequiredDisplay("—");
//       return;
//     }
//     setPriceLoading(true);
//     setEthRequiredDisplay("...");
//     const rid = ++lastReqId.current;
//     debTimer.current = setTimeout(async () => {
//       try {
//         let price = ethPrice;
//         if (!price) {
//           const res = await fetch(
//             "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
//           );
//           const data = await res.json();
//           price = Number(data?.price);
//           setEthPrice(price);
//         }
//         if (rid !== lastReqId.current) return;
//         if (!price) throw new Error("Price unavailable");
//         const eth = amount / price;
//         const finalEth = eth * 1.005 + 0.0005;
//         setEthRequired(finalEth);
//         setEthRequiredDisplay(finalEth.toFixed(6) + " ETH");
//       } catch {
//         if (rid !== lastReqId.current) return;
//         setEthRequired(0);
//         setEthRequiredDisplay("Price fetch failed");
//       } finally {
//         setPriceLoading(false);
//       }
//     }, 400);
//   }, [usdtAmount, ethPrice]);

//   const saveTxToBackend = async (payload) => {
//     try {
//       const res = await buyLLD(payload);
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         console.error("Backend save failed:", err);
//       } else {
//         console.log("✅ TX saved to backend successfully");
//       }
//     } catch (err) {
//       console.error("Backend API error (non-blocking):", err);
//     }
//   };

//   const buyWithETH = async () => {
//     if (!signer) {
//       showStatus("Please connect your wallet first.", "err");
//       return;
//     }
//     if (!isCorrectNetwork) {
//       showStatus("Please switch to Ethereum Mainnet.", "err");
//       return;
//     }
//     if (ethBalance <= 0) {
//       showStatus("Your ETH balance is zero.", "err");
//       return;
//     }
//     if (ethRequired <= 0) {
//       showStatus("Please enter a valid USDT amount.", "err");
//       return;
//     }
//     if (ethBalance < ethRequired) {
//       showStatus("Insufficient ETH balance.", "err");
//       return;
//     }
//     if (usdtAmount < MIN_BUY) {
//       showStatus(`Please enter a minimum ${MIN_BUY} USDT amount.`);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       showStatus("Preparing transaction...", "info");
//       const ethAmt = ethers.parseEther(ethRequired.toFixed(18));

//       const safeAddr = (addr) =>
//         ethers.isAddress(addr) ? addr : ethers.ZeroAddress;
//       const refs = [safeAddr(ref1), safeAddr(ref2), safeAddr(ref3)];

//       const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
//       let gas;
//       try {
//         gas = await contract.buyWithETH.estimateGas(0, refs, { value: ethAmt });
//       } catch {
//         gas = 300000n;
//       }

//       showStatus("Confirm in your wallet...", "info");
//       const tx = await contract.buyWithETH(0, refs, {
//         value: ethAmt,
//         gasLimit: (gas * 120n) / 100n,
//       });

//       setTxHash(tx.hash);
//       showStatus("Transaction pending... Waiting for confirmation ⏳", "info");

//       const receipt = await tx.wait();

//       let distribution = null;
//       try {
//         const iface = new ethers.Interface(BOUGHT_EVENT_ABI);
//         for (const log of receipt.logs) {
//           try {
//             const parsed = iface.parseLog(log);
//             if (parsed && parsed.name === "Bought") {
//               const totalLLD = parsed.args.received;
//               const dist = calcDistribution(totalLLD);
//               distribution = {
//                 totalLLD: totalLLD.toString(),
//                 userShare: dist.userShare.toString(),
//                 ref1Share: dist.lvl1.toString(),
//                 ref2Share: dist.lvl2.toString(),
//                 ref3Share: dist.lvl3.toString(),
//                 adminShare: dist.adminShare.toString(),
//                 spentETH: parsed.args.spent.toString(),
//               };
//               break;
//             }
//           } catch {}
//         }
//       } catch {}

//       const payload = {
//         txHash: tx.hash,
//         blockNumber: receipt.blockNumber,
//         buyer: walletAddress,
//         usdtEquivalent: usdtAmount,
//         ethSpent: ethRequired.toFixed(8),
//         ethPriceUSD: ethPrice,
//         contractAddress: CONTRACT_ADDRESS,
//         refs: {
//           ref1: ethers.isAddress(ref1) ? ref1 : null,
//           ref2: ethers.isAddress(ref2) ? ref2 : null,
//           ref3: ethers.isAddress(ref3) ? ref3 : null,
//         },
//         distribution,
//         timestamp: new Date().toISOString(),
//         userId: user?._id || user?.id || null,
//       };

//       await saveTxToBackend(payload);

//       // 🎉 Show popup
//       playSuccessSound();
//       setSuccessData({
//         txHash: tx.hash,
//         usdtAmount: usdtAmount,
//         ethSpent: ethRequired.toFixed(6),
//         distribution,
//       });

//       setStatusMsg("");
//       setUsdtAmount("");
//       setSelectedQuick(null);
//       setEthRequired(0);
//       setEthRequiredDisplay("—");
//       await fetchBalance(walletAddress, provider);
//     } catch (e) {
//       showStatus(e?.reason || e?.message || "Transaction failed", "err");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCopyTx = () => {
//     if (successData?.txHash) {
//       navigator.clipboard.writeText(successData.txHash);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   const closePopup = () => {
//     setSuccessData(null);
//     setCopied(false);
//     setTxHash("");
//   };

//   const isLowBalance =
//     walletAddress && ethRequired > 0 && ethBalance < ethRequired;
//   const isBuyDisabled =
//     !walletAddress ||
//     !isCorrectNetwork ||
//     !usdtAmount ||
//     parseFloat(usdtAmount) <= 0 ||
//     ethRequired <= 0 ||
//     ethBalance < ethRequired ||
//     isLoading;

//   const walletStatus = !walletAddress
//     ? "disconnected"
//     : !isCorrectNetwork
//       ? "wrong"
//       : "connected";

//   const quickEthDisplay = (amt) => {
//     if (!ethPrice) return null;
//     const eth = (amt / ethPrice) * 1.005 + 0.0005;
//     return eth.toFixed(5);
//   };

//   const confetti = Array.from({ length: 30 }, (_, i) => i);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

//         .b-root *, .b-root *::before, .b-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         .b-root { font-family: 'Space Grotesk', sans-serif; min-height: 100vh; background: #04060f;
//           display: flex; justify-content: center; align-items: flex-start;
//           padding: 2.5rem 1rem 5rem; position: relative; overflow-x: hidden; }
//         .b-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none;
//           background: radial-gradient(ellipse 80% 50% at 20% 0%, rgba(0,210,120,0.07) 0%, transparent 60%),
//                       radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0,180,255,0.05) 0%, transparent 55%); }
//         .b-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none;
//           background-image: linear-gradient(rgba(0,210,120,0.025) 1px, transparent 1px),
//                             linear-gradient(90deg, rgba(0,210,120,0.025) 1px, transparent 1px);
//           background-size: 44px 44px; }
//         .b-scanline { position: fixed; inset: 0; z-index: 0; pointer-events: none;
//           background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px); }
//         .b-card { position: relative; z-index: 1; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 12px; }
//         .b-panel { background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%);
//           border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 1.75rem;
//           position: relative; overflow: hidden; backdrop-filter: blur(24px);
//           box-shadow: 0 0 0 1px rgba(0,210,120,0.06) inset, 0 24px 80px rgba(0,0,0,0.7); }
//         .b-panel::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
//           background: linear-gradient(90deg, transparent, rgba(0,210,120,0.5), rgba(0,180,255,0.3), transparent); }
//         .b-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
//         .b-header-left { display: flex; align-items: center; gap: 12px; }
//         .b-logo { width: 46px; height: 46px; border-radius: 14px; border: 1px solid rgba(0,210,120,0.25);
//           display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0;
//           box-shadow: 0 0 24px rgba(0,210,120,0.12); }
//         .b-logo::after { content: ''; position: absolute; inset: -1px; border-radius: 14px;
//           background: linear-gradient(135deg, rgba(0,210,120,0.3), transparent); z-index: -1; }
//         .b-title { font-size: 17px; font-weight: 700; letter-spacing: -0.4px; color: #f0fff8; }
//         .b-sub { font-size: 11px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; margin-top: 2px; letter-spacing: 0.3px; }
//         .b-price-badge { display: flex; align-items: center; gap: 6px; background: rgba(0,210,120,0.08);
//           border: 1px solid rgba(0,210,120,0.15); border-radius: 8px; padding: 6px 10px;
//           font-size: 11px; font-family: 'JetBrains Mono', monospace; color: rgba(0,210,120,0.8); }
//         .b-price-dot { width: 6px; height: 6px; border-radius: 50%; background: #00d278; animation: bPulse 2s ease-in-out infinite; }
//         @keyframes bPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
//         .b-wallet-bar { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 10px 14px; margin-bottom: 12px; }
//         .b-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
//         .b-dot.connected { background: #00d278; box-shadow: 0 0 10px rgba(0,210,120,0.7); animation: bGlow 2s ease-in-out infinite; }
//         @keyframes bGlow { 0%,100%{box-shadow:0 0 6px rgba(0,210,120,0.5)} 50%{box-shadow:0 0 14px rgba(0,210,120,0.9)} }
//         .b-dot.wrong { background: #f59e0b; }
//         .b-dot.disconnected { background: rgba(255,255,255,0.2); }
//         .b-wallet-text { font-size: 12px; font-family: 'JetBrains Mono', monospace; flex: 1; min-width: 0; }
//         .b-wallet-text.connected { color: #00d278; }
//         .b-wallet-text.wrong { color: #f59e0b; }
//         .b-wallet-text.disconnected { color: rgba(255,255,255,0.3); }
//         .b-addr { font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: rgba(255,255,255,0.2); margin-top: 6px; letter-spacing: 0.3px; }
//         .b-connect-btn { display: flex; align-items: center; gap: 6px; background: rgba(0,210,120,0.1);
//           border: 1px solid rgba(0,210,120,0.2); color: #00d278; border-radius: 9px; padding: 7px 13px;
//           font-size: 12px; font-weight: 600; font-family: 'Space Grotesk', sans-serif; cursor: pointer;
//           white-space: nowrap; transition: all 0.2s; flex-shrink: 0; }
//         .b-connect-btn:hover:not(:disabled) { background: rgba(0,210,120,0.18); border-color: rgba(0,210,120,0.4); box-shadow: 0 0 16px rgba(0,210,120,0.12); }
//         .b-connect-btn:disabled { opacity: 0.5; cursor: not-allowed; }
//         .b-balance-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1.25rem; }
//         .b-stat { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px 14px; }
//         .b-stat-lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.3); margin-bottom: 5px; font-weight: 600; }
//         .b-stat-val { font-size: 15px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #e8fff4; }
//         .b-stat-val.green { color: #00d278; }
//         .b-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); margin: 1.1rem 0; }
//         .b-section-lbl { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.35); margin-bottom: 10px; }
//         .b-quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
//         .b-quick-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
//           border-radius: 11px; padding: 10px 6px 8px; text-align: center; cursor: pointer;
//           transition: all 0.2s; position: relative; overflow: hidden; }
//         .b-quick-btn::before { content: ''; position: absolute; inset: 0;
//           background: linear-gradient(135deg, rgba(0,210,120,0.12), transparent); opacity: 0; transition: opacity 0.2s; }
//         .b-quick-btn:hover::before, .b-quick-btn.active::before { opacity: 1; }
//         .b-quick-btn:hover { border-color: rgba(0,210,120,0.3); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,210,120,0.08); }
//         .b-quick-btn.active { border-color: rgba(0,210,120,0.5); background: rgba(0,210,120,0.08); box-shadow: 0 0 20px rgba(0,210,120,0.1); }
//         .b-quick-usd { font-size: 14px; font-weight: 700; color: #e8fff4; display: block; position: relative; z-index: 1; }
//         .b-quick-eth { font-size: 9px; font-family: 'JetBrains Mono', monospace; color: rgba(0,210,120,0.7); display: block; margin-top: 3px; position: relative; z-index: 1; }
//         .b-input-wrap { position: relative; margin-bottom: 10px; }
//         .b-input-wrap input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
//           border-radius: 13px; padding: 15px 70px 15px 18px; font-size: 22px; font-weight: 700;
//           font-family: 'JetBrains Mono', monospace; color: #fff; outline: none; transition: all 0.2s; -moz-appearance: textfield; }
//         .b-input-wrap input::-webkit-outer-spin-button, .b-input-wrap input::-webkit-inner-spin-button { -webkit-appearance: none; }
//         .b-input-wrap input::placeholder { color: rgba(255,255,255,0.12); font-size: 18px; font-weight: 400; }
//         .b-input-wrap input:focus { border-color: rgba(0,210,120,0.35); background: rgba(0,210,120,0.04); box-shadow: 0 0 0 3px rgba(0,210,120,0.07); }
//         .b-input-badge { position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
//           font-size: 11px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
//           color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.07);
//           border: 1px solid rgba(255,255,255,0.09); border-radius: 6px; padding: 3px 8px; }
//         .b-eth-row { display: flex; align-items: center; justify-content: space-between;
//           background: rgba(0,210,120,0.04); border: 1px solid rgba(0,210,120,0.1);
//           border-radius: 12px; padding: 13px 16px; margin-bottom: 12px; }
//         .b-eth-lbl { font-size: 11px; color: rgba(255,255,255,0.35); font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
//         .b-eth-val { font-size: 16px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #00d278; display: flex; align-items: center; gap: 7px; }
//         .b-warn { display: flex; align-items: flex-start; gap: 10px; background: rgba(245,158,11,0.05);
//           border: 1px solid rgba(245,158,11,0.18); border-radius: 11px; padding: 11px 14px; margin-bottom: 12px;
//           font-size: 12px; color: rgba(252,196,100,0.9); line-height: 1.55; }
//         .b-warn-net { flex-direction: column; }
//         .b-switch-btn { display: inline-flex; align-items: center; gap: 5px; margin-top: 9px;
//           background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.25); color: #f59e0b;
//           font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600;
//           padding: 6px 13px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
//         .b-switch-btn:hover { background: rgba(245,158,11,0.2); }
//         .b-secure { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.02);
//           border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 9px 13px; margin-bottom: 14px;
//           font-size: 12px; color: rgba(255,255,255,0.22); font-family: 'JetBrains Mono', monospace; }
//         .b-buy-btn { width: 100%; padding: 16px; border-radius: 14px; border: none;
//           font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700;
//           letter-spacing: 0.2px; cursor: pointer; transition: all 0.25s;
//           display: flex; align-items: center; justify-content: center; gap: 10px;
//           position: relative; overflow: hidden; }
//         .b-buy-btn::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); transition: left 0.5s; }
//         .b-buy-btn:not(:disabled):hover::after { left: 150%; }
//         .b-buy-btn:not(:disabled) { background: linear-gradient(135deg, #00b866, #00d278, #00e682);
//           color: #020f08; box-shadow: 0 4px 24px rgba(0,210,120,0.35), 0 1px 0 rgba(255,255,255,0.15) inset; }
//         .b-buy-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(0,210,120,0.5); }
//         .b-buy-btn:not(:disabled):active { transform: translateY(0); }
//         .b-buy-btn:disabled { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.18); cursor: not-allowed; }
//         .b-status { display: flex; align-items: flex-start; gap: 10px; border-radius: 11px; padding: 12px 14px;
//           margin-top: 11px; font-size: 12px; line-height: 1.5; font-family: 'JetBrains Mono', monospace; animation: bFadeIn 0.3s ease; }
//         @keyframes bFadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
//         .b-status.ok { background: rgba(0,210,120,0.07); border: 1px solid rgba(0,210,120,0.2); color: #00d278; }
//         .b-status.err { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
//         .b-status.info { background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.18); color: #a5b4fc; }
//         .b-tx-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; font-size: 10px; color: rgba(255,255,255,0.25); text-decoration: none; }
//         .b-tx-link:hover { color: rgba(0,210,120,0.7); }
//         .b-chain-panel { background: linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
//           border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 1.4rem; position: relative; overflow: hidden; }
//         .b-chain-panel::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); }
//         .b-footer { font-size: 12px; font-family: 'JetBrains Mono', monospace;
//           color: rgba(255,255,255,0.1); text-align: center; letter-spacing: 0.4px; padding: 0 1rem; }
//         .b-spin { animation: bSpin 0.75s linear infinite; }
//         @keyframes bSpin { to{ transform: rotate(360deg); } }
//         .b-ref-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
//         @media (max-width: 500px) {
//           .b-panel { padding: 1.35rem; }
//           .b-quick-usd { font-size: 13px; }
//           .b-input-wrap input { font-size: 19px; }
//         }

//         /* ═══════ SUCCESS POPUP ═══════ */
//         @keyframes popupFadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes popupScaleIn {
//           0% { transform: scale(0.7) translateY(40px); opacity: 0; }
//           60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
//           100% { transform: scale(1) translateY(0); opacity: 1; }
//         }
//         @keyframes checkBounce {
//           0% { transform: scale(0) rotate(-45deg); opacity: 0; }
//           50% { transform: scale(1.3) rotate(10deg); opacity: 1; }
//           100% { transform: scale(1) rotate(0deg); opacity: 1; }
//         }
//         @keyframes ringPulse {
//           0% { transform: scale(0.8); opacity: 0.8; }
//           100% { transform: scale(2.2); opacity: 0; }
//         }
//         @keyframes coinFloat {
//           0% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-8px) rotate(180deg); }
//           100% { transform: translateY(0) rotate(360deg); }
//         }
//         @keyframes coinSlideInLeft {
//           0% { transform: translateX(-30px) scale(0); opacity: 0; }
//           100% { transform: translateX(0) scale(1); opacity: 1; }
//         }
//         @keyframes coinSlideInRight {
//           0% { transform: translateX(30px) scale(0); opacity: 0; }
//           100% { transform: translateX(0) scale(1); opacity: 1; }
//         }
//         @keyframes sparkleFloat {
//           0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
//           50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
//         }
//         @keyframes amountCount {
//           from { transform: scale(0.5); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }
//         @keyframes confettiFall {
//           0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
//           100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
//         }
//         @keyframes shimmerAnim {
//           0% { background-position: -200% 0; }
//           100% { background-position: 200% 0; }
//         }
//         @keyframes glowPulseGreen {
//           0%, 100% { box-shadow: 0 0 20px rgba(0,210,120,0.4), 0 0 40px rgba(0,210,120,0.2); }
//           50% { box-shadow: 0 0 30px rgba(0,210,120,0.6), 0 0 60px rgba(0,210,120,0.3); }
//         }
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(15px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .bp-backdrop {
//           position: fixed; inset: 0; z-index: 9999;
//           background: rgba(0,0,0,0.75); backdrop-filter: blur(12px);
//           display: flex; align-items: center; justify-content: center;
//           padding: 1rem; overflow: hidden;
//           animation: popupFadeIn 0.3s ease-out;
//         }
//         .bp-card {
//           position: relative; width: 100%; max-width: 440px;
//           background: linear-gradient(160deg, #0a1f15 0%, #040c08 60%, #000 100%);
//           border: 1px solid rgba(0,210,120,0.3); border-radius: 24px;
//           overflow: hidden; max-height: 92vh; overflow-y: auto;
//           animation: popupScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//           box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 80px rgba(0,210,120,0.15);
//         }
//         .bp-shimmer {
//           position: absolute; top: 0; left: 0; right: 0; height: 2px;
//           background: linear-gradient(90deg, transparent, #00d278, transparent);
//           background-size: 200% 100%; animation: shimmerAnim 2s linear infinite;
//         }
//         .bp-close {
//           position: absolute; top: 14px; right: 14px; z-index: 10;
//           width: 32px; height: 32px; border-radius: 50%;
//           background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
//           display: flex; align-items: center; justify-content: center;
//           color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s;
//         }
//         .bp-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
//         .bp-content { padding: 2rem 1.75rem; }
//         .bp-icon-wrap {
//           position: relative; display: flex; align-items: center; justify-content: center;
//           height: 130px; margin-bottom: 1.25rem;
//         }
//         .bp-ring {
//           position: absolute; width: 96px; height: 96px; border-radius: 50%;
//           border: 2px solid #00d278; animation: ringPulse 1.5s ease-out infinite;
//         }
//         .bp-ring-2 { animation-delay: 0.5s; }
//         .bp-coin { position: absolute; width: 48px; height: 48px; }
//         .bp-coin-left { left: calc(50% - 80px);
//           animation: coinSlideInLeft 0.6s ease-out 0.3s both, coinFloat 3s ease-in-out 0.9s infinite; }
//         .bp-coin-right { right: calc(50% - 80px);
//           animation: coinSlideInRight 0.6s ease-out 0.3s both, coinFloat 3s ease-in-out 1.2s infinite; }
//         .bp-coin-blur { position: absolute; inset: 0; border-radius: 50%;
//           background: #00d278; filter: blur(12px); opacity: 0.6; }
//         .bp-coin img { position: relative; width: 100%; height: 100%; border-radius: 50%; }
//         .bp-check-circle {
//           position: relative; width: 96px; height: 96px; border-radius: 50%;
//           background: linear-gradient(135deg, #00d278, #00b866);
//           display: flex; align-items: center; justify-content: center; z-index: 10;
//           animation: glowPulseGreen 2s ease-in-out infinite;
//         }
//         .bp-check-inner { animation: checkBounce 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.4s both; }
//         .bp-sparkle { position: absolute; color: #00d278; }
//         .bp-sparkle-1 { top: 8px; left: 60px; animation: sparkleFloat 2s ease-in-out infinite; }
//         .bp-sparkle-2 { bottom: 8px; right: 80px; animation: sparkleFloat 2s ease-in-out 0.5s infinite; }
//         .bp-sparkle-3 { top: 24px; right: 50px; color: #fde047; animation: sparkleFloat 2.5s ease-in-out 1s infinite; }
//         .bp-title-wrap { text-align: center; animation: slideUp 0.5s ease-out 0.6s both; }
//         .bp-badge {
//           display: inline-flex; align-items: center; gap: 6px;
//           padding: 5px 12px; border-radius: 999px;
//           background: rgba(0,210,120,0.1); border: 1px solid rgba(0,210,120,0.3);
//           color: #00d278; font-size: 10px; font-weight: 700;
//           letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;
//           font-family: 'JetBrains Mono', monospace;
//         }
//         .bp-heading { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 6px; }
//         .bp-subheading { font-size: 13px; color: rgba(255,255,255,0.5); }
//         .bp-amount-box {
//           margin-top: 1.25rem; padding: 1.25rem;
//           background: linear-gradient(135deg, rgba(0,210,120,0.1), transparent);
//           border: 1px solid rgba(0,210,120,0.25); border-radius: 18px;
//           animation: slideUp 0.5s ease-out 0.8s both;
//         }
//         .bp-amount-lbl {
//           font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px;
//           color: rgba(255,255,255,0.4); text-align: center; margin-bottom: 10px;
//           font-family: 'JetBrains Mono', monospace; font-weight: 600;
//         }
//         .bp-amount-val {
//           display: flex; align-items: center; justify-content: center; gap: 12px;
//           animation: amountCount 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s both;
//         }
//         .bp-amount-val img { width: 40px; height: 40px; border-radius: 50%; }
//         .bp-amount-val .num {
//           font-size: 32px; font-weight: 700;
//           background: linear-gradient(to right, #fff, #00d278);
//           -webkit-background-clip: text; background-clip: text; color: transparent;
//           font-family: 'JetBrains Mono', monospace;
//         }
//         .bp-amount-val .sym { font-size: 18px; font-weight: 700; color: #00d278; }
//         .bp-breakdown { margin-top: 1rem; display: flex; flex-direction: column; gap: 6px;
//           animation: slideUp 0.5s ease-out 1s both; }
//         .bp-row { display: flex; justify-content: space-between; align-items: center;
//           padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); }
//         .bp-row.highlight { background: rgba(0,210,120,0.08); border: 1px solid rgba(0,210,120,0.2); }
//         .bp-row-lbl { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.6); }
//         .bp-row-val { font-size: 13px; font-weight: 600; color: #fff; font-family: 'JetBrains Mono', monospace; }
//         .bp-row.highlight .bp-row-lbl, .bp-row.highlight .bp-row-val { color: #00d278; }
//         .bp-tx-box { margin-top: 1rem; padding: 12px 14px;
//           background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06);
//           border-radius: 12px; animation: slideUp 0.5s ease-out 1.1s both; }
//         .bp-tx-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 1.2px;
//           color: rgba(255,255,255,0.3); margin-bottom: 6px; font-weight: 600;
//           font-family: 'JetBrains Mono', monospace; }
//         .bp-tx-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
//         .bp-tx-hash { font-size: 11px; color: rgba(255,255,255,0.7);
//           font-family: 'JetBrains Mono', monospace;
//           overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
//         .bp-tx-btns { display: flex; gap: 4px; }
//         .bp-tx-btn { width: 26px; height: 26px; border-radius: 7px;
//           background: rgba(255,255,255,0.05); border: none;
//           display: flex; align-items: center; justify-content: center;
//           color: rgba(255,255,255,0.5); cursor: pointer;
//           transition: all 0.2s; text-decoration: none; }
//         .bp-tx-btn:hover { background: rgba(0,210,120,0.15); color: #00d278; }
//         .bp-copy-msg { font-size: 10px; color: #00d278; margin-top: 4px; }
//         .bp-done-btn { margin-top: 1.25rem; width: 100%; padding: 14px;
//           border: none; border-radius: 999px;
//           background: linear-gradient(135deg, #00b866, #00d278);
//           color: #020f08; font-weight: 700; font-size: 13px;
//           text-transform: uppercase; letter-spacing: 1.2px;
//           cursor: pointer; transition: all 0.2s;
//           font-family: 'Space Grotesk', sans-serif;
//           animation: slideUp 0.5s ease-out 1.2s both; }
//         .bp-done-btn:hover { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0,210,120,0.4); }
//         .bp-done-btn:active { transform: scale(0.98); }
//         .bp-confetti { position: absolute; top: 0; pointer-events: none; }
//       `}</style>

//       <div className="b-root">
//         <div className="b-bg" />
//         <div className="b-grid" />
//         <div className="b-scanline" />

//         <div className="b-card">
//           <div className="b-panel">
//             <div className="b-header">
//               <div className="b-header-left">
//                 <div className="b-logo">
//                   <img src={LLD_LOGO} alt="LLD" className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <div className="b-title">Buy LLD</div>
//                   <div className="b-sub">
//                     Ethereum Mainnet · ERC-20 · Uniswap V2
//                   </div>
//                 </div>
//               </div>
//               {ethPrice && (
//                 <div className="b-price-badge">
//                   <div className="b-price-dot" />$
//                   {Math.round(ethPrice).toLocaleString()}
//                 </div>
//               )}
//             </div>

//             <div className="b-wallet-bar">
//               <div className={`b-dot ${walletStatus}`} />
//               <span className={`b-wallet-text ${walletStatus}`}>
//                 {walletStatus === "connected"
//                   ? walletAddress?.slice(0, 6) +
//                     "···" +
//                     walletAddress?.slice(-4)
//                   : walletStatus === "wrong"
//                     ? "Wrong Network"
//                     : "Wallet Not Connected"}
//               </span>
//               <button
//                 className="b-connect-btn"
//                 onClick={connectWallet}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <Loader2 size={12} className="b-spin" />
//                 ) : (
//                   <Wallet size={12} />
//                 )}
//                 {walletAddress ? "Switch" : "Connect"}
//               </button>
//             </div>

//             {walletAddress && <div className="b-addr">{walletAddress}</div>}

//             {walletAddress && !isCorrectNetwork && (
//               <div className="b-warn b-warn-net" style={{ marginTop: 10 }}>
//                 <div
//                   style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
//                 >
//                   <AlertTriangle
//                     size={14}
//                     color="#f59e0b"
//                     style={{ flexShrink: 0, marginTop: 1 }}
//                   />
//                   <span>
//                     Wrong network. Switch to{" "}
//                     <strong style={{ color: "#fbbf24" }}>
//                       Ethereum Mainnet
//                     </strong>{" "}
//                     to continue.
//                   </span>
//                 </div>
//                 <button className="b-switch-btn" onClick={switchToMainnet}>
//                   Switch to Mainnet <ArrowRight size={12} />
//                 </button>
//               </div>
//             )}

//             <div className="b-balance-row" style={{ marginTop: 12 }}>
//               <div className="b-stat">
//                 <div className="b-stat-lbl">ETH Balance</div>
//                 <div className={`b-stat-val ${walletAddress ? "green" : ""}`}>
//                   {balanceDisplay}
//                 </div>
//               </div>
//               <div className="b-stat">
//                 <div className="b-stat-lbl">Network</div>
//                 <div className="b-stat-val" style={{ fontSize: 13 }}>
//                   {isCorrectNetwork
//                     ? "✓ Mainnet"
//                     : walletAddress
//                       ? "⚠ Wrong"
//                       : "—"}
//                 </div>
//               </div>
//             </div>

//             <div className="b-divider" />

//             <div className="b-section-lbl">Quick Select</div>
//             <div className="b-quick-grid">
//               {QUICK_AMOUNTS.map((amt) => (
//                 <button
//                   key={amt}
//                   className={`b-quick-btn ${selectedQuick === amt ? "active" : ""}`}
//                   onClick={() => handleQuickAmount(amt)}
//                 >
//                   <span className="b-quick-usd">${amt}</span>
//                   <span className="b-quick-eth">
//                     {ethPrice ? `≈${quickEthDisplay(amt)} ETH` : "..."}
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div>
//               <p className="text-red-400 text-sm">
//                 Don't refresh the page during the transaction.
//               </p>
//             </div>
//             <div className="b-section-lbl" style={{ marginTop: 4 }}>
//               Custom Amount
//             </div>
//             <div className="b-input-wrap">
//               <input
//                 type="number"
//                 placeholder="0.00"
//                 value={usdtAmount}
//                 onWheel={(e) => e.target.blur()}
//                 onChange={(e) => {
//                   setUsdtAmount(e.target.value);
//                   setSelectedQuick(null);
//                 }}
//                 min="0"
//               />
//               <span className="b-input-badge">USDT</span>
//             </div>

//             <div className="b-eth-row">
//               <span className="b-eth-lbl">
//                 <ArrowRight size={11} /> ETH Required
//               </span>
//               <span className="b-eth-val">
//                 {priceLoading && <Loader2 size={13} className="b-spin" />}
//                 {ethRequiredDisplay}
//               </span>
//             </div>

//             {isLowBalance && (
//               <div className="b-warn">
//                 <AlertTriangle
//                   size={14}
//                   color="#f59e0b"
//                   style={{ flexShrink: 0, marginTop: 1 }}
//                 />
//                 <span>
//                   Insufficient ETH. Need{" "}
//                   <strong style={{ color: "#fbbf24" }}>
//                     {ethRequiredDisplay}
//                   </strong>{" "}
//                   for{" "}
//                   <strong style={{ color: "#fbbf24" }}>${usdtAmount}</strong>{" "}
//                   worth of LLD.
//                 </span>
//               </div>
//             )}

//             <div className="b-divider" />

//             <div className="b-secure">
//               <Shield size={18} style={{ flexShrink: 0 }} />
//               Referrals auto-applied
//             </div>

//             <button
//               className="text-center rounded-2xl font-semibold !py-3 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-red-500"
//               disabled={isBuyDisabled}
//               onClick={buyWithETH}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 size={18} className="b-spin" /> Processing...
//                 </>
//               ) : (
//                 <>
//                   <Zap size={18} strokeWidth={2.5} /> Buy LLD Now
//                 </>
//               )}
//             </button>

//             {/* Only show error/info status inline, NOT success */}
//             {statusMsg && statusType !== "ok" && (
//               <div className={`b-status ${statusType}`}>
//                 {statusType === "err" && (
//                   <AlertTriangle
//                     size={14}
//                     style={{ flexShrink: 0, marginTop: 1 }}
//                   />
//                 )}
//                 {statusType === "info" && (
//                   <Loader2
//                     size={14}
//                     className={isLoading ? "b-spin" : ""}
//                     style={{ flexShrink: 0, marginTop: 1 }}
//                   />
//                 )}
//                 <div>
//                   {statusMsg}
//                   {txHash && (
//                     <a
//                       className="b-tx-link"
//                       href={`https://etherscan.io/tx/${txHash}`}
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       <ExternalLink size={10} /> {txHash.slice(0, 22)}...
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {walletAddress && (
//             <div className="b-chain-panel">
//               <WalletBalance address={walletAddress} />
//             </div>
//           )}

//           {/* <a href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer"
//             className="b-footer flex items-center justify-center flex-wrap gap-2 px-3 py-2 rounded-lg text-green-400 no-underline cursor-pointer relative overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-green-400/10 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-green-400/10 bg-[length:200%_100%]">
//             🔍
//             <span className="relative z-10 text-green-400 text-[clamp(10px,2vw,14px)]">Click to view on Etherscan :</span>
//             <span className="relative z-10 text-blue-400 break-all text-[clamp(10px,2vw,14px)] animate-pulse">{CONTRACT_ADDRESS}</span>
//           </a> */}
//         </div>
//       </div>

//       {/* 🎉 PREMIUM SUCCESS POPUP */}
//       {successData && (
//         <div className="bp-backdrop" onClick={closePopup}>
//           {confetti.map((i) => (
//             <div
//               key={i}
//               className="bp-confetti"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 width: `${6 + Math.random() * 6}px`,
//                 height: `${10 + Math.random() * 8}px`,
//                 background: [
//                   "#00d278",
//                   "#00e682",
//                   "#FDE047",
//                   "#00b866",
//                   "#fff",
//                 ][i % 5],
//                 animation: `confettiFall ${2 + Math.random() * 2}s linear ${Math.random() * 0.5}s forwards`,
//                 borderRadius: i % 2 === 0 ? "2px" : "50%",
//               }}
//             />
//           ))}

//           <div className="bp-card" onClick={(e) => e.stopPropagation()}>
//             <div className="bp-shimmer" />
//             <button className="bp-close" onClick={closePopup}>
//               <X size={16} />
//             </button>

//             <div className="bp-content">
//               <div className="bp-icon-wrap">
//                 <div className="bp-ring" />
//                 <div className="bp-ring bp-ring-2" />

//                 <div className="bp-coin bp-coin-left">
//                   <div className="bp-coin-blur" />
//                   <img src={LLD_LOGO} alt="LLD" />
//                 </div>

//                 <div className="bp-check-circle">
//                   <div className="bp-check-inner">
//                     <CheckCircle2 size={56} color="#fff" strokeWidth={2.5} />
//                   </div>
//                 </div>

//                 <div className="bp-coin bp-coin-right">
//                   <div className="bp-coin-blur" />
//                   <img src={LLD_LOGO} alt="LLD" />
//                 </div>

//                 <Sparkles size={18} className="bp-sparkle bp-sparkle-1" />
//                 <Sparkles size={14} className="bp-sparkle bp-sparkle-2" />
//                 <Sparkles size={12} className="bp-sparkle bp-sparkle-3" />
//               </div>

//               <div className="bp-title-wrap">
//                 <div className="bp-badge">
//                   <Crown size={11} />
//                   Purchase Successful
//                 </div>
//                 <h2 className="bp-heading">LLD tokens are yours! 🚀</h2>
//                 <p className="bp-subheading">Confirmed on Ethereum Mainnet</p>
//               </div>

//               <div className="bp-amount-box">
//                 <div className="bp-amount-lbl">You Received</div>
//                 <div className="bp-amount-val">
//                   <img src={LLD_LOGO} alt="LLD" />
//                   <span className="num">
//                     {successData.distribution
//                       ? formatLLD(successData.distribution.userShare)
//                       : "—"}
//                   </span>
//                   <span className="sym">LLD</span>
//                 </div>
//               </div>

//               <div className="bp-breakdown">
//                 <div className="bp-row">
//                   <div className="bp-row-lbl">
//                     <TrendingUp size={13} /> USDT Spent
//                   </div>
//                   <div className="bp-row-val">${successData.usdtAmount}</div>
//                 </div>
//                 <div className="bp-row">
//                   <div className="bp-row-lbl">
//                     <Zap size={13} /> ETH Spent
//                   </div>
//                   <div className="bp-row-val">{successData.ethSpent} ETH</div>
//                 </div>

//                 {successData.distribution && (
//                   <>
//                     <div className="bp-row">
//                       <div className="bp-row-lbl">
//                         <Users size={13} /> Referral Rewards
//                       </div>
//                       <div className="bp-row-val">
//                         {formatLLD(
//                           (
//                             BigInt(successData.distribution.ref1Share) +
//                             BigInt(successData.distribution.ref2Share) +
//                             BigInt(successData.distribution.ref3Share)
//                           ).toString(),
//                         )}{" "}
//                         LLD
//                       </div>
//                     </div>
//                     <div className="bp-row highlight">
//                       <div className="bp-row-lbl">
//                         <Sparkles size={13} /> Total Minted
//                       </div>
//                       <div className="bp-row-val">
//                         {formatLLD(successData.distribution.totalLLD)} LLD
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {successData.txHash && (
//                 <div className="bp-tx-box">
//                   <div className="bp-tx-lbl">Transaction Hash</div>
//                   <div className="bp-tx-row">
//                     <span className="bp-tx-hash">
//                       {successData.txHash.slice(0, 14)}···
//                       {successData.txHash.slice(-10)}
//                     </span>
//                     <div className="bp-tx-btns">
//                       <button
//                         className="bp-tx-btn"
//                         onClick={handleCopyTx}
//                         title="Copy"
//                       >
//                         <Copy size={12} />
//                       </button>
//                       <a
//                         className="bp-tx-btn"
//                         href={`https://etherscan.io/tx/${successData.txHash}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         title="View on Etherscan"
//                       >
//                         <ExternalLink size={12} />
//                       </a>
//                     </div>
//                   </div>
//                   {copied && (
//                     <div className="bp-copy-msg">✓ Copied to clipboard</div>
//                   )}
//                 </div>
//               )}

//               <button className="bp-done-btn" onClick={closePopup}>
//                 Awesome, thanks!
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { WalletBalance } from "../../utils/WalletBalance";
import { useSelector } from "react-redux";
import {
  AlertTriangle,
  Wallet,
  Zap,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Shield,
  ExternalLink,
  X,
  Sparkles,
  Crown,
  Copy,
  TrendingUp,
  Users,
} from "lucide-react";
import { buyLLD } from "../../api/user.api";

const CONTRACT_ADDRESS = "0x58A9996250111af893545a5cf4185E5537c7A4F5";
const MAINNET_CHAIN_ID = "0x1";
const ABI = [
  "function buyWithETH(uint256 minLLD,address[3] calldata refs) external payable",
];

const BOUGHT_EVENT_ABI = [
  "event Bought(address indexed buyer, uint256 spent, uint256 received, address indexed ref1, address indexed ref2, address ref3)",
];

const LLD_LOGO =
  "https://coin-images.coingecko.com/coins/images/33625/large/Liberland_Dollar_Square_200px.png?1702532879";
const MIN_BUY = 1;

const calcDistribution = (totalLLD) => {
  const userShare = (totalLLD * 85n) / 100n;
  const lvl1 = (totalLLD * 5n) / 100n;
  const lvl2 = (totalLLD * 3n) / 100n;
  const lvl3 = (totalLLD * 2n) / 100n;
  const adminShare = (totalLLD * 5n) / 100n;
  return { userShare, lvl1, lvl2, lvl3, adminShare };
};

const QUICK_AMOUNTS = [10, 25, 50, 100];

/* ------------------------------------------------------------------ */
/*  Pending-buy persistence (Android pe reload / dashboard redirect    */
/*  ke baad bhi backend call recover ho jaaye)                          */
/* ------------------------------------------------------------------ */
const PENDING_BUY_KEY = "lld_pending_buy";

const loadPendingBuy = () => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_BUY_KEY) || "null");
  } catch {
    return null;
  }
};
const savePendingBuy = (data) => {
  try {
    localStorage.setItem(PENDING_BUY_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / private mode */
  }
};
const clearPendingBuy = () => {
  try {
    localStorage.removeItem(PENDING_BUY_KEY);
  } catch {
    /* ignore */
  }
};

// receipt ke logs se Bought event nikaal ke distribution banata hai
const parseDistributionFromLogs = (logs) => {
  try {
    const iface = new ethers.Interface(BOUGHT_EVENT_ABI);
    for (const log of logs || []) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed && parsed.name === "Bought") {
          const totalLLD = parsed.args.received;
          const dist = calcDistribution(totalLLD);
          return {
            totalLLD: totalLLD.toString(),
            userShare: dist.userShare.toString(),
            ref1Share: dist.lvl1.toString(),
            ref2Share: dist.lvl2.toString(),
            ref3Share: dist.lvl3.toString(),
            adminShare: dist.adminShare.toString(),
            spentETH: parsed.args.spent.toString(),
          };
        }
      } catch {
        /* not this log */
      }
    }
  } catch {
    /* ignore */
  }
  return null;
};

/* Backend save with retry. Backend ko txHash pe IDEMPOTENT banana zaroori
   hai warna retry/recovery se double credit ho sakta hai. */
const sendBuyToBackend = async (payload, attempts = 5) => {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await buyLLD(payload);
      // fetch Response aaye to ok check karo; axios aaye to bina throw = success
      if (res && res.ok === false) {
        let body = {};
        try {
          body = await res.json();
        } catch {
          /* ignore */
        }
        throw new Error(body?.message || "Backend returned not-ok");
      }
      return res;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
};

export default function BuyLLD() {
  const { user } = useSelector((state) => state.auth);
  const [usdtAmount, setUsdtAmount] = useState("");
  const [ethRequired, setEthRequired] = useState(0);
  const [ethRequiredDisplay, setEthRequiredDisplay] = useState("—");
  const [selectedQuick, setSelectedQuick] = useState(null);

  const ref1 = user?.uplineWallets?.[0] || "";
  const ref2 = user?.uplineWallets?.[1] || "";
  const ref3 = user?.uplineWallets?.[2] || "";

  const [walletAddress, setWalletAddress] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);
  const [balanceDisplay, setBalanceDisplay] = useState("—");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [ethPrice, setEthPrice] = useState(null);

  // 🎉 Popup state
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const debTimer = useRef(null);
  const lastReqId = useRef(0);

  // 🔊 Success sound
  const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const notes = [
        { freq: 523.25, time: 0, duration: 0.15 },
        { freq: 659.25, time: 0.1, duration: 0.15 },
        { freq: 783.99, time: 0.2, duration: 0.3 },
      ];
      notes.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + time);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + time + duration,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + duration);
      });
    } catch (err) { }
  };

  const formatLLD = (bigIntStr) => {
    try {
      return parseFloat(ethers.formatUnits(bigIntStr, 18)).toFixed(4);
    } catch {
      return "0.0000";
    }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
        );
        const data = await res.json();
        setEthPrice(Number(data?.price));
      } catch { }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const showStatus = (msg, type = "info") => {
    setStatusMsg(msg);
    setStatusType(type);
  };

  const checkNetwork = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const correct = chainId === MAINNET_CHAIN_ID;
    setIsCorrectNetwork(correct);
    return correct;
  };

  const switchToMainnet = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MAINNET_CHAIN_ID }],
      });
    } catch (e) {
      showStatus("Network switch failed: " + (e?.message || e), "err");
    }
  };

  const fetchBalance = async (addr, prov) => {
    const bal = await prov.getBalance(addr);
    const formatted = parseFloat(ethers.formatEther(bal));
    setEthBalance(formatted);
    setBalanceDisplay(formatted.toFixed(6) + " ETH");
    return formatted;
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      showStatus("MetaMask is not installed.", "err");
      return;
    }
    try {
      setIsLoading(true);
      showStatus("Connecting wallet...", "info");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const netOk = await checkNetwork();
      if (!netOk) {
        await switchToMainnet();
        await checkNetwork();
      }
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _signer = await _provider.getSigner();
      const address = await _signer.getAddress();
      setProvider(_provider);
      setSigner(_signer);
      setWalletAddress(address);
      await fetchBalance(address, _provider);
      setStatusMsg("");

      window.ethereum.on("chainChanged", async () => {
        const correct = await checkNetwork();
        if (correct) {
          const p = new ethers.BrowserProvider(window.ethereum);
          const s = await p.getSigner();
          const a = await s.getAddress();
          setProvider(p);
          setSigner(s);
          setWalletAddress(a);
          await fetchBalance(a, p);
        }
      });
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length === 0) {
          setWalletAddress(null);
          setSigner(null);
          setEthBalance(0);
          setBalanceDisplay("—");
          setIsCorrectNetwork(false);
        } else {
          const p = new ethers.BrowserProvider(window.ethereum);
          const s = await p.getSigner();
          setProvider(p);
          setSigner(s);
          setWalletAddress(accounts[0]);
          await checkNetwork();
          await fetchBalance(accounts[0], p);
        }
      });
    } catch (e) {
      showStatus("Connect failed: " + (e?.message || e), "err");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAmount = (amount) => {
    setSelectedQuick(amount);
    setUsdtAmount(String(amount));
  };

  useEffect(() => {
    if (debTimer.current) clearTimeout(debTimer.current);
    const amount = Number(usdtAmount);
    if (!amount || amount <= 0) {
      setEthRequired(0);
      setEthRequiredDisplay("—");
      return;
    }
    setPriceLoading(true);
    setEthRequiredDisplay("...");
    const rid = ++lastReqId.current;
    debTimer.current = setTimeout(async () => {
      try {
        let price = ethPrice;
        if (!price) {
          const res = await fetch(
            "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
          );
          const data = await res.json();
          price = Number(data?.price);
          setEthPrice(price);
        }
        if (rid !== lastReqId.current) return;
        if (!price) throw new Error("Price unavailable");
        const eth = amount / price;
        const finalEth = eth * 1.005 + 0.0005;
        setEthRequired(finalEth);
        setEthRequiredDisplay(finalEth.toFixed(6) + " ETH");
      } catch {
        if (rid !== lastReqId.current) return;
        setEthRequired(0);
        setEthRequiredDisplay("Price fetch failed");
      } finally {
        setPriceLoading(false);
      }
    }, 400);
  }, [usdtAmount, ethPrice]);

  /* ----------------------------------------------------------------
     RECOVERY: agar pichli baar transaction ho gaya tha par reload/
     dashboard-redirect ki wajah se backend save reh gaya tha, to mount
     pe yaha complete kar dete hain.
  ---------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    const recover = async () => {
      const pending = loadPendingBuy();
      if (!pending) return;
      if (!window.ethereum) return; // verify ke liye injected provider chahiye

      try {
        const prov = new ethers.BrowserProvider(window.ethereum);

        const finalize = async (hash) => {
          if (!hash) return false;
          let receipt = await prov.getTransactionReceipt(hash);
          if (!receipt) {
            try {
              receipt = await prov.waitForTransaction(hash, 1, 60000);
            } catch {
              /* abhi mine nahi hua */
            }
          }
          if (!receipt) return false; // pending rehne do, next mount pe retry

          const distribution = parseDistributionFromLogs(receipt.logs);
          const payload = {
            txHash: hash,
            blockNumber: receipt.blockNumber,
            buyer: pending.buyer,
            usdtEquivalent: pending.usdtEquivalent,
            ethSpent: pending.ethSpent,
            ethPriceUSD: pending.ethPriceUSD,
            contractAddress: pending.contractAddress || CONTRACT_ADDRESS,
            refs: pending.refs,
            distribution,
            timestamp: new Date().toISOString(),
            userId: pending.userId,
            recovered: true,
          };
          await sendBuyToBackend(payload);
          if (cancelled) return true;
          clearPendingBuy();
          playSuccessSound();
          setSuccessData({
            txHash: hash,
            usdtAmount: pending.usdtEquivalent,
            ethSpent: pending.ethSpent,
            distribution,
          });
          return true;
        };

        // Case 1: hash save tha -> seedha receipt le ke backend bhejo
        if (pending.txHash) {
          await finalize(pending.txHash);
          return;
        }

        // Case 2: hash hi save nahi hua (signing ke beech reload) -> chain pe
        // is buyer ka recent Bought event dhundh ke hash recover karo
        if (pending.buyer) {
          const c = new ethers.Contract(
            CONTRACT_ADDRESS,
            BOUGHT_EVENT_ABI,
            prov,
          );
          const current = await prov.getBlockNumber();
          const fromBlock = Math.max(current - 2000, 0);
          const filter = c.filters.Bought(pending.buyer);
          const events = await c.queryFilter(filter, fromBlock, current);
          if (events.length > 0) {
            const last = events[events.length - 1];
            await finalize(last.transactionHash);
          }
        }
      } catch (err) {
        console.error("Buy recovery failed:", err);
        // pending rehne do, agli baar phir try hoga
      }
    };

    recover();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buyWithETH = async () => {
    if (!signer) {
      showStatus("Please connect your wallet first.", "err");
      return;
    }
    if (!isCorrectNetwork) {
      showStatus("Please switch to Ethereum Mainnet.", "err");
      return;
    }
    if (ethBalance <= 0) {
      showStatus("Your ETH balance is zero.", "err");
      return;
    }
    if (ethRequired <= 0) {
      showStatus("Please enter a valid USDT amount.", "err");
      return;
    }
    if (ethBalance < ethRequired) {
      showStatus("Insufficient ETH balance.", "err");
      return;
    }
    if (Number(usdtAmount) < MIN_BUY) {
      showStatus(`Please enter a minimum ${MIN_BUY} USDT amount.`);
      return;
    }

    try {
      setIsLoading(true);
      showStatus("Preparing transaction...", "info");
      const ethAmt = ethers.parseEther(ethRequired.toFixed(18));

      const safeAddr = (addr) =>
        ethers.isAddress(addr) ? addr : ethers.ZeroAddress;
      const refs = [safeAddr(ref1), safeAddr(ref2), safeAddr(ref3)];

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      let gas;
      try {
        gas = await contract.buyWithETH.estimateGas(0, refs, { value: ethAmt });
      } catch {
        gas = 300000n;
      }

      // backend payload ka base context — transaction SE PEHLE save karo.
      // Agar signing ke beech reload ho gaya, recovery effect buyer se
      // chain pe Bought event dhundh lega.
      const baseCtx = {
        buyer: walletAddress,
        usdtEquivalent: usdtAmount,
        ethSpent: ethRequired.toFixed(8),
        ethPriceUSD: ethPrice,
        contractAddress: CONTRACT_ADDRESS,
        refs: {
          ref1: ethers.isAddress(ref1) ? ref1 : null,
          ref2: ethers.isAddress(ref2) ? ref2 : null,
          ref3: ethers.isAddress(ref3) ? ref3 : null,
        },
        userId: user?._id || user?.id || null,
        ts: Date.now(),
      };
      savePendingBuy({ ...baseCtx, txHash: null, status: "submitting" });

      showStatus("Confirm in your wallet...", "info");
      const tx = await contract.buyWithETH(0, refs, {
        value: ethAmt,
        gasLimit: (gas * 120n) / 100n,
      });

      // hash turant mil gaya -> persist kar do (reload aaye to recover hoga)
      setTxHash(tx.hash);
      savePendingBuy({ ...baseCtx, txHash: tx.hash, status: "sent" });
      showStatus("Transaction pending... Waiting for confirmation ⏳", "info");

      const receipt = await tx.wait();
      const distribution = parseDistributionFromLogs(receipt.logs);

      const payload = {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        buyer: walletAddress,
        usdtEquivalent: usdtAmount,
        ethSpent: ethRequired.toFixed(8),
        ethPriceUSD: ethPrice,
        contractAddress: CONTRACT_ADDRESS,
        refs: baseCtx.refs,
        distribution,
        timestamp: new Date().toISOString(),
        userId: baseCtx.userId,
      };

      // backend save with retry
      await sendBuyToBackend(payload);
      clearPendingBuy();

      // 🎉 Show popup
      playSuccessSound();
      setSuccessData({
        txHash: tx.hash,
        usdtAmount: usdtAmount,
        ethSpent: ethRequired.toFixed(6),
        distribution,
      });

      setStatusMsg("");
      setUsdtAmount("");
      setSelectedQuick(null);
      setEthRequired(0);
      setEthRequiredDisplay("—");
      await fetchBalance(walletAddress, provider);
    } catch (e) {
      showStatus(e?.reason || e?.message || "Transaction failed", "err");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTx = () => {
    if (successData?.txHash) {
      navigator.clipboard.writeText(successData.txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closePopup = () => {
    setSuccessData(null);
    setCopied(false);
    setTxHash("");
  };

  const isLowBalance =
    walletAddress && ethRequired > 0 && ethBalance < ethRequired;
  const isBuyDisabled =
    !walletAddress ||
    !isCorrectNetwork ||
    !usdtAmount ||
    parseFloat(usdtAmount) <= 0 ||
    ethRequired <= 0 ||
    ethBalance < ethRequired ||
    isLoading;

  const walletStatus = !walletAddress
    ? "disconnected"
    : !isCorrectNetwork
      ? "wrong"
      : "connected";

  const quickEthDisplay = (amt) => {
    if (!ethPrice) return null;
    const eth = (amt / ethPrice) * 1.005 + 0.0005;
    return eth.toFixed(5);
  };

  const confetti = Array.from({ length: 30 }, (_, i) => i);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .b-root *, .b-root *::before, .b-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .b-root { font-family: 'Space Grotesk', sans-serif; min-height: 100vh; background: #04060f;
          display: flex; justify-content: center; align-items: flex-start;
          padding: 2.5rem 1rem 5rem; position: relative; overflow-x: hidden; }
        .b-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 50% at 20% 0%, rgba(0,210,120,0.07) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0,180,255,0.05) 0%, transparent 55%); }
        .b-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(0,210,120,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,210,120,0.025) 1px, transparent 1px);
          background-size: 44px 44px; }
        .b-scanline { position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px); }
        .b-card { position: relative; z-index: 1; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 12px; }
        .b-panel { background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 1.75rem;
          position: relative; overflow: hidden; backdrop-filter: blur(24px);
          box-shadow: 0 0 0 1px rgba(0,210,120,0.06) inset, 0 24px 80px rgba(0,0,0,0.7); }
        .b-panel::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,210,120,0.5), rgba(0,180,255,0.3), transparent); }
        .b-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .b-header-left { display: flex; align-items: center; gap: 12px; }
        .b-logo { width: 46px; height: 46px; border-radius: 14px; border: 1px solid rgba(0,210,120,0.25);
          display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0;
          box-shadow: 0 0 24px rgba(0,210,120,0.12); }
        .b-logo::after { content: ''; position: absolute; inset: -1px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(0,210,120,0.3), transparent); z-index: -1; }
        .b-title { font-size: 17px; font-weight: 700; letter-spacing: -0.4px; color: #f0fff8; }
        .b-sub { font-size: 11px; color: rgba(255,255,255,0.3); font-family: 'JetBrains Mono', monospace; margin-top: 2px; letter-spacing: 0.3px; }
        .b-price-badge { display: flex; align-items: center; gap: 6px; background: rgba(0,210,120,0.08);
          border: 1px solid rgba(0,210,120,0.15); border-radius: 8px; padding: 6px 10px;
          font-size: 11px; font-family: 'JetBrains Mono', monospace; color: rgba(0,210,120,0.8); }
        .b-price-dot { width: 6px; height: 6px; border-radius: 50%; background: #00d278; animation: bPulse 2s ease-in-out infinite; }
        @keyframes bPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        .b-wallet-bar { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 10px 14px; margin-bottom: 12px; }
        .b-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .b-dot.connected { background: #00d278; box-shadow: 0 0 10px rgba(0,210,120,0.7); animation: bGlow 2s ease-in-out infinite; }
        @keyframes bGlow { 0%,100%{box-shadow:0 0 6px rgba(0,210,120,0.5)} 50%{box-shadow:0 0 14px rgba(0,210,120,0.9)} }
        .b-dot.wrong { background: #f59e0b; }
        .b-dot.disconnected { background: rgba(255,255,255,0.2); }
        .b-wallet-text { font-size: 12px; font-family: 'JetBrains Mono', monospace; flex: 1; min-width: 0; }
        .b-wallet-text.connected { color: #00d278; }
        .b-wallet-text.wrong { color: #f59e0b; }
        .b-wallet-text.disconnected { color: rgba(255,255,255,0.3); }
        .b-addr { font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: rgba(255,255,255,0.2); margin-top: 6px; letter-spacing: 0.3px; }
        .b-connect-btn { display: flex; align-items: center; gap: 6px; background: rgba(0,210,120,0.1);
          border: 1px solid rgba(0,210,120,0.2); color: #00d278; border-radius: 9px; padding: 7px 13px;
          font-size: 12px; font-weight: 600; font-family: 'Space Grotesk', sans-serif; cursor: pointer;
          white-space: nowrap; transition: all 0.2s; flex-shrink: 0; }
        .b-connect-btn:hover:not(:disabled) { background: rgba(0,210,120,0.18); border-color: rgba(0,210,120,0.4); box-shadow: 0 0 16px rgba(0,210,120,0.12); }
        .b-connect-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .b-balance-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1.25rem; }
        .b-stat { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px 14px; }
        .b-stat-lbl { font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.3); margin-bottom: 5px; font-weight: 600; }
        .b-stat-val { font-size: 15px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #e8fff4; }
        .b-stat-val.green { color: #00d278; }
        .b-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); margin: 1.1rem 0; }
        .b-section-lbl { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.35); margin-bottom: 10px; }
        .b-quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
        .b-quick-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px; padding: 10px 6px 8px; text-align: center; cursor: pointer;
          transition: all 0.2s; position: relative; overflow: hidden; }
        .b-quick-btn::before { content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,210,120,0.12), transparent); opacity: 0; transition: opacity 0.2s; }
        .b-quick-btn:hover::before, .b-quick-btn.active::before { opacity: 1; }
        .b-quick-btn:hover { border-color: rgba(0,210,120,0.3); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,210,120,0.08); }
        .b-quick-btn.active { border-color: rgba(0,210,120,0.5); background: rgba(0,210,120,0.08); box-shadow: 0 0 20px rgba(0,210,120,0.1); }
        .b-quick-usd { font-size: 14px; font-weight: 700; color: #e8fff4; display: block; position: relative; z-index: 1; }
        .b-quick-eth { font-size: 9px; font-family: 'JetBrains Mono', monospace; color: rgba(0,210,120,0.7); display: block; margin-top: 3px; position: relative; z-index: 1; }
        .b-input-wrap { position: relative; margin-bottom: 10px; }
        .b-input-wrap input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 13px; padding: 15px 70px 15px 18px; font-size: 22px; font-weight: 700;
          font-family: 'JetBrains Mono', monospace; color: #fff; outline: none; transition: all 0.2s; -moz-appearance: textfield; }
        .b-input-wrap input::-webkit-outer-spin-button, .b-input-wrap input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .b-input-wrap input::placeholder { color: rgba(255,255,255,0.12); font-size: 18px; font-weight: 400; }
        .b-input-wrap input:focus { border-color: rgba(0,210,120,0.35); background: rgba(0,210,120,0.04); box-shadow: 0 0 0 3px rgba(0,210,120,0.07); }
        .b-input-badge { position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          font-size: 11px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
          color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 6px; padding: 3px 8px; }
        .b-eth-row { display: flex; align-items: center; justify-content: space-between;
          background: rgba(0,210,120,0.04); border: 1px solid rgba(0,210,120,0.1);
          border-radius: 12px; padding: 13px 16px; margin-bottom: 12px; }
        .b-eth-lbl { font-size: 11px; color: rgba(255,255,255,0.35); font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
        .b-eth-val { font-size: 16px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #00d278; display: flex; align-items: center; gap: 7px; }
        .b-warn { display: flex; align-items: flex-start; gap: 10px; background: rgba(245,158,11,0.05);
          border: 1px solid rgba(245,158,11,0.18); border-radius: 11px; padding: 11px 14px; margin-bottom: 12px;
          font-size: 12px; color: rgba(252,196,100,0.9); line-height: 1.55; }
        .b-warn-net { flex-direction: column; }
        .b-switch-btn { display: inline-flex; align-items: center; gap: 5px; margin-top: 9px;
          background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.25); color: #f59e0b;
          font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600;
          padding: 6px 13px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .b-switch-btn:hover { background: rgba(245,158,11,0.2); }
        .b-secure { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 9px 13px; margin-bottom: 14px;
          font-size: 12px; color: rgba(255,255,255,0.22); font-family: 'JetBrains Mono', monospace; }
        .b-buy-btn { width: 100%; padding: 16px; border-radius: 14px; border: none;
          font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700;
          letter-spacing: 0.2px; cursor: pointer; transition: all 0.25s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          position: relative; overflow: hidden; }
        .b-buy-btn::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); transition: left 0.5s; }
        .b-buy-btn:not(:disabled):hover::after { left: 150%; }
        .b-buy-btn:not(:disabled) { background: linear-gradient(135deg, #00b866, #00d278, #00e682);
          color: #020f08; box-shadow: 0 4px 24px rgba(0,210,120,0.35), 0 1px 0 rgba(255,255,255,0.15) inset; }
        .b-buy-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(0,210,120,0.5); }
        .b-buy-btn:not(:disabled):active { transform: translateY(0); }
        .b-buy-btn:disabled { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.18); cursor: not-allowed; }
        .b-status { display: flex; align-items: flex-start; gap: 10px; border-radius: 11px; padding: 12px 14px;
          margin-top: 11px; font-size: 12px; line-height: 1.5; font-family: 'JetBrains Mono', monospace; animation: bFadeIn 0.3s ease; }
        @keyframes bFadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .b-status.ok { background: rgba(0,210,120,0.07); border: 1px solid rgba(0,210,120,0.2); color: #00d278; }
        .b-status.err { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
        .b-status.info { background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.18); color: #a5b4fc; }
        .b-tx-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; font-size: 10px; color: rgba(255,255,255,0.25); text-decoration: none; }
        .b-tx-link:hover { color: rgba(0,210,120,0.7); }
        .b-chain-panel { background: linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; padding: 1.4rem; position: relative; overflow: hidden; }
        .b-chain-panel::before { content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); }
        .b-footer { font-size: 12px; font-family: 'JetBrains Mono', monospace;
          color: rgba(255,255,255,0.1); text-align: center; letter-spacing: 0.4px; padding: 0 1rem; }
        .b-spin { animation: bSpin 0.75s linear infinite; }
        @keyframes bSpin { to{ transform: rotate(360deg); } }
        .b-ref-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
        @media (max-width: 500px) {
          .b-panel { padding: 1.35rem; }
          .b-quick-usd { font-size: 13px; }
          .b-input-wrap input { font-size: 19px; }
        }

        /* ═══════ SUCCESS POPUP ═══════ */
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
        @keyframes coinFloat {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        @keyframes coinSlideInLeft {
          0% { transform: translateX(-30px) scale(0); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes coinSlideInRight {
          0% { transform: translateX(30px) scale(0); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes sparkleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
        }
        @keyframes amountCount {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes shimmerAnim {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glowPulseGreen {
          0%, 100% { box-shadow: 0 0 20px rgba(0,210,120,0.4), 0 0 40px rgba(0,210,120,0.2); }
          50% { box-shadow: 0 0 30px rgba(0,210,120,0.6), 0 0 60px rgba(0,210,120,0.3); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bp-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem; overflow: hidden;
          animation: popupFadeIn 0.3s ease-out;
        }
        .bp-card {
          position: relative; width: 100%; max-width: 440px;
          background: linear-gradient(160deg, #0a1f15 0%, #040c08 60%, #000 100%);
          border: 1px solid rgba(0,210,120,0.3); border-radius: 24px;
          overflow: hidden; max-height: 92vh; overflow-y: auto;
          animation: popupScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 80px rgba(0,210,120,0.15);
        }
        .bp-shimmer {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #00d278, transparent);
          background-size: 200% 100%; animation: shimmerAnim 2s linear infinite;
        }
        .bp-close {
          position: absolute; top: 14px; right: 14px; z-index: 10;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s;
        }
        .bp-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .bp-content { padding: 2rem 1.75rem; }
        .bp-icon-wrap {
          position: relative; display: flex; align-items: center; justify-content: center;
          height: 130px; margin-bottom: 1.25rem;
        }
        .bp-ring {
          position: absolute; width: 96px; height: 96px; border-radius: 50%;
          border: 2px solid #00d278; animation: ringPulse 1.5s ease-out infinite;
        }
        .bp-ring-2 { animation-delay: 0.5s; }
        .bp-coin { position: absolute; width: 48px; height: 48px; }
        .bp-coin-left { left: calc(50% - 80px);
          animation: coinSlideInLeft 0.6s ease-out 0.3s both, coinFloat 3s ease-in-out 0.9s infinite; }
        .bp-coin-right { right: calc(50% - 80px);
          animation: coinSlideInRight 0.6s ease-out 0.3s both, coinFloat 3s ease-in-out 1.2s infinite; }
        .bp-coin-blur { position: absolute; inset: 0; border-radius: 50%;
          background: #00d278; filter: blur(12px); opacity: 0.6; }
        .bp-coin img { position: relative; width: 100%; height: 100%; border-radius: 50%; }
        .bp-check-circle {
          position: relative; width: 96px; height: 96px; border-radius: 50%;
          background: linear-gradient(135deg, #00d278, #00b866);
          display: flex; align-items: center; justify-content: center; z-index: 10;
          animation: glowPulseGreen 2s ease-in-out infinite;
        }
        .bp-check-inner { animation: checkBounce 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.4s both; }
        .bp-sparkle { position: absolute; color: #00d278; }
        .bp-sparkle-1 { top: 8px; left: 60px; animation: sparkleFloat 2s ease-in-out infinite; }
        .bp-sparkle-2 { bottom: 8px; right: 80px; animation: sparkleFloat 2s ease-in-out 0.5s infinite; }
        .bp-sparkle-3 { top: 24px; right: 50px; color: #fde047; animation: sparkleFloat 2.5s ease-in-out 1s infinite; }
        .bp-title-wrap { text-align: center; animation: slideUp 0.5s ease-out 0.6s both; }
        .bp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          background: rgba(0,210,120,0.1); border: 1px solid rgba(0,210,120,0.3);
          color: #00d278; font-size: 10px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;
          font-family: 'JetBrains Mono', monospace;
        }
        .bp-heading { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .bp-subheading { font-size: 13px; color: rgba(255,255,255,0.5); }
        .bp-amount-box {
          margin-top: 1.25rem; padding: 1.25rem;
          background: linear-gradient(135deg, rgba(0,210,120,0.1), transparent);
          border: 1px solid rgba(0,210,120,0.25); border-radius: 18px;
          animation: slideUp 0.5s ease-out 0.8s both;
        }
        .bp-amount-lbl {
          font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px;
          color: rgba(255,255,255,0.4); text-align: center; margin-bottom: 10px;
          font-family: 'JetBrains Mono', monospace; font-weight: 600;
        }
        .bp-amount-val {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          animation: amountCount 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s both;
        }
        .bp-amount-val img { width: 40px; height: 40px; border-radius: 50%; }
        .bp-amount-val .num {
          font-size: 32px; font-weight: 700;
          background: linear-gradient(to right, #fff, #00d278);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          font-family: 'JetBrains Mono', monospace;
        }
        .bp-amount-val .sym { font-size: 18px; font-weight: 700; color: #00d278; }
        .bp-breakdown { margin-top: 1rem; display: flex; flex-direction: column; gap: 6px;
          animation: slideUp 0.5s ease-out 1s both; }
        .bp-row { display: flex; justify-content: space-between; align-items: center;
          padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); }
        .bp-row.highlight { background: rgba(0,210,120,0.08); border: 1px solid rgba(0,210,120,0.2); }
        .bp-row-lbl { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.6); }
        .bp-row-val { font-size: 13px; font-weight: 600; color: #fff; font-family: 'JetBrains Mono', monospace; }
        .bp-row.highlight .bp-row-lbl, .bp-row.highlight .bp-row-val { color: #00d278; }
        .bp-tx-box { margin-top: 1rem; padding: 12px 14px;
          background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; animation: slideUp 0.5s ease-out 1.1s both; }
        .bp-tx-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 1.2px;
          color: rgba(255,255,255,0.3); margin-bottom: 6px; font-weight: 600;
          font-family: 'JetBrains Mono', monospace; }
        .bp-tx-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .bp-tx-hash { font-size: 11px; color: rgba(255,255,255,0.7);
          font-family: 'JetBrains Mono', monospace;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .bp-tx-btns { display: flex; gap: 4px; }
        .bp-tx-btn { width: 26px; height: 26px; border-radius: 7px;
          background: rgba(255,255,255,0.05); border: none;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5); cursor: pointer;
          transition: all 0.2s; text-decoration: none; }
        .bp-tx-btn:hover { background: rgba(0,210,120,0.15); color: #00d278; }
        .bp-copy-msg { font-size: 10px; color: #00d278; margin-top: 4px; }
        .bp-done-btn { margin-top: 1.25rem; width: 100%; padding: 14px;
          border: none; border-radius: 999px;
          background: linear-gradient(135deg, #00b866, #00d278);
          color: #020f08; font-weight: 700; font-size: 13px;
          text-transform: uppercase; letter-spacing: 1.2px;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Space Grotesk', sans-serif;
          animation: slideUp 0.5s ease-out 1.2s both; }
        .bp-done-btn:hover { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0,210,120,0.4); }
        .bp-done-btn:active { transform: scale(0.98); }
        .bp-confetti { position: absolute; top: 0; pointer-events: none; }
      `}</style>

      <div className="b-root">
        <div className="b-bg" />
        <div className="b-grid" />
        <div className="b-scanline" />

        <div className="b-card">
          <div className="b-panel">
            <div className="b-header">
              <div className="b-header-left">
                <div className="b-logo">
                  <img src={LLD_LOGO} alt="LLD" className="h-6 w-6" />
                </div>
                <div>
                  <div className="b-title">Buy LLD</div>
                  <div className="b-sub">
                    Ethereum Mainnet · ERC-20 · Uniswap V2
                  </div>
                </div>
              </div>
              {ethPrice && (
                <div className="b-price-badge">
                  <div className="b-price-dot" />$
                  {Math.round(ethPrice).toLocaleString()}
                </div>
              )}
            </div>

            <div className="b-wallet-bar">
              <div className={`b-dot ${walletStatus}`} />
              <span className={`b-wallet-text ${walletStatus}`}>
                {walletStatus === "connected"
                  ? walletAddress?.slice(0, 6) +
                  "···" +
                  walletAddress?.slice(-4)
                  : walletStatus === "wrong"
                    ? "Wrong Network"
                    : "Wallet Not Connected"}
              </span>
              <button
                className="b-connect-btn"
                onClick={connectWallet}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={12} className="b-spin" />
                ) : (
                  <Wallet size={12} />
                )}
                {walletAddress ? "Switch" : "Connect"}
              </button>
            </div>

            {walletAddress && <div className="b-addr">{walletAddress}</div>}

            {walletAddress && !isCorrectNetwork && (
              <div className="b-warn b-warn-net" style={{ marginTop: 10 }}>
                <div
                  style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
                >
                  <AlertTriangle
                    size={14}
                    color="#f59e0b"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <span>
                    Wrong network. Switch to{" "}
                    <strong style={{ color: "#fbbf24" }}>
                      Ethereum Mainnet
                    </strong>{" "}
                    to continue.
                  </span>
                </div>
                <button className="b-switch-btn" onClick={switchToMainnet}>
                  Switch to Mainnet <ArrowRight size={12} />
                </button>
              </div>
            )}

            <div className="b-balance-row" style={{ marginTop: 12 }}>
              <div className="b-stat">
                <div className="b-stat-lbl">ETH Balance</div>
                <div className={`b-stat-val ${walletAddress ? "green" : ""}`}>
                  {balanceDisplay}
                </div>
              </div>
              <div className="b-stat">
                <div className="b-stat-lbl">Network</div>
                <div className="b-stat-val" style={{ fontSize: 13 }}>
                  {isCorrectNetwork
                    ? "✓ Mainnet"
                    : walletAddress
                      ? "⚠ Wrong"
                      : "—"}
                </div>
              </div>
            </div>

            <div className="b-divider" />

            <div className="b-section-lbl">Quick Select</div>
            <div className="b-quick-grid">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  className={`b-quick-btn ${selectedQuick === amt ? "active" : ""}`}
                  onClick={() => handleQuickAmount(amt)}
                >
                  <span className="b-quick-usd">${amt}</span>
                  <span className="b-quick-eth">
                    {ethPrice ? `≈${quickEthDisplay(amt)} ETH` : "..."}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <p className="text-red-400 text-sm">
                Don't refresh the page during the transaction.
              </p>
            </div>
            <div className="b-section-lbl" style={{ marginTop: 4 }}>
              Custom Amount
            </div>
            <div className="b-input-wrap">
              <input
                type="number"
                placeholder="0.00"
                value={usdtAmount}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  setUsdtAmount(e.target.value);
                  setSelectedQuick(null);
                }}
                min="0"
              />
              <span className="b-input-badge">USDT</span>
            </div>

            <div className="b-eth-row">
              <span className="b-eth-lbl">
                <ArrowRight size={11} /> ETH Required
              </span>
              <span className="b-eth-val">
                {priceLoading && <Loader2 size={13} className="b-spin" />}
                {ethRequiredDisplay}
              </span>
            </div>

            {isLowBalance && (
              <div className="b-warn">
                <AlertTriangle
                  size={14}
                  color="#f59e0b"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span>
                  Insufficient ETH. Need{" "}
                  <strong style={{ color: "#fbbf24" }}>
                    {ethRequiredDisplay}
                  </strong>{" "}
                  for{" "}
                  <strong style={{ color: "#fbbf24" }}>${usdtAmount}</strong>{" "}
                  worth of LLD.
                </span>
              </div>
            )}

            <div className="b-divider" />

            <div className="b-secure">
              <Shield size={18} style={{ flexShrink: 0 }} />
              Referrals auto-applied
            </div>

            <button
              className="text-center rounded-2xl font-semibold !py-3 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-red-500"
              disabled={isBuyDisabled}
              onClick={buyWithETH}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="b-spin" /> Processing...
                </>
              ) : (
                <>
                  <Zap size={18} strokeWidth={2.5} /> Buy LLD Now
                </>
              )}
            </button>

            {/* Only show error/info status inline, NOT success */}
            {statusMsg && statusType !== "ok" && (
              <div className={`b-status ${statusType}`}>
                {statusType === "err" && (
                  <AlertTriangle
                    size={14}
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                )}
                {statusType === "info" && (
                  <Loader2
                    size={14}
                    className={isLoading ? "b-spin" : ""}
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                )}
                <div>
                  {statusMsg}
                  {txHash && (
                    <a
                      className="b-tx-link"
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={10} /> {txHash.slice(0, 22)}...
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {walletAddress && (
            <div className="b-chain-panel">
              <WalletBalance address={walletAddress} />
            </div>
          )}
        </div>
      </div>

      {/* 🎉 PREMIUM SUCCESS POPUP */}
      {successData && (
        <div className="bp-backdrop" onClick={closePopup}>
          {confetti.map((i) => (
            <div
              key={i}
              className="bp-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${6 + Math.random() * 6}px`,
                height: `${10 + Math.random() * 8}px`,
                background: [
                  "#00d278",
                  "#00e682",
                  "#FDE047",
                  "#00b866",
                  "#fff",
                ][i % 5],
                animation: `confettiFall ${2 + Math.random() * 2}s linear ${Math.random() * 0.5}s forwards`,
                borderRadius: i % 2 === 0 ? "2px" : "50%",
              }}
            />
          ))}

          <div className="bp-card" onClick={(e) => e.stopPropagation()}>
            <div className="bp-shimmer" />
            <button className="bp-close" onClick={closePopup}>
              <X size={16} />
            </button>

            <div className="bp-content">
              <div className="bp-icon-wrap">
                <div className="bp-ring" />
                <div className="bp-ring bp-ring-2" />

                <div className="bp-coin bp-coin-left">
                  <div className="bp-coin-blur" />
                  <img src={LLD_LOGO} alt="LLD" />
                </div>

                <div className="bp-check-circle">
                  <div className="bp-check-inner">
                    <CheckCircle2 size={56} color="#fff" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="bp-coin bp-coin-right">
                  <div className="bp-coin-blur" />
                  <img src={LLD_LOGO} alt="LLD" />
                </div>

                <Sparkles size={18} className="bp-sparkle bp-sparkle-1" />
                <Sparkles size={14} className="bp-sparkle bp-sparkle-2" />
                <Sparkles size={12} className="bp-sparkle bp-sparkle-3" />
              </div>

              <div className="bp-title-wrap">
                <div className="bp-badge">
                  <Crown size={11} />
                  Purchase Successful
                </div>
                <h2 className="bp-heading">LLD tokens are yours! 🚀</h2>
                <p className="bp-subheading">Confirmed on Ethereum Mainnet</p>
              </div>

              <div className="bp-amount-box">
                <div className="bp-amount-lbl">You Received</div>
                <div className="bp-amount-val">
                  <img src={LLD_LOGO} alt="LLD" />
                  <span className="num">
                    {successData.distribution
                      ? formatLLD(successData.distribution.userShare)
                      : "—"}
                  </span>
                  <span className="sym">LLD</span>
                </div>
              </div>

              <div className="bp-breakdown">
                <div className="bp-row">
                  <div className="bp-row-lbl">
                    <TrendingUp size={13} /> USDT Spent
                  </div>
                  <div className="bp-row-val">${successData.usdtAmount}</div>
                </div>
                <div className="bp-row">
                  <div className="bp-row-lbl">
                    <Zap size={13} /> ETH Spent
                  </div>
                  <div className="bp-row-val">{successData.ethSpent} ETH</div>
                </div>

                {successData.distribution && (
                  <>
                    <div className="bp-row">
                      <div className="bp-row-lbl">
                        <Users size={13} /> Referral Rewards
                      </div>
                      <div className="bp-row-val">
                        {formatLLD(
                          (
                            BigInt(successData.distribution.ref1Share) +
                            BigInt(successData.distribution.ref2Share) +
                            BigInt(successData.distribution.ref3Share)
                          ).toString(),
                        )}{" "}
                        LLD
                      </div>
                    </div>
                    <div className="bp-row highlight">
                      <div className="bp-row-lbl">
                        <Sparkles size={13} /> Total Minted
                      </div>
                      <div className="bp-row-val">
                        {formatLLD(successData.distribution.totalLLD)} LLD
                      </div>
                    </div>
                  </>
                )}
              </div>

              {successData.txHash && (
                <div className="bp-tx-box">
                  <div className="bp-tx-lbl">Transaction Hash</div>
                  <div className="bp-tx-row">
                    <span className="bp-tx-hash">
                      {successData.txHash.slice(0, 14)}···
                      {successData.txHash.slice(-10)}
                    </span>
                    <div className="bp-tx-btns">
                      <button
                        className="bp-tx-btn"
                        onClick={handleCopyTx}
                        title="Copy"
                      >
                        <Copy size={12} />
                      </button>
                      <a
                        className="bp-tx-btn"
                        href={`https://etherscan.io/tx/${successData.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on Etherscan"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                  {copied && (
                    <div className="bp-copy-msg">✓ Copied to clipboard</div>
                  )}
                </div>
              )}

              <button className="bp-done-btn" onClick={closePopup}>
                Awesome, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}