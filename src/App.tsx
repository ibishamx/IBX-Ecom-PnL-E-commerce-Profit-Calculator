import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorInputs, CalculationMode } from './types/calculator';
import { DEFAULT_INPUTS, PRESETS, calculatePnL } from './utils/calculator';
import { Header } from './components/Header';
import { OrderReconciliationCard } from './components/OrderReconciliationCard';
import { ValidationBanner } from './components/ValidationBanner';
import { DashboardKPIs } from './components/DashboardKPIs';
import { PLTable } from './components/PLTable';
import { ExpenseBreakdownVisual } from './components/ExpenseBreakdownVisual';
import { UnitEconomicsCard } from './components/UnitEconomicsCard';
import { InputSection } from './components/InputSection';
import { CourierBenchmarkModal } from './components/CourierBenchmarkModal';
import { BreakEvenModal } from './components/BreakEvenModal';
import { CopySummaryModal } from './components/CopySummaryModal';
import { Check, Info } from 'lucide-react';

const STORAGE_KEY = 'ibx_ecom_pnl_inputs_v1';

export default function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_INPUTS;
  });

  const [hasSavedData, setHasSavedData] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_KEY);
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isCourierModalOpen, setIsCourierModalOpen] = useState(false);
  const [isBreakEvenModalOpen, setIsBreakEvenModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Show a quick transient toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleInputChange = (updates: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  };

  const handleModeToggle = (mode: CalculationMode) => {
    setInputs((prev) => ({ ...prev, calcMode: mode }));
    showToast(`Switched to ${mode === 'actual' ? 'Actual Recorded' : 'Estimated Forecast'} Mode`);
  };

  const handleApplyPreset = (key: string) => {
    const preset = PRESETS[key];
    if (preset) {
      setInputs(preset.data);
      showToast(`Loaded preset: "${preset.name}"`);
    }
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    showToast('Reset all fields to default scenario');
  };

  const handleSaveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
      setHasSavedData(true);
      showToast('Current inputs saved to your browser storage!');
    } catch {
      showToast('Failed to save to local storage.');
    }
  };

  const handleClearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedData(false);
      showToast('Saved inputs cleared from browser.');
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Perform Financial Calculation instantly
  const result = useMemo(() => {
    return calculatePnL(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 transition-all">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Header / Brand & Global Controls */}
        <Header
          inputs={inputs}
          onModeToggle={handleModeToggle}
          onApplyPreset={handleApplyPreset}
          onReset={handleReset}
          onOpenCopyModal={() => setIsCopyModalOpen(true)}
          onPrint={handlePrint}
          onSaveToLocalStorage={handleSaveToLocalStorage}
          onClearLocalStorage={handleClearLocalStorage}
          hasSavedData={hasSavedData}
        />

        {/* Validation warnings / alerts */}
        <ValidationBanner issues={result.issues} />

        {/* 15 Primary KPI Cards Dashboard */}
        <DashboardKPIs
          metrics={result.metrics}
          onOpenBreakEvenModal={() => setIsBreakEvenModalOpen(true)}
        />

        {/* Order Reconciliation Pipeline Flow */}
        <OrderReconciliationCard
          reconciliation={result.reconciliation}
          calcMode={inputs.calcMode}
        />

        {/* Visual Expense Breakdown Waterfall */}
        <ExpenseBreakdownVisual metrics={result.metrics} />

        {/* Unit Economics Per Delivered Parcel */}
        <UnitEconomicsCard
          metrics={result.metrics}
          reconciliation={result.reconciliation}
        />

        {/* Comprehensive P&L Statement Table */}
        <PLTable
          metrics={result.metrics}
          reconciliation={result.reconciliation}
        />

        {/* Input Parameters Form (Organized into Sections A - E) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Calculator Inputs & Assumptions</h2>
              <p className="text-xs text-slate-500">
                All numbers recalculate in real-time. Adjust values below to test profitability.
              </p>
            </div>
          </div>

          <InputSection
            inputs={inputs}
            onChange={handleInputChange}
            onOpenCourierModal={() => setIsCourierModalOpen(true)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">IBX Ecom PnL</span>
            <span>—</span>
            <span>Designed for Pakistani Shopify, WooCommerce & COD Sellers</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Currency: PKR (Rs.)</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsCourierModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-medium hover:underline"
            >
              Courier Rates Guide
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsBreakEvenModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-medium hover:underline"
            >
              Break-Even ROAS Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CourierBenchmarkModal
        isOpen={isCourierModalOpen}
        onClose={() => setIsCourierModalOpen(false)}
      />

      <BreakEvenModal
        isOpen={isBreakEvenModalOpen}
        onClose={() => setIsBreakEvenModalOpen(false)}
      />

      <CopySummaryModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        result={result}
        inputs={inputs}
      />
    </div>
  );
}
