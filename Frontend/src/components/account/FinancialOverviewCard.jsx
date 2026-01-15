import React from 'react'

const FinancialOverviewCard = ({ stats }) => {
  return (
    <div className='profile-card bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-blue-200 h-fit'>
      <h2 className='text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2'>
        <i className="ri-line-chart-line"></i>
        Financial Overview
      </h2>
      <p className='text-sm text-gray-600 mb-6'>Last 30 Days Summary</p>
      
      <div className='space-y-4'>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Income</p>
              <p className="text-3xl font-bold text-green-600">₹{stats.totalIncome.toFixed(0)}</p>
            </div>
            <i className="ri-arrow-down-circle-fill text-5xl text-green-500"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-5 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(0)}</p>
            </div>
            <i className="ri-arrow-up-circle-fill text-5xl text-red-500"></i>
          </div>
        </div>

        <div className={`bg-gradient-to-r rounded-xl p-5 border-l-4 ${
          stats.netBalance >= 0 
            ? 'from-blue-50 to-blue-100 border-blue-500' 
            : 'from-orange-50 to-orange-100 border-orange-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Net Balance</p>
              <p className={`text-3xl font-bold ${
                stats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                ₹{stats.netBalance.toFixed(0)}
              </p>
            </div>
            <i className={`ri-wallet-fill text-5xl ${
              stats.netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'
            }`}></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Savings Rate</p>
              <p className={`text-3xl font-bold ${
                stats.savingsRate >= 20 ? 'text-green-600' : stats.savingsRate >= 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {stats.savingsRate.toFixed(1)}%
              </p>
            </div>
            <i className="ri-percent-line text-5xl text-purple-500"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-5 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Avg Daily Spend</p>
              <p className="text-3xl font-bold text-indigo-600">₹{stats.avgDailySpend.toFixed(0)}</p>
            </div>
            <i className="ri-calendar-check-fill text-5xl text-indigo-500"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-5 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-pink-600">{stats.totalTransactions}</p>
            </div>
            <i className="ri-exchange-line text-5xl text-pink-500"></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialOverviewCard
