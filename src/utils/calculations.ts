import type { SimulatorInputs, GTMModel, PaymentOperatingModel, MarketplaceModel } from '../types';

export interface MonetizationCalcs {
  processingRevenue: number;
  platformFeeRevenue: number;
  vasRevenue: number;
  instantPayoutRevenue: number;
  crossBorderRevenue: number;
  totalRevenue: number;
  revenuePerSeller: number;
  profitabilityScore: number;
  retentionScore: number;
  topMonetizationLever: string;
}

export interface SplitCalcs {
  buyerPays: number;
  platformFee: number;
  sellerGross: number;
  reserveHeld: number;
  sellerReceivesToday: number;
  reserveRelease: number;
  processingCost: number;
  platformNetBeforeRisk: number;
  riskAdjustment: number;
  platformRiskAdjustedNet: number;
}

const PROCESSING_TAKE_RATE = 0.008;
const VAS_MARGIN = 0.004;
const INSTANT_PAYOUT_MARGIN = 0.002;
const PROCESSING_COST_RATE = 0.019;
const CROSS_BORDER_MARGIN = 0.005;

export function calcMonetization(inputs: SimulatorInputs): MonetizationCalcs {
  const { annualPaymentVolume, numMerchants, platformTakeRate, vasAttachRate, instantPayoutAdoption, refundDisputeRate, crossBorderPercent } = inputs;
  const takePct = platformTakeRate / 100;
  const vasPct = vasAttachRate / 100;
  const ipoAdopt = instantPayoutAdoption / 100;
  const cbPct = crossBorderPercent / 100;
  const disputePct = refundDisputeRate / 100;

  const processingRevenue = annualPaymentVolume * PROCESSING_TAKE_RATE;
  const platformFeeRevenue = annualPaymentVolume * takePct;
  const vasRevenue = annualPaymentVolume * vasPct * VAS_MARGIN;
  const instantPayoutRevenue = annualPaymentVolume * ipoAdopt * INSTANT_PAYOUT_MARGIN;
  const crossBorderRevenue = annualPaymentVolume * cbPct * CROSS_BORDER_MARGIN;
  const totalRevenue = processingRevenue + platformFeeRevenue + vasRevenue + instantPayoutRevenue + crossBorderRevenue;
  const revenuePerSeller = numMerchants > 0 ? totalRevenue / numMerchants : 0;

  let profitabilityScore = 50;
  profitabilityScore += Math.min(20, (annualPaymentVolume / 100_000_000) * 20);
  profitabilityScore += Math.min(10, takePct * 100);
  profitabilityScore += Math.min(10, vasPct * 100);
  profitabilityScore += Math.min(5, ipoAdopt * 20);
  profitabilityScore -= Math.min(15, disputePct * 300);
  profitabilityScore = Math.max(5, Math.min(100, profitabilityScore));

  let retentionScore = 40;
  retentionScore += Math.min(25, vasPct * 150);
  retentionScore += Math.min(15, ipoAdopt * 60);
  retentionScore += Math.min(10, takePct * 100);
  retentionScore = Math.max(5, Math.min(100, retentionScore));

  const levers = [
    { label: 'Processing Revenue', value: processingRevenue },
    { label: 'Platform Fees', value: platformFeeRevenue },
    { label: 'Value-Added Services', value: vasRevenue },
    { label: 'Instant Payouts', value: instantPayoutRevenue },
    { label: 'Cross-Border Services', value: crossBorderRevenue },
  ];
  const top = levers.reduce((a, b) => (b.value > a.value ? b : a), levers[0]);

  return {
    processingRevenue,
    platformFeeRevenue,
    vasRevenue,
    instantPayoutRevenue,
    crossBorderRevenue,
    totalRevenue,
    revenuePerSeller,
    profitabilityScore: Math.round(profitabilityScore),
    retentionScore: Math.round(retentionScore),
    topMonetizationLever: top.label,
  };
}

export function calcSplit(inputs: SimulatorInputs): SplitCalcs {
  const { avgTransactionSize, platformTakeRate, reserveHoldPercent, refundDisputeRate } = inputs;
  const takePct = platformTakeRate / 100;
  const reservePct = reserveHoldPercent / 100;
  const disputePct = refundDisputeRate / 100;

  const buyerPays = avgTransactionSize;
  const platformFee = buyerPays * takePct;
  const sellerGross = buyerPays - platformFee;
  const reserveHeld = sellerGross * reservePct;
  const sellerReceivesToday = sellerGross - reserveHeld;
  const reserveRelease = reserveHeld;
  const processingCost = buyerPays * PROCESSING_COST_RATE;
  const platformNetBeforeRisk = platformFee - processingCost;
  const riskAdjustment = buyerPays * disputePct;
  const platformRiskAdjustedNet = platformNetBeforeRisk - riskAdjustment;

  return {
    buyerPays,
    platformFee,
    sellerGross,
    reserveHeld,
    sellerReceivesToday,
    reserveRelease,
    processingCost,
    platformNetBeforeRisk,
    riskAdjustment,
    platformRiskAdjustedNet,
  };
}

