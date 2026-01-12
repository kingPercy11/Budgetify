import React from 'react'
import { Line } from 'react-chartjs-2'

const DailyLineChart = ({ dailyBreakdown }) => {
  const dailyLineChartData = {
    labels: dailyBreakdown.labels,
    datasets: [
      {
        label: 'Daily Income',
        data: dailyBreakdown.income,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Daily Expenses',
        data: dailyBreakdown.expenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#1e40af', font: { size: 12 } }
      }
    }
  }

  return (
    <div className="bg-white/95 rounded-xl p-6 shadow-lg mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        <i className="ri-line-chart-line mr-2"></i>
        Day-to-Day Income & Expenses
      </h3>
      <div className="h-80">
        {dailyBreakdown.labels.length > 0 ? (
          <Line data={dailyLineChartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-500 pt-32">No daily data available</p>
        )}
      </div>
    </div>
  )
}

export default DailyLineChart
