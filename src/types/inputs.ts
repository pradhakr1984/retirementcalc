import { z } from 'zod';

export interface RetirementInputs {
  // Timing
  currentAge: number;
  retireAge: number;
  planToAge: number;

  // Spending (annual, today's dollars)
  annualSpend: number;
  spendInflation: number;

  // Guaranteed incomes
  incomes: Array<{
    name: string;
    startAge: number;
    endAge?: number;
    amountAnnual: number;
    cola: number;
  }>;

  // Assets & return assumptions
  currentAssets: number;
  meanReturn: number;
  stdevReturn: number;
  meanInflation: number;
  stdevInflation: number;
  corrReturnInflation: number;

  // Withdrawal strategy
  initialWR: number;
  floorWR: number;
  capWR: number;
  guardrailDrop: number;
  guardrailRaise: number;

  // Cash buffer
  cashBufferYears: number;

  // Taxes
  effectiveTaxRate: number;

  // Simulation
  simulations: number;
  seed?: number;
}

export const RetirementInputsSchema = z.object({
  currentAge: z.number().min(18).max(90),
  retireAge: z.number().min(30).max(90),
  planToAge: z.number().min(70).max(110),
  annualSpend: z.number().positive(),
  spendInflation: z.number().min(0).max(0.2),
  incomes: z.array(z.object({
    name: z.string().min(1),
    startAge: z.number().min(0).max(100),
    endAge: z.number().min(0).max(110).optional(),
    amountAnnual: z.number().min(0),
    cola: z.number().min(0).max(0.2),
  })),
  currentAssets: z.number().min(0),
  meanReturn: z.number().min(0).max(0.3),
  stdevReturn: z.number().min(0.01).max(0.5),
  meanInflation: z.number().min(0).max(0.2),
  stdevInflation: z.number().min(0.001).max(0.1),
  corrReturnInflation: z.number().min(-1).max(1),
  initialWR: z.number().min(0.01).max(0.2),
  floorWR: z.number().min(0.01).max(0.2),
  capWR: z.number().min(0.01).max(0.2),
  guardrailDrop: z.number().min(0).max(0.5),
  guardrailRaise: z.number().min(0).max(0.5),
  cashBufferYears: z.number().min(0).max(10),
  effectiveTaxRate: z.number().min(0).max(1),
  simulations: z.number().min(100).max(10000),
  seed: z.number().optional(),
});

export const defaultInputs: RetirementInputs = {
  currentAge: 42,
  retireAge: 60,
  planToAge: 95,
  annualSpend: 180000,
  spendInflation: 0.025,
  incomes: [
    {
      name: "Social Security",
      startAge: 67,
      amountAnnual: 48000,
      cola: 0.025,
    }
  ],
  currentAssets: 2000000,
  meanReturn: 0.065,
  stdevReturn: 0.12,
  meanInflation: 0.025,
  stdevInflation: 0.01,
  corrReturnInflation: -0.2,
  initialWR: 0.04,
  floorWR: 0.03,
  capWR: 0.06,
  guardrailDrop: 0.1,
  guardrailRaise: 0.05,
  cashBufferYears: 2,
  effectiveTaxRate: 0.18,
  simulations: 1000,
}; 