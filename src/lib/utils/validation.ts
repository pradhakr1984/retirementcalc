import { RetirementInputs } from '@/types/inputs';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateRetirementInputs(inputs: RetirementInputs): ValidationResult {
  const errors: ValidationError[] = [];

  // Age validations
  if (inputs.currentAge < 18 || inputs.currentAge > 100) {
    errors.push({ field: 'currentAge', message: 'Current age must be between 18 and 100' });
  }

  if (inputs.retireAge < inputs.currentAge || inputs.retireAge > 100) {
    errors.push({ field: 'retireAge', message: 'Retirement age must be after current age and under 100' });
  }

  if (inputs.planToAge < inputs.retireAge || inputs.planToAge > 120) {
    errors.push({ field: 'planToAge', message: 'Plan to age must be after retirement age and under 120' });
  }

  // Financial validations
  if (inputs.currentAssets < 0) {
    errors.push({ field: 'currentAssets', message: 'Current assets cannot be negative' });
  }

  if (inputs.annualSpend <= 0) {
    errors.push({ field: 'annualSpend', message: 'Annual spending must be positive' });
  }

  if (inputs.meanReturn <= -1 || inputs.meanReturn > 1) {
    errors.push({ field: 'meanReturn', message: 'Mean return must be between -100% and 100%' });
  }

  if (inputs.stdevReturn < 0 || inputs.stdevReturn > 1) {
    errors.push({ field: 'stdevReturn', message: 'Return standard deviation must be between 0% and 100%' });
  }

  if (inputs.spendInflation < -0.5 || inputs.spendInflation > 1) {
    errors.push({ field: 'spendInflation', message: 'Spending inflation must be between -50% and 100%' });
  }

  if (inputs.meanInflation < -0.5 || inputs.meanInflation > 1) {
    errors.push({ field: 'meanInflation', message: 'Mean inflation must be between -50% and 100%' });
  }

  if (inputs.stdevInflation < 0 || inputs.stdevInflation > 1) {
    errors.push({ field: 'stdevInflation', message: 'Inflation standard deviation must be between 0% and 100%' });
  }

  if (inputs.corrReturnInflation < -1 || inputs.corrReturnInflation > 1) {
    errors.push({ field: 'corrReturnInflation', message: 'Return-inflation correlation must be between -1 and 1' });
  }

  // Withdrawal rate validations
  if (inputs.initialWR <= 0 || inputs.initialWR > 1) {
    errors.push({ field: 'initialWR', message: 'Initial withdrawal rate must be between 0% and 100%' });
  }

  if (inputs.floorWR < 0 || inputs.floorWR > 1) {
    errors.push({ field: 'floorWR', message: 'Floor withdrawal rate must be between 0% and 100%' });
  }

  if (inputs.capWR <= 0 || inputs.capWR > 1) {
    errors.push({ field: 'capWR', message: 'Cap withdrawal rate must be between 0% and 100%' });
  }

  if (inputs.floorWR >= inputs.capWR) {
    errors.push({ field: 'floorWR', message: 'Floor withdrawal rate must be less than cap withdrawal rate' });
  }

  // Guardrail validations
  if (inputs.guardrailDrop < 0 || inputs.guardrailDrop > 1) {
    errors.push({ field: 'guardrailDrop', message: 'Guardrail drop must be between 0% and 100%' });
  }

  if (inputs.guardrailRaise < 0 || inputs.guardrailRaise > 1) {
    errors.push({ field: 'guardrailRaise', message: 'Guardrail raise must be between 0% and 100%' });
  }

  // Cash buffer validations
  if (inputs.cashBufferYears < 0 || inputs.cashBufferYears > 10) {
    errors.push({ field: 'cashBufferYears', message: 'Cash buffer years must be between 0 and 10' });
  }

  // Income validations
  if (inputs.incomes) {
    inputs.incomes.forEach((income, index) => {
      if (income.amountAnnual < 0) {
        errors.push({ field: `incomes[${index}].amountAnnual`, message: 'Income amount cannot be negative' });
      }
      if (income.startAge < inputs.currentAge) {
        errors.push({ field: `incomes[${index}].startAge`, message: 'Income start age cannot be before current age' });
      }
      if (income.endAge && income.endAge < income.startAge) {
        errors.push({ field: `incomes[${index}].endAge`, message: 'Income end age cannot be before start age' });
      }
      if (income.cola < -0.5 || income.cola > 1) {
        errors.push({ field: `incomes[${index}].cola`, message: 'COLA must be between -50% and 100%' });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeInputs(inputs: RetirementInputs): RetirementInputs {
  return {
    ...inputs,
    currentAssets: Math.max(0, inputs.currentAssets),
    annualSpend: Math.max(0.01, inputs.annualSpend),
    meanReturn: Math.max(-0.99, Math.min(0.99, inputs.meanReturn)),
    stdevReturn: Math.max(0, Math.min(0.99, inputs.stdevReturn)),
    spendInflation: Math.max(-0.5, Math.min(0.99, inputs.spendInflation)),
    meanInflation: Math.max(-0.5, Math.min(0.99, inputs.meanInflation)),
    stdevInflation: Math.max(0, Math.min(0.99, inputs.stdevInflation)),
    corrReturnInflation: Math.max(-1, Math.min(1, inputs.corrReturnInflation)),
    initialWR: Math.max(0.001, Math.min(0.99, inputs.initialWR)),
    floorWR: Math.max(0, Math.min(0.99, inputs.floorWR)),
    capWR: Math.max(0.001, Math.min(0.99, inputs.capWR)),
    guardrailDrop: Math.max(0, Math.min(0.99, inputs.guardrailDrop)),
    guardrailRaise: Math.max(0, Math.min(0.99, inputs.guardrailRaise)),
    cashBufferYears: Math.max(0, Math.min(10, inputs.cashBufferYears)),
    incomes: inputs.incomes?.map(income => ({
      ...income,
      amountAnnual: Math.max(0, income.amountAnnual),
      startAge: Math.max(inputs.currentAge, income.startAge),
      endAge: income.endAge ? Math.max(income.startAge, income.endAge) : undefined,
      cola: Math.max(-0.5, Math.min(0.99, income.cola))
    })) || []
  };
} 