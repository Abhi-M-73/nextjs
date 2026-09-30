import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, AlertTriangle, ArrowUpRight } from "lucide-react";
import { brand, links, policies, policyFacts, paymentNotice } from "../landingContent";
import { SectionHeading, Reveal, ease } from "./ui";

// Business policy accordion + highlighted payment notice
const PolicySection = () => {
  const [openId, setOpenId] = useState(policies[0].id);

  return (
    <section id="policy" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          center
          eyebrow="Business Policy"
          title="Read before you"
          accent="activate."
          desc={`Transparency first. Here is exactly how ${brand.domain} works — and what it does not promise.`}
        />

        {/* Key facts row */}
        <Reveal delay={0.1} className="mx-auto mt-12 grid max-w-3xl grid-cols-3 divide-x divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          {policyFacts.map((f) => (
            <div key={f.label} className="px-3 py-5 text-center sm:px-6">
              <p className="text-xl font-semibold tracking-tight text-white sm:text-3xl">{f.value}</p>
              <p className="mt-1 text-[11px] leading-tight text-neutral-500 sm:text-xs">{f.label}</p>
            </div>
          ))}
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Accordion */}
          <Reveal className="divide-y divide-white/[0.07] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0D0D0F]">
            {policies.map((p, i) => {
              const isOpen = openId === p.id;
              return (
                <div key={p.id}>
                  <button
                    onClick={() => setOpenId(isOpen ? null : p.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-5 px-6 py-6 text-left sm:px-8"
                  >
                    <span className="font-mono text-xs text-neutral-600">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`flex-1 text-lg font-medium tracking-tight transition-colors ${isOpen ? "text-white" : "text-neutral-300"}`}>
                      {p.title}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                        isOpen ? "border-[#D4AF6A]/50 text-[#E8C987]" : "border-white/10 text-neutral-400"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 px-6 pb-7 pl-[60px] text-[15px] leading-relaxed text-neutral-400 sm:px-8 sm:pl-[68px]">
                          {p.body.map((para) => (
                            <p key={para}>{para}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            <div className="px-6 py-5 sm:px-8">
              <Link to={links.terms} className="group inline-flex items-center gap-2 text-sm text-[#E8C987]">
                Read full Terms & Conditions
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          {/* Payment notice */}
          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-b from-amber-500/[0.09] to-transparent p-7 sm:p-8">
              {/* Hazard stripe */}
              <div className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(45deg,#d4af6a_0_10px,transparent_10px_20px)] opacity-60" />

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-white">{paymentNotice.title}</h3>
              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">Official amount</p>
                <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-white">₹1,199</p>
                <p className="mt-1 text-xs text-amber-200/80">Never pay more than this to anyone.</p>
              </div>

              <ul className="mt-6 space-y-4">
                {paymentNotice.body.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed text-neutral-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default PolicySection;
