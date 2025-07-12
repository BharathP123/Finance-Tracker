import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Percent } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const Tools: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [activeCalculator, setActiveCalculator] = useState<'emi' | 'savings' | 'interest'>('emi');

  // EMI Calculator State
  const [emiData, setEmiData] = useState({
    principal: '',
    rate: '',
    tenure: '',
  });
  const [emiResult, setEmiResult] = useState<number | null>(null);

  // Savings Calculator State
  const [savingsData, setSavingsData] = useState({
    monthlyAmount: '',
    rate: '',
    duration: '',
  });
  const [savingsResult, setSavingsResult] = useState<number | null>(null);

  // Interest Calculator State
  const [interestData, setInterestData] = useState({
    principal: '',
    rate: '',
    time: '',
  });
  const [interestResult, setInterestResult] = useState<number | null>(null);

  const calculateEMI = () => {
    const P = parseFloat(emiData.principal);
    const r = parseFloat(emiData.rate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(emiData.tenure) * 12; // Total months

    if (P && r && n) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmiResult(emi);
    }
  };

  const calculateSavings = () => {
    const PMT = parseFloat(savingsData.monthlyAmount);
    const r = parseFloat(savingsData.rate) / 100 / 12; // Monthly interest rate
    const n = parseFloat(savingsData.duration) * 12; // Total months

    if (PMT && r && n) {
      // Future Value of Annuity formula
      const fv = PMT * (((Math.pow(1 + r, n) - 1) / r));
      setSavingsResult(fv);
    } else if (PMT && n) {
      // Simple calculation without interest
      setSavingsResult(PMT * n);
    }
  };

  const calculateInterest = () => {
    const P = parseFloat(interestData.principal);
    const r = parseFloat(interestData.rate) / 100;
    const t = parseFloat(interestData.time);

    if (P && r && t) {
      const interest = P * r * t;
      setInterestResult(interest);
    }
  };

  const calculators = [
    { id: 'emi' as const, name: 'EMI Calculator', icon: Calculator },
    { id: 'savings' as const, name: 'Savings Calculator', icon: TrendingUp },
    { id: 'interest' as const, name: 'Interest Calculator', icon: Percent },
  ];

  return (
    <div className="space-y-6">
      {/* Calculator Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Financial Calculators</h2>
        </div>

        <div className="flex space-x-4 mb-6">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeCalculator === calc.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{calc.name}</span>
              </button>
            );
          })}
        </div>

        {/* EMI Calculator */}
        {activeCalculator === 'emi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">EMI Calculator</h3>
                <p className="text-sm text-gray-600">
                  Calculate your Equated Monthly Installment for loans
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount (Principal)
                    </label>
                    <input
                      type="number"
                      value={emiData.principal}
                      onChange={(e) => setEmiData(prev => ({ ...prev, principal: e.target.value }))}
                      placeholder="Enter loan amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      value={emiData.rate}
                      onChange={(e) => setEmiData(prev => ({ ...prev, rate: e.target.value }))}
                      placeholder="Enter interest rate"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Tenure (Years)
                    </label>
                    <input
                      type="number"
                      value={emiData.tenure}
                      onChange={(e) => setEmiData(prev => ({ ...prev, tenure: e.target.value }))}
                      placeholder="Enter tenure in years"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={calculateEMI}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Calculate EMI
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Result</h4>
                {emiResult ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                      <p className="text-3xl font-bold text-blue-600">{formatCurrency(emiResult)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Amount</p>
                        <p className="font-semibold">{formatCurrency(emiResult * parseFloat(emiData.tenure) * 12)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Interest</p>
                        <p className="font-semibold">{formatCurrency((emiResult * parseFloat(emiData.tenure) * 12) - parseFloat(emiData.principal))}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">Enter values and click calculate</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Savings Calculator */}
        {activeCalculator === 'savings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Savings Calculator</h3>
                <p className="text-sm text-gray-600">
                  Calculate future value of your monthly savings
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Savings Amount
                    </label>
                    <input
                      type="number"
                      value={savingsData.monthlyAmount}
                      onChange={(e) => setSavingsData(prev => ({ ...prev, monthlyAmount: e.target.value }))}
                      placeholder="Enter monthly savings"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Interest Rate (%) - Optional
                    </label>
                    <input
                      type="number"
                      value={savingsData.rate}
                      onChange={(e) => setSavingsData(prev => ({ ...prev, rate: e.target.value }))}
                      placeholder="Enter interest rate (0 for no interest)"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Years)
                    </label>
                    <input
                      type="number"
                      value={savingsData.duration}
                      onChange={(e) => setSavingsData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Enter duration in years"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={calculateSavings}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Calculate Future Value
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Result</h4>
                {savingsResult ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Future Value</p>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(savingsResult)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Invested</p>
                        <p className="font-semibold">{formatCurrency(parseFloat(savingsData.monthlyAmount) * parseFloat(savingsData.duration) * 12)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Interest Earned</p>
                        <p className="font-semibold">{formatCurrency(savingsResult - (parseFloat(savingsData.monthlyAmount) * parseFloat(savingsData.duration) * 12))}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">Enter values and click calculate</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Interest Calculator */}
        {activeCalculator === 'interest' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Simple Interest Calculator</h3>
                <p className="text-sm text-gray-600">
                  Calculate simple interest on your investments
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Principal Amount
                    </label>
                    <input
                      type="number"
                      value={interestData.principal}
                      onChange={(e) => setInterestData(prev => ({ ...prev, principal: e.target.value }))}
                      placeholder="Enter principal amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      value={interestData.rate}
                      onChange={(e) => setInterestData(prev => ({ ...prev, rate: e.target.value }))}
                      placeholder="Enter interest rate"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Period (Years)
                    </label>
                    <input
                      type="number"
                      value={interestData.time}
                      onChange={(e) => setInterestData(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="Enter time in years"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={calculateInterest}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Calculate Interest
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Result</h4>
                {interestResult ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Interest Earned</p>
                      <p className="text-3xl font-bold text-purple-600">{formatCurrency(interestResult)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Principal</p>
                        <p className="font-semibold">{formatCurrency(parseFloat(interestData.principal))}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Amount</p>
                        <p className="font-semibold">{formatCurrency(parseFloat(interestData.principal) + interestResult)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">Enter values and click calculate</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;