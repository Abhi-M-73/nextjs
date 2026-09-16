// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/earnio1.png";

// const plans = [
//   {
//     name: "Starter Miner",
//     amount: "1–100 USDT",
//     rate: "12 TH/s",
//     label: "Entry mining",
//     color: "blue",
//   },
//   {
//     name: "Pro Mining",
//     amount: "500–1,000 USDT",
//     rate: "86 TH/s",
//     label: "Most selected",
//     color: "purple",
//     popular: true,
//   },
//   {
//     name: "Mining Partner",
//     amount: "Referral program",
//     rate: "1%",
//     label: "Partner rewards",
//     color: "green",
//   },
// ];

// const faqs = [
//   {
//     q: "Are mining returns guaranteed?",
//     a: "No. Digital-mining operations are subject to volatility, network difficulty and operational factors. Any displayed hashrate or output is a target or program term and must not be considered a guaranteed return.",
//   },
//   {
//     q: "How can I get started?",
//     a: "Create your account, complete the applicable verification, review all terms and select a mining plan only after understanding the risks and conditions.",
//   },
//   {
//     q: "How does the affiliate program work?",
//     a: "Eligible users may receive referral commission according to the published affiliate terms and verification requirements.",
//   },
//   {
//     q: "What should I check before participating?",
//     a: "Check the legal entity, registration information, custody model, fees, withdrawal rules, support details and risk disclosures.",
//   },
// ];

// function Arrow() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none">
//       <path
//         d="M5 12h14M13 6l6 6-6 6"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function Check() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none">
//       <path
//         d="m5 12.5 4.5 4.5L19 7.5"
//         stroke="currentColor"
//         strokeWidth="2.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function Shield() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none">
//       <path
//         d="M12 3 19 6v5.5c0 4.7-2.9 7.7-7 9.5-4.1-1.8-7-4.8-7-9.5V6l7-3Z"
//         stroke="currentColor"
//         strokeWidth="1.8"
//         strokeLinejoin="round"
//       />
//       <path
//         d="m8.5 12 2.3 2.3 4.8-4.9"
//         stroke="currentColor"
//         strokeWidth="1.8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function Chart() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none">
//       <path
//         d="M4 19V5M4 19h16"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinecap="round"
//       />
//       <path
//         d="m7 15 3.5-3.5 2.5 2 5-6"
//         stroke="currentColor"
//         strokeWidth="1.8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function Wallet() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none">
//       <path
//         d="M5 7V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z"
//         stroke="currentColor"
//         strokeWidth="1.7"
//       />
//       <path
//         d="M5 8h13.5A1.5 1.5 0 0 1 20 9.5V14h-4a2 2 0 1 1 0-4h4"
//         stroke="currentColor"
//         strokeWidth="1.7"
//         strokeLinejoin="round"
//       />
//       <circle cx="16" cy="12" r=".8" fill="currentColor" />
//     </svg>
//   );
// }

// function Sparkle() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none">
//       <path
//         d="M12 2.8 13.7 9l6.3 1.7-6.3 1.7-1.7 6.3-1.7-6.3L4 10.7 10.3 9 12 2.8Z"
//         stroke="currentColor"
//         strokeWidth="1.6"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function BrandLogo() {
//   return (
//     <span className="brand-logo-wrap">
//       <img src={logo} alt="CalmVest" className="brand-logo-img h-4 w-4" />
//     </span>
//   );
// }

// export default function App() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState("Pro Mining");
//   const [openFaq, setOpenFaq] = useState(0);
//   const [visible, setVisible] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setVisible(true);

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("reveal-visible");
//             observer.unobserve(entry.target);
//           }
//         });
//       },
//       { threshold: 0.12 },
//     );

//     document.querySelectorAll(".reveal").forEach((element) => {
//       observer.observe(element);
//     });

//     return () => observer.disconnect();
//   }, []);

//   const goTo = (id) => {
//     document.getElementById(id)?.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//     setMenuOpen(false);
//   };

//   return (
//     <div className={`site ${visible ? "site-loaded" : ""}`}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

//         :root {
//           --dark: #07100e;
//           --deep: #0b1714;
//           --text: #edf7ef;
//           --muted: #91a79b;
//           --gold: #d6a84f;
//           --gold-light: #f0cd78;
//           --emerald: #2fbd83;
//           --emerald-dark: #126044;
//           --line: rgba(178, 207, 186, .14);
//           --soft: #0d1b17;
//           --card: rgba(20, 37, 30, .82);
//           --purple: #9d7bff;
//         }

//         * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }

//         html {
//           scroll-behavior: smooth;
//         }

//         body {
//           background: #07100e;
//           color: var(--text);
//           font-family: "DM Sans", sans-serif;
//         }

//         button,
//         input,
//         textarea {
//           font: inherit;
//         }

//         button {
//           cursor: pointer;
//         }

//         a {
//           color: inherit;
//           text-decoration: none;
//         }

//         .site {
//           min-height: 100vh;
//           overflow: hidden;
//           background:
//             radial-gradient(circle at 80% 0%, rgba(214, 168, 79, .16), transparent 28rem),
//             radial-gradient(circle at 10% 35%, rgba(47, 189, 131, .13), transparent 24rem),
//             linear-gradient(135deg, #07100e 0%, #0b1714 52%, #101c18 100%);
//         }

//         .container {
//           width: min(1180px, calc(100% - 42px));
//           margin: auto;
//         }

//         .reveal {
//           opacity: 0;
//           transform: translateY(32px);
//           transition:
//             opacity .8s ease,
//             transform .8s cubic-bezier(.22, 1, .36, 1);
//         }

//         .reveal-visible {
//           opacity: 1;
//           transform: translateY(0);
//         }

//         .navbar {
//           position: relative;
//           z-index: 100;
//           height: 88px;
//           width: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//         }

//         .brand {
//           display: inline-flex;
//           align-items: center;
//           gap: 11px;

//           border: 0;
//           color: var(--text);
//           background: transparent;
//           font-family: "Space Grotesk", sans-serif;
//           font-size: 20px;
//           font-weight: 700;
//           letter-spacing: -.7px;
//         }

//         .brand-logo-wrap {
//           flex: 0 0 auto;
//           width: 20rem;
//           height: 20rem;
//           display: grid;
//           margin: auto;
//           place-items: center;
//           overflow: hidden;
//           border-radius: 13px;
//         }

//         .brand-logo-img {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           display: block;
//         }

//         @keyframes logoFloat {
//           0%, 100% { transform: translateY(0) rotate(0); }
//           50% { transform: translateY(-4px) rotate(3deg); }
//         }

//         .nav-links {
//           display: flex;
//           align-items: center;
//           gap: 31px;
//           color: #9fb3a9;
//           font-size: 13px;
//           font-weight: 700;
//         }

//         .nav-links a {
//           position: relative;
//           padding: 8px 0;
//         }

//         .nav-links a::after {
//           content: "";
//           position: absolute;
//           left: 0;
//           right: 100%;
//           bottom: 0;
//           height: 2px;
//           border-radius: 5px;
//           background: var(--gold);
//           transition: right .25s ease;
//         }

//         .nav-links a:hover {
//           color: var(--gold-light);
//         }

//         .nav-links a:hover::after {
//           right: 0;
//         }

//         .nav-actions {
//           display: flex;
//           gap: 11px;
//           align-items: center;
//         }

//         .btn {
//           min-height: 48px;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//           padding: 0 21px;
//           border: 0;
//           border-radius: 14px;
//           font-size: 13px;
//           font-weight: 800;
//           transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
//         }

//         .btn svg {
//           width: 17px;
//           height: 17px;
//         }

//         .btn-primary {
//           color: #15100a;
//           background: linear-gradient(135deg, #f1cc75, #b8862f);
//           box-shadow: 0 13px 30px rgba(214, 168, 79, .22);
//         }

//         .btn-primary:hover {
//           background: linear-gradient(135deg, #ffe19a, #c9973c);
//           transform: translateY(-3px);
//           box-shadow: 0 18px 38px rgba(214, 168, 79, .34);
//         }

//         .btn-light {
//           color: var(--gold-light);
//           background: rgba(214, 168, 79, .11);
//           border: 1px solid rgba(214, 168, 79, .24);
//         }

//         .btn-light:hover {
//           background: rgba(214, 168, 79, .18);
//           transform: translateY(-2px);
//         }

//         .btn-outline {
//           color: var(--text);
//           border: 1px solid var(--line);
//           background: var(--card);
//         }

//         .btn-outline:hover {
//           border-color: rgba(214, 168, 79, .45);
//           transform: translateY(-2px);
//         }

//         .menu-button {
//           display: none;
//           width: 43px;
//           height: 43px;
//           border: 1px solid var(--line);
//           border-radius: 13px;
//           color: var(--text);
//           background: var(--card);
//           font-size: 22px;
//         }

//         .mobile-menu {
//           position: absolute;
//           top: 76px;
//           left: 0;
//           right: 0;
//           display: grid;
//           gap: 4px;
//           padding: 12px;
//           border: 1px solid var(--line);
//           border-radius: 18px;
//           background: rgba(13, 27, 23, .98);
//           box-shadow: 0 22px 60px rgba(0, 0, 0, .45);
//           animation: menuIn .25s ease both;
//         }

//         @keyframes menuIn {
//           from { opacity: 0; transform: translateY(-8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .mobile-menu a,
//         .mobile-menu button {
//           padding: 14px;
//           border: 0;
//           border-radius: 11px;
//           color: var(--text);
//           background: transparent;
//           text-align: left;
//           font-size: 14px;
//           font-weight: 700;
//         }

//         .mobile-menu a:hover,
//         .mobile-menu button:hover {
//           background: rgba(214, 168, 79, .12);
//           color: var(--gold-light);
//         }

//         .hero {
//           position: relative;
//           min-height: 710px;
//           display: flex;
//           align-items: center;
//           padding: 55px 0 120px;
//         }

