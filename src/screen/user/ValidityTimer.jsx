import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CalendarClock,
  Hourglass,
  CalendarCheck2,
} from "lucide-react";

const TOTAL_DAYS = 70;
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MIN_MS = 60 * 1000;

const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const pad = (n) => String(n).padStart(2, "0");

const formatIST = (date) => {
  if (!date) return "--";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TONES = {
  active: {
    bg: "from-emerald-500 via-teal-500 to-cyan-600",
    shadow: "shadow-emerald-200",
    pill: "bg-white/20 text-white",
    label: "Active",
    Icon: ShieldCheck,
  },
  warning: {
    bg: "from-amber-500 via-orange-500 to-rose-500",
    shadow: "shadow-orange-200",
    pill: "bg-white/20 text-white",
    label: "Expiring Soon",
    Icon: AlertTriangle,
  },
  expired: {
    bg: "from-rose-500 via-red-500 to-red-700",
    shadow: "shadow-red-200",
    pill: "bg-white/20 text-white",
    label: "Expired",
    Icon: AlertTriangle,
  },
};

const TimeBox = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-[58px] h-[58px] rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-inner">
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
      <span
        key={value}
        className="vt-tick text-white text-[22px] font-extrabold tabular-nums"
      >
        {pad(value)}
      </span>
    </div>
    <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-white/75">
      {label}
    </span>
  </div>
);

const ValidityTimer = ({ activeDate, expiryDate }) => {
  const [now, setNow] = useState(Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!expiryDate) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  const expiry = expiryDate ? new Date(expiryDate).getTime() : NaN;

  // ---------- No package ----------
  if (!expiryDate || isNaN(expiry)) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm shadow-gray-100 flex items-center gap-3.5">
        <div className="vt-float w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Hourglass size={20} className="text-gray-400" />
        </div>
        <div>
          <p className="text-gray-900 font-extrabold text-[15px]">
            No Active Package
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            Activate a package to start your {TOTAL_DAYS}-day validity.
          </p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  const start = activeDate
    ? new Date(activeDate).getTime()
    : expiry - TOTAL_DAYS * DAY_MS;

  const totalMs = Math.max(expiry - start, 1);
  const remainingMs = Math.max(expiry - now, 0);
  const isExpired = remainingMs <= 0;
  const progress = Math.min(Math.max(remainingMs / totalMs, 0), 1);

  const days = Math.floor(remainingMs / DAY_MS);
  const hours = Math.floor((remainingMs % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((remainingMs % HOUR_MS) / MIN_MS);
  const seconds = Math.floor((remainingMs % MIN_MS) / 1000);

  const totalDays = Math.round(totalMs / DAY_MS) || TOTAL_DAYS;
  const dayOf = Math.min(
    Math.max(Math.ceil((now - start) / DAY_MS), 1),
    totalDays,
  );

  const toneKey = isExpired ? "expired" : days < 7 ? "warning" : "active";
  const tone = TONES[toneKey];
  const StatusIcon = tone.Icon;

  const dashOffset = mounted ? CIRCUMFERENCE * (1 - progress) : CIRCUMFERENCE;

  return (
    <div
      className={`vt-enter relative bg-gradient-to-br ${tone.bg} rounded-2xl p-5 shadow-lg ${tone.shadow} overflow-hidden`}
    >
      {/* decor */}
      <div className="pointer-events-none absolute -top-12 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-10 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent vt-shine" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <CalendarClock size={16} className="text-white" />
          </div>
          <h2 className="text-white font-extrabold text-[15px] tracking-tight">
            Package Validity
          </h2>
        </div>
        <span
          className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${tone.pill}`}
        >
          <span className="relative flex w-2 h-2">
            {!isExpired && (
              <span className="absolute inline-flex w-full h-full rounded-full bg-white opacity-75 animate-ping" />
            )}
            <span className="relative inline-flex w-2 h-2 rounded-full bg-white" />
          </span>
          {tone.label}
        </span>
      </div>

      {/* Ring */}
      <div className="relative flex justify-center mt-5">
        <div className="relative w-[140px] h-[140px] vt-float">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full -rotate-90 drop-shadow-md"
          >
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="9"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="white"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{
                transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <StatusIcon size={16} className="text-white/80 mb-0.5" />
            <span
              key={days}
              className="vt-tick text-white text-4xl font-extrabold leading-none tabular-nums"
            >
              {days}
            </span>
            <span className="text-white/80 text-[11px] font-semibold mt-1">
              {isExpired ? "days left" : days === 1 ? "day left" : "days left"}
            </span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="relative flex justify-center gap-2.5 mt-5">
        <TimeBox value={days} label="Days" />
        <TimeBox value={hours} label="Hours" />
        <TimeBox value={minutes} label="Mins" />
        <TimeBox value={seconds} label="Secs" />
      </div>

      {/* Linear progress */}
      <div className="relative mt-5">
        <div className="flex justify-between text-[11px] font-semibold text-white/85 mb-1.5">
          <span>
            {isExpired ? "Validity completed" : `Day ${dayOf} of ${totalDays}`}
          </span>
          <span>{Math.round(progress * 100)}% left</span>
        </div>
        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-white relative overflow-hidden"
            style={{
              width: mounted ? `${progress * 100}%` : "0%",
              transition: "width 1.4s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent vt-bar-shine" />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="relative grid grid-cols-2 gap-2.5 mt-4">
        <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2.5">
          <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
            <CalendarCheck2 size={11} /> Activated
          </p>
          <p className="text-white text-xs font-bold mt-0.5">
            {formatIST(activeDate || start)}
          </p>
        </div>
        <div className="bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-right">
          <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider flex items-center justify-end gap-1">
            <CalendarClock size={11} /> {isExpired ? "Expired" : "Expires"}
          </p>
          <p className="text-white text-xs font-bold mt-0.5">
            {formatIST(expiryDate)}
          </p>
        </div>
      </div>

      {isExpired && (
        <p className="relative text-center text-white text-xs font-semibold mt-4 bg-white/15 rounded-xl py-2">
          Your package has expired. Renew to continue earning.
        </p>
      )}

      <style>{styles}</style>
    </div>
  );
};

const styles = `
@keyframes vtTick {
  0% { transform: translateY(-70%) scale(0.85); opacity: 0; filter: blur(2px); }
  100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
}
.vt-tick { display: inline-block; animation: vtTick .4s cubic-bezier(.22,1,.36,1); }

@keyframes vtShine {
  0% { transform: translateX(-150%) skewX(-20deg); }
  60%, 100% { transform: translateX(400%) skewX(-20deg); }
}
.vt-shine { animation: vtShine 4.5s ease-in-out infinite; }

@keyframes vtBarShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.vt-bar-shine { animation: vtBarShine 1.8s linear infinite; }

@keyframes vtFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.vt-float { animation: vtFloat 3.2s ease-in-out infinite; }

@keyframes vtEnter {
  0% { opacity: 0; transform: translateY(12px) scale(.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.vt-enter { animation: vtEnter .6s cubic-bezier(.22,1,.36,1); }

@media (prefers-reduced-motion: reduce) {
  .vt-tick, .vt-shine, .vt-bar-shine, .vt-float, .vt-enter { animation: none; }
}
`;

export default ValidityTimer;
