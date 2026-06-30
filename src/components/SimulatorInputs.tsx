import type { SimulatorInputs, PlatformType, GTMModel, PaymentOperatingModel, MarketplaceModel } from '../types';
import { SlidersHorizontal, Info } from 'lucide-react';
import { TooltipTerm } from './TooltipTerm';
import { PresetSelector, type Preset } from './ScenarioPresets';

interface Props {
  inputs: SimulatorInputs;
  onChange: (inputs: SimulatorInputs) => void;
  activePresetId: string | null;
  onPresetSelect: (preset: Preset) => void;
}

const PLATFORM_TYPES: PlatformType[] = [
  'SMB Acquirer', 'Vertical SaaS Platform', 'Marketplace', 'Event Commerce Platform',
  'Cross-Border Platform', 'Enterprise Platform', 'Creator / Services Platform', 'B2B Procurement Platform',
];

const GTM_MODELS: GTMModel[] = [
  'Direct Merchant Sales', 'Embedded SaaS GTM', 'Marketplace / Platform GTM',
  'Partner / Channel GTM', 'Enterprise Platform GTM', 'Cross-Border Expansion GTM',
];

const PAYMENT_MODELS: PaymentOperatingModel[] = [
  'Platform as Payment Facilitator', 'Managed Payment Facilitator-as-a-Service',
  'Marketplace Merchant-of-Record Model', 'Seller / Licensee Merchant-of-Record Model',
  'Provider Merchant-of-Record Model', 'Connected Accounts Model',
  'Local Payment Service Provider Model', 'Hybrid Multi-Rail Model',
];

const MARKETPLACE_MODELS: MarketplaceModel[] = [
  'Not a Marketplace', 'Marketplace as Merchant of Record', 'Seller as Merchant of Record',
  'Connected Seller Accounts', 'Payment Facilitator Marketplace', 'Hybrid Marketplace Model',
];

function formatCurrency(val: number): string {
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
}

