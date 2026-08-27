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
        title: "Refer Friends And Earn ₹100 Instantly For Every Successful Referral",
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
        title: "Withdraw Anytime With Just ₹700 Minimum And Simple Bank Or UPI Transfer",
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

    // 🔥 smoother rotation
    const rotate = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -360]),
        { stiffness: 50, damping: 20 }
    );

    return (
        <div
            id="ecosystem"
            ref={containerRef}
            className="relative bg-[#020203]"
            style={{ height: `${sections.length * 100}vh` }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex items-center">

                {/* 🔥 PREMIUM WHEEL */}
                <motion.div
                    style={{ rotate }}
                    className="absolute left-[-120px] md:left-[-200px] top-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px]"
                >
                    {/* Outer Glow */}
                    <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-[80px]" />

                    {/* Outer Ring */}
                    <div className="absolute inset-0 border border-white/10 rounded-full" />

                    {/* Inner Ring */}
                    <div className="absolute inset-12 md:inset-16 border border-white/5 rounded-full" />

                    {/* Spokes */}
                    {[0, 72, 144, 216, 288].map((deg) => (
                        <div
                            key={deg}
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ transform: `rotate(${deg}deg)` }}
                        >
                            <div className="w-[1px] h-full bg-white/10" />
                        </div>
                    ))}

                    {/* Center Glow */}
                    <div className="absolute inset-[120px] md:inset-[200px] rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/10 blur-xl" />

                    {/* Center Core */}
                    <div className="absolute inset-[130px] md:inset-[210px] rounded-full bg-[#0f0f12] border border-white/10" />
                </motion.div>

                {/* 🔥 CONTENT */}
                <div className=" relative ml-[130px] md:ml-[420px] px-4 md:px-0 w-full max-w-4xl">

                    {sections.map((section, i) => {
                        const start = i / sections.length;
                        const end = (i + 1) / sections.length;

                        const opacity = useSpring(
                            useTransform(
                                scrollYProgress,
                                [start, start + 0.1, end - 0.1, end],
                                [0, 1, 1, 0]
                            ),
                            { stiffness: 80, damping: 20 }
                        );

                        const y = useSpring(
                            useTransform(
                                scrollYProgress,
                                [start, start + 0.1, end],
                                [60, 0, -60]
                            ),
                            { stiffness: 80, damping: 20 }
                        );

                        return (
                            <motion.div
                                key={i}
                                style={{ opacity, y }}
                                className="absolute top-1/2 md:left-20 -left-20 -translate-y-1/2 w-full"
                            >
                                {/* Accent */}
                                <div
                                    className="w-16 h-[3px] mb-6 rounded-full"
                                    style={{ background: section.accent }}
                                />

                                {/* Label */}
                                <p
                                    className="text-xs font-bold tracking-[0.3em] mb-3"
                                    style={{ color: section.accent }}
                                >
                                    {section.label}
                                </p>

                                {/* Title */}
                                <h2 className="text-3xl md:text-6xl font-semibold text-white mb-5 leading-tight">
                                    {section.title}
                                </h2>

                                {/* Desc */}
                                <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-8">
                                    {section.text}
                                </p>

                                {/* Button */}
                                <button
                                    className="px-6 py-2 border text-sm font-semibold rounded-full transition hover:scale-105"
                                    style={{
                                        borderColor: section.accent,
                                        color: section.accent,
                                    }}
                                >
                                    Explore →
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EcosystemSection;