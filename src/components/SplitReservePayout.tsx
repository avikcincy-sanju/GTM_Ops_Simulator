import type { SimulatorInputs } from '../types';
import { calcSplit } from '../utils/calculations';
import { Calculator } from 'lucide-react';

interface Props { inputs: SimulatorInputs; }

function fmt2(n: number): string {
  return n >= 0 ? `$${n.toFixed(2)}` : `-$${Math.abs(n).toFixed(2)}`;
}

function pct(n: number, total: number): number {
  return total > 0 ? (n / total) * 100 : 0;
}

export default function SplitReservePayout({ inputs }: Props) {
  const s = calcSplit(inputs);

  const stackItems = [
    { label: 'Seller Receives Today', value: s.sellerReceivesToday, color: 'bg-emerald-500' },
    { label: 'Reserve Held', value: s.reserveHeld, color: 'bg-blue-500' },
    { label: 'Processing Cost', value: s.processingCost, color: 'bg-purple-500' },
    { label: 'Platform Net (Pre-Risk)', value: Math.max(0, s.platformNetBeforeRisk), color: 'bg-cyan-500' },
    { label: 'Risk Adjustment', value: s.riskAdjustment, color: 'bg-orange-500' },
  ];

  const rows = [
    { label: 'Buyer Pays', value: fmt2(s.buyerPays), note: 'Full transaction amount', color: 'text-white' },
    { label: 'Platform Fee', value: fmt2(s.platformFee), note: `${inputs.platformTakeRate}% take rate`, color: 'text-cyan-400' },
    { label: 'Seller Gross Amount', value: fmt2(s.sellerGross), note: 'Before reserve deduction', color: 'text-slate-300' },
    { label: 'Reserve Held', value: fmt2(s.reserveHeld), note: `${inputs.reserveHoldPercent}% of seller gross`, color: 'text-blue-400' },
    { label: 'Seller Receives Today', value: fmt2(s.sellerReceivesToday), note: 'Net payout on settlement', color: 'text-emerald-400' },
    { label: `Reserve Release (Day ${inputs.reserveReleaseWindowDays})`, value: fmt2(s.reserveRelease), note: 'Released if no dispute', color: 'text-slate-300' },
    { label: 'Illustrative Processing Cost', value: fmt2(s.processingCost), note: '1.90% of transaction (synthetic)', color: 'text-orange-400' },
    { label: 'Platform Net (Pre-Risk)', value: fmt2(s.platformNetBeforeRisk), note: 'Platform fee minus processing cost', color: s.platformNetBeforeRisk >= 0 ? 'text-cyan-300' : 'text-red-400' },
    { label: 'Risk Adjustment', value: fmt2(s.riskAdjustment), note: `${inputs.refundDisputeRate}% dispute/refund rate`, color: 'text-orange-400' },
    { label: 'Platform Risk-Adjusted Net', value: fmt2(s.platformRiskAdjustedNet), note: 'Estimated net after risk', color: s.platformRiskAdjustedNet >= 0 ? 'text-emerald-400' : 'text-red-400', bold: true },
  ];

  return (
    <section className="py-10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <Calculator size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Split, Reserve &amp; Payout Economics</h2>
        </div>
        <p className="text-slate-400 text-sm mb-2">
          Reserve design, split rules, payout timing, and dispute buffers are configurable commercial controls in platform payment models. Higher control can improve monetization but increases operational and compliance responsibility.
        </p>
        <p className="text-xs text-amber-400/70 italic mb-5">
          Illustrative transaction breakdown using synthetic assumptions. Processing cost rate: 1.90%.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction breakdown table */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Transaction Economics — Average Transaction: ${inputs.avgTransactionSize.toFixed(2)}
              </h3>
            </div>
            <div className="divide-y divide-slate-700/30">
              {rows.map(row => (
                <div key={row.label} className={`flex justify-between items-center px-6 py-3 ${row.bold ? 'bg-slate-700/30' : ''}`}>
                  <div>
                    <p className={`text-sm ${row.bold ? 'font-semibold' : 'font-medium'} text-slate-200`}>{row.label}</p>
                    <p className="text-xs text-slate-500">{row.note}</p>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Split Bar */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">Visual Transaction Split</h3>
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Distribution of ${inputs.avgTransactionSize.toFixed(2)} transaction</p>
              <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
                {stackItems.map(item => {
                  const w = pct(item.value, s.buyerPays);
                  return w > 0.5 ? (
                    <div key={item.label} className={`${item.color} flex-shrink-0 relative group`} style={{ width: `${w}%` }}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold">{w.toFixed(0)}%</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="space-y-3">
              {stackItems.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                      <span className="text-slate-400">{item.label}</span>
                    </div>
                    <span className="text-slate-300 font-medium">{fmt2(item.value)} ({pct(item.value, s.buyerPays).toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-700/50 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Reserve Window</span>
                <span className="text-blue-400 font-medium">{inputs.reserveReleaseWindowDays} days</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Dispute Rate Applied</span>
                <span className="text-orange-400 font-medium">{inputs.refundDisputeRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Platform Risk-Adjusted Net</span>
                <span className={`font-bold ${s.platformRiskAdjustedNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmt2(s.platformRiskAdjustedNet)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
