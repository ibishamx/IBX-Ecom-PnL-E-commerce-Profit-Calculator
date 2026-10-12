export function formatPKR(
  val: number | null | undefined,
  options: {
    showSign?: boolean;
    compact?: boolean;
    prefix?: string;
  } = {}
): string {
  if (val === null || val === undefined || isNaN(val)) {
    return '—';
  }

  const { showSign = false, compact = false, prefix = 'Rs. ' } = options;

  const isNegative = val < 0;
  const absVal = Math.abs(val);

  if (compact && absVal >= 10000000) {
    // 1 Crore = 10,000,000
    const crores = (absVal / 10000000).toFixed(2);
    const sign = isNegative ? '-' : showSign && val > 0 ? '+' : '';
    return `${sign}${prefix}${crores} Cr`;
  }

  if (compact && absVal >= 100000) {
    // 1 Lakh = 100,000
    const lakhs = (absVal / 100000).toFixed(2);
    const sign = isNegative ? '-' : showSign && val > 0 ? '+' : '';
    return `${sign}${prefix}${lakhs} Lac`;
  }

  // Format with standard commas (e.g. 1,250,000)
  const formattedAbs = Math.round(absVal).toLocaleString('en-US');
  const sign = isNegative ? '-' : showSign && val > 0 ? '+' : '';

  return `${sign}${prefix}${formattedAbs}`;
}

export function formatPakistaniNotation(val: number): string | null {
  const abs = Math.abs(val);
  if (abs >= 10000000) {
    return `${(val / 10000000).toFixed(2)} Crore`;
  }
  if (abs >= 100000) {
    return `${(val / 100000).toFixed(2)} Lakh`;
  }
  return null;
}

export function formatPct(val: number | null | undefined, decimals = 1): string {
  if (val === null || val === undefined || isNaN(val)) {
    return '—';
  }
  return `${val.toFixed(decimals)}%`;
}

export function formatRatio(val: number | null | undefined, decimals = 2): string {
  if (val === null || val === undefined || isNaN(val)) {
    return '—';
  }
  return `${val.toFixed(decimals)}x`;
}

export function formatOrders(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) {
    return '—';
  }
  return Math.round(val).toLocaleString('en-US');
}
