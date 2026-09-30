import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, ShieldCheck, Check } from "lucide-react";
import { brand, hero, links, packageHighlights } from "../landingContent";
import { Eyebrow, ease } from "./ui";
import TermsModal from "./TermsModal";

// Returns true on lg+ screens (used to disable parallax on mobile)
const useIsDesktop = () => {
  const query = "(min-width: 1024px)";
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
};

const HeroSection = () => {
  const ref = useRef(null);
  const isDesktop = useIsDesktop();
  const [termsOpen, setTermsOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax only on desktop — on mobile the card is stacked and would get clipped
  const cardY = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? 90 : 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-40 lg:pb-28"
    >
      <div className="grid-bg pointer-events-none absolute inset-0" />

      {/* Top glow — smaller on mobile */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-[-160px] h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.22),transparent)] sm:top-[-240px] sm:h-[620px] sm:w-[1100px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        {/* Left: copy — centered below lg, left-aligned on desktop */}
        <div className="min-w-0 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex justify-center lg:justify-start"
          >
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </motion.div>

          {/* 38px on small phones (320–399px), scales up from there */}
          <h1 className="mt-6 text-[38px] font-semibold leading-[1] tracking-[-0.04em] text-white min-[400px]:text-[44px] sm:mt-7 sm:text-6xl sm:leading-[0.98] lg:text-[80px]">
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="block"
            >
              {hero.titleTop}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.22, ease }}
              className="gold-text font-serif-display block px-1 font-normal italic tracking-[-0.02em] lg:pl-0 lg:pr-2"
            >
              {hero.titleAccent}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-neutral-400 sm:mt-7 sm:text-lg lg:mx-0"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTAs: full-width stacked on mobile, centered row on tablet, left on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              to={links.register}
              className="gold-btn group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 text-[15px] font-semibold sm:w-auto"
            >
              New Registration
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={links.businessPlan}
              download
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.03] px-7 py-4 text-[15px] font-medium text-white backdrop-blur transition-colors hover:border-white/25 hover:bg-white/[0.06] sm:w-auto"
            >
              <Download className="h-4 w-4 text-[#E8C987] transition-transform group-hover:-translate-y-0.5" />
              Business Plan
            </a>
          </motion.div>

          {/* T&C note — opens the terms modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-5 flex items-center justify-center gap-2 text-xs leading-relaxed text-neutral-500 sm:mt-6 lg:justify-start"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#D4AF6A]" />
            <p>
              Please read the{" "}
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="font-medium text-[#E8C987] underline decoration-[#D4AF6A]/40 underline-offset-4 hover:decoration-[#D4AF6A]"
              >
                Terms & Conditions
              </button>{" "}
              before activating.
            </p>
          </motion.div>
        </div>

        {/* Right: package card with rotating gold border */}
        <motion.div
          style={{ y: cardY }}
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="relative mx-auto w-full max-w-md [perspective:1200px] lg:max-w-none"
        >
          <div className="absolute -inset-6 rounded-full bg-[#D4AF6A]/10 blur-3xl sm:-inset-10" />

          <div className="conic-border relative rounded-3xl bg-gradient-to-b from-[#141312] to-[#0B0B0C] p-5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] min-[400px]:p-6 sm:rounded-[28px] sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 sm:text-[11px] sm:tracking-[0.22em]">
                Joining Package
              </span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                Official
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-x-2 sm:mt-6">
              <span className="text-5xl font-semibold tracking-[-0.05em] text-white min-[400px]:text-6xl sm:text-7xl">
                ₹1,199
              </span>
              <span className="mb-1.5 text-sm text-neutral-500 sm:mb-2">
                one-time
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-400">
              Start your journey with our structured business package.
            </p>

            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:my-7" />

            <ul className="space-y-3.5 sm:space-y-4">
              {packageHighlights.map((h, i) => (
                <motion.li
                  key={h.title}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.08, ease }}
                  className="flex gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF6A]/15 text-[#E8C987]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-white sm:text-[15px]">
                      {h.title}
                    </p>
                    <p className="text-[12px] text-neutral-500 sm:text-[13px]">
                      {h.note}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Terms link inside the card as well */}
            <button
              type="button"
              onClick={() => setTermsOpen(true)}
              className="mt-6 text-xs text-neutral-500 underline decoration-white/20 underline-offset-4 hover:text-neutral-300"
            >
              View Terms & Conditions
            </button>

            <Link
              to={links.register}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.01]"
            >
              Activate with {brand.domain} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </section>
  );
};

export default HeroSection;
