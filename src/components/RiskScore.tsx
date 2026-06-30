import type { SimulatorInputs, PaymentOperatingModel } from '../types';
import { calcOperatingModelFitScores } from '../utils/calculations';
import { CheckCircle2, Shield } from 'lucide-react';
import { AcronymText, TooltipTerm } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

interface ModelMeta {
  bestFor: string;
  mainBenefit: string;
  mainRisk: string;
  complianceBurden: string;
  reconciliation: string;
  scalability: string;
  platformControl: string;
  revenueOpp: string;
  fundsHolding: string;
}

const MODEL_META: Record<PaymentOperatingModel, ModelMeta> = {
  'Platform as Payment Facilitator': {
    bestFor: 'SMB acquirers, enterprise platforms', mainBenefit: 'Maximum control and revenue',
    mainRisk: 'Highest compliance and operational burden', complianceBurden: 'Highest',
    reconciliation: 'High', scalability: 'High with investment', platformControl: 'Highest', revenueOpp: 'Highest',
    fundsHolding: 'High',
  },
  'Managed Payment Facilitator-as-a-Service': {
    bestFor: 'SaaS platforms, vertical platforms', mainBenefit: 'Commercial control with outsourced compliance',
    mainRisk: 'Provider dependency, margin sharing', complianceBurden: 'Medium',
    reconciliation: 'Medium', scalability: 'Very High', platformControl: 'Very High', revenueOpp: 'High',
    fundsHolding: 'Provider-owned / Shared',
  },
  'Marketplace Merchant-of-Record Model': {
    bestFor: 'Centralized marketplaces, curated platforms', mainBenefit: 'Full checkout control and seller unification',
    mainRisk: 'Dispute and tax complexity', complianceBurden: 'Medium',
    reconciliation: 'High', scalability: 'High', platformControl: 'High', revenueOpp: 'High',
    fundsHolding: 'Medium to High',
  },
  'Seller / Licensee Merchant-of-Record Model': {
    bestFor: 'Low-compliance platforms, high seller autonomy', mainBenefit: 'Seller owns liability and compliance',
    mainRisk: 'Loss of customer experience control', complianceBurden: 'Low',
    reconciliation: 'Low', scalability: 'Very High', platformControl: 'Medium', revenueOpp: 'Moderate',
    fundsHolding: 'Seller-owned',
  },
  'Provider Merchant-of-Record Model': {
    bestFor: 'Platforms wanting simplicity', mainBenefit: 'Lowest compliance burden',
    mainRisk: 'Lowest revenue and control', complianceBurden: 'Lowest',
    reconciliation: 'Low', scalability: 'Highest', platformControl: 'Low', revenueOpp: 'Low',
    fundsHolding: 'Provider-owned',
  },
  'Connected Accounts Model': {
    bestFor: 'Vertical SaaS, embedded finance', mainBenefit: 'Scalable onboarding, strong VAS',
    mainRisk: 'Onboarding and monitoring at scale', complianceBurden: 'Medium',
    reconciliation: 'Medium', scalability: 'Highest', platformControl: 'High', revenueOpp: 'High',
    fundsHolding: 'Shared',
  },
  'Local Payment Service Provider Model': {
    bestFor: 'Cross-border, multi-currency platforms', mainBenefit: 'Local method access, regional compliance',
    mainRisk: 'FX exposure, reconciliation complexity', complianceBurden: 'Medium-High',
    reconciliation: 'High', scalability: 'Medium', platformControl: 'Medium', revenueOpp: 'High',
    fundsHolding: 'Provider-owned / Regional',
  },
  'Hybrid Multi-Rail Model': {
    bestFor: 'Global platforms, diverse seller types', mainBenefit: 'Flexibility across geographies and models',
    mainRisk: 'Highest reconciliation and integration complexity', complianceBurden: 'High',
    reconciliation: 'Highest', scalability: 'High', platformControl: 'High', revenueOpp: 'Highest',
    fundsHolding: 'Shared / Complex',
  },
};

const BURDEN_COLOR: Record<string, string> = {
  'Highest': 'text-red-400', 'High': 'text-orange-400', 'Medium-High': 'text-yellow-400',
  'Medium': 'text-yellow-400', 'Low': 'text-emerald-400', 'Lowest': 'text-emerald-400',
  'Very High': 'text-blue-400',
};

