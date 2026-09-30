import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";
import { brand, links, navItems, contact } from "../landingContent";
import { Logo } from "./ui";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Shared style for footer links (py-1 keeps tap targets comfortable on mobile)
  const linkCls =
    "inline-block py-1 text-sm text-neutral-300 transition-colors hover:text-white";

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#050505]">
      <div className="mx-auto max-w-6xl px-5 pt-12 sm:pt-16">
        {/* Mobile: 2 columns (brand + contact span full width). Desktop: 4 columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:gap-12">
          {/* Brand + disclaimer */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-lg font-semibold tracking-tight text-white">
                {brand.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500 sm:mt-5">
              A referral-based business platform. {brand.domain} does not
              provide jobs or fixed salaries. All earnings are performance-based
              and not guaranteed.
            </p>
          </div>

          {/* Page sections */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              Explore
            </h4>
            <ul className="mt-4 space-y-1.5 sm:mt-5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button onClick={() => scrollTo(item.id)} className={linkCls}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Account + legal */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              Account & Legal
            </h4>
            <ul className="mt-4 space-y-1.5 sm:mt-5">
              <li>
                <Link to={links.register} className={linkCls}>
                  New Registration
                </Link>
              </li>
              <li>
                <Link to={links.login} className={linkCls}>
                  Log in
                </Link>
              </li>
              <li>
                <a href={links.businessPlan} download className={linkCls}>
                  Business Plan (PDF)
                </a>
              </li>
              <li>
                <Link to={links.terms} className={linkCls}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to={links.privacy} className={linkCls}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              Contact
            </h4>

            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:mt-5">
              {/* Tap to call */}
              <a
                href={contact.phoneHref}
                className="group flex items-center gap-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF6A]/25 bg-[#D4AF6A]/10 text-[#E8C987]">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] text-neutral-500">
                    Call support
                  </span>
                  <span className="block whitespace-nowrap text-base font-semibold tracking-tight text-white group-hover:text-[#E8C987]">
                    {contact.phoneDisplay}
                  </span>
                </span>
              </a>

              {/* Call + WhatsApp buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={contact.phoneHref}
                  className="gold-btn inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 py-2.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-400/20"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar: stacked + centered on mobile, split on desktop */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] py-6 text-center text-xs text-neutral-600 sm:mt-14 sm:flex-row sm:text-left">
          <p>
            © {year} {brand.domain}. All rights reserved.
          </p>
          <p>Pay only via official {brand.domain} channels.</p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.22em] select-none text-center text-[22vw] font-semibold leading-none tracking-[-0.06em] text-white/[0.03]"
      >
        {brand.name}
      </p>
    </footer>
  );
};

export default Footer;
