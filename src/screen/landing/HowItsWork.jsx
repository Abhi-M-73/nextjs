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
      title: "Sign Up",
      description: "Create your account with your basic details in under a minute.",
      icon: UserPlus,
      color: "from-orange-500 to-yellow-400",
      glowColor: "bg-orange-500/10",
      ring: "#F59E0B",
      features: ["Quick Sign Up", "Simple Form"],
    },
    {
      step: "02",
      title: "Verify Account",
      description: "Confirm your details to unlock full access to the platform.",
      icon: Wallet,
      color: "from-purple-600 to-blue-500",
      glowColor: "bg-purple-500/10",
      ring: "#8B5CF6",
      features: ["Instant Verification", "Secure Process"],
    },
    {
      step: "03",
      title: "Explore Features",
      description: "Browse tools and options tailored to what you need.",
      icon: Users,
      color: "from-blue-500 to-cyan-400",
      glowColor: "bg-blue-500/10",
      ring: "#06B6D4",
      features: ["Guided Tour", "Personalized Setup"],
    },
    {
      step: "04",
      title: "Get Started",
      description: "Start using the platform with full access to all features.",
      icon: IndianRupee,
      color: "from-green-500 to-emerald-400",
      glowColor: "bg-green-500/10",
      ring: "#10B981",
      features: ["24/7 Support", "Full Access"],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative px-6 py-20 bg-white overflow-hidden"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.6] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 border border-slate-200 backdrop-blur-md mb-6"
          >
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-[0.2em]">
              Get Started
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 tracking-tight leading-[1.1]">
            Get Started in <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Sign up, verify your account, explore features, and get started — it's that simple.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-[120px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent z-0" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
              className="relative group w-full h-full"
            >
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-[34px] blur opacity-0 group-hover:opacity-20 transition duration-700`}
              ></div>

              <div className="relative h-full bg-white border border-slate-200 rounded-[32px] p-7 overflow-hidden flex flex-col justify-between transition-all duration-500 shadow-[0_4px_20px_rgba(15,23,42,0.04)] group-hover:shadow-[0_10px_40px_rgba(15,23,42,0.1)] group-hover:-translate-y-1">
                <div
                  className={`absolute -top-24 -left-24 w-48 h-48 ${item.glowColor} rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition duration-700`}
                />

                <div className="relative z-10 flex-1">
                  <div
                    className="absolute -top-4 -right-2 text-8xl font-black leading-none pointer-events-none select-none transition-all duration-500"
                    style={{
                      WebkitTextStroke: "1px rgba(15,23,42,0.2)",
                      color: "transparent",
                    }}
                  >
                    {item.step}
                  </div>

                  <div className="mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 p-[1.5px]`}
                    >
                      <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-slate-900" strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  <div
                    className="text-xs uppercase tracking-[0.2em] font-bold mb-3 transition-colors"
                    style={{ color: item.ring }}
                  >
                    Phase {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 mb-8 font-normal leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>

                <div className="relative z-10 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 mt-auto">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`} />
                      <span className="text-sm text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {index < 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  className="hidden lg:flex absolute top-[100px] -right-6 w-12 justify-center z-20"
                >
                  <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-slate-400 transition-colors" />
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