'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/lib/store';
import { formatCurrency, formatPercent } from '@/lib/utils/format';

export default function InputForm() {
  const { inputs, updateInputs, calculate } = useCalculatorStore();
  const [activeSection, setActiveSection] = useState('timing');

  const sections = [
    { id: 'timing', title: 'Timing', icon: '📅' },
    { id: 'spending', title: 'Spending', icon: '💰' },
    { id: 'income', title: 'Income Sources', icon: '🏦' },
    { id: 'assets', title: 'Assets & Returns', icon: '📈' },
    { id: 'withdrawal', title: 'Withdrawal Strategy', icon: '⚙️' },
    { id: 'advanced', title: 'Advanced', icon: '🔧' },
  ];

  const handleInputChange = (field: string, value: number) => {
    updateInputs({ [field]: value });
  };

  const handleIncomeChange = (index: number, field: string, value: any) => {
    const newIncomes = [...inputs.incomes];
    newIncomes[index] = { ...newIncomes[index], [field]: value };
    updateInputs({ incomes: newIncomes });
  };

  const addIncome = () => {
    updateInputs({
      incomes: [
        ...inputs.incomes,
        {
          name: 'Additional Income',
          startAge: 65,
          amountAnnual: 0,
          cola: 0.025,
        },
      ],
    });
  };

  const removeIncome = (index: number) => {
    const newIncomes = inputs.incomes.filter((_, i) => i !== index);
    updateInputs({ incomes: newIncomes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Input Parameters</h2>
        
        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {section.icon} {section.title}
            </button>
          ))}
        </div>

        {/* Timing Section */}
        {activeSection === 'timing' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Age
              </label>
              <input
                type="number"
                value={inputs.currentAge}
                onChange={(e) => handleInputChange('currentAge', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="18"
                max="90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retirement Age
              </label>
              <input
                type="number"
                value={inputs.retireAge}
                onChange={(e) => handleInputChange('retireAge', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="30"
                max="90"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan To Age
              </label>
              <input
                type="number"
                value={inputs.planToAge}
                onChange={(e) => handleInputChange('planToAge', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="70"
                max="110"
              />
            </div>
          </div>
        )}

        {/* Spending Section */}
        {activeSection === 'spending' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Spending (today's dollars)
              </label>
              <input
                type="number"
                value={inputs.annualSpend}
                onChange={(e) => handleInputChange('annualSpend', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(inputs.annualSpend)} per year
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spending Inflation Rate
              </label>
              <input
                type="number"
                step="0.001"
                value={inputs.spendInflation}
                onChange={(e) => handleInputChange('spendInflation', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="0.2"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formatPercent(inputs.spendInflation)} per year
              </p>
            </div>
          </div>
        )}

        {/* Income Sources Section */}
        {activeSection === 'income' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Income Sources</h3>
              <button
                onClick={addIncome}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                + Add Income
              </button>
            </div>
            
            {inputs.incomes.map((income, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Income Source {index + 1}</h4>
                  {inputs.incomes.length > 1 && (
                    <button
                      onClick={() => removeIncome(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={income.name}
                    onChange={(e) => handleIncomeChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Age
                    </label>
                    <input
                      type="number"
                      value={income.startAge}
                      onChange={(e) => handleIncomeChange(index, 'startAge', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Amount
                    </label>
                    <input
                      type="number"
                      value={income.amountAnnual}
                      onChange={(e) => handleIncomeChange(index, 'amountAnnual', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    COLA Rate
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={income.cola}
                    onChange={(e) => handleIncomeChange(index, 'cola', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="0.2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formatPercent(income.cola)} per year
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Assets & Returns Section */}
        {activeSection === 'assets' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Assets
              </label>
              <input
                type="number"
                value={inputs.currentAssets}
                onChange={(e) => handleInputChange('currentAssets', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(inputs.currentAssets)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mean Return
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.meanReturn}
                  onChange={(e) => handleInputChange('meanReturn', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="0.3"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatPercent(inputs.meanReturn)} per year
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Std Dev
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.stdevReturn}
                  onChange={(e) => handleInputChange('stdevReturn', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.01"
                  max="0.5"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatPercent(inputs.stdevReturn)} per year
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mean Inflation
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.meanInflation}
                  onChange={(e) => handleInputChange('meanInflation', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="0.2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatPercent(inputs.meanInflation)} per year
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inflation Std Dev
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.stdevInflation}
                  onChange={(e) => handleInputChange('stdevInflation', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.001"
                  max="0.1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatPercent(inputs.stdevInflation)} per year
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Strategy Section */}
        {activeSection === 'withdrawal' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Withdrawal Rate
              </label>
              <input
                type="number"
                step="0.001"
                value={inputs.initialWR}
                onChange={(e) => handleInputChange('initialWR', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0.01"
                max="0.2"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formatPercent(inputs.initialWR)} of portfolio
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Rate
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.floorWR}
                  onChange={(e) => handleInputChange('floorWR', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.01"
                  max="0.2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatPercent(inputs.floorWR)} minimum
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cap Rate
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.capWR}
                  onChange={(e) => handleInputChange('capWR', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.01"
                  max="0.2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatPercent(inputs.capWR)} maximum
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardrail Drop
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.guardrailDrop}
                  onChange={(e) => handleInputChange('guardrailDrop', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="0.5"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatPercent(inputs.guardrailDrop)} cut
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardrail Raise
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={inputs.guardrailRaise}
                  onChange={(e) => handleInputChange('guardrailRaise', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="0.5"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatPercent(inputs.guardrailRaise)} increase
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Section */}
        {activeSection === 'advanced' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cash Buffer (years)
              </label>
              <input
                type="number"
                value={inputs.cashBufferYears}
                onChange={(e) => handleInputChange('cashBufferYears', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="10"
              />
              <p className="text-sm text-gray-500 mt-1">
                {inputs.cashBufferYears} years of spending in cash
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effective Tax Rate
              </label>
              <input
                type="number"
                step="0.001"
                value={inputs.effectiveTaxRate}
                onChange={(e) => handleInputChange('effectiveTaxRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formatPercent(inputs.effectiveTaxRate)} of income
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Simulations
              </label>
              <input
                type="number"
                value={inputs.simulations}
                onChange={(e) => handleInputChange('simulations', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100"
                max="10000"
              />
              <p className="text-sm text-gray-500 mt-1">
                {inputs.simulations.toLocaleString()} Monte Carlo paths
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Calculate Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={calculate}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
        >
          Calculate Retirement Plan
        </button>
      </div>
    </div>
  );
} 