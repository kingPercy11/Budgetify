import React from 'react'
import { Pie } from 'react-chartjs-2'

const CategoryPieChart = ({ categoryData }) => {
  const pieChartData = {
    labels: categoryData.labels,
    datasets: [{
      data: categoryData.values,
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(20, 184, 166, 0.8)',
        'rgba(251, 146, 60, 0.8)'
      ],
      borderColor: 'white',
      borderWidth: 2
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
        <i className="ri-pie-chart-line mr-2"></i>
        Spending by Category
      </h3>
      <div className="h-64">
        {categoryData.labels.length > 0 ? (
          <Pie data={pieChartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-500 pt-20">No expense data available</p>
        )}
      </div>
    </div>
  )
}

export default CategoryPieChart
