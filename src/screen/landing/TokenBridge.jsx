import React from "react";
import { motion } from "framer-motion";
import { Zap, Users, ShieldCheck, Wallet, ArrowUpRight } from "lucide-react";

const TokenBridge = () => {
  // Actual Level-wise Income Plan
  const levelIncome = [
    { level: "L1", rate: "10 × 26", income: "₹260", team: 16 },
    { level: "L2", rate: "7 × 26", income: "₹182", team: 20 },
    { level: "L3", rate: "6 × 26", income: "₹156", team: 30 },
    { level: "L4", rate: "4 × 26", income: "₹104", team: 40 },
    { level: "L5", rate: "2 × 26", income: "₹52", team: 60 },
    { level: "L6", rate: "1 × 26", income: "₹26", team: 80 },
    { level: "L7", rate: "0.5 × 26", income: "₹13", team: 100 },
    { level: "L8", rate: "0.5 × 26", income: "₹13", team: 150 },
    { level: "L9", rate: "0.5 × 26", income: "₹13", team: 200 },
    { level: "L10", rate: "0.5 × 26", income: "₹13", team: 250 },
    { level: "L11", rate: "0.5 × 26", income: "₹13", team: 300 },
    { level: "L12", rate: "0.5 × 26", income: "₹13", team: 350 },
    { level: "L13", rate: "0.5 × 26", income: "₹13", team: 400 },
    { level: "L14", rate: "0.5 × 26", income: "₹13", team: 450 },
    { level: "L15", rate: "0.5 × 26", income: "₹13", team: 500 },
    { level: "L16", rate: "0.5 × 26", income: "₹13", team: 500 },
  ];

  const summaryCards = [
    {
      icon: Wallet,
      title: "Package",
      value: "₹999",
      desc: "One-time activation to unlock the full income plan.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Zap,
      title: "Cashback Income",
      value: "₹1,000",
      desc: "₹50 per day for 20 days, credited automatically.",
      color: "from-purple-500 to-pink-400",
    },
    {
      icon: Users,
      title: "Referral Income",
      value: "₹100",
      desc: "Per successful direct referral, credited instantly.",
      color: "from-emerald-500 to-teal-400",
    },
    {
      icon: ShieldCheck,
      title: "Level Income",
      value: "₹977",
      desc: "Total across 16 levels, calculated for 26 active days.",
      color: "from-orange-500 to-red-400",
    },
  ];

  return (
    <section
      id="plan"
      className="bg-[#020617] text-white py-24 px-6 lg:px-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/85/e4/64/85e464a5fee76804ab5b4275fc329466.jpg')] opacity-20 pointer-events-none bg-no-repeat bg-cover" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-indigo-400 font-mono text-sm mb-4"
            >
              <span className="h-[1px] w-8 bg-indigo-500"></span>
              ₹999 ACTIVATION PLAN
            </motion.div>
            <h2 className="text-5xl font-bold tracking-tighter leading-[0.9]">
              MAXIMIZE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                LEVEL INCOME
              </span>
            </h2>
          </div>
          <p className="text-gray-300 text-md max-w-sm border-l border-white/10 pl-6">
            16-level deep income structure with daily cashback and instant
            referral rewards — built for sustainable, long-term earning.
          </p>
        </div>

        {/* --- SUMMARY CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {summaryCards.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-px rounded-[2rem] overflow-hidden bg-white/5 hover:bg-white/10 transition-all shadow-2xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative bg-[#0b1120] rounded-[1.9rem] p-8 h-full flex flex-col justify-between border border-white/5">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <item.icon size={18} className="text-indigo-300" />
                    </div>
                    <ArrowUpRight
                      className="text-gray-300 group-hover:text-white transition-all transform group-hover:rotate-45"
                      size={18}
                    />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div
                  className={`text-4xl font-black mt-8 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}
                >
                  {item.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- BOTTOM DASHBOARD VIEW --- */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="lg:col-span-1 p-8 rounded-[2rem] bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col justify-center items-center text-center shadow-indigo-500/20 shadow-2xl"
          >
            <p className="text-indigo-100/80 font-medium mb-2 uppercase text-xs tracking-widest">
              Minimum Withdrawal
            </p>
            <h4 className="text-5xl font-black italic">₹700</h4>
            <p className="mt-4 text-sm text-indigo-100/70">
              Admin charge of 10% applies on every withdrawal request.
            </p>
          </motion.div>

          {/* Features Detail */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Zap size={18} className="text-indigo-400" />
                </div>
                <h5 className="font-bold">Rank & Upgrade</h5>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-indigo-500 rounded-full" /> Upon
                  Activation — SILVER Rank
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-indigo-500 rounded-full" /> After
                  10 Direct Referrals — GOLD Rank
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <ShieldCheck size={18} className="text-emerald-400" />
                </div>
                <h5 className="font-bold">Validity & Renewal</h5>
              </div>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-emerald-500 rounded-full" /> ID
                  Validity — 90 Days
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 bg-emerald-500 rounded-full" />{" "}
                  Renewal — ₹149 after 90 Days
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenBridge;
