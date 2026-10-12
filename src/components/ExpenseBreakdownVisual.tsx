import React from 'react';
import { FinancialMetrics } from '../types/calculator';
import { formatPKR, formatPct } from '../utils/formatters';

interface Props {
  metrics: FinancialMetrics;
}

export const ExpenseBreakdownVisual: React.FC<Props> = ({ metrics }) => {
  const {
    netSalesRevenue,
    productCostSuccessfulSales,
    unrecoverableReturnedCost,
    advertisingExpense,
    courierExpense,
    packingExpense,
    taxExpense,
    otherExpenses,
    netProfit,
    isProfitable,
  } = metrics;

  if (netSalesRevenue <= 0) return null;

  const totalProduct = productCostSuccessfulSales + unrecoverableReturnedCost;
  const pctProduct = Math.max(0, (totalProduct / netSalesRevenue) * 100);
  const pctAds = Math.max(0, (advertisingExpense / netSalesRevenue) * 100);
  const pctCourier = Math.max(0, (courierExpense / netSalesRevenue) * 100);
  const pctPacking = Math.max(0, (packingExpense / netSalesRevenue) * 100);
  const pctTax = Math.max(0, (taxExpense / netSalesRevenue) * 100);
  const pctOverhead = Math.max(0, (otherExpenses / netSalesRevenue) * 100);
  const pctNetProfit = (netProfit / netSalesRevenue) * 100;

  const segments = [
    { label: 'Product & Returns', pct: pctProduct, amount: totalProduct, color: 'bg-amber-500', text: 'text-amber-800' },
    { label: 'Ad Spend', pct: pctAds, amount: advertisingExpense, color: 'bg-purple-600', text: 'text-purple-800' },
    { label: 'Courier COD', pct: pctCourier, amount: courierExpense, color: 'bg-indigo-600', text: 'text-indigo-800' },
    { label: 'Packing', pct: pctPacking, amount: packingExpense, color: 'bg-teal-500', text: 'text-teal-800' },
    { label: 'Tax', pct: pctTax, amount: taxExpense, color: 'bg-sky-500', text: 'text-sky-800' },
    { label: 'Overheads', pct: pctOverhead, amount: otherExpenses, color: 'bg-slate-500', text: 'text-slate-800' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Revenue Allocation & Cost Anatomy</h3>
          <p className="text-xs text-slate-500">
            Breakdown of every 100 PKR generated in realized sales revenue
          </p>
        </div>
        <div className="text-xs font-semibold">
          {isProfitable ? (
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
              Net Profit Retained: {formatPct(pctNetProfit)}
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg">
              Costs Exceed Revenue by {formatPct(Math.abs(pctNetProfit))}
            </span>
          )}
        </div>
      </div>

      {/* Stacked Proportional Bar */}
      <div className="pt-4">
        <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
          {segments.map((seg, i) =>
            seg.pct > 0 ? (
              <div
                key={i}
                style={{ width: `${Math.min(100, seg.pct)}%` }}
                className={`${seg.color} h-full transition-all relative group first:rounded-l-full last:rounded-r-full`}
                title={`${seg.label}: ${formatPKR(seg.amount)} (${formatPct(seg.pct)})`}
              />
            ) : null
          )}
          {isProfitable && pctNetProfit > 0 && (
            <div
              style={{ width: `${Math.min(100, pctNetProfit)}%` }}
              className="bg-emerald-500 h-full transition-all rounded-r-full"
              title={`Net Profit: ${formatPKR(netProfit)} (${formatPct(pctNetProfit)})`}
            />
          )}
        </div>
      </div>

      {/* Legend & Breakdown Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-4">
        {segments.map((seg, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`}></span>
              <span className="text-[11px] font-semibold text-slate-600 truncate">{seg.label}</span>
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono-num">{formatPct(seg.pct)}</div>
            <div className="text-[10px] text-slate-400 font-mono-num">{formatPKR(seg.amount)}</div>
          </div>
        ))}

        {/* Net Profit Chip */}
        <div
          className={`p-2.5 rounded-xl border ${
            isProfitable
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/70 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isProfitable ? 'bg-emerald-600' : 'bg-rose-600'}`}
            ></span>
            <span className="text-[11px] font-bold truncate">Net {isProfitable ? 'Profit' : 'Loss'}</span>
          </div>
          <div className="text-sm font-extrabold font-mono-num">
            {formatPct(pctNetProfit)}
          </div>
          <div className="text-[10px] font-mono-num font-semibold">
            {formatPKR(netProfit, { showSign: true })}
          </div>
        </div>
      </div>
    </div>
  );
};
