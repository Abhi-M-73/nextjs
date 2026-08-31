import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Coins, Activity, Info, Wallet, Users } from "lucide-react";

const StatsSection = () => {
  return (
    <section id="about" className="relative px-6 py-16 bg-gray-50 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-400/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT SIDE - INFO */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl lg:sticky lg:top-28"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 mb-6">
              <Info className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Discover More</span>
            </div>

            <h2 className="text-4xl md:text-7xl font-semibold mb-6 text-slate-900">
              What is <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Our Platform?
              </span>
            </h2>

            <div className="space-y-6 text-slate-500 font-light leading-relaxed text-[17px]">
              <p>
                Our platform is designed to give every member a simple, transparent
                experience — combining an easy setup, responsive support, and clear
                visibility into everything that matters to you.
              </p>
              <p>
                No hidden steps involved — every feature is documented, accessible,
                and available on demand, so you always know exactly what you're
                getting and how to use it.
              </p>
            </div>

            <div className="mt-10 flex gap-8 border-t border-slate-200 pt-8">
              <div>
                <p className="text-sm text-slate-400 mb-1">Setup</p>
                <p className="font-bold text-slate-900">One-Time</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Account Validity</p>
                <p className="font-bold text-slate-900">90 Days</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-xs text-slate-500 mt-10">
              <div>
                <span className="block text-slate-400 mb-1">Onboarding Time</span>
                <span className="text-slate-900 font-medium">5 Minutes</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">Features Included</span>
                <span className="text-slate-900 font-medium">16+ Tools</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">Support Days / Month</span>
                <span className="text-slate-900 font-medium">26 Days</span>
              </div>
              <div>
                <span className="block text-slate-400 mb-1">Renewal Cost</span>
                <span className="text-slate-900 font-medium">₹149</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - CARDS */}
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {/* Card 1 */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group h-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-[34px] blur opacity-0 group-hover:opacity-20 transition duration-700" />

              <div className="relative bg-white border border-slate-200 rounded-[32px] p-8 h-full flex flex-col shadow-[0_4px_24px_rgba(15,23,42,0.05)] group-hover:shadow-[0_10px_40px_rgba(15,23,42,0.1)] transition-shadow duration-500">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-200/40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-200">
                        <TrendingUp size={18} />
                      </div>
                      <span className="text-slate-700 font-medium">Feature Overview</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full text-emerald-700 bg-emerald-50">
                      Fully Included
                    </span>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex-1">
                    <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-purple-500 flex items-center justify-center">
                        <Coins className="text-white w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg">Starter Package</h4>
                        <p className="text-xs text-slate-400">Included on Sign Up</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Setup Cost</p>
                        <p className="text-xl font-bold text-slate-900">Free</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 mt-6">
                      <div>
                        <span className="block text-slate-400 mb-1">Onboarding</span>
                        <span className="text-slate-900 font-medium">Guided</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 mb-1">Support</span>
                        <span className="text-slate-900 font-medium">24/7</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 mb-1">Tools Included</span>
                        <span className="text-slate-900 font-medium">16+</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 mb-1">Upgrade Path</span>
                        <span className="text-slate-900 font-medium">Anytime</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative group h-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-[34px] blur opacity-0 group-hover:opacity-20 transition duration-700" />

              <div className="relative bg-white border border-slate-200 rounded-[32px] p-8 h-full flex flex-col shadow-[0_4px_24px_rgba(15,23,42,0.05)] group-hover:shadow-[0_10px_40px_rgba(15,23,42,0.1)] transition-shadow duration-500">
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-200/40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative z-10 flex-1 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">Account & Access</span>
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex-1">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Minimum Payout</p>
                        <p className="text-slate-900 font-medium">₹700</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Service Fee</p>
                        <p className="text-slate-900 font-medium">10%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Account Validity</p>
                        <p className="text-slate-900 font-medium">90 Days</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-1">Renewal Fee</p>
                        <p className="text-slate-900 font-medium">₹149</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 flex items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Payout Mode</p>
                        <p className="text-sm font-medium text-slate-900">Bank / UPI</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-xs text-purple-600 mb-1">Support Off</p>
                        <p className="text-sm font-medium text-slate-900">Every Sunday</p>
                      </div>
                      <Users className="w-5 h-5 text-purple-600" />
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