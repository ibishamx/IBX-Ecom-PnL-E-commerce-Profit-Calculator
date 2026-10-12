import React from 'react';
import { FinancialMetrics, OrderReconciliation } from '../types/calculator';
import { formatPKR, formatPct } from '../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Props {
  metrics: FinancialMetrics;
  reconciliation: OrderReconciliation;
}

export const PLTable: React.FC<Props> = ({ metrics, reconciliation }) => {
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
    totalAllExpenses,
  } = metrics;

  const delivered = reconciliation.effectiveDelivered;
  const safeDelivered = delivered > 0 ? delivered : 1;

  const getPct = (amount: number) => {
    if (netSalesRevenue <= 0) return '—';
    return formatPct((amount / netSalesRevenue) * 100);
  };

  const getPerDelivered = (amount: number) => {
    if (delivered <= 0) return '—';
    return formatPKR(amount / safeDelivered);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden mb-8">
      <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Detailed Profit & Loss Statement</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Classified view of revenue, direct COGS, logistics, marketing, and net earnings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Delivered Parcels Base:</span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg font-mono-num">
            {reconciliation.effectiveDelivered} Orders
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 sm:px-6">Financial Line Item</th>
              <th className="py-3 px-4 text-right">Amount (PKR)</th>
              <th className="py-3 px-4 text-right">% of Net Revenue</th>
              <th className="py-3 px-4 text-right hidden md:table-cell">Per Delivered Parcel</th>
              <th className="py-3 px-4 text-left hidden lg:table-cell">Operational Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* REVENUE SECTION */}
            <tr className="bg-blue-50/30">
              <td colSpan={5} className="py-2 px-4 sm:px-6 text-[11px] font-bold tracking-wider text-blue-900 uppercase">
                1. Sales Inflow (Delivered Parcels Only)
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 transition-colors font-medium">
              <td className="py-3.5 px-4 sm:px-6 text-slate-900">
                <div className="font-semibold text-slate-900">Net Sales Revenue</div>
                <div className="text-xs text-slate-500">
                  {reconciliation.effectiveDelivered} delivered orders @ {formatPKR(metrics.revenuePerDelivered)}
                </div>
              </td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono-num text-base">
                {formatPKR(netSalesRevenue)}
              </td>
              <td className="py-3.5 px-4 text-right text-slate-600 font-mono-num">100.0%</td>
              <td className="py-3.5 px-4 text-right text-slate-600 font-mono-num hidden md:table-cell">
                {formatPKR(metrics.revenuePerDelivered)}
              </td>
              <td className="py-3.5 px-4 text-slate-500 text-xs hidden lg:table-cell">
                Realized Cash (Excludes Cancelled & RTO)
              </td>
            </tr>

            {/* DIRECT PRODUCT COSTS */}
            <tr className="bg-amber-50/30">
              <td colSpan={5} className="py-2 px-4 sm:px-6 text-[11px] font-bold tracking-wider text-amber-900 uppercase">
                2. Cost of Goods Sold (COGS) & Inventory Loss
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4 sm:px-6">
                <div className="font-medium text-slate-800">Product Cost (Delivered Sales)</div>
                <div className="text-xs text-slate-500">
                  Cost of inventory shipped and successfully accepted by customers
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-800">
                {formatPKR(productCostSuccessfulSales)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600">
                {getPct(productCostSuccessfulSales)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600 hidden md:table-cell">
                {getPerDelivered(productCostSuccessfulSales)}
              </td>
              <td className="py-3 px-4 text-slate-500 text-xs hidden lg:table-cell">
                Direct Cost (Wholesale / Manufacturing)
              </td>
            </tr>

            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4 sm:px-6">
                <div className="font-medium text-slate-800">Unrecoverable Returned Product Cost</div>
                <div className="text-xs text-slate-500">
                  Damaged/lost returns only ({metrics.returnBreakdown.restockableUnits.toFixed(0)} units restocked at Rs.0 loss)
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-amber-800">
                {formatPKR(unrecoverableReturnedCost)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600">
                {getPct(unrecoverableReturnedCost)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600 hidden md:table-cell">
                {getPerDelivered(unrecoverableReturnedCost)}
              </td>
              <td className="py-3 px-4 text-slate-500 text-xs hidden lg:table-cell">
                Inventory Scrap / Scrap Damage Expense
              </td>
            </tr>

            {/* FULFILMENT & LOGISTICS */}
            <tr className="bg-indigo-50/30">
              <td colSpan={5} className="py-2 px-4 sm:px-6 text-[11px] font-bold tracking-wider text-indigo-900 uppercase">
                3. Fulfilment & Courier Logistics (COD)
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4 sm:px-6">
                <div className="font-medium text-slate-800">Courier Charges</div>
                <div className="text-xs text-slate-500">
                  Billed once for every dispatched parcel ({reconciliation.dispatchedOrders} parcels)
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-800">
                {formatPKR(courierExpense)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600">
                {getPct(courierExpense)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600 hidden md:table-cell">
                {getPerDelivered(courierExpense)}
              </td>
              <td className="py-3 px-4 text-slate-500 text-xs hidden lg:table-cell">
                Courier Tariff (Trax, Call Courier, PostEx, etc.)
              </td>
            </tr>

            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4 sm:px-6">
                <div className="font-medium text-slate-800">Packing Costs</div>
                <div className="text-xs text-slate-500">
                  Flyers, boxes, bubble wrap & thermal stickers on dispatched parcels
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-800">
                {formatPKR(packingExpense)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600">
                {getPct(packingExpense)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600 hidden md:table-cell">
                {getPerDelivered(packingExpense)}
              </td>
              <td className="py-3 px-4 text-slate-500 text-xs hidden lg:table-cell">
                Packaging Material Consumables
              </td>
            </tr>

            {/* MARKETING & OVERHEADS */}
            <tr className="bg-purple-50/30">
              <td colSpan={5} className="py-2 px-4 sm:px-6 text-[11px] font-bold tracking-wider text-purple-900 uppercase">
                4. Customer Acquisition, Tax & Overheads
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4 sm:px-6">
                <div className="font-medium text-slate-800">Advertising Spend</div>
                <div className="text-xs text-slate-500">
                  Paid traffic (Meta Ads, TikTok Ads, Google)
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-purple-800 font-semibold">
                {formatPKR(advertisingExpense)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600">
                {getPct(advertisingExpense)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600 hidden md:table-cell">
                {getPerDelivered(advertisingExpense)}
              </td>
              <td className="py-3 px-4 text-slate-500 text-xs hidden lg:table-cell">
                Marketing Spend / Ad Accounts
              </td>
            </tr>

            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4 sm:px-6">
                <div className="font-medium text-slate-800">Tax Expense</div>
                <div className="text-xs text-slate-500">
                  Assumed tax on successfully delivered orders
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-800">
                {formatPKR(taxExpense)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600">
                {getPct(taxExpense)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600 hidden md:table-cell">
                {getPerDelivered(taxExpense)}
              </td>
              <td className="py-3 px-4 text-slate-500 text-xs hidden lg:table-cell">
                User-Defined Tax Assumption
              </td>
            </tr>

            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-4 sm:px-6">
                <div className="font-medium text-slate-800">Other Expenses</div>
                <div className="text-xs text-slate-500">
                  Shopify subscription, apps, staff salaries, warehouse rent
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-800">
                {formatPKR(otherExpenses)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600">
                {getPct(otherExpenses)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-600 hidden md:table-cell">
                {getPerDelivered(otherExpenses)}
              </td>
              <td className="py-3 px-4 text-slate-500 text-xs hidden lg:table-cell">
                General & Administrative (G&A)
              </td>
            </tr>

            {/* TOTAL EXPENSES ROW */}
            <tr className="bg-slate-100/70 border-t-2 border-slate-200 font-semibold">
              <td className="py-3 px-4 sm:px-6 text-slate-900">Total All Expenses & Costs</td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-900">
                {formatPKR(totalAllExpenses)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-700">
                {getPct(totalAllExpenses)}
              </td>
              <td className="py-3 px-4 text-right font-mono-num text-slate-700 hidden md:table-cell">
                {getPerDelivered(totalAllExpenses)}
              </td>
              <td className="py-3 px-4 text-slate-600 text-xs hidden lg:table-cell">
                COGS + Opex + Marketing + Tax
              </td>
            </tr>

            {/* NET PROFIT / LOSS ROW */}
            <tr
              className={`border-t-2 ${
                isProfitable
                  ? 'bg-emerald-50/80 text-emerald-900 border-emerald-300'
                  : 'bg-rose-50/80 text-rose-900 border-rose-300'
              }`}
            >
              <td className="py-4 px-4 sm:px-6 font-extrabold text-base flex items-center gap-2">
                {isProfitable ? (
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                )}
                <span>Net Profit / Loss</span>
              </td>
              <td
                className={`py-4 px-4 text-right font-extrabold font-mono-num text-lg ${
                  isProfitable ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatPKR(netProfit, { showSign: true })}
              </td>
              <td
                className={`py-4 px-4 text-right font-extrabold font-mono-num text-base ${
                  isProfitable ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatPct(metrics.profitMarginPct)}
              </td>
              <td
                className={`py-4 px-4 text-right font-extrabold font-mono-num hidden md:table-cell ${
                  isProfitable ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatPKR(metrics.netProfitPerDelivered, { showSign: true })}
              </td>
              <td className="py-4 px-4 text-xs font-semibold hidden lg:table-cell">
                {isProfitable ? 'Net Take-Home Earnings' : 'Net Cash Burn / Loss'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
