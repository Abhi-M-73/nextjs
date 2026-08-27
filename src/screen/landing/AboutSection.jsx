import { Award, ShieldCheck, Globe, Activity } from "lucide-react";
import { motion } from "framer-motion";

const AboutSection = () => {
    return (
        <section id="about" className="relative px-6 py-32 overflow-hidden bg-[#020203]">
            {/* Background Texture & Glowing Orbs */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

            <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-16 items-center">
                    {/* --- LEFT: Text & Stats Content --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                        >
                            <Globe className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-semibold text-gray-300 uppercase tracking-widest">About Liberland</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-[1.1] tracking-tight">
                            Pioneering a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400 animate-gradient-x">
                                Decentralized Nation
                            </span>
                        </h2>

                        <p className="text-gray-400 text-lg mb-6 font-light leading-relaxed">
                            Established on the principles of liberty and blockchain technology, Liberland is the world's first fully decentralized republic. The Liberland Dollar (LLD) is the economic engine driving this vision forward.
                        </p>
                        <p className="text-gray-400 mb-10 font-light leading-relaxed">
                            Our infrastructure is built on Polkadot/Substrate, ensuring military-grade security, lightning-fast consensus, and a truly transparent governance model where every citizen has a voice.
                        </p>

                        {/* Premium Stats Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { value: '100%+', label: 'On-Chain Govt', color: 'from-orange-500 to-yellow-500' },
                                { value: 'NPoS', label: 'Consensus Model', color: 'from-purple-500 to-blue-500' },
                                { value: '< 3s', label: 'Block Time', color: 'from-green-500 to-emerald-400' },
                                { value: 'Zero', label: 'Fiat Dependency', color: 'from-pink-500 to-orange-500' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group overflow-hidden rounded-[24px] bg-[#0f0f12]/80 border border-white/10 p-6 backdrop-blur-xl hover:-translate-y-1 transition-transform"
                                >
                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} ></div>

                                    <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* --- RIGHT: Image & Floating Badges --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Main Image Container */}
                        <div className="relative group rounded-[40px] p-[1px] bg-gradient-to-br from-orange-500/30 via-purple-500/10 to-transparent">

                            {/* Outer Glow */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 blur-2xl opacity-50 group-hover:opacity-80 transition duration-700"></div>

                            <div className="relative bg-[#0f0f12] rounded-[40px] overflow-hidden border border-white/10 aspect-[4/5] sm:aspect-square flex items-center justify-center">
                                {/* Using the Pinterest image you provided, with a subtle overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent opacity-80 z-10"></div>
                                <img
                                    src="https://i.pinimg.com/1200x/67/54/a9/6754a991eb5a1e00aeb2f456a332d4ef.jpg"
                                    alt="Liberland Architecture"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 opacity-80"
                                />

                                {/* Overlay Logo/Icon center */}
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <div className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                        <Award className="w-10 h-10 text-orange-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge 1 (Top Right) */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-8 -right-4 sm:-right-8 bg-[#0f0f12]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-30"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-white">99.9%</div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Network Uptime</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Badge 2 (Bottom Left) */}
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-8 -left-4 sm:-left-8 bg-[#0f0f12]/90 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-5 shadow-[0_10px_40px_rgba(249,115,22,0.1)] z-30"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xl font-black text-white">Audited</div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Smart Contracts</div>
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;