    // import React, { useMemo, useState } from "react";
    // import { useQuery } from "@tanstack/react-query";
    // import { motion, AnimatePresence } from "framer-motion";
    // import {
    //     AreaChart, Area,
    //     BarChart, Bar,
    //     XAxis, YAxis,
    //     Tooltip, ResponsiveContainer, Cell,
    // } from "recharts";
    // import {
    //     TrendingUp, TrendingDown, RefreshCw,
    //     ArrowUpRight, ArrowDownRight,
    //     Activity, BarChart2, DollarSign,
    // } from "lucide-react";

    // // ─── CONFIG ──────────────────────────────────────────────────────────────────
    // const COIN_ID = "liberland-lld";
    // const CURRENCY = "usd";
    // const BASE = "https://api.coingecko.com/api/v3";
    // const STALE_MS = 10 * 60 * 1000; // 10 minutes — request tab nahi hoga agar cache fresh hai

    // const RANGES = [
    //     { label: "24H", days: 1, interval: "hourly" },
    //     { label: "7D", days: 7, interval: "hourly" },
    //     { label: "1M", days: 30, interval: "daily" },
    //     { label: "3M", days: 90, interval: "daily" },
    //     { label: "1Y", days: 365, interval: "daily" },
    // ];

    // // ─── HELPERS ─────────────────────────────────────────────────────────────────
    // function formatLabel(ts, days) {
    //     const d = new Date(ts);
    //     if (days <= 1) return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    //     if (days <= 7) return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " " + d.getHours() + ":00";
    //     if (days <= 90) return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    //     return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    // }

    // function formatPrice(n) {
    //     if (n == null) return "—";
    //     if (n < 0.001) return "$" + n.toFixed(8);
    //     if (n < 1) return "$" + n.toFixed(4);
    //     return "$" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    // }

    // function formatVolume(n) {
    //     if (!n) return "—";
    //     if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
    //     if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    //     if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    //     return "$" + n.toFixed(0);
    // }

    // function thinArray(arr, maxLen) {
    //     if (arr.length <= maxLen) return arr;
    //     const step = Math.ceil(arr.length / maxLen);
    //     return arr.filter((_, i) => i % step === 0 || i === arr.length - 1);
    // }

    // // ─── FETCH FUNCTIONS (pure async — useQuery ke andar jaayenge) ────────────────

    // // Coin info — market cap, ATH, ATL, 24h stats etc.
    // // queryKey: ["coinInfo"] — sirf ek baar fetch hoga, 10 min cache
    // async function fetchCoinInfo() {
    //     const res = await fetch(
    //         `${BASE}/coins/${COIN_ID}?localization=false&tickers=false&community_data=false&developer_data=false`
    //     );
    //     if (!res.ok) throw new Error(`CoinInfo API ${res.status}`);
    //     const json = await res.json();
    //     const md = json.market_data;
    //     return {
    //         name: json.name,
    //         symbol: json.symbol?.toUpperCase(),
    //         image: json.image?.small,
    //         currentPrice: md.current_price?.[CURRENCY],
    //         marketCap: md.market_cap?.[CURRENCY],
    //         volume24h: md.total_volume?.[CURRENCY],
    //         high24h: md.high_24h?.[CURRENCY],
    //         low24h: md.low_24h?.[CURRENCY],
    //         change24h: md.price_change_percentage_24h,
    //         change7d: md.price_change_percentage_7d,
    //         change30d: md.price_change_percentage_30d,
    //         ath: md.ath?.[CURRENCY],
    //         atl: md.atl?.[CURRENCY],
    //     };
    // }

    // // Chart data — price line + volume + OHLC enrichment
    // // queryKey: ["chartData", days] — har range ke liye alag cache entry
    // // Tab switch karo to 7D → cached data milega, no refetch until stale
    // async function fetchChartData({ days, interval }) {
    //     // Step 1: price line + volume (parallel with OHLC)
    //     const [chartRes, ohlcRes] = await Promise.allSettled([
    //         fetch(
    //             `${BASE}/coins/${COIN_ID}/market_chart?vs_currency=${CURRENCY}&days=${days}&interval=${interval}&precision=6`
    //         ),
    //         fetch(
    //             `${BASE}/coins/${COIN_ID}/ohlc?vs_currency=${CURRENCY}&days=${days}`
    //         ),
    //     ]);

    //     if (chartRes.status === "rejected" || !chartRes.value.ok) {
    //         const status = chartRes.value?.status;
    //         throw new Error(status === 429 ? "Rate limited (429) — retry in a moment" : `Chart API ${status}`);
    //     }

    //     const chartJson = await chartRes.value.json();
    //     const prices = chartJson.prices || [];
    //     const volumes = chartJson.total_volumes || [];

    //     // Build vol lookup map by timestamp
    //     const volMap = {};
    //     volumes.forEach(([ts, vol]) => { volMap[ts] = vol; });

    //     const maxPoints = days <= 7 ? 200 : days <= 30 ? 60 : 90;
    //     const raw = thinArray(prices, maxPoints).map(([ts, price]) => ({
    //         ts,
    //         label: formatLabel(ts, days),
    //         price,
    //         open: price,
    //         close: price,
    //         high: price,
    //         low: price,
    //         volume: volMap[ts] || 0,
    //     }));

    //     // Step 2: Enrich with real OHLC if available (non-blocking — settled)
    //     if (ohlcRes.status === "fulfilled" && ohlcRes.value.ok) {
    //         const ohlcData = await ohlcRes.value.json();
    //         const ohlcMap = {};
    //         ohlcData.forEach(([ts, o, h, l, c]) => { ohlcMap[ts] = { o, h, l, c }; });
    //         const ohlcTs = Object.keys(ohlcMap).map(Number).sort((a, b) => a - b);

    //         raw.forEach((pt) => {
    //             let closest = ohlcTs[0];
    //             for (const t of ohlcTs) {
    //                 if (Math.abs(t - pt.ts) < Math.abs(closest - pt.ts)) closest = t;
    //             }
    //             if (closest && ohlcMap[closest]) {
    //                 const c = ohlcMap[closest];
    //                 pt.open = c.o;
    //                 pt.high = c.h;
    //                 pt.low = c.l;
    //                 pt.close = c.c;
    //             }
    //         });
    //     }

    //     return raw;
    // }

    // // ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
    // const CustomTooltip = ({ active, payload }) => {
    //     if (!active || !payload?.length) return null;
    //     const d = payload[0]?.payload;
    //     if (!d) return null;
    //     const isUp = d.close >= d.open;

    //     return (
    //         <div className="bg-[#0f0f12] border border-white/10 rounded-xl p-3 text-xs shadow-xl min-w-[160px]">
    //             <p className="text-gray-400 mb-2">{d.label}</p>
    //             <div className="grid grid-cols-2 gap-x-4 gap-y-1">
    //                 <span className="text-gray-500">Open</span>
    //                 <span className="text-white text-right">{formatPrice(d.open)}</span>
    //                 <span className="text-gray-500">High</span>
    //                 <span className="text-emerald-400 text-right">{formatPrice(d.high)}</span>
    //                 <span className="text-gray-500">Low</span>
    //                 <span className="text-red-400 text-right">{formatPrice(d.low)}</span>
    //                 <span className="text-gray-500">Close</span>
    //                 <span className={`text-right font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
    //                     {formatPrice(d.close)}
    //                 </span>
    //             </div>
    //             {d.volume > 0 && (
    //                 <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
    //                     <span className="text-gray-500">Volume</span>
    //                     <span className="text-gray-300">{formatVolume(d.volume)}</span>
    //                 </div>
    //             )}
    //         </div>
    //     );
    // };

    // // ─── STAT CARD ───────────────────────────────────────────────────────────────
    // const StatCard = ({ icon: Icon, label, value, subValue, color = "text-white" }) => (
    //     <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2">
    //         <div className="flex items-center gap-2 text-gray-500">
    //             <Icon size={13} />
    //             <span className="text-[11px] uppercase tracking-wider">{label}</span>
    //         </div>
    //         <p className={`text-lg font-semibold ${color}`}>{value}</p>
    //         {subValue && <p className="text-[11px] text-gray-500">{subValue}</p>}
    //     </div>
    // );

    // // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
    // const LLDChart = () => {
    //     const [activeRange, setActiveRange] = useState(RANGES[0]);
    //     const [chartType, setChartType] = useState("area");

    //     // ── Query 1: Coin info ────────────────────────────────────────────────────
    //     // queryKey: ["coinInfo", COIN_ID]
    //     // staleTime: 10 min → mount/unmount/tab-focus pe refetch nahi hoga
    //     // retry: 1 → 429 pe sirf ek baar retry, 3 sec baad
    //     const { data: coinInfo } = useQuery({
    //         queryKey: ["coinInfo", COIN_ID],
    //         queryFn: fetchCoinInfo,
    //         staleTime: STALE_MS,
    //         retry: 1,
    //         retryDelay: 3000,
    //     });

    //     // ── Query 2: Chart data ───────────────────────────────────────────────────
    //     // queryKey: ["chartData", days] → "24H" aur "7D" ke liye alag cache slots
    //     // Pehle 24H fetch hua → cache mein hai
    //     // User 7D click kare → nayi request (7D ka apna cache slot)
    //     // User wapas 24H click kare → ZERO requests, instant render from cache
    //     const {
    //         data: chartData = [],
    //         isLoading: chartLoading,
    //         isFetching,
    //         error: chartError,
    //         refetch,
    //         dataUpdatedAt,
    //     } = useQuery({
    //         queryKey: ["chartData"],
    //         queryFn: () => fetchChartData({ days: 365, interval: "daily" }),

    //         staleTime: STALE_MS,
    //         cacheTime: STALE_MS,

    //         retry: 1,
    //         retryDelay: 3000,

    //         // 🔥 MAIN FIX
    //         refetchOnWindowFocus: false,
    //         refetchOnMount: false,
    //         refetchOnReconnect: false,
    //     });


    //     const filteredData = useMemo(() => {
    //         if (!chartData.length) return [];
    //         const now = Date.now();
    //         const ms = activeRange.days * 24 * 60 * 60 * 1000;

    //         return chartData.filter((item) => now - item.ts <= ms);
    //     }, [chartData, activeRange]);

    //     // ── Computed values ───────────────────────────────────────────────────────
    //     const prices = chartData.map((d) => d.price);
    //     const periodHigh = prices.length ? Math.max(...prices) : null;
    //     const periodLow = prices.length ? Math.min(...prices) : null;
    //     const periodFirst = prices[0] ?? null;
    //     const periodLast = prices[prices.length - 1] ?? null;
    //     const periodChange = periodFirst && periodLast
    //         ? ((periodLast - periodFirst) / periodFirst) * 100
    //         : null;
    //     const isUp = (periodChange ?? 0) >= 0;

    //     const barColors = chartData.map((d, i) =>
    //         i === 0 ? "#22c55e"
    //             : d.close >= (chartData[i - 1]?.close ?? d.close) ? "#22c55e" : "#ef4444"
    //     );

    //     const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;
    //     const loading = chartLoading;

    //     // ── Render ────────────────────────────────────────────────────────────────
    //     return (
    //         <section className="min-h-screen bg-[#020203] px-4 sm:px-6 py-12 font-sans">
    //             <div className="max-w-7xl mx-auto space-y-6">

    //                 {/* ── Header ───────────────────────────────────────────────────────── */}
    //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    //                     <div className="flex items-center gap-3">
    //                         {coinInfo?.image && (
    //                             <img src={coinInfo.image} alt="LLD" className="w-9 h-9 rounded-full" />
    //                         )}
    //                         <div>
    //                             <h1 className="text-2xl sm:text-3xl font-bold text-white">
    //                                 {coinInfo?.name ?? "LLD"}{" "}
    //                                 <span className="text-gray-500 text-lg font-normal">
    //                                     {coinInfo?.symbol ?? "LLD"} / USD
    //                                 </span>
    //                             </h1>
    //                             <p className="text-xs text-gray-500 mt-0.5">
    //                                 CoinGecko API · Cache: 10 min
    //                             </p>
    //                         </div>
    //                     </div>

    //                     <div className="flex items-center gap-3">
    //                         {coinInfo?.currentPrice && (
    //                             <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-center">
    //                                 <p className="text-[10px] text-gray-500 uppercase tracking-wider">Current</p>
    //                                 <p className="text-lg font-semibold text-white">
    //                                     {formatPrice(coinInfo.currentPrice)}
    //                                 </p>
    //                                 {coinInfo.change24h != null && (
    //                                     <p className={`text-xs font-medium flex items-center justify-center gap-0.5 ${coinInfo.change24h >= 0 ? "text-emerald-400" : "text-red-400"
    //                                         }`}>
    //                                         {coinInfo.change24h >= 0
    //                                             ? <ArrowUpRight size={12} />
    //                                             : <ArrowDownRight size={12} />
    //                                         }
    //                                         {Math.abs(coinInfo.change24h).toFixed(2)}% 24H
    //                                     </p>
    //                                 )}
    //                             </div>
    //                         )}

    //                         {/* Manual refresh — staleTime ignore karke force refetch */}
    //                         <button
    //                             onClick={() => refetch()}
    //                             disabled={isFetching}
    //                             className="p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition disabled:opacity-40"
    //                             title="Force refresh"
    //                         >
    //                             <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
    //                         </button>
    //                     </div>
    //                 </div>

    //                 {/* ── Stats Grid ───────────────────────────────────────────────────── */}
    //                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    //                     <StatCard icon={DollarSign} label="Market Cap" value={formatVolume(coinInfo?.marketCap)} />
    //                     <StatCard icon={BarChart2} label="24H Volume" value={formatVolume(coinInfo?.volume24h)} />
    //                     <StatCard
    //                         icon={TrendingUp}
    //                         label="24H High"
    //                         value={formatPrice(coinInfo?.high24h)}
    //                         color="text-emerald-400"
    //                     />
    //                     <StatCard
    //                         icon={TrendingDown}
    //                         label="24H Low"
    //                         value={formatPrice(coinInfo?.low24h)}
    //                         color="text-red-400"
    //                     />
    //                     <StatCard
    //                         icon={Activity}
    //                         label={`${activeRange.label} Change`}
    //                         value={periodChange != null
    //                             ? `${periodChange >= 0 ? "+" : ""}${periodChange.toFixed(2)}%`
    //                             : "—"
    //                         }
    //                         color={isUp ? "text-emerald-400" : "text-red-400"}
    //                         subValue={`High: ${formatPrice(periodHigh)} · Low: ${formatPrice(periodLow)}`}
    //                     />
    //                 </div>

    //                 {/* ── Chart Card ───────────────────────────────────────────────────── */}
    //                 <motion.div
    //                     key={activeRange.label}
    //                     initial={{ opacity: 0, y: 20 }}
    //                     animate={{ opacity: 1, y: 0 }}
    //                     transition={{ duration: 0.3 }}
    //                     className="bg-[#0a0a0d] border border-white/[0.07] rounded-3xl p-4 sm:p-6 relative overflow-hidden"
    //                 >
    //                     {/* Controls */}
    //                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
    //                         <div className="flex gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 w-fit">
    //                             {RANGES.map((r) => (
    //                                 <button
    //                                     key={r.label}
    //                                     onClick={() => setActiveRange(r)}
    //                                     className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeRange.label === r.label
    //                                             ? "bg-purple-600 text-white shadow"
    //                                             : "text-gray-500 hover:text-white"
    //                                         }`}
    //                                 >
    //                                     {r.label}
    //                                 </button>
    //                             ))}
    //                         </div>

    //                         <div className="flex gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 w-fit">
    //                             {["area", "bar"].map((type) => (
    //                                 <button
    //                                     key={type}
    //                                     onClick={() => setChartType(type)}
    //                                     className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${chartType === type
    //                                             ? "bg-white/10 text-white"
    //                                             : "text-gray-500 hover:text-white"
    //                                         }`}
    //                                 >
    //                                     {type === "area" ? "Line" : "Volume"}
    //                                 </button>
    //                             ))}
    //                         </div>
    //                     </div>

    //                     {/* Period Banner */}
    //                     {periodChange != null && !loading && (
    //                         <div className={`flex items-center gap-2 mb-4 text-sm font-medium ${isUp ? "text-emerald-400" : "text-red-400"
    //                             }`}>
    //                             {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
    //                             <span>
    //                                 {isUp ? "+" : ""}{periodChange.toFixed(2)}% over {activeRange.label}
    //                             </span>
    //                             <span className="text-gray-600 text-xs font-normal ml-1">
    //                                 {formatPrice(periodFirst)} → {formatPrice(periodLast)}
    //                             </span>
    //                         </div>
    //                     )}

    //                     {/* Chart */}
    //                     <AnimatePresence mode="wait">
    //                         {loading ? (
    //                             <motion.div
    //                                 key="loader"
    //                                 initial={{ opacity: 0 }}
    //                                 animate={{ opacity: 1 }}
    //                                 exit={{ opacity: 0 }}
    //                                 className="flex flex-col items-center justify-center h-[280px] gap-3"
    //                             >
    //                                 <RefreshCw size={20} className="text-purple-500 animate-spin" />
    //                                 <p className="text-gray-500 text-sm">Fetching {activeRange.label} data…</p>
    //                             </motion.div>
    //                         ) : chartError ? (
    //                             <motion.div
    //                                 key="error"
    //                                 className="flex flex-col items-center justify-center h-[280px] gap-2"
    //                             >
    //                                 <p className="text-red-400 text-sm">{chartError.message}</p>
    //                                 <button onClick={() => refetch()} className="text-xs text-gray-400 hover:text-white underline">
    //                                     Retry
    //                                 </button>
    //                             </motion.div>
    //                         ) : (
    //                             <motion.div
    //                                 key={`chart-${activeRange.label}-${chartType}`}
    //                                 initial={{ opacity: 0 }}
    //                                 animate={{ opacity: 1 }}
    //                                 exit={{ opacity: 0 }}
    //                                 transition={{ duration: 0.25 }}
    //                             >
    //                                 {chartType === "area" ? (
    //                                     <div className="w-full h-[280px] sm:h-[320px]">
    //                                         <ResponsiveContainer width="100%" height="100%">
    //                                             <AreaChart data={filteredData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
    //                                                 <defs>
    //                                                     <linearGradient id="gradUp" x1="0" y1="0" x2="0" y2="1">
    //                                                         <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
    //                                                         <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
    //                                                     </linearGradient>
    //                                                     <linearGradient id="gradDown" x1="0" y1="0" x2="0" y2="1">
    //                                                         <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
    //                                                         <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
    //                                                     </linearGradient>
    //                                                 </defs>
    //                                                 <XAxis
    //                                                     dataKey="label"
    //                                                     stroke="transparent"
    //                                                     tick={{ fill: "#555", fontSize: 10 }}
    //                                                     interval={Math.ceil(chartData.length / 7)}
    //                                                     tickLine={false}
    //                                                     axisLine={false}
    //                                                 />
    //                                                 <YAxis
    //                                                     orientation="right"
    //                                                     stroke="transparent"
    //                                                     tick={{ fill: "#555", fontSize: 10 }}
    //                                                     tickLine={false}
    //                                                     axisLine={false}
    //                                                     width={70}
    //                                                     tickFormatter={formatPrice}
    //                                                     domain={["auto", "auto"]}
    //                                                 />
    //                                                 <Tooltip
    //                                                     content={<CustomTooltip />}
    //                                                     cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
    //                                                 />
    //                                                 <Area
    //                                                     type="monotone"
    //                                                     dataKey="price"
    //                                                     stroke={isUp ? "#22c55e" : "#ef4444"}
    //                                                     strokeWidth={1.5}
    //                                                     fill={isUp ? "url(#gradUp)" : "url(#gradDown)"}
    //                                                     dot={false}
    //                                                     activeDot={{ r: 4, fill: isUp ? "#22c55e" : "#ef4444", strokeWidth: 0 }}
    //                                                 />
    //                                             </AreaChart>
    //                                         </ResponsiveContainer>
    //                                     </div>
    //                                 ) : (
    //                                     <div className="w-full h-[280px] sm:h-[320px]">
    //                                         <ResponsiveContainer width="100%" height="100%">
    //                                             <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
    //                                                 <XAxis
    //                                                     dataKey="label"
    //                                                     stroke="transparent"
    //                                                     tick={{ fill: "#555", fontSize: 10 }}
    //                                                     interval={Math.ceil(chartData.length / 7)}
    //                                                     tickLine={false}
    //                                                     axisLine={false}
    //                                                 />
    //                                                 <YAxis
    //                                                     orientation="right"
    //                                                     stroke="transparent"
    //                                                     tick={{ fill: "#555", fontSize: 10 }}
    //                                                     tickLine={false}
    //                                                     axisLine={false}
    //                                                     width={80}
    //                                                     tickFormatter={formatVolume}
    //                                                 />
    //                                                 <Tooltip
    //                                                     content={<CustomTooltip />}
    //                                                     cursor={{ fill: "rgba(255,255,255,0.03)" }}
    //                                                 />
    //                                                 <Bar dataKey="volume" radius={[2, 2, 0, 0]} maxBarSize={12}>
    //                                                     {chartData.map((_, i) => (
    //                                                         <Cell key={i} fill={barColors[i]} fillOpacity={0.7} />
    //                                                     ))}
    //                                                 </Bar>
    //                                             </BarChart>
    //                                         </ResponsiveContainer>
    //                                     </div>
    //                                 )}
    //                             </motion.div>
    //                         )}
    //                     </AnimatePresence>

    //                     {lastUpdated && (
    //                         <p className="text-[10px] text-gray-600 text-right mt-3">
    //                             {isFetching ? "Refreshing…" : `Cached at ${lastUpdated.toLocaleTimeString("en-IN")}`}
    //                             {" · "}Source: CoinGecko
    //                         </p>
    //                     )}
    //                 </motion.div>

    //                 {/* ── Extra Info Row ────────────────────────────────────────────────── */}
    //                 {coinInfo && (
    //                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    //                         {[
    //                             { label: "7D Change", value: coinInfo.change7d, suffix: "%" },
    //                             { label: "30D Change", value: coinInfo.change30d, suffix: "%" },
    //                             { label: "All Time High", value: coinInfo.ath, format: formatPrice },
    //                             { label: "All Time Low", value: coinInfo.atl, format: formatPrice },
    //                         ].map(({ label, value, suffix, format }) => (
    //                             <div key={label} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
    //                                 <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    //                                 <p className={`text-base font-semibold ${suffix === "%" && value != null
    //                                         ? value >= 0 ? "text-emerald-400" : "text-red-400"
    //                                         : "text-white"
    //                                     }`}>
    //                                     {value != null
    //                                         ? format ? format(value) : `${value >= 0 ? "+" : ""}${value.toFixed(2)}${suffix}`
    //                                         : "—"
    //                                     }
    //                                 </p>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}

    //             </div>
    //         </section>
    //     );
    // };

    // export default LLDChart;





    import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart, Area,
    BarChart, Bar,
    XAxis, YAxis,
    Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
    TrendingUp, TrendingDown, RefreshCw,
    ArrowUpRight, ArrowDownRight,
    Activity, BarChart2, DollarSign,
} from "lucide-react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const COIN_ID = "liberland-lld";
const CURRENCY = "usd";
const BASE = "https://api.coingecko.com/api/v3";
const STALE_MS = 10 * 60 * 1000;