//         .hero::before {
//           content: "";
//           position: absolute;
//           left: -160px;
//           top: 110px;
//           width: 330px;
//           height: 330px;
//           border-radius: 50%;
//           background: rgba(47, 189, 131, .16);
//           filter: blur(70px);
//           animation: pulseBlob 6s ease-in-out infinite;
//         }

//         @keyframes pulseBlob {
//           0%, 100% { transform: scale(1); opacity: .65; }
//           50% { transform: scale(1.16); opacity: .9; }
//         }

//         .hero-grid {
//           position: relative;
//           z-index: 1;
//           display: grid;
//           grid-template-columns: 1fr .9fr;
//           gap: 78px;
//           align-items: center;
//         }

//         .eyebrow {
//           width: fit-content;
//           display: inline-flex;
//           align-items: center;
//           gap: 9px;
//           padding: 9px 13px;
//           border: 1px solid rgba(214, 168, 79, .35);
//           border-radius: 100px;
//           color: var(--gold-light);
//           background: rgba(214, 168, 79, .12);
//           font-size: 11px;
//           font-weight: 800;
//           letter-spacing: 1px;
//           text-transform: uppercase;
//           animation: fadeUp .7s .15s both;
//         }

//         .eyebrow-dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 50%;
//           background: var(--emerald);
//           box-shadow: 0 0 0 5px rgba(47, 189, 131, .14);
//         }

//         .hero h1 {
//           max-width: 670px;
//           margin-top: 25px;
//           color: var(--text);
//           font-family: "Space Grotesk", sans-serif;
//           font-size: clamp(47px, 6.2vw, 78px);
//           line-height: 1.01;
//           letter-spacing: -4.8px;
//           animation: fadeUp .7s .25s both;
//         }

//         .hero h1 span {
//           color: var(--gold);
//           background: linear-gradient(100deg, #f0cd78, #d6a84f);
//           -webkit-background-clip: text;
//           background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .hero-copy {
//           max-width: 560px;
//           margin-top: 25px;
//           color: var(--muted);
//           font-size: 17px;
//           line-height: 1.75;
//           animation: fadeUp .7s .35s both;
//         }

//         .hero-buttons {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 12px;
//           margin-top: 34px;
//           animation: fadeUp .7s .45s both;
//         }

//         .hero-note {
//           display: flex;
//           align-items: center;
//           gap: 11px;
//           margin-top: 27px;
//           color: #9fb3a9;
//           font-size: 12px;
//           font-weight: 600;
//           animation: fadeUp .7s .55s both;
//         }

//         .note-icon {
//           width: 25px;
//           height: 25px;
//           display: grid;
//           place-items: center;
//           border-radius: 8px;
//           color: var(--emerald);
//           background: rgba(47, 189, 131, .14);
//         }

//         .note-icon svg,
//         .check-icon svg {
//           width: 16px;
//           height: 16px;
//         }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(22px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .dashboard-area {
//           position: relative;
//           animation: dashboardIn .9s .25s both;
//         }

//         @keyframes dashboardIn {
//           from { opacity: 0; transform: translateY(30px) scale(.96); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }

//         .dashboard-glow {
//           position: absolute;
//           width: 390px;
//           height: 390px;
//           left: 50%;
//           top: 50%;
//           transform: translate(-50%, -50%);
//           border-radius: 50%;
//           background: rgba(47, 189, 131, .18);
//           filter: blur(60px);
//           animation: dashboardGlow 5s ease-in-out infinite;
//         }

//         @keyframes dashboardGlow {
//           0%, 100% { opacity: .7; transform: translate(-50%, -50%) scale(1); }
//           50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
//         }

//         .dashboard,
//         .feature-card,
//         .plan-card,
//         .trust-card,
//         .faq-item {
//           border: 1px solid rgba(214, 168, 79, .16);
//           background:
//             linear-gradient(145deg, rgba(27, 48, 39, .9), rgba(10, 24, 19, .92));
//           box-shadow:
//             0 24px 70px rgba(0, 0, 0, .28),
//             inset 0 1px 0 rgba(255,255,255,.045);
//         }

//         .dashboard {
//           position: relative;
//           z-index: 2;
//           padding: 22px;
//           border-radius: 29px;
//           backdrop-filter: blur(18px);
//         }

//         .dashboard-top {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 21px;
//         }

