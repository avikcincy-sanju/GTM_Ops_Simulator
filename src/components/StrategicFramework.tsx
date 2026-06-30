import { BookOpen } from 'lucide-react';
import { TooltipTerm } from './TooltipTerm';

const PILLARS = [
  {
    number: '01',
    title: 'GTM Strategy',
    titleAbbr: 'GTM' as const,
    color: 'from-cyan-500 to-blue-500',
    items: [
      { label: 'Buyer Segment', desc: 'Who is the primary decision-maker and paying entity', abbr: null },
      { label: 'Sales Motion', desc: 'Direct, embedded, partner, or enterprise consultative', abbr: null },
      { label: 'Channel Strategy', desc: 'How the platform reaches buyers at scale', abbr: null },
      { label: 'Pricing Model', desc: 'Take rate, flat fee, revenue share, or hybrid', abbr: null },
      { label: 'Adoption Path', desc: 'How buyers onboard and activate payment capability', abbr: null },
      { label: 'Distribution Leverage', desc: 'Network effects, partner multipliers, embedded growth', abbr: null },
    ],
  },
  {
    number: '02',
    title: 'Payment Operating Model',
    titleAbbr: null,
    color: 'from-blue-500 to-purple-500',
    items: [
      { label: 'Merchant Ownership', desc: 'Who owns the merchant or seller relationship', abbr: null },
      { label: 'Seller Onboarding', desc: 'KYC/KYB process, automated vs. manual review', abbr: null },
      { label: 'Settlement Flow', desc: 'How funds move from buyer to seller through the platform', abbr: null },
      { label: 'Split Rules', desc: 'How the transaction amount is divided at the platform layer', abbr: null },
      { label: 'Refunds & Disputes', desc: 'Who owns chargeback liability and resolution', abbr: null },
      { label: 'Reconciliation Model', desc: 'How transactions are matched across rails and entities', abbr: null },
    ],
  },
  {
    number: '03',
    title: 'Marketplace Economics',
    titleAbbr: null,
    color: 'from-purple-500 to-emerald-500',
    items: [
      { label: 'Buyer Experience / UX', desc: 'Checkout ownership, UX consistency, brand control', abbr: 'UX' as const },
      { label: 'Seller Experience', desc: 'Onboarding friction, payout speed, self-service tools', abbr: null },
      { label: 'Platform Take Rate', desc: 'Commission or fee percentage per transaction', abbr: null },
      { label: 'Reserve Strategy', desc: 'Hold percentage, release window, and dispute buffer design', abbr: null },
      { label: 'Payout Speed', desc: 'Standard settlement vs. instant payout options', abbr: null },
      { label: 'Seller Services / VAS', desc: 'Working capital, embedded finance, VAS expansion', abbr: 'VAS' as const },
    ],
  },
  {
    number: '04',
    title: 'Trust & Control',
    titleAbbr: null,
    color: 'from-emerald-500 to-cyan-500',
    items: [
      { label: 'Risk Governance', desc: 'Fraud rules, monitoring policies, reserve design', abbr: null },
      { label: 'Delegated Authority', desc: 'How permissions are scoped for agents and sub-entities', abbr: null },
      { label: 'Policy Limits', desc: 'Transaction limits, velocity controls, geo restrictions', abbr: null },
      { label: 'Identity Verification', desc: 'Seller, buyer, and agent identity authentication', abbr: null },
      { label: 'Auditability', desc: 'Immutable logs for regulatory and operational review', abbr: null },
      { label: 'Agentic Payment Readiness', desc: 'Platform capacity to serve AI agent-initiated payments', abbr: 'AI' as const },
    ],
  },
];

function PillarItemLabel({ label, abbr }: { label: string; abbr: string | null }) {
  if (abbr) {
    const idx = label.indexOf(abbr);
    if (idx !== -1) {
      const before = label.slice(0, idx);
      const after = label.slice(idx + abbr.length);
      return <>{before}<TooltipTerm abbr={abbr}>{abbr}</TooltipTerm>{after}</>;
    }
    // For "Agentic Payment Readiness" with abbr="AI": wrap the word "Agentic" with AI tooltip
    if (abbr === 'AI' && label.startsWith('Agentic')) {
      return <><TooltipTerm abbr="AI">Agentic</TooltipTerm>{label.slice('Agentic'.length)}</>;
    }
  }
  return <>{label}</>;
}

function PillarItemDesc({ desc }: { desc: string }) {
  const parts = [];
  if (desc.includes('KYC')) {
    const [before, rest] = desc.split('KYC');
    const [mid, after] = rest.split('KYB');
    parts.push(before, <TooltipTerm key="kyc" abbr="KYC">KYC</TooltipTerm>, mid ?? '', mid !== undefined ? <TooltipTerm key="kyb" abbr="KYB">KYB</TooltipTerm> : null, after ?? '');
    return <>{parts}</>;
  }
  if (desc.includes('UX')) {
    const [before, after] = desc.split('UX');
    return <>{before}<TooltipTerm abbr="UX">UX</TooltipTerm>{after}</>;
  }
  if (desc.includes('VAS')) {
    const [before, after] = desc.split('VAS');
    return <>{before}<TooltipTerm abbr="VAS">VAS</TooltipTerm>{after}</>;
  }
  if (desc.includes('AI')) {
    const [before, after] = desc.split('AI ');
    return <>{before}<TooltipTerm abbr="AI">AI</TooltipTerm> {after}</>;
  }
  return <>{desc}</>;
}

export default function StrategicFramework() {
  return (
    <section id="framework" className="py-10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Strategic Framework</h2>
        </div>
        <p className="text-slate-400 text-sm mb-10">
          A four-pillar framework for platform payment strategy, operating model design, and agentic payment readiness.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PILLARS.map(pillar => (
            <div key={pillar.title} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className={`bg-gradient-to-r ${pillar.color} p-0.5`} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-xs font-bold bg-gradient-to-r ${pillar.color} bg-clip-text text-transparent`}>{pillar.number}</span>
                  <h3 className="text-base font-bold text-white">
                    {pillar.titleAbbr
                      ? <><TooltipTerm abbr={pillar.titleAbbr}>{pillar.titleAbbr}</TooltipTerm>{pillar.title.replace(pillar.titleAbbr, '')}</>
                      : pillar.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {pillar.items.map(item => (
                    <div key={item.label} className="flex gap-3">
                      <div className={`w-1 flex-shrink-0 rounded-full bg-gradient-to-b ${pillar.color} self-stretch`} />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          <PillarItemLabel label={item.label} abbr={item.abbr} />
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <PillarItemDesc desc={item.desc} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
