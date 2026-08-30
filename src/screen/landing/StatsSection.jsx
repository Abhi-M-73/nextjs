import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Coins, Activity, Info, Wallet, Users } from "lucide-react";

const StatsSection = () => {
  return (
    <section
      id="about"
      className="relative px-6 py-20 bg-[#020203] overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* ==================== LEFT SIDE - INFO ==================== */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl lg:sticky lg:top-28"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Info className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Discover The Plan
              </span>
            </div>

            <h2 className="text-4xl md:text-7xl font-semibold mb-6 text-white ">
              What is <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                The ₹999 Plan?
              </span>
            </h2>

            <div className="space-y-6 text-gray-400 font-light leading-relaxed text-[17px]">
              <p>
                Our ₹999 activation plan is designed to give every member a
                simple, transparent way to earn — combining guaranteed daily
                cashback, instant referral rewards, and deep level income across
                a 16-tier network.
              </p>
              <p>
                There's no market speculation involved — every payout is fixed,
                calculated, and credited on schedule, so you always know exactly
                what you're earning and when.
              </p>
            </div>

            {/* Quick Info */}
            <div className="mt-10 flex gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Package</p>
                <p className="font-bold text-white">₹999 One-Time</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">ID Validity</p>
                <p className="font-bold text-white">90 Days</p>
              </div>
            </div>

            {/* Small Stats Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-xs text-gray-400 mt-10">
              <div>
                <span className="block text-gray-500 mb-1">
                  Cashback Period
                </span>
                <span className="text-white font-medium">20 Days</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Levels Deep</span>
                <span className="text-white font-medium">16 Levels</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">
                  Active Days / Month
                </span>
                <span className="text-white font-medium">26 Days</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Renewal Cost</span>
                <span className="text-white font-medium">₹149</span>
              </div>
            </div>
          </motion.div>

          {/* ==================== RIGHT SIDE - CARDS ==================== */}
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {/* Card 1 - Earning Overview */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group h-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-yellow-500 rounded-[34px] blur opacity-20 group-hover:opacity-40 transition duration-700" />

              <div className="relative bg-[#0f0f12]/90 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl h-full flex flex-col">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                        <TrendingUp size={18} />
                      </div>
                      <span className="text-gray-300 font-medium">
                        Earning Overview
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full text-green-400 bg-green-400/10">
                      Fixed Payouts
                    </span>
                  </div>

                  <div className="bg-black/50 p-6 rounded-2xl border border-white/5 flex-1">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-purple-500 flex items-center justify-center">
                        <Coins className="text-white w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg">
                          Activation Package
                        </h4>
                        <p className="text-xs text-gray-400">
                          SILVER Rank on Join
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">
                          Package Price
                        </p>
                        <p className="text-xl font-bold text-white">₹999</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mt-6">
                      <div>
                        <span className="block text-gray-500 mb-1">
                          Cashback Income
                        </span>
                        <span className="text-white font-medium">₹1,000</span>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">
                          Referral Income
                        </span>
                        <span className="text-white font-medium">
                          ₹100 / Referral
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">
                          Level Income (Total)
                        </span>
                        <span className="text-white font-medium">₹977</span>
                      </div>
                      <div>
                        <span className="block text-gray-500 mb-1">
                          Rank Upgrade
                        </span>
                        <span className="text-white font-medium">
                          GOLD @ 10 Referrals
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 - Withdrawal Stats */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative group h-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-[34px] blur opacity-20 group-hover:opacity-40 transition duration-700" />

              <div className="relative bg-[#0f0f12]/90 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl h-full flex flex-col">
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative z-10 flex-1 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">
                      Withdrawal & Validity
                    </span>
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>

                  <div className="bg-black/50 p-6 rounded-2xl border border-white/5 flex-1">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">
                          Minimum Withdrawal
                        </p>
                        <p className="text-white font-medium">₹700</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">
                          Admin Charge
                        </p>
                        <p className="text-white font-medium">10%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">
                          ID Validity
                        </p>
                        <p className="text-white font-medium">90 Days</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">
                          Renewal Fee
                        </p>
                        <p className="text-white font-medium">₹149</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Payout Mode
                        </p>
                        <p className="text-sm font-medium text-white">
                          Bank / UPI
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-xs text-purple-400 mb-1">
                          Weekly Off
                        </p>
                        <p className="text-sm font-medium text-white">
                          Every Sunday
                        </p>
                      </div>
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
