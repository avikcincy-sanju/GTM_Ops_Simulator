import { useState } from 'react';
import type { SimulatorInputs } from '../types';
import { Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { TooltipTerm, AcronymText } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

// ─── Score calculation ────────────────────────────────────────────────────────

function calcInfraScores(inputs: SimulatorInputs) {
  const { crossBorderPercent: cb, platformType: pt, vasAttachRate: vas, instantPayoutAdoption: ipo,
    annualPaymentVolume: apv, numMerchants: nm, refundDisputeRate: rdr, avgTransactionSize: ats } = inputs;

  const tender = Math.max(20, Math.min(100, Math.round(
    45 + Math.min(20, cb * 0.35)
    + (pt === 'Marketplace' ? 12 : pt === 'Creator / Services Platform' ? 8 : 0)
    + Math.min(8, vas * 0.25) + (ipo > 30 ? 5 : 0)
    + Math.min(10, apv / 50_000_000 * 5)
  )));
  const payout = Math.max(20, Math.min(100, Math.round(
    45 + Math.min(25, ipo * 0.45) + Math.min(15, cb * 0.25)
    + (nm > 1000 ? 8 : 0) + (nm > 5000 ? 5 : 0)
    + Math.min(5, apv / 100_000_000 * 5)
  )));
  const auth = Math.max(20, Math.min(100, Math.round(
    50 + Math.min(15, rdr * 4)
    + (ats > 200 ? 10 : ats > 100 ? 5 : 0)
    + Math.min(10, cb * 0.15) + (ipo > 30 ? 5 : 0) + (nm > 1000 ? 5 : 0)
  )));
  const agentic = Math.max(20, Math.min(100, Math.round(
    (inputs.agenticPaymentUsage ? 65 : 35)
    + (cb > 20 ? 8 : 0) + (ipo > 30 ? 7 : 0) + (vas > 20 ? 5 : 0)
  )));
  return { tender, payout, auth, agentic };
}

// ─── Tender data ──────────────────────────────────────────────────────────────

const TENDER_ROWS = [
  { name: 'Card payment', loop: 'Open loop', token: 'Required', cost: 'Medium', conv: 'High', risk: 'Medium', fit: 'General commerce, broad acceptance' },
  { name: 'Bank account transfer', loop: 'Open loop', token: 'Optional', cost: 'Low', conv: 'Medium', risk: 'Low–Medium', fit: 'B2B, payroll, high-value transactions' },
  { name: 'Mobile wallet', loop: 'Open loop', token: 'Required', cost: 'Medium', conv: 'High', risk: 'Low', fit: 'Mobile-first, repeat purchase flows' },
  { name: 'Stored balance / wallet', loop: 'Closed loop', token: 'Optional', cost: 'Low', conv: 'High', risk: 'Low', fit: 'Loyalty, subscription, platform-native spend' },
  { name: 'Gift card / loyalty balance', loop: 'Closed loop', token: 'Not required', cost: 'Low', conv: 'Medium', risk: 'Low', fit: 'Gift, reward, and incentive redemption' },
  { name: 'Split tender', loop: 'Hybrid', token: 'Optional', cost: 'Medium', conv: 'High', risk: 'Medium', fit: 'Mixed funding, loyalty + card, partial credit' },
  { name: 'Cross-border local payment method', loop: 'Hybrid', token: 'Optional', cost: 'Medium–High', conv: 'High', risk: 'Medium–High', fit: 'International markets, regional conversion lift' },
  { name: 'Tokenized credential', loop: 'Open loop', token: 'Required', cost: 'Low', conv: 'High', risk: 'Low', fit: 'Repeat purchases, subscription, agent commerce' },
];

// ─── Payout rail data ─────────────────────────────────────────────────────────

const PAYOUT_ROWS = [
  { name: 'Standard bank payout', speed: '1–2 business days', cost: 'Low', conv: 'Medium', liq: 'Low', comp: 'Low', recon: 'Low', fit: 'Default payout for all sellers' },
  { name: 'Instant debit payout', speed: 'Near-instant', cost: 'Medium', conv: 'High', liq: 'Medium–High', comp: 'Medium', recon: 'Medium', fit: 'Gig workers, high-urgency sellers' },
  { name: 'Stored balance / wallet', speed: 'Instant', cost: 'Low', conv: 'High', liq: 'Medium', comp: 'Medium', recon: 'Medium', fit: 'Platform-native retention and stickiness' },
  { name: 'Digital check', speed: '3–5 business days', cost: 'Low', conv: 'Low', liq: 'Low', comp: 'Low', recon: 'Low', fit: 'Fallback for legacy or unbanked sellers' },
  { name: 'Cross-border wallet', speed: '1–2 business days', cost: 'Medium–High', conv: 'Medium', liq: 'Medium', comp: 'High', recon: 'High', fit: 'International sellers, multi-currency payouts' },
  { name: 'Stable-value digital payout *', speed: 'Future-facing', cost: 'TBD', conv: 'High', liq: 'TBD', comp: 'High', recon: 'High', fit: 'Emerging — subject to legal, regulatory, and operational review' },
];

// ─── Auth & Risk capabilities (derived from inputs) ───────────────────────────

function getAuthRows(inputs: SimulatorInputs) {
  const { refundDisputeRate: rdr, avgTransactionSize: ats, crossBorderPercent: cb,
    instantPayoutAdoption: ipo, numMerchants: nm, reserveHoldPercent: rhp } = inputs;
  return [
    {
      cap: 'Credential updater readiness',
      status: ats > 300 ? 'Mature' : ats > 100 ? 'Emerging' : 'Basic',
      bizImpact: 'Recovers failed authorizations from expired or replaced credentials',
      riskImpact: 'Reduces involuntary churn and card-on-file decline losses',
      action: ats > 100 ? 'Implement automatic credential refresh for recurring and card-on-file transactions.' : 'Evaluate credential updater enrollment for subscription and repeat-use flows.',
    },
    {
      cap: 'Transaction routing optimization',
      status: cb > 40 ? 'Basic' : cb > 15 ? 'Emerging' : 'Mature',
      bizImpact: 'Improves authorization rate by selecting the highest-performing acquirer or rail',
      riskImpact: 'Reduces single-point routing failure and decline exposure',
      action: cb > 15 ? 'Implement smart routing across acquiring partners and rails for cross-border flows.' : 'Baseline routing review recommended for multi-acquirer environments.',
    },
    {
      cap: 'Dynamic retry logic',
      status: ipo > 30 || ats > 200 ? 'Emerging' : rdr < 1.5 ? 'Mature' : 'Basic',
      bizImpact: 'Recovers soft declines through timed, rule-based retry sequences',
      riskImpact: 'Limits unnecessary decline exposure without increasing fraud risk',
      action: 'Define retry policy with timing controls, decline-reason filtering, and attempt caps.',
    },
    {
      cap: 'Strong authentication trigger',
      status: ats > 500 ? 'Mature' : ats > 150 ? 'Emerging' : 'Basic',
      bizImpact: 'Reduces liability shift exposure on high-value and flagged transactions',
      riskImpact: 'Prevents authentication bypass on elevated-risk transaction profiles',
      action: ats > 150 ? 'Apply risk-based authentication triggers for elevated amounts and cross-border flows.' : 'Establish SCA rules for flagged transaction segments.',
    },
    {
      cap: 'Fraud screening',
      status: rdr > 3 ? 'Basic' : rdr > 1 ? 'Emerging' : 'Mature',
      bizImpact: 'Reduces fraud losses and dispute-driven revenue reversal',
      riskImpact: 'Decreases chargeback rate and reserve exposure across the seller base',
      action: rdr > 3 ? 'Immediate review of fraud rules, velocity controls, and transaction monitoring required.' : rdr > 1 ? 'Strengthen fraud rules and expand monitoring coverage.' : 'Maintain rules and review regularly.',
    },
    {
      cap: 'Chargeback operations readiness',
      status: rdr > 4 ? 'Basic' : rdr > 1.5 ? 'Emerging' : 'Mature',
      bizImpact: 'Limits revenue loss through evidence-supported dispute representment',
      riskImpact: 'Prevents threshold breach that could trigger acquirer program review',
      action: rdr > 2 ? 'Build representment workflows with evidence collection, win-rate tracking, and escalation rules.' : 'Maintain dispute playbooks and threshold monitoring.',
    },
    {
      cap: 'Reserve policy alignment',
      status: rhp === 0 ? 'Basic' : rhp < 5 ? 'Emerging' : 'Mature',
      bizImpact: 'Protects platform from net loss on high-dispute or high-refund seller segments',
      riskImpact: 'Reduces platform liability during dispute resolution and reserve release windows',
      action: rhp === 0 ? 'Evaluate reserve policy design for dispute-exposed seller segments.' : 'Review reserve sizing, release schedule, and dispute buffer quarterly.',
    },
    {
      cap: 'Dispute workflow readiness',
      status: nm > 5000 && rdr > 2 ? 'Basic' : nm > 500 || rdr > 1 ? 'Emerging' : 'Mature',
      bizImpact: 'Reduces per-dispute operational cost and improves resolution cycle time',
      riskImpact: 'Prevents unresolved disputes from escalating into acquirer compliance events',
      action: nm > 1000 || rdr > 2 ? 'Automate dispute intake, evidence routing, and resolution tracking at scale.' : 'Establish dispute templates and escalation paths.',
    },
    {
      cap: 'AML / Sanctions Monitoring',
      status: 'Emerging' as const,
      bizImpact: 'Protects platform eligibility, seller onboarding quality, and regulated payment flows.',
      riskImpact: 'Reduces illicit activity, restricted-party, and compliance exposure.',
      action: 'Add automated screening, review queues, and escalation workflow for higher-risk sellers and transactions.',
    },
  ];
}

// ─── Agentic protocol stack (static) ─────────────────────────────────────────

const AGENTIC_LAYERS = [
  { layer: 'Tool-call protocol', what: 'Makes the platform callable by an AI agent through a structured interface', required: 'Future readiness', failure: 'Continue', reduced: 'Platform incompatibility with agent-initiated commerce' },
  { layer: 'Checkout authorization handshake', what: 'Confirms purchase intent without requiring a human checkout form', required: 'Future readiness', failure: 'Manual review', reduced: 'Unconfirmed or fraudulent purchase intent' },
  { layer: 'Trusted agent credential', what: 'Verifies the agent is recognized and authorized to act on behalf of the principal', required: 'Yes', failure: 'Blocked', reduced: 'Unauthorized agent access and impersonation' },
  { layer: 'Scoped payment token', what: 'Limits credential use to a specific transaction, merchant, amount, or policy scope', required: 'Yes', failure: 'Blocked', reduced: 'PAN exposure, credential theft, over-authorization' },
  { layer: 'Know-your-agent check', what: 'Verifies agent identity and the delegated authority scope granted by the principal', required: 'Yes', failure: 'Blocked', reduced: 'Identity fraud, unauthorized delegation, policy bypass' },
  { layer: 'Policy attestation', what: 'Confirms the transaction is within approved rules, spend limits, and merchant policies', required: 'Yes', failure: 'Blocked', reduced: 'Policy violations, excess spend, unapproved merchants' },
  { layer: 'Payment routing decision', what: 'Selects the appropriate payment path based on agent context, token, and policy', required: 'Yes', failure: 'Manual review', reduced: 'Routing errors, failed transactions, rail mismatch' },
  { layer: 'Audit record', what: 'Preserves an immutable record of agent action, transaction, token use, and policy state', required: 'Yes', failure: 'Continue (compliance gap)', reduced: 'Non-compliance, dispute evidence gaps, regulatory exposure' },
];

// ─── Color helpers ────────────────────────────────────────────────────────────

function valColor(v: string): string {
  if (v === 'High' || v === 'Highest' || v === 'Medium–High') return 'text-orange-400';
  if (v === 'Medium' || v === 'Moderate') return 'text-yellow-400';
  if (v === 'Low' || v === 'Lowest' || v === 'Low–Medium') return 'text-emerald-400';
  if (v === 'Required') return 'text-cyan-400';
  if (v === 'Optional') return 'text-slate-300';
  if (v === 'Not required') return 'text-slate-500';
  if (v === 'TBD' || v === 'Future-facing') return 'text-slate-500 italic';
  return 'text-slate-300';
}

function statusColor(s: string): string {
  return s === 'Mature' ? 'text-emerald-400' : s === 'Emerging' ? 'text-yellow-400' : 'text-orange-400';
}

function statusBg(s: string): string {
  return s === 'Mature' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : s === 'Emerging' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    : 'bg-orange-500/20 text-orange-300 border-orange-500/30';
}

function reqColor(r: string): string {
  return r === 'Yes' ? 'text-cyan-400' : 'text-slate-500';
}

function failColor(f: string): string {
  return f === 'Blocked' ? 'text-red-400' : f === 'Manual review' ? 'text-orange-400' : 'text-slate-400';
}

function scoreColor(s: number): string {
  return s >= 70 ? 'text-emerald-400' : s >= 55 ? 'text-cyan-400' : 'text-yellow-400';
}

function scoreBar(s: number): string {
  return s >= 70 ? 'bg-emerald-500' : s >= 55 ? 'bg-cyan-500' : 'bg-yellow-500';
}

// ─── Card component ───────────────────────────────────────────────────────────

function InfraCard({ title, score, capabilities, monoImpact, riskImpact, nextMove, children }: {
  title: string; score: number; capabilities: string[];
  monoImpact: string; riskImpact: string; nextMove: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
      <button
        className="w-full text-left p-5 hover:bg-slate-700/20 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:ring-inset"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <span className={`text-sm font-bold tabular-nums ${scoreColor(score)}`}>{score}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full transition-all duration-700 ${scoreBar(score)}`} style={{ width: `${score}%` }} />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {capabilities.slice(0, 4).map(c => (
                <span key={c} className="text-xs bg-slate-700/60 border border-slate-600/50 text-slate-400 rounded px-2 py-0.5">{c}</span>
              ))}
              {capabilities.length > 4 && (
                <span className="text-xs bg-slate-700/40 text-slate-500 rounded px-2 py-0.5">+{capabilities.length - 4} more</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-500 mb-0.5">Monetization Impact</p>
                <p className="text-emerald-300/90 leading-snug">{monoImpact}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">Risk Impact</p>
                <p className="text-orange-300/90 leading-snug">{riskImpact}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-0.5">Recommended Next Move</p>
                <p className="text-slate-300 leading-snug">{nextMove}</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 mt-1 text-slate-400">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-700/40 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdvancedInfrastructure({ inputs }: Props) {
  const scores = calcInfraScores(inputs);
  const authRows = getAuthRows(inputs);
  const isAgentic = inputs.agenticPaymentUsage;
  const hasCB = inputs.crossBorderPercent > 25;
  const hasHighIPO = inputs.instantPayoutAdoption > 30;

  return (
    <section id="infrastructure" className="py-10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <Cpu size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Advanced Payment Infrastructure Readiness</h2>
        </div>
        <p className="text-slate-400 text-sm mb-2">
          Four infrastructure domains that determine platform payment completeness. Scores reflect priority level given the current platform profile.
        </p>
        <p className="text-xs text-amber-400/70 italic mb-5">
          Illustrative readiness priorities based on synthetic logic. Not legal, compliance, or financial advice. Expand each card for full detail.
        </p>

        <div className="space-y-4">

          {/* Card 1: Tender Strategy */}
          <InfraCard
            title="1 — Tender Strategy"
            score={scores.tender}
            capabilities={['Card payment', 'Bank transfer', 'Mobile wallet', 'Stored balance', 'Split tender', 'Cross-border LPM', 'Tokenized credential']}
            monoImpact={hasCB ? 'Local payment method coverage improves conversion in international markets.' : 'Closed-loop and tokenized tenders reduce acceptance cost and improve repeat-purchase economics.'}
            riskImpact={hasCB ? 'Cross-border tenders require strong authentication controls and local reconciliation.' : 'Tokenized credentials reduce PAN exposure and improve repeat-use authentication readiness.'}
            nextMove={hasCB ? 'Map LPM coverage by market and prioritize tokenized credentials for recurring flows.' : 'Evaluate closed-loop and tokenized tender options to reduce cost and strengthen platform control.'}
          >
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              <TooltipTerm abbr="Tender" definition="The funding source or payment method used by a buyer to complete a transaction.">Tender</TooltipTerm> strategy affects acceptance cost, conversion, authentication needs, customer experience, and how much payment control the platform can retain.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700/50">
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Tender Type</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Loop Type</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">
                      <TooltipTerm abbr="Tokenization" definition="A security method that replaces sensitive payment credentials with a protected token.">Tokenization</TooltipTerm>
                    </th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Cost Impact</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Conversion Impact</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Risk Impact</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Best-Fit Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  {TENDER_ROWS.map(r => (
                    <tr key={r.name} className="border-t border-slate-700/20 hover:bg-slate-700/10">
                      <td className="px-3 py-2.5 font-medium text-slate-200 whitespace-nowrap">{r.name}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {r.loop === 'Open loop'
                          ? <TooltipTerm abbr="Open Loop" definition="A payment method that can be used outside the platform across external merchants or networks."><span className="text-slate-300">{r.loop}</span></TooltipTerm>
                          : r.loop === 'Closed loop'
                          ? <TooltipTerm abbr="Closed Loop" definition="A payment method that can be used only within the platform or controlled ecosystem."><span className="text-slate-300">{r.loop}</span></TooltipTerm>
                          : <span className="text-slate-300">{r.loop}</span>}
                      </td>
                      <td className={`px-3 py-2.5 whitespace-nowrap ${valColor(r.token)}`}>{r.token}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap ${valColor(r.cost)}`}>{r.cost}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap ${valColor(r.conv)}`}>{r.conv}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap ${valColor(r.risk)}`}>{r.risk}</td>
                      <td className="px-3 py-2.5 text-slate-400 min-w-[200px]">{r.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InfraCard>

          {/* Card 2: Seller Payout Rail Strategy */}
          <InfraCard
            title="2 — Seller Payout Rail Strategy"
            score={scores.payout}
            capabilities={['Standard bank payout', 'Instant debit', 'Stored balance', 'Digital check', 'Cross-border wallet', 'Stable-value digital']}
            monoImpact={hasHighIPO ? 'Instant payout monetization and stored balance stickiness are near-term revenue expansion opportunities.' : 'Standard payout is operationally efficient but limits instant payout monetization and seller retention.'}
            riskImpact={inputs.instantPayoutAdoption > 50 ? 'Instant payout at high adoption creates significant liquidity and fraud exposure without strong controls.' : hasCB ? 'Cross-border payout rails require FX management, local compliance, and multi-currency reconciliation.' : 'Payout rail risk is manageable at current scale.'}
            nextMove={hasHighIPO ? 'Build payout rail governance, liquidity controls, and instant payout fraud monitoring.' : 'Evaluate instant payout monetization and stored balance model for seller retention.'}
          >
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Payout strategy determines seller experience, liquidity exposure, operational cost, monetization potential, and reconciliation burden.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700/50">
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Payout Rail</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Speed</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Cost Profile</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Seller Convenience</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Liquidity Risk</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Compliance Complexity</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Reconciliation</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Best-Fit Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYOUT_ROWS.map(r => (
                    <tr key={r.name} className="border-t border-slate-700/20 hover:bg-slate-700/10">
                      <td className="px-3 py-2.5 font-medium text-slate-200 whitespace-nowrap">{r.name}</td>
                      <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">{r.speed}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap ${valColor(r.cost)}`}>{r.cost}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap ${valColor(r.conv)}`}>{r.conv}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap ${valColor(r.liq)}`}>{r.liq}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap ${valColor(r.comp)}`}>{r.comp}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap ${valColor(r.recon)}`}>{r.recon}</td>
                      <td className="px-3 py-2.5 text-slate-400 min-w-[200px]">{r.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-600 mt-3 italic">
              * Stable-value digital payout is a future-facing, illustrative concept. Subject to legal, regulatory, and operational review. Not a product offering.
            </p>
          </InfraCard>

          {/* Card 3: Authorization & Risk Optimization */}
          <InfraCard
            title="3 — Authorization & Risk Optimization"
            score={scores.auth}
            capabilities={['Fraud screening', 'Chargeback ops', 'Reserve policy', 'Auth triggers', 'Dynamic retry', 'Routing', 'Credential updater', 'Dispute workflow', 'AML / Sanctions']}
            monoImpact="Improved authorization rates and reduced preventable declines increase revenue capture from existing transaction volume."
            riskImpact={inputs.refundDisputeRate > 3 ? 'Dispute rate is elevated — fraud screening, reserve policy, and chargeback operations require immediate review.' : 'Current risk profile suggests moderate exposure. Credential updater and routing optimization are the highest near-term levers.'}
            nextMove={inputs.refundDisputeRate > 3 ? 'Prioritize fraud screening upgrade, reserve policy review, and dispute workflow automation.' : 'Implement credential updater and routing optimization to improve authorization performance.'}
          >
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Authorization and risk optimization improve approval performance, reduce preventable declines, manage fraud exposure, and protect the platform from dispute losses.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700/50">
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Capability</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Status</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Business Impact</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Risk Impact</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {authRows.map(r => (
                    <tr key={r.cap} className="border-t border-slate-700/20 hover:bg-slate-700/10">
                      <td className="px-3 py-2.5 font-medium text-slate-200 whitespace-nowrap">
                        {r.cap === 'AML / Sanctions Monitoring' ? (
                          <>
                            <TooltipTerm abbr="AML" definition="Anti-Money Laundering. Controls used to detect and prevent illicit money movement.">AML</TooltipTerm>
                            {' / '}
                            <TooltipTerm abbr="Sanctions Monitoring" definition="Screening buyers, sellers, merchants, or transactions against restricted-party and prohibited-activity controls.">Sanctions Monitoring</TooltipTerm>
                          </>
                        ) : (
                          <AcronymText>{r.cap}</AcronymText>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border ${statusBg(r.status)}`}>{r.status}</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-300 min-w-[180px]">{r.bizImpact}</td>
                      <td className="px-3 py-2.5 text-slate-400 min-w-[180px]">{r.riskImpact}</td>
                      <td className="px-3 py-2.5 text-slate-400 min-w-[220px]">{r.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-amber-400/60 italic mt-3">Capability status is derived synthetically from current platform inputs. Illustrative only.</p>
          </InfraCard>

          {/* Card 4: Agentic Protocol Layer */}
          <InfraCard
            title="4 — Agentic Protocol Layer"
            score={scores.agentic}
            capabilities={['Tool-call protocol', 'Agent credential', 'Scoped token', 'KYA check', 'Policy attestation', 'Audit record']}
            monoImpact={isAgentic ? 'Agentic commerce expands the addressable transaction surface beyond human-initiated checkout.' : 'Agentic commerce capability is not yet enabled — enabling it opens future-facing monetization channels.'}
            riskImpact={isAgentic ? 'Scoped payment tokens, delegated authority validation, and audit records are essential controls for agentic authorization.' : 'Foundational protocol controls should be designed and reviewed before enabling agentic payment flows.'}
            nextMove={isAgentic ? 'Implement tool-call protocol, scoped payment tokens, KYA controls, and policy attestation before enabling live agentic transactions.' : 'Design the agentic payment stack — tool-call interface, agent credential, scoped token, and audit record — as foundational readiness.'}
          >
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Agentic commerce requires more than payment acceptance. The platform must be callable by agents, verify delegated authority, enforce policy limits, protect payment credentials, route the payment, and produce an auditable record.
            </p>
            {!isAgentic && (
              <div className="text-xs text-slate-500 bg-slate-700/20 border border-slate-700/40 rounded-lg px-4 py-2.5 mb-4 italic">
                Agentic payment usage is not currently enabled. The stack below shows the readiness requirements for future activation.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700/50">
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Protocol Layer</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium">What It Does</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">Required</th>
                    <th className="text-center px-3 py-2.5 text-slate-400 font-medium whitespace-nowrap">If Missing</th>
                    <th className="text-left px-3 py-2.5 text-slate-400 font-medium">Risk Reduced</th>
                  </tr>
                </thead>
                <tbody>
                  {AGENTIC_LAYERS.map((r, i) => (
                    <tr key={r.layer} className="border-t border-slate-700/20 hover:bg-slate-700/10">
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 flex-shrink-0 rounded-full bg-slate-700/80 border border-slate-600/50 flex items-center justify-center text-xs text-slate-400 font-medium">{i + 1}</span>
                          <span className="font-medium text-slate-200">
                            {r.layer === 'Know-your-agent check'
                              ? <><TooltipTerm abbr="KYA">Know-your-agent</TooltipTerm> check</>
                              : r.layer.includes('PAN') ? <AcronymText>{r.layer}</AcronymText> : r.layer}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 min-w-[200px]">
                        <AcronymText>{r.what}</AcronymText>
                      </td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap font-medium ${reqColor(r.required)}`}>{r.required}</td>
                      <td className={`px-3 py-2.5 text-center whitespace-nowrap font-medium ${failColor(r.failure)}`}>{r.failure}</td>
                      <td className="px-3 py-2.5 text-slate-400 min-w-[200px]">
                        <AcronymText>{r.reduced}</AcronymText>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-amber-400/60 italic mt-3">
              All agentic protocol concepts are illustrative and vendor-neutral. Not a product specification or endorsement of any specific protocol, platform, or provider.
            </p>
          </InfraCard>

        </div>
      </div>
    </section>
  );
}
