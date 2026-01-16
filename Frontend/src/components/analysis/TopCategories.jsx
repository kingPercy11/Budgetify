import React from 'react'

const TopCategories = ({ categoryData }) => {
  return (
    <div className="bg-white/95 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        <i className="ri-trophy-line mr-2"></i>
        Top Spending Categories
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categoryData.labels.slice(0, 3).map((label, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 font-semibold">#{index + 1} {label}</p>
              <p className="text-2xl font-bold text-blue-900">₹{categoryData.values[index].toFixed(0)}</p>
            </div>
            <div className="text-4xl">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopCategories
