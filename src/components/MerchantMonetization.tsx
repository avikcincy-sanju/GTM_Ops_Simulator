import type { SimulatorInputs } from '../types';
import { calcMonetization } from '../utils/calculations';
import { DollarSign, TrendingUp, Star } from 'lucide-react';
import { TooltipTerm, AcronymText } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

function fmt(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

const LEVERS = [
  'Processing Revenue', 'Platform Fees', 'Value-Added Services (VAS)', 'Embedded Financial Services',
  'Risk & Fraud Tools', 'Instant Payouts', 'Subscription / Software Revenue', 'FX & Cross-Border Services',
  'Data & Reporting Services', 'Seller Working Capital', 'Closed-Loop Wallet / Stored Balance', 'Premium Settlement Speed',
];

function ScoreRing({ score, label }: { score: number; label: string }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? '#10b981' : score >= 50 ? '#06b6d4' : '#f59e0b';
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${label}: ${score} out of 100`}>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#334155" strokeWidth="6" />
        <circle cx="36" cy="36" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${fill} ${circ}`} strokeDashoffset={circ / 4}
          strokeLinecap="round" transform="rotate(-90 36 36)" />
        <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{score}</text>
      </svg>
      <span className="text-xs text-slate-400 text-center leading-tight max-w-20">{label}</span>
    </div>
  );
}

export default function MerchantMonetization({ inputs }: Props) {
  const calc = calcMonetization(inputs);

  const revenueStack = [
    { label: 'Processing Revenue', value: calc.processingRevenue, color: 'bg-cyan-500' },
    { label: 'Platform Fee Revenue', value: calc.platformFeeRevenue, color: 'bg-blue-500' },
    { label: 'VAS Revenue', value: calc.vasRevenue, color: 'bg-emerald-500', abbr: 'VAS' as const },
    { label: 'Instant Payout Revenue', value: calc.instantPayoutRevenue, color: 'bg-purple-500' },
    { label: 'Cross-Border Services', value: calc.crossBorderRevenue, color: 'bg-orange-500' },
  ];
  const maxVal = Math.max(...revenueStack.map(r => r.value), 1);

  const metrics = [
    { label: 'Processing Revenue', value: fmt(calc.processingRevenue) },
    { label: 'Platform Fee Revenue', value: fmt(calc.platformFeeRevenue) },
    { label: <>VAS Opportunity</>, labelStr: 'VAS Opportunity', value: fmt(calc.vasRevenue), abbr: 'VAS' as const },
    { label: 'Instant Payout Opportunity', value: fmt(calc.instantPayoutRevenue) },
    { label: 'Total Estimated Revenue', value: fmt(calc.totalRevenue) },
    { label: 'Revenue per Seller', value: fmt(calc.revenuePerSeller) },
  ];

  return (
    <section className="py-10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Merchant Monetization Intelligence</h2>
        </div>
        <p className="text-xs text-amber-400/70 italic mb-5">
          Illustrative only. Uses synthetic processing take rate (0.80%), <TooltipTerm abbr="VAS">VAS</TooltipTerm> margin (0.40%), instant payout margin (0.20%), cross-border <TooltipTerm abbr="FX">FX</TooltipTerm> margin (0.50%).
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {metrics.map((m, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">
                {'abbr' in m && m.abbr ? (
                  <><TooltipTerm abbr={m.abbr}>{m.labelStr ?? ''}</TooltipTerm></>
                ) : (
                  typeof m.label === 'string' ? m.label : m.label
                )}
              </p>
              <p className="text-xl font-bold text-white">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-5">
          {/* Score Rings */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Platform Scores</h3>
            <div className="flex justify-around">
              <ScoreRing score={calc.profitabilityScore} label="Merchant Profitability" />
              <ScoreRing score={calc.retentionScore} label="Retention / Stickiness" />
            </div>
            <div className="mt-5 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Top Monetization Lever</p>
              <div className="flex items-center gap-2">
                <Star size={13} className="text-yellow-400" />
                <span className="text-sm font-semibold text-white">
                  <AcronymText>{calc.topMonetizationLever}</AcronymText>
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Stack Bar */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Illustrative Revenue Stack</h3>
            <div className="space-y-3">
              {revenueStack.map(r => (
                <div key={r.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">
                      {'abbr' in r && r.abbr ? <><TooltipTerm abbr={r.abbr}>{r.label}</TooltipTerm></> : r.label}
                    </span>
                    <span className="text-white font-medium">{fmt(r.value)}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.color} transition-all duration-700`} style={{ width: `${(r.value / maxVal) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monetization Levers */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-cyan-400" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommended Monetization Levers</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {LEVERS.map(lever => (
              <div key={lever} className="flex items-center gap-2 px-3 py-2 bg-slate-700/40 rounded-lg text-xs text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                <AcronymText>{lever}</AcronymText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
