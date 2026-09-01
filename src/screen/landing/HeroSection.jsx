// import { useEffect, useRef, useState } from "react";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ArrowRight, Zap, Globe, Activity } from "lucide-react";
// import MagneticButton from "../../components/all/MagneticButton";
// import heroImage from "../../assets/heroImage.png";

// export default function HeroSection() {
//   const containerRef = useRef(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end start"],
//   });

//   const centerVisualY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
//   const centerScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

//   return (
//     <section
//       ref={containerRef}
//       id="home"
//       className="relative w-full min-h-screen pt-28 pb-16 bg-[#040610] overflow-hidden flex flex-col justify-center"
//     >
//       {/* Ambient Blue Glow Gradients */}
//       <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[600px] bg-[#2563eb]/20 rounded-full blur-[160px] pointer-events-none" />
//       <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0a2472]/20 rounded-full blur-[140px] pointer-events-none" />

//       {/* 🔥 CENTRAL GLOWING CYBER JELLYFISH / NODE CORE */}
//       <motion.div
//         style={{ y: centerVisualY, scale: centerScale }}
//         className="absolute top-12 lg:top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[550px] lg:h-[700px] pointer-events-none select-none z-0 flex items-center justify-center opacity-70 lg:opacity-90"
//       >
//         <div className="relative w-full h-full flex items-center justify-center">
//           <img
//             src={heroImage}
//             alt="MinerGate Blue Core"
//             className="w-full max-w-[400px] h-auto object-contain mix-blend-screen filter drop-shadow-[0_0_80px_rgba(37,99,235,0.7)] animate-pulse"
//           />
//         </div>
//       </motion.div>

//       {/* MAIN CONTAINER GRID */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
//         <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

//           {/* ================= LEFT COLUMN ================= */}
//           <div className="lg:col-span-7 flex flex-col justify-center">

//             {/* Top Pill Badge */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#070c18] border border-[#2563eb]/40 text-[#60a5fa] text-xs font-heading font-semibold tracking-wide mb-6 backdrop-blur-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]"
//             >
//               <Zap className="w-3.5 h-3.5 text-[#2563eb]" />
//               <span className="uppercase text-[10px] tracking-widest">Start Your Investment</span>
//             </motion.div>

//             {/* Headline */}
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.05] tracking-tight"
//             >
//               Your Investment{" "}
//               <span className="hidden text-xs sm:text-sm font-normal text-slate-400 font-sans italic md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/5 align-middle mb-1">
//                 <span>From entry to rewards</span>
//               </span>
//               <br />
//               Activated Team
//               <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] via-[#60a5fa] to-[#0a2472]">
//                 On Demand
//               </span>
//             </motion.h1>

//             {/* Subtitle */}
//             <motion.p
//               initial={{ opacity: 0, y: 15 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.15, duration: 0.6 }}
//               className="mt-6 text-sm sm:text-base text-slate-300 font-sans font-normal leading-relaxed max-w-xl"
//             >
//               Activate your ₹999 package and unlock cashback income, referral rewards, rank benefits and level-wise income opportunities.
//             </motion.p>

//             {/* Two Pill CTA Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 15 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.25, duration: 0.6 }}
//               className="mt-8 flex flex-wrap items-center gap-4"
//             >
//               <a
//                 href="#how-it-works"
//                 className="px-6 py-3.5 rounded-full font-heading font-semibold text-xs text-slate-200 bg-[#070c18] hover:bg-[#0d1526] border border-white/20 hover:border-[#2563eb] backdrop-blur-xl transition-all duration-300 shadow-inner"
//               >
//                 View Income Plan
//               </a>

//               <Link to="/register">
//                 <MagneticButton className="px-7 py-3.5 rounded-full font-heading font-bold text-xs text-white bg-[#2563eb] shadow-[0_0_30px_rgba(37,99,235,0.85)] hover:shadow-[0_0_45px_rgba(37,99,235,1)] transition-all">
//                   <span className="flex items-center gap-2">
//                     <span>Activate ₹999 Package</span>
//                     <ArrowRight className="w-4 h-4" />
//                   </span>
//                 </MagneticButton>
//               </Link>
//             </motion.div>

