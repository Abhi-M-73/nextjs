import React, { useState } from 'react'
import { ArrowUpRight, FileText, Zap, Shield, Globe, Coins, Users, TrendingUp, ChevronRight } from 'lucide-react'

const tokenFeatures = [
  {
    icon: <Shield size={16} />,
    title: 'Governance',
    desc: 'Vote on Liberland laws, proposals, and state decisions on-chain.',
  },
  {
    icon: <Zap size={16} />,
    title: 'Staking & Merits',
    desc: 'Stake LLD to earn Merits — the key to citizenship and privileges.',
  },
  {
    icon: <Users size={16} />,
    title: 'Citizenship',
    desc: 'LLD holders can apply for e-residency and Liberland citizenship.',
  },
  {
    icon: <Globe size={16} />,
    title: 'Payments',
    desc: 'Native currency for all transactions within the Liberland ecosystem.',
  },
]

const papers = [
  {
    id: 'white',
    label: 'White Paper',
    tagline: 'Technical Deep Dive',
    badge: 'Full Technical Docs',
    color: '#7F77DD',
    borderColor: 'rgba(127,119,221,0.4)',
    bgGlow: 'rgba(127,119,221,0.06)',
    badgeBg: 'rgba(127,119,221,0.12)',
    badgeText: '#534AB7',
    description:
      "A rigorous technical and economic breakdown of the LLD token — covering smart contract architecture, tokenomics, governance mechanics, the Merits system, and Liberland's legal-constitutional framework.",
    highlights: [
      'Token supply, allocation & vesting',
      'On-chain governance & voting weight',
      'Smart contract security & audits',
      'Merits system & citizenship model',
      'Economic policy & treasury mechanics',
    ],
    href: 'https://docs.liberland.org/blockchain/white-paper',
    cta: 'Read White Paper',
    icon: <FileText size={20} />,
  },
  {
    id: 'lite',
    label: 'Light Paper',
    tagline: 'Quick Overview',
    badge: 'Beginner Friendly',
    color: '#378ADD',
    borderColor: 'rgba(55,138,221,0.4)',
    bgGlow: 'rgba(55,138,221,0.06)',
    badgeBg: 'rgba(55,138,221,0.12)',
    badgeText: '#185FA5',
    description:
      'A concise, accessible introduction to the LLD token and the Liberland vision — designed for investors, newcomers, and curious community members looking for a high-level summary.',
    highlights: [
      'What is Liberland & LLD?',
      'Core utility: governance, staking & payments',
      'Roadmap & key milestones',
      'Community & ecosystem snapshot',
      'How to acquire & get involved',
    ],
    href: 'https://docs.liberland.org/',
    cta: 'Read Light Paper',
    icon: <FileText size={20} />,
  },
]

export default function TokenWhiteLitePaper() {
  const [hovered, setHovered] = useState(null)

  return (
    <div
      className="bg-black/50 w-full min-h-screen"
    >
      {/* Top Border Line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #7F77DD55, #7F77DD, #7F77DD55, transparent)' }} />

      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* HEADER */}
        <div className="text-center mb-16">
          <p style={{ letterSpacing: '0.3em', fontSize: '11px', color: '#7F77DD', textTransform: 'uppercase', marginBottom: '12px' }}>
            Official Documentation
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '400', color: '#F5F0E8', letterSpacing: '-0.01em', lineHeight: 1.15, marginBottom: '16px' }}>
            LLD Token — <span style={{ color: '#7F77DD' }}>Research Papers</span>
          </h2>
          <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7, fontStyle: 'italic' }}>
            Explore the constitutional and technical foundations of Liberland's sovereign digital economy.
          </p>
        </div>

        {/* TOKEN FEATURE PILLS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
          {tokenFeatures.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              <span style={{ color: '#7F77DD', marginTop: '2px', flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ color: '#F5F0E8', fontSize: '13px', fontWeight: '600', marginBottom: '4px', letterSpacing: '0.05em' }}>
                  {f.title}
                </p>
                <p style={{ color: 'rgba(245,240,232,0.45)', fontSize: '12px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(127,119,221,0.5)' }} />
          <span style={{ color: 'rgba(127,119,221,1)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',}}>
            Documentation
          </span>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(127,119,221,0.5)' }} />
        </div>

        {/* PAPER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              onMouseEnter={() => setHovered(paper.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === paper.id ? paper.bgGlow : 'rgba(0,0,0,0.03)',
                border: `1px solid ${hovered === paper.id ? paper.borderColor : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '16px',
                padding: '32px',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: `${paper.color}18`,
                    border: `1px solid ${paper.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: paper.color,
                  }}>
                    {paper.icon}
                  </div>
                  <div>
                    <p style={{ color: paper.color, fontSize: '16px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>
                      {paper.label}
                    </p>
                    <p style={{ color: 'rgba(245,240,232,0.35)', fontSize: '11px', fontStyle: 'italic' }}>
                      {paper.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '14px', lineHeight: 1.75, marginBottom: '24px', fontStyle: 'italic' }}>
                {paper.description}
              </p>

              {/* Highlights */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {paper.highlights.map((h, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(245,240,232,0.6)' }}>
                    <ChevronRight size={12} style={{ color: paper.color, flexShrink: 0 }} />
                    {h}
                  </li>
                ))}
              </ul>

              {/* CTA */}

              <a
                href={paper.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '11px 22px', borderRadius: '8px',
                  background: hovered === paper.id ? paper.color : 'transparent',
                  border: `1px solid ${paper.color}`,
                  color: hovered === paper.id ? '#0A0A0A' : paper.color,
                  fontSize: '16px', fontWeight: '600', letterSpacing: '0.08em',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  width: 'fit-content',
                }}
              >
                {paper.cta}
                <ArrowUpRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Border Line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #7F77DD55, #7F77DD, #7F77DD55, transparent)' }} />
    </div >
  )
}