import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, Download } from "lucide-react";
import { brand, links, navItems } from "../landingContent";
import { Logo } from "./ui";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  // Scroll spy + glass background after first scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      let current = "";
      navItems.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 160) current = id;
      });
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled
            ? "border-white/10 bg-[#0B0B0C]/75 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Brand */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[17px] font-semibold tracking-tight text-white">{brand.name}</span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative rounded-full px-4 py-1.5 text-sm transition-colors ${
                active === item.id ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {active === item.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/[0.08]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link to={links.login} className="px-3 py-2 text-sm text-neutral-300 transition-colors hover:text-white">
            Log in
          </Link>
          <Link
            to={links.register}
            className="gold-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Register <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-[#0B0B0C]/95 p-3 backdrop-blur-xl lg:hidden"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                onClick={() => scrollTo(item.id)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-[15px] text-neutral-200 hover:bg-white/[0.04]"
              >
                {item.label}
                <span className="font-mono text-xs text-neutral-600">0{i + 1}</span>
              </motion.button>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3">
              <Link
                to={links.login}
                className="rounded-xl border border-white/10 py-3 text-center text-sm font-medium text-white"
              >
                Log in
              </Link>
              <Link to={links.register} className="gold-btn rounded-xl py-3 text-center text-sm font-semibold">
                Register
              </Link>
              <a
                href={links.businessPlan}
                download
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF6A]/30 bg-[#D4AF6A]/[0.06] py-3 text-sm text-[#E8C987]"
              >
                <Download className="h-4 w-4" /> Download Business Plan
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
