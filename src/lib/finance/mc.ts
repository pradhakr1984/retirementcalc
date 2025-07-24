import { RetirementInputs } from '@/types/inputs';
import { SimulationPathResult, SimulationSummary, YearRow } from '@/types/results';
import { generateCorrelatedReturns, calculatePercentiles } from './stats';
import { applyGuardrails } from './guardrails';

export function runMonteCarloSimulation(inputs: RetirementInputs): {
  results: SimulationPathResult[];
  summary: SimulationSummary;
} {
  const results: SimulationPathResult[] = [];
  const endingBalances: number[] = [];
  let worstPathDepletionAge: number | undefined;

  for (let sim = 0; sim < inputs.simulations; sim++) {
    const pathResult = runSingleSimulation(inputs, sim);
    results.push(pathResult);
    
    if (pathResult.depleted) {
      if (!worstPathDepletionAge || pathResult.depletionAge! < worstPathDepletionAge) {
        worstPathDepletionAge = pathResult.depletionAge;
      }
    } else {
      endingBalances.push(pathResult.endingBalance);
    }
  }

  const percentiles = calculatePercentiles(endingBalances);
  const successProbability = endingBalances.length / inputs.simulations;

  const summary: SimulationSummary = {
    successProbability,
    medianEndingBalance: percentiles.median,
    percentile5: percentiles.percentile5,
    percentile25: percentiles.percentile25,
    percentile75: percentiles.percentile75,
    percentile95: percentiles.percentile95,
    worstPathDepletionAge,
    averageEndingBalance: percentiles.average,
    minEndingBalance: percentiles.min,
    maxEndingBalance: percentiles.max,
  };

  return { results, summary };
}

function runSingleSimulation(inputs: RetirementInputs, simIndex: number): SimulationPathResult {
  const path: YearRow[] = [];
  let portfolio = inputs.currentAssets;
  let spend = inputs.annualSpend;
  let cashBucket = inputs.cashBufferYears * inputs.annualSpend;
  let initialPortfolio = portfolio;
  let withdrawal = 0;

  // Growth phase (current age to retirement)
  for (let age = inputs.currentAge; age < inputs.retireAge; age++) {
    const { return: returnRate } = generateCorrelatedReturns(
      inputs.meanReturn,
      inputs.stdevReturn,
      inputs.meanInflation,
      inputs.stdevInflation,
      inputs.corrReturnInflation
    );

    portfolio = portfolio * (1 + returnRate);
    
    path.push({
      age,
      year: age - inputs.currentAge + 1,
      spend: 0,
      income: 0,
      withdrawal: 0,
      portfolio,
      cashBucket,
      withdrawalRate: 0,
    });
  }

  // Set initial withdrawal at retirement
  initialPortfolio = portfolio;
  withdrawal = inputs.initialWR * portfolio;

  // Retirement phase
  for (let age = inputs.retireAge; age <= inputs.planToAge; age++) {
    const { return: returnRate, inflation } = generateCorrelatedReturns(
      inputs.meanReturn,
      inputs.stdevReturn,
      inputs.meanInflation,
      inputs.stdevInflation,
      inputs.corrReturnInflation
    );

    // Inflate spend
    spend = spend * (1 + inflation);

    // Calculate income for this year
    const income = inputs.incomes.reduce((total, income) => {
      if (age >= income.startAge && age <= (income.endAge || inputs.planToAge)) {
        const yearsSinceStart = age - income.startAge;
        return total + (income.amountAnnual * Math.pow(1 + income.cola, yearsSinceStart));
      }
      return total;
    }, 0);

    // Apply guardrails
    withdrawal = applyGuardrails({
      withdrawal,
      portfolio,
      initialPortfolio,
      params: inputs,
    });

    // Calculate needed withdrawal
    const needed = Math.max(spend - income, 0);

    // Take from cash bucket first
    const fromCash = Math.min(needed, cashBucket);
    cashBucket -= fromCash;
    const fromPortfolio = needed - fromCash;

    // Update portfolio
    portfolio = (portfolio - fromPortfolio) * (1 + returnRate);

    // Refill cash bucket if market is good
    if (portfolio > initialPortfolio && cashBucket < inputs.cashBufferYears * inputs.annualSpend) {
      const targetCash = inputs.cashBufferYears * inputs.annualSpend;
      const refill = Math.min(targetCash - cashBucket, portfolio - initialPortfolio);
      cashBucket += refill;
      portfolio -= refill;
    }

    path.push({
      age,
      year: age - inputs.currentAge + 1,
      spend,
      income,
      withdrawal: needed,
      portfolio,
      cashBucket,
      withdrawalRate: withdrawal / portfolio,
    });

    // Check for depletion
    if (portfolio <= 0 && cashBucket <= 0) {
      return {
        depleted: true,
        depletionAge: age,
        endingBalance: 0,
        path,
      };
    }
  }

  return {
    depleted: false,
    endingBalance: portfolio + cashBucket,
    path,
  };
} 