import { motion } from "framer-motion";
import {
    Coins,
    ArrowRight,
    Twitter,
    Github,
    Send,
    MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import mainContent from "../../utils/mainContent";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms & Conditions", href: "/terms-and-conditions" },
            ],
        },
        {
            title: "Quick Links",
            links: [
                { name: "How It Works", href: "/#how-it-works" },
                { name: "Income Plan", href: "/#plan" },
                { name: "Register", href: "/auth/register" },
                { name: "Login", href: "/auth/login" },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Contact Us", href: "/contact" },
                { name: "FAQs", href: "/faq" },
            ],
        },
    ];

    const socialLinks = [
        { icon: Send, href: "#" },
        { icon: Twitter, href: "#" },
        { icon: MessageSquare, href: "#" },
        { icon: Github, href: "#" },
    ];

    return (
        <footer className="relative bg-[#020203] pt-16 pb-8 px-6 md:px-10 overflow-hidden border-t border-white/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-purple-600/10 blur-[150px] pointer-events-none" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Coins className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-bold text-lg">
                                {mainContent.projectName}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Activate, refer, and earn with a transparent, level-based income
                            plan built for consistent daily growth.
                        </p>
                    </motion.div>

                    {/* Link Columns */}
                    {footerLinks.map((section, idx) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-gray-400 text-sm hover:text-purple-400 transition-colors flex items-center gap-1 group"
                                        >
                                            {link.name}
                                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 pt-8">
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        © {currentYear} {mainContent.projectName}. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {socialLinks.map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 hover:border-purple-500 transition-all duration-300"
                            >
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;