import React from 'react'

const DateRangeFilter = ({ dateRange, setDateRange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
        <i className="ri-bar-chart-box-line mr-2"></i>
        Financial Analysis
      </h1>
      
      <div className="flex gap-2">
        {['7', '30', '90', '365', 'all'].map(range => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-3 py-2 rounded-lg font-semibold transition-all ${
              dateRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-white/80 text-blue-900 hover:bg-white'
            }`}
          >
            {range === 'all' ? 'All' : `${range}d`}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DateRangeFilter
