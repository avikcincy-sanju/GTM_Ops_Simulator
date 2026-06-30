import { Fragment, useState, useCallback } from 'react';
import type { SimulatorInputs, GTMModel, PaymentOperatingModel, MarketplaceModel } from '../types';
import { calcGTMScores, calcMonetization, calcOperatingModelFitScores, calcMarketplaceFitScores } from '../utils/calculations';
import { Lightbulb, ChevronRight, Copy, Check } from 'lucide-react';
import { AcronymText } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

function buildRecommendation(inputs: SimulatorInputs): {
  gtm: GTMModel;
  model: PaymentOperatingModel;
  marketplace: MarketplaceModel;
  monetization: string;
  risk: string;
  nextMove: string;
  summary: string;
} {
  calcGTMScores(inputs);
  const opScores = calcOperatingModelFitScores(inputs);
  const mktScores = calcMarketplaceFitScores(inputs);

  const bestModel = (Object.keys(opScores) as PaymentOperatingModel[]).reduce((a, b) => opScores[b] > opScores[a] ? b : a);
  const bestMkt = (Object.keys(mktScores) as MarketplaceModel[]).reduce((a, b) => mktScores[b] > mktScores[a] ? b : a);
  const mono = calcMonetization(inputs);

  const isMarketplace = inputs.platformType === 'Marketplace' || inputs.gtmModel === 'Marketplace / Platform GTM';
  const highSellers = inputs.numMerchants > 1000;
  const highCB = inputs.crossBorderPercent > 25;
  const highDispute = inputs.refundDisputeRate > 3;
  const highVAS = inputs.vasAttachRate > 20;
  const highIPO = inputs.instantPayoutAdoption > 30;
  const isAgentic = inputs.agenticPaymentUsage;
  const highFundsExposure = inputs.paymentOperatingModel === 'Platform as Payment Facilitator' || inputs.paymentOperatingModel === 'Hybrid Multi-Rail Model';

  let risk = 'Managing onboarding, compliance, disputes, and reconciliation complexity as seller volume increases.';
  if (highDispute) risk = 'Dispute rate is elevated — reserve strategy, chargeback monitoring, and customer support operations require immediate attention.';
  else if (highCB) risk = 'Cross-border exposure increases FX risk, local compliance burden, and multi-currency reconciliation complexity.';
  else if (highSellers) risk = 'High seller volume increases onboarding, KYC/KYB monitoring, and payout operational complexity.';

  let nextMove = 'Evaluate operating model structure, payment provider capabilities, and onboarding workflow design.';
  if (isAgentic) nextMove = 'Implement agent identity verification, scoped payment tokens, delegated authority controls, policy attestation, and audit trail infrastructure for active agentic payment flows.';
  else if (highVAS) nextMove = 'Accelerate VAS adoption to improve revenue per seller and platform stickiness.';
  else if (highIPO) nextMove = 'Build out instant payout infrastructure to monetize payout speed while managing liquidity and fraud controls.';
  else if (highCB) nextMove = 'Map local payment method coverage, FX hedging strategy, and regional compliance requirements.';

  let monetizationStr = mono.topMonetizationLever;
  if (highVAS && highIPO) monetizationStr = 'VAS + Instant Payouts';
  else if (highVAS) monetizationStr = 'VAS and Embedded Financial Services';
  else if (highIPO) monetizationStr = 'Instant Payout Monetization';

  const summary = [
    `For this platform profile, ${inputs.gtmModel} paired with ${bestModel} may improve`,
    `onboarding scalability, platform control, and ${monetizationStr} monetization.`,
    isMarketplace ? `The marketplace structure suggests ${bestMkt} as the primary path.` : '',
    `The primary opportunity is to expand revenue beyond processing through embedded financial services,`,
    `risk tools, instant payouts, and workflow-based retention.`,
    `The main risk is ${risk}`,
    highIPO && inputs.instantPayoutAdoption > 50 ? `Payout rail governance, liquidity controls, and instant payout fraud monitoring require investment to support instant payout scale.` : '',
    highCB && inputs.crossBorderPercent > 40 ? `Tender localization, FX management, and multi-currency reconciliation are critical for cross-border volume at this scale.` : '',
    highDispute && inputs.refundDisputeRate > 4 ? `Authorization optimization, fraud screening, reserve design, and dispute operations require immediate attention.` : '',
    isAgentic ? `Agentic payment usage is active — agent identity verification, scoped payment tokens, delegated authority controls, policy attestation, beneficiary validation, and an immutable audit record are required before enabling live agent-authorized transactions.` : `Agentic payment controls are not yet active — foundational agent identity, token scope, policy attestation, and audit record design should be prioritized as future readiness.`,
    highFundsExposure ? `Funds holding and licensing exposure at this operating model level may require regulatory review and a formal licensing assessment.` : '',
  ].filter(Boolean).join(' ');

  return {
    gtm: inputs.gtmModel,
    model: bestModel,
    marketplace: isMarketplace ? bestMkt : inputs.marketplaceModel,
    monetization: monetizationStr,
    risk,
    nextMove,
    summary,
  };
}

