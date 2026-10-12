import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { CalculationResult, CalculatorInputs } from '../types/calculator';
import { formatPKR, formatPct, formatRatio, formatOrders } from '../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  inputs: CalculatorInputs;
}

export const CopySummaryModal: React.FC<Props> = ({ isOpen, onClose, result, inputs }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { metrics, reconciliation } = result;

  const generateSummaryText = () => {
    const lines = [
      `📊 *IBX Ecom PnL — Financial Summary*`,
      `🇵🇰 *Pakistan E-commerce P&L (${inputs.reportingPeriod.toUpperCase()})*`,
      `Mode: ${inputs.calcMode === 'actual' ? 'Actual Recorded Orders' : 'Estimated Return Forecast'}`,
      `----------------------------------------`,
      `📦 *ORDER PIPELINE:*`,
      `• Total Shopify Orders: ${formatOrders(reconciliation.totalOrders)}`,
      `• Cancelled Orders: ${formatOrders(reconciliation.cancelledOrders)} (${formatPct(metrics.cancellationRatePct)})`,
      `• Dispatched Parcels: ${formatOrders(reconciliation.dispatchedOrders)}`,
      `• Delivered Parcels: ${formatOrders(reconciliation.effectiveDelivered)} (${formatPct(metrics.deliverySuccessRatePct)} success)`,
      `• Returned Parcels: ${formatOrders(reconciliation.effectiveReturned)} (${formatPct(metrics.returnRatePct)} RTO rate)`,
      `----------------------------------------`,
      `💰 *FINANCIAL OVERVIEW (PKR):*`,
      `• Net Sales Revenue: ${formatPKR(metrics.netSalesRevenue)}`,
      `• Product COGS (Delivered): ${formatPKR(metrics.productCostSuccessfulSales)}`,
      `• Damaged/Lost Returns Cost: ${formatPKR(metrics.unrecoverableReturnedCost)}`,
      `• Ad Spend: ${formatPKR(metrics.advertisingExpense)}`,
      `• Courier Charges: ${formatPKR(metrics.courierExpense)}`,
      `• Packing Costs: ${formatPKR(metrics.packingExpense)}`,
      `• Tax Assumption (${inputs.taxRate}%): ${formatPKR(metrics.taxExpense)}`,
      `• Other Overheads: ${formatPKR(metrics.otherExpenses)}`,
      `• Total Expenses: ${formatPKR(metrics.totalAllExpenses)}`,
      `----------------------------------------`,
      `🏆 *BOTTOM LINE & PROFITABILITY:*`,
      `• NET ${metrics.isProfitable ? 'PROFIT' : 'LOSS'}: ${formatPKR(metrics.netProfit, { showSign: true })}`,
      `• Net Profit Margin: ${formatPct(metrics.profitMarginPct)}`,
      `• Net Profit per Delivered: ${formatPKR(metrics.netProfitPerDelivered, { showSign: true })}`,
      `----------------------------------------`,
      `🎯 *MARKETING EFFICIENCY:*`,
      `• ROAS: ${formatRatio(metrics.roas)}`,
      `• CPA (Per Delivered): ${metrics.cpa !== null ? formatPKR(metrics.cpa) : '—'}`,
      `• Break-Even ROAS: ${metrics.breakEvenRoas !== null ? formatRatio(metrics.breakEvenRoas) : '—'}`,
      `----------------------------------------`,
      `Generated with IBX Ecom PnL — Pakistan E-commerce Profit Calculator`,
    ];
    return lines.join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Copy P&L Summary</h3>
              <p className="text-xs text-slate-500">Ready to paste into WhatsApp, Slack, or email</p>
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

        {/* Content Preview */}
        <div className="p-5 overflow-y-auto">
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono-num whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto select-all">
            {generateSummaryText()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Summary Text</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