//         .dashboard-label {
//           color: #9fb3a9;
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .active-status {
//           display: inline-flex;
//           align-items: center;
//           gap: 7px;
//           color: var(--emerald);
//           font-size: 11px;
//           font-weight: 800;
//         }

//         .status-dot {
//           width: 7px;
//           height: 7px;
//           border-radius: 50%;
//           background: var(--emerald);
//           box-shadow: 0 0 0 5px rgba(47, 189, 131, .14);
//           animation: statusPulse 2s infinite;
//         }

//         @keyframes statusPulse {
//           0%, 100% { box-shadow: 0 0 0 4px rgba(47,189,131,.12); }
//           50% { box-shadow: 0 0 0 8px rgba(47,189,131,.04); }
//         }

//         .balance {
//           padding: 23px;
//           border-radius: 21px;
//           color: #fff;
//           background: linear-gradient(135deg, #1f8a6a, #0f4d3a);
//           box-shadow: 0 17px 32px rgba(47, 189, 131, .27);
//         }

//         .balance small {
//           opacity: .72;
//           font-size: 12px;
//         }

//         .balance-amount {
//           margin-top: 8px;
//           font-family: "Space Grotesk", sans-serif;
//           font-size: 35px;
//           font-weight: 700;
//           letter-spacing: -1.5px;
//         }

//         .balance-bottom {
//           display: flex;
//           justify-content: space-between;
//           margin-top: 22px;
//           padding-top: 14px;
//           border-top: 1px solid rgba(255,255,255,.22);
//           font-size: 12px;
//         }

//         .positive {
//           color: #6ee7ad;
//           font-weight: 800;
//         }

//         .chart {
//           position: relative;
//           height: 170px;
//           margin-top: 19px;
//           overflow: hidden;
//           border: 1px solid rgba(214, 168, 79, .18);
//           border-radius: 19px;
//           background: rgba(7, 16, 14, .6);
//         }

//         .chart-grid {
//           position: absolute;
//           inset: 0;
//           background-image:
//             linear-gradient(rgba(214, 168, 79, .12) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(214, 168, 79, .12) 1px, transparent 1px);
//           background-size: 100% 35px, 60px 100%;
//         }

//         .chart svg {
//           position: absolute;
//           inset: 23px 15px 18px;
//           width: calc(100% - 30px);
//           height: calc(100% - 41px);
//           overflow: visible;
//         }

//         .chart-path {
//           stroke-dasharray: 800;
//           stroke-dashoffset: 800;
//           animation: drawChart 2.2s 1s ease forwards;
//         }

//         @keyframes drawChart {
//           to { stroke-dashoffset: 0; }
//         }

//         .stats {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 10px;
//           margin-top: 13px;
//         }

//         .stat {
//           padding: 14px 12px;
//           border: 1px solid rgba(214, 168, 79, .14);
//           border-radius: 15px;
//           background: rgba(7, 16, 14, .6);
//         }

//         .stat small {
//           color: #9fb3a9;
//           font-size: 10px;
//         }

//         .stat strong {
//           display: block;
//           margin-top: 5px;
//           color: var(--text);
//           font-size: 15px;
//         }

//         .float-card {
//           position: absolute;
//           z-index: 4;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 13px 15px;
//           border: 1px solid rgba(214, 168, 79, .22);
//           border-radius: 16px;
//           color: var(--text);
//           background: rgba(13, 27, 23, .95);
//           box-shadow: 0 18px 36px rgba(0, 0, 0, .35);
//           font-size: 12px;
//           font-weight: 800;
//           animation: cardFloat 4.5s ease-in-out infinite;
//         }

//         .float-card.one {
//           top: 55px;
//           left: -58px;
//         }

//         .float-card.two {
//           right: -37px;
//           bottom: 64px;
//           animation-delay: 1.4s;
//         }

//         @keyframes cardFloat {
//           0%, 100% { transform: translateY(0) rotate(0); }
//           50% { transform: translateY(-11px) rotate(1deg); }
//         }

//         .float-icon {
//           width: 30px;
//           height: 30px;
//           display: grid;
//           place-items: center;
//           border-radius: 10px;
//           color: var(--emerald);
//           background: rgba(47, 189, 131, .14);
//         }

//         .float-icon svg {
//           width: 18px;
//           height: 18px;
//         }

//         .section {
//           padding: 115px 0;
//         }

//         .soft-section {
//           background: rgba(13, 27, 23, .55);
//         }

//         .section-heading {
//           max-width: 690px;
//           margin: 0 auto 52px;
//           text-align: center;
//         }

//         .kicker {
//           color: var(--gold-light);
//           font-size: 11px;
//           font-weight: 800;
//           letter-spacing: 1.5px;
//           text-transform: uppercase;
//         }

//         .section-heading h2,
//         .content-heading h2,
//         .faq-heading h2 {
//           margin-top: 14px;
//           color: var(--text);
//           font-family: "Space Grotesk", sans-serif;
//           font-size: clamp(35px, 4.7vw, 55px);
//           line-height: 1.08;
//           letter-spacing: -2.6px;
//         }

//         .section-heading p,
//         .content-heading p,
//         .faq-heading p {
//           margin-top: 16px;
//           color: var(--muted);
//           font-size: 15px;
//           line-height: 1.75;
//         }

//         .feature-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 19px;
//         }

//         .feature-card:hover,
//         .plan-card:hover,
//         .plan-card.selected {
//           border-color: rgba(214, 168, 79, .6);
//           box-shadow:
//             0 25px 70px rgba(0, 0, 0, .35),
//             0 0 35px rgba(214, 168, 79, .08);
//         }

//         .feature-card {
//           padding: 31px;
//           border-radius: 23px;
//           transition: transform .3s ease, box-shadow .3s ease, border .3s ease;
//         }

//         .feature-card:hover {
//           transform: translateY(-8px);
//         }

//         .feature-icon {
//           width: 54px;
//           height: 54px;
//           display: grid;
//           place-items: center;
//           border-radius: 17px;
//           color: var(--emerald);
//           background: rgba(47, 189, 131, .14);
//         }

//         .feature-card:nth-child(2) .feature-icon {
//           color: var(--gold);
//           background: rgba(214, 168, 79, .14);
//         }

//         .feature-card:nth-child(3) .feature-icon {
//           color: var(--purple);
//           background: rgba(157, 123, 255, .14);
//         }

//         .feature-icon svg {
//           width: 25px;
//           height: 25px;
//         }

//         .feature-card h3 {
//           margin-top: 23px;
//           color: var(--text);
//           font-family: "Space Grotesk", sans-serif;
//           font-size: 20px;
//           letter-spacing: -.6px;
//         }

//         .feature-card p {
//           margin-top: 10px;
//           color: var(--muted);
//           font-size: 14px;
//           line-height: 1.75;
//         }

//         .plans-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 19px;
//         }

//         .plan-card {
//           position: relative;
//           padding: 30px;
//           border-radius: 23px;
//           transition: transform .3s ease, box-shadow .3s ease, border .3s ease;
//         }

//         .plan-card.popular-card {
//           border: 1.5px solid rgba(214, 168, 79, .65);
//           box-shadow:
//             0 15px 38px rgba(0, 0, 0, .28),
//             0 0 28px rgba(214, 168, 79, .12);
//         }

//         .popular-badge {
//           position: absolute;
//           top: 19px;
//           right: 19px;
//           padding: 7px 10px;
//           border-radius: 99px;
//           color: var(--gold-light);
//           background: rgba(214, 168, 79, .16);
//           font-size: 9px;
//           font-weight: 800;
//           letter-spacing: .6px;
//           text-transform: uppercase;
//         }

//         .plan-name {
//           color: #9fb3a9;
//           font-size: 14px;
//           font-weight: 800;
//         }

//         .plan-rate {
//           margin-top: 22px;
//           color: var(--text);
//           font-family: "Space Grotesk", sans-serif;
//           font-size: 46px;
//           font-weight: 700;
//           letter-spacing: -2.5px;
//         }

//         .plan-rate span {
//           color: #9fb3a9;
//           font-family: "DM Sans", sans-serif;
//           font-size: 13px;
//           font-weight: 600;
//           letter-spacing: 0;
//         }

//         .plan-amount {
//           margin-top: 5px;
//           color: var(--gold-light);
//           font-size: 13px;
//           font-weight: 800;
//         }

//         .plan-label {
//           display: inline-block;
//           margin-top: 8px;
//           padding: 5px 9px;
//           border-radius: 7px;
//           color: #9fb3a9;
//           background: rgba(15, 24, 19, .75);
//           font-size: 10px;
//           font-weight: 700;
//         }

//         .plan-description {
//           min-height: 69px;
//           margin-top: 17px;
//           color: var(--muted);
//           font-size: 13px;
//           line-height: 1.65;
//         }

//         .plan-list {
//           display: grid;
//           gap: 12px;
//           margin-top: 20px;
//           padding-top: 20px;
//           border-top: 1px solid var(--line);
//           list-style: none;
//         }

//         .plan-list li {
//           display: flex;
//           gap: 8px;
//           align-items: flex-start;
//           color: #9fb3a9;
//           font-size: 12px;
//         }

//         .check-icon {
//           flex: 0 0 auto;
//           color: var(--emerald);
//         }

//         .plan-btn {
//           width: 100%;
//           margin-top: 25px;
//         }

//         .process-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 90px;
//           align-items: center;
//         }

//         .content-heading h2 {
//           max-width: 570px;
//         }

//         .content-heading p {
//           max-width: 520px;
//         }

//         .steps {
//           display: grid;
//           gap: 25px;
//           margin-top: 32px;
//         }

//         .step {
//           display: grid;
//           grid-template-columns: 48px 1fr;
//           gap: 15px;
//         }

//         .step-number {
//           width: 48px;
//           height: 48px;
//           display: grid;
//           place-items: center;
//           border-radius: 15px;
//           color: var(--gold);
//           background: rgba(214, 168, 79, .14);
//           font-size: 13px;
//           font-weight: 800;
//         }

//         .step h3 {
//           color: var(--text);
//           font-family: "Space Grotesk", sans-serif;
//           font-size: 17px;
//         }

//         .step p {
//           margin-top: 5px;
//           color: var(--muted);
//           font-size: 13px;
//           line-height: 1.65;
//         }

//         .trust-card {
//           padding: 37px;
//           border-radius: 28px;
//           background:
//             radial-gradient(circle at 100% 0, rgba(214, 168, 79, .12), transparent 18rem),
//             linear-gradient(145deg, rgba(13, 27, 23, .95), rgba(7, 16, 14, .95));
//           box-shadow: 0 22px 60px rgba(0, 0, 0, .28);
//         }

//         .trust-card h3 {
//           color: var(--text);
//           font-family: "Space Grotesk", sans-serif;
//           font-size: 26px;
//           letter-spacing: -.9px;
//         }

//         .trust-card > p {
//           margin-top: 12px;
//           color: var(--muted);
//           font-size: 14px;
//           line-height: 1.7;
//         }

//         .trust-points {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 15px;
//           margin-top: 27px;
//         }

//         .trust-point {
//           display: flex;
//           align-items: center;
//           gap: 9px;
//           color: #9fb3a9;
//           font-size: 12px;
//           font-weight: 700;
//         }

//         .trust-check {
//           width: 25px;
//           height: 25px;
//           display: grid;
//           place-items: center;
//           border-radius: 50%;
//           color: var(--emerald);
//           background: rgba(47, 189, 131, .14);
//         }

//         .trust-check svg {
//           width: 14px;
//           height: 14px;
//         }

//         .risk-note {
//           margin-top: 26px;
//           padding: 16px;
//           border: 1px solid rgba(214, 168, 79, .22);
//           border-radius: 15px;
//           color: #f0cd78;
//           background: rgba(214, 168, 79, .08);
//           font-size: 12px;
//           line-height: 1.65;
//         }

//         .faq-grid {
//           display: grid;
//           grid-template-columns: .75fr 1.25fr;
//           gap: 90px;
//           align-items: start;
//         }

//         .faq-list {
//           display: grid;
//           gap: 11px;
//         }

//         .faq-question {
//           width: 100%;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           gap: 14px;
//           padding: 21px;
//           border: 0;
//           color: var(--text);
//           background: transparent;
//           text-align: left;
//           font-size: 14px;
//           font-weight: 800;
//         }

//         .faq-plus {
//           color: var(--gold);
//           font-size: 25px;
//           font-weight: 400;
//           line-height: 1;
//           transition: transform .25s ease;
//         }

//         .faq-item.open .faq-plus {
//           transform: rotate(45deg);
//         }

//         .faq-answer {
//           max-height: 0;
//           padding: 0 21px;
//           color: var(--muted);
//           font-size: 13px;
//           line-height: 1.7;
//           overflow: hidden;
//           transition: max-height .35s ease, padding .35s ease;
//         }

//         .faq-item.open .faq-answer {
//           max-height: 160px;
//           padding-bottom: 21px;
//         }

//         .cta-section {
//           padding: 100px 0;
//         }

//         .cta-box {
//           position: relative;
//           overflow: hidden;
//           padding: 65px 75px;
//           border-radius: 30px;
//           color: #fff;
//           background: linear-gradient(120deg, #b8862f, #f0cd78);
//           box-shadow: 0 25px 65px rgba(214, 168, 79, .24);
//         }

//         .cta-box::before,
//         .cta-box::after {
//           content: "";
//           position: absolute;
//           border: 1px solid rgba(255,255,255,.2);
//           border-radius: 50%;
//         }

//         .cta-box::before {
//           width: 300px;
//           height: 300px;
//           right: -92px;
//           top: -105px;
//         }

//         .cta-box::after {
//           width: 430px;
//           height: 430px;
//           right: -155px;
//           top: -170px;
//           opacity: .55;
//         }

//         .cta-content {
//           position: relative;
//           z-index: 2;
//           max-width: 660px;
//         }

//         .cta-content h2 {
//           font-family: "Space Grotesk", sans-serif;
//           font-size: clamp(35px, 4.8vw, 56px);
//           line-height: 1.06;
//           letter-spacing: -2.6px;
//         }

//         .cta-content p {
//           max-width: 560px;
//           margin-top: 15px;
//           color: rgba(10, 8, 5, .78);
//           font-size: 15px;
//           line-height: 1.7;
//         }

//         .cta-content .btn {
//           margin-top: 28px;
//           color: #b8862f;
//           background: #fff;
//         }

//         .footer {
//           padding: 60px 0 30px;
//           border-top: 1px solid var(--line);
//           background: rgba(7, 16, 14, .55);
//         }

//         .footer-grid {
//           display: grid;
//           grid-template-columns: 1.5fr repeat(3, 1fr);
//           gap: 42px;
//         }

//         .footer-brand p {
//           max-width: 280px;
//           margin-top: 17px;
//           color: var(--muted);
//           font-size: 13px;
//           line-height: 1.7;
//         }

//         .footer h4 {
//           margin-bottom: 17px;
//           color: var(--text);
//           font-size: 13px;
//         }

//         .footer-links {
//           display: grid;
//           gap: 11px;
//           list-style: none;
//           color: var(--muted);
//           font-size: 13px;
//         }

//         .footer-links a:hover {
//           color: var(--gold-light);
//         }

//         .footer-bottom {
//           display: flex;
//           justify-content: space-between;
//           gap: 18px;
//           margin-top: 48px;
//           padding-top: 22px;
//           border-top: 1px solid var(--line);
//           color: #8b98a9;
//           font-size: 11px;
//           line-height: 1.6;
//         }

//         @media (max-width: 950px) {
//           .nav-links,
//           .nav-actions {
//             display: none;
//           }

//           .menu-button {
//             display: block;
//           }

//           .hero-grid,
//           .process-grid,
//           .faq-grid {
//             grid-template-columns: 1fr;
//             gap: 58px;
//           }

//           .hero {
//             padding-top: 35px;
//           }

//           .dashboard-area {
//             width: min(600px, 100%);
//             margin: auto;
//           }

//           .float-card.one {
//             left: -18px;
//           }

//           .float-card.two {
//             right: -12px;
//           }

//           .footer-grid {
//             grid-template-columns: 1.4fr 1fr 1fr;
//           }

//           .footer-grid > div:last-child {
//             display: none;
//           }
//         }

//         @media (max-width: 680px) {
//           .container {
//             width: min(100% - 30px, 550px);
//           }

//           .navbar {
//             height: 74px;
//           }

//           .hero {
//             min-height: auto;
//             padding: 42px 0 80px;
//           }

//           .hero h1 {
//             font-size: 48px;
//             letter-spacing: -3px;
//           }

//           .hero-copy {
//             font-size: 15px;
//           }

//           .hero-buttons {
//             display: grid;
//             grid-template-columns: 1fr;
//           }

//           .hero-buttons .btn {
//             width: 100%;
//           }

//           .dashboard {
//             padding: 15px;
//             border-radius: 23px;
//           }

//           .balance {
//             padding: 19px;
//           }

//           .balance-amount {
//             font-size: 29px;
//           }

//           .float-card {
//             display: none;
//           }

//           .section {
//             padding: 78px 0;
//           }

//           .section-heading {
//             margin-bottom: 35px;
//           }

//           .section-heading h2,
//           .content-heading h2,
//           .faq-heading h2 {
//             font-size: 37px;
//             letter-spacing: -1.8px;
//           }

//           .feature-grid,
//           .plans-grid {
//             grid-template-columns: 1fr;
//           }

//           .feature-card,
//           .plan-card {
//             padding: 26px;
//           }

//           .brand-logo-wrap {
//             width: 12rem;
//             height: 12rem;
//           }

//           .trust-card {
//             padding: 25px;
//           }

//           .trust-points {
//             grid-template-columns: 1fr;
//           }

//           .cta-section {
//             padding: 72px 0;
//           }

//           .cta-box {
//             padding: 41px 25px;
//             border-radius: 23px;
//           }

//           .cta-content h2 {
//             font-size: 38px;
//             letter-spacing: -1.9px;
//           }

//           .footer-grid {
//             grid-template-columns: 1fr 1fr;
//             gap: 30px;
//           }

//           .footer-grid > div:first-child {
//             grid-column: 1 / -1;
//           }

//           .footer-bottom {
//             display: block;
//           }

//           .footer-bottom span {
//             display: block;
//             margin-top: 8px;
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           *,
//           *::before,
//           *::after {
//             animation-duration: .01ms !important;
//             animation-iteration-count: 1 !important;
//             scroll-behavior: auto !important;
//             transition-duration: .01ms !important;
//           }
//         }
//       `}</style>

//       <header className="container navbar">
//         <button className="brand" onClick={() => goTo("home")}>
//           <BrandLogo />
//         </button>

//         <nav className="nav-links">
//           <a href="#home">Overview</a>
//           <a href="#plans">Mining plans</a>
//           <a href="#how-it-works">How it works</a>
//           <a href="#transparency">Infrastructure</a>
//           <a href="#faq">FAQ</a>
//         </nav>

//         <div className="nav-actions">
//           <button
//             className="btn btn-outline"
//             onClick={() => navigate("/auth/login")}
//           >
//             Sign in
//           </button>
//           <button
//             onClick={() => navigate("/auth/register")}
//             className="btn btn-primary"
//           >
//             Get started <Arrow />
//           </button>
//         </div>

//         <button
//           className="menu-button"
//           onClick={() => setMenuOpen((state) => !state)}
//           aria-label="Open menu"
//         >
//           {menuOpen ? "×" : "☰"}
//         </button>

//         {menuOpen && (
//           <div className="mobile-menu">
//             <a href="#home" onClick={() => setMenuOpen(false)}>
//               Overview
//             </a>
//             <a href="#plans" onClick={() => setMenuOpen(false)}>
//               Mining plans
//             </a>
//             <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
//               How it works
//             </a>
//             <a href="#transparency" onClick={() => setMenuOpen(false)}>
//               Infrastructure
//             </a>
//             <a href="#faq" onClick={() => setMenuOpen(false)}>
//               FAQ
//             </a>
//             <button onClick={() => navigate("/auth/register")}>
//               Get started
//             </button>
//           </div>
//         )}
//       </header>

//       <main>
//         <section id="home" className="hero">
//           <div className="container hero-grid">
//             <div>
//               <div className="eyebrow">
//                 <span className="eyebrow-dot" />
//                 Premium digital mining infrastructure
//               </div>

//               <h1>
//                 Powering the future of <span>digital mining.</span>
//               </h1>

//               <p className="hero-copy">
//                 Access a premium digital-mining experience built around
//                 transparent operations, intelligent hashrate tracking and clear
//                 information at every step.
//               </p>

//               <div className="hero-buttons">
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => goTo("plans")}
//                 >
//                   Explore mining plans <Arrow />
//                 </button>

