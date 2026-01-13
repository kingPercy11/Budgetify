import React from 'react'
import { Line } from 'react-chartjs-2'

const DailyActivityChart = ({ getDailyBreakdown, expenses }) => {
  const dailyBreakdown = getDailyBreakdown()
  
  return (
    <div className='bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-blue-200 mt-6'>
      <h3 className='text-xl font-bold text-blue-900 mb-4 flex items-center gap-2'>
        <i className="ri-line-chart-line"></i>
        Day-to-Day Activity (Last 30 Days)
      </h3>
      <div className='h-64'>
        {expenses.length > 0 ? (
          <Line 
            data={{
              labels: dailyBreakdown.labels,
              datasets: [
                {
                  label: 'Daily Income',
                  data: dailyBreakdown.income,
                  borderColor: 'rgb(34, 197, 94)',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  tension: 0.3,
                  fill: true,
                  pointRadius: 3,
                  pointHoverRadius: 5
                },
                {
                  label: 'Daily Expenses',
                  data: dailyBreakdown.expenses,
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  tension: 0.3,
                  fill: true,
                  pointRadius: 3,
                  pointHoverRadius: 5
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { color: '#1e40af', font: { size: 11 } }
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        ) : (
          <p className='text-center text-gray-500 pt-24'>No data available</p>
        )}
      </div>
    </div>
  )
}

export default DailyActivityChart
