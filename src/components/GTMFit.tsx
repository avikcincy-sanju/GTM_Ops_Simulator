import type { SimulatorInputs, GTMModel } from '../types';
import { calcGTMScores } from '../utils/calculations';
import { scoreLevel } from '../types';
import { Target, CheckCircle2 } from 'lucide-react';
import { TooltipTerm, AcronymText } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

function ScoreBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400"><AcronymText>{label}</AcronymText></span>
        <span className={color}>{value}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

const GTM_TABLE_DATA: Record<GTMModel, { bestFit: string; buyer: string; mono: string; model: string; risk: string; scale: string }> = {
  'Direct Merchant Sales': { bestFit: 'SMB Acquirer, Enterprise Platform', buyer: 'Merchant / Operator', mono: 'Processing, Platform Fees', model: 'Platform as Payment Facilitator', risk: 'Sales cycle length, CAC', scale: '★★★' },
  'Embedded SaaS GTM': { bestFit: 'Vertical SaaS Platform, Creator Platform', buyer: 'Software Buyer', mono: 'VAS, Embedded Finance', model: 'Connected Accounts / Managed Payment Facilitator-as-a-Service', risk: 'Integration depth, churn', scale: '★★★★' },
  'Marketplace / Platform GTM': { bestFit: 'Marketplace, Event Commerce', buyer: 'Seller / Marketplace Operator', mono: 'Take Rate, VAS, Payouts', model: 'Marketplace MoR, Connected Accounts', risk: 'Onboarding, disputes, reconciliation', scale: '★★★★★' },
  'Partner / Channel GTM': { bestFit: 'SMB Acquirer, Vertical SaaS, B2B', buyer: 'Partner / Reseller / ISV', mono: 'Revenue Share, Platform Fees', model: 'Managed Payment Facilitator-as-a-Service', risk: 'Partner dependency, margin compression', scale: '★★★★' },
  'Enterprise Platform GTM': { bestFit: 'Enterprise Platform, B2B Procurement', buyer: 'Enterprise Buyer', mono: 'Processing, Treasury, Reporting', model: 'Platform as Payment Facilitator', risk: 'Long sales cycle, complexity', scale: '★★★' },
  'Cross-Border Expansion GTM': { bestFit: 'Cross-Border Platform, Marketplace', buyer: 'Global Merchant / Seller', mono: 'FX, Local Methods, Payouts', model: 'Hybrid Multi-Rail, Local PSP Model', risk: 'FX risk, local compliance, settlement', scale: '★★★★' },
};

function ScoreCard({ label, value, isScore = false }: { label: string; value: string | number; isScore?: boolean }) {
  if (isScore && typeof value === 'number') {
    const level = scoreLevel(value);
    return (
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-2"><AcronymText>{label}</AcronymText></p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className={`text-xs font-medium mb-1 ${level.color}`}>{level.label}</span>
        </div>
        <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${level.bg}`} style={{ width: `${value}%` }} />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <p className="text-xs text-slate-400 mb-2"><AcronymText>{label}</AcronymText></p>
      <p className="text-sm font-semibold text-white leading-snug"><AcronymText>{String(value)}</AcronymText></p>
    </div>
  );
}

export default function GTMFit({ inputs }: Props) {
  const scores = calcGTMScores(inputs);

  return (
    <section id="gtm-fit" className="py-10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <Target size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            <TooltipTerm abbr="GTM">GTM</TooltipTerm> + Operating Model Fit
          </h2>
        </div>
        <p className="text-slate-400 text-sm mb-5">
          The selected <TooltipTerm abbr="GTM">GTM</TooltipTerm> model determines who the buyer is, how adoption scales, which monetization levers matter most, and how much operational control the platform should retain.
        </p>

        {/* Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <ScoreCard label="GTM Fit Score" value={scores.fitScore} isScore />
          <ScoreCard label="Recommended Operating Model" value={scores.recommendedModel} />
          <ScoreCard label="Sales Motion Complexity" value={scores.salesMotionComplexity} isScore />
          <ScoreCard label="Seller Onboarding Complexity" value={scores.sellerOnboardingComplexity} isScore />
          <ScoreCard label="Monetization Potential" value={scores.monetizationPotential} isScore />
          <ScoreCard label="Risk Ownership Level" value={scores.riskOwnershipLevel} isScore />
        </div>

        {/* Score Bars */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Dimension Detail</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreBar value={scores.fitScore} label="GTM Fit Score" color="text-cyan-400" />
            <ScoreBar value={scores.salesMotionComplexity} label="Sales Motion Complexity" color="text-blue-400" />
            <ScoreBar value={scores.sellerOnboardingComplexity} label="Seller Onboarding Complexity" color="text-purple-400" />
            <ScoreBar value={scores.monetizationPotential} label="Monetization Potential" color="text-emerald-400" />
            <ScoreBar value={scores.riskOwnershipLevel} label="Risk Ownership Level" color="text-orange-400" />
          </div>
        </div>

        {/* GTM Comparison Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              <TooltipTerm abbr="GTM">GTM</TooltipTerm> Model Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-800/80">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap"><TooltipTerm abbr="GTM">GTM</TooltipTerm> Model</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Best-Fit Platform</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Primary Buyer</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Monetization Path</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Operating Model Fit</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Key Risk</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium whitespace-nowrap">Scalability</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(GTM_TABLE_DATA) as GTMModel[]).map(gtm => {
                  const row = GTM_TABLE_DATA[gtm];
                  const isSelected = gtm === inputs.gtmModel;
                  return (
                    <tr key={gtm} className={`border-t border-slate-700/30 transition-colors ${isSelected ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500' : 'hover:bg-slate-700/20'}`}>
                      <td className={`px-4 py-3 font-medium whitespace-nowrap ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle2 size={13} className="text-cyan-400 flex-shrink-0" />}
                          <AcronymText>{gtm}</AcronymText>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300"><AcronymText>{row.bestFit}</AcronymText></td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap"><AcronymText>{row.buyer}</AcronymText></td>
                      <td className="px-4 py-3 text-slate-300"><AcronymText>{row.mono}</AcronymText></td>
                      <td className="px-4 py-3 text-slate-300"><AcronymText>{row.model}</AcronymText></td>
                      <td className="px-4 py-3 text-slate-400"><AcronymText>{row.risk}</AcronymText></td>
                      <td className="px-4 py-3 text-center text-yellow-400">{row.scale}</td>
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
