import type { SimulatorInputs } from '../types';
import { Network } from 'lucide-react';
import { TooltipTerm } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

interface ChannelData {
  bestBuyer: string;
  salesCycle: string;
  cac: string;
  implementation: string;
  scalability: string;
  monetization: string;
  mainRisk: string;
}

const CHANNELS: { name: string; data: ChannelData; color: string }[] = [
  {
    name: 'Direct Sales Channel',
    color: 'border-cyan-500/40 bg-cyan-500/5',
    data: {
      bestBuyer: 'Large merchants, enterprise platforms, complex deals',
      salesCycle: 'Long (3–12 months)',
      cac: 'High — consultative, custom scoping',
      implementation: 'High — custom integration and onboarding',
      scalability: 'Medium — headcount dependent',
      monetization: 'Processing, enterprise platform fees, treasury, reporting',
      mainRisk: 'Long sales cycle, high CAC, dependency on sales team capacity',
    },
  },
  {
    name: 'Partner / Channel Distribution',
    color: 'border-blue-500/40 bg-blue-500/5',
    data: {
      bestBuyer: 'SMBs via software partners, resellers, agencies, financial institutions',
      salesCycle: 'Medium (1–4 months)',
      cac: 'Lower — multiplied through partner network',
      implementation: 'Medium — partner-led implementation',
      scalability: 'High — leverages partner reach without direct headcount',
      monetization: 'Revenue share, platform fees, VAS uplift through partner channel',
      mainRisk: 'Partner dependency, margin compression, brand control',
    },
  },
  {
    name: 'Embedded Platform Channel',
    color: 'border-emerald-500/40 bg-emerald-500/5',
    data: {
      bestBuyer: 'Software-native businesses, SaaS users, marketplace sellers',
      salesCycle: 'Short — payments within existing workflow adoption',
      cac: 'Lowest — embedded in platform acquisition',
      implementation: 'Low — integrated within existing product experience',
      scalability: 'Highest — scales with platform user base',
      monetization: 'Take rate, VAS, embedded financial services, retention-driven expansion',
      mainRisk: 'Integration depth required; retention tied to platform stickiness',
    },
  },
];

const CHANNEL_LABELS: [string, keyof ChannelData, string?][] = [
  ['Best-Fit Buyer', 'bestBuyer'],
  ['Sales Cycle', 'salesCycle'],
  ['CAC Profile', 'cac', 'CAC'],
  ['Implementation Complexity', 'implementation'],
  ['Scalability', 'scalability'],
  ['Best Monetization Path', 'monetization'],
  ['Main Risk', 'mainRisk'],
];

export default function ChannelStrategy({ inputs }: Props) {
  const isDirect = inputs.gtmModel === 'Direct Merchant Sales' || inputs.gtmModel === 'Enterprise Platform GTM';
  const isPartner = inputs.gtmModel === 'Partner / Channel GTM';
  const isEmbedded = inputs.gtmModel === 'Embedded SaaS GTM' || inputs.gtmModel === 'Marketplace / Platform GTM' || inputs.gtmModel === 'Cross-Border Expansion GTM';
  const highlighted = isDirect ? 0 : isPartner ? 1 : isEmbedded ? 2 : -1;

  return (
    <section className="py-10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <Network size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Channel Strategy Assessment</h2>
        </div>
        <p className="text-slate-400 text-sm mb-5">
          Channel strategy should match the buyer, integration depth, implementation complexity, and desired speed of distribution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CHANNELS.map((ch, i) => {
            const isSelected = i === highlighted;
            return (
              <div key={ch.name} className={`border rounded-2xl p-6 transition-all ${isSelected ? `${ch.color} ring-1 ring-offset-0` : 'border-slate-700/50 bg-slate-800/40'} ${isSelected ? 'shadow-lg' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>{ch.name}</h3>
                  {isSelected && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Recommended</span>
                  )}
                </div>
                <div className="space-y-3">
                  {CHANNEL_LABELS.map(([label, key, acronym]) => (
                    <div key={label}>
                      <p className="text-xs text-slate-500 mb-0.5">
                        {acronym ? <><TooltipTerm abbr={acronym}>{label}</TooltipTerm></> : label}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">{ch.data[key]}</p>
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
