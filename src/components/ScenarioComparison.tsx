import type { SimulatorInputs, PaymentOperatingModel } from '../types';
import { calcOperatingModelFitScores } from '../utils/calculations';
import { Scale, AlertTriangle } from 'lucide-react';
import { AcronymText } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

interface ScenarioMeta {
  bestFor: string;
  platformControl: string;
  revenueOpp: string;
  complianceBurden: string;
  operatingComplexity: string;
  fundsHolding: string;
  tenderImpact: string;
  payoutRailImpact: string;
  authMaturity: string;
  agenticReadiness: string;
  mainTradeoff: string;
  bestNextMove: string;
}

const SCENARIO_META: Record<PaymentOperatingModel, ScenarioMeta> = {
  'Platform as Payment Facilitator': {
    bestFor: 'SMB acquirers, enterprise platforms',
    platformControl: 'Highest', revenueOpp: 'Highest', complianceBurden: 'Highest', operatingComplexity: 'Highest',
    fundsHolding: 'High',
    tenderImpact: 'Full tender control; closed-loop, split tender, and tokenized options all configurable',
    payoutRailImpact: 'Instant payout and stored balance rails fully controllable and monetizable',
    authMaturity: 'Highest requirement — full fraud, routing, auth, and dispute stack needed',
    agenticReadiness: 'High — platform owns agent scope, token issuance, and policy enforcement',
    mainTradeoff: 'Maximum revenue and control at the cost of compliance, onboarding, dispute ownership, and operational investment.',
    bestNextMove: 'Invest in compliance infrastructure, underwriting automation, and dispute resolution operations.',
  },
  'Managed Payment Facilitator-as-a-Service': {
    bestFor: 'SaaS platforms, vertical platforms, channel-led growth',
    platformControl: 'Very High', revenueOpp: 'High', complianceBurden: 'Medium', operatingComplexity: 'Medium',
    fundsHolding: 'Provider-owned / Shared',
    tenderImpact: 'Tender mix partially constrained by provider capabilities and configured options',
    payoutRailImpact: 'Payout rail options depend on provider service availability and SLA',
    authMaturity: 'Medium — provider handles core auth; platform configures risk rules',
    agenticReadiness: 'Medium — agentic extensions may require provider coordination',
    mainTradeoff: 'Strong commercial control with outsourced compliance; margin sharing with provider reduces net economics.',
    bestNextMove: 'Negotiate commercial terms carefully and build a VAS layer on top of the managed model.',
  },
  'Marketplace Merchant-of-Record Model': {
    bestFor: 'Centralized marketplaces, curated platforms',
    platformControl: 'High', revenueOpp: 'High', complianceBurden: 'Medium', operatingComplexity: 'High',
    fundsHolding: 'Medium to High',
    tenderImpact: 'Marketplace owns checkout; full tender mix and acceptance rules are configurable',
    payoutRailImpact: 'Marketplace controls seller payout rails, enabling payout monetization',
    authMaturity: 'High — marketplace owns dispute and authentication responsibility',
    agenticReadiness: 'Medium-High — marketplace structure supports agent-initiated transaction control',
    mainTradeoff: 'Full checkout control and take rate capture with tax, refund, and reconciliation complexity.',
    bestNextMove: 'Build seller onboarding automation and tax compliance workflows before scaling seller volume.',
  },
  'Seller / Licensee Merchant-of-Record Model': {
    bestFor: 'Platforms with high seller autonomy, low compliance appetite',
    platformControl: 'Medium', revenueOpp: 'Moderate', complianceBurden: 'Low', operatingComplexity: 'Low',
    fundsHolding: 'Seller-owned',
    tenderImpact: 'Seller controls tender acceptance; platform has limited checkout influence',
    payoutRailImpact: 'Seller manages own payout; platform has minimal payout exposure or control',
    authMaturity: 'Low — seller owns authentication and dispute responsibility',
    agenticReadiness: 'Low — agent integration requires seller-level coordination across a dispersed base',
    mainTradeoff: 'Seller owns liability and compliance, reducing platform burden but limiting pricing control and customer experience.',
    bestNextMove: 'Define revenue share model and enforce seller compliance standards contractually.',
  },
  'Provider Merchant-of-Record Model': {
    bestFor: 'Platforms wanting simplicity and minimal compliance burden',
    platformControl: 'Low', revenueOpp: 'Low', complianceBurden: 'Lowest', operatingComplexity: 'Lowest',
    fundsHolding: 'Provider-owned',
    tenderImpact: 'Provider controls tender strategy; platform has minimal direct influence',
    payoutRailImpact: 'Provider manages payout; no direct platform payout monetization available',
    authMaturity: 'Low requirement — provider owns auth and dispute stack',
    agenticReadiness: 'Low — provider intermediation limits direct agentic protocol control',
    mainTradeoff: 'Lowest compliance burden and operational complexity; lowest revenue opportunity and pricing flexibility.',
    bestNextMove: 'Evaluate whether long-term platform economics justify moving up the control spectrum.',
  },
  'Connected Accounts Model': {
    bestFor: 'Vertical SaaS, embedded finance, large seller bases',
    platformControl: 'High', revenueOpp: 'High', complianceBurden: 'Medium', operatingComplexity: 'Medium',
    fundsHolding: 'Shared',
    tenderImpact: 'Strong tender extensibility; tokenized and closed-loop options are layerable',
    payoutRailImpact: 'Instant payout and stored balance well-supported; strong seller payout experience',
    authMaturity: 'Medium-High — shared auth framework with strong monitoring capabilities',
    agenticReadiness: 'High — connected account structure supports scoped token issuance and delegated authority',
    mainTradeoff: 'Strong VAS and embedded finance capability; onboarding and monitoring complexity increases at scale.',
    bestNextMove: 'Prioritize onboarding automation, VAS rollout, and real-time seller monitoring infrastructure.',
  },
  'Local Payment Service Provider Model': {
    bestFor: 'Cross-border platforms, multi-currency merchants',
    platformControl: 'Medium', revenueOpp: 'High', complianceBurden: 'Medium-High', operatingComplexity: 'High',
    fundsHolding: 'Provider-owned / Regional',
    tenderImpact: 'Local payment method coverage is the core capability; cross-border tender breadth is the goal',
    payoutRailImpact: 'Local payout rails available; cross-border reconciliation adds complexity',
    authMaturity: 'Medium — regional auth and compliance requirements vary by market',
    agenticReadiness: 'Low-Medium — regional compliance and provider dependencies constrain protocol design',
    mainTradeoff: 'Local payment method access and regional coverage come with FX exposure and reconciliation complexity.',
    bestNextMove: 'Map local method coverage by market and build FX hedging and multi-currency reconciliation.',
  },
  'Hybrid Multi-Rail Model': {
    bestFor: 'Global platforms, diverse seller types, cross-border scale',
    platformControl: 'High', revenueOpp: 'Highest', complianceBurden: 'High', operatingComplexity: 'Highest',
    fundsHolding: 'Shared / Complex',
    tenderImpact: 'Broadest tender coverage across open-loop, local, closed-loop, and tokenized methods',
    payoutRailImpact: 'Multi-rail payout with highest flexibility and highest reconciliation complexity',
    authMaturity: 'Highest complexity — auth, routing, and compliance vary by rail and market',
    agenticReadiness: 'High potential — multi-rail routing provides flexibility for agent-initiated transactions',
    mainTradeoff: 'Maximum flexibility and revenue across geographies; highest integration and reconciliation complexity.',
    bestNextMove: 'Define rail selection logic, reconciliation strategy, and local compliance requirements per market.',
  },
};

