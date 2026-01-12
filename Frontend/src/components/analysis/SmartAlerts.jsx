import React from 'react'

const SmartAlerts = ({ smartAlerts }) => {
  if (smartAlerts.length === 0) return null

  return (
    <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        <i className="ri-notification-3-line mr-2"></i>
        Smart Alerts & Achievements
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {smartAlerts.map((alert, index) => (
          <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
            alert.type === 'success' ? 'bg-green-50 border-green-500' :
            alert.type === 'warning' ? 'bg-orange-50 border-orange-500' :
            'bg-yellow-50 border-yellow-500'
          }`}>
            <i className={`${alert.icon} text-3xl ${alert.color}`}></i>
            <div>
              <p className="text-gray-800 font-semibold">{alert.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SmartAlerts
