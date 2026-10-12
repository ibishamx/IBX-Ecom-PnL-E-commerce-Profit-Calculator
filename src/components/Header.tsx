import React from 'react';
import {
  Calculator,
  RotateCcw,
  Printer,
  Share2,
  BookmarkCheck,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { CalculationMode, CalculatorInputs } from '../types/calculator';
import { PRESETS } from '../utils/calculator';

interface Props {
  inputs: CalculatorInputs;
  onModeToggle: (mode: CalculationMode) => void;
  onApplyPreset: (key: string) => void;
  onReset: () => void;
  onOpenCopyModal: () => void;
  onPrint: () => void;
  onSaveToLocalStorage: () => void;
  onClearLocalStorage: () => void;
  hasSavedData: boolean;
}

export const Header: React.FC<Props> = ({
  inputs,
  onModeToggle,
  onApplyPreset,
  onReset,
  onOpenCopyModal,
  onPrint,
  onSaveToLocalStorage,
  onClearLocalStorage,
  hasSavedData,
}) => {
  return (
    <header className="mb-6 space-y-4">
      {/* Top Banner & Title Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0 font-extrabold text-xl tracking-tight">
            IBX
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                IBX Ecom PnL
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                PKR (Rs.)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Pakistan E-commerce Profit & Loss Calculator — Shopify & COD Logistics
            </p>
          </div>
        </div>

        {/* Mode Selector Toggle: Actual vs Estimated */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => onModeToggle('actual')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                inputs.calcMode === 'actual'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${inputs.calcMode === 'actual' ? 'bg-blue-600' : 'bg-slate-300'}`} />
              <span>Actual Mode</span>
            </button>
            <button
              type="button"
              onClick={() => onModeToggle('estimated')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                inputs.calcMode === 'estimated'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${inputs.calcMode === 'estimated' ? 'bg-purple-600' : 'bg-slate-300'}`} />
              <span>Estimated Mode (Forecasting)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Toolbar & Preset Bar (no-print) */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 font-semibold flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Preset:</span>
          </span>
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => onApplyPreset(key)}
              title={p.description}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-colors text-[11px]"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Global Functional Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* LocalStorage Save */}
          <button
            type="button"
            onClick={onSaveToLocalStorage}
            title="Save current inputs to browser storage"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors text-[11px]"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>{hasSavedData ? 'Update Saved' : 'Save Inputs'}</span>
          </button>

          {hasSavedData && (
            <button
              type="button"
              onClick={onClearLocalStorage}
              title="Delete saved inputs from browser storage"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Summary */}
          <button
            type="button"
            onClick={onOpenCopyModal}
            className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1.5 transition-colors text-[11px]"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copy Summary</span>
          </button>

          {/* Print / Save as PDF */}
          <button
            type="button"
            onClick={onPrint}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors text-[11px]"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          {/* Reset All Fields */}
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 transition-colors text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
