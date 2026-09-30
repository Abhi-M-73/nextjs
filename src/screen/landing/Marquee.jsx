import { marqueeItems } from "../landingContent";

// Infinite ticker strip. Items are rendered twice so the -50% loop is seamless.
const Marquee = () => {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="relative border-y border-white/[0.06] bg-[#0A0A0B] py-5">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#070707] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#070707] to-transparent" />

      <div className="overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-10">
          {items.map((text, i) => (
            <div key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-neutral-400">{text}</span>
              <span className="text-[#D4AF6A]">✦</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