interface GTMScores {
  fitScore: number;
  recommendedModel: PaymentOperatingModel;
  salesMotionComplexity: number;
  sellerOnboardingComplexity: number;
  monetizationPotential: number;
  riskOwnershipLevel: number;
}

export function calcGTMScores(inputs: SimulatorInputs): GTMScores {
  const { gtmModel, platformType, paymentOperatingModel, numMerchants, crossBorderPercent, vasAttachRate, instantPayoutAdoption } = inputs;
  const cbPct = crossBorderPercent / 100;
  const vasPct = vasAttachRate / 100;
  const ipoPct = instantPayoutAdoption / 100;

  const fitMatrix: Record<GTMModel, { best: string[]; model: PaymentOperatingModel; sales: number; onboard: number; mono: number; risk: number }> = {
    'Direct Merchant Sales': { best: ['SMB Acquirer', 'Enterprise Platform'], model: 'Platform as Payment Facilitator', sales: 70, onboard: 60, mono: 65, risk: 70 },
    'Embedded SaaS GTM': { best: ['Vertical SaaS Platform', 'Creator / Services Platform'], model: 'Connected Accounts Model', sales: 55, onboard: 50, mono: 75, risk: 55 },
    'Marketplace / Platform GTM': { best: ['Marketplace', 'Event Commerce Platform'], model: 'Marketplace Merchant-of-Record Model', sales: 65, onboard: 75, mono: 80, risk: 65 },
    'Partner / Channel GTM': { best: ['SMB Acquirer', 'Vertical SaaS Platform', 'B2B Procurement Platform'], model: 'Managed Payment Facilitator-as-a-Service', sales: 50, onboard: 55, mono: 70, risk: 50 },
    'Enterprise Platform GTM': { best: ['Enterprise Platform', 'B2B Procurement Platform'], model: 'Platform as Payment Facilitator', sales: 80, onboard: 70, mono: 80, risk: 75 },
    'Cross-Border Expansion GTM': { best: ['Cross-Border Platform', 'Marketplace'], model: 'Hybrid Multi-Rail Model', sales: 75, onboard: 80, mono: 85, risk: 70 },
  };

  const entry = fitMatrix[gtmModel];
  const isPlatformMatch = entry.best.includes(platformType);
  const isModelMatch = paymentOperatingModel === entry.model;

  let fitScore = 60;
  if (isPlatformMatch) fitScore += 15;
  if (isModelMatch) fitScore += 15;
  fitScore += Math.min(10, vasPct * 50);
  fitScore += Math.min(5, ipoPct * 20);
  if (cbPct > 0.3 && gtmModel === 'Cross-Border Expansion GTM') fitScore += 10;
  fitScore = Math.min(100, Math.max(20, fitScore));

  let onboarding = entry.onboard;
  if (numMerchants > 5000) onboarding = Math.min(100, onboarding + 15);
  else if (numMerchants > 1000) onboarding = Math.min(100, onboarding + 8);

  return {
    fitScore: Math.round(fitScore),
    recommendedModel: entry.model,
    salesMotionComplexity: entry.sales,
    sellerOnboardingComplexity: Math.round(onboarding),
    monetizationPotential: Math.round(entry.mono + (vasPct * 20)),
    riskOwnershipLevel: entry.risk,
  };
}

export function calcMarketplaceFitScores(inputs: SimulatorInputs): Record<MarketplaceModel, number> {
  const { numMerchants, crossBorderPercent, refundDisputeRate, vasAttachRate, platformTakeRate } = inputs;
  const cbPct = crossBorderPercent / 100;
  const disputePct = refundDisputeRate / 100;
  const vasPct = vasAttachRate / 100;
  const takePct = platformTakeRate / 100;

  const base: Record<MarketplaceModel, number> = {
    'Not a Marketplace': 30,
    'Marketplace as Merchant of Record': 65,
    'Seller as Merchant of Record': 55,
    'Connected Seller Accounts': 60,
    'Payment Facilitator Marketplace': 65,
    'Hybrid Marketplace Model': 60,
  };

  if (numMerchants > 1000) {
    base['Connected Seller Accounts'] += 15;
    base['Payment Facilitator Marketplace'] += 10;
    base['Seller as Merchant of Record'] += 5;
  }
  if (cbPct > 0.25) {
    base['Hybrid Marketplace Model'] += 15;
    base['Seller as Merchant of Record'] += 5;
  }
  if (disputePct > 0.03) {
    base['Marketplace as Merchant of Record'] -= 10;
    base['Payment Facilitator Marketplace'] -= 8;
    base['Seller as Merchant of Record'] += 8;
  }
  if (vasPct > 0.2) {
    base['Payment Facilitator Marketplace'] += 12;
    base['Hybrid Marketplace Model'] += 10;
  }
  if (takePct > 0.1) {
    base['Marketplace as Merchant of Record'] += 8;
  }

  return Object.fromEntries(
    Object.entries(base).map(([k, v]) => [k, Math.max(10, Math.min(100, Math.round(v)))])
  ) as Record<MarketplaceModel, number>;
}

