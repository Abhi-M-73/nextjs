import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { teamSteps } from "../landingContent";
import { SectionHeading, Reveal } from "./ui";

// Sticky heading on the left, vertical timeline on the right.
// The gold line fills up as the user scrolls through the steps.
const BuildTeamSection = () => {
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="team" className="relative scroll-mt-24 border-t border-white/[0.06] bg-[#09090A] py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.08),transparent)]" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Build Your Team"
            title="Grow together with a"
            accent="fixed & structured plan."
            desc="Five steps from registration to renewal. Nothing more, nothing hidden."
          />
        </div>

        <ol ref={listRef} className="relative">
          {/* Track + animated fill */}
          <div className="absolute bottom-6 left-[19px] top-6 w-px bg-white/[0.08]" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[19px] top-6 w-px bg-gradient-to-b from-[#F5DFA8] to-[#8E6427] shadow-[0_0_12px_#D4AF6A]"
          />

          {teamSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 0.05} className="relative flex gap-6 pb-10 last:pb-0">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF6A]/40 bg-[#0D0D0F] font-mono text-xs text-[#E8C987]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/[0.14] hover:bg-white/[0.035]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-white">{step.title}</h3>
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    {step.tag}
                  </span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default BuildTeamSection;
