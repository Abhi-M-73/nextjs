import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertTriangle, ArrowRight } from "lucide-react";
import { brand, links, policies, paymentNotice } from "../landingContent";
import { ease } from "./ui";

// Plan rules shown at the top of the terms
const planRules = [
  "Official joining package amount is ₹1,199.",
  "Cashback of up to ₹1,000 requires activating 2 direct members, claimable within 20 days from activation.",
  "Income renewal of ₹999 applies at every ₹9,000 earnings.",
  "ID renewal of ₹199 is required every 70 days from the date of activation.",
];

const TermsModal = ({ open, onClose }) => {
  // Close on Escape + lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
        >
          {/* Panel: bottom sheet on mobile, centered dialog on sm+ */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{ duration: 0.4, ease }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#0D0D0F] text-left sm:max-w-2xl sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-7 sm:py-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  {brand.domain}
                </p>
                <h2
                  id="terms-title"
                  className="mt-0.5 text-lg font-semibold tracking-tight text-white sm:text-xl"
                >
                  Terms & Conditions
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 text-[14px] leading-relaxed text-neutral-400 sm:px-7">
              <section>
                <h3 className="font-semibold text-white">1. Plan rules</h3>
                <ul className="mt-3 space-y-2">
                  {planRules.map((rule) => (
                    <li key={rule} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF6A]" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </section>

              {policies.map((p, i) => (
                <section key={p.id}>
                  <h3 className="font-semibold text-white">
                    {i + 2}. {p.title}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {p.body.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4">
                <h3 className="flex items-center gap-2 font-semibold text-amber-200">
                  <AlertTriangle className="h-4 w-4" /> {paymentNotice.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {paymentNotice.body.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Footer actions */}
            <div className="grid grid-cols-2 gap-2 border-t border-white/[0.07] p-4 sm:flex sm:justify-end sm:px-7">
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.04]"
              >
                Close
              </button>
              <Link
                to={links.register}
                onClick={onClose}
                className="gold-btn inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold"
              >
                I agree, Register <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;
