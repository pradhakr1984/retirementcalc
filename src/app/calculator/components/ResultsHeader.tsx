'use client';

import { useCalculatorStore } from '@/lib/store';
import { formatCurrency, formatPercent } from '@/lib/utils/format';

export default function ResultsHeader() {
  const { results } = useCalculatorStore();
  
  if (!results) return null;

  const { deterministic, monteCarlo } = results;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Retirement Summary</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Enough Number */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatLargeNumber(deterministic.enoughNumberToday)}
          </div>
          <div className="text-sm text-gray-600">Enough Number (Today)</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(deterministic.enoughNumberToday)}
          </div>
        </div>

        {/* Gap to Goal */}
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${
            deterministic.gapToGoal > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {deterministic.gapToGoal > 0 ? '+' : ''}{formatLargeNumber(deterministic.gapToGoal)}
          </div>
          <div className="text-sm text-gray-600">Gap to Goal</div>
          <div className="text-xs text-gray-500 mt-1">
            {deterministic.gapToGoal > 0 ? 'Need to save more' : 'On track!'}
          </div>
        </div>

        {/* Success Probability */}
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${
            monteCarlo.successProbability > 0.8 ? 'text-green-600' : 
            monteCarlo.successProbability > 0.6 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {formatPercent(monteCarlo.successProbability)}
          </div>
          <div className="text-sm text-gray-600">Success Probability</div>
          <div className="text-xs text-gray-500 mt-1">
            {monteCarlo.successProbability > 0.8 ? 'Excellent' : 
             monteCarlo.successProbability > 0.6 ? 'Good' : 'Needs attention'}
          </div>
        </div>

        {/* Years to FI */}
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {deterministic.yearsToFI > 0 ? Math.ceil(deterministic.yearsToFI) : 0}
          </div>
          <div className="text-sm text-gray-600">Years to Financial Independence</div>
          <div className="text-xs text-gray-500 mt-1">
            {deterministic.yearsToFI > 0 ? 'Years remaining' : 'Already FI!'}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-8 grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Median Ending Balance</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(monteCarlo.medianEndingBalance)}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Worst Case (5th percentile)</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(monteCarlo.percentile5)}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Best Case (95th percentile)</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(monteCarlo.percentile95)}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 p-4 rounded-xl bg-gray-50">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            monteCarlo.successProbability > 0.8 ? 'bg-green-500' : 
            monteCarlo.successProbability > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <div className="text-sm text-gray-700">
            {monteCarlo.successProbability > 0.8 ? 
              'Your retirement plan looks strong! Consider increasing spending or retiring earlier.' :
              monteCarlo.successProbability > 0.6 ? 
              'Your plan has moderate risk. Consider saving more or retiring later.' :
              'Your plan needs attention. Consider increasing savings or adjusting retirement age.'
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return formatCurrency(value);
} 