//                 <button
//                   className="btn btn-light"
//                   onClick={() => goTo("how-it-works")}
//                 >
//                   Learn how it works
//                 </button>
//               </div>

//               <div className="hero-note">
//                 <span className="note-icon">
//                   <Check />
//                 </span>
//                 Track hashrate, uptime and mining performance
//               </div>
//             </div>

//             <div className="dashboard-area">
//               <div className="dashboard-glow" />

//               <div className="float-card one">
//                 <span className="float-icon">
//                   <Chart />
//                 </span>
//                 Hashrate optimized
//               </div>

//               <div className="float-card two">
//                 <span className="float-icon">
//                   <Shield />
//                 </span>
//                 Secure mining infrastructure
//               </div>

//               <div className="dashboard">
//                 <div className="dashboard-top">
//                   <span className="dashboard-label">
//                     Mining operations overview
//                   </span>
//                   <span className="active-status">
//                     <span className="status-dot" />
//                     Mining active
//                   </span>
//                 </div>

//                 <div className="balance">
//                   <small>Estimated mining output</small>
//                   <div className="balance-amount">2,840.50 USDT</div>

//                   <div className="balance-bottom">
//                     <span>Current hashrate</span>
//                     <span className="positive">+12.40%</span>
//                   </div>
//                 </div>

//                 <div className="chart">
//                   <div className="chart-grid" />
//                   <svg viewBox="0 0 440 130" preserveAspectRatio="none">
//                     <defs>
//                       <linearGradient
//                         id="chartFill"
//                         x1="0"
//                         x2="0"
//                         y1="0"
//                         y2="1"
//                       >
//                         <stop
//                           offset="0%"
//                           stopColor="#2fbd83"
//                           stopOpacity=".25"
//                         />
//                         <stop
//                           offset="100%"
//                           stopColor="#2fbd83"
//                           stopOpacity="0"
//                         />
//                       </linearGradient>
//                     </defs>

//                     <path
//                       d="M0 112 C33 104 47 107 74 86 S113 91 138 69 S176 78 202 59 S239 71 265 43 S307 59 335 32 S385 44 440 8 L440 130 L0 130Z"
//                       fill="url(#chartFill)"
//                     />

//                     <path
//                       className="chart-path"
//                       d="M0 112 C33 104 47 107 74 86 S113 91 138 69 S176 78 202 59 S239 71 265 43 S307 59 335 32 S385 44 440 8"
//                       fill="none"
//                       stroke="#2fbd83"
//                       strokeWidth="3.2"
//                       strokeLinecap="round"
//                     />
//                   </svg>
//                 </div>

//                 <div className="stats">
//                   <div className="stat">
//                     <small>Hashrate</small>
//                     <strong>184.6 TH/s</strong>
//                   </div>
//                   <div className="stat">
//                     <small>Uptime</small>
//                     <strong>99.2%</strong>
//                   </div>
//                   <div className="stat">
//                     <small>Next payout</small>
//                     <strong>18h 42m</strong>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="section soft-section">
//           <div className="container">
//             <div className="section-heading reveal">
//               <div className="kicker">The mining edge</div>
//               <h2>Built for serious digital-mining operations.</h2>
//               <p>
//                 Powerful infrastructure, clear performance data and a premium
//                 experience designed for the next generation of mining.
//               </p>
//             </div>

//             <div className="feature-grid">
//               <div className="feature-card reveal">
//                 <div className="feature-icon">
//                   <Chart />
//                 </div>
//                 <h3>Real-time hashrate</h3>
//                 <p>
//                   Monitor hashrate, uptime and mining activity through a clean
//                   operational dashboard.
//                 </p>
//               </div>

//               <div className="feature-card reveal">
//                 <div className="feature-icon">
//                   <Shield />
//                 </div>
//                 <h3>Secure infrastructure</h3>
//                 <p>
//                   Designed around transparent operations, secure access and
//                   visible mining performance information.
//                 </p>
//               </div>

//               <div className="feature-card reveal">
//                 <div className="feature-icon">
//                   <Sparkle />
//                 </div>
//                 <h3>Optimized efficiency</h3>
//                 <p>
//                   Present mining capacity, uptime and output data in a premium
//                   and understandable format.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section id="plans" className="section">
//           <div className="container">
//             <div className="section-heading reveal">
//               <div className="kicker">Mining plans</div>
//               <h2>Choose your mining capacity.</h2>
//               <p>
//                 Review each package and understand the applicable terms before
//                 proceeding.
//               </p>
//             </div>

