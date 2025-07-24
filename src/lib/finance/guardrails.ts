import { RetirementInputs } from '@/types/inputs';

export interface GuardrailParams {
  withdrawal: number;
  portfolio: number;
  initialPortfolio: number;
  params: RetirementInputs;
}

export function applyGuardrails({
  withdrawal,
  portfolio,
  initialPortfolio,
  params,
}: GuardrailParams): number {
  let adjustedWithdrawal = withdrawal;
  
  // Cut rule: If portfolio drops below 80% of initial, reduce withdrawal
  if (portfolio < initialPortfolio * 0.8) {
    adjustedWithdrawal = withdrawal * (1 - params.guardrailDrop);
  }
  
  // Raise rule: If portfolio grows above 120% of initial, increase withdrawal
  if (portfolio > initialPortfolio * 1.2) {
    adjustedWithdrawal = withdrawal * (1 + params.guardrailRaise);
  }
  
  // Ensure withdrawal stays within floor and cap bounds
  const minWithdrawal = portfolio * params.floorWR;
  const maxWithdrawal = portfolio * params.capWR;
  
  return Math.max(minWithdrawal, Math.min(maxWithdrawal, adjustedWithdrawal));
}

export function calculateWithdrawalRate(withdrawal: number, portfolio: number): number {
  return portfolio > 0 ? withdrawal / portfolio : 0;
} 