//             {/* Bottom Stat Cards */}
//             <motion.div
//               initial={{ opacity: 0, y: 25 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.35, duration: 0.6 }}
//               className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5"
//             >
//               <div className="p-4 rounded-2xl bg-[#070c18]/80 border border-[#2563eb]/30 backdrop-blur-xl hover:border-[#2563eb] transition-all group">
//                 <p className="text-[11px] font-sans font-medium text-slate-400">Package Activation</p>
//                 <div className="mt-2 flex items-baseline justify-between">
//                   <span className="text-2xl sm:text-3xl font-heading font-black text-white">₹999</span>
//                   <div className="flex -space-x-1.5">
//                     {[14, 22, 45].map((id) => (
//                       <img
//                         key={id}
//                         src={`https://i.pravatar.cc/50?img=${id}`}
//                         alt="user"
//                         className="w-5 h-5 rounded-full border border-black object-cover"
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 <p className="mt-1 text-[10px] text-slate-400">90 Days Validity</p>
//               </div>

//               <div className="p-4 rounded-2xl bg-[#070c18]/80 border border-[#2563eb]/30 backdrop-blur-xl hover:border-[#2563eb] transition-all group">
//                 <p className="text-[11px] font-sans font-medium text-slate-400">Cashback Income</p>
//                 <div className="mt-2 flex items-baseline justify-between">
//                   <span className="text-xl sm:text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 whitespace-nowrap">
//                     ₹1,000
//                   </span>
//                   <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
//                     20 DAYS
//                   </span>
//                 </div>
//                 <p className="mt-1 text-[10px] text-slate-400">₹50 × 20 Active Days</p>
//               </div>

//               <div className="p-4 rounded-2xl bg-[#070c18]/80 border border-[#2563eb]/30 backdrop-blur-xl hover:border-[#2563eb] transition-all group">
//                 <p className="text-[11px] font-sans font-medium text-slate-400"> Referral Income</p>
//                 <div className="mt-2 flex items-baseline justify-between">
//                   <span className="text-2xl sm:text-3xl font-heading font-black text-[#60a5fa]">
//                     ₹100
//                   </span>
//                   <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
//                     DIRECT
//                   </span>
//                 </div>
//                 <p className="mt-1 text-[10px] text-slate-400"> Per Successful Referral</p>
//               </div>
//             </motion.div>

//           </div>

//           {/* ================= RIGHT COLUMN ================= */}
//           <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex flex-col gap-4">

//             <div className="hidden xl:flex absolute -left-12 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-20">
//               <a
//                 href="https://x.com"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="w-9 h-9 rounded-xl bg-[#070c18]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#2563eb] transition-all backdrop-blur-xl text-xs font-bold"
//               >
//                 𝕏
//               </a>
//               <a
//                 href="#hero"
//                 className="w-9 h-9 rounded-xl bg-[#070c18]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#2563eb] transition-all backdrop-blur-xl"
//               >
//                 <Globe className="w-4 h-4 text-[#2563eb]" />
//               </a>
//               <a
//                 href="#hero"
//                 className="w-9 h-9 rounded-xl bg-[#070c18]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#2563eb] transition-all backdrop-blur-xl"
//               >
//                 <Activity className="w-4 h-4 text-cyan-400" />
//               </a>
//             </div>

//             {/* TOP RIGHT CARD */}
//             <motion.div
//               initial={{ opacity: 0, x: 25 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="p-6 rounded-3xl bg-[#070c18]/85 border border-[#2563eb]/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group"
//             >
//               <div className="flex items-center justify-between pb-4 border-b border-white/10">
//                 <span className="text-xs font-heading font-bold text-slate-300">BiNext</span>
//                 <span className="text-sm font-bold text-slate-500 font-mono">₹999</span>
//               </div>

