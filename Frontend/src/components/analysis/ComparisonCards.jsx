import React from 'react'

const ComparisonCards = ({ monthComparison, weekComparison }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Month vs Month */}
      <div className="bg-white/95 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          <i className="ri-calendar-2-line mr-2"></i>
          Month-over-Month
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-semibold">This Month</p>
            <p className="text-3xl font-bold text-blue-900">₹{monthComparison.thisMonth.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">Last Month</p>
            <p className="text-2xl font-bold text-gray-600">₹{monthComparison.lastMonth.toFixed(0)}</p>
          </div>
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            monthComparison.change > 0 ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <i className={`${monthComparison.change > 0 ? 'ri-arrow-up-line text-red-600' : 'ri-arrow-down-line text-green-600'} text-2xl`}></i>
            <div>
              <p className={`text-2xl font-bold ${monthComparison.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(monthComparison.change).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">{monthComparison.change > 0 ? 'Increase' : 'Decrease'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Week vs Week */}
      <div className="bg-white/95 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          <i className="ri-calendar-check-line mr-2"></i>
          Week-over-Week
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-semibold">Last 7 Days</p>
            <p className="text-3xl font-bold text-blue-900">₹{weekComparison.thisWeek.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-semibold">Previous 7 Days</p>
            <p className="text-2xl font-bold text-gray-600">₹{weekComparison.lastWeek.toFixed(0)}</p>
          </div>
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            weekComparison.change > 0 ? 'bg-red-50' : 'bg-green-50'
          }`}>
            <i className={`${weekComparison.change > 0 ? 'ri-arrow-up-line text-red-600' : 'ri-arrow-down-line text-green-600'} text-2xl`}></i>
            <div>
              <p className={`text-2xl font-bold ${weekComparison.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(weekComparison.change).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">{weekComparison.change > 0 ? 'Increase' : 'Decrease'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonCards
