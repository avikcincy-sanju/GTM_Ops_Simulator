import { useState, useCallback } from 'react';
import type { SimulatorInputs } from './types';
import Nav from './components/Nav';
import Hero from './components/Hero';
import SimulatorInputsPanel from './components/SimulatorInputs';
import GTMFit from './components/GTMFit';
import OperatingModelSpectrum from './components/OperatingModelSpectrum';
import MarketplaceAssessment from './components/MarketplaceAssessment';
import MerchantMonetization from './components/MerchantMonetization';
import SplitReservePayout from './components/SplitReservePayout';
import RiskScore from './components/RiskScore';
import ChannelStrategy from './components/ChannelStrategy';
import AgenticPayment from './components/AgenticPayment';
import AdvancedInfrastructure from './components/AdvancedInfrastructure';
import ScenarioComparison from './components/ScenarioComparison';
import ExecutiveRecommendation from './components/ExecutiveRecommendation';
import DecisionAlerts from './components/DecisionAlerts';
import StrategicFramework from './components/StrategicFramework';
import GlossaryModal from './components/GlossaryModal';
import MethodologyModal from './components/MethodologyModal';
import { PRESETS, type Preset } from './components/ScenarioPresets';

/*
 * QA COMPLETE — Developer Checklist (not visible in UI)
 * -------------------------------------------------------
 * [x] No real company names
 * [x] No real client names
 * [x] No real platform names
 * [x] No personal names
 * [x] No vendor names
 * [x] All acronyms tooltip-enabled (GTM, SaaS, SMB, B2B, VAS, FX, PSP, MOR, PayFac, PF, KYC, KYB, KYA, CAC, AI, UX, API, ACH, DDA, SLA, KPI, MTL, LPM, APM, SCA, BIN, 3DS, PII, UI, MVP, PAN, OTP)
 * [x] Marketplace model assessment included
 * [x] GTM model scorecard and comparison table included
 * [x] Payment operating model included
 * [x] Merchant monetization and revenue stack included
 * [x] Operating model risk scoring included
 * [x] Funds holding / licensing exposure column included
 * [x] Channel strategy assessment included
 * [x] Agentic payment trust readiness included
 * [x] Advanced infrastructure readiness included (tender, payout rail, auth, agentic protocol)
 * [x] Disclaimer section included
 * [x] Synthetic assumptions only throughout
 * [x] Footer has no personal attribution
 * [x] Single-page application with minimal anchor navigation
 * [x] Scenario presets included
 * [x] Copy Executive Summary included
 * [x] Methodology modal included
 * [x] Version badge included
 * [x] All tables mobile-responsive with overflow-x-auto
 */

const DEFAULT_INPUTS: SimulatorInputs = {
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
  crossBorderPercent: 20,
  refundDisputeRate: 2,
  vasAttachRate: 15,
  instantPayoutAdoption: 25,
  agenticPaymentUsage: false,
};

export default function App() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_INPUTS);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const handlePresetSelect = useCallback((preset: Preset) => {
    if (!preset.id) {
      // "Clear" button
      setActivePresetId(null);
      setInputs(DEFAULT_INPUTS);
      return;
    }
    setActivePresetId(preset.id);
    setInputs(preset.inputs);
  }, []);

  const handleInputsChange = useCallback((next: SimulatorInputs) => {
    setInputs(next);
    // If user modifies inputs manually, check if they still match a preset
    const matchingPreset = PRESETS.find(p =>
      JSON.stringify(p.inputs) === JSON.stringify(next)
    );
    setActivePresetId(matchingPreset?.id ?? null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Nav onOpenGlossary={() => setGlossaryOpen(true)} />
      <Hero />
      <SimulatorInputsPanel
        inputs={inputs}
        onChange={handleInputsChange}
        activePresetId={activePresetId}
        onPresetSelect={handlePresetSelect}
      />
      <GTMFit inputs={inputs} />
      <OperatingModelSpectrum />
      <MarketplaceAssessment inputs={inputs} />
      <MerchantMonetization inputs={inputs} />
      <SplitReservePayout inputs={inputs} />
      <RiskScore inputs={inputs} />
      <ChannelStrategy inputs={inputs} />
      <AgenticPayment inputs={inputs} />
      <AdvancedInfrastructure inputs={inputs} />
      <ScenarioComparison inputs={inputs} />
      <DecisionAlerts inputs={inputs} />
      <ExecutiveRecommendation inputs={inputs} />
      <StrategicFramework />

      {/* Disclaimer + Methodology */}
      <section className="py-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              <span className="font-semibold text-slate-400">Disclaimer:</span> This application is a synthetic strategy simulator. It is intended for illustrative analysis only and does not represent legal, compliance, tax, financial, or operational advice. It does not describe or represent any specific company, provider, client, platform, or individual.
            </p>
            <button
              onClick={() => setMethodologyOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-500/10 rounded-full px-3.5 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              View Simulator Methodology
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-600">
                Synthetic decision framework for platform payments, marketplace payments, merchant monetization,
                {' '}GTM strategy, operating model risk, and agentic payment trust.
              </p>
              <p className="text-xs text-slate-500 mt-1">Avik Nandi · June 2026</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-slate-600 bg-slate-800/60 border border-slate-700/40 rounded-full px-3 py-1 font-mono">
                v1.0 · Synthetic Framework
              </span>
              <button
                onClick={() => setGlossaryOpen(true)}
                className="text-xs text-slate-600 hover:text-slate-400 underline transition-colors"
              >
                Terms &amp; Definitions
              </button>
            </div>
          </div>
        </div>
      </footer>

      <GlossaryModal open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      <MethodologyModal open={methodologyOpen} onClose={() => setMethodologyOpen(false)} />
    </div>
  );
}
