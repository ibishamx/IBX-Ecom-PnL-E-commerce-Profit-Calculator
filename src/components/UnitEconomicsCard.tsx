import React from 'react';
import { FinancialMetrics, OrderReconciliation } from '../types/calculator';
import { formatPKR, formatPct } from '../utils/formatters';
import { Layers, ArrowRight } from 'lucide-react';

interface Props {
  metrics: FinancialMetrics;
  reconciliation: OrderReconciliation;
}

export const UnitEconomicsCard: React.FC<Props> = ({ metrics, reconciliation }) => {
  if (reconciliation.effectiveDelivered <= 0 || metrics.netSalesRevenue <= 0) return null;

  const {
    revenuePerDelivered,
    productCostPerDelivered,
    courierPerDelivered,
    packingPerDelivered,
    adSpendPerDelivered,
    taxPerDelivered,
    overheadPerDelivered,
    netProfitPerDelivered,
  } = metrics;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Per-Delivered-Parcel Unit Economics</h3>
          <p className="text-xs text-slate-500">
            Realized cash and fully allocated cost burden for each successfully completed COD parcel
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono-num bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          Total Dispatched: {reconciliation.dispatchedOrders} → Delivered: {reconciliation.effectiveDelivered}
        </div>
      </div>

      <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
        {/* Selling Price / Revenue */}
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70">
          <div className="text-[10px] font-bold text-blue-900 uppercase">Selling Price</div>
          <div className="text-base font-extrabold text-blue-900 font-mono-num mt-1">
            {formatPKR(revenuePerDelivered)}
          </div>
          <div className="text-[10px] text-blue-700 mt-0.5">Cash collected</div>
        </div>

        {/* Product Cost */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-semibold text-slate-600 uppercase">Product COGS</div>
          <div className="text-base font-bold text-slate-900 font-mono-num mt-1">
            -{formatPKR(productCostPerDelivered)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Inventory base</div>
        </div>

        {/* Courier Burden */}
        <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200/60">
          <div className="text-[10px] font-semibold text-indigo-900 uppercase">Courier Burden</div>
          <div className="text-base font-bold text-indigo-900 font-mono-num mt-1">
            -{formatPKR(courierPerDelivered)}
          </div>
          <div className="text-[10px] text-indigo-700 mt-0.5">Inc. RTO costs</div>
        </div>

        {/* Packing Burden */}
        <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/60">
          <div className="text-[10px] font-semibold text-teal-900 uppercase">Packing Burden</div>
          <div className="text-base font-bold text-teal-900 font-mono-num mt-1">
            -{formatPKR(packingPerDelivered)}
          </div>
          <div className="text-[10px] text-teal-700 mt-0.5">Materials used</div>
        </div>

        {/* Ad CPA */}
        <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200/60">
          <div className="text-[10px] font-semibold text-purple-900 uppercase">Ad CPA</div>
          <div className="text-base font-bold text-purple-900 font-mono-num mt-1">
            -{formatPKR(adSpendPerDelivered)}
          </div>
          <div className="text-[10px] text-purple-700 mt-0.5">Per delivery CPA</div>
        </div>

        {/* Tax */}
        <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200/60">
          <div className="text-[10px] font-semibold text-sky-900 uppercase">Tax Est.</div>
          <div className="text-base font-bold text-sky-900 font-mono-num mt-1">
            -{formatPKR(taxPerDelivered)}
          </div>
          <div className="text-[10px] text-sky-700 mt-0.5">4% assumption</div>
        </div>

        {/* Overhead */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-semibold text-slate-600 uppercase">Overhead</div>
          <div className="text-base font-bold text-slate-900 font-mono-num mt-1">
            -{formatPKR(overheadPerDelivered)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">G&A apps/rent</div>
        </div>

        {/* Net Profit in Pocket */}
        <div
          className={`p-3 rounded-xl border ${
            netProfitPerDelivered > 0
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="text-[10px] font-extrabold uppercase">
            Net In Pocket
          </div>
          <div className="text-base font-extrabold font-mono-num mt-1">
            {formatPKR(netProfitPerDelivered, { showSign: true })}
          </div>
          <div className="text-[10px] font-semibold mt-0.5">
            {formatPct(metrics.profitMarginPct)} margin
          </div>
        </div>
      </div>
    </div>
  );
};
