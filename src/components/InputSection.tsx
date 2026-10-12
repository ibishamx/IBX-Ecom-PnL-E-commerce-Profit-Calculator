import React, { useState } from 'react';
import {
  Tag,
  DollarSign,
  Share2,
  PackageCheck,
  Truck,
  Percent,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { CalculatorInputs, AdSpendMode } from '../types/calculator';
import { formatPKR } from '../utils/formatters';

interface Props {
  inputs: CalculatorInputs;
  onChange: (updates: Partial<CalculatorInputs>) => void;
  onOpenCourierModal: () => void;
}

export const InputSection: React.FC<Props> = ({ inputs, onChange, onOpenCourierModal }) => {
  const [showReturnBreakdown, setShowReturnBreakdown] = useState(false);

  const handleNumberChange = (field: keyof CalculatorInputs, value: string) => {
    const num = value === '' ? 0 : parseFloat(value);
    onChange({ [field]: isNaN(num) ? 0 : num });
  };

  const handleNullableNumberChange = (field: keyof CalculatorInputs, value: string) => {
    if (value === '') {
      onChange({ [field]: null });
    } else {
      const num = parseFloat(value);
      onChange({ [field]: isNaN(num) ? null : num });
    }
  };

  const handleAdSpendModeChange = (mode: AdSpendMode) => {
    if (mode === 'breakdown') {
      const breakdownSum = inputs.metaAdSpend + inputs.tiktokAdSpend + inputs.googleAdSpend + inputs.otherAdSpend;
      onChange({
        adSpendMode: 'breakdown',
        totalAdSpend: breakdownSum > 0 ? breakdownSum : inputs.totalAdSpend,
      });
    } else {
      onChange({ adSpendMode: 'total' });
    }
  };

  const updateBreakdownPlatform = (platform: 'metaAdSpend' | 'tiktokAdSpend' | 'googleAdSpend' | 'otherAdSpend', valStr: string) => {
    const val = valStr === '' ? 0 : parseFloat(valStr) || 0;
    const updated = { ...inputs, [platform]: val };
    const sum = updated.metaAdSpend + updated.tiktokAdSpend + updated.googleAdSpend + updated.otherAdSpend;
    onChange({
      [platform]: val,
      totalAdSpend: sum,
    });
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Grid of Input Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. PRODUCT & SELLING PRICE */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">Product & Selling Price</h4>
              <p className="text-xs text-slate-500">Inventory cost, selling price and return inventory recovery</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Product Cost Per Unit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Cost Per Unit (PKR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.productCostPerUnit || ''}
                    onChange={(e) => handleNumberChange('productCostPerUnit', e.target.value)}
                    placeholder="e.g. 1100"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Wholesale or factory cost</span>
              </div>

              {/* Selling Price Per Order */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selling Price Per Order (PKR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.sellingPricePerOrder || ''}
                    onChange={(e) => handleNumberChange('sellingPricePerOrder', e.target.value)}
                    placeholder="e.g. 3499"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400">COD price collected at door</span>
              </div>
            </div>

            {/* Average Items Per Order */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Average Items Per Order</label>
                <span className="text-xs text-slate-500 font-mono-num">Default: 1.0 item</span>
              </div>
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={inputs.avgItemsPerOrder}
                onChange={(e) => handleNumberChange('avgItemsPerOrder', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
              <span className="text-[11px] text-slate-400">
                Accounts for multi-item bundles or cart quantity averages
              </span>
            </div>

            {/* Product Cost Recovery on Returns (Accordion/Panel) */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReturnBreakdown(!showReturnBreakdown)}
                className="w-full flex items-center justify-between text-left py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Return Inventory Recovery Treatment</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-normal">
                    {inputs.returnRestockablePct}% Restockable
                  </span>
                </span>
                {showReturnBreakdown ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              <div className={`space-y-3 pt-3 px-1 transition-all ${showReturnBreakdown ? 'block' : 'hidden sm:block'}`}>
                <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed">
                  <strong>Pakistani COD Rule:</strong> Only unrecoverable damaged/lost inventory is expensed as a product loss. Restocked parcels retain inventory value and are not double-expensed.
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Restockable (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.returnRestockablePct}
                      onChange={(e) => handleNumberChange('returnRestockablePct', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono-num border border-slate-200 rounded-lg text-slate-800"
                    />
                    <span className="text-[10px] text-emerald-600 block mt-0.5">0% cost lost</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Partially Damaged (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.returnPartiallyDamagedPct}
                      onChange={(e) => handleNumberChange('returnPartiallyDamagedPct', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono-num border border-slate-200 rounded-lg text-slate-800"
                    />
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-amber-700">Loss:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        title="Damage loss %"
                        value={inputs.partialDamageLossPct}
                        onChange={(e) => handleNumberChange('partialDamageLossPct', e.target.value)}
                        className="w-10 text-[10px] font-mono-num border border-amber-300 rounded px-1"
                      />
                      <span className="text-[10px] text-amber-700">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Lost / Scrapped (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.returnCompletelyLostPct}
                      onChange={(e) => handleNumberChange('returnCompletelyLostPct', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono-num border border-slate-200 rounded-lg text-slate-800"
                    />
                    <span className="text-[10px] text-rose-600 block mt-0.5">100% cost lost</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* B. ADVERTISING */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                B
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">Advertising & Paid Media</h4>
                <p className="text-xs text-slate-500">Meta, TikTok, Google and total ad spend</p>
              </div>
            </div>

            {/* Mode switch */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => handleAdSpendModeChange('breakdown')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  inputs.adSpendMode === 'breakdown'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Breakdown
              </button>
              <button
                type="button"
                onClick={() => handleAdSpendModeChange('total')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  inputs.adSpendMode === 'total'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Direct Total
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            {inputs.adSpendMode === 'breakdown' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Meta Ads */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Meta Ads (Facebook & IG)</span>
                      <span className="text-[10px] text-blue-600 font-normal">Primary in PK</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        value={inputs.metaAdSpend || ''}
                        onChange={(e) => updateBreakdownPlatform('metaAdSpend', e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* TikTok Ads */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>TikTok Ads (PKR)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Agency/Direct</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        value={inputs.tiktokAdSpend || ''}
                        onChange={(e) => updateBreakdownPlatform('tiktokAdSpend', e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Google Ads */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Google Ads (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="2000"
                        value={inputs.googleAdSpend || ''}
                        onChange={(e) => updateBreakdownPlatform('googleAdSpend', e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Other Ads */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Other Ads / Influencers (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="2000"
                        value={inputs.otherAdSpend || ''}
                        onChange={(e) => updateBreakdownPlatform('otherAdSpend', e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Computed Ad Spend Display */}
                <div className="p-3 bg-purple-50/50 border border-purple-200/80 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-900">
                    Calculated Total Ad Spend (No Double Counting):
                  </span>
                  <span className="text-base font-extrabold text-purple-800 font-mono-num">
                    {formatPKR(inputs.metaAdSpend + inputs.tiktokAdSpend + inputs.googleAdSpend + inputs.otherAdSpend)}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Advertising Spend (PKR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={inputs.totalAdSpend || ''}
                    onChange={(e) => handleNumberChange('totalAdSpend', e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border border-slate-300 rounded-xl text-base font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Combined advertising expenditure across all channels for the period
                </span>
              </div>
            )}
          </div>
        </div>

        {/* C. SHOPIFY ORDERS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              C
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">Shopify COD Orders</h4>
              <p className="text-xs text-slate-500">Intake, cancellations, dispatched and returns</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Total Shopify Orders */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Shopify Orders <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputs.totalOrders || ''}
                  onChange={(e) => handleNumberChange('totalOrders', e.target.value)}
                  placeholder="e.g. 320"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                />
                <span className="text-[11px] text-slate-400">Total placed in store</span>
              </div>

              {/* Cancelled Orders */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cancelled Orders
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputs.cancelledOrders || ''}
                  onChange={(e) => handleNumberChange('cancelledOrders', e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-rose-700 focus:bg-white focus:border-rose-500 outline-none"
                />
                <span className="text-[11px] text-slate-400">Cancelled on confirmation call (Rs. 0 courier)</span>
              </div>

              {/* Dispatched Orders */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dispatched Orders <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputs.dispatchedOrders || ''}
                  onChange={(e) => handleNumberChange('dispatchedOrders', e.target.value)}
                  placeholder="e.g. 270"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-indigo-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
                <span className="text-[11px] text-slate-400">Booked with courier (Courier fee applies)</span>
              </div>

              {/* Delivered Orders (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Delivered Orders</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional in Actual mode</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputs.deliveredOrders ?? ''}
                  onChange={(e) => handleNullableNumberChange('deliveredOrders', e.target.value)}
                  placeholder="Auto-derived if empty"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-emerald-800 focus:bg-white focus:border-emerald-500 outline-none"
                />
                <span className="text-[11px] text-slate-400">Leave blank to use Dispatched - Returned</span>
              </div>

              {/* Returned Orders */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Returned by Courier Orders
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputs.returnedOrders || ''}
                  onChange={(e) => handleNumberChange('returnedOrders', e.target.value)}
                  placeholder="e.g. 65"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-orange-800 focus:bg-white focus:border-orange-500 outline-none"
                />
                <span className="text-[11px] text-slate-400">RTO returned parcels (Actual mode)</span>
              </div>

              {/* Expected Return Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Expected Return Rate (%)</span>
                  <span className="text-[10px] text-purple-600 font-normal">For Estimated mode</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={inputs.expectedReturnRate}
                    onChange={(e) => handleNumberChange('expectedReturnRate', e.target.value)}
                    placeholder="20"
                    className="w-full pr-8 pl-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-purple-500 outline-none"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400">
                    %
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Typical PK average: 18% - 30%</span>
              </div>
            </div>
          </div>
        </div>

        {/* D. COURIER & PACKING COSTS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                D
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">Courier & Packaging Costs</h4>
                <p className="text-xs text-slate-500">Shipping, flyers, boxes and operational overheads</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCourierModal}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
            >
              <span>Courier Benchmarks</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Courier Charges Per Dispatched Parcel */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Courier Charges Per Parcel (PKR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={inputs.courierChargePerParcel || ''}
                    onChange={(e) => handleNumberChange('courierChargePerParcel', e.target.value)}
                    placeholder="e.g. 270"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Billed once on all dispatched parcels</span>
              </div>

              {/* Packing Cost Per Dispatched Parcel */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Packing Cost Per Parcel (PKR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={inputs.packingCostPerParcel || ''}
                    onChange={(e) => handleNumberChange('packingCostPerParcel', e.target.value)}
                    placeholder="e.g. 65"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-teal-500 outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Flyer + label + tape per dispatched parcel</span>
              </div>

              {/* Additional Packaging Costs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Packaging Costs (PKR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={inputs.additionalPackagingCost || ''}
                    onChange={(e) => handleNumberChange('additionalPackagingCost', e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-teal-500 outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Bulk custom boxes, master cartons</span>
              </div>

              {/* Other Business Expenses */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Other Business Expenses (PKR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-slate-400">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={inputs.otherBusinessExpenses || ''}
                    onChange={(e) => handleNumberChange('otherBusinessExpenses', e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full pl-10 pr-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-slate-500 outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Shopify fees, staff salaries, warehouse</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong>Courier & Packing Rule:</strong> Courier fees apply exactly once per dispatched parcel. No second return delivery charge is added. Cancelled orders that never left the facility incur Rs. 0 shipping and packing.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E. TAX & REPORTING PERIOD ROW */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            E
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Tax & Reporting Period Assumptions</h4>
            <p className="text-xs text-slate-500">Configurable sales tax assumptions & timeframe</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Tax Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Tax Rate (%) on Successfully Delivered Parcels
              </label>
              <span className="text-[11px] text-slate-500">Default: 4%</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={inputs.taxRate}
                onChange={(e) => handleNumberChange('taxRate', e.target.value)}
                className="w-full pr-8 pl-3 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm font-mono-num font-semibold text-slate-900 focus:bg-white focus:border-sky-500 outline-none"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400">
                %
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              User-defined tax assumption for scenario modeling (set to 0% if non-taxed or unregistered). Applies only to delivered parcel revenues.
            </p>
          </div>

          {/* Reporting Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reporting Period
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['daily', 'weekly', 'monthly', 'custom'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => onChange({ reportingPeriod: period })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl capitalize transition-all border ${
                    inputs.reportingPeriod === period
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Assists in normalizing ad spend and fixed overhead expenses to the order batch size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
