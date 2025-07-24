export function generateCorrelatedReturns(
  meanReturn: number,
  stdevReturn: number,
  meanInflation: number,
  stdevInflation: number,
  correlation: number
): { return: number; inflation: number } {
  // Generate two standard normal random variables
  const z1 = generateNormalRandom();
  const z2 = generateNormalRandom();

  // Apply Cholesky decomposition to impose correlation
  const r = z1;
  const i = correlation * z1 + Math.sqrt(1 - correlation * correlation) * z2;

  // Transform to returns and inflation
  const returnValue = meanReturn + stdevReturn * r;
  const inflation = meanInflation + stdevInflation * i;

  return { return: returnValue, inflation };
}

function generateNormalRandom(): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function calculatePercentiles(values: number[]): {
  min: number;
  percentile5: number;
  percentile25: number;
  median: number;
  percentile75: number;
  percentile95: number;
  max: number;
  average: number;
} {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  return {
    min: sorted[0],
    percentile5: sorted[Math.floor(n * 0.05)],
    percentile25: sorted[Math.floor(n * 0.25)],
    median: sorted[Math.floor(n * 0.5)],
    percentile75: sorted[Math.floor(n * 0.75)],
    percentile95: sorted[Math.floor(n * 0.95)],
    max: sorted[n - 1],
    average: sorted.reduce((sum, val) => sum + val, 0) / n,
  };
} 