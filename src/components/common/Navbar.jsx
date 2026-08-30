import { useState, useEffect } from "react";
import { Menu, X, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const sections = ["home", "plan", "ecosystem", "how it works", "about"];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Scroll Spy + scrolled-background logic
  useEffect(() => {
    const handleScroll = () => {
      let current = "ecosystem";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop;

          if (window.scrollY >= top - 200) {
            current = id;
          }
        }
      });

      setActive(current);
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll function
  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 flex justify-center mt-4 px-4"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Load Inter */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <div
        className={`flex items-center justify-between w-full max-w-6xl px-5 py-2.5 rounded-full border transition-all duration-500 ${
          scrolled
            ? "bg-[#0b0b0f]/80 border-white/15 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]"
            : "bg-white/[0.06] border-white/10 shadow-lg"
        } backdrop-blur-xl`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_18px_-4px_rgba(168,85,247,0.7)]">
            <Coins className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-white font-bold text-lg tracking-tight">
            BINEXT
          </h1>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 text-sm relative">
          {sections.map((id) => (
            <span
              key={id}
              onClick={() => handleScrollTo(id)}
              className={`relative cursor-pointer px-4 py-1.5 rounded-full transition-colors duration-300 font-medium z-10 ${
                active === id ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {active === id && (
                <motion.span
                  layoutId="navPill"
                  className="absolute inset-0 -z-10 rounded-full bg-white/15 border border-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </span>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            to="/auth/login"
            className="text-white/70 text-sm font-medium cursor-pointer hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/auth/register"
            className="group px-5 py-2 rounded-full bg-white text-black text-sm font-semibold transition-transform duration-300 hover:scale-105 flex items-center gap-1"
          >
            Register
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden text-white p-1"
          onClick={() => setOpen((v) => !v)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-20 w-[92%] max-w-6xl text-center bg-[#0b0b0f]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-6 flex flex-col gap-2 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
          >
            {sections.map((id) => (
              <span
                key={id}
                onClick={() => handleScrollTo(id)}
                className={`cursor-pointer px-4 py-2.5 rounded-xl transition-colors font-medium ${
                  active === id
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </span>
            ))}

            <hr className="border-white/10 my-2" />

            <Link
              to="/auth/login"
              className="text-white/70 text-sm font-medium py-2 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/auth/register"
              className="px-4 py-3 rounded-full bg-white text-black text-sm font-semibold hover:scale-[1.02] transition-transform"
            >
              Register Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
