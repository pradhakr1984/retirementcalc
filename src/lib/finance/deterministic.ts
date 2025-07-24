import { RetirementInputs } from '@/types/inputs';
import { DeterministicResult, YearRow } from '@/types/results';

export function calculateDeterministic(inputs: RetirementInputs): DeterministicResult {
  try {
    // Validate critical inputs
    if (inputs.initialWR <= 0) {
      throw new Error('Initial withdrawal rate must be positive');
    }
    
    if (inputs.currentAssets < 0) {
      throw new Error('Current assets cannot be negative');
    }
    
    if (inputs.annualSpend <= 0) {
      throw new Error('Annual spending must be positive');
    }
    
    if (inputs.retireAge <= inputs.currentAge) {
      throw new Error('Retirement age must be after current age');
    }
    
    if (inputs.planToAge <= inputs.retireAge) {
      throw new Error('Plan to age must be after retirement age');
    }
    
    const yearsToRetire = inputs.retireAge - inputs.currentAge;
    const yearsInRetirement = inputs.planToAge - inputs.retireAge;
  
  // Calculate average annual income during retirement
  const totalIncomeYears = inputs.incomes.reduce((sum, income) => {
    const startYear = Math.max(0, income.startAge - inputs.retireAge);
    const endYear = Math.min(yearsInRetirement, (income.endAge || inputs.planToAge) - inputs.retireAge);
    return sum + Math.max(0, endYear - startYear);
  }, 0);
  
  const averageAnnualIncome = inputs.incomes.reduce((sum, income) => {
    const startYear = Math.max(0, income.startAge - inputs.retireAge);
    const endYear = Math.min(yearsInRetirement, (income.endAge || inputs.planToAge) - inputs.retireAge);
    const yearsActive = Math.max(0, endYear - startYear);
    return sum + (income.amountAnnual * yearsActive);
  }, 0) / Math.max(1, totalIncomeYears);

  // Net annual spend in retirement (real)
  const netSpend = inputs.annualSpend - averageAnnualIncome;
  
  // Safe Withdrawal Rate calculation
  const enoughNumberAtRetire = netSpend / inputs.initialWR;
  
  // Discount to today's dollars
  const enoughNumberToday = enoughNumberAtRetire / Math.pow(1 + inputs.meanReturn, yearsToRetire);
  
  // Calculate gap
  const gapToGoal = enoughNumberToday - inputs.currentAssets;
  
  // Calculate years to financial independence
  let yearsToFI = 0;
  if (gapToGoal > 0 && inputs.currentAssets > 0 && inputs.meanReturn !== 0) {
    try {
      yearsToFI = Math.log(1 + (gapToGoal * inputs.meanReturn) / inputs.currentAssets) / Math.log(1 + inputs.meanReturn);
      if (!isFinite(yearsToFI)) {
        yearsToFI = 0;
      }
    } catch (error) {
      console.warn('Error calculating years to FI:', error);
      yearsToFI = 0;
    }
  }

  // Generate year-by-year cash flow table
  const cashflowTable = generateCashflowTable(inputs);

  return {
    enoughNumberToday,
    enoughNumberAtRetire,
    gapToGoal,
    yearsToFI,
    cashflowTable,
  };
  } catch (error) {
    console.error('Error in deterministic calculation:', error);
    throw error;
  }
}

function generateCashflowTable(inputs: RetirementInputs): YearRow[] {
  const table: YearRow[] = [];
  let portfolio = inputs.currentAssets;
  let spend = inputs.annualSpend;
  let cashBucket = inputs.cashBufferYears * inputs.annualSpend;
  
  // Growth phase (current age to retirement)
  for (let age = inputs.currentAge; age < inputs.retireAge; age++) {
    portfolio = portfolio * (1 + inputs.meanReturn);
    table.push({
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

  // Retirement phase
  const initialPortfolio = portfolio;
  let withdrawal = inputs.initialWR * portfolio;
  
  for (let age = inputs.retireAge; age <= inputs.planToAge; age++) {
    // Inflate spend
    spend = spend * (1 + inputs.spendInflation);
    
    // Calculate income for this year
    const income = inputs.incomes.reduce((total, income) => {
      if (age >= income.startAge && age <= (income.endAge || inputs.planToAge)) {
        const yearsSinceStart = age - income.startAge;
        return total + (income.amountAnnual * Math.pow(1 + income.cola, yearsSinceStart));
      }
      return total;
    }, 0);

    // Apply guardrails
    if (portfolio < initialPortfolio * 0.8) {
      withdrawal = withdrawal * (1 - inputs.guardrailDrop);
    } else if (portfolio > initialPortfolio * 1.2) {
      withdrawal = withdrawal * (1 + inputs.guardrailRaise);
    }
    
    // Ensure withdrawal stays within bounds
    const minWithdrawal = portfolio * inputs.floorWR;
    const maxWithdrawal = portfolio * inputs.capWR;
    withdrawal = Math.max(minWithdrawal, Math.min(maxWithdrawal, withdrawal));

    // Calculate needed withdrawal
    const needed = Math.max(spend - income, 0);
    
    // Take from cash bucket first
    const fromCash = Math.min(needed, cashBucket);
    cashBucket -= fromCash;
    const fromPortfolio = needed - fromCash;
    
    // Update portfolio
    portfolio = (portfolio - fromPortfolio) * (1 + inputs.meanReturn);
    
    // Refill cash bucket if market is good
    if (portfolio > initialPortfolio && cashBucket < inputs.cashBufferYears * inputs.annualSpend) {
      const targetCash = inputs.cashBufferYears * inputs.annualSpend;
      const refill = Math.min(targetCash - cashBucket, portfolio - initialPortfolio);
      cashBucket += refill;
      portfolio -= refill;
    }

    table.push({
      age,
      year: age - inputs.currentAge + 1,
      spend,
      income,
      withdrawal: needed,
      portfolio,
      cashBucket,
      withdrawalRate: withdrawal / portfolio,
    });
  }

  return table;
} 