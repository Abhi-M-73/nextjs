import { motion } from "framer-motion";
import {
  UserPlus,
  ChevronRight,
  Target,
  Wallet,
  Users,
  IndianRupee,
} from "lucide-react";

const HowItsWork = () => {
  const steps = [
    {
      step: "01",
      title: "Register",
      description:
        "Fill your Name, Mobile Number, Create Password and Sponsor ID to create your account on the platform.",
      icon: UserPlus,
      color: "from-orange-500 to-yellow-400",
      glowColor: "bg-orange-500/20",
      ring: "#F59E0B",
      features: ["Quick Sign Up", "Sponsor ID Required"],
    },
    {
      step: "02",
      title: "Activate ₹999",
      description:
        "Activate your ID with a one-time ₹999 package and instantly unlock SILVER rank along with the full income plan.",
      icon: Wallet,
      color: "from-purple-600 to-blue-500",
      glowColor: "bg-purple-500/20",
      ring: "#8B5CF6",
      features: ["Instant Activation", "90 Days Validity"],
    },
    {
      step: "03",
      title: "Refer & Earn",
      description:
        "Share your Sponsor ID with friends. Earn ₹100 per referral and build your team across 16 levels for level income.",
      icon: Users,
      color: "from-blue-500 to-cyan-400",
      glowColor: "bg-blue-500/20",
      ring: "#06B6D4",
      features: ["₹100 per Referral", "GOLD Rank at 10 Referrals"],
    },
    {
      step: "04",
      title: "Withdraw Earnings",
      description:
        "Once your balance crosses ₹700, request a withdrawal directly to your Bank Account or UPI ID.",
      icon: IndianRupee,
      color: "from-green-500 to-emerald-400",
      glowColor: "bg-green-500/20",
      ring: "#10B981",
      features: ["Min. Withdrawal ₹700", "Bank / UPI Transfer"],
    },
  ];

  return (
    <section
      id="how it works"
      className="relative px-6 py-32 bg-[#020203] overflow-hidden"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Load Inter */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            `}</style>

      {/* Background Texture & Subtle Glows */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- Header Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6"
          >
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-[0.2em]">
              Get Started
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight leading-[1.1]">
            Start Earning in <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Register, activate your ID, build your team, and start withdrawing
            your earnings — it's that simple.
          </p>
        </motion.div>

        {/* --- Steps Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[120px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="relative group w-full h-full"
            >
              {/* Outer Glow */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-[34px] blur opacity-10 group-hover:opacity-40 transition duration-700`}
              ></div>

              <div
                className="relative h-full bg-[#0f0f12]/90 border border-white/10 rounded-[32px] p-7 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all duration-500 group-hover:border-white/20 group-hover:-translate-y-1"
                style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              >
                {/* Internal Glow Blob */}
                <div
                  className={`absolute -top-24 -left-24 w-48 h-48 ${item.glowColor} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition duration-700`}
                />

                <div className="relative z-10 flex-1">
                  {/* Large Faded Background Number */}
                  <div
                    className="absolute -top-4 -right-2 text-8xl font-black leading-none pointer-events-none select-none transition-all duration-500"
                    style={{
                      WebkitTextStroke: "1px rgba(255,255,255,0.06)",
                      color: "transparent",
                    }}
                  >
                    {item.step}
                  </div>

                  {/* Icon Box */}
                  <div className="mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 p-[1.5px]`}
                    >
                      <div className="w-full h-full bg-[#0f0f12] rounded-2xl flex items-center justify-center">
                        <item.icon
                          className="w-6 h-6 text-white"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="text-xs uppercase tracking-[0.2em] font-bold mb-3 transition-colors"
                    style={{ color: `${item.ring}99` }}
                  >
                    Phase {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 mb-8 font-normal leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>

                <div className="relative z-10 bg-black/50 p-4 rounded-2xl border border-white/5 space-y-3 mt-auto">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`}
                      />
                      <span className="text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Animated Arrow between steps */}
              {index < 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="hidden lg:flex absolute top-[100px] -right-6 w-12 justify-center z-20"
                >
                  <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItsWork;