export function calcOperatingModelFitScores(inputs: SimulatorInputs): Record<PaymentOperatingModel, number> {
  const { platformType, gtmModel, marketplaceModel, crossBorderPercent, numMerchants, refundDisputeRate, vasAttachRate, instantPayoutAdoption, agenticPaymentUsage } = inputs;
  const cbPct = crossBorderPercent / 100;
  const disputePct = refundDisputeRate / 100;
  const vasPct = vasAttachRate / 100;
  const ipoPct = instantPayoutAdoption / 100;

  const base: Record<PaymentOperatingModel, number> = {
    'Platform as Payment Facilitator': 55,
    'Managed Payment Facilitator-as-a-Service': 60,
    'Marketplace Merchant-of-Record Model': 50,
    'Seller / Licensee Merchant-of-Record Model': 50,
    'Provider Merchant-of-Record Model': 45,
    'Connected Accounts Model': 55,
    'Local Payment Service Provider Model': 40,
    'Hybrid Multi-Rail Model': 45,
  };

  if (platformType === 'SMB Acquirer') base['Platform as Payment Facilitator'] += 20;
  if (platformType === 'Vertical SaaS Platform') { base['Connected Accounts Model'] += 20; base['Managed Payment Facilitator-as-a-Service'] += 15; }
  if (platformType === 'Marketplace') { base['Marketplace Merchant-of-Record Model'] += 20; base['Connected Accounts Model'] += 10; }
  if (platformType === 'Cross-Border Platform') { base['Hybrid Multi-Rail Model'] += 25; base['Local Payment Service Provider Model'] += 20; }
  if (platformType === 'Enterprise Platform') { base['Platform as Payment Facilitator'] += 15; base['Managed Payment Facilitator-as-a-Service'] += 10; }
  if (platformType === 'B2B Procurement Platform') { base['Connected Accounts Model'] += 15; base['Managed Payment Facilitator-as-a-Service'] += 10; }

  if (gtmModel === 'Direct Merchant Sales') base['Platform as Payment Facilitator'] += 10;
  if (gtmModel === 'Embedded SaaS GTM') { base['Connected Accounts Model'] += 12; base['Managed Payment Facilitator-as-a-Service'] += 8; }
  if (gtmModel === 'Cross-Border Expansion GTM') { base['Hybrid Multi-Rail Model'] += 15; base['Local Payment Service Provider Model'] += 12; }

  if (marketplaceModel !== 'Not a Marketplace') base['Marketplace Merchant-of-Record Model'] += 10;
  if (marketplaceModel === 'Connected Seller Accounts') base['Connected Accounts Model'] += 15;
  if (marketplaceModel === 'Seller as Merchant of Record') base['Seller / Licensee Merchant-of-Record Model'] += 20;

  if (numMerchants > 5000) { base['Managed Payment Facilitator-as-a-Service'] += 10; base['Connected Accounts Model'] += 8; }
  if (cbPct > 0.3) { base['Hybrid Multi-Rail Model'] += 15; base['Local Payment Service Provider Model'] += 10; }
  if (disputePct > 0.04) { base['Provider Merchant-of-Record Model'] += 10; base['Seller / Licensee Merchant-of-Record Model'] += 8; }
  if (vasPct > 0.2) { base['Platform as Payment Facilitator'] += 8; base['Managed Payment Facilitator-as-a-Service'] += 5; }
  if (ipoPct > 0.3) { base['Platform as Payment Facilitator'] += 5; base['Connected Accounts Model'] += 5; }
  if (agenticPaymentUsage) {
    // ON: actively increases weight for models with strong identity, token, policy, and audit capabilities
    base['Platform as Payment Facilitator'] += 12;
    base['Managed Payment Facilitator-as-a-Service'] += 8;
    base['Connected Accounts Model'] += 10;
    base['Hybrid Multi-Rail Model'] += 5;
  } else {
    // OFF: small future-readiness signal only, no penalty
    base['Platform as Payment Facilitator'] += 3;
    base['Connected Accounts Model'] += 3;
  }

  return Object.fromEntries(
    Object.entries(base).map(([k, v]) => [k, Math.max(10, Math.min(100, Math.round(v)))])
  ) as Record<PaymentOperatingModel, number>;
}

export function calcAgenticTrustScore(inputs: SimulatorInputs): number {
  // Base score: active assessment when ON, future readiness when OFF
  let score = inputs.agenticPaymentUsage ? 55 : 25;
  if (inputs.instantPayoutAdoption > 30) score += 10;
  if (inputs.platformTakeRate > 8) score += 5;
  if (inputs.crossBorderPercent > 20) score += 8;
  // Active mode gets extra weight for controls that matter most
  if (inputs.agenticPaymentUsage) {
    if (inputs.reserveHoldPercent > 0) score += 5;
    if (inputs.refundDisputeRate < 2) score += 5;
  }
  return Math.min(100, score);
}
