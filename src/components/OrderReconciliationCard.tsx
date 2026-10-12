import React from 'react';
import { Package, XCircle, Clock, Truck, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import { CalculationMode, OrderReconciliation } from '../types/calculator';
import { formatOrders, formatPct } from '../utils/formatters';

interface Props {
  reconciliation: OrderReconciliation;
  calcMode: CalculationMode;
}

export const OrderReconciliationCard: React.FC<Props> = ({ reconciliation, calcMode }) => {
  const {
    totalOrders,
    cancelledOrders,
    pendingOrders,
    dispatchedOrders,
    deliveredOrders,
    returnedOrders,
    expectedDeliveries,
    expectedReturns,
    effectiveDelivered,
    effectiveReturned,
  } = reconciliation;

  const cancelPct = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;
  const dispatchedPct = totalOrders > 0 ? (dispatchedOrders / totalOrders) * 100 : 0;
  const pendingPct = totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0;

  const deliverySuccessPct = dispatchedOrders > 0 ? (effectiveDelivered / dispatchedOrders) * 100 : 0;
  const returnPct = dispatchedOrders > 0 ? (effectiveReturned / dispatchedOrders) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Order Reconciliation & Flow</h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
                calcMode === 'actual'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-purple-100 text-purple-700 border border-purple-200'
              }`}
            >
              {calcMode === 'actual' ? 'Actual Mode Active' : 'Estimated Mode Active'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict COD fulfillment pipeline: Shopify intake → Dispatched to courier → Cash collected vs RTO return
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Only dispatched parcels incur courier & packing fees</span>
        </div>
      </div>

      {/* Visual Pipeline Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
        {/* Total Shopify Orders */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono-num">{formatOrders(totalOrders)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Shopify store intake</div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono-num">{formatOrders(cancelledOrders)}</div>
          <div className="text-[11px] text-rose-600 mt-1 flex items-center justify-between">
            <span>{formatPct(cancelPct)} of total</span>
            <span className="text-slate-400 font-medium">Rs. 0 cost</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Pending / Hold</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-800 font-mono-num">{formatOrders(pendingOrders)}</div>
          <div className="text-[11px] text-amber-700 mt-1 flex items-center justify-between">
            <span>{formatPct(pendingPct)} unfulfilled</span>
            <span className="text-slate-400 font-medium">Rs. 0 cost</span>
          </div>
        </div>

        {/* Dispatched Parcels */}
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Dispatched</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-900 font-mono-num">{formatOrders(dispatchedOrders)}</div>
          <div className="text-[11px] text-indigo-700 mt-1 flex items-center justify-between">
            <span>{formatPct(dispatchedPct)} handed to courier</span>
          </div>
        </div>

        {/* Successfully Delivered */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 ring-1 ring-emerald-400/20">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Delivered (COD)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono-num">
            {formatOrders(effectiveDelivered)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center justify-between font-semibold">
            <span>{formatPct(deliverySuccessPct)} delivered</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-normal">
              {calcMode === 'actual' ? 'Actual' : 'Est.'}
            </span>
          </div>
        </div>

        {/* Returned Parcels */}
        <div className="bg-orange-50/60 border border-orange-200 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-orange-700 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Returned (RTO)</span>
            <RotateCcw className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-extrabold text-orange-800 font-mono-num">
            {formatOrders(effectiveReturned)}
          </div>
          <div className="text-[11px] text-orange-700 mt-1 flex items-center justify-between font-medium">
            <span>{formatPct(returnPct)} return rate</span>
            <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.2 rounded">
              {calcMode === 'actual' ? 'Actual' : 'Forecast'}
            </span>
          </div>
        </div>
      </div>

      {/* Reconciliation Comparison Bar */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Delivered: <strong className="text-slate-800">{formatOrders(effectiveDelivered)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
            <span>Returned: <strong className="text-slate-800">{formatOrders(effectiveReturned)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
            <span>Cancelled: <strong className="text-slate-800">{formatOrders(cancelledOrders)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span>Pending: <strong className="text-slate-800">{formatOrders(pendingOrders)}</strong></span>
          </div>
        </div>

        {calcMode === 'actual' && (
          <div className="text-slate-500 text-[11px] bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            For comparison, Expected Deliveries at return assumption would be: <strong className="text-slate-800">{formatOrders(expectedDeliveries)}</strong>
          </div>
        )}
        {calcMode === 'estimated' && (
          <div className="text-slate-500 text-[11px] bg-purple-50 text-purple-700 px-2.5 py-1 rounded border border-purple-200">
            Based on <strong className="text-purple-900">{formatPct(reconciliation.expectedReturns / (dispatchedOrders || 1) * 100)}</strong> expected return rate assumption
          </div>
        )}
      </div>
    </div>
  );
};
