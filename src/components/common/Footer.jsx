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
    { icon: Send, href: "#", label: "Telegram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: MessageSquare, href: "#", label: "WhatsApp" },
    { icon: Github, href: "#", label: "Github" },
  ];

  return (
    <footer
      className="relative bg-[#020203] pt-20 pb-8 px-6 md:px-10 overflow-hidden border-t border-white/10"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Load Inter */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            `}</style>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[28px] border border-white/10 bg-gradient-to-r from-purple-500/[0.08] via-white/[0.02] to-blue-500/[0.08] p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
        >
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-purple-500/10 rounded-full blur-[70px] pointer-events-none" />
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
              Ready to start earning?
            </h3>
            <p className="text-gray-400 text-sm md:text-base">
              Activate your ID for ₹999 and unlock the full income plan today.
            </p>
          </div>
          <Link
            to="/auth/register"
            className="relative z-10 group shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm transition-transform duration-300 hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_20px_-4px_rgba(168,85,247,0.6)]">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                {mainContent.projectName}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-normal">
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
              <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.2em]">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 text-sm font-normal hover:text-purple-400 transition-colors flex items-center gap-1 group w-fit"
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
          <p className="text-sm text-gray-500 text-center md:text-left font-normal">
            © {currentYear} {mainContent.projectName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 hover:border-purple-500 hover:scale-110 transition-all duration-300"
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