//               <div className="mt-4 relative h-40 rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
//                 <img
//                   src="https://i.pinimg.com/736x/3e/3c/ba/3e3cba8d5c72997ed20e393feda5faeb.jpg"
//                   alt="Validator Node"
//                   className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#070c18] via-transparent to-transparent" />
//                 <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white bg-[#2563eb]/80 px-2 py-0.5 rounded backdrop-blur-md">
//                   ₹999 PACKAGE
//                 </span>
//               </div>

//               <h3 className="text-3xl font-heading font-black text-white">
//                 ₹1,000
//               </h3>

//               <p className="text-xs text-slate-400 mt-0.5">
//                 Cashback over 20 active days
//               </p>
//             </motion.div>

//             {/* BOTTOM RIGHT CARD */}
//             <motion.div
//               initial={{ opacity: 0, x: 25 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.35 }}
//               className="p-6 rounded-3xl bg-[#070c18]/85 border border-[#2563eb]/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden"
//             >
//               <div className="flex items-baseline justify-between">
//                 <h3 className="text-4xl font-heading font-black text-white">Silver → Gold</h3>
//                 <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
//                   Progression
//                 </span>
//               </div>

//               <p className="text-xs text-slate-400 mt-1">
//               Activation & Rank Benefits
//               </p>

//               <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-300 text-center">
//                 <div className="p-2 rounded-xl bg-white/5 border border-white/10">Silver Rank</div>
//                 <div className="p-2 rounded-xl bg-white/5 border border-white/10">10 Directs</div>
//                 <div className="p-2 rounded-xl bg-white/5 border border-white/10">Gold Rank</div>
//               </div>

//               <div className="mt-5">
//                 <Link to="/register">
//                   <MagneticButton className="w-full py-3 rounded-full font-heading font-bold text-xs text-white bg-[#2563eb] shadow-[0_0_20px_rgba(37,99,235,0.7)] hover:shadow-[0_0_30px_rgba(37,99,235,0.9)] transition-all">
//                     <span>Activate ₹999 Package</span>
//                   </MagneticButton>
//                 </Link>
//               </div>
//             </motion.div>

//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Wallet,
  Users,
  ShieldCheck,
  TrendingUp,
  Clock,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import MagneticButton from "../../components/all/MagneticButton";
import heroImage from "../../assets/heroImage2.png";
import cardBg from "../../assets/cardBg.jpg";

