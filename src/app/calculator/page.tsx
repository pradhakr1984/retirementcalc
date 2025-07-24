'use client';

import { useEffect } from 'react';
import { useCalculatorStore } from '@/lib/store';
import InputForm from './components/InputForm';
import ResultsHeader from './components/ResultsHeader';
import ChartsPanel from './components/ChartsPanel';

export default function CalculatorPage() {
  const { calculate, results, isLoading, error } = useCalculatorStore();

  useEffect(() => {
    // Auto-calculate on first load
    if (!results) {
      calculate();
    }
  }, [calculate, results]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Retirement Calculator
            </h1>
            <p className="text-gray-600">
              Enter your information below to calculate your retirement &quot;enough number&quot;
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Calculation Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <InputForm />
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Calculating...</span>
                  </div>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <ResultsHeader />
                  <ChartsPanel />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
                  Enter your information and click calculate to see results
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 