import type { SimulatorInputs } from '../types';
import { Layers2 } from 'lucide-react';

export interface Preset {
  id: string;
  label: string;
  description: string;
  inputs: SimulatorInputs;
}

export const PRESETS: Preset[] = [
  {
    id: 'vertical-saas',
    label: 'Vertical SaaS',
    description: 'Embedded payments within a vertical software platform',
    inputs: {
      platformType: 'Vertical SaaS Platform',
      gtmModel: 'Embedded SaaS GTM',
      paymentOperatingModel: 'Connected Accounts Model',
      marketplaceModel: 'Not a Marketplace',
      annualPaymentVolume: 50_000_000,
      avgTransactionSize: 120,
      numMerchants: 500,
      platformTakeRate: 10,
      reserveHoldPercent: 5,
      reserveReleaseWindowDays: 30,
      crossBorderPercent: 10,
      refundDisputeRate: 1.5,
      vasAttachRate: 22,
      instantPayoutAdoption: 30,
      agenticPaymentUsage: false,
    },
  },
  {
    id: 'marketplace',
    label: 'Marketplace Platform',
    description: 'Multi-seller marketplace with take rate and payout model',
    inputs: {
      platformType: 'Marketplace',
      gtmModel: 'Marketplace / Platform GTM',
      paymentOperatingModel: 'Marketplace Merchant-of-Record Model',
      marketplaceModel: 'Marketplace as Merchant of Record',
      annualPaymentVolume: 150_000_000,
      avgTransactionSize: 85,
      numMerchants: 3500,
      platformTakeRate: 12,
      reserveHoldPercent: 8,
      reserveReleaseWindowDays: 45,
      crossBorderPercent: 30,
      refundDisputeRate: 3,
      vasAttachRate: 18,
      instantPayoutAdoption: 40,
      agenticPaymentUsage: false,
    },
  },
  {
    id: 'cross-border',
    label: 'Cross-Border Platform',
    description: 'Global platform with significant FX and multi-rail exposure',
    inputs: {
      platformType: 'Cross-Border Platform',
      gtmModel: 'Cross-Border Expansion GTM',
      paymentOperatingModel: 'Hybrid Multi-Rail Model',
      marketplaceModel: 'Hybrid Marketplace Model',
      annualPaymentVolume: 200_000_000,
      avgTransactionSize: 250,
      numMerchants: 1200,
      platformTakeRate: 8,
      reserveHoldPercent: 10,
      reserveReleaseWindowDays: 60,
      crossBorderPercent: 65,
      refundDisputeRate: 2.5,
      vasAttachRate: 12,
      instantPayoutAdoption: 20,
      agenticPaymentUsage: false,
    },
  },
  {
    id: 'enterprise',
    label: 'Enterprise Platform',
    description: 'Large enterprise platform with complex treasury and reporting needs',
    inputs: {
      platformType: 'Enterprise Platform',
      gtmModel: 'Enterprise Platform GTM',
      paymentOperatingModel: 'Platform as Payment Facilitator',
      marketplaceModel: 'Not a Marketplace',
      annualPaymentVolume: 500_000_000,
      avgTransactionSize: 1200,
      numMerchants: 80,
      platformTakeRate: 6,
      reserveHoldPercent: 3,
      reserveReleaseWindowDays: 14,
      crossBorderPercent: 20,
      refundDisputeRate: 0.8,
      vasAttachRate: 35,
      instantPayoutAdoption: 15,
      agenticPaymentUsage: true,
    },
  },
  {
    id: 'smb-acquirer',
    label: 'SMB Acquirer',
    description: 'High-volume SMB merchant acquisition with direct sales motion',
    inputs: {
      platformType: 'SMB Acquirer',
      gtmModel: 'Direct Merchant Sales',
      paymentOperatingModel: 'Platform as Payment Facilitator',
      marketplaceModel: 'Not a Marketplace',
      annualPaymentVolume: 80_000_000,
      avgTransactionSize: 55,
      numMerchants: 2000,
      platformTakeRate: 14,
      reserveHoldPercent: 6,
      reserveReleaseWindowDays: 30,
      crossBorderPercent: 5,
      refundDisputeRate: 2.2,
      vasAttachRate: 10,
      instantPayoutAdoption: 35,
      agenticPaymentUsage: false,
    },
  },
];

interface PresetSelectorProps {
  activePresetId: string | null;
  onSelect: (preset: Preset) => void;
}

export function PresetSelector({ activePresetId, onSelect }: PresetSelectorProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Layers2 size={14} className="text-cyan-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scenario Presets</span>
        <span className="text-xs text-slate-600 ml-1">— click to auto-populate inputs</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(preset => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              title={preset.description}
              className={`
                px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-cyan-500/60
                ${isActive
                  ? 'bg-cyan-500/25 border-cyan-400/70 text-cyan-200 shadow-md shadow-cyan-500/15 ring-1 ring-cyan-500/40'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400 font-medium hover:text-white hover:border-slate-500 hover:bg-slate-700/50'
                }
              `}
              aria-pressed={isActive}
            >
              {isActive && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 align-middle" />
              )}
              {preset.label}
            </button>
          );
        })}
        {activePresetId && (
          <button
            onClick={() => onSelect({ id: '', label: '', description: '', inputs: {} as SimulatorInputs })}
            className="px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700/50 transition-colors"
            aria-label="Clear preset"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
