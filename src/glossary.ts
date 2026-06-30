export interface GlossaryEntry {
  term: string;
  abbr: string;
  definition: string;
  category: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  { abbr: 'GTM', term: 'Go-to-Market', category: 'Strategy', definition: 'The commercial strategy for reaching buyers, selling the product, and scaling adoption.' },
  { abbr: 'MOR', term: 'Merchant of Record', category: 'Payments', definition: 'The party legally responsible for the transaction, including payment acceptance, refunds, disputes, tax handling, and customer transaction ownership.' },
  { abbr: 'MoR', term: 'Merchant of Record', category: 'Payments', definition: 'The party legally responsible for the transaction, including payment acceptance, refunds, disputes, tax handling, and customer transaction ownership.' },
  { abbr: 'PayFac', term: 'Payment Facilitator', category: 'Payments', definition: 'A platform model where sellers can be onboarded under a broader payment structure instead of each seller building a direct acquiring setup.' },
  { abbr: 'PF', term: 'Payment Facilitator', category: 'Payments', definition: 'A platform model where sellers can be onboarded under a broader payment structure instead of each seller building a direct acquiring setup.' },
  { abbr: 'PSP', term: 'Payment Service Provider', category: 'Payments', definition: 'A provider that enables payment acceptance, processing, settlement, and related payment services.' },
  { abbr: 'SMB', term: 'Small and Midsize Business', category: 'Market Segment', definition: 'A smaller merchant or business segment typically served through scalable sales, software, or partner-led channels.' },
  { abbr: 'SaaS', term: 'Software as a Service', category: 'Technology', definition: 'A software delivery model where customers access hosted software through a subscription or usage-based model.' },
  { abbr: 'VAS', term: 'Value-Added Services', category: 'Monetization', definition: 'Additional services beyond basic payment processing, such as fraud tools, reporting, financing, loyalty, instant payouts, or seller services.' },
  { abbr: 'FX', term: 'Foreign Exchange', category: 'Payments', definition: 'Currency conversion or currency-related services used in cross-border payments and settlement.' },
  { abbr: 'KYC', term: 'Know Your Customer', category: 'Compliance', definition: 'Identity verification and risk screening for individuals or buyers.' },
  { abbr: 'KYB', term: 'Know Your Business', category: 'Compliance', definition: 'Business verification and risk screening for merchants, sellers, or commercial entities.' },
  { abbr: 'AML', term: 'Anti-Money Laundering', category: 'Compliance', definition: 'Controls used to detect and prevent financial crime and illicit money movement.' },
  { abbr: 'API', term: 'Application Programming Interface', category: 'Technology', definition: 'A structured way for software systems to connect, exchange data, and trigger actions.' },
  { abbr: 'AI', term: 'Artificial Intelligence', category: 'Technology', definition: 'Software systems that can perform tasks requiring reasoning, pattern recognition, prediction, or decision support.' },
  { abbr: 'B2B', term: 'Business-to-Business', category: 'Market Segment', definition: 'Commercial activity between businesses rather than between a business and an individual consumer.' },
  { abbr: 'CAC', term: 'Customer Acquisition Cost', category: 'Strategy', definition: 'The cost of acquiring a new customer, merchant, seller, or platform client.' },
  { abbr: 'ACH', term: 'Automated Clearing House', category: 'Payments', definition: 'A bank-to-bank payment rail commonly used for account transfers and payouts.' },
  { abbr: 'DDA', term: 'Demand Deposit Account', category: 'Banking', definition: 'A checking-style account used to hold and move funds.' },
  { abbr: '3DS', term: '3-D Secure', category: 'Security', definition: 'A card authentication protocol used to add an extra verification layer for online card payments.' },
  { abbr: 'BIN', term: 'Bank Identification Number', category: 'Payments', definition: 'The first digits of a payment card number that identify the issuing bank or card program.' },
  { abbr: 'LPM', term: 'Local Payment Method', category: 'Payments', definition: 'A payment method commonly used in a specific country or region.' },
  { abbr: 'APM', term: 'Alternative Payment Method', category: 'Payments', definition: 'A payment method other than traditional card payments, such as bank transfer, wallet, or local payment option.' },
  { abbr: 'SCA', term: 'Strong Customer Authentication', category: 'Security', definition: 'A requirement or control that uses stronger verification to confirm the customer\'s identity.' },
  { abbr: 'MTL', term: 'Money Transmitter License', category: 'Compliance', definition: 'A regulatory license that may be required when a business receives, holds, or transmits money on behalf of others.' },
  { abbr: 'PII', term: 'Personally Identifiable Information', category: 'Compliance', definition: 'Data that can identify an individual, such as name, address, email, phone number, or government identifier.' },
  { abbr: 'UX', term: 'User Experience', category: 'Technology', definition: 'The quality, ease, and clarity of the user\'s interaction with the product.' },
  { abbr: 'UI', term: 'User Interface', category: 'Technology', definition: 'The screens, forms, buttons, cards, and visual components users interact with.' },
  { abbr: 'MVP', term: 'Minimum Viable Product', category: 'Strategy', definition: 'A first usable version of a product that demonstrates the core concept with enough functionality to test the idea.' },
  { abbr: 'SLA', term: 'Service Level Agreement', category: 'Operations', definition: 'A defined performance or service commitment, such as uptime, processing time, or support response time.' },
  { abbr: 'KPI', term: 'Key Performance Indicator', category: 'Operations', definition: 'A measurable metric used to evaluate business or operational performance.' },
  { abbr: 'ISV', term: 'Independent Software Vendor', category: 'Partners', definition: 'A software company that builds products distributed through or integrated with a payment platform.' },
  { abbr: 'ISO', term: 'Independent Sales Organization', category: 'Partners', definition: 'A third-party sales agent or reseller that distributes payment processing services.' },
  { abbr: 'IHF', term: 'Integrated Hardware & Firmware', category: 'Technology', definition: 'Payment device hardware combined with embedded firmware for in-person payment acceptance.' },
  { abbr: 'PAN', term: 'Primary Account Number', category: 'Security', definition: 'The card number or payment account number that should be protected from unnecessary exposure.' },
  { abbr: 'OTP', term: 'One-Time Password', category: 'Security', definition: 'A temporary code used to authenticate a customer or transaction.' },
  { abbr: 'KYA', term: 'Know Your Agent', category: 'Compliance', definition: 'A control that verifies which AI agent is acting, whether it has delegated authority, and whether it is operating within policy limits.' },
];

export const GLOSSARY_MAP: Record<string, string> = Object.fromEntries(
  GLOSSARY_ENTRIES.map(e => [e.abbr, e.definition])
);

export const GLOSSARY_FULL_NAME: Record<string, string> = Object.fromEntries(
  GLOSSARY_ENTRIES.map(e => [e.abbr, e.term])
);

// Unique entries deduplicated by abbr for display (MOR and MoR are same)
export const DISPLAY_ENTRIES = GLOSSARY_ENTRIES.filter(
  (e, i, arr) => arr.findIndex(x => x.abbr === e.abbr) === i
    && e.abbr !== 'MoR' // deduplicate MOR/MoR
    && e.abbr !== 'PF'  // deduplicate PayFac/PF
    && e.abbr !== 'IHF' && e.abbr !== 'ISO' // internal only
);
