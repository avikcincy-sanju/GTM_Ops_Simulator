import { Fragment } from 'react';
import type { SimulatorInputs } from '../types';
import { calcAgenticTrustScore } from '../utils/calculations';
import { Cpu, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { TooltipTerm } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

const TRUST_FLOW = [
  { label: 'AI Agent', abbr: 'AI' as const },
  { label: 'Delegated Authority', abbr: null },
  { label: 'Policy Check', abbr: null },
  { label: 'Transaction Limit', abbr: null },
  { label: 'Beneficiary Validation', abbr: null },
  { label: 'Real-Time Attestation', abbr: null },
  { label: 'Audit Trail', abbr: null },
  { label: 'Approved / Blocked', abbr: null },
];

const COMMERCE_FLOW = [
  { label: 'Consumer Request', abbr: null },
  { label: 'AI Agent', abbr: 'AI' as const },
  { label: 'Platform Tool Call', abbr: null },
  { label: 'Seller Match', abbr: null },
  { label: 'Checkout Handshake', abbr: null },
  { label: 'Policy Verification', abbr: null },
  { label: 'Payment Routing', abbr: null },
  { label: 'Seller Confirmation', abbr: null },
  { label: 'Audit Record', abbr: null },
];

interface TrustCard {
  label: string;
  description: string;
  status: 'active' | 'future' | 'critical';
  abbrs?: string[];
}

function getTrustCards(isActive: boolean): TrustCard[] {
  return [
    { label: 'Agent Identity', description: 'Agent identity must be verifiable before payment initiation', status: 'critical', abbrs: ['AI'] },
    { label: 'Delegated Authority', description: 'Buyer must have delegated authority to the acting agent', status: 'critical' },
    { label: 'Policy Compliance', description: 'Transaction must stay within authorized policy scope', status: isActive ? 'active' : 'future' },
    { label: 'Transaction Limits', description: 'Amounts must be within pre-approved per-transaction and aggregate limits', status: isActive ? 'active' : 'future' },
    { label: 'Beneficiary Validation', description: 'Payout recipient must be validated against approved beneficiary list', status: isActive ? 'active' : 'future' },
    { label: 'Audit Trail', description: 'Every agent-initiated transaction must generate a complete, immutable audit record', status: isActive ? 'active' : 'future' },
  ];
}

function FlowStep({ item, highlight }: { item: { label: string; abbr: string | null }; highlight?: boolean }) {
  if (item.abbr) {
    return (
      <div className={`px-3 py-2 rounded-lg text-xs font-medium border ${
        highlight
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          : item.label === 'Policy Verification'
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
          : item.label === 'Approved / Blocked'
          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          : 'bg-slate-700/50 border-slate-600/50 text-slate-300'
      }`}>
        <TooltipTerm abbr={item.abbr}>{item.label}</TooltipTerm>
      </div>
    );
  }
  return (
    <div className={`px-3 py-2 rounded-lg text-xs font-medium border ${
      item.label === 'Approved / Blocked' || highlight
        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
        : item.label === 'Policy Verification'
        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
        : item.label === 'Audit Record'
        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
        : 'bg-slate-700/50 border-slate-600/50 text-slate-300'
    }`}>
      {item.label}
    </div>
  );
}

export default function AgenticPayment({ inputs }: Props) {
  const isActive = inputs.agenticPaymentUsage;
  const trustScore = calcAgenticTrustScore(inputs);
  const cards = getTrustCards(isActive);
  const scoreColor = trustScore >= 70 ? 'text-emerald-400' : trustScore >= 50 ? 'text-cyan-400' : 'text-yellow-400';

  return (
    <section id="agentic" className="py-10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <Cpu size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            Agentic Payment Trust Readiness
          </h2>
        </div>
        {!isActive && (
          <div className="inline-flex items-center gap-2 text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-4">
            Agentic payment usage is off — showing future readiness assessment.
          </div>
        )}
        {isActive && (
          <div className="inline-flex items-center gap-2 text-xs text-emerald-400/80 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-4">
            Agentic payment usage is on — agent-authorized payment controls are active requirements.
          </div>
        )}
        <p className="text-slate-400 text-sm mb-5">
          In agent-accessible commerce, the platform becomes discoverable and callable by <TooltipTerm abbr="AI">AI</TooltipTerm> agents. The key control point is not only payment acceptance, but whether the platform can verify agent identity, delegated authority, policy scope, transaction limits, and auditability.
        </p>

        {/* Trust Score + Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-8">
          <div className={`bg-slate-800/50 border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 ${isActive ? 'border-cyan-500/50' : 'border-slate-700/50'}`}>
            <p className="text-xs text-slate-400 uppercase tracking-wider text-center">Trust Readiness Score</p>
            <span className={`text-5xl font-bold ${scoreColor}`} aria-label={`Trust readiness score: ${trustScore} out of 100`}>{trustScore}</span>
            <p className={`text-xs font-medium ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
              {isActive ? 'Active Requirements' : 'Future Readiness'}
            </p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {cards.map(card => {
              const isOk = card.status === 'active';
              const isCritical = card.status === 'critical';
              return (
                <div key={card.label} className={`border rounded-xl p-4 ${isCritical ? 'border-red-500/30 bg-red-500/5' : isOk ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700/50 bg-slate-800/40'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCritical ? (
                      <XCircle size={14} className="text-red-400 flex-shrink-0" />
                    ) : isOk ? (
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600 flex-shrink-0" />
                    )}
                    <span className={`text-xs font-semibold ${isCritical ? 'text-red-300' : isOk ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {card.abbrs?.includes('AI') ? <><TooltipTerm abbr="AI">AI</TooltipTerm> {card.label.replace('AI ', '')}</> : card.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
                  <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${isCritical ? 'bg-red-500/20 text-red-300' : isOk ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-400'}`}>
                    {isCritical ? 'Required' : isOk ? (isActive ? 'Active Requirement' : 'Active') : (isActive ? 'Active Requirement' : 'Future Readiness')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Flow */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Agentic Payment Trust Flow
          </h3>
          <div className="flex flex-wrap items-center gap-1.5">
            {TRUST_FLOW.map((step, i) => (
              <Fragment key={step.label}>
                <FlowStep item={step} />
                {i < TRUST_FLOW.length - 1 && <ChevronRight size={12} className="text-slate-600" />}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Commerce Flow */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Agent-Accessible Commerce Flow
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            In agent-accessible commerce, the platform becomes discoverable and callable by <TooltipTerm abbr="AI">AI</TooltipTerm> agents. The key control point is not only payment acceptance, but whether the platform can verify agent identity, delegated authority, policy scope, transaction limits, and auditability.
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {COMMERCE_FLOW.map((step, i) => (
              <Fragment key={step.label}>
                <FlowStep item={step} />
                {i < COMMERCE_FLOW.length - 1 && <ChevronRight size={12} className="text-slate-600" />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
