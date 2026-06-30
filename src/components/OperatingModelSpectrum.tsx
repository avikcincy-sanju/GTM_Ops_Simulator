import { Layers } from 'lucide-react';
import { TooltipTerm, AcronymText } from './TooltipTerm';

type Rating = 'Highest' | 'Very High' | 'High' | 'Medium' | 'Low' | 'Lowest' | 'N/A' | 'Platform' | 'Provider' | 'Provider / Shared' | 'Shared' | 'Marketplace';

interface ModelRow {
  model: string;
  description: string;
  sellerRel: string;
  customerRel: string;
  transaction: string;
  sellerOnboard: string;
  pricing: string;
  splitRules: string;
  payoutRules: string;
  compliance: string;
  kycKyb: string;
  refundDispute: string;
  agentEndpoint: string;
  vasAbility: Rating;
  platformControl: Rating;
  complianceBurden: Rating;
  revenueOpp: Rating;
  opComplexity: Rating;
}

const MODELS: ModelRow[] = [
  {
    model: 'Platform as Payment Facilitator',
    description: 'The platform owns most of the commercial and operational control.',
    sellerRel: 'Platform', customerRel: 'Platform', transaction: 'Platform',
    sellerOnboard: 'Platform', pricing: 'Platform', splitRules: 'Platform',
    payoutRules: 'Platform', compliance: 'Platform', kycKyb: 'Platform',
    refundDispute: 'Platform', agentEndpoint: 'Platform',
    vasAbility: 'Highest', platformControl: 'Highest', complianceBurden: 'Highest',
    revenueOpp: 'Highest', opComplexity: 'Highest',
  },
  {
    model: 'Managed Payment Facilitator-as-a-Service',
    description: 'The platform controls commercial rules while a licensed provider handles regulated obligations.',
    sellerRel: 'Platform', customerRel: 'Platform', transaction: 'Shared',
    sellerOnboard: 'Platform', pricing: 'Platform', splitRules: 'Platform',
    payoutRules: 'Platform', compliance: 'Provider', kycKyb: 'Shared',
    refundDispute: 'Shared', agentEndpoint: 'Platform',
    vasAbility: 'High', platformControl: 'Very High', complianceBurden: 'Medium',
    revenueOpp: 'High', opComplexity: 'Medium',
  },
  {
    model: 'Marketplace Merchant-of-Record',
    description: 'The marketplace owns the customer transaction and centralizes the checkout experience.',
    sellerRel: 'Shared', customerRel: 'Marketplace', transaction: 'Marketplace',
    sellerOnboard: 'Marketplace', pricing: 'Marketplace', splitRules: 'Marketplace',
    payoutRules: 'Marketplace', compliance: 'Marketplace', kycKyb: 'Marketplace',
    refundDispute: 'Marketplace', agentEndpoint: 'Marketplace',
    vasAbility: 'High', platformControl: 'High', complianceBurden: 'Medium',
    revenueOpp: 'High', opComplexity: 'Medium',
  },
  {
    model: 'Provider Merchant-of-Record',
    description: 'A licensed provider owns the transaction while the platform delivers the user experience.',
    sellerRel: 'Provider', customerRel: 'Provider', transaction: 'Provider',
    sellerOnboard: 'Provider', pricing: 'Shared', splitRules: 'Provider',
    payoutRules: 'Provider', compliance: 'Provider', kycKyb: 'Provider',
    refundDispute: 'Provider', agentEndpoint: 'Provider / Shared',
    vasAbility: 'Low', platformControl: 'Low', complianceBurden: 'Lowest',
    revenueOpp: 'Low', opComplexity: 'Low',
  },
];

const RATING_COLORS: Record<string, string> = {
  'Highest': 'text-cyan-400 bg-cyan-400/10',
  'Very High': 'text-blue-400 bg-blue-400/10',
  'High': 'text-emerald-400 bg-emerald-400/10',
  'Medium': 'text-yellow-400 bg-yellow-400/10',
  'Low': 'text-orange-400 bg-orange-400/10',
  'Lowest': 'text-red-400 bg-red-400/10',
  'Platform': 'text-cyan-400 bg-cyan-400/10',
  'Provider': 'text-purple-400 bg-purple-400/10',
  'Provider / Shared': 'text-purple-300 bg-purple-400/10',
  'Shared': 'text-slate-300 bg-slate-600/50',
  'Marketplace': 'text-blue-400 bg-blue-400/10',
  'N/A': 'text-slate-500 bg-slate-700/50',
};

function RatingBadge({ value }: { value: string }) {
  const cls = RATING_COLORS[value] ?? 'text-slate-400 bg-slate-700/50';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{value}</span>;
}

const DIMENSION_ROWS: [string, keyof ModelRow, boolean?][] = [
  ['Seller Relationship', 'sellerRel'],
  ['Customer Relationship', 'customerRel'],
  ['Transaction Ownership', 'transaction'],
  ['Seller Onboarding', 'sellerOnboard'],
  ['Pricing Control', 'pricing'],
  ['Split Rules', 'splitRules'],
  ['Payout Rules', 'payoutRules'],
  ['Compliance', 'compliance'],
  ['KYC / KYB', 'kycKyb', true],
  ['Refund / Dispute', 'refundDispute'],
  ['Agent-Accessible Endpoint Ownership', 'agentEndpoint'],
];

export default function OperatingModelSpectrum() {
  return (
    <section className="py-10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <Layers size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Four Operating Model Control Spectrum</h2>
        </div>
        <p className="text-slate-400 text-sm mb-5">
          Comparing four primary payment operating model archetypes across commercial control, compliance burden, and revenue opportunity dimensions.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {MODELS.map(m => (
            <div key={m.model} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2 leading-snug">
                <AcronymText>{m.model}</AcronymText>
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{m.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Platform Control</span>
                  <RatingBadge value={m.platformControl} />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Compliance Burden</span>
                  <RatingBadge value={m.complianceBurden} />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Revenue Opportunity</span>
                  <RatingBadge value={m.revenueOpp} />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Operating Complexity</span>
                  <RatingBadge value={m.opComplexity} />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500"><TooltipTerm abbr="VAS">VAS</TooltipTerm> Ability</span>
                  <RatingBadge value={m.vasAbility} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Detailed Ownership &amp; Control Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-800/80">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium w-48">Dimension</th>
                  {MODELS.map(m => (
                    <th key={m.model} className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">
                      <AcronymText>{m.model}</AcronymText>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DIMENSION_ROWS.map(([label, key, hasAcronym]) => (
                  <tr key={String(key)} className="border-t border-slate-700/30 hover:bg-slate-700/10">
                    <td className="px-4 py-3 text-slate-400 font-medium">
                      {hasAcronym ? (
                        <>
                          <TooltipTerm abbr="KYC">KYC</TooltipTerm> / <TooltipTerm abbr="KYB">KYB</TooltipTerm>
                        </>
                      ) : label === 'Agent-Accessible Endpoint Ownership' ? (
                        <>
                          <TooltipTerm abbr="Agent-Accessible Endpoint" definition="A structured interface that allows approved AI agents or automated systems to discover, call, or initiate platform workflows.">Agent-Accessible Endpoint</TooltipTerm> Ownership
                        </>
                      ) : label}
                    </td>
                    {MODELS.map(m => (
                      <td key={m.model} className="px-4 py-3">
                        <RatingBadge value={m[key] as string} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
