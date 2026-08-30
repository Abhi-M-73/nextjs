import {
  Sparkles,
  ArrowRight,
  Wallet,
  Users,
  TrendingUp,
  Clock,
  Clock1,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const texts = [
    "Activate at ₹999 & Start Earning",
    "Cashback ₹50 Daily for 20 Days",
    "Earn Upto 16 Levels Deep",
    "Refer & Earn ₹100 Instantly",
  ];

  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [subIndex, setSubIndex] = useState(0);
  const [forward, setForward] = useState(true);

  useEffect(() => {
    if (forward) {
      if (subIndex < texts[index].length) {
        setTimeout(() => {
          setDisplayText((prev) => prev + texts[index][subIndex]);
          setSubIndex(subIndex + 1);
        }, 50);
      } else {
        setTimeout(() => setForward(false), 1500);
      }
    } else {
      if (subIndex > 0) {
        setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
          setSubIndex(subIndex - 1);
        }, 30);
      } else {
        setForward(true);
        setIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [subIndex, index, forward]);

  const highlights = [
    { icon: Wallet, label: "Package", value: "₹999" },
    { icon: TrendingUp, label: "Cashback", value: "₹50 × 20 Days" },
    { icon: Users, label: "Referral Bonus", value: "₹100 / Referral" },
    { icon: Clock1, label: "ID Validity", value: "90 Days" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#020203] overflow-hidden md:pt-16 px-6 flex items-center justify-center"
    >
      <motion.div
        className="absolute top-[5%] left-[-15%] md:left-[-13%] w-[600px] h-[600px] pointer-events-none md:opacity-60 opacity-10 blur-[1px] mix-blend-screen hidden md:block"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/d0/09/6a/d0096acc11c6af20a457d10602f9004e.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "50%",
        }}
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Right Purple/Blue Glow */}
      <motion.div
        className="absolute top-[8%] right-[-28%] md:right-[-8%] w-[600px] h-[600px] pointer-events-none md:opacity-60 blur-[1px] mix-blend-screen hidden md:block rotate-180"
        style={{
          backgroundImage: `url('https://i.pinimg.com/736x/d0/09/6a/d0096acc11c6af20a457d10602f9004e.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "50%",
        }}
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="w-[50rem] h-96 opacity-40"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/8f/cc/c0/8fccc021037e5e70ba3f5c604263ece6.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)",
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center py-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
            Activate • Refer • Upgrade • Earn
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-semibold text-white mb-6 leading-[1.1] tracking-tight"
        >
          Join With ₹999 <br className="hidden md:block" />
          Build Your Income Network <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-orange-600 min-h-[1.2em] inline-block">
            {displayText}
            <span className="animate-pulse">|</span>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-4xl mb-8 font-light"
        >
          Activate your ID at just ₹999 and unlock daily cashback, instant
          referral income, and level income across 16 levels. Start as SILVER,
          upgrade to GOLD after 10 direct referrals — withdraw anytime with just
          ₹700 minimum.
        </motion.p>

        {/* Highlights strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full max-w-3xl"
        >
          {highlights.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 px-4 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
            >
              <Icon className="w-5 h-5 text-purple-400 mb-1" />
              <span className="text-white font-semibold text-lg">{value}</span>
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Main CTA Button with Glow */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="relative px-8 py-3 rounded-full font-semibold text-white overflow-hidden group"
        >
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-60 group-hover:opacity-100 transition duration-500"></div>

          {/* Inner Background */}
          <div className="absolute inset-[2px] rounded-full bg-black"></div>

          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

          {/* Text */}
          <Link
            to="/auth/register"
            className="relative z-10 flex items-center gap-2"
          >
            Activate Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