//             <div className="plans-grid">
//               {plans.map((plan) => (
//                 <div
//                   className={`plan-card reveal ${
//                     selectedPlan === plan.name ? "selected" : ""
//                   } ${plan.popular ? "popular-card" : ""}`}
//                   key={plan.name}
//                 >
//                   {plan.popular && (
//                     <span className="popular-badge">Most selected</span>
//                   )}

//                   <div className="plan-name">{plan.name}</div>

//                   <div className="plan-rate">
//                     {plan.rate}{" "}
//                     <span>
//                       {plan.name === "Mining Partner"
//                         ? "commission"
//                         : "hashrate"}
//                     </span>
//                   </div>

//                   <div className="plan-amount">{plan.amount}</div>
//                   <span className="plan-label">{plan.label}</span>

//                   <p className="plan-description">
//                     Select a mining package, review the applicable terms and
//                     monitor your assigned digital-mining performance.
//                   </p>

//                   <ul className="plan-list">
//                     <li>
//                       <span className="check-icon">
//                         <Check />
//                       </span>
//                       Dedicated mining allocation
//                     </li>
//                     <li>
//                       <span className="check-icon">
//                         <Check />
//                       </span>
//                       Hashrate activity tracking
//                     </li>
//                     <li>
//                       <span className="check-icon">
//                         <Check />
//                       </span>
//                       Transparent payout conditions
//                     </li>
//                   </ul>

//                   <button
//                     className={`btn plan-btn ${
//                       selectedPlan === plan.name ? "btn-primary" : "btn-outline"
//                     }`}
//                     onClick={() => setSelectedPlan(plan.name)}
//                   >
//                     {selectedPlan === plan.name
//                       ? "Mining plan selected"
//                       : "Select mining plan"}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section id="how-it-works" className="section soft-section">
//           <div className="container process-grid">
//             <div className="content-heading reveal">
//               <div className="kicker">How it works</div>
//               <h2>A simple process from start to review.</h2>
//               <p>
//                 Take your time, understand the details and use the platform only
//                 when you are comfortable with the applicable terms and risks.
//               </p>

//               <div className="steps">
//                 <div className="step">
//                   <div className="step-number">01</div>
//                   <div>
//                     <h3>Create your account</h3>
//                     <p>Enter your details and set up secure access.</p>
//                   </div>
//                 </div>

//                 <div className="step">
//                   <div className="step-number">02</div>
//                   <div>
//                     <h3>Complete verification</h3>
//                     <p>Follow applicable identity and security checks.</p>
//                   </div>
//                 </div>

//                 <div className="step">
//                   <div className="step-number">03</div>
//                   <div>
//                     <h3>Select a mining plan</h3>
//                     <p>
//                       Check hashrate, amount range, timing, fees and conditions.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="step">
//                   <div className="step-number">04</div>
//                   <div>
//                     <h3>Monitor your mining</h3>
//                     <p>
//                       Track hashrate, uptime and payouts according to the
//                       published terms.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div id="transparency" className="trust-card reveal">
//               <h3>Information you should always see</h3>
//               <p>
//                 A trustworthy experience starts with accessible information.
//                 These details should be visible before participation.
//               </p>

//               <div className="trust-points">
//                 {[
//                   "Company details",
//                   "Fees and charges",
//                   "Withdrawal terms",
//                   "Custody information",
//                   "Risk disclosures",
//                   "Support channels",
//                 ].map((item) => (
//                   <div className="trust-point" key={item}>
//                     <span className="trust-check">
//                       <Check />
//                     </span>
//                     {item}
//                   </div>
//                 ))}
//               </div>

//               <div className="risk-note">
//                 Digital-mining operations are subject to volatility, network
//                 difficulty and operational factors. Stated hashrates and outputs
//                 are not guaranteed, and participation may result in partial or
//                 complete loss of capital.
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="section">
//           <div className="container">
//             <div className="section-heading reveal">
//               <div className="kicker">Transparency first</div>
//               <h2>Good decisions need complete information.</h2>
//               <p>
//                 Keep legal entity details, fees, custody model, withdrawal rules
//                 and risk information visible and easy to verify.
//               </p>
//             </div>

//             <div className="feature-grid">
//               <div className="feature-card reveal">
//                 <div className="feature-icon">
//                   <Shield />
//                 </div>
//                 <h3>Clear disclosures</h3>
//                 <p>
//                   Explain volatility, potential losses and program limitations
//                   in plain language.
//                 </p>
//               </div>

//               <div className="feature-card reveal">
//                 <div className="feature-icon">
//                   <Wallet />
//                 </div>
//                 <h3>Visible conditions</h3>
//                 <p>
//                   Show minimum amounts, fees, withdrawal timelines and
//                   restrictions.
//                 </p>
//               </div>

//               <div className="feature-card reveal">
//                 <div className="feature-icon">
//                   <Sparkle />
//                 </div>
//                 <h3>Responsible messaging</h3>
//                 <p>
//                   Avoid claims such as guaranteed profits, risk-free income or
//                   fixed returns.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section id="faq" className="section soft-section">
//           <div className="container faq-grid">
//             <div className="faq-heading reveal">
//               <div className="kicker">Need to know</div>
//               <h2>Questions, answered simply.</h2>
//               <p>
//                 Before participating, make sure you understand the product,
//                 risks and conditions.
//               </p>
//             </div>

//             <div className="faq-list">
//               {faqs.map((faq, index) => (
//                 <div
//                   className={`faq-item reveal ${
//                     openFaq === index ? "open" : ""
//                   }`}
//                   key={faq.q}
//                 >
//                   <button
//                     className="faq-question"
//                     onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
//                   >
//                     {faq.q}
//                     <span className="faq-plus">+</span>
//                   </button>

//                   <div className="faq-answer">{faq.a}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="cta-section">
//           <div className="container">
//             <div className="cta-box reveal">
//               <div className="cta-content">
//                 <h2>Enter the next era of digital mining.</h2>
//                 <p>
//                   Explore mining plans, review the infrastructure and monitor
//                   your performance with complete clarity.
//                 </p>
//                 <button className="btn" onClick={() => goTo("plans")}>
//                   Explore mining plans <Arrow />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       <footer className="footer">
//         <div className="container">
//           <div className="footer-grid">
//             <div className="footer-brand">
//               <p>
//                 Premium digital-mining infrastructure with clear performance
//                 data, transparent terms and an experience built for informed
//                 participation.
//               </p>
//             </div>

//             <div>
//               <h4>Platform</h4>
//               <ul className="footer-links">
//                 <li>
//                   <a href="#plans">Mining plans</a>
//                 </li>
//                 <li>
//                   <a href="#how-it-works">How it works</a>
//                 </li>
//                 <li>
//                   <a href="#transparency">Infrastructure</a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4>Resources</h4>
//               <ul className="footer-links">
//                 <li>
//                   <a href="#faq">FAQ</a>
//                 </li>
//                 <li>
//                   <a href="#transparency">Risk disclosure</a>
//                 </li>
//                 <li>
//                   <a href="#home">Privacy policy</a>
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h4>Contact</h4>
//               <ul className="footer-links">
//                 <li>
//                   <a href="mailto:support@example.com">Support center</a>
//                 </li>
//                 <li>
//                   <a href="mailto:support@example.com">Email support</a>
//                 </li>
//                 <li>
//                   <a href="#faq">Help & questions</a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="footer-bottom">
//             <span>© 2026 CalmVest. All rights reserved.</span>
//             <span>
//               Digital-mining operations are subject to volatility and
//               operational risk. This website does not provide financial advice.
//             </span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/earnio1.png";

const plans = [
  {
    name: "Starter Miner",
    amount: "1–100 USDT",
    rate: "12 TH/s",
    label: "Entry mining",
    color: "blue",
  },
  {
    name: "Pro Mining",
    amount: "500–1,000 USDT",
    rate: "86 TH/s",
    label: "Most selected",
    color: "purple",
    popular: true,
  },
  {
    name: "Mining Partner",
    amount: "Referral program",
    rate: "1%",
    label: "Partner rewards",
    color: "green",
  },
];

