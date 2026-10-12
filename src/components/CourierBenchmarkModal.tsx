import React from 'react';
import { X, Truck, Check, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CourierBenchmarkModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const couriers = [
    {
      name: 'Trax Logistics',
      tariff05kg: 'Rs. 220 - 260',
      tariff1kg: 'Rs. 260 - 310',
      remittance: 'Twice a week (Tues / Fri)',
      returnPolicy: 'Standard dispatch charged once; Rs. 0 extra RTO return fee on standard accounts',
      specialty: 'High urban coverage, automated portal & Shopify app sync',
    },
    {
      name: 'PostEx',
      tariff05kg: 'Rs. 210 - 250',
      tariff1kg: 'Rs. 250 - 290',
      remittance: 'Daily / Upfront Cashflow Financing available',
      returnPolicy: 'Dispatched fee charged once; no return courier surcharge',
      specialty: 'Fastest cash remittance, built-in instant payout loan feature',
    },
    {
      name: 'Call Courier',
      tariff05kg: 'Rs. 230 - 270',
      tariff1kg: 'Rs. 280 - 320',
      remittance: 'Weekly',
      returnPolicy: 'Dispatched fee charged once',
      specialty: 'Strong tier-2 and tier-3 city delivery reach in Punjab and KPK',
    },
    {
      name: 'Leopards Courier',
      tariff05kg: 'Rs. 250 - 290',
      tariff1kg: 'Rs. 300 - 350',
      remittance: 'Weekly (Friday)',
      returnPolicy: 'Charged on dispatch',
      specialty: 'Extensive retail office presence across Pakistan',
    },
    {
      name: 'TCS Express',
      tariff05kg: 'Rs. 320 - 380',
      tariff1kg: 'Rs. 390 - 450',
      remittance: 'Weekly / Bi-weekly',
      returnPolicy: 'Charged on dispatch',
      specialty: 'Premium tier, highest customer brand trust, higher tariff',
    },
    {
      name: 'Rider Logistics',
      tariff05kg: 'Rs. 210 - 250',
      tariff1kg: 'Rs. 250 - 290',
      remittance: 'Twice a week',
      returnPolicy: 'Charged on dispatch',
      specialty: 'High delivery success rate in major metros (KHI, LHE, ISB)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pakistan COD Courier Benchmarks</h3>
              <p className="text-xs text-slate-500">Typical 2024-2026 COD courier rates & billing guidelines</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Why courier fees apply to all dispatched parcels:</strong> When a courier attempts delivery in Pakistan, the shipping charge is incurred immediately upon dispatch. If the customer refuses (RTO Return), the courier does not refund the fee, but standard contracts do not charge a second return fee. This calculator follows this exact standard rule.
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {couriers.map((c, i) => (
              <div key={i} className="p-3.5 hover:bg-slate-50 transition-colors text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono-num font-semibold">
                      0.5 kg: {c.tariff05kg}
                    </span>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono-num font-semibold">
                      1.0 kg: {c.tariff1kg}
                    </span>
                  </div>
                </div>
                <div className="text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-slate-400">Remittance:</span> {c.remittance}
                  </div>
                  <div>
                    <span className="text-slate-400">Best for:</span> {c.specialty}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed">
            * Note: Courier rates vary based on monthly volume negotiation, volumetric weight vs dead weight, fuel adjustment factor (FAF), and provincial sales tax on courier services (usually 13% - 16% on top of shipping invoices).
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
