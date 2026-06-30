import { useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';
import { DISPLAY_ENTRIES } from '../glossary';

const CATEGORIES = ['Strategy', 'Payments', 'Compliance', 'Technology', 'Monetization', 'Market Segment', 'Operations', 'Partners', 'Banking', 'Security'];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GlossaryModal({ open, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
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

  const byCategory = CATEGORIES.reduce<Record<string, typeof DISPLAY_ENTRIES>>((acc, cat) => {
    const entries = DISPLAY_ENTRIES.filter(e => e.category === cat);
    if (entries.length > 0) acc[cat] = entries;
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Glossary of terms and acronyms"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen size={18} className="text-cyan-400" />
            <h2 className="text-base font-bold text-white">Glossary of Terms &amp; Acronyms</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            aria-label="Close glossary"
          >
            <X size={16} />
          </button>
        </div>

        <p className="px-6 py-3 text-xs text-slate-500 border-b border-slate-700/30 flex-shrink-0 italic">
          Hover over any underlined abbreviation in the app for an inline definition. This glossary provides a complete reference.
        </p>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {Object.entries(byCategory).map(([category, entries]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-700/30">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {entries.map(entry => (
                  <div key={entry.abbr} className="flex gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-xs font-bold text-cyan-400 w-12 flex-shrink-0 pt-0.5">{entry.abbr}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-200 leading-snug">{entry.term}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{entry.definition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-700/30 flex-shrink-0">
          <p className="text-xs text-slate-600 text-center">
            All definitions are illustrative references only and do not represent legal, compliance, or regulatory advice.
          </p>
        </div>
      </div>
    </div>
  );
}
