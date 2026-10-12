export type CalculationMode = 'actual' | 'estimated';
export type AdSpendMode = 'total' | 'breakdown';
export type ReportingPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface CalculatorInputs {
  // Mode & Period
  calcMode: CalculationMode;
  reportingPeriod: ReportingPeriod;
  customPeriodLabel?: string;

  // A. Product & Selling Price
  productCostPerUnit: number;
  sellingPricePerOrder: number;
  avgItemsPerOrder: number;

  // Product Cost Recovery on Returns
  returnRestockablePct: number;       // e.g. 80% restockable (0% lost)
  returnPartiallyDamagedPct: number;   // e.g. 15% partially damaged
  partialDamageLossPct: number;        // e.g. 50% unrecoverable loss on damaged items
  returnCompletelyLostPct: number;     // e.g. 5% completely lost/scrapped (100% loss)

  // B. Advertising
  adSpendMode: AdSpendMode;
  totalAdSpend: number;
  metaAdSpend: number;
  tiktokAdSpend: number;
  googleAdSpend: number;
  otherAdSpend: number;

  // C. Shopify Orders
  totalOrders: number;
  cancelledOrders: number;
  dispatchedOrders: number;
  deliveredOrders: number | null; // optional in actual mode
  returnedOrders: number;
  expectedReturnRate: number;     // % (e.g. 20%)

  // D. Courier & Packing Costs
  courierChargePerParcel: number;
  packingCostPerParcel: number;
  additionalPackagingCost: number;
  otherBusinessExpenses: number;

  // E. Tax
  taxRate: number; // default 4%
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
}

export interface OrderReconciliation {
  totalOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  dispatchedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  expectedDeliveries: number;
  expectedReturns: number;
  effectiveDelivered: number;
  effectiveReturned: number;
  unaccountedOrders: number;
}

export interface ReturnCostBreakdown {
  totalReturnedParcels: number;
  restockableUnits: number;
  partiallyDamagedUnits: number;
  completelyLostUnits: number;
  unrecoverableCost: number;
}

export interface FinancialMetrics {
  // Revenue
  grossPotentialRevenue: number;
  netSalesRevenue: number;

  // Direct Product Costs
  productCostSuccessfulSales: number;
  unrecoverableReturnedCost: number;
  totalProductCost: number;
  returnBreakdown: ReturnCostBreakdown;

  // Operating Expenses
  advertisingExpense: number;
  courierExpense: number;
  packingExpense: number;
  taxExpense: number;
  otherExpenses: number;
  totalOperatingExpenses: number; // Ads + Courier + Packing + Tax + Other
  totalAllExpenses: number;        // Product Costs + Operating Expenses

  // Net Profit & Bottom Line
  netProfit: number;
  isProfitable: boolean;

  // KPIs
  profitMarginPct: number | null;
  roas: number | null;
  cpa: number | null;
  returnRatePct: number | null;
  cancellationRatePct: number | null;
  deliverySuccessRatePct: number | null;
  breakEvenRoas: number | null;
  breakEvenRoasExplanation: string;

  // Unit Economics (per successfully delivered parcel)
  revenuePerDelivered: number;
  productCostPerDelivered: number;
  courierPerDelivered: number;
  packingPerDelivered: number;
  adSpendPerDelivered: number;
  taxPerDelivered: number;
  overheadPerDelivered: number;
  netProfitPerDelivered: number;
}

export interface CalculationResult {
  hasInputs: boolean;
  reconciliation: OrderReconciliation;
  metrics: FinancialMetrics;
  issues: ValidationIssue[];
}
