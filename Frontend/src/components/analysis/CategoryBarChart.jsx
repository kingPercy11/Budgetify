import React from 'react'
import { Bar } from 'react-chartjs-2'

const CategoryBarChart = ({ categoryData }) => {
  const barChartData = {
    labels: categoryData.labels,
    datasets: [{
      label: 'Spending by Category',
      data: categoryData.values,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1
    }]
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
        <i className="ri-bar-chart-fill mr-2"></i>
        Category Comparison
      </h3>
      <div className="h-64">
        {categoryData.labels.length > 0 ? (
          <Bar data={barChartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-500 pt-20">No data available</p>
        )}
      </div>
    </div>
  )
}

export default CategoryBarChart
