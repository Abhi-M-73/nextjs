
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Globe, Activity } from "lucide-react";
import MagneticButton from "../../components/all/MagneticButton";
import heroImage from "../../assets/heroImage.png";

export default function HeroSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const centerVisualY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const centerScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full min-h-screen pt-28 pb-16 bg-[#040610] overflow-hidden flex flex-col justify-center"
    >
      {/* Ambient Blue Glow Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[600px] bg-[#2563eb]/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0a2472]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* 🔥 CENTRAL GLOWING CYBER JELLYFISH / NODE CORE */}
      <motion.div
        style={{ y: centerVisualY, scale: centerScale }}
        className="absolute top-12 lg:top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[550px] lg:h-[700px] pointer-events-none select-none z-0 flex items-center justify-center opacity-70 lg:opacity-90"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={heroImage}
            alt="MinerGate Blue Core"
            className="w-full max-w-[400px] h-auto object-contain mix-blend-screen filter drop-shadow-[0_0_80px_rgba(37,99,235,0.7)] animate-pulse"
          />
        </div>
      </motion.div>

      {/* MAIN CONTAINER GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#070c18] border border-[#2563eb]/40 text-[#60a5fa] text-xs font-heading font-semibold tracking-wide mb-6 backdrop-blur-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <Zap className="w-3.5 h-3.5 text-[#2563eb]" />
              <span className="uppercase text-[10px] tracking-widest">Start Your Investment</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.05] tracking-tight"
            >
              Your Investment{" "}
              <span className="hidden text-xs sm:text-sm font-normal text-slate-400 font-sans italic md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/5 align-middle mb-1">
                <span>From entry to rewards</span>
              </span>
              <br />
              Activated Team
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#0a2472]">
                On Demand
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 text-sm sm:text-base text-slate-300 font-sans font-normal leading-relaxed max-w-xl"
            >
              Activate your ₹999 package and unlock cashback income, referral rewards, rank benefits and level-wise income opportunities.
            </motion.p>

            {/* Two Pill CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#how-it-works"
                className="px-6 py-3.5 rounded-full font-heading font-semibold text-xs text-slate-200 bg-[#070c18] hover:bg-[#0d1526] border border-white/20 hover:border-[#2563eb] backdrop-blur-xl transition-all duration-300 shadow-inner"
              >
                View Income Plan
              </a>

              <Link to="/register">
                <MagneticButton className="px-7 py-3.5 rounded-full font-heading font-bold text-xs text-white bg-[#2563eb] shadow-[0_0_30px_rgba(37,99,235,0.85)] hover:shadow-[0_0_45px_rgba(37,99,235,1)] transition-all">
                  <span className="flex items-center gap-2">
                    <span>Activate ₹999 Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </MagneticButton>
              </Link>
            </motion.div>

            {/* Bottom Stat Cards */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5"
            >
              <div className="p-4 rounded-2xl bg-[#070c18]/80 border border-[#2563eb]/30 backdrop-blur-xl hover:border-[#2563eb] transition-all group">
                <p className="text-[11px] font-sans font-medium text-slate-400">Package Activation</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-heading font-black text-white">₹999</span>
                  <div className="flex -space-x-1.5">
                    {[14, 22, 45].map((id) => (
                      <img
                        key={id}
                        src={`https://i.pravatar.cc/50?img=${id}`}
                        alt="user"
                        className="w-5 h-5 rounded-full border border-black object-cover"
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">90 Days Validity</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070c18]/80 border border-[#2563eb]/30 backdrop-blur-xl hover:border-[#2563eb] transition-all group">
                <p className="text-[11px] font-sans font-medium text-slate-400">Cashback Income</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 whitespace-nowrap">
                    ₹1,000
                  </span>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    20 DAYS
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">₹50 × 20 Active Days</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070c18]/80 border border-[#2563eb]/30 backdrop-blur-xl hover:border-[#2563eb] transition-all group">
                <p className="text-[11px] font-sans font-medium text-slate-400"> Referral Income</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-heading font-black text-[#60a5fa]">
                    ₹100
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    DIRECT
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400"> Per Successful Referral</p>
              </div>
            </motion.div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex flex-col gap-4">

            <div className="hidden xl:flex absolute -left-12 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-20">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#070c18]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#2563eb] transition-all backdrop-blur-xl text-xs font-bold"
              >
                𝕏
              </a>
              <a
                href="#hero"
                className="w-9 h-9 rounded-xl bg-[#070c18]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#2563eb] transition-all backdrop-blur-xl"
              >
                <Globe className="w-4 h-4 text-[#2563eb]" />
              </a>
              <a
                href="#hero"
                className="w-9 h-9 rounded-xl bg-[#070c18]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#2563eb] transition-all backdrop-blur-xl"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
              </a>
            </div>

            {/* TOP RIGHT CARD */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-3xl bg-[#070c18]/85 border border-[#2563eb]/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-heading font-bold text-slate-300">BiNext</span>
                <span className="text-sm font-bold text-slate-500 font-mono">₹999</span>
              </div>

              <div className="mt-4 relative h-40 rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                <img
                  src="https://i.pinimg.com/736x/3e/3c/ba/3e3cba8d5c72997ed20e393feda5faeb.jpg"
                  alt="Validator Node"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c18] via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white bg-[#2563eb]/80 px-2 py-0.5 rounded backdrop-blur-md">
                  ₹999 PACKAGE
                </span>
              </div>

              <h3 className="text-3xl font-heading font-black text-white">
                ₹1,000
              </h3>

              <p className="text-xs text-slate-400 mt-0.5">
                Cashback over 20 active days
              </p>
            </motion.div>

            {/* BOTTOM RIGHT CARD */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="p-6 rounded-3xl bg-[#070c18]/85 border border-[#2563eb]/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-4xl font-heading font-black text-white">Silver → Gold</h3>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  Progression
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1">
              Activation & Rank Benefits
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-300 text-center">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">Silver Rank</div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">10 Directs</div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">Gold Rank</div>
              </div>

              <div className="mt-5">
                <Link to="/register">
                  <MagneticButton className="w-full py-3 rounded-full font-heading font-bold text-xs text-white bg-[#2563eb] shadow-[0_0_20px_rgba(37,99,235,0.7)] hover:shadow-[0_0_30px_rgba(37,99,235,0.9)] transition-all">
                    <span>Activate ₹999 Package</span>
                  </MagneticButton>
                </Link>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}