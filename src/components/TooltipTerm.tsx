import { useState, useRef, useCallback, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { GLOSSARY_MAP, GLOSSARY_FULL_NAME } from '../glossary';

interface TooltipPopupProps {
  id: string;
  abbr: string;
  definition: string;
  anchorRect: DOMRect;
}

function TooltipPopup({ id, abbr, definition, anchorRect }: TooltipPopupProps) {
  const centerX = anchorRect.left + anchorRect.width / 2;
  const spaceAbove = anchorRect.top;
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const showAbove = spaceAbove > 80 || spaceAbove > spaceBelow;

  const rawLeft = Math.max(8, Math.min(centerX, window.innerWidth - 232));

  const style: React.CSSProperties = showAbove
    ? { position: 'fixed', bottom: window.innerHeight - anchorRect.top + 6, left: rawLeft, transform: 'translateX(-50%)' }
    : { position: 'fixed', top: anchorRect.bottom + 6, left: rawLeft, transform: 'translateX(-50%)' };

  const fullName = GLOSSARY_FULL_NAME[abbr];

  return createPortal(
    <div
      id={id}
      role="tooltip"
      aria-label={`${abbr}: ${definition}`}
      style={{ ...style, zIndex: 9999, maxWidth: 220, pointerEvents: 'none' }}
      className="bg-slate-800 border border-slate-600/80 rounded-lg px-3 py-2.5 shadow-2xl"
    >
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-xs font-bold text-cyan-400">{abbr}</span>
        {fullName && <span className="text-xs text-slate-400 leading-tight">{fullName}</span>}
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">{definition}</p>
      {showAbove && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
          style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(71,85,105,0.8)' }} />
      )}
      {!showAbove && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0"
          style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid rgba(71,85,105,0.8)' }} />
      )}
    </div>,
    document.body
  );
}

interface TooltipTermProps {
  abbr: string;
  definition?: string;
  children: React.ReactNode;
  className?: string;
}

export function TooltipTerm({ abbr, definition, children, className = '' }: TooltipTermProps) {
  const [visible, setVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const def = definition ?? GLOSSARY_MAP[abbr] ?? '';

  const show = useCallback(() => {
    if (ref.current) {
      setAnchorRect(ref.current.getBoundingClientRect());
      setVisible(true);
    }
  }, []);

  const hide = useCallback(() => setVisible(false), []);

  const toggle = useCallback(() => {
    if (visible) {
      hide();
    } else {
      show();
    }
  }, [visible, show, hide]);

  if (!def) return <>{children}</>;

  return (
    <>
      <span
        ref={ref}
        className={`border-b border-dotted border-slate-400 cursor-help focus:outline-none focus:border-cyan-400 ${className}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={toggle}
        onTouchStart={toggle}
        tabIndex={0}
        role="term"
        aria-label={`${abbr}: ${def}`}
      >
        {children}
      </span>
      {visible && anchorRect && (
        <TooltipPopup
          id={`tooltip-${abbr}-${Math.random().toString(36).slice(2, 6)}`}
          abbr={abbr}
          definition={def}
          anchorRect={anchorRect}
        />
      )}
    </>
  );
}

// Sorted by length descending to match longer terms first (e.g., SaaS before S)
const ACRONYM_PATTERN = /\b(SaaS|PayFac|B2B|SMB|GTM|VAS|KYC|KYB|KYA|AML|API|ISV|ISO|CAC|ACH|DDA|BIN|LPM|APM|SCA|MTL|PAN|OTP|PII|UX|UI|FX|AI|MoR|MOR|PSP|MVP|SLA|KPI|3DS)\b/g;

interface AcronymTextProps {
  children: string;
  className?: string;
}

export function AcronymText({ children, className }: AcronymTextProps) {
  if (!children) return null;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(ACRONYM_PATTERN.source, 'g');

  while ((match = regex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }
    const abbr = match[0];
    parts.push(
      <TooltipTerm key={`${abbr}-${match.index}`} abbr={abbr}>
        {abbr}
      </TooltipTerm>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  if (parts.length === 0) return <>{children}</>;

  return (
    <span className={className}>
      {parts.map((p, i) => (
        typeof p === 'string'
          ? <Fragment key={i}>{p}</Fragment>
          : p
      ))}
    </span>
  );
}