const RANGES = [
    { label: "24H", days: 1, interval: "hourly" },
    { label: "7D", days: 7, interval: "hourly" },
    { label: "1M", days: 30, interval: "daily" },
    { label: "3M", days: 90, interval: "daily" },
    { label: "1Y", days: 365, interval: "daily" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatLabel(ts, days) {
    const d = new Date(ts);
    if (days <= 1) return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    if (days <= 7) return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " " + d.getHours() + ":00";
    if (days <= 90) return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

function formatPrice(n) {
    if (n == null) return "—";
    if (n < 0.001) return "$" + n.toFixed(8);
    if (n < 1) return "$" + n.toFixed(4);
    return "$" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function formatVolume(n) {
    if (!n) return "—";
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
    return "$" + n.toFixed(0);
}

function thinArray(arr, maxLen) {
    if (arr.length <= maxLen) return arr;
    const step = Math.ceil(arr.length / maxLen);
    return arr.filter((_, i) => i % step === 0 || i === arr.length - 1);
}

// ─── FETCH FUNCTIONS ─────────────────────────────────────────────────────────
async function fetchCoinInfo() {
    const res = await fetch(
        `${BASE}/coins/${COIN_ID}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    if (!res.ok) throw new Error(`CoinInfo API ${res.status}`);
    const json = await res.json();
    const md = json.market_data;
    return {
        name: json.name,
        symbol: json.symbol?.toUpperCase(),
        image: json.image?.small,
        currentPrice: md.current_price?.[CURRENCY],
        marketCap: md.market_cap?.[CURRENCY],
        volume24h: md.total_volume?.[CURRENCY],
        high24h: md.high_24h?.[CURRENCY],
        low24h: md.low_24h?.[CURRENCY],
        change24h: md.price_change_percentage_24h,
        change7d: md.price_change_percentage_7d,
        change30d: md.price_change_percentage_30d,
        ath: md.ath?.[CURRENCY],
        atl: md.atl?.[CURRENCY],
    };
}

async function fetchChartData({ days, interval }) {
    const [chartRes, ohlcRes] = await Promise.allSettled([
        fetch(
            `${BASE}/coins/${COIN_ID}/market_chart?vs_currency=${CURRENCY}&days=${days}&interval=${interval}&precision=6`
        ),
        fetch(
            `${BASE}/coins/${COIN_ID}/ohlc?vs_currency=${CURRENCY}&days=${days}`
        ),
    ]);

    if (chartRes.status === "rejected" || !chartRes.value.ok) {
        const status = chartRes.value?.status;
        throw new Error(status === 429 ? "Rate limited (429) — retry in a moment" : `Chart API ${status}`);
    }

    const chartJson = await chartRes.value.json();
    const prices = chartJson.prices || [];
    const volumes = chartJson.total_volumes || [];

    const volMap = {};
    volumes.forEach(([ts, vol]) => { volMap[ts] = vol; });

    const maxPoints = days <= 7 ? 200 : days <= 30 ? 60 : 90;
    const raw = thinArray(prices, maxPoints).map(([ts, price]) => ({
        ts,
        label: formatLabel(ts, days),
        price,
        open: price,
        close: price,
        high: price,
        low: price,
        volume: volMap[ts] || 0,
    }));

    if (ohlcRes.status === "fulfilled" && ohlcRes.value.ok) {
        const ohlcData = await ohlcRes.value.json();
        const ohlcMap = {};
        ohlcData.forEach(([ts, o, h, l, c]) => { ohlcMap[ts] = { o, h, l, c }; });
        const ohlcTs = Object.keys(ohlcMap).map(Number).sort((a, b) => a - b);

        raw.forEach((pt) => {
            let closest = ohlcTs[0];
            for (const t of ohlcTs) {
                if (Math.abs(t - pt.ts) < Math.abs(closest - pt.ts)) closest = t;
            }
            if (closest && ohlcMap[closest]) {
                const c = ohlcMap[closest];
                pt.open = c.o;
                pt.high = c.h;
                pt.low = c.l;
                pt.close = c.c;
            }
        });
    }

    return raw;
}

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    const isUp = d.close >= d.open;

    return (
        <div style={{
            background: "#0f0f12",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "10px 12px",
            fontSize: 12,
            minWidth: 150,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}>
            <p style={{ color: "#888", marginBottom: 8 }}>{d.label}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 16px" }}>
                <span style={{ color: "#555" }}>Open</span>
                <span style={{ color: "#fff", textAlign: "right" }}>{formatPrice(d.open)}</span>
                <span style={{ color: "#555" }}>High</span>
                <span style={{ color: "#22c55e", textAlign: "right" }}>{formatPrice(d.high)}</span>
                <span style={{ color: "#555" }}>Low</span>
                <span style={{ color: "#ef4444", textAlign: "right" }}>{formatPrice(d.low)}</span>
                <span style={{ color: "#555" }}>Close</span>
                <span style={{ color: isUp ? "#22c55e" : "#ef4444", textAlign: "right", fontWeight: 600 }}>
                    {formatPrice(d.close)}
                </span>
            </div>
            {d.volume > 0 && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#555" }}>Volume</span>
                    <span style={{ color: "#bbb" }}>{formatVolume(d.volume)}</span>
                </div>
            )}
        </div>
    );
};

// ─── STAT CARD ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, subValue, color = "#fff" }) => (
    <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 0,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#666" }}>
            <Icon size={12} />
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
        {subValue && <p style={{ fontSize: 10, color: "#555", margin: 0, lineHeight: 1.4 }}>{subValue}</p>}
    </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const LLDChart = () => {
    const [activeRange, setActiveRange] = useState(RANGES[4]);
    const [chartType, setChartType] = useState("area");

    const { data: coinInfo } = useQuery({
        queryKey: ["coinInfo", COIN_ID],
        queryFn: fetchCoinInfo,
        staleTime: STALE_MS,
        retry: 1,
        retryDelay: 3000,
    });

    const {
        data: chartData = [],
        isLoading: chartLoading,
        isFetching,
        error: chartError,
        refetch,
        dataUpdatedAt,
    } = useQuery({
        queryKey: ["chartData"],
        queryFn: () => fetchChartData({ days: 365, interval: "daily" }),
        staleTime: STALE_MS,
        cacheTime: STALE_MS,
        retry: 1,
        retryDelay: 3000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    const filteredData = useMemo(() => {
        if (!chartData.length) return [];
        const now = Date.now();
        const ms = activeRange.days * 24 * 60 * 60 * 1000;
        return chartData.filter((item) => now - item.ts <= ms);
    }, [chartData, activeRange]);

    const prices = chartData.map((d) => d.price);
    const periodHigh = prices.length ? Math.max(...prices) : null;
    const periodLow = prices.length ? Math.min(...prices) : null;
    const periodFirst = prices[0] ?? null;
    const periodLast = prices[prices.length - 1] ?? null;
    const periodChange = periodFirst && periodLast
        ? ((periodLast - periodFirst) / periodFirst) * 100
        : null;
    const isUp = (periodChange ?? 0) >= 0;

    const barColors = chartData.map((d, i) =>
        i === 0 ? "#22c55e"
            : d.close >= (chartData[i - 1]?.close ?? d.close) ? "#22c55e" : "#ef4444"
    );

    const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;
    const loading = chartLoading;

    // Compute y-domain with padding so line fills the chart
    const filteredPrices = filteredData.map(d => d.price).filter(Boolean);
    const yMin = filteredPrices.length ? Math.min(...filteredPrices) : "auto";
    const yMax = filteredPrices.length ? Math.max(...filteredPrices) : "auto";
    const yPad = filteredPrices.length ? (yMax - yMin) * 0.08 || yMin * 0.08 : 0;
    const yDomain = filteredPrices.length ? [yMin - yPad, yMax + yPad] : ["auto", "auto"];

    return (
        <section style={{
            minHeight: "100vh",
            background: "#020203",
            padding: "24px 12px",
            fontFamily: "system-ui, sans-serif",
            boxSizing: "border-box",
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

                {/* ── Header ── */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        {coinInfo?.image && (
                            <img src={coinInfo.image} alt="LLD" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
                        )}
                        <div style={{ minWidth: 0 }}>
                            <h1 style={{ fontSize: "clamp(18px, 5vw, 26px)", fontWeight: 700, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {coinInfo?.name ?? "LLD"}{" "}
                                <span style={{ color: "#666", fontSize: "clamp(13px, 3vw, 16px)", fontWeight: 400 }}>
                                    {coinInfo?.symbol ?? "LLD"} / USD
                                </span>
                            </h1>
                            <p style={{ fontSize: 11, color: "#555", margin: "2px 0 0" }}>
                                CoinGecko API · Cache: 10 min
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        {coinInfo?.currentPrice && (
                            <div style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12,
                                padding: "8px 14px",
                                textAlign: "center",
                            }}>
                                <p style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Current</p>
                                <p style={{ fontSize: 17, fontWeight: 600, color: "#fff", margin: "2px 0" }}>
                                    {formatPrice(coinInfo.currentPrice)}
                                </p>
                                {coinInfo.change24h != null && (
                                    <p style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                        color: coinInfo.change24h >= 0 ? "#22c55e" : "#ef4444",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 2,
                                        margin: 0,
                                    }}>
                                        {coinInfo.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {Math.abs(coinInfo.change24h).toFixed(2)}% 24H
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            style={{
                                padding: "10px",
                                borderRadius: 12,
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "transparent",
                                color: "#888",
                                cursor: isFetching ? "not-allowed" : "pointer",
                                opacity: isFetching ? 0.4 : 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            title="Force refresh"
                        >
                            <RefreshCw size={15} style={{ animation: isFetching ? "spin 1s linear infinite" : "none" }} />
                        </button>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: 10,
                }}>
                    <StatCard icon={DollarSign} label="Market Cap" value={formatVolume(coinInfo?.marketCap)} />
                    <StatCard icon={BarChart2} label="24H Volume" value={formatVolume(coinInfo?.volume24h)} />
                    <StatCard icon={TrendingUp} label="24H High" value={formatPrice(coinInfo?.high24h)} color="#22c55e" />
                    <StatCard icon={TrendingDown} label="24H Low" value={formatPrice(coinInfo?.low24h)} color="#ef4444" />
                    <StatCard
                        icon={Activity}
                        label={`${activeRange.label} Change`}
                        value={periodChange != null
                            ? `${periodChange >= 0 ? "+" : ""}${periodChange.toFixed(2)}%`
                            : "—"
                        }
                        color={isUp ? "#22c55e" : "#ef4444"}
                        subValue={`High: ${formatPrice(periodHigh)} · Low: ${formatPrice(periodLow)}`}
                    />
                </div>

                {/* ── Chart Card ── */}
                <motion.div
                    key={activeRange.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        background: "#0a0a0d",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 24,
                        padding: "16px 14px",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    {/* Controls */}
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 16,
                    }}>
                        {/* Range Tabs */}
                        <div style={{
                            display: "flex",
                            gap: 2,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 12,
                            padding: 4,
                        }}>
                            {RANGES.map((r) => (
                                <button
                                    key={r.label}
                                    onClick={() => setActiveRange(r)}
                                    style={{
                                        padding: "6px 10px",
                                        borderRadius: 8,
                                        border: "none",
                                        background: activeRange.label === r.label ? "#7c3aed" : "transparent",
                                        color: activeRange.label === r.label ? "#fff" : "#666",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        {/* Chart Type Tabs */}
                        <div style={{
                            display: "flex",
                            gap: 2,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 12,
                            padding: 4,
                        }}>
                            {["area", "bar"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setChartType(type)}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        border: "none",
                                        background: chartType === type ? "rgba(255,255,255,0.1)" : "transparent",
                                        color: chartType === type ? "#fff" : "#666",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {type === "area" ? "Line" : "Volume"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Period Banner */}
                    {periodChange != null && !loading && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 12,
                            fontSize: 13,
                            fontWeight: 500,
                            color: isUp ? "#22c55e" : "#ef4444",
                            flexWrap: "wrap",
                        }}>
                            {isUp ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                            <span>{isUp ? "+" : ""}{periodChange.toFixed(2)}% over {activeRange.label}</span>
                            <span style={{ color: "#555", fontSize: 11, fontWeight: 400 }}>
                                {formatPrice(periodFirst)} → {formatPrice(periodLast)}
                            </span>
                        </div>
                    )}

                    {/* Chart Area */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 12 }}
                            >
                                <RefreshCw size={20} style={{ color: "#7c3aed", animation: "spin 1s linear infinite" }} />
                                <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Fetching {activeRange.label} data…</p>
                            </motion.div>
                        ) : chartError ? (
                            <motion.div
                                key="error"
                                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 260, gap: 8 }}
                            >
                                <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{chartError.message}</p>
                                <button onClick={() => refetch()} style={{ fontSize: 12, color: "#888", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                                    Retry
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`chart-${activeRange.label}-${chartType}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                {chartType === "area" ? (
                                    <div style={{ width: "100%", height: "clamp(220px, 40vw, 320px)" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={filteredData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="gradUp" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="gradDown" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis
                                                    dataKey="label"
                                                    stroke="transparent"
                                                    tick={{ fill: "#555", fontSize: 10 }}
                                                    interval={Math.ceil(filteredData.length / 5)}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    orientation="right"
                                                    stroke="transparent"
                                                    tick={{ fill: "#555", fontSize: 10 }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    width={62}
                                                    tickFormatter={formatPrice}
                                                    domain={yDomain}
                                                />
                                                <Tooltip
                                                    content={<CustomTooltip />}
                                                    cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="price"
                                                    stroke={isUp ? "#22c55e" : "#ef4444"}
                                                    strokeWidth={2}
                                                    fill={isUp ? "url(#gradUp)" : "url(#gradDown)"}
                                                    dot={false}
                                                    activeDot={{ r: 4, fill: isUp ? "#22c55e" : "#ef4444", strokeWidth: 0 }}
                                                    isAnimationActive={false}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div style={{ width: "100%", height: "clamp(220px, 40vw, 320px)" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                                                <XAxis
                                                    dataKey="label"
                                                    stroke="transparent"
                                                    tick={{ fill: "#555", fontSize: 10 }}
                                                    interval={Math.ceil(chartData.length / 5)}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    orientation="right"
                                                    stroke="transparent"
                                                    tick={{ fill: "#555", fontSize: 10 }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    width={70}
                                                    tickFormatter={formatVolume}
                                                />
                                                <Tooltip
                                                    content={<CustomTooltip />}
                                                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                                                />
                                                <Bar dataKey="volume" radius={[2, 2, 0, 0]} maxBarSize={12} isAnimationActive={false}>
                                                    {chartData.map((_, i) => (
                                                        <Cell key={i} fill={barColors[i]} fillOpacity={0.7} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {lastUpdated && (
                        <p style={{ fontSize: 10, color: "#444", textAlign: "right", marginTop: 10 }}>
                            {isFetching ? "Refreshing…" : `Cached at ${lastUpdated.toLocaleTimeString("en-IN")}`}
                            {" · "}Source: CoinGecko
                        </p>
                    )}
                </motion.div>

                {/* ── Extra Info Row ── */}
                {coinInfo && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                        gap: 10,
                    }}>
                        {[
                            { label: "7D Change", value: coinInfo.change7d, suffix: "%" },
                            { label: "30D Change", value: coinInfo.change30d, suffix: "%" },
                            { label: "All Time High", value: coinInfo.ath, format: formatPrice },
                            { label: "All Time Low", value: coinInfo.atl, format: formatPrice },
                        ].map(({ label, value, suffix, format }) => (
                            <div key={label} style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: 16,
                                padding: "14px 14px",
                            }}>
                                <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>{label}</p>
                                <p style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    margin: 0,
                                    color: suffix === "%" && value != null
                                        ? value >= 0 ? "#22c55e" : "#ef4444"
                                        : "#fff",
                                }}>
                                    {value != null
                                        ? format ? format(value) : `${value >= 0 ? "+" : ""}${value.toFixed(2)}${suffix}`
                                        : "—"
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* spin keyframe */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </section>
    );
};

export default LLDChart;