import {
  CalculatorInputs,
  CalculationResult,
  OrderReconciliation,
  FinancialMetrics,
  ReturnCostBreakdown,
  ValidationIssue,
} from '../types/calculator';

export const DEFAULT_INPUTS: CalculatorInputs = {
  calcMode: 'actual',
  reportingPeriod: 'monthly',
  customPeriodLabel: '',

  // A. Product & Selling Price
  productCostPerUnit: 1100,
  sellingPricePerOrder: 3499,
  avgItemsPerOrder: 1,

  // Return Inventory Recovery
  returnRestockablePct: 80,
  returnPartiallyDamagedPct: 15,
  partialDamageLossPct: 50,
  returnCompletelyLostPct: 5,

  // B. Advertising
  adSpendMode: 'breakdown',
  totalAdSpend: 175000,
  metaAdSpend: 130000,
  tiktokAdSpend: 45000,
  googleAdSpend: 0,
  otherAdSpend: 0,

  // C. Shopify Orders
  totalOrders: 320,
  cancelledOrders: 40,
  dispatchedOrders: 270,
  deliveredOrders: 205, // optional in actual mode
  returnedOrders: 65,
  expectedReturnRate: 24, // %

  // D. Courier & Packing
  courierChargePerParcel: 270,
  packingCostPerParcel: 65,
  additionalPackagingCost: 5000,
  otherBusinessExpenses: 25000,

  // E. Tax
  taxRate: 4,
};

export const PRESETS: Record<string, { name: string; description: string; data: CalculatorInputs }> = {
  typicalBrand: {
    name: 'Branded D2C / High-Ticket',
    description: 'Rs. 3,500 selling price, 24% return rate, Meta & TikTok spend',
    data: {
      ...DEFAULT_INPUTS,
    },
  },
  lowTicketImpulse: {
    name: 'Low-Ticket Impulse Buy (Jewelry / Trend)',
    description: 'Rs. 1,699 selling price, Rs. 450 COGS, 32% return rate',
    data: {
      calcMode: 'actual',
      reportingPeriod: 'monthly',
      productCostPerUnit: 450,
      sellingPricePerOrder: 1699,
      avgItemsPerOrder: 1,
      returnRestockablePct: 75,
      returnPartiallyDamagedPct: 15,
      partialDamageLossPct: 60,
      returnCompletelyLostPct: 10,
      adSpendMode: 'breakdown',
      totalAdSpend: 190000,
      metaAdSpend: 140000,
      tiktokAdSpend: 50000,
      googleAdSpend: 0,
      otherAdSpend: 0,
      totalOrders: 500,
      cancelledOrders: 75,
      dispatchedOrders: 420,
      deliveredOrders: 285,
      returnedOrders: 135,
      expectedReturnRate: 32,
      courierChargePerParcel: 240,
      packingCostPerParcel: 45,
      additionalPackagingCost: 4000,
      otherBusinessExpenses: 20000,
      taxRate: 4,
    },
  },
  gadgetsTech: {
    name: 'Gadgets & Tech Accessories',
    description: 'Rs. 2,599 selling price, Rs. 920 COGS, 18% return rate',
    data: {
      calcMode: 'actual',
      reportingPeriod: 'monthly',
      productCostPerUnit: 920,
      sellingPricePerOrder: 2599,
      avgItemsPerOrder: 1.1,
      returnRestockablePct: 85,
      returnPartiallyDamagedPct: 10,
      partialDamageLossPct: 40,
      returnCompletelyLostPct: 5,
      adSpendMode: 'breakdown',
      totalAdSpend: 145000,
      metaAdSpend: 110000,
      tiktokAdSpend: 35000,
      googleAdSpend: 0,
      otherAdSpend: 0,
      totalOrders: 260,
      cancelledOrders: 25,
      dispatchedOrders: 230,
      deliveredOrders: 188,
      returnedOrders: 42,
      expectedReturnRate: 18,
      courierChargePerParcel: 260,
      packingCostPerParcel: 60,
      additionalPackagingCost: 3500,
      otherBusinessExpenses: 18000,
      taxRate: 4,
    },
  },
  blank: {
    name: 'Zero State / Blank Canvas',
    description: 'Start fresh with blank inputs',
    data: {
      calcMode: 'actual',
      reportingPeriod: 'daily',
      productCostPerUnit: 0,
      sellingPricePerOrder: 0,
      avgItemsPerOrder: 1,
      returnRestockablePct: 80,
      returnPartiallyDamagedPct: 15,
      partialDamageLossPct: 50,
      returnCompletelyLostPct: 5,
      adSpendMode: 'total',
      totalAdSpend: 0,
      metaAdSpend: 0,
      tiktokAdSpend: 0,
      googleAdSpend: 0,
      otherAdSpend: 0,
      totalOrders: 0,
      cancelledOrders: 0,
      dispatchedOrders: 0,
      deliveredOrders: null,
      returnedOrders: 0,
      expectedReturnRate: 20,
      courierChargePerParcel: 250,
      packingCostPerParcel: 50,
      additionalPackagingCost: 0,
      otherBusinessExpenses: 0,
      taxRate: 4,
    },
  },
};

