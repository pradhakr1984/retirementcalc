import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Retirement "Enough Number" Calculator
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Calculate how much you need to retire with confidence. Our Monte Carlo simulation 
              models real-world market volatility and withdrawal strategies to give you a 
              probability-based retirement plan.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monte Carlo Analysis</h3>
              <p className="text-gray-600">
                Run thousands of simulations to model market volatility and sequence-of-returns risk.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Guardrails</h3>
              <p className="text-gray-600">
                Dynamic withdrawal adjustments based on portfolio performance and market conditions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Insights</h3>
              <p className="text-gray-600">
                Clear charts and graphs showing success probability, cash flows, and portfolio trajectories.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to calculate your retirement number?
            </h2>
            <p className="text-gray-600 mb-6">
              Get started with our comprehensive retirement calculator. It takes just a few minutes 
              to input your information and see your personalized results.
            </p>
            <Link 
              href="/calculator"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Calculator
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 text-sm text-gray-500">
            <p>
              This calculator is for educational purposes only and should not be considered as financial advice. 
              Please consult with a qualified financial advisor before making any retirement planning decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