const faqs = [
  {
    q: "Are mining returns guaranteed?",
    a: "No. Digital-mining operations are subject to volatility, network difficulty and operational factors. Any displayed hashrate or output is a target or program term and must not be considered a guaranteed return.",
  },
  {
    q: "How can I get started?",
    a: "Create your account, complete the applicable verification, review all terms and select a mining plan only after understanding the risks and conditions.",
  },
  {
    q: "How does the affiliate program work?",
    a: "Eligible users may receive referral commission according to the published affiliate terms and verification requirements.",
  },
  {
    q: "What should I check before participating?",
    a: "Check the legal entity, registration information, custody model, fees, withdrawal rules, support details and risk disclosures.",
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Shield() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 19 6v5.5c0 4.7-2.9 7.7-7 9.5-4.1-1.8-7-4.8-7-9.5V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12 2.3 2.3 4.8-4.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chart() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19V5M4 19h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m7 15 3.5-3.5 2.5 2 5-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Wallet() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M5 7V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 8h13.5A1.5 1.5 0 0 1 20 9.5V14h-4a2 2 0 1 1 0-4h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="12" r=".8" fill="currentColor" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.8 13.7 9l6.3 1.7-6.3 1.7-1.7 6.3-1.7-6.3L4 10.7 10.3 9 12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandLogo() {
  return (
    <span className="brand-logo-wrap">
      <img src={logo} alt="CalmVest" className="brand-logo-img h-4 w-4" />
    </span>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro Mining");
  const [openFaq, setOpenFaq] = useState(0);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMenuOpen(false);
  };

  return (
    <div className={`site ${visible ? "site-loaded" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        :root {
          --dark: #101a2c;
          --text: #17243a;
          --muted: #718097;
          --blue: #2867ef;
          --blue-dark: #1550d3;
          --line: #e6edf6;
          --soft: #f6f9fd;
          --green: #19a47c;
          --purple: #7b55df;
          --gold: #c9973c;
          --gold-light: #f0cd78;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          background: #fff;
          color: var(--text);
          font-family: "DM Sans", sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .site {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 90% 3%, rgba(221, 238, 255, .75), transparent 29rem),
            #fff;
        }

        .container {
          width: min(1180px, calc(100% - 42px));
          margin: auto;
        }

        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition:
            opacity .8s ease,
            transform .8s cubic-bezier(.22, 1, .36, 1);
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .navbar {
          position: relative;
          z-index: 100;
          height: 88px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;

          border: 0;
          color: var(--dark);
          background: transparent;
          font-family: "Space Grotesk", sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -.7px;
        }

        .brand-logo-wrap {
          flex: 0 0 auto;
          width: 20rem;
          height: 20rem;
          display: grid;
          margin: auto;
          place-items: center;
          overflow: hidden;
          border-radius: 13px;
        }

        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-4px) rotate(3deg); }
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 31px;
          color: #687890;
          font-size: 13px;
          font-weight: 700;
        }

        .nav-links a {
          position: relative;
          padding: 8px 0;
        }

        .nav-links a::after {
          content: "";
          position: absolute;
          left: 0;
          right: 100%;
          bottom: 0;
          height: 2px;
          border-radius: 5px;
          background: var(--blue);
          transition: right .25s ease;
        }

        .nav-links a:hover {
          color: var(--blue);
        }

        .nav-links a:hover::after {
          right: 0;
        }

        .nav-actions {
          display: flex;
          gap: 11px;
          align-items: center;
        }

        .btn {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 21px;
          border: 0;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 800;
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
        }

        .btn svg {
          width: 17px;
          height: 17px;
        }

        .btn-primary {
          color: #fff;
          background: var(--blue);
          box-shadow: 0 13px 26px rgba(40, 103, 239, .22);
        }

        .btn-primary:hover {
          background: var(--blue-dark);
          transform: translateY(-3px);
          box-shadow: 0 17px 30px rgba(40, 103, 239, .3);
        }

        .btn-light {
          color: var(--blue);
          background: #edf4ff;
        }

        .btn-light:hover {
          background: #deebff;
          transform: translateY(-2px);
        }

        .btn-outline {
          color: var(--text);
          border: 1px solid var(--line);
          background: #fff;
        }

        .btn-outline:hover {
          border-color: #bdd2f0;
          transform: translateY(-2px);
        }

        .menu-button {
          display: none;
          width: 43px;
          height: 43px;
          border: 1px solid var(--line);
          border-radius: 13px;
          color: var(--text);
          background: #fff;
          font-size: 22px;
        }

        .mobile-menu {
          position: absolute;
          top: 76px;
          left: 0;
          right: 0;
          display: grid;
          gap: 4px;
          padding: 12px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: rgba(255,255,255,.98);
          box-shadow: 0 22px 60px rgba(29, 62, 108, .15);
          animation: menuIn .25s ease both;
        }

        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-menu a,
        .mobile-menu button {
          padding: 14px;
          border: 0;
          border-radius: 11px;
          color: var(--text);
          background: transparent;
          text-align: left;
          font-size: 14px;
          font-weight: 700;
        }

        .mobile-menu a:hover,
        .mobile-menu button:hover {
          background: #f2f7ff;
          color: var(--blue);
        }

        .hero {
          position: relative;
          min-height: 710px;
          display: flex;
          align-items: center;
          padding: 55px 0 120px;
        }

        .hero::before {
          content: "";
          position: absolute;
          left: -160px;
          top: 110px;
          width: 330px;
          height: 330px;
          border-radius: 50%;
          background: rgba(224, 241, 255, .8);
          filter: blur(70px);
          animation: pulseBlob 6s ease-in-out infinite;
        }

        @keyframes pulseBlob {
          0%, 100% { transform: scale(1); opacity: .65; }
          50% { transform: scale(1.16); opacity: .9; }
        }

        .hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr .9fr;
          gap: 78px;
          align-items: center;
        }

        .eyebrow {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 13px;
          border: 1px solid #dbe9ff;
          border-radius: 100px;
          color: var(--blue);
          background: #f4f8ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          animation: fadeUp .7s .15s both;
        }

        .eyebrow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2bc493;
          box-shadow: 0 0 0 5px rgba(43, 196, 147, .14);
        }

        .hero h1 {
          max-width: 670px;
          margin-top: 25px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(47px, 6.2vw, 78px);
          line-height: 1.01;
          letter-spacing: -4.8px;
          animation: fadeUp .7s .25s both;
        }

        .hero h1 span {
          color: var(--blue);
          background: linear-gradient(100deg, #2867ef, #6f50d9);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-copy {
          max-width: 560px;
          margin-top: 25px;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.75;
          animation: fadeUp .7s .35s both;
        }

        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
          animation: fadeUp .7s .45s both;
        }

        .hero-note {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 27px;
          color: #718096;
          font-size: 12px;
          font-weight: 600;
          animation: fadeUp .7s .55s both;
        }

        .note-icon {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: var(--green);
          background: #e7faf3;
        }

        .note-icon svg,
        .check-icon svg {
          width: 16px;
          height: 16px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dashboard-area {
          position: relative;
          animation: dashboardIn .9s .25s both;
        }

        @keyframes dashboardIn {
          from { opacity: 0; transform: translateY(30px) scale(.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dashboard-glow {
          position: absolute;
          width: 390px;
          height: 390px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: rgba(204, 229, 255, .75);
          filter: blur(60px);
          animation: dashboardGlow 5s ease-in-out infinite;
        }

        @keyframes dashboardGlow {
          0%, 100% { opacity: .7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        .dashboard,
        .feature-card,
        .plan-card,
        .trust-card,
        .faq-item {
          border: 1px solid var(--line);
          background: #fff;
          box-shadow: 0 12px 32px rgba(37, 76, 120, .035);
        }

        .dashboard {
          position: relative;
          z-index: 2;
          padding: 22px;
          border-radius: 29px;
          backdrop-filter: blur(18px);
        }

        .dashboard-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 21px;
        }

        .dashboard-label {
          color: #78879a;
          font-size: 12px;
          font-weight: 700;
        }

        .active-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #19a47c;
          font-size: 11px;
          font-weight: 800;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #26c291;
          box-shadow: 0 0 0 5px rgba(38, 194, 145, .13);
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(38,194,145,.12); }
          50% { box-shadow: 0 0 0 8px rgba(38,194,145,.04); }
        }

        .balance {
          padding: 23px;
          border-radius: 21px;
          color: #fff;
          background: linear-gradient(135deg, #347fff, #194cc8);
          box-shadow: 0 17px 32px rgba(40, 103, 239, .27);
        }

        .balance small {
          opacity: .72;
          font-size: 12px;
        }

        .balance-amount {
          margin-top: 8px;
          font-family: "Space Grotesk", sans-serif;
          font-size: 35px;
          font-weight: 700;
          letter-spacing: -1.5px;
        }

        .balance-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 22px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,.22);
          font-size: 12px;
        }

        .positive {
          color: #bdffe8;
          font-weight: 800;
        }

        .chart {
          position: relative;
          height: 170px;
          margin-top: 19px;
          overflow: hidden;
          border: 1px solid #ecf1f7;
          border-radius: 19px;
          background: #fbfdff;
        }

        .chart-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(#edf3f8 1px, transparent 1px),
            linear-gradient(90deg, #edf3f8 1px, transparent 1px);
          background-size: 100% 35px, 60px 100%;
        }

        .chart svg {
          position: absolute;
          inset: 23px 15px 18px;
          width: calc(100% - 30px);
          height: calc(100% - 41px);
          overflow: visible;
        }

        .chart-path {
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          animation: drawChart 2.2s 1s ease forwards;
        }

        @keyframes drawChart {
          to { stroke-dashoffset: 0; }
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 13px;
        }

        .stat {
          padding: 14px 12px;
          border: 1px solid #edf1f6;
          border-radius: 15px;
          background: #fff;
        }

        .stat small {
          color: #8996a7;
          font-size: 10px;
        }

        .stat strong {
          display: block;
          margin-top: 5px;
          color: var(--dark);
          font-size: 15px;
        }

        .float-card {
          position: absolute;
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 15px;
          border: 1px solid #e2ecf6;
          border-radius: 16px;
          color: var(--dark);
          background: rgba(255,255,255,.95);
          box-shadow: 0 18px 36px rgba(38, 76, 117, .15);
          font-size: 12px;
          font-weight: 800;
          animation: cardFloat 4.5s ease-in-out infinite;
        }

        .float-card.one {
          top: 55px;
          left: -58px;
        }

        .float-card.two {
          right: -37px;
          bottom: 64px;
          animation-delay: 1.4s;
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-11px) rotate(1deg); }
        }

        .float-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #18a47b;
          background: #e7faf3;
        }

        .float-icon svg {
          width: 18px;
          height: 18px;
        }

        .section {
          padding: 115px 0;
        }

        .soft-section {
          background: #f7faff;
        }

        .section-heading {
          max-width: 690px;
          margin: 0 auto 52px;
          text-align: center;
        }

        .kicker {
          color: var(--blue);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .section-heading h2,
        .content-heading h2,
        .faq-heading h2 {
          margin-top: 14px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(35px, 4.7vw, 55px);
          line-height: 1.08;
          letter-spacing: -2.6px;
        }

        .section-heading p,
        .content-heading p,
        .faq-heading p {
          margin-top: 16px;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.75;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 19px;
        }

        .feature-card:hover,
        .plan-card:hover,
        .plan-card.selected {
          border-color: #aac9fc;
          transform: translateY(-8px);
          box-shadow: 0 22px 48px rgba(40, 103, 239, .13);
        }

        .feature-card {
          padding: 31px;
          border-radius: 23px;
          transition: transform .3s ease, box-shadow .3s ease, border .3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
        }

        .feature-icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          color: var(--blue);
          background: #edf5ff;
        }

        .feature-card:nth-child(2) .feature-icon {
          color: var(--green);
          background: #e9faf4;
        }

        .feature-card:nth-child(3) .feature-icon {
          color: var(--purple);
          background: #f3efff;
        }

        .feature-icon svg {
          width: 25px;
          height: 25px;
        }

        .feature-card h3 {
          margin-top: 23px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 20px;
          letter-spacing: -.6px;
        }

        .feature-card p {
          margin-top: 10px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.75;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 19px;
        }

        .plan-card {
          position: relative;
          padding: 30px;
          border-radius: 23px;
          transition: transform .3s ease, box-shadow .3s ease, border .3s ease;
        }

        .plan-card.popular-card {
          border: 1.5px solid #8eb8ff;
          box-shadow: 0 15px 38px rgba(40, 103, 239, .08);
        }

        .popular-badge {
          position: absolute;
          top: 19px;
          right: 19px;
          padding: 7px 10px;
          border-radius: 99px;
          color: var(--blue);
          background: #eaf3ff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .6px;
          text-transform: uppercase;
        }

        .plan-name {
          color: #697890;
          font-size: 14px;
          font-weight: 800;
        }

        .plan-rate {
          margin-top: 22px;
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 46px;
          font-weight: 700;
          letter-spacing: -2.5px;
        }

        .plan-rate span {
          color: #78869a;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0;
        }

        .plan-amount {
          margin-top: 5px;
          color: var(--blue);
          font-size: 13px;
          font-weight: 800;
        }

        .plan-label {
          display: inline-block;
          margin-top: 8px;
          padding: 5px 9px;
          border-radius: 7px;
          color: #75849a;
          background: #f4f7fb;
          font-size: 10px;
          font-weight: 700;
        }

        .plan-description {
          min-height: 69px;
          margin-top: 17px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .plan-list {
          display: grid;
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--line);
          list-style: none;
        }

        .plan-list li {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          color: #65758b;
          font-size: 12px;
        }

        .check-icon {
          flex: 0 0 auto;
          color: var(--green);
        }

        .plan-btn {
          width: 100%;
          margin-top: 25px;
        }

        .process-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 90px;
          align-items: center;
        }

        .content-heading h2 {
          max-width: 570px;
        }

        .content-heading p {
          max-width: 520px;
        }

        .steps {
          display: grid;
          gap: 25px;
          margin-top: 32px;
        }

        .step {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 15px;
        }

        .step-number {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: var(--blue);
          background: #eaf3ff;
          font-size: 13px;
          font-weight: 800;
        }

        .step h3 {
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 17px;
        }

        .step p {
          margin-top: 5px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.65;
        }

        .trust-card {
          padding: 37px;
          border-radius: 28px;
          background:
            radial-gradient(circle at 100% 0, rgba(196, 228, 255, .7), transparent 18rem),
            linear-gradient(145deg, #f1f7ff, #fff);
          box-shadow: 0 22px 60px rgba(35, 80, 130, .08);
        }

        .trust-card h3 {
          color: var(--dark);
          font-family: "Space Grotesk", sans-serif;
          font-size: 26px;
          letter-spacing: -.9px;
        }

        .trust-card > p {
          margin-top: 12px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .trust-points {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 27px;
        }

        .trust-point {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #586a80;
          font-size: 12px;
          font-weight: 700;
        }

        .trust-check {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #14916b;
          background: #daf7ec;
        }

        .trust-check svg {
          width: 14px;
          height: 14px;
        }

        .risk-note {
          margin-top: 26px;
          padding: 16px;
          border: 1px solid #f1dfb8;
          border-radius: 15px;
          color: #8c6c32;
          background: #fffaf0;
          font-size: 12px;
          line-height: 1.65;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: .75fr 1.25fr;
          gap: 90px;
          align-items: start;
        }

        .faq-list {
          display: grid;
          gap: 11px;
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 21px;
          border: 0;
          color: var(--dark);
          background: transparent;
          text-align: left;
          font-size: 14px;
          font-weight: 800;
        }

        .faq-plus {
          color: var(--blue);
          font-size: 25px;
          font-weight: 400;
          line-height: 1;
          transition: transform .25s ease;
        }

        .faq-item.open .faq-plus {
          transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0;
          padding: 0 21px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
          overflow: hidden;
          transition: max-height .35s ease, padding .35s ease;
        }

        .faq-item.open .faq-answer {
          max-height: 160px;
          padding-bottom: 21px;
        }

        .cta-section {
          padding: 100px 0;
          background: #f7faff;
        }

        .cta-box {
          position: relative;
          overflow: hidden;
          padding: 65px 75px;
          border-radius: 30px;
          color: #fff;
          background: linear-gradient(120deg, #205ad9, #4c86f4);
          box-shadow: 0 25px 65px rgba(40, 103, 239, .24);
        }

        .cta-box::before,
        .cta-box::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 50%;
        }

        .cta-box::before {
          width: 300px;
          height: 300px;
          right: -92px;
          top: -105px;
        }

        .cta-box::after {
          width: 430px;
          height: 430px;
          right: -155px;
          top: -170px;
          opacity: .55;
        }

        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 660px;
        }

        .cta-content h2 {
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(35px, 4.8vw, 56px);
          line-height: 1.06;
          letter-spacing: -2.6px;
        }

        .cta-content p {
          max-width: 560px;
          margin-top: 15px;
          color: rgba(255,255,255,.78);
          font-size: 15px;
          line-height: 1.7;
        }

        .cta-content .btn {
          margin-top: 28px;
          color: var(--blue);
          background: #fff;
        }

        .footer {
          padding: 60px 0 30px;
          border-top: 1px solid var(--line);
          background: #fff;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 42px;
        }

        .footer-brand p {
          max-width: 280px;
          margin-top: 17px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .footer h4 {
          margin-bottom: 17px;
          color: var(--dark);
          font-size: 13px;
        }

        .footer-links {
          display: grid;
          gap: 11px;
          list-style: none;
          color: var(--muted);
          font-size: 13px;
        }

        .footer-links a:hover {
          color: var(--blue);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-top: 48px;
          padding-top: 22px;
          border-top: 1px solid var(--line);
          color: #8b98a9;
          font-size: 11px;
          line-height: 1.6;
        }

        @media (max-width: 950px) {
          .nav-links,
          .nav-actions {
            display: none;
          }

          .menu-button {
            display: block;
          }

          .hero-grid,
          .process-grid,
          .faq-grid {
            grid-template-columns: 1fr;
            gap: 58px;
          }

          .hero {
            padding-top: 35px;
          }

          .dashboard-area {
            width: min(600px, 100%);
            margin: auto;
          }

          .float-card.one {
            left: -18px;
          }

          .float-card.two {
            right: -12px;
          }

          .footer-grid {
            grid-template-columns: 1.4fr 1fr 1fr;
          }

          .footer-grid > div:last-child {
            display: none;
          }
        }

        @media (max-width: 680px) {
          .container {
            width: min(100% - 30px, 550px);
          }

          .navbar {
            height: 74px;
          }

          .hero {
            min-height: auto;
            padding: 42px 0 80px;
          }

          .hero h1 {
            font-size: 48px;
            letter-spacing: -3px;
          }

          .hero-copy {
            font-size: 15px;
          }

          .hero-buttons {
            display: grid;
            grid-template-columns: 1fr;
          }

          .hero-buttons .btn {
            width: 100%;
          }

          .dashboard {
            padding: 15px;
            border-radius: 23px;
          }

          .balance {
            padding: 19px;
          }

          .balance-amount {
            font-size: 29px;
          }

          .float-card {
            display: none;
          }

          .section {
            padding: 78px 0;
          }

          .section-heading {
            margin-bottom: 35px;
          }

          .section-heading h2,
          .content-heading h2,
          .faq-heading h2 {
            font-size: 37px;
            letter-spacing: -1.8px;
          }

          .feature-grid,
          .plans-grid {
            grid-template-columns: 1fr;
          }

          .feature-card,
          .plan-card {
            padding: 26px;
          }

          .brand-logo-wrap {
            width: 12rem;
            height: 12rem;
          }

          .trust-card {
            padding: 25px;
          }

          .trust-points {
            grid-template-columns: 1fr;
          }

          .cta-section {
            padding: 72px 0;
          }

          .cta-box {
            padding: 41px 25px;
            border-radius: 23px;
          }

          .cta-content h2 {
            font-size: 38px;
            letter-spacing: -1.9px;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }

          .footer-grid > div:first-child {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            display: block;
          }

          .footer-bottom span {
            display: block;
            margin-top: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <header className="container navbar">
        <button className="brand" onClick={() => goTo("home")}>
          <BrandLogo />
        </button>

        <nav className="nav-links">
          <a href="#home">Overview</a>
          <a href="#plans">Mining plans</a>
          <a href="#how-it-works">How it works</a>
          <a href="#transparency">Infrastructure</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="nav-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/auth/login")}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/auth/register")}
            className="btn btn-primary"
          >
            Get started <Arrow />
          </button>
        </div>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((state) => !state)}
          aria-label="Open menu"
        >
          {menuOpen ? "×" : "☰"}
        </button>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Overview
            </a>
            <a href="#plans" onClick={() => setMenuOpen(false)}>
              Mining plans
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#transparency" onClick={() => setMenuOpen(false)}>
              Infrastructure
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </a>
            <button onClick={() => navigate("/auth/register")}>
              Get started
            </button>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Premium digital mining infrastructure
              </div>

              <h1>
                Powering the future of <span>digital mining.</span>
              </h1>

              <p className="hero-copy">
                Access a premium digital-mining experience built around
                transparent operations, intelligent hashrate tracking and clear
                information at every step.
              </p>

              <div className="hero-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => goTo("plans")}
                >
                  Explore mining plans <Arrow />
                </button>

                <button
                  className="btn btn-light"
                  onClick={() => goTo("how-it-works")}
                >
                  Learn how it works
                </button>
              </div>

              <div className="hero-note">
                <span className="note-icon">
                  <Check />
                </span>
                Track hashrate, uptime and mining performance
              </div>
            </div>

            <div className="dashboard-area">
              <div className="dashboard-glow" />

              <div className="float-card one">
                <span className="float-icon">
                  <Chart />
                </span>
                Hashrate optimized
              </div>

              <div className="float-card two">
                <span className="float-icon">
                  <Shield />
                </span>
                Secure mining infrastructure
              </div>

              <div className="dashboard">
                <div className="dashboard-top">
                  <span className="dashboard-label">
                    Mining operations overview
                  </span>
                  <span className="active-status">
                    <span className="status-dot" />
                    Mining active
                  </span>
                </div>

                <div className="balance">
                  <small>Estimated mining output</small>
                  <div className="balance-amount">2,840.50 USDT</div>

                  <div className="balance-bottom">
                    <span>Current hashrate</span>
                    <span className="positive">+12.40%</span>
                  </div>
                </div>

                <div className="chart">
                  <div className="chart-grid" />
                  <svg viewBox="0 0 440 130" preserveAspectRatio="none">
                    <defs>
                      <linearGradient
                        id="chartFill"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4389ff"
                          stopOpacity=".25"
                        />
                        <stop
                          offset="100%"
                          stopColor="#4389ff"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 112 C33 104 47 107 74 86 S113 91 138 69 S176 78 202 59 S239 71 265 43 S307 59 335 32 S385 44 440 8 L440 130 L0 130Z"
                      fill="url(#chartFill)"
                    />

                    <path
                      className="chart-path"
                      d="M0 112 C33 104 47 107 74 86 S113 91 138 69 S176 78 202 59 S239 71 265 43 S307 59 335 32 S385 44 440 8"
                      fill="none"
                      stroke="#347fff"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="stats">
                  <div className="stat">
                    <small>Hashrate</small>
                    <strong>184.6 TH/s</strong>
                  </div>
                  <div className="stat">
                    <small>Uptime</small>
                    <strong>99.2%</strong>
                  </div>
                  <div className="stat">
                    <small>Next payout</small>
                    <strong>18h 42m</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section soft-section">
          <div className="container">
            <div className="section-heading reveal">
              <div className="kicker">The mining edge</div>
              <h2>Built for serious digital-mining operations.</h2>
              <p>
                Powerful infrastructure, clear performance data and a premium
                experience designed for the next generation of mining.
              </p>
            </div>

            <div className="feature-grid">
              <div className="feature-card reveal">
                <div className="feature-icon">
                  <Chart />
                </div>
                <h3>Real-time hashrate</h3>
                <p>
                  Monitor hashrate, uptime and mining activity through a clean
                  operational dashboard.
                </p>
              </div>

              <div className="feature-card reveal">
                <div className="feature-icon">
                  <Shield />
                </div>
                <h3>Secure infrastructure</h3>
                <p>
                  Designed around transparent operations, secure access and
                  visible mining performance information.
                </p>
              </div>

              <div className="feature-card reveal">
                <div className="feature-icon">
                  <Sparkle />
                </div>
                <h3>Optimized efficiency</h3>
                <p>
                  Present mining capacity, uptime and output data in a premium
                  and understandable format.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="section">
          <div className="container">
            <div className="section-heading reveal">
              <div className="kicker">Mining plans</div>
              <h2>Choose your mining capacity.</h2>
              <p>
                Review each package and understand the applicable terms before
                proceeding.
              </p>
            </div>

            <div className="plans-grid">
              {plans.map((plan) => (
                <div
                  className={`plan-card reveal ${
                    selectedPlan === plan.name ? "selected" : ""
                  } ${plan.popular ? "popular-card" : ""}`}
                  key={plan.name}
                >
                  {plan.popular && (
                    <span className="popular-badge">Most selected</span>
                  )}

                  <div className="plan-name">{plan.name}</div>

                  <div className="plan-rate">
                    {plan.rate}{" "}
                    <span>
                      {plan.name === "Mining Partner"
                        ? "commission"
                        : "hashrate"}
                    </span>
                  </div>

                  <div className="plan-amount">{plan.amount}</div>
                  <span className="plan-label">{plan.label}</span>

                  <p className="plan-description">
                    Select a mining package, review the applicable terms and
                    monitor your assigned digital-mining performance.
                  </p>

                  <ul className="plan-list">
                    <li>
                      <span className="check-icon">
                        <Check />
                      </span>
                      Dedicated mining allocation
                    </li>
                    <li>
                      <span className="check-icon">
                        <Check />
                      </span>
                      Hashrate activity tracking
                    </li>
                    <li>
                      <span className="check-icon">
                        <Check />
                      </span>
                      Transparent payout conditions
                    </li>
                  </ul>

                  <button
                    className={`btn plan-btn ${
                      selectedPlan === plan.name ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    {selectedPlan === plan.name
                      ? "Mining plan selected"
                      : "Select mining plan"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section soft-section">
          <div className="container process-grid">
            <div className="content-heading reveal">
              <div className="kicker">How it works</div>
              <h2>A simple process from start to review.</h2>
              <p>
                Take your time, understand the details and use the platform only
                when you are comfortable with the applicable terms and risks.
              </p>

              <div className="steps">
                <div className="step">
                  <div className="step-number">01</div>
                  <div>
                    <h3>Create your account</h3>
                    <p>Enter your details and set up secure access.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">02</div>
                  <div>
                    <h3>Complete verification</h3>
                    <p>Follow applicable identity and security checks.</p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">03</div>
                  <div>
                    <h3>Select a mining plan</h3>
                    <p>
                      Check hashrate, amount range, timing, fees and conditions.
                    </p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">04</div>
                  <div>
                    <h3>Monitor your mining</h3>
                    <p>
                      Track hashrate, uptime and payouts according to the
                      published terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div id="transparency" className="trust-card reveal">
              <h3>Information you should always see</h3>
              <p>
                A trustworthy experience starts with accessible information.
                These details should be visible before participation.
              </p>

              <div className="trust-points">
                {[
                  "Company details",
                  "Fees and charges",
                  "Withdrawal terms",
                  "Custody information",
                  "Risk disclosures",
                  "Support channels",
                ].map((item) => (
                  <div className="trust-point" key={item}>
                    <span className="trust-check">
                      <Check />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="risk-note">
                Digital-mining operations are subject to volatility, network
                difficulty and operational factors. Stated hashrates and outputs
                are not guaranteed, and participation may result in partial or
                complete loss of capital.
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading reveal">
              <div className="kicker">Transparency first</div>
              <h2>Good decisions need complete information.</h2>
              <p>
                Keep legal entity details, fees, custody model, withdrawal rules
                and risk information visible and easy to verify.
              </p>
            </div>

            <div className="feature-grid">
              <div className="feature-card reveal">
                <div className="feature-icon">
                  <Shield />
                </div>
                <h3>Clear disclosures</h3>
                <p>
                  Explain volatility, potential losses and program limitations
                  in plain language.
                </p>
              </div>

              <div className="feature-card reveal">
                <div className="feature-icon">
                  <Wallet />
                </div>
                <h3>Visible conditions</h3>
                <p>
                  Show minimum amounts, fees, withdrawal timelines and
                  restrictions.
                </p>
              </div>

              <div className="feature-card reveal">
                <div className="feature-icon">
                  <Sparkle />
                </div>
                <h3>Responsible messaging</h3>
                <p>
                  Avoid claims such as guaranteed profits, risk-free income or
                  fixed returns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="section soft-section">
          <div className="container faq-grid">
            <div className="faq-heading reveal">
              <div className="kicker">Need to know</div>
              <h2>Questions, answered simply.</h2>
              <p>
                Before participating, make sure you understand the product,
                risks and conditions.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div
                  className={`faq-item reveal ${
                    openFaq === index ? "open" : ""
                  }`}
                  key={faq.q}
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    {faq.q}
                    <span className="faq-plus">+</span>
                  </button>

                  <div className="faq-answer">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-box reveal">
              <div className="cta-content">
                <h2>Enter the next era of digital mining.</h2>
                <p>
                  Explore mining plans, review the infrastructure and monitor
                  your performance with complete clarity.
                </p>
                <button className="btn" onClick={() => goTo("plans")}>
                  Explore mining plans <Arrow />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <p>
                Premium digital-mining infrastructure with clear performance
                data, transparent terms and an experience built for informed
                participation.
              </p>
            </div>

            <div>
              <h4>Platform</h4>
              <ul className="footer-links">
                <li>
                  <a href="#plans">Mining plans</a>
                </li>
                <li>
                  <a href="#how-it-works">How it works</a>
                </li>
                <li>
                  <a href="#transparency">Infrastructure</a>
                </li>
              </ul>
            </div>

            <div>
              <h4>Resources</h4>
              <ul className="footer-links">
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#transparency">Risk disclosure</a>
                </li>
                <li>
                  <a href="#home">Privacy policy</a>
                </li>
              </ul>
            </div>

            <div>
              <h4>Contact</h4>
              <ul className="footer-links">
                <li>
                  <a href="mailto:support@example.com">Support center</a>
                </li>
                <li>
                  <a href="mailto:support@example.com">Email support</a>
                </li>
                <li>
                  <a href="#faq">Help & questions</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 CalmVest. All rights reserved.</span>
            <span>
              Digital-mining operations are subject to volatility and
              operational risk. This website does not provide financial advice.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