export function calculatePnL(inputs: CalculatorInputs): CalculationResult {
  const issues: ValidationIssue[] = [];

  // 1. Check if any meaningful input exists
  const hasOrders = inputs.totalOrders > 0 || inputs.dispatchedOrders > 0;
  const hasFinancials = inputs.sellingPricePerOrder > 0 || inputs.productCostPerUnit > 0 || inputs.totalAdSpend > 0;
  const hasInputs = hasOrders || hasFinancials;

  // Sanitize non-negative inputs
  const totalOrders = Math.max(0, inputs.totalOrders || 0);
  const cancelledOrders = Math.max(0, inputs.cancelledOrders || 0);
  const dispatchedOrders = Math.max(0, inputs.dispatchedOrders || 0);
  const userDeliveredOrders = inputs.deliveredOrders !== null && inputs.deliveredOrders !== undefined && !isNaN(inputs.deliveredOrders)
    ? Math.max(0, inputs.deliveredOrders)
    : null;
  const returnedOrders = Math.max(0, inputs.returnedOrders || 0);
  const expectedReturnRate = Math.max(0, Math.min(100, inputs.expectedReturnRate || 0));

  const productCostPerUnit = Math.max(0, inputs.productCostPerUnit || 0);
  const sellingPricePerOrder = Math.max(0, inputs.sellingPricePerOrder || 0);
  const avgItemsPerOrder = Math.max(0.1, inputs.avgItemsPerOrder || 1);

  const courierChargePerParcel = Math.max(0, inputs.courierChargePerParcel || 0);
  const packingCostPerParcel = Math.max(0, inputs.packingCostPerParcel || 0);
  const additionalPackagingCost = Math.max(0, inputs.additionalPackagingCost || 0);
  const otherBusinessExpenses = Math.max(0, inputs.otherBusinessExpenses || 0);
  const taxRate = Math.max(0, inputs.taxRate || 0);

  // 2. Order Reconciliation & Conflict Validations
  if (cancelledOrders + dispatchedOrders > totalOrders && totalOrders > 0) {
    issues.push({
      type: 'warning',
      message: `Cancelled (${cancelledOrders}) + Dispatched (${dispatchedOrders}) = ${cancelledOrders + dispatchedOrders}, exceeding Total Shopify Orders (${totalOrders}).`,
      field: 'totalOrders',
    });
  }

  const pendingOrders = Math.max(0, totalOrders - cancelledOrders - dispatchedOrders);

  // Estimated mode calculations
  const expectedReturns = (dispatchedOrders * expectedReturnRate) / 100;
  const expectedDeliveries = Math.max(0, dispatchedOrders - expectedReturns);

  let effectiveDelivered = 0;
  let effectiveReturned = 0;

  if (inputs.calcMode === 'estimated') {
    effectiveDelivered = expectedDeliveries;
    effectiveReturned = expectedReturns;
  } else {
    // Actual mode
    if (userDeliveredOrders !== null) {
      effectiveDelivered = userDeliveredOrders;
      effectiveReturned = returnedOrders;

      if (userDeliveredOrders + returnedOrders > dispatchedOrders && dispatchedOrders > 0) {
        issues.push({
          type: 'warning',
          message: `Delivered (${userDeliveredOrders}) + Returned (${returnedOrders}) = ${userDeliveredOrders + returnedOrders}, which is greater than Dispatched parcels (${dispatchedOrders}).`,
          field: 'deliveredOrders',
        });
      } else if (userDeliveredOrders + returnedOrders < dispatchedOrders && dispatchedOrders > 0) {
        const inTransit = dispatchedOrders - (userDeliveredOrders + returnedOrders);
        issues.push({
          type: 'info',
          message: `${inTransit} parcel(s) are currently in-transit or unresolved between courier delivery and return status.`,
        });
      }
    } else {
      // Delivered orders omitted: derive from Dispatched - Returned
      effectiveReturned = returnedOrders;
      effectiveDelivered = Math.max(0, dispatchedOrders - returnedOrders);
    }
  }

  // Check return inventory recovery percentages
  const totalRecoveryPct = inputs.returnRestockablePct + inputs.returnPartiallyDamagedPct + inputs.returnCompletelyLostPct;
  if (Math.abs(totalRecoveryPct - 100) > 1) {
    issues.push({
      type: 'warning',
      message: `Return inventory breakdown (${inputs.returnRestockablePct}% restockable + ${inputs.returnPartiallyDamagedPct}% damaged + ${inputs.returnCompletelyLostPct}% lost = ${totalRecoveryPct}%) should add up to 100%.`,
      field: 'returnRestockablePct',
    });
  }

  // 3. Advertising Spend Calculation (prevent double counting)
  let totalAdSpend = 0;
  if (inputs.adSpendMode === 'breakdown') {
    totalAdSpend =
      Math.max(0, inputs.metaAdSpend || 0) +
      Math.max(0, inputs.tiktokAdSpend || 0) +
      Math.max(0, inputs.googleAdSpend || 0) +
      Math.max(0, inputs.otherAdSpend || 0);
  } else {
    totalAdSpend = Math.max(0, inputs.totalAdSpend || 0);
  }

  // 4. Financial Calculations

  // Revenue
  const grossPotentialRevenue = totalOrders * sellingPricePerOrder;
  const netSalesRevenue = effectiveDelivered * sellingPricePerOrder;

  // Direct Product Costs
  const productCostSuccessfulSales = effectiveDelivered * productCostPerUnit * avgItemsPerOrder;

  // Return Inventory Loss Calculation
  // Only unrecoverable inventory should be expensed!
  const totalReturnedParcels = effectiveReturned;
  const totalReturnedItems = totalReturnedParcels * avgItemsPerOrder;

  const restockablePct = Math.max(0, inputs.returnRestockablePct) / 100;
  const partiallyDamagedPct = Math.max(0, inputs.returnPartiallyDamagedPct) / 100;
  const partialDamageLossPct = Math.max(0, inputs.partialDamageLossPct) / 100;
  const completelyLostPct = Math.max(0, inputs.returnCompletelyLostPct) / 100;

  const restockableUnits = totalReturnedItems * restockablePct;
  const partiallyDamagedUnits = totalReturnedItems * partiallyDamagedPct;
  const completelyLostUnits = totalReturnedItems * completelyLostPct;

  // Damage cost: partial loss fraction * cost per unit
  const damagedCostLoss = partiallyDamagedUnits * productCostPerUnit * partialDamageLossPct;
  // Lost cost: 100% cost per unit
  const completelyLostCostLoss = completelyLostUnits * productCostPerUnit;
  const unrecoverableReturnedCost = damagedCostLoss + completelyLostCostLoss;

  const totalProductCost = productCostSuccessfulSales + unrecoverableReturnedCost;

  const returnBreakdown: ReturnCostBreakdown = {
    totalReturnedParcels,
    restockableUnits,
    partiallyDamagedUnits,
    completelyLostUnits,
    unrecoverableCost: unrecoverableReturnedCost,
  };

  // Advertising Expense
  const advertisingExpense = totalAdSpend;

  // Courier Expense
  // Charged exactly once per dispatched parcel. No double return charge.
  const courierExpense = dispatchedOrders * courierChargePerParcel;

  // Packing Expense
  // Incurred for every parcel dispatched + additional bulk packaging costs
  const packingExpense = dispatchedOrders * packingCostPerParcel + additionalPackagingCost;

  // Tax Expense
  // Apply rate ONLY to successfully delivered parcels.
  const taxExpense = (effectiveDelivered * sellingPricePerOrder * taxRate) / 100;

  // Other Expenses
  const otherExpenses = otherBusinessExpenses;

  // Total Operating Expenses (Logistics, Marketing, Tax & Overheads)
  const totalOperatingExpenses = advertisingExpense + courierExpense + packingExpense + taxExpense + otherExpenses;

  // Total All Expenses (COGS + Operating Expenses)
  const totalAllExpenses = totalProductCost + totalOperatingExpenses;

  // Net Profit / Loss
  const netProfit = netSalesRevenue - totalAllExpenses;
  const isProfitable = netProfit > 0;

  // KPIs
  const profitMarginPct = netSalesRevenue > 0 ? (netProfit / netSalesRevenue) * 100 : null;
  const roas = advertisingExpense > 0 ? netSalesRevenue / advertisingExpense : null;
  const cpa = effectiveDelivered > 0 ? advertisingExpense / effectiveDelivered : null;
  const returnRatePct = dispatchedOrders > 0 ? (effectiveReturned / dispatchedOrders) * 100 : null;
  const cancellationRatePct = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : null;
  const deliverySuccessRatePct = dispatchedOrders > 0 ? (effectiveDelivered / dispatchedOrders) * 100 : null;

  // Break-Even ROAS Calculation
  // Contribution Margin before Ad Spend = Net Sales Revenue - (Total Product Cost + Courier + Packing + Tax + Other)
  const nonAdExpenses = productCostSuccessfulSales + unrecoverableReturnedCost + courierExpense + packingExpense + taxExpense + otherExpenses;
  const contributionMarginBeforeAds = netSalesRevenue - nonAdExpenses;

  let breakEvenRoas: number | null = null;
  let breakEvenRoasExplanation = '';

  if (effectiveDelivered === 0 || netSalesRevenue === 0) {
    breakEvenRoas = null;
    breakEvenRoasExplanation = 'Requires successfully delivered orders and positive sales revenue.';
  } else if (contributionMarginBeforeAds <= 0) {
    breakEvenRoas = null;
    breakEvenRoasExplanation =
      'Negative contribution margin before advertising. Costs (product, courier, packing, tax, overheads) exceed net revenue even with Rs. 0 ad spend. Break-even cannot be reached until pricing or operational costs improve.';
  } else {
    breakEvenRoas = netSalesRevenue / contributionMarginBeforeAds;
    const marginPct = ((contributionMarginBeforeAds / netSalesRevenue) * 100).toFixed(1);
    breakEvenRoasExplanation = `Pre-ad contribution margin is Rs. ${Math.round(contributionMarginBeforeAds).toLocaleString()} (${marginPct}% of net sales). You need a minimum ROAS of ${breakEvenRoas.toFixed(2)}x just to cover product, courier, packing, tax, and overhead costs.`;
  }

  // Unit Economics per delivered parcel
  const safeDelivered = effectiveDelivered > 0 ? effectiveDelivered : 1;
  const revenuePerDelivered = effectiveDelivered > 0 ? sellingPricePerOrder : 0;
  const productCostPerDelivered = effectiveDelivered > 0 ? (productCostSuccessfulSales + unrecoverableReturnedCost) / safeDelivered : 0;
  const courierPerDelivered = effectiveDelivered > 0 ? courierExpense / safeDelivered : 0;
  const packingPerDelivered = effectiveDelivered > 0 ? packingExpense / safeDelivered : 0;
  const adSpendPerDelivered = effectiveDelivered > 0 ? advertisingExpense / safeDelivered : 0;
  const taxPerDelivered = effectiveDelivered > 0 ? taxExpense / safeDelivered : 0;
  const overheadPerDelivered = effectiveDelivered > 0 ? otherExpenses / safeDelivered : 0;
  const netProfitPerDelivered = effectiveDelivered > 0 ? netProfit / safeDelivered : 0;

  const reconciliation: OrderReconciliation = {
    totalOrders,
    cancelledOrders,
    pendingOrders,
    dispatchedOrders,
    deliveredOrders: userDeliveredOrders ?? effectiveDelivered,
    returnedOrders,
    expectedDeliveries,
    expectedReturns,
    effectiveDelivered,
    effectiveReturned,
    unaccountedOrders: Math.max(0, dispatchedOrders - (effectiveDelivered + effectiveReturned)),
  };

  const metrics: FinancialMetrics = {
    grossPotentialRevenue,
    netSalesRevenue,
    productCostSuccessfulSales,
    unrecoverableReturnedCost,
    totalProductCost,
    returnBreakdown,
    advertisingExpense,
    courierExpense,
    packingExpense,
    taxExpense,
    otherExpenses,
    totalOperatingExpenses,
    totalAllExpenses,
    netProfit,
    isProfitable,
    profitMarginPct,
    roas,
    cpa,
    returnRatePct,
    cancellationRatePct,
    deliverySuccessRatePct,
    breakEvenRoas,
    breakEvenRoasExplanation,
    revenuePerDelivered,
    productCostPerDelivered,
    courierPerDelivered,
    packingPerDelivered,
    adSpendPerDelivered,
    taxPerDelivered,
    overheadPerDelivered,
    netProfitPerDelivered,
  };

  return {
    hasInputs,
    reconciliation,
    metrics,
    issues,
  };
}