export default function HeroSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroVisualY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroVisualScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const featureIcons = [
    {
      icon: Wallet,
      title: "Cashback Income",
      desc: "Earn assured cashback on every activation.",
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Referral Rewards",
      desc: "Earn ₹100 on every direct referral.",
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      icon: ShieldCheck,
      title: "Rank Benefits",
      desc: "Achieve ranks and unlock premium rewards.",
      bg: "bg-orange-100",
      color: "text-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Level Income",
      desc: "Earn level-wise income as your team grows.",
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  const statCards = [
    {
      icon: "https://img.icons8.com/3d-fluency/94/empty-box.png",
      iconBg: "bg-purple-100",
      label: "Package Activation",
      labelColor: "text-purple-600",
      value: "₹1199",
      sub: "70 Days Validity",
      showAvatars: true,
      bg: cardBg,
    },
    {
      icon: "https://img.icons8.com/3d-fluency/94/transaction.png",
      iconBg: "bg-emerald-100",
      label: "Cashback Income",
      labelColor: "text-emerald-600",
      value: "₹1,000",
      sub: "₹50 × 20 Active Days",
      badge: "20 DAYS",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
      bg: cardBg,
    },
    {
      icon: "https://img.icons8.com/3d-fluency/94/group--v3.png",
      iconBg: "bg-blue-100",
      label: "Referral Rewards",
      labelColor: "text-blue-600",
      value: "₹100",
      sub: "On Every Direct Referral",
      badge: "PER REFERRAL",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-300",
      bg: cardBg,
    },
  ];

  const trustItems = [
    {
      icon: "https://img.icons8.com/3d-fluency/1200/security-checked.jpg",
      title: "Secure & Transparent",
      desc: "Safe and reliable platform",
      color: "text-blue-600",
    },
    {
      icon: "https://img.icons8.com/3d-fluency/1200/verified-account.jpg",
      title: "Trusted by Thousands",
      desc: "Growing community",
      color: "text-emerald-600",
    },
    {
      icon: "https://img.icons8.com/3d-fluency/1200/alarm-clock--v2.jpg",
      title: "Timely Payouts",
      desc: "Fast & secure payments",
      color: "text-purple-600",
    },
    {
      icon: "https://img.icons8.com/3d-fluency/1200/chatbot.jpg",
      title: "24/7 Support",
      desc: "We're here to help",
      color: "text-orange-500",
    },
  ];

  return (
    <>
      <section
        ref={containerRef}
        id="home"
        className="relative w-full min-h-screen pt-20 bg-gradient-to-b from-[#f5f6f9] via-white to-[#d6e2f9] overflow-hidden"
      >
        {/* Ambient soft glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top hero: headline + visual */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: text content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-slate-900 leading-[1.1] tracking-tight"
              >
                Build Your Team.
                <br />
                Grow Together.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500">
                  With a Fixed & Structured Plan.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mt-6 text-sm sm:text-base text-slate-600 font-sans leading-relaxed max-w-xl"
              >
                Activate your ₹999 package and unlock cashback income, referral
                rewards, rank benefits and level-wise income opportunities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mt-6 inline-flex items-center gap-3 self-start px-4 py-2.5 rounded-2xl bg-white border border-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
              >
                <span className="text-[10px] font-heading font-black text-white bg-gradient-to-r from-rose-600 to-orange-500 px-2.5 py-1 rounded-lg uppercase tracking-wider whitespace-nowrap">
                  Limited-Time
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-400 line-through font-sans">
                    ₹1,199
                  </span>
                  <span className="text-lg font-heading font-black text-emerald-600">
                    ₹999
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    OFFER
                  </span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: hero visual */}
            <motion.div
              style={{ y: heroVisualY, scale: heroVisualScale }}
              className="lg:col-span-5 relative flex items-center justify-center mt-8 lg:mt-0"
            >
              <img
                src={heroImage}
                alt="BiNext Growth Core"
                className="w-full max-w-[600px] h-auto object-contain "
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-4 bg-[#d6e2f9] md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-slate-100 rounded-3xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100"
        >
          {featureIcons.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center px-2 pt-4 sm:pt-0 first:pt-0"
            >
              <div
                className={`w-14 h-14 rounded-full ${f.bg} flex items-center justify-center mb-3`}
              >
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h4 className="text-sm font-heading font-bold text-slate-900">
                {f.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {f.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Stat cards */}
        <div className="mt-6 space-y-4">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative overflow-hidden flex items-center gap-4 border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.05)] p-5 sm:p-6"
            >
              {/* Background image — forced to fill via inline style */}
              <img
                src={card.bg}
                alt=""
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />

              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" />

              <div
                className={`relative z-10 w-14 h-14 shrink-0 rounded-2xl ${card.iconBg} flex items-center justify-center text-2xl`}
              >
                <img src={card.icon} alt="icon" className="h-12 w-12" />
              </div>

              <div className="relative z-10 flex-1 min-w-0">
                <p
                  className={`text-sm font-heading font-bold ${card.labelColor}`}
                >
                  {card.label}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                    {card.value}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
              </div>

              {card.showAvatars && (
                <div className="relative z-10 hidden sm:flex -space-x-2">
                  {[14, 22, 45].map((id) => (
                    <img
                      key={id}
                      src={`https://i.pravatar.cc/50?img=${id}`}
                      alt="user"
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              )}

              {card.badge && (
                <span
                  className={`relative z-10 hidden sm:inline-flex text-[10px] font-bold px-3 py-1 rounded-full border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 bg-white border border-slate-100 rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.05)] p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {trustItems.map((t, i) => (
            <div key={i} className="flex items-center justify-center gap-3">
              <img
                src={t.icon}
                alt="icon"
                className={`w-10 h-10 shrink-0 ${t.color}`}
              />
              <div className="min-w-0 text-start">
                <p className="text-xs font-heading font-bold text-slate-800 truncate">
                  {t.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{t.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
