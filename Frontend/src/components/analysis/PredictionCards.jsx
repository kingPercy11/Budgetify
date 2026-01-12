import React from 'react'

const PredictionCards = ({ predictions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white/95 rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
        <i className="ri-calendar-todo-line text-3xl text-blue-600 mb-2"></i>
        <p className="text-sm text-gray-600 font-semibold mb-1">Projected Month-End</p>
        <p className={`text-2xl font-bold ${predictions.projectedBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{predictions.projectedBalance.toFixed(0)}
        </p>
        <p className="text-xs text-gray-500 mt-1">Based on current trend</p>
      </div>

      <div className="bg-white/95 rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
        <i className="ri-time-line text-3xl text-purple-600 mb-2"></i>
        <p className="text-sm text-gray-600 font-semibold mb-1">Days Until Broke</p>
        <p className="text-2xl font-bold text-purple-600">
          {predictions.daysUntilBroke === Infinity ? '∞' : predictions.daysUntilBroke}
        </p>
        <p className="text-xs text-gray-500 mt-1">At current spending rate</p>
      </div>

      <div className="bg-white/95 rounded-xl p-6 shadow-lg border-t-4 border-orange-500">
        <i className="ri-calendar-event-line text-3xl text-orange-600 mb-2"></i>
        <p className="text-sm text-gray-600 font-semibold mb-1">Annual Estimate</p>
        <p className="text-2xl font-bold text-orange-600">₹{predictions.annualEstimate.toFixed(0)}</p>
        <p className="text-xs text-gray-500 mt-1">Projected yearly expenses</p>
      </div>

      <div className="bg-white/95 rounded-xl p-6 shadow-lg border-t-4 border-green-500">
        <i className="ri-hand-coin-line text-3xl text-green-600 mb-2"></i>
        <p className="text-sm text-gray-600 font-semibold mb-1">Monthly Projection</p>
        <p className="text-2xl font-bold text-green-600">₹{predictions.projectedMonthlyExpenses.toFixed(0)}</p>
        <p className="text-xs text-gray-500 mt-1">Estimated for this month</p>
      </div>
    </div>
  )
}

export default PredictionCards
