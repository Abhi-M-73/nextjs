import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const sections = [
  {
    label: "STEP 01",
    title: "Activate Your ID With Just ₹999 And Unlock The Full Income Plan",
    text: "Getting started is simple — activate your account with a one-time ₹999 package and instantly unlock access to cashback income, referral rewards, and a 16-level deep earning structure. Upon activation, you're assigned SILVER rank, with your ID valid for 90 days from the date of joining.",
    accent: "#8B5CF6",
  },
  {
    label: "STEP 02",
    title: "Earn ₹1,000 Guaranteed Cashback Over Your First 20 Active Days",
    text: "Every activated member receives ₹50 per day as cashback income for 20 days, totalling ₹1,000. This is credited automatically to your account, giving you a steady, predictable return right from day one — no referrals required to start earning.",
    accent: "#06B6D4",
  },
  {
    label: "STEP 03",
    title:
      "Refer Friends And Earn ₹100 Instantly For Every Successful Referral",
    text: "Share your Sponsor ID and earn ₹100 for every person who joins through you. Referral income is credited instantly on successful activation. Bring in 10 direct referrals and your rank automatically upgrades from SILVER to GOLD, unlocking higher recognition in the network.",
    accent: "#F59E0B",
  },
  {
    label: "STEP 04",
    title: "Build Depth Across 16 Levels And Earn ₹977 In Level Income",
    text: "Your network grows beyond direct referrals — earn from 16 levels deep, from ₹260 at Level 1 down to ₹13 at Level 16, totalling ₹977 in level income. This income is calculated over 26 active days in a 30-day cycle, with every Sunday off.",
    accent: "#10B981",
  },
  {
    label: "STEP 05",
    title:
      "Withdraw Anytime With Just ₹700 Minimum And Simple Bank Or UPI Transfer",
    text: "Once your balance crosses ₹700, you can request a withdrawal directly to your bank account or UPI ID. A flat 10% admin charge applies on every withdrawal. Keep your ID active by renewing for ₹149 after every 90 days to continue earning without interruption.",
    accent: "#EC4899",
  },
];

const EcosystemSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // smoother rotation
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, -360]), {
    stiffness: 50,
    damping: 20,
  });

  return (
    <div
      id="ecosystem"
      ref={containerRef}
      className="relative bg-[#020203]"
      style={{
        height: `${sections.length * 100}vh`,
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Load Inter */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            `}</style>

      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[140px]" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* PREMIUM WHEEL */}
        <motion.div
          style={{ rotate }}
          className="absolute left-[-140px] md:left-[-220px] top-1/2 -translate-y-1/2 w-[380px] h-[380px] md:w-[640px] md:h-[640px]"
        >
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-[90px]" />

          {/* Outer Ring */}
          <div className="absolute inset-0 border border-white/10 rounded-full" />

          {/* Dashed ring for texture */}
          <div className="absolute inset-6 md:inset-8 border border-dashed border-white/[0.06] rounded-full" />

          {/* Inner Ring */}
          <div className="absolute inset-12 md:inset-16 border border-white/5 rounded-full" />

          {/* Tick marks */}
          {Array.from({ length: 24 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute inset-0 flex justify-center"
              style={{ transform: `rotate(${idx * 15}deg)` }}
            >
              <div
                className={`w-[1px] ${
                  idx % 6 === 0 ? "h-3 bg-white/25" : "h-1.5 bg-white/10"
                }`}
              />
            </div>
          ))}

          {/* Spokes with accent-colored tips */}
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `rotate(${idx * (360 / sections.length)}deg)`,
              }}
            >
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div
                className="absolute top-0 w-2 h-2 rounded-full -translate-y-1/2"
                style={{
                  background: section.accent,
                  boxShadow: `0 0 12px ${section.accent}`,
                }}
              />
            </div>
          ))}

          {/* Center Glow */}
          <div className="absolute inset-[130px] md:inset-[220px] rounded-full bg-gradient-to-br from-purple-500/25 to-cyan-500/10 blur-xl" />

          {/* Center Core */}
          <div className="absolute inset-[140px] md:inset-[230px] rounded-full bg-[#0b0b0f] border border-white/10 flex items-center justify-center">
            <span className="text-[10px] md:text-xs tracking-[0.3em] text-white/30 font-semibold">
              PLAN
            </span>
          </div>
        </motion.div>

        {/* Progress rail (right side, desktop only) */}
        <div className="hidden lg:flex flex-col gap-5 absolute right-10 top-1/2 -translate-y-1/2 z-20">
          {sections.map((section, i) => {
            const start = i / sections.length;
            const end = (i + 1) / sections.length;
            const mid = (start + end) / 2;

            const scale = useSpring(
              useTransform(scrollYProgress, [start, mid, end], [0.6, 1.4, 0.6]),
              { stiffness: 120, damping: 20 },
            );
            const dotOpacity = useSpring(
              useTransform(scrollYProgress, [start, mid, end], [0.25, 1, 0.25]),
              { stiffness: 120, damping: 20 },
            );

            return (
              <motion.div
                key={i}
                style={{ scale, opacity: dotOpacity }}
                className="w-2.5 h-2.5 rounded-full"
                data-index={i}
              >
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: section.accent,
                    boxShadow: `0 0 10px ${section.accent}`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="relative ml-[150px] md:ml-[460px] px-4 md:px-0 w-full max-w-4xl z-10">
          {sections.map((section, i) => {
            const start = i / sections.length;
            const end = (i + 1) / sections.length;

            const opacity = useSpring(
              useTransform(
                scrollYProgress,
                [start, start + 0.1, end - 0.1, end],
                [0, 1, 1, 0],
              ),
              { stiffness: 80, damping: 20 },
            );

            const y = useSpring(
              useTransform(
                scrollYProgress,
                [start, start + 0.1, end],
                [60, 0, -60],
              ),
              { stiffness: 80, damping: 20 },
            );

            return (
              <motion.div
                key={i}
                style={{ opacity, y }}
                className="absolute top-1/2 md:left-20 -left-20 -translate-y-1/2 w-full max-w-2xl"
              >
                {/* Giant faded step numeral (signature element) */}
                <div
                  className="absolute -top-16 md:-top-24 -left-4 md:left-0 text-[100px] md:text-[160px] font-black leading-none pointer-events-none select-none"
                  style={{
                    WebkitTextStroke: `1px ${section.accent}22`,
                    color: "transparent",
                  }}
                >
                  {section.label.replace("STEP ", "")}
                </div>

                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-6 md:p-10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.6)]">
                  {/* Accent bar */}
                  <div
                    className="w-14 h-[3px] mb-6 rounded-full"
                    style={{
                      background: section.accent,
                      boxShadow: `0 0 12px ${section.accent}`,
                    }}
                  />

                  {/* Label */}
                  <p
                    className="text-xs font-bold tracking-[0.35em] mb-4 uppercase"
                    style={{ color: section.accent }}
                  >
                    {section.label}
                  </p>

                  {/* Title */}
                  <h2 className="text-2xl md:text-5xl font-extrabold text-white mb-5 leading-[1.15] tracking-tight">
                    {section.title}
                  </h2>

                  {/* Desc */}
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-8 font-normal max-w-xl">
                    {section.text}
                  </p>

                  {/* Button */}
                  <button
                    className="group px-6 py-2.5 border text-sm font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:text-black inline-flex items-center gap-2"
                    style={{
                      borderColor: section.accent,
                      color: section.accent,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = section.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Explore
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EcosystemSection;
