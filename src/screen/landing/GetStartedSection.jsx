import { Link } from "react-router-dom";
import { ArrowRight, Download, FileText } from "lucide-react";
import { links } from "../landingContent";
import { Reveal } from "./ui";

// Final CTA: the three required landing actions side by side
const GetStartedSection = () => {
  const actions = [
    {
      icon: Download,
      title: "Business Plan",
      desc: "Download the complete plan PDF.",
      href: links.businessPlan,
      download: true,
    },
    {
      icon: FileText,
      title: "Terms & Conditions",
      desc: "Understand the rules before you join.",
      to: links.terms,
    },
  ];

  return (
    <section id="get-started" className="relative scroll-mt-24 px-5 pb-24 sm:pb-32">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0D0D0F]">
        {/* Background glow + grid */}
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,106,0.25),transparent)]" />

        <div className="relative px-6 py-16 text-center sm:px-12 sm:py-24">
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl">
            Ready to start?{" "}
            <span className="gold-text font-serif-display pr-1 font-normal italic">Register today.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-neutral-400">
            Read the plan, understand the policy, then activate with the official ₹1,199 package.
          </p>

          <Link
            to={links.register}
            className="gold-btn group mx-auto mt-10 inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-[15px] font-semibold"
          >
            New Registration
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="mx-auto mt-12 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
            {actions.map((a) => {
              const inner = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#E8C987]">
                    <a.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white">{a.title}</span>
                    <span className="block text-xs text-neutral-500">{a.desc}</span>
                  </span>
                </>
              );
              const cls =
                "flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-black/30 p-4 backdrop-blur transition-colors hover:border-[#D4AF6A]/40";

              return a.download ? (
                <a key={a.title} href={a.href} download className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={a.title} to={a.to} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default GetStartedSection;
