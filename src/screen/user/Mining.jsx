import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Zap,
  Server,
  ShieldCheck,
  Cpu,
  Activity,
  Globe,
  Binary,
  Hash,
  Radio,
  TrendingUp,
  CircuitBoard,
  Database,
  TerminalSquare,
  Wifi,
  RefreshCw,
  Boxes,
} from "lucide-react";
import { ethers } from "ethers";

const BSC_RPC_URLS = [
  "https://bsc-dataseed.binance.org/",
  "https://rpc.ankr.com/bsc",
  "https://bsc-mainnet.nodereal.io/v1/05695ffbe5c2486b80bd56ad05f99572",
];

const STORAGE_KEY_LOGS = "minergate_console_logs_v2";
const STORAGE_KEY_STATS = "minergate_console_stats_v2";
const MAX_DAILY_BNB = 0.25;

const getInitialLogs = () => {
  try {
    const s = sessionStorage.getItem(STORAGE_KEY_LOGS);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const getInitialStats = () => {
  try {
    const s = sessionStorage.getItem(STORAGE_KEY_STATS);
    if (s) {
      const p = JSON.parse(s);
      if (p && typeof p.balance === "number")
        p.balance = Math.min(MAX_DAILY_BNB, p.balance);
      return p;
    }
    return null;
  } catch {
    return null;
  }
};

let globalLogsCache = getInitialLogs();
let globalStatsCache = getInitialStats();
let globalQueueCache = [];
let globalSeenHashes = new Set();
let globalHasBooted =
  Array.isArray(globalLogsCache) && globalLogsCache.length > 0;

// ─── Realistic mining log messages ───────────────────────────────────────────
const MINING_EVENTS = [
  { msg: "DAG epoch updated → epoch #512", type: "info" },
  { msg: "Peer discovery: 3 new nodes found on BSC mesh", type: "info" },
  {
    msg: "Nonce space rotated: 0x00–0xFF assigned to worker-04",
    type: "process",
  },
  { msg: "Stratum diff adjusted: 2.18 GH target", type: "data" },
  { msg: "Share accepted by pool [latency: 12ms]", type: "success" },
  { msg: "Share accepted by pool [latency: 9ms]", type: "success" },
  { msg: "Reconnecting to nearest BSC relay node...", type: "warning" },
  { msg: "Ping to bsc-dataseed1: 8ms ✓", type: "info" },
  { msg: "Memory pool sync: 1,847 pending txns indexed", type: "data" },
  { msg: "Gas oracle updated → 3 Gwei (standard)", type: "info" },
  {
    msg: "Uncle block detected at height #34891021 — skipped",
    type: "warning",
  },
  { msg: "Hashboard temp: 67°C | Fan: 3,200 RPM", type: "data" },
];

const NodeReward = ({ hideHeaderAndStats = false }) => {
  const [logs, setLogs] = useState(() => globalLogsCache || []);
  const [stats, setStats] = useState(() => {
    const init = globalStatsCache || {
      hashRate: 125,
      activeNodes: 8,
      uptime: 99.7,
      blocksMined: 1247,
      balance: 0.001,
      networkPeers: 94,
    };
    return { ...init, balance: Math.min(MAX_DAILY_BNB, init.balance) };
  });
  const [pulse, setPulse] = useState(false);

  const terminalRef = useRef(null);
  const logQueue = useRef(globalQueueCache);
  const seenHashes = useRef(globalSeenHashes);
  const isInitial = useRef(!globalHasBooted);
  const rpcIndex = useRef(0);
  const provider = useRef(new ethers.JsonRpcProvider(BSC_RPC_URLS[0]));

  useEffect(() => {
    globalLogsCache = logs;
    try {
      sessionStorage.setItem(
        STORAGE_KEY_LOGS,
        JSON.stringify(logs.slice(-120)),
      );
    } catch {}
  }, [logs]);

  useEffect(() => {
    const s = { ...stats, balance: Math.min(MAX_DAILY_BNB, stats.balance) };
    globalStatsCache = s;
    try {
      sessionStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(s));
    } catch {}
  }, [stats]);

  const queueLog = useCallback((message, type = "info") => {
    const ts = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    logQueue.current.push({
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: ts,
      displayText: "",
      isTyping: true,
    });
  }, []);

  const fetchBsc = useCallback(async () => {
    try {
      const p = provider.current;
      const latest = await p.getBlockNumber();
      let txns = [];
      let blockNum = latest;

      while (txns.length < 4 && blockNum >= latest - 2) {
        const block = await p.getBlock(blockNum, true);
        if (block?.prefetchedTransactions) {
          for (const tx of block.prefetchedTransactions) {
            if (txns.length >= 4) break;
            const hash = tx.hash || tx.transactionHash;
            if (hash && !seenHashes.current.has(hash)) {
              seenHashes.current.add(hash);
              txns.push(tx);
            }
          }
        }
        blockNum--;
      }

      if (isInitial.current) {
        txns = txns.slice(0, 2);
        isInitial.current = false;
      }

      for (const tx of txns) {
        const hash = tx.hash || tx.transactionHash || "";
        const shortHash =
          hash.length > 18 ? `${hash.slice(0, 10)}···${hash.slice(-8)}` : hash;

        let status = "confirmed";
        let fee = "0.00031";
        try {
          const receipt = await p.getTransactionReceipt(hash);
          if (receipt) {
            status = receipt.status === 1 ? "confirmed" : "reverted";
            if (receipt.gasUsed && receipt.gasPrice) {
              fee = parseFloat(
                ethers.formatEther(receipt.gasUsed * receipt.gasPrice),
              ).toFixed(5);
            }
          }
        } catch {}

        queueLog(`⊳ Tx detected   ${shortHash}`, "info");
        queueLog(
          `  ↳ Sig verified · fee ${fee} BNB · ${status}`,
          status === "confirmed" ? "success" : "error",
        );
        if (Math.random() > 0.55)
          queueLog(`⬡ BLOCK SEALED  +0.01 BNB reward credited`, "block");

        // Inject a random realistic event between txns
        if (Math.random() > 0.4) {
          const evt =
            MINING_EVENTS[Math.floor(Math.random() * MINING_EVENTS.length)];
          queueLog(evt.msg, evt.type);
        }
      }
    } catch (err) {
      console.warn("RPC error:", err);
      rpcIndex.current = (rpcIndex.current + 1) % BSC_RPC_URLS.length;
      provider.current = new ethers.JsonRpcProvider(
        BSC_RPC_URLS[rpcIndex.current],
      );
      queueLog(
        `⚡ Failover → ${BSC_RPC_URLS[rpcIndex.current].split("/")[2]}`,
        "warning",
      );
    }
  }, [queueLog]);

  // Boot
  useEffect(() => {
    if (!globalHasBooted) {
      globalHasBooted = true;
      [
        ["Initializing MinerGate core v3.2.0 · Redix kernel", "system"],
        ["Loading BLS-12-381 cryptographic primitives...", "info"],
        ["Establishing encrypted tunnel → BSC mainnet RPC", "info"],
        ["TLS 1.3 handshake complete · ECDHE cipher negotiated", "success"],
        ["P2P mesh connected · 94 peers visible", "success"],
        ["DAG pre-cache loaded · 4.1 GB allocated", "data"],
        ["Hashboard online · 125 MH/s across 8 workers", "data"],
        ["Mining session active · target USDT/BNB block pool", "success"],
      ].forEach(([msg, type]) => queueLog(msg, type));
    }
    fetchBsc();
    const iv = setInterval(fetchBsc, 25000);
    return () => clearInterval(iv);
  }, [fetchBsc, queueLog]);

  // Queue consumer
  useEffect(() => {
    const iv = setInterval(() => {
      if (!logQueue.current.length) return;
      const next = logQueue.current.shift();
      setLogs((prev) => [
        ...prev.map((l) => ({ ...l, displayText: l.message, isTyping: false })),
        next,
      ]);
      setPulse(true);
      setTimeout(() => setPulse(false), 400);

      if (next.message.includes("BLOCK SEALED")) {
        setStats((p) => {
          let nb = parseFloat((p.balance + 0.001).toFixed(4));
          if (nb > MAX_DAILY_BNB)
            nb = parseFloat(
              (MAX_DAILY_BNB - Math.random() * 0.0008).toFixed(4),
            );
          return {
            ...p,
            blocksMined: p.blocksMined + 1,
            balance: Math.min(MAX_DAILY_BNB, nb),
          };
        });
      } else if (Math.random() > 0.72) {
        setStats((p) => {
          const hr = 118 + Math.floor(Math.random() * 18);
          const peers = 88 + Math.floor(Math.random() * 14);
          let bal = p.balance;
          if (Math.random() > 0.5) {
            bal = parseFloat(
              (p.balance + (Math.random() * 0.0006 - 0.0002)).toFixed(4),
            );
            if (bal > MAX_DAILY_BNB) bal = MAX_DAILY_BNB;
            if (bal < 0.001) bal = 0.001;
          }
          return {
            ...p,
            hashRate: hr,
            networkPeers: peers,
            balance: Math.min(MAX_DAILY_BNB, bal),
          };
        });
      }
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!logs.length) return;
    const last = logs[logs.length - 1];
    if (!last?.isTyping) return;
    const t = setTimeout(() => {
      setLogs((prev) => {
        if (!prev.length) return prev;
        const li = prev.length - 1;
        const ll = prev[li];
        if (!ll.isTyping) return prev;
        const next = ll.displayText + (ll.message[ll.displayText.length] || "");
        const done = next.length >= ll.message.length;
        const u = [...prev];
        u[li] = { ...ll, displayText: next, isTyping: !done };
        return u;
      });
    }, 18);
    return () => clearTimeout(t);
  }, [logs]);

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current)
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  const logColor = (type) =>
    ({
      system: "text-red-400 font-bold tracking-wide",
      info: "text-slate-300",
      process: "text-amber-300",
      success: "text-emerald-400 font-semibold",
      data: "text-sky-300",
      block: "text-yellow-300 font-bold",
      error: "text-red-500 font-semibold",
      warning: "text-orange-300",
    })[type] || "text-slate-300";

  const logBg = (type) =>
    ({
      block: "bg-yellow-900/20 border-l-2 border-yellow-500/60 pl-2",
      error: "bg-red-900/15 border-l-2 border-red-500/50 pl-2",
      system: "bg-red-950/20 border-l-2 border-red-500/40 pl-2",
    })[type] || "";

  const logTag = (type) =>
    ({
      system: "SYS",
      info: "NET",
      process: "WRK",
      success: " OK",
      data: "DAT",
      block: "BLK",
      error: "ERR",
      warning: "WRN",
    })[type] || "LOG";

  const tagColor = (type) =>
    ({
      system: "text-red-500",
      info: "text-slate-500",
      process: "text-amber-500/80",
      success: "text-emerald-500/80",
      data: "text-sky-500/70",
      block: "text-yellow-500",
      error: "text-red-500",
      warning: "text-orange-400/80",
    })[type] || "text-slate-500";

  // Stat cards config
  const statCards = [
    {
      label: "Hash Rate",
      value: `${stats.hashRate}`,
      unit: "MH/s",
      icon: <Zap size={15} />,
      color: "red",
      border: "border-red-500/25",
      glow: "shadow-[0_0_18px_rgba(239,68,68,0.12)]",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      valColor: "text-red-400",
    },
    {
      label: "Nodes",
      value: `${stats.activeNodes}`,
      unit: "workers",
      icon: <Server size={15} />,
      color: "violet",
      border: "border-violet-500/25",
      glow: "shadow-[0_0_18px_rgba(139,92,246,0.1)]",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
      valColor: "text-violet-300",
    },
    {
      label: "Network",
      value: `${stats.networkPeers ?? 94}`,
      unit: "peers",
      icon: <Globe size={15} />,
      color: "sky",
      border: "border-sky-500/25",
      glow: "shadow-[0_0_18px_rgba(14,165,233,0.1)]",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
      valColor: "text-sky-300",
    },
    {
      label: "Blocks",
      value: stats.blocksMined.toLocaleString(),
      unit: "mined",
      icon: <Boxes size={15} />,
      color: "amber",
      border: "border-amber-500/25",
      glow: "shadow-[0_0_18px_rgba(245,158,11,0.1)]",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      valColor: "text-amber-300",
    },
    {
      label: "Uptime",
      value: `${stats.uptime}`,
      unit: "%",
      icon: <Activity size={15} />,
      color: "emerald",
      border: "border-emerald-500/25",
      glow: "shadow-[0_0_18px_rgba(16,185,129,0.1)]",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      valColor: "text-emerald-300",
    },
    {
      label: "Balance",
      value: stats.balance.toFixed(4),
      unit: "BNB",
      icon: <Database size={15} />,
      color: "red",
      border: "border-red-400/30",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
      iconBg: "bg-red-400/10",
      iconColor: "text-red-300",
      valColor: "text-white font-black",
    },
  ];

  return (
    <div className="w-full text-slate-200 font-sans space-y-5 flex flex-col">
      {!hideHeaderAndStats && (
        <>
          {/* ── Stat Cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`
                  relative bg-[#0c0d12] rounded-xl p-3 border ${card.border}
                  ${card.glow} transition-all duration-300 overflow-hidden
                  hover:border-opacity-60
                `}
              >
                {/* Subtle corner glow */}
                <div
                  className={`absolute top-0 right-0 w-12 h-12 ${card.iconBg} rounded-full blur-xl -translate-y-1/2 translate-x-1/2`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-lg ${card.iconBg} ${card.iconColor} mb-2`}
                  >
                    {card.icon}
                  </div>
                  <p
                    className={`text-base sm:text-lg font-black leading-none ${card.valColor}`}
                  >
                    {card.value}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-none">
                    {card.unit}
                  </p>
                  <p className="text-[9px] text-slate-600 mt-0.5 font-mono uppercase tracking-wider">
                    {card.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Terminal ─────────────────────────────────────────────────────────── */}
      <div
        className={`
          flex flex-col rounded-xl border border-red-500/20
          bg-[#06070a] overflow-hidden
          shadow-[0_0_40px_rgba(239,68,68,0.08),inset_0_1px_0_rgba(255,255,255,0.03)]
          ${hideHeaderAndStats ? "h-[320px]" : "h-[520px]"}
        `}
      >
        {/* Terminal topbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-[#08090e] shrink-0">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="w-px h-3.5 bg-white/10" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <TerminalSquare size={13} className="text-red-500/80" />
              <span className="font-mono text-[11px] text-slate-400">
                minergate@bsc-node-01 ~
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Pulse dot that blinks on new log */}
            <div
              className={`flex items-center gap-1.5 transition-opacity duration-200 ${pulse ? "opacity-100" : "opacity-60"}`}
            >
              <Wifi size={11} className="text-emerald-400" />
              <span className="text-[9px] font-mono text-emerald-400 tracking-widest">
                SYNCING
              </span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <CircuitBoard size={11} className="text-red-500/70" />
              <span className="font-mono text-[9px] text-slate-500">
                {logs.length} events
              </span>
            </div>
          </div>
        </div>

        {/* Log area */}
        <div
          ref={terminalRef}
          className="flex-1 px-4 py-3 overflow-y-auto font-mono text-[11px] space-y-1 bg-[#06070a] custom-scrollbar"
        >
          {!logs.length ? (
            <div className="flex items-center gap-2 text-red-500/50 py-10 justify-center">
              <RefreshCw size={12} className="animate-spin" />
              <span>Connecting to BSC mainnet P2P mesh...</span>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-2 py-0.5 px-1 rounded ${logBg(log.type)} hover:bg-white/[0.02] transition-colors`}
              >
                <span className="text-slate-600 whitespace-nowrap shrink-0 text-[10px] select-none tabular-nums">
                  {log.timestamp}
                </span>
                <span
                  className={`shrink-0 w-7 text-right text-[9px] font-bold select-none tracking-wider ${tagColor(log.type)}`}
                >
                  {logTag(log.type)}
                </span>
                <span
                  className={`${logColor(log.type)} leading-relaxed break-all`}
                >
                  {log.displayText}
                  {log.isTyping && (
                    <span className="inline-block w-1.5 h-3.5 bg-red-500 ml-0.5 animate-pulse align-middle" />
                  )}
                </span>
              </div>
            ))
          )}

          {/* Prompt line */}
          <div className="flex items-center gap-2 pt-2 select-none">
            <span className="text-slate-600 font-mono text-[10px]">
              root@node-01
            </span>
            <span className="text-red-500 text-[10px]">❯</span>
            <span className="w-1.5 h-3.5 bg-red-500/80 animate-pulse inline-block" />
          </div>
        </div>

        {/* Terminal footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.04] bg-[#08090e] shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-emerald-500" />
            <span className="text-[9px] font-mono text-emerald-500/80">
              TLS 1.3 · ECDHE
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Hash size={9} className="text-slate-600" />
            <span className="text-[9px] font-mono text-slate-600">
              BSC #
              {Math.floor(Math.random() * 1000 + 34890000).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Radio size={10} className="text-red-400/70 animate-pulse" />
            <span className="text-[9px] font-mono text-red-400/70 tracking-wider">
              MINING
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar       { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239,68,68,0.2); border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239,68,68,0.45);
        }
      `}</style>
    </div>
  );
};

export default NodeReward;