function SelectField({ label, labelNote, value, options, onChange }: {
  label: React.ReactNode; labelNote?: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {labelNote && <p className="text-xs text-slate-600 mb-1.5 italic">{labelNote}</p>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-700/50 border border-slate-600/50 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SliderField({ label, value, onChange, min, max, step, format }: {
  label: React.ReactNode; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs font-medium text-slate-400">{label}</label>
        <span className="text-xs text-cyan-400 font-semibold">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-500 h-1.5"
      />
      <div className="flex justify-between text-xs text-slate-600 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function SimulatorInputs({ inputs, onChange, activePresetId, onPresetSelect }: Props) {
  function update<K extends keyof SimulatorInputs>(key: K, value: SimulatorInputs[K]) {
    onChange({ ...inputs, [key]: value });
  }

  return (
    <section id="simulator" className="py-10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-3">
          <SlidersHorizontal size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Simulator Inputs</h2>
        </div>
        <p className="text-slate-400 text-sm mb-2">Configure platform parameters to generate a tailored analysis.</p>
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-5">
          <Info size={11} />
          All outputs are illustrative and based on synthetic assumptions.
        </div>

        <PresetSelector activePresetId={activePresetId} onSelect={onPresetSelect} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Configuration */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 pb-3 border-b border-slate-700/50 uppercase tracking-wider">Platform Configuration</h3>
            <div className="space-y-4">
              <SelectField
                label="Platform Type"
                labelNote="Acronyms and model terms are defined in the Terms glossary."
                value={inputs.platformType}
                options={PLATFORM_TYPES}
                onChange={v => update('platformType', v as PlatformType)}
              />
              <SelectField
                label={<><TooltipTerm abbr="GTM">GTM</TooltipTerm> Model</>}
                labelNote="Acronyms and model terms are defined in the Terms glossary."
                value={inputs.gtmModel}
                options={GTM_MODELS}
                onChange={v => update('gtmModel', v as GTMModel)}
              />
              <SelectField
                label={<>Payment Operating Model (<TooltipTerm abbr="PayFac">PayFac</TooltipTerm>, <TooltipTerm abbr="PSP">PSP</TooltipTerm>, <TooltipTerm abbr="MOR">MOR</TooltipTerm> options included)</>}
                value={inputs.paymentOperatingModel}
                options={PAYMENT_MODELS}
                onChange={v => update('paymentOperatingModel', v as PaymentOperatingModel)}
              />
              <SelectField
                label={<>Marketplace Model (<TooltipTerm abbr="MOR">MOR</TooltipTerm> &amp; <TooltipTerm abbr="PayFac">PayFac</TooltipTerm> options included)</>}
                value={inputs.marketplaceModel}
                options={MARKETPLACE_MODELS}
                onChange={v => update('marketplaceModel', v as MarketplaceModel)}
              />
            </div>
          </div>

          {/* Volume & Scale */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 pb-3 border-b border-slate-700/50 uppercase tracking-wider">Volume &amp; Scale</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Annual Payment Volume</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={inputs.annualPaymentVolume}
                    min={0}
                    step={1000000}
                    onChange={e => update('annualPaymentVolume', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 text-white text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{formatCurrency(inputs.annualPaymentVolume)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Average Transaction Size ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={inputs.avgTransactionSize}
                    min={1}
                    step={10}
                    onChange={e => update('avgTransactionSize', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 text-white text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Number of Merchants / Sellers</label>
                <input
                  type="number"
                  value={inputs.numMerchants}
                  min={1}
                  step={50}
                  onChange={e => update('numMerchants', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                />
              </div>
            </div>
          </div>

          {/* Commercial Parameters */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 pb-3 border-b border-slate-700/50 uppercase tracking-wider">Commercial Parameters</h3>
            <div className="space-y-5">
              <SliderField label="Platform Take Rate" value={inputs.platformTakeRate} onChange={v => update('platformTakeRate', v)} min={0} max={30} step={0.5} format={v => `${v.toFixed(1)}%`} />
              <SliderField label="Reserve Hold" value={inputs.reserveHoldPercent} onChange={v => update('reserveHoldPercent', v)} min={0} max={20} step={0.5} format={v => `${v.toFixed(1)}%`} />
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Reserve Release Window (Days)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.reserveReleaseWindowDays}
                    min={1}
                    max={180}
                    step={1}
                    onChange={e => update('reserveReleaseWindowDays', parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-700/50 border border-slate-600/50 text-white text-sm rounded-lg px-3 pr-16 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk & Enrichment */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 pb-3 border-b border-slate-700/50 uppercase tracking-wider">Risk &amp; Services</h3>
            <div className="space-y-5">
              <SliderField
                label={<>Cross-Border % (<TooltipTerm abbr="FX">FX</TooltipTerm> exposure)</>}
                value={inputs.crossBorderPercent}
                onChange={v => update('crossBorderPercent', v)}
                min={0} max={100} step={1} format={v => `${v}%`}
              />
              <SliderField label="Refund / Dispute Rate" value={inputs.refundDisputeRate} onChange={v => update('refundDisputeRate', v)} min={0} max={20} step={0.1} format={v => `${v.toFixed(1)}%`} />
              <SliderField
                label={<><TooltipTerm abbr="VAS">VAS</TooltipTerm> Attach Rate</>}
                value={inputs.vasAttachRate}
                onChange={v => update('vasAttachRate', v)}
                min={0} max={100} step={1} format={v => `${v}%`}
              />
              <SliderField label="Instant Payout Adoption" value={inputs.instantPayoutAdoption} onChange={v => update('instantPayoutAdoption', v)} min={0} max={100} step={1} format={v => `${v}%`} />

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-700/50">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    <TooltipTerm abbr="Agentic Payment Usage" definition="Indicates whether AI agents or automated agents may initiate, assist, or complete payment-related workflows. When enabled, the simulator increases the importance of agent identity, delegated authority, policy checks, scoped payment tokens, beneficiary validation, and audit records.">Agentic Payment Usage</TooltipTerm>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{inputs.agenticPaymentUsage ? 'On — active agent-authorized payment flow' : 'Off — future readiness mode'}</p>
                </div>
                <button
                  onClick={() => update('agenticPaymentUsage', !inputs.agenticPaymentUsage)}
                  aria-pressed={inputs.agenticPaymentUsage}
                  aria-label="Toggle Agentic Payment Usage"
                  className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${inputs.agenticPaymentUsage ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${inputs.agenticPaymentUsage ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