export default function ExecutiveRecommendation({ inputs }: Props) {
  const rec = buildRecommendation(inputs);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const lines = [
      'PLATFORM PAYMENTS — EXECUTIVE RECOMMENDATION',
      '(Illustrative output. Synthetic assumptions only.)',
      '',
      `Recommended GTM Model: ${rec.gtm}`,
      `Recommended Operating Model: ${rec.model}`,
      `Recommended Marketplace Model: ${rec.marketplace}`,
      `Primary Monetization Opportunity: ${rec.monetization}`,
      `Main Risk to Manage: ${rec.risk}`,
      `Next Strategic Move: ${rec.nextMove}`,
      '',
      'Executive Summary:',
      rec.summary,
      '',
      '---',
      'Generated by Platform Payments GTM & Operating Model Simulator.',
      'Illustrative only. Not legal, compliance, or financial advice.',
    ].join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [rec]);

  const cards = [
    { label: 'Recommended GTM Model', value: rec.gtm, color: 'border-cyan-500/40 text-cyan-300' },
    { label: 'Recommended Operating Model', value: rec.model, color: 'border-blue-500/40 text-blue-300' },
    { label: 'Recommended Marketplace Model', value: rec.marketplace, color: 'border-purple-500/40 text-purple-300' },
    { label: 'Primary Monetization Opportunity', value: rec.monetization, color: 'border-emerald-500/40 text-emerald-300' },
    { label: 'Main Risk to Manage', value: rec.risk, color: 'border-orange-500/40 text-orange-300' },
    { label: 'Next Strategic Move', value: rec.nextMove, color: 'border-yellow-500/40 text-yellow-300' },
  ];

  return (
    <section id="recommendation" className="py-10 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
          <div className="flex items-center gap-3">
            <Lightbulb size={20} className="text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Executive Recommendation</h2>
          </div>
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              copied
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-700/50'
            }`}
            aria-label="Copy executive summary to clipboard"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Executive Summary'}
          </button>
        </div>
        <p className="text-xs text-amber-400/70 italic mb-5">
          Illustrative recommendations based on synthetic logic. Not legal, compliance, or financial advice.
        </p>

        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-5">
          <p className="text-slate-200 text-sm leading-relaxed">
            <AcronymText>{rec.summary}</AcronymText>
          </p>
        </div>

        {/* Six Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cards.map(card => (
            <div key={card.label} className={`bg-slate-800/50 border rounded-xl p-5 ${card.color.split(' ')[0]}`}>
              <p className="text-xs text-slate-500 mb-2">
                <AcronymText>{card.label}</AcronymText>
              </p>
              <p className={`text-sm font-semibold leading-snug ${card.color.split(' ')[1]}`}>
                <AcronymText>{card.value}</AcronymText>
              </p>
            </div>
          ))}
        </div>

        {/* Recommendation Path */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Strategic Path</h3>
          <div className="flex flex-wrap items-center gap-2">
            {[
              inputs.platformType,
              rec.gtm,
              rec.model,
              inputs.marketplaceModel !== 'Not a Marketplace' ? rec.marketplace : null,
              rec.monetization,
              inputs.agenticPaymentUsage ? 'Agentic Trust Controls' : null,
            ].filter(Boolean).map((step, i, arr) => (
              <Fragment key={step as string}>
                <div className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-xs text-slate-300 font-medium">
                  <AcronymText>{step as string}</AcronymText>
                </div>
                {i < arr.length - 1 && <ChevronRight size={14} className="text-slate-600" />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
