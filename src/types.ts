export type PlatformType =
  | 'SMB Acquirer'
  | 'Vertical SaaS Platform'
  | 'Marketplace'
  | 'Event Commerce Platform'
  | 'Cross-Border Platform'
  | 'Enterprise Platform'
  | 'Creator / Services Platform'
  | 'B2B Procurement Platform';

export type GTMModel =
  | 'Direct Merchant Sales'
  | 'Embedded SaaS GTM'
  | 'Marketplace / Platform GTM'
  | 'Partner / Channel GTM'
  | 'Enterprise Platform GTM'
  | 'Cross-Border Expansion GTM';

export type PaymentOperatingModel =
  | 'Platform as Payment Facilitator'
  | 'Managed Payment Facilitator-as-a-Service'
  | 'Marketplace Merchant-of-Record Model'
  | 'Seller / Licensee Merchant-of-Record Model'
  | 'Provider Merchant-of-Record Model'
  | 'Connected Accounts Model'
  | 'Local Payment Service Provider Model'
  | 'Hybrid Multi-Rail Model';

export type MarketplaceModel =
  | 'Not a Marketplace'
  | 'Marketplace as Merchant of Record'
  | 'Seller as Merchant of Record'
  | 'Connected Seller Accounts'
  | 'Payment Facilitator Marketplace'
  | 'Hybrid Marketplace Model';

export interface SimulatorInputs {
  platformType: PlatformType;
  gtmModel: GTMModel;
  paymentOperatingModel: PaymentOperatingModel;
  marketplaceModel: MarketplaceModel;
  annualPaymentVolume: number;
  avgTransactionSize: number;
  numMerchants: number;
  platformTakeRate: number;
  reserveHoldPercent: number;
  reserveReleaseWindowDays: number;
  crossBorderPercent: number;
  refundDisputeRate: number;
  vasAttachRate: number;
  instantPayoutAdoption: number;
  agenticPaymentUsage: boolean;
}

export interface ScoreLevel {
  label: string;
  color: string;
  bg: string;
}

export function scoreLevel(score: number): ScoreLevel {
  if (score >= 80) return { label: 'High', color: 'text-emerald-400', bg: 'bg-emerald-500' };
  if (score >= 60) return { label: 'Medium-High', color: 'text-cyan-400', bg: 'bg-cyan-500' };
  if (score >= 40) return { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500' };
  if (score >= 20) return { label: 'Low-Medium', color: 'text-orange-400', bg: 'bg-orange-500' };
  return { label: 'Low', color: 'text-red-400', bg: 'bg-red-500' };
}
