import React from "react";

/* =========================
   💰 Currency Utils
========================= */

const getCurrencySymbol = (unit) => {
    if (!unit) return "";

    const map = {
        usd: "$",
        inr: "₹",
        eur: "€",
        gbp: "£",
    };

    return map[unit.toLowerCase()] || "";
};

const formatWithCurrency = (value, unit) => {
    const symbol = getCurrencySymbol(unit);
    const formatted = Number(value).toLocaleString("en-IN");

    return symbol ? `${symbol}${formatted}` : formatted;
};


/* =========================
   📊 Candle Component
========================= */

const Candle = ({ type, gradient }) => {
    const defaultUp = "from-green-300 to-green-500";
    const defaultDown = "from-red-300 to-red-500";

    const color =
        type === "up"
            ? gradient || defaultUp
            : gradient || defaultDown;

    return (
        <div className="flex items-end gap-[4px] h-16">
            {[12, 20, 28, 18, 24, 30, 16].map((h, i) => (
                <div key={i} className="flex flex-col items-center group">
                    <div className="w-[2px] h-2 bg-gray-400 opacity-40" />
                    <div
                        className={`bg-gradient-to-b ${color} w-[6px] rounded-md shadow-md transition-all duration-300 group-hover:scale-110`}
                        style={{ height: `${h}px` }}
                    />
                    <div className="w-[2px] h-2 bg-gray-400 opacity-40" />
                </div>
            ))}
        </div>
    );
};


/* =========================
   🎨 Admin Stat Card
========================= */

const AdminStatCard = ({
    title,
    value,
    icon,
    trend,        // "up" | "down"
    iconColor,    // gradient: "from-cyan-500 to-blue-500"
    unit          // "usd" | "inr"
}) => {

    const gradient = iconColor || "from-cyan-500 to-blue-500";

    // detect text color from gradient
    const textColor =
        gradient.includes("green") ? "text-green-400" :
            gradient.includes("red") ? "text-red-400" :
                gradient.includes("yellow") ? "text-yellow-400" :
                    gradient.includes("purple") ? "text-purple-400" :
                        "text-cyan-400";

    return (
        <div className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 group">

            {/* Glow */}
            <div className={`absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br ${gradient} opacity-20 rounded-full blur-3xl group-hover:scale-125 transition`} />

            {/* Top */}
            <div className="flex justify-between items-center mb-6">

                {/* Icon */}
                <div className={`bg-white/10 p-3 rounded-xl text-lg shadow-inner ${textColor}`}>
                    {icon}
                </div>

                {/* Candle */}
                <Candle type={trend} gradient={gradient} />
            </div>

            {/* Value */}
            <h2 className="text-3xl font-bold flex items-center gap-2 tracking-wide">

                {formatWithCurrency(value, unit)}

                {trend && (
                    <span
                        className={`text-xs px-2 py-[3px] rounded-full font-medium ${trend === "up"
                                ? "bg-green-400/20 text-green-400"
                                : "bg-red-400/20 text-red-400"
                            }`}
                    >
                        {trend === "up" ? "↑" : "↓"}
                    </span>
                )}
            </h2>

            {/* Title */}
            <p className="text-gray-400 text-sm mt-1">{title}</p>
        </div>
    );
};

export default AdminStatCard;