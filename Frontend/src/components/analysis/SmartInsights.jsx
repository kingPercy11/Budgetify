import React from 'react'

const SmartInsights = ({ insights }) => {
  return (
    <div className="bg-white/95 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        <i className="ri-lightbulb-flash-line mr-2"></i>
        Smart Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <i className={`${insight.icon} text-2xl ${insight.color}`}></i>
            <p className="text-gray-700 font-medium">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SmartInsights
