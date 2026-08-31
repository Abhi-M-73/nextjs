import { useState, useEffect } from "react";
import { Menu, X, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const sections = ["home", "ecosystem", "how it works", "about"];

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
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-center"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Load Inter */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <div
        className={`flex items-center justify-between w-full px-5 py-2.5 border transition-all duration-500 ${scrolled
            ? "bg-white/90 border-slate-200 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.15)]"
            : "border-gray-200"
          } backdrop-blur-xl md:px-20`}
      >
        {/* Logo */}
        <div className="flex gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_18px_-4px_rgba(99,102,241,0.5)]">
            <Coins className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-slate-900 font-bold text-xl leading-none tracking-tight">
              BINEXT
            </h1>
            <span className="text-xs font-normal text-slate-500">Invest Today, Grow Tomorrow</span>
          </div>
        </div>


        {/* Right */}
        {/* <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            to="/auth/login"
            className="text-slate-500 text-sm font-medium cursor-pointer hover:text-slate-900 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/auth/register"
            className="group px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold transition-transform duration-300 hover:scale-105 shadow-[0_6px_20px_rgba(37,99,235,0.35)] flex items-center gap-1"
          >
            Register
          </Link>
        </div> */}

        {/* Mobile Button */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className=" text-slate-800 p-1"
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
            className="absolute top-20 w-[92%] max-w-6xl text-center bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 flex flex-col gap-2 text-slate-900 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.2)]"
          >
            <hr className="border-slate-100 my-2" />

            <Link
              to="/auth/login"
              className="text-slate-500 text-sm font-medium py-2 hover:text-slate-900 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/auth/register"
              className="px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-sm font-semibold hover:scale-[1.02] transition-transform shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
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