const CONTROL_COLOR: Record<string, string> = {
  'Highest': 'text-cyan-400', 'Very High': 'text-blue-400', 'High': 'text-emerald-400',
  'Medium': 'text-yellow-400', 'Moderate': 'text-yellow-400', 'Low': 'text-orange-400',
};

const BURDEN_COLOR: Record<string, string> = {
  'Highest': 'text-red-400', 'High': 'text-orange-400', 'Medium-High': 'text-yellow-400',
  'Medium': 'text-yellow-300', 'Low': 'text-emerald-400', 'Lowest': 'text-emerald-400',
};

const FUNDS_COLOR: Record<string, string> = {
  'High': 'text-red-400', 'Medium to High': 'text-orange-400',
  'Shared': 'text-cyan-400', 'Shared / Complex': 'text-yellow-400',
  'Provider-owned / Shared': 'text-blue-400', 'Provider-owned': 'text-blue-400',
  'Provider-owned / Regional': 'text-blue-400', 'Seller-owned': 'text-purple-400',
};

function getMaxControlModel(inputs: SimulatorInputs): PaymentOperatingModel {
  if (inputs.platformType === 'Cross-Border Platform' || inputs.gtmModel === 'Cross-Border Expansion GTM')
    return 'Hybrid Multi-Rail Model';
  if (inputs.platformType === 'Marketplace' || inputs.gtmModel === 'Marketplace / Platform GTM')
    return 'Marketplace Merchant-of-Record Model';
  return 'Platform as Payment Facilitator';
}

