import type { SimulatorInputs, PaymentOperatingModel } from '../types';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AcronymText } from './TooltipTerm';

interface Props { inputs: SimulatorInputs; }

const HIGH_FUNDS_MODELS: PaymentOperatingModel[] = [
  'Platform as Payment Facilitator',
  'Marketplace Merchant-of-Record Model',
  'Provider Merchant-of-Record Model',
];

interface Alert {
  title: string;
  text: string;
}

function buildAlerts(inputs: SimulatorInputs): Alert[] {
  const list: Alert[] = [];

  if (inputs.crossBorderPercent > 40)
    list.push({
      title: 'Cross-Border Complexity',
      text: 'Review FX, local payment methods, local settlement, payout coverage, and reconciliation design.',
    });

  if (inputs.numMerchants > 5000)
    list.push({
      title: 'Seller Scale Risk',
      text: 'Strengthen onboarding, KYB, seller monitoring, support workflows, and exception handling.',
    });

  if (inputs.refundDisputeRate > 5)
    list.push({
      title: 'Dispute Exposure',
      text: 'Review reserve policy, fraud screening, chargeback operations, and dispute workflow readiness.',
    });

  if (inputs.instantPayoutAdoption > 50)
    list.push({
      title: 'Payout Risk',
      text: 'Review liquidity controls, fraud monitoring, payout rail limits, and seller eligibility rules.',
    });

  if (inputs.agenticPaymentUsage)
    list.push({
      title: 'Agentic Payment Controls',
      text: 'Validate agent identity, delegated authority, policy checks, scoped payment tokens, beneficiary validation, and audit records.',
    });

  if (HIGH_FUNDS_MODELS.includes(inputs.paymentOperatingModel))
    list.push({
      title: 'Funds Governance',
      text: 'Review funds holding, licensing exposure, settlement control, ledgering, and regulatory responsibility.',
    });

  return list;
}

export default function DecisionAlerts({ inputs }: Props) {
  const alerts = buildAlerts(inputs);

  return (
    <section className="py-10 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle size={18} className="text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Decision Alerts</h2>
          <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium border ${
            alerts.length > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            {alerts.length > 0 ? `${alerts.length} signal${alerts.length !== 1 ? 's' : ''}` : 'Clear'}
          </span>
        </div>
        <p className="text-xs text-amber-400/70 italic mb-5">
          Illustrative signals based on synthetic thresholds. Not legal, compliance, or financial advice.
        </p>

        {alerts.length === 0 ? (
          <div className="flex items-start gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4 max-w-xl">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-emerald-300 mb-0.5">No Major Alerts</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <AcronymText>Current inputs do not trigger major risk alerts. Continue reviewing GTM fit, operating model, monetization, infrastructure readiness, and scenario tradeoffs.</AcronymText>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {alerts.map(alert => (
              <div key={alert.title} className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/25 rounded-xl p-4">
                <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-300 mb-0.5">{alert.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <AcronymText>{alert.text}</AcronymText>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
