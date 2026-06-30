import { useEffect } from 'react';
import { X, FlaskConical } from 'lucide-react';
import { TooltipTerm } from './TooltipTerm';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SIGNALS = [
  { abbr: 'GTM' as const, label: 'GTM Model', desc: 'Determines the primary buyer, sales motion complexity, channel strategy fit, and recommended operating model.' },
  { abbr: null, label: 'Platform Type', desc: 'Used to weight operating model fit scores and marketplace assessment relevance.' },
  { abbr: null, label: 'Payment Operating Model', desc: 'Determines control spectrum position, compliance burden, revenue opportunity, and reconciliation complexity.' },
  { abbr: null, label: 'Marketplace Model', desc: 'Determines checkout ownership, seller onboarding burden, tax responsibility, dispute ownership, and monetization potential.' },
  { abbr: null, label: 'Seller Count', desc: 'Higher seller volume increases onboarding complexity, monitoring burden, and payout operational risk scores.' },
  { abbr: null, label: 'Annual Payment Volume', desc: 'Base for all illustrative revenue calculations. All outputs use synthetic rate assumptions.' },
  { abbr: null, label: 'Cross-Border Exposure', desc: 'Increases fit scores for multi-rail and local payment service provider models. Raises FX and reconciliation risk.' },
  { abbr: null, label: 'Refund / Dispute Rate', desc: 'Elevates risk adjustment in transaction economics and increases risk score for models where the platform owns dispute liability.' },
  { abbr: 'VAS' as const, label: 'VAS Attach Rate', desc: 'Increases monetization potential score and retention/stickiness score. Weights toward operating models supporting embedded services.' },
  { abbr: null, label: 'Instant Payout Adoption', desc: 'Increases instant payout revenue opportunity. Also increases liquidity and fraud risk components.' },
  { abbr: 'AI' as const, label: 'Agentic Payment Usage', desc: 'When enabled, agentic trust readiness becomes part of the executive recommendation and increases scores for models with strong identity, delegation, and audit capabilities.' },
];

const ASSUMPTIONS = [
  { label: 'Illustrative processing take rate', value: '0.80%' },
  { label: 'Illustrative VAS margin', value: '0.40%' },
  { label: 'Illustrative instant payout margin', value: '0.20%' },
  { label: 'Illustrative cross-border services margin', value: '0.50%' },
  { label: 'Illustrative processing cost rate', value: '1.90%' },
  { label: 'Fit score base (all models)', value: '40–65 before adjustments' },
  { label: 'Score range', value: '0–100 (capped)' },
];

export default function MethodologyModal({ open, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Simulator methodology"
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <FlaskConical size={18} className="text-cyan-400" />
            <h2 className="text-base font-bold text-white">Simulator Methodology</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            aria-label="Close methodology"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Overview */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-xs text-amber-300/90 leading-relaxed">
              All scores and calculations are <strong>illustrative only</strong> and based on synthetic assumptions. This simulator does not represent legal, compliance, financial, or operational advice. Outputs are generated from platform configuration inputs using a scoring model built on synthetic rules and rate assumptions.
            </p>
          </div>

          {/* Input Signals */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Input Signals &amp; How They Affect Outputs</h3>
            <div className="space-y-2.5">
              {SIGNALS.map(s => (
                <div key={s.label} className="flex gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-40 flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-200 leading-snug">
                      {s.abbr
                        ? (() => {
                            const firstWord = s.label.startsWith(s.abbr) ? s.abbr : s.label.split(' ')[0];
                            const rest = s.label.startsWith(s.abbr)
                              ? s.label.slice(s.abbr.length).trimStart()
                              : s.label.slice(s.label.indexOf(' ')).trimStart();
                            return <><TooltipTerm abbr={s.abbr}>{firstWord}</TooltipTerm>{rest ? ` ${rest}` : ''}</>;
                          })()
                        : s.label}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Synthetic Rate Assumptions */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Synthetic Rate Assumptions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ASSUMPTIONS.map(a => (
                <div key={a.label} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg gap-3">
                  <span className="text-xs text-slate-400">{a.label}</span>
                  <span className="text-xs font-semibold text-cyan-400 flex-shrink-0">{a.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score Logic */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Score Construction</h3>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed bg-slate-700/20 rounded-xl p-4">
              <p>Fit scores start from a synthetic base (40–65) and are adjusted upward or downward based on input signal combinations. Scores are capped at 0–100.</p>
              <p>Platform type, GTM model, marketplace model, seller count, cross-border exposure, refund/dispute rate, VAS attach rate, instant payout adoption, and agentic payment usage all contribute to score adjustments.</p>
              <p>Operating model fit scores are sorted and the highest-scoring model is recommended. Tie-breaking favors models with higher platform control.</p>
              <p>Revenue calculations use fixed synthetic rate assumptions applied to annual payment volume and related inputs. No live data, market data, or real benchmark data is used.</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-700/30 flex-shrink-0">
          <p className="text-xs text-slate-600 text-center">
            Synthetic framework. Illustrative only. Not legal, compliance, or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
