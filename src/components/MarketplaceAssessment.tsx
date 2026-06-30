import type { SimulatorInputs, MarketplaceModel } from '../types';
import { calcMarketplaceFitScores } from '../utils/calculations';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { AcronymText } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

interface MarketplaceData {
  customerExp: string;
  onboardBurden: string;
  settlementComplexity: string;
  taxCompliance: string;
  refundDispute: string;
  monetizationPotential: string;
  reconciliationComplexity: string;
  bestFit: string;
}

const MARKETPLACE_DATA: Record<MarketplaceModel, MarketplaceData> = {
  'Not a Marketplace': {
    customerExp: 'N/A', onboardBurden: 'N/A', settlementComplexity: 'N/A',
    taxCompliance: 'N/A', refundDispute: 'N/A', monetizationPotential: 'N/A',
    reconciliationComplexity: 'N/A', bestFit: 'Non-marketplace platforms',
  },
  'Marketplace as Merchant of Record': {
    customerExp: 'Full Control', onboardBurden: 'High', settlementComplexity: 'High',
    taxCompliance: 'Marketplace Owns', refundDispute: 'Marketplace Owns', monetizationPotential: 'Highest',
    reconciliationComplexity: 'High', bestFit: 'Full-checkout platforms, curated marketplaces',
  },
  'Seller as Merchant of Record': {
    customerExp: 'Moderate', onboardBurden: 'Low–Medium', settlementComplexity: 'Low',
    taxCompliance: 'Seller Owns', refundDispute: 'Seller Owns', monetizationPotential: 'Moderate',
    reconciliationComplexity: 'Low', bestFit: 'Platforms wanting low compliance burden',
  },
  'Connected Seller Accounts': {
    customerExp: 'High', onboardBurden: 'Medium', settlementComplexity: 'Medium',
    taxCompliance: 'Shared', refundDispute: 'Shared', monetizationPotential: 'High',
    reconciliationComplexity: 'Medium', bestFit: 'Scale-oriented platforms, large seller bases',
  },
  'Payment Facilitator Marketplace': {
    customerExp: 'Highest', onboardBurden: 'Medium–High', settlementComplexity: 'High',
    taxCompliance: 'Platform Owns', refundDispute: 'Platform Owns', monetizationPotential: 'Highest',
    reconciliationComplexity: 'High', bestFit: 'Platforms wanting maximum monetization and control',
  },
  'Hybrid Marketplace Model': {
    customerExp: 'High', onboardBurden: 'Medium', settlementComplexity: 'Medium–High',
    taxCompliance: 'Shared / Configurable', refundDispute: 'Configurable', monetizationPotential: 'High',
    reconciliationComplexity: 'Medium–High', bestFit: 'Cross-border, multi-currency, diverse seller types',
  },
};

const COMPLEXITY_COLOR: Record<string, string> = {
  'Highest': 'text-cyan-400', 'Full Control': 'text-cyan-400', 'High': 'text-emerald-400',
  'Medium–High': 'text-yellow-400', 'Medium': 'text-yellow-400', 'Low–Medium': 'text-orange-400',
  'Low': 'text-orange-400', 'Moderate': 'text-yellow-400', 'Shared': 'text-slate-300',
  'Shared / Configurable': 'text-slate-300', 'Configurable': 'text-slate-300',
  'Platform Owns': 'text-cyan-400', 'Marketplace Owns': 'text-cyan-400',
  'Seller Owns': 'text-purple-400', 'N/A': 'text-slate-500',
};

function getColor(val: string): string {
  return COMPLEXITY_COLOR[val] ?? 'text-slate-300';
}

function FitBar({ score, selected }: { score: number; selected: boolean }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-cyan-500' : score >= 30 ? 'bg-yellow-500' : 'bg-slate-600';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${selected ? 'text-cyan-300' : 'text-slate-300'}`}>{score}</span>
    </div>
  );
}

const DETAIL_ROWS: [string, keyof MarketplaceData, boolean?][] = [
  ['Customer Experience', 'customerExp'],
  ['Seller Onboarding Burden', 'onboardBurden'],
  ['Settlement Complexity', 'settlementComplexity'],
  ['Tax / Compliance', 'taxCompliance'],
  ['Refund & Dispute', 'refundDispute'],
  ['Monetization Potential', 'monetizationPotential'],
  ['Reconciliation Complexity', 'reconciliationComplexity'],
];

export default function MarketplaceAssessment({ inputs }: Props) {
  const scores = calcMarketplaceFitScores(inputs);
  const isMarketplace = inputs.platformType === 'Marketplace' || inputs.gtmModel === 'Marketplace / Platform GTM';
  const models = Object.keys(MARKETPLACE_DATA).filter(m => m !== 'Not a Marketplace') as MarketplaceModel[];

  return (
    <section id="marketplace" className="py-10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            Marketplace Payment Model Assessment
          </h2>
        </div>
        {!isMarketplace && (
          <div className="inline-flex items-center gap-2 text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-4">
            Current platform profile is not marketplace-focused. Marketplace model assessment is shown for reference.
          </div>
        )}
        <p className="text-slate-400 text-sm mb-5">
          Marketplace payment strategy depends on who owns the buyer relationship, who owns the seller relationship, who is responsible for the transaction, and who carries the burden for onboarding, settlement, refunds, disputes, tax, and reconciliation.
        </p>

        {/* Fit Score Overview */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Illustrative Fit Scores by Marketplace Model</h3>
          <div className="space-y-3">
            {models.map(m => (
              <div key={m} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${inputs.marketplaceModel === m ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-slate-700/20'}`}>
                <div className="flex items-center gap-2 w-64 flex-shrink-0">
                  {inputs.marketplaceModel === m && <CheckCircle2 size={13} className="text-cyan-400 flex-shrink-0" />}
                  <span className={`text-xs font-medium ${inputs.marketplaceModel === m ? 'text-cyan-300' : 'text-slate-300'}`}>
                    <AcronymText>{m}</AcronymText>
                  </span>
                </div>
                <FitBar score={scores[m]} selected={inputs.marketplaceModel === m} />
              </div>
            ))}
          </div>
        </div>

        {/* Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map(m => {
            const data = MARKETPLACE_DATA[m];
            const score = scores[m];
            const isSelected = inputs.marketplaceModel === m;
            return (
              <div key={m} className={`bg-slate-800/50 border rounded-xl p-5 transition-all ${isSelected ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : 'border-slate-700/50'}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-sm font-semibold leading-snug ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                    <AcronymText>{m}</AcronymText>
                  </h3>
                  <span className={`text-lg font-bold ml-2 flex-shrink-0 ${score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-cyan-400' : 'text-yellow-400'}`}>{score}</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 italic">{data.bestFit}</p>
                <div className="space-y-2">
                  {DETAIL_ROWS.map(([label, key]) => (
                    <div key={label} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className={`font-medium ${getColor(data[key] as string)}`}>{data[key] as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