function getLowerRiskModel(inputs: SimulatorInputs): PaymentOperatingModel {
  if (inputs.platformType === 'Cross-Border Platform')
    return 'Local Payment Service Provider Model';
  if (inputs.platformType === 'Marketplace' || inputs.gtmModel === 'Marketplace / Platform GTM')
    return 'Seller / Licensee Merchant-of-Record Model';
  if (
    inputs.platformType === 'Vertical SaaS Platform' ||
    inputs.platformType === 'B2B Procurement Platform' ||
    inputs.platformType === 'Creator / Services Platform'
  )
    return 'Managed Payment Facilitator-as-a-Service';
  return 'Provider Merchant-of-Record Model';
}

interface Alert { label: string; detail: string; }

function getAlerts(inputs: SimulatorInputs): Alert[] {
  const r: Alert[] = [];
  if (inputs.refundDisputeRate > 5) r.push({ label: 'High Dispute / Refund Rate', detail: 'Reserve and dispute operations need stronger controls.' });
  if (inputs.crossBorderPercent > 40) r.push({ label: 'High Cross-Border Exposure', detail: 'FX, local settlement, and reconciliation complexity increase.' });
  if (inputs.numMerchants > 5000) r.push({ label: 'High Seller Volume', detail: 'Seller onboarding and monitoring scale risk increases.' });
  if (inputs.agenticPaymentUsage) r.push({ label: 'Agentic Payment Usage Enabled', detail: 'Delegated authority, policy attestation, and auditability become mandatory.' });
  if (inputs.instantPayoutAdoption > 50) r.push({ label: 'High Instant Payout Adoption', detail: 'Liquidity, fraud, and payout risk controls become more important.' });
  if (inputs.vasAttachRate < 10) r.push({ label: 'Low VAS Attach Rate', detail: 'Monetization remains overly dependent on processing and platform fees.' });
  return r;
}

function DataRow({ label, value, color = 'text-slate-300' }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-start gap-3 text-xs">
      <span className="text-slate-500 flex-shrink-0">{label}</span>
      <span className={`font-medium text-right leading-snug ${color}`}>{value}</span>
    </div>
  );
}

function TextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-xs">
      <span className="text-slate-500">{label}</span>
      <p className="text-slate-300 mt-0.5 leading-snug">{value}</p>
    </div>
  );
}

