import React from 'react'
import { Line } from 'react-chartjs-2'

const TrendLineChart = ({ monthlyTrend }) => {
  const lineChartData = {
    labels: monthlyTrend.labels,
    datasets: [
      {
        label: 'Income',
        data: monthlyTrend.income,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: monthlyTrend.expenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
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
    <div className="bg-white/95 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        <i className="ri-line-chart-line mr-2"></i>
        Income vs Expenses Trend
      </h3>
      <div className="h-64">
        {monthlyTrend.labels.length > 0 ? (
          <Line data={lineChartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-500 pt-20">No trend data available</p>
        )}
      </div>
    </div>
  )
}

export default TrendLineChart
