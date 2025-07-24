export interface YearRow {
  age: number;
  year: number;
  spend: number;
  income: number;
  withdrawal: number;
  portfolio: number;
  cashBucket: number;
  withdrawalRate: number;
}

export interface SimulationPathResult {
  depleted: boolean;
  depletionAge?: number;
  endingBalance: number;
  path: YearRow[];
}

export interface SimulationSummary {
  successProbability: number;
  medianEndingBalance: number;
  percentile5: number;
  percentile25: number;
  percentile75: number;
  percentile95: number;
  worstPathDepletionAge?: number;
  averageEndingBalance: number;
  minEndingBalance: number;
  maxEndingBalance: number;
}

export interface DeterministicResult {
  enoughNumberToday: number;
  enoughNumberAtRetire: number;
  gapToGoal: number;
  yearsToFI: number;
  cashflowTable: YearRow[];
}

export interface CalculationResults {
  deterministic: DeterministicResult;
  monteCarlo: SimulationSummary;
  allPaths: SimulationPathResult[];
} 