import { ChevronRight, TrendingUp, Layers, Shield, BarChart3 } from 'lucide-react';
import { TooltipTerm } from './TooltipTerm';

const SPECTRUM_POSITIONS = [
  { label: 'Platform as Payment Facilitator', left: '5%' },
  { label: 'Managed Payment Facilitator-as-a-Service', left: '32%' },
  { label: 'Marketplace Merchant-of-Record', left: '60%' },
  { label: 'Provider Merchant-of-Record', left: '82%' },
];

export default function Hero() {
  return (
    <section id="hero" className="relative pt-16 pb-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 40%)' }} />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium mb-6 tracking-wider uppercase">
            <BarChart3 size={12} />
            Executive Decision Simulator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Platform Payments{' '}
            <TooltipTerm abbr="GTM">GTM</TooltipTerm> &amp;<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Operating Model Simulator
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-5 max-w-3xl">
            A synthetic decision framework for evaluating go-to-market strategy, payment operating models, marketplace payment structures, merchant monetization, platform risk, and agentic payment trust readiness.
          </p>
          <div className="flex flex-wrap gap-4 mb-5">
            <a href="#simulator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors text-sm">
              Run Simulator <ChevronRight size={16} />
            </a>
            <a href="#framework"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20 text-sm">
              View Framework <Layers size={16} />
            </a>
          </div>
          <p className="text-xs text-slate-500 italic mb-5">
            Illustrative model only. Uses synthetic assumptions and does not represent any specific company, vendor, client, platform, or individual.
          </p>
        </div>

        {/* Control / Risk Spectrum */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-cyan-400" />
            <span className="text-slate-300 text-sm font-medium">Platform Control &amp; Compliance Burden Spectrum</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Shield size={11} className="text-cyan-400" /> More platform control</span>
              <span className="flex items-center gap-1">Less platform control <Shield size={11} className="text-slate-500" /></span>
            </div>
            <div className="relative h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-slate-600 rounded-full">
              {SPECTRUM_POSITIONS.map((pos, i) => (
                <div key={i} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-900 shadow"
                  style={{ left: pos.left }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Higher compliance burden</span>
              <span>Lower compliance burden</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {SPECTRUM_POSITIONS.map((pos, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-0.5 flex-shrink-0" style={{ opacity: 1 - i * 0.2 }} />
                  <span className="text-xs text-slate-400 leading-tight">
                    {pos.label.includes('PF') ? (
                      <>Managed <TooltipTerm abbr="PF">PF</TooltipTerm>-as-a-Service</>
                    ) : pos.label.includes('MoR') || pos.label.includes('Merchant-of-Record') ? (
                      <>{pos.label.split('Merchant-of-Record')[0]}<TooltipTerm abbr="MoR">Merchant-of-Record</TooltipTerm></>
                    ) : pos.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
