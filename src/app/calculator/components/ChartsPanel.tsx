'use client';

import { useState } from 'react';
import { useCalculatorStore } from '@/lib/store';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function ChartsPanel() {
  const { results } = useCalculatorStore();
  const [activeChart, setActiveChart] = useState('success');

  if (!results) return null;

  const { deterministic, monteCarlo } = results;

  const chartOptions = [
    { id: 'success', title: 'Success Probability', icon: '🎯' },
    { id: 'cashflow', title: 'Cash Flow Timeline', icon: '💰' },
    { id: 'portfolio', title: 'Portfolio Trajectory', icon: '📈' },
    { id: 'distribution', title: 'Ending Balance Distribution', icon: '📊' },
  ];

  // Success probability data for pie chart
  const successData = [
    { name: 'Success', value: monteCarlo.successProbability, color: '#10B981' },
    { name: 'Failure', value: 1 - monteCarlo.successProbability, color: '#EF4444' },
  ];

  // Cash flow data
  const cashflowData = deterministic.cashflowTable.map((row) => ({
    age: row.age,
    spend: row.spend,
    income: row.income,
    withdrawal: row.withdrawal,
    portfolio: row.portfolio,
  }));

  // Portfolio trajectory data (simplified for chart)
  const portfolioData = deterministic.cashflowTable
    .filter((row) => row.age >= deterministic.cashflowTable[0].age)
    .map((row) => ({
      age: row.age,
      portfolio: row.portfolio,
    }));

  // Ending balance distribution data
  const distributionData = [
    { percentile: '5th', value: monteCarlo.percentile5, color: '#EF4444' },
    { percentile: '25th', value: monteCarlo.percentile25, color: '#F59E0B' },
    { percentile: 'Median', value: monteCarlo.medianEndingBalance, color: '#10B981' },
    { percentile: '75th', value: monteCarlo.percentile75, color: '#3B82F6' },
    { percentile: '95th', value: monteCarlo.percentile95, color: '#8B5CF6' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">Age: {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Charts</h2>
        
        {/* Chart Navigation */}
        <div className="flex gap-2">
          {chartOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveChart(option.id)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                activeChart === option.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.icon} {option.title}
            </button>
          ))}
        </div>
      </div>

      <div className="h-96">
        {/* Success Probability Chart */}
        {activeChart === 'success' && (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monte Carlo Success Rate</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {successData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatPercent(value), 'Probability']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Based on {results.monteCarlo.successProbability * 100}% success rate across{' '}
                {results.allPaths.length.toLocaleString()} simulations
              </p>
            </div>
          </div>
        )}

        {/* Cash Flow Timeline */}
        {activeChart === 'cashflow' && (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Cash Flow</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#FEE2E2"
                  name="Spending"
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="#10B981"
                  fill="#D1FAE5"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="withdrawal"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#DBEAFE"
                  name="Portfolio Withdrawal"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Portfolio Trajectory */}
        {activeChart === 'portfolio' && (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Balance Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Portfolio Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Ending Balance Distribution */}
        {activeChart === 'distribution' && (
          <div className="h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ending Balance Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="percentile" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Ending Balance']}
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Distribution of portfolio values at age {deterministic.cashflowTable[deterministic.cashflowTable.length - 1]?.age || 95}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 