const CONTROL_COLOR: Record<string, string> = {
  'Highest': 'text-cyan-400', 'Very High': 'text-blue-400', 'High': 'text-emerald-400',
  'Medium': 'text-yellow-400', 'Low': 'text-orange-400',
};

const FUNDS_COLOR: Record<string, string> = {
  'High': 'text-red-400',
  'Medium to High': 'text-orange-400',
  'Shared': 'text-cyan-400',
  'Shared / Complex': 'text-yellow-400',
  'Provider-owned / Shared': 'text-blue-400',
  'Provider-owned': 'text-blue-400',
  'Provider-owned / Regional': 'text-blue-400',
  'Seller-owned': 'text-purple-400',
};

const FUNDS_HOLDING_DEFINITION = 'The degree to which the platform may be exposed to regulatory obligations when receiving, holding, controlling, or transmitting funds on behalf of buyers, sellers, or merchants.';

export default function RiskScore({ inputs }: Props) {
  const scores = calcOperatingModelFitScores(inputs);
  const sorted = (Object.keys(scores) as PaymentOperatingModel[]).sort((a, b) => scores[b] - scores[a]);

  return (
    <section id="risk-trust" className="py-10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Operating Model Risk Score</h2>
        </div>
        <p className="text-slate-400 text-sm mb-5">
          Fit scores are derived from platform type, <TooltipTerm abbr="GTM">GTM</TooltipTerm> model, marketplace model, seller count, cross-border exposure, dispute rate, and <TooltipTerm abbr="VAS">VAS</TooltipTerm> profile.
        </p>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700/50">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Operating Model</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Fit Score</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Best For</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Main Benefit</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Main Risk</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Compliance</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Reconciliation</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Scalability</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Platform Control</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium whitespace-nowrap">
                    <TooltipTerm abbr="Revenue Opportunity" definition="The estimated ability of the model to generate processing revenue, platform fees, value-added services revenue, payout revenue, and related monetization.">Revenue Opp.</TooltipTerm>
                  </th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium whitespace-nowrap">
                    <TooltipTerm abbr="Funds / Licensing Exposure" definition={FUNDS_HOLDING_DEFINITION}>
                      Funds / Licensing
                    </TooltipTerm>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(model => {
                  const meta = MODEL_META[model];
                  const score = scores[model];
                  const isSelected = model === inputs.paymentOperatingModel;
                  const scoreColor = score >= 70 ? 'text-emerald-400' : score >= 55 ? 'text-cyan-400' : score >= 40 ? 'text-yellow-400' : 'text-orange-400';
                  return (
                    <tr key={model} className={`border-t border-slate-700/30 transition-colors ${isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-700/10'}`}>
                      <td className={`px-4 py-3 font-medium whitespace-nowrap ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle2 size={13} className="text-cyan-400 flex-shrink-0" />}
                          <AcronymText>{model}</AcronymText>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-bold ${scoreColor}`}>{score}</span>
                          <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${scoreColor.replace('text-', 'bg-')}`} style={{ width: `${score}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-xs"><AcronymText>{meta.bestFor}</AcronymText></td>
                      <td className="px-4 py-3 text-slate-300 max-w-xs"><AcronymText>{meta.mainBenefit}</AcronymText></td>
                      <td className="px-4 py-3 text-slate-400 max-w-xs"><AcronymText>{meta.mainRisk}</AcronymText></td>
                      <td className={`px-4 py-3 text-center font-medium ${BURDEN_COLOR[meta.complianceBurden] ?? 'text-slate-300'}`}>{meta.complianceBurden}</td>
                      <td className={`px-4 py-3 text-center font-medium ${BURDEN_COLOR[meta.reconciliation] ?? 'text-slate-300'}`}>{meta.reconciliation}</td>
                      <td className="px-4 py-3 text-center text-slate-300">{meta.scalability}</td>
                      <td className={`px-4 py-3 text-center font-medium ${CONTROL_COLOR[meta.platformControl] ?? 'text-slate-300'}`}>{meta.platformControl}</td>
                      <td className={`px-4 py-3 text-center font-medium ${CONTROL_COLOR[meta.revenueOpp] ?? 'text-slate-300'}`}>{meta.revenueOpp}</td>
                      <td className={`px-4 py-3 text-center font-medium whitespace-nowrap ${FUNDS_COLOR[meta.fundsHolding] ?? 'text-slate-300'}`}>{meta.fundsHolding}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
