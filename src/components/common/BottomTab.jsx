import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  History,
  UserCircle2,
  Wallet,
  Layers,
} from "lucide-react";

const BottomTab = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: "Home", path: "/user/home", icon: Home },
    { label: "Package", path: "/user/package", icon: Layers },
    { label: "Team", path: "/user/team", icon: Users },
    { label: "History", path: "/user/history", icon: History },
    { label: "Wallet", path: "/user/wallet", icon: Wallet },
    { label: "Profile", path: "/user/profile", icon: UserCircle2 },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto w-full max-w-xl">
        <motion.nav
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
          }}
          className="
            relative rounded-[26px]
            border border-slate-200/80
            bg-white
            p-1.5
            shadow-[0_15px_45px_-15px_rgba(15,23,42,0.28)]
          "
        >
          <div className="relative grid grid-cols-6 items-center">
            {tabs.map((tab) => {
              const active =
                location.pathname === tab.path ||
                location.pathname.startsWith(`${tab.path}/`);

              const Icon = tab.icon;

              return (
                <motion.button
                  key={tab.path}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(tab.path)}
                  aria-label={tab.label}
                  className="group relative flex min-w-0 flex-1 flex-col items-center justify-center py-1 outline-none"
                >
                  {/* Minimal active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 34,
                      }}
                      className="
                        absolute left-1/2 top-0
                        h-1 w-8
                        -translate-x-1/2
                        rounded-full
                        bg-blue-600
                        shadow-[0_0_12px_rgba(37,99,235,0.65)]
                      "
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-1">
                    {/* Icon */}
                    <motion.div
                      animate={{
                        y: active ? -2 : 0,
                        scale: active ? 1.08 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 25,
                      }}
                      className={`
                        flex h-10 w-10 items-center justify-center
                        rounded-2xl
                        transition-all duration-300
                        ${
                          active
                            ? "bg-blue-600 shadow-[0_8px_18px_-6px_rgba(37,99,235,0.8)]"
                            : "bg-transparent group-hover:bg-slate-100"
                        }
                      `}
                    >
                      <Icon
                        size={19}
                        strokeWidth={active ? 2.6 : 2}
                        className={`
                          transition-colors duration-300
                          ${active ? "text-white" : "text-slate-400"}
                        `}
                      />
                    </motion.div>

                    {/* Label */}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={`${tab.path}-${active}`}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.16 }}
                        className={`
                          max-w-full truncate text-[10px] leading-none
                          tracking-tight
                          ${
                            active
                              ? "font-bold text-blue-600"
                              : "font-medium text-slate-400"
                          }
                        `}
                      >
                        {tab.label}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.nav>
      </div>
    </div>
  );
};

export default BottomTab;