export default function ScenarioComparison({ inputs }: Props) {
  const scores = calcOperatingModelFitScores(inputs);
  const alerts = getAlerts(inputs);

  const selectedModel = inputs.paymentOperatingModel;
  const maxControlModel = getMaxControlModel(inputs);
  const lowerRiskModel = getLowerRiskModel(inputs);

  const scenarios = [
    { id: 'selected', title: 'Selected Strategy', subtitle: 'Current configuration', model: selectedModel, gradientBar: 'from-cyan-500 to-blue-500', borderClass: 'border-cyan-500/40', badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40', titleClass: 'text-cyan-300' },
    { id: 'max-control', title: 'Max Control / Max Monetization', subtitle: 'Highest revenue and platform control', model: maxControlModel, gradientBar: 'from-blue-500 to-purple-500', borderClass: 'border-blue-500/40', badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/40', titleClass: 'text-blue-300' },
    { id: 'lower-risk', title: 'Lower Risk / Lower Compliance', subtitle: 'Reduced operational burden', model: lowerRiskModel, gradientBar: 'from-emerald-500 to-teal-500', borderClass: 'border-emerald-500/40', badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40', titleClass: 'text-emerald-300' },
  ];

  return (
    <section className="py-10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <Scale size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Scenario Comparison</h2>
        </div>
        <p className="text-slate-400 text-sm mb-2">
          Three strategic scenarios derived from your current platform profile. Compare operating model implications across all dimensions before committing to a path.
        </p>
        <p className="text-xs text-amber-400/70 italic mb-5">
          Illustrative scenarios using synthetic logic. Not legal, compliance, or financial advice.
        </p>

        {/* Red Flag Alerts */}
        {alerts.length > 0 && (
          <div className="mb-5 bg-red-500/8 border border-red-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-red-400" />
              <h3 className="text-sm font-semibold text-red-300">Red Flag Alerts</h3>
              <span className="text-xs text-red-400/60 ml-1">— {alerts.length} signal{alerts.length !== 1 ? 's' : ''} requiring attention</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {alerts.map(alert => (
                <div key={alert.label} className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="w-1 flex-shrink-0 rounded-full bg-red-500 self-stretch" />
                  <div>
                    <p className="text-xs font-semibold text-red-300">{alert.label}</p>
                    <p className="text-xs text-red-400/80 mt-0.5 leading-relaxed">{alert.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Three Scenario Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {scenarios.map(scenario => {
            const meta = SCENARIO_META[scenario.model];
            const score = scores[scenario.model];
            const scoreColor = score >= 70 ? 'text-emerald-400' : score >= 55 ? 'text-cyan-400' : 'text-yellow-400';
            const scoreBarColor = score >= 70 ? 'bg-emerald-500' : score >= 55 ? 'bg-cyan-500' : 'bg-yellow-500';
            return (
              <div key={scenario.id} className={`bg-slate-800/50 border ${scenario.borderClass} rounded-2xl overflow-hidden flex flex-col`}>
                <div className={`h-1 bg-gradient-to-r ${scenario.gradientBar}`} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${scenario.badgeClass} mb-2`}>{scenario.title}</span>
                    <p className="text-xs text-slate-500 mb-2">{scenario.subtitle}</p>
                    <h3 className={`text-sm font-bold leading-snug ${scenario.titleClass}`}>
                      <AcronymText>{scenario.model}</AcronymText>
                    </h3>
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-xs text-slate-500">Fit Score</span>
                      <span className={`text-sm font-bold tabular-nums ${scoreColor}`}>{score}</span>
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Operating model dimensions */}
                  <div className="space-y-2.5 mb-4 pb-4 border-b border-slate-700/40">
                    <DataRow label="Best For" value={meta.bestFor} />
                    <DataRow label="Platform Control" value={meta.platformControl} color={CONTROL_COLOR[meta.platformControl] ?? 'text-slate-300'} />
                    <DataRow label="Revenue Opportunity" value={meta.revenueOpp} color={CONTROL_COLOR[meta.revenueOpp] ?? 'text-slate-300'} />
                    <DataRow label="Compliance Burden" value={meta.complianceBurden} color={BURDEN_COLOR[meta.complianceBurden] ?? 'text-slate-300'} />
                    <DataRow label="Operating Complexity" value={meta.operatingComplexity} color={BURDEN_COLOR[meta.operatingComplexity] ?? 'text-slate-300'} />
                    <DataRow label="Funds Holding / Licensing" value={meta.fundsHolding} color={FUNDS_COLOR[meta.fundsHolding] ?? 'text-slate-300'} />
                  </div>

                  {/* Infrastructure dimensions */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-slate-700/40">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Infrastructure Dimensions</p>
                    <TextRow label="Tender Strategy Impact" value={meta.tenderImpact} />
                    <TextRow label="Payout Rail Impact" value={meta.payoutRailImpact} />
                    <TextRow label="Auth Optimization Maturity" value={meta.authMaturity} />
                    <TextRow label="Agentic Protocol Readiness" value={meta.agenticReadiness} />
                  </div>

                  {/* Tradeoff */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-slate-400 mb-1">Main Tradeoff</p>
                    <p className="text-xs text-amber-300/90 leading-relaxed">{meta.mainTradeoff}</p>
                  </div>

                  {/* Best next move */}
                  <div className="bg-slate-700/30 rounded-lg p-3 mt-auto">
                    <p className="text-xs font-semibold text-slate-400 mb-1">Best Next Move</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{meta.bestNextMove}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategic Tradeoff paragraph */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Scale size={14} className="text-cyan-400" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Strategic Tradeoff</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Higher platform control can increase monetization and customer experience ownership, but it also increases onboarding, compliance, dispute, reserve, reconciliation, and operational burden. Lower-risk models reduce platform responsibility but may limit pricing control, seller services, and economics.
          </p>
        </div>
      </div>
    </section>
  );
}
