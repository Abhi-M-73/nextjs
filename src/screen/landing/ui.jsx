import { motion } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1];

// Fade-up on scroll. `as` lets it render li, section, etc.
export const Reveal = ({ as = "div", children, delay = 0, y = 24, className = "" }) => {
  const Comp = motion[as];
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </Comp>
  );
};

// Small pill label shown above section titles
export const Eyebrow = ({ children }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400 backdrop-blur">
    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF6A] shadow-[0_0_10px_#D4AF6A]" />
    {children}
  </div>
);

// Section title with a serif italic gold accent
export const SectionHeading = ({ eyebrow, title, accent, desc, center = false }) => (
  <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
      {title}{" "}
      <span className="gold-text font-serif-display pr-1 font-normal italic">{accent}</span>
    </h2>
    {desc && <p className="mt-5 leading-relaxed text-neutral-400 sm:text-lg">{desc}</p>}
  </Reveal>
);

// Dark card with a gold spotlight that follows the cursor
export const SpotlightCard = ({ children, className = "" }) => {
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={handleMove}
      className={`spotlight-card relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0D0D0F] transition-colors duration-500 hover:border-white/[0.14] ${className}`}
    >
      {children}
    </div>
  );
};

// Mono label row used at the top of plan cards
export const CardLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF6A]/25 bg-[#D4AF6A]/10 text-[#E8C987]">
      <Icon className="h-4 w-4" />
    </span>
    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">{label}</span>
  </div>
);

// Brand mark
export const Logo = ({ className = "h-9 w-9" }) => (
  <span
    className={`gold-surface flex ${className} items-center justify-center rounded-xl text-[#140F05] shadow-[0_6px_20px_-6px_rgba(212,175,106,0.7)]`}
  >
    <span className="font-serif-display text-xl italic leading-none">B</span>
  </span>
);
