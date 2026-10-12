import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Box,
  Receipt,
  Layers,
  Percent,
  Crosshair,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Info,
  Scale,
} from 'lucide-react';
import { FinancialMetrics } from '../types/calculator';
import { formatPKR, formatPct, formatRatio, formatPakistaniNotation } from '../utils/formatters';

interface Props {
  metrics: FinancialMetrics;
  onOpenBreakEvenModal: () => void;
}

export const DashboardKPIs: React.FC<Props> = ({ metrics, onOpenBreakEvenModal }) => {
  const {
    netSalesRevenue,
    netProfit,
    isProfitable,
    advertisingExpense,
    totalProductCost,
    courierExpense,
    packingExpense,
    taxExpense,
    totalOperatingExpenses,
    profitMarginPct,
    roas,
    cpa,
    returnRatePct,
    cancellationRatePct,
    deliverySuccessRatePct,
    breakEvenRoas,
  } = metrics;

  const pakistaniNotation = formatPakistaniNotation(netSalesRevenue);

  return (
    <div className="space-y-4 mb-8">
      {/* Hero Financial Banner: Net Sales vs Net Profit/Loss */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Net Sales Revenue Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none transition-all"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Net Sales Revenue
              </span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <DollarSign className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono-num tracking-tight">
              {formatPKR(netSalesRevenue)}
            </div>
            {pakistaniNotation && (
              <span className="inline-block mt-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                ~ {pakistaniNotation}
              </span>
            )}
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Realized cash from successfully delivered COD parcels</span>
            <span className="font-semibold text-slate-700">Gross: {formatPKR(metrics.grossPotentialRevenue)}</span>
          </div>
        </div>

        {/* 2. Net Profit / Loss Card (Prominent Status Hero) */}
        <div
          className={`rounded-2xl border shadow-xs p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
            isProfitable
              ? 'bg-gradient-to-br from-emerald-500/10 via-white to-white border-emerald-300'
              : netProfit < 0
              ? 'bg-gradient-to-br from-rose-500/10 via-white to-white border-rose-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  2. Net Profit / Loss
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isProfitable
                      ? 'bg-emerald-600 text-white'
                      : netProfit < 0
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-500 text-white'
                  }`}
                >
                  {isProfitable ? 'PROFITABLE' : netProfit < 0 ? 'NET LOSS' : 'BREAK-EVEN'}
                </span>
              </div>
              <span
                className={`p-2 rounded-xl ${
                  isProfitable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {isProfitable ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </span>
            </div>

            <div
              className={`text-3xl sm:text-4xl font-extrabold font-mono-num tracking-tight ${
                isProfitable ? 'text-emerald-700' : netProfit < 0 ? 'text-rose-600' : 'text-slate-700'
              }`}
            >
              {formatPKR(netProfit, { showSign: true })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Profit Margin:{' '}
              <strong className={isProfitable ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                {formatPct(profitMarginPct)}
              </strong>
            </span>
            <span className="text-slate-600">
              Per Delivered Order:{' '}
              <strong className={metrics.netProfitPerDelivered >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                {formatPKR(metrics.netProfitPerDelivered, { showSign: true })}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Primary Cost Categories (Cards 3 - 8) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 3. Total Ad Spend */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">3. Ad Spend</span>
            <Crosshair className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-num">{formatPKR(advertisingExpense)}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            ROAS: <strong className="text-purple-700">{formatRatio(roas)}</strong>
          </div>
        </div>

        {/* 4. Total Product Cost */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">4. Product Cost</span>
            <Box className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-num">{formatPKR(totalProductCost)}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Inc. unrecov: <strong className="text-amber-800">{formatPKR(metrics.unrecoverableReturnedCost)}</strong>
          </div>
        </div>

        {/* 5. Total Courier Expense */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">5. Courier Fee</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-num">{formatPKR(courierExpense)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Dispatched parcels only</div>
        </div>

        {/* 6. Total Packing Expense */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">6. Packing Cost</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-num">{formatPKR(packingExpense)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Flyers, tape & boxes</div>
        </div>

        {/* 7. Total Tax Expense */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">7. Tax Expense</span>
            <Receipt className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-num">{formatPKR(taxExpense)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Delivered parcels only</div>
        </div>

        {/* 8. Total Operating Expenses */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-all bg-slate-50/40">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">8. Operating Ex</span>
            <DollarSign className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-num">{formatPKR(totalOperatingExpenses)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Ads + Courier + Pack + Tax + Misc</div>
        </div>
      </div>

      {/* Efficiency, Marketing & COD Operational KPIs (Cards 9 - 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* 9. Profit Margin (%) */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>9. Net Margin</span>
            <Percent className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div
            className={`text-xl font-extrabold font-mono-num mt-2 ${
              profitMarginPct === null
                ? 'text-slate-400'
                : profitMarginPct > 15
                ? 'text-emerald-600'
                : profitMarginPct > 0
                ? 'text-blue-600'
                : 'text-rose-600'
            }`}
          >
            {formatPct(profitMarginPct)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Net profit / Revenue</div>
        </div>

        {/* 10. ROAS */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>10. ROAS</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="text-xl font-extrabold text-purple-700 font-mono-num mt-2">{formatRatio(roas)}</div>
          <div className="text-[10px] text-slate-500 mt-1">Revenue / Ad Spend</div>
        </div>

        {/* 11. CPA */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>11. CPA (Delivered)</span>
            <Crosshair className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-extrabold text-slate-800 font-mono-num mt-2">
            {cpa !== null ? formatPKR(cpa) : '—'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Ad cost per delivery</div>
        </div>

        {/* 12. Return Rate (%) */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>12. Return Rate</span>
            <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div
            className={`text-xl font-extrabold font-mono-num mt-2 ${
              returnRatePct === null
                ? 'text-slate-400'
                : returnRatePct > 25
                ? 'text-orange-700 font-bold'
                : 'text-slate-800'
            }`}
          >
            {formatPct(returnRatePct)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Returned / Dispatched</div>
        </div>

        {/* 13. Cancellation Rate (%) */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>13. Cancel Rate</span>
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-extrabold text-rose-700 font-mono-num mt-2">
            {formatPct(cancellationRatePct)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Cancelled / Orders</div>
        </div>

        {/* 14. Delivery Success Rate (%) */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>14. Delivery Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono-num mt-2">
            {formatPct(deliverySuccessRatePct)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Delivered / Dispatched</div>
        </div>

        {/* 15. Break-Even ROAS */}
        <div className="bg-white rounded-xl border border-indigo-200/80 bg-indigo-50/20 p-3.5 flex flex-col justify-between relative group">
          <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              15. B.E. ROAS
              <button
                type="button"
                onClick={onOpenBreakEvenModal}
                className="text-indigo-600 hover:text-indigo-800"
                title="Click to understand Break-Even ROAS"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </span>
            <Scale className="w-3.5 h-3.5 text-indigo-500" />
          </div>

          <div className="text-xl font-extrabold text-indigo-700 font-mono-num mt-2">
            {breakEvenRoas !== null ? formatRatio(breakEvenRoas) : '—'}
          </div>

          <button
            type="button"
            onClick={onOpenBreakEvenModal}
            className="text-[10px] text-indigo-600 hover:underline text-left mt-1 font-medium"
          >
            {breakEvenRoas !== null ? 'Min ROAS for Rs.0 profit' : 'No positive margin'}
          </button>
        </div>
      </div>
    </div>
  );
};
