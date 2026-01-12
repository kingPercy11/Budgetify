import React from 'react'

const SummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white/95 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold">Total Income</p>
            <p className="text-2xl font-bold text-green-600">₹{summary.totalIncome.toFixed(0)}</p>
          </div>
          <i className="ri-arrow-down-circle-fill text-4xl text-green-500"></i>
        </div>
      </div>

      <div className="bg-white/95 rounded-xl p-6 shadow-lg border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">₹{summary.totalExpenses.toFixed(0)}</p>
          </div>
          <i className="ri-arrow-up-circle-fill text-4xl text-red-500"></i>
        </div>
      </div>

      <div className={`bg-white/95 rounded-xl p-6 shadow-lg border-l-4 ${
        summary.netSavings >= 0 ? 'border-blue-500' : 'border-orange-500'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold">Net Savings</p>
            <p className={`text-2xl font-bold ${
              summary.netSavings >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              ₹{summary.netSavings.toFixed(0)}
            </p>
          </div>
          <i className={`ri-wallet-fill text-4xl ${
            summary.netSavings >= 0 ? 'text-blue-500' : 'text-orange-500'
          }`}></i>
        </div>
      </div>

      <div className="bg-white/95 rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold">Avg Daily Spend</p>
            <p className="text-2xl font-bold text-purple-600">₹{summary.avgDaily.toFixed(0)}</p>
          </div>
          <i className="ri-calendar-check-fill text-4xl text-purple-500"></i>
        </div>
      </div>
    </div>
  )
}

export default SummaryCards
