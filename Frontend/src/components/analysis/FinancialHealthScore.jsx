import React from 'react'

const FinancialHealthScore = ({ healthScore }) => {
  return (
    <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg mb-6 text-white">
      <h3 className="text-2xl font-bold mb-4">
        <i className="ri-heart-pulse-line mr-2"></i>
        Financial Health Score
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="text-7xl font-bold">{healthScore.score}</div>
            <div className="text-xl mt-2">/ 100</div>
            <div className="absolute -top-4 -right-4">
              {healthScore.score >= 80 ? '🏆' : healthScore.score >= 60 ? '⭐' : healthScore.score >= 40 ? '👍' : '💪'}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Savings Rate (30%)</span>
              <span>{healthScore.breakdown.savings.toFixed(0)} pts</span>
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: `${(healthScore.breakdown.savings / 30) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Income Consistency (20%)</span>
              <span>{healthScore.breakdown.incomeConsistency.toFixed(0)} pts</span>
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: `${(healthScore.breakdown.incomeConsistency / 20) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Expense Control (30%)</span>
              <span>{healthScore.breakdown.expenseControl.toFixed(0)} pts</span>
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: `${(healthScore.breakdown.expenseControl / 30) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Diversification (20%)</span>
              <span>{healthScore.breakdown.diversification.toFixed(0)} pts</span>
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2" style={{ width: `${(healthScore.breakdown.diversification / 20) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialHealthScore
