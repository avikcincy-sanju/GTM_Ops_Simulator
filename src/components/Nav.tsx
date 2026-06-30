import { useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Simulator', href: '#simulator' },
  { label: 'GTM Fit', href: '#gtm-fit' },
  { label: 'Marketplace Model', href: '#marketplace' },
  { label: 'Risk & Trust', href: '#risk-trust' },
  { label: 'Infrastructure', href: '#infrastructure' },
  { label: 'Recommendation', href: '#recommendation' },
  { label: 'Framework', href: '#framework' },
];

interface Props {
  onOpenGlossary: () => void;
}

export default function Nav({ onOpenGlossary }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 shadow-xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="text-white font-bold text-sm tracking-wide">
          <span className="text-cyan-400">Platform</span> Payments GTM Simulator
        </a>
        <div className="hidden md:flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a href={link.href}
                  className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors rounded-md hover:bg-white/5">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={onOpenGlossary}
            className="ml-2 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 rounded-md transition-colors hover:bg-cyan-500/5"
            aria-label="Open glossary of terms and acronyms"
          >
            <BookOpen size={12} />
            Terms
          </button>
        </div>
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-slate-900/98 border-b border-slate-700/50 px-6 pb-4">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm text-slate-300 hover:text-white border-b border-slate-800">
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onOpenGlossary(); }}
            className="flex items-center gap-2 py-2.5 text-sm text-cyan-400 hover:text-cyan-300 w-full"
          >
            <BookOpen size={14} /> Terms &amp; Definitions
          </button>
        </div>
      )}
    </nav>
  );
}
