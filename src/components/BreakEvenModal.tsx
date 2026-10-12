import React from 'react';
import { X, Scale, Info, CheckCircle2 } from 'lucide-react';
import { FinancialMetrics } from '../types/calculator';
import { formatPKR, formatRatio, formatPct } from '../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BreakEvenModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Understanding Break-Even ROAS</h3>
              <p className="text-xs text-slate-500">How to calculate your minimum required Return on Ad Spend</p>
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="font-bold text-slate-900 text-sm">The Formula</div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono-num text-xs text-indigo-900 font-semibold">
              Break-Even ROAS = Net Sales Revenue ÷ Contribution Margin (before Ads)
            </div>
            <p className="text-slate-600">
              Where <strong>Contribution Margin (before Ads)</strong> = Net Sales Revenue − (Delivered Product Cost + Unrecoverable Return Cost + Dispatched Courier Fees + Dispatched Packing Fees + Tax + Overheads).
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-900">Why Pre-Ad Margin Matters in COD E-commerce:</div>
            <p>
              In traditional e-commerce, people often calculate Break-Even ROAS simply as <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">1 ÷ Gross Margin %</code>. But in <strong>Pakistani Cash on Delivery (COD)</strong>, that simple formula is dangerous and causes stores to lose money!
            </p>
            <p>
              Because couriers charge you shipping fees for <strong>all dispatched parcels</strong> (including returns), your delivery fees eat into your margin before you even account for Meta/TikTok ads. Our formula factors in:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Courier fees paid on failed/returned deliveries (RTO burden)</li>
              <li>Packaging materials discarded on returned parcels</li>
              <li>Damaged or unrecoverable inventory</li>
              <li>Estimated 4% tax assumption on delivered sales</li>
            </ul>
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-900">
            <div className="font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              When is Break-Even ROAS displayable?
            </div>
            <p>
              If your non-ad operational costs exceed your revenue, your contribution margin before ads is negative (≤ 0). In that case, you lose money on every order even at $0 ad spend. Break-even ROAS is therefore only mathematically meaningful when pre-ad contribution margin is positive.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              How to use this in Meta & TikTok Ads Manager:
            </div>
            <p>
              If your Break-Even ROAS is <strong>2.40x</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Any campaign running at <strong>ROAS &gt; 2.40x</strong> is putting actual profit into your bank account.</li>
              <li>Any campaign running at <strong>ROAS &lt; 2.40x</strong> is burning cash after factoring in courier and return losses.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
