import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Gift, RefreshCcw, IdCard, ArrowUpRight, Users } from "lucide-react";
import { links } from "../landingContent";
import { SectionHeading, SpotlightCard, CardLabel, Reveal, ease } from "./ui";

// Bento grid: joining package (featured), cashback, income renewal, ID renewal
const PlanSection = () => {
  return (
    <section id="plan" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="The Plan"
            title="One package."
            accent="Clear rules."
            desc="Every number on this page is fixed. No hidden tiers, no confusing slabs — just four things you need to know."
          />
          <Reveal delay={0.1}>
            <a
              href={links.businessPlan}
              download
              className="group inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white"
            >
              Full details in the Business Plan
              <ArrowUpRight className="h-4 w-4 text-[#D4AF6A] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
          {/* 1. Joining package — featured gold card */}
          <Reveal className="md:col-span-3 md:row-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5DFA8] via-[#D4AF6A] to-[#8E6427] p-8 text-[#140F05] sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-black/10" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full border border-black/10" />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/10">
                    <Rocket className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/60">Joining Package</span>
                </div>

                <p className="mt-10 text-7xl font-semibold tracking-[-0.06em] sm:text-8xl">₹1,199</p>
                <p className="mt-4 max-w-sm text-lg leading-snug text-black/70">
                  Start your journey with our structured business package.
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-12">
                  <Link
                    to={links.register}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#0A0A0B] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                  >
                    Register now <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <span className="text-xs text-black/60">Pay only via official channels</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 2. Cashback */}
          <Reveal delay={0.08} className="md:col-span-3">
            <SpotlightCard className="h-full p-7 sm:p-8">
              <CardLabel icon={Gift} label="Cashback Benefit" />
              <div className="mt-7 flex items-baseline gap-2">
                <span className="text-sm text-neutral-500">Up to</span>
                <span className="text-5xl font-semibold tracking-[-0.04em] text-white">₹1,000</span>
              </div>

              {/* Eligibility visual: 2 direct members */}
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex -space-x-2">
                  {[0, 1].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15, ease }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0D0D0F] bg-[#D4AF6A]/20 text-[#E8C987]"
                    >
                      <Users className="h-4 w-4" />
                    </motion.span>
                  ))}
                </div>
                <p className="text-sm leading-snug text-neutral-400">
                  Activate <span className="text-white">2 direct members</span> to become eligible.
                </p>
              </div>

              {/* Claim window bar */}
              <div className="mt-5">
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                  <span>Activation</span>
                  <span>Day 20</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3, ease }}
                    className="h-full rounded-full bg-gradient-to-r from-[#8E6427] to-[#F5DFA8]"
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500">Claim within 20 days from activation.</p>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 3. Income renewal */}
          <Reveal delay={0.16} className="md:col-span-3 lg:col-span-3">
            <div className="grid h-full gap-4 sm:grid-cols-2">
              <SpotlightCard className="p-7">
                <CardLabel icon={RefreshCcw} label="Income Renewal" />
                <p className="mt-7 text-4xl font-semibold tracking-[-0.04em] text-white">₹999</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  At every <span className="text-white">₹9,000</span> earnings — a structured renewal for continuous business activity.
                </p>
              </SpotlightCard>

              {/* 4. ID renewal */}
              <SpotlightCard className="p-7">
                <CardLabel icon={IdCard} label="ID Renewal" />
                <p className="mt-7 text-4xl font-semibold tracking-[-0.04em] text-white">₹199</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  Every <span className="text-white">70 days</span> from your activation date to keep your account active.
                </p>
              </SpotlightCard>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default PlanSection;
