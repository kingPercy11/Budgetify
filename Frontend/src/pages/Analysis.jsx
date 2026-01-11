import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Pie, Bar } from 'react-chartjs-2'
import { format } from 'date-fns'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Analysis = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useContext(UserDataContext)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState('30') // 7, 30, 90, 365, all
  const [filteredExpenses, setFilteredExpenses] = useState([])

  // Fetch expenses
  useEffect(() => {
    console.log('Analysis - User context:', user)
    if (user?.username) {
      console.log('Analysis - Fetching expenses for:', user.username)
      fetchExpenses()
    } else {
      console.log('Analysis - No user username found')
    }
  }, [user?.username])

  // Filter expenses by date range
  useEffect(() => {
    filterExpensesByDateRange()
  }, [expenses, dateRange])

  const fetchExpenses = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      console.log('Analysis - Token:', token ? 'exists' : 'missing')
      console.log('Analysis - API URL:', `${import.meta.env.VITE_BASE_URL}/expenditures/user/${user.username}`)
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenditures/user/${user.username}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      console.log('Analysis - Expenses fetched:', response.data.length, 'items')
      console.log('Analysis - Sample expenses:', response.data.slice(0, 3))
      
      // Handle old expenses without 'type' field - default to 'debit' (expense)
      const expensesWithType = response.data.map(exp => ({
        ...exp,
        type: exp.type || 'debit' // Default old expenses to 'debit'
      }))
      console.log('Analysis - Expenses with type:', expensesWithType.slice(0, 3))
      
      setExpenses(expensesWithType)
    } catch (error) {
      console.error('Analysis - Error fetching expenses:', error)
      console.error('Analysis - Error response:', error.response?.data)
      setError(error.response?.data?.message || 'Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  const filterExpensesByDateRange = () => {
    if (dateRange === 'all') {
      console.log('Analysis - Showing all expenses:', expenses.length)
      setFilteredExpenses(expenses)
      return
    }

    const days = parseInt(dateRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= cutoffDate
    })
    console.log('Analysis - Date range:', dateRange, 'days, Cutoff:', cutoffDate.toISOString())
    console.log('Analysis - Filtered from', expenses.length, 'to', filtered.length, 'expenses')
    setFilteredExpenses(filtered)
  }

  // Calculate summary statistics
  const getSummary = () => {
    console.log('Analysis - getSummary called with', filteredExpenses.length, 'expenses')
    
    const totalIncome = filteredExpenses
      .filter(e => e.type === 'credit')
      .reduce((sum, e) => sum + e.amount, 0)
    
    const totalExpenses = filteredExpenses
      .filter(e => e.type === 'debit')
      .reduce((sum, e) => sum + e.amount, 0)
    
    console.log('Analysis - Credits:', filteredExpenses.filter(e => e.type === 'credit').length, 'Total:', totalIncome)
    console.log('Analysis - Debits:', filteredExpenses.filter(e => e.type === 'debit').length, 'Total:', totalExpenses)
    
    const netSavings = totalIncome - totalExpenses
    
    const days = dateRange === 'all' ? 30 : parseInt(dateRange)
    const avgDaily = totalExpenses / days

    return { totalIncome, totalExpenses, netSavings, avgDaily }
  }

  // Get category distribution
  const getCategoryData = () => {
    const categoryTotals = {}
    
    filteredExpenses
      .filter(e => e.type === 'debit')
      .forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
      })

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])

    return {
      labels: sortedCategories.map(([cat]) => cat.charAt(0).toUpperCase() + cat.slice(1)),
      values: sortedCategories.map(([, val]) => val)
    }
  }

  // Get monthly trend data
  const getMonthlyTrend = () => {
    const monthlyData = {}

    filteredExpenses.forEach(expense => {
      const month = format(new Date(expense.date), 'MMM yyyy')
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 }
      }
      
      if (expense.type === 'credit') {
        monthlyData[month].income += expense.amount
      } else {
        monthlyData[month].expenses += expense.amount
      }
    })

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => 
      new Date(a) - new Date(b)
    )

    return {
      labels: sortedMonths,
      income: sortedMonths.map(month => monthlyData[month].income),
      expenses: sortedMonths.map(month => monthlyData[month].expenses)
    }
  }

  // Get month over month comparison
  const getMonthComparison = () => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const thisMonth = expenses.filter(e => new Date(e.date) >= thisMonthStart)
    const lastMonth = expenses.filter(e => {
      const date = new Date(e.date)
      return date >= lastMonthStart && date <= lastMonthEnd
    })

    const thisMonthExpenses = thisMonth.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0)
    const lastMonthExpenses = lastMonth.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0)
    const change = lastMonthExpenses > 0 ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100) : 0

    return { thisMonth: thisMonthExpenses, lastMonth: lastMonthExpenses, change }
  }

  // Get week over week comparison
  const getWeekComparison = () => {
    const now = new Date()
    const thisWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    const lastWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14)

    const thisWeek = expenses.filter(e => new Date(e.date) >= thisWeekStart)
    const lastWeek = expenses.filter(e => {
      const date = new Date(e.date)
      return date >= lastWeekStart && date < thisWeekStart
    })

    const thisWeekExpenses = thisWeek.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0)
    const lastWeekExpenses = lastWeek.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0)
    const change = lastWeekExpenses > 0 ? ((thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses * 100) : 0

    return { thisWeek: thisWeekExpenses, lastWeek: lastWeekExpenses, change }
  }

  // Get daily breakdown for line chart
  const getDailyBreakdown = () => {
    const dailyData = {}
    const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(a.date) - new Date(b.date))

    sortedExpenses.forEach(expense => {
      const day = format(new Date(expense.date), 'MMM dd')
      if (!dailyData[day]) {
        dailyData[day] = { income: 0, expenses: 0 }
      }
      
      if (expense.type === 'credit') {
        dailyData[day].income += expense.amount
      } else {
        dailyData[day].expenses += expense.amount
      }
    })

    const labels = Object.keys(dailyData)
    return {
      labels,
      income: labels.map(day => dailyData[day].income),
      expenses: labels.map(day => dailyData[day].expenses)
    }
  }

  // Calculate financial health score
  const getFinancialHealthScore = () => {
    const { totalIncome, totalExpenses, netSavings } = getSummary()
    let score = 0
    const breakdown = {}

    // Savings rate (30 points)
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) : 0
    const savingsScore = Math.min(30, Math.max(0, savingsRate * 100 * 0.3))
    score += savingsScore
    breakdown.savings = savingsScore

    // Income consistency (20 points) - based on credit transactions
    const creditTransactions = filteredExpenses.filter(e => e.type === 'credit')
    const incomeConsistency = creditTransactions.length > 0 ? Math.min(20, creditTransactions.length * 2) : 0
    score += incomeConsistency
    breakdown.incomeConsistency = incomeConsistency

    // Expense control (30 points) - lower avg daily spending is better
    const avgDaily = getSummary().avgDaily
    const expenseControl = totalIncome > 0 ? Math.min(30, 30 - (avgDaily / (totalIncome / 30)) * 30) : 0
    score += expenseControl
    breakdown.expenseControl = expenseControl

    // Diversification (20 points) - multiple income/expense categories
    const categories = new Set(filteredExpenses.map(e => e.category))
    const diversification = Math.min(20, categories.size * 2)
    score += diversification
    breakdown.diversification = diversification

    return { score: Math.round(score), breakdown }
  }

  // Get predictions
  const getPredictions = () => {
    const { totalIncome, totalExpenses, avgDaily } = getSummary()
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const daysElapsed = now.getDate()
    const daysRemaining = daysInMonth - daysElapsed

    const projectedMonthlyExpenses = (totalExpenses / daysElapsed) * daysInMonth
    const projectedBalance = totalIncome - projectedMonthlyExpenses
    const daysUntilBroke = totalIncome > totalExpenses && avgDaily > 0 ? Math.floor((totalIncome - totalExpenses) / avgDaily) : Infinity
    const annualEstimate = (totalExpenses / daysElapsed) * 365

    return {
      projectedBalance,
      daysUntilBroke,
      annualEstimate,
      projectedMonthlyExpenses
    }
  }

  // Get category insights with alerts
  const getCategoryInsights = () => {
    const now = new Date()
    const thisMonth = expenses.filter(e => {
      const date = new Date(e.date)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    const lastMonth = expenses.filter(e => {
      const date = new Date(e.date)
      return date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear()
    })

    const thisCategoryTotals = {}
    const lastCategoryTotals = {}

    thisMonth.filter(e => e.type === 'debit').forEach(e => {
      thisCategoryTotals[e.category] = (thisCategoryTotals[e.category] || 0) + e.amount
    })

    lastMonth.filter(e => e.type === 'debit').forEach(e => {
      lastCategoryTotals[e.category] = (lastCategoryTotals[e.category] || 0) + e.amount
    })

    const alerts = []
    Object.keys(thisCategoryTotals).forEach(cat => {
      const thisAmount = thisCategoryTotals[cat]
      const lastAmount = lastCategoryTotals[cat] || 0
      if (lastAmount > 0) {
        const change = ((thisAmount - lastAmount) / lastAmount * 100)
        if (change > 20) {
          alerts.push({
            type: 'warning',
            icon: 'ri-alarm-warning-line',
            text: `Your ${cat} spending increased by ${change.toFixed(0)}% this month`,
            color: 'text-orange-600'
          })
        }
      }
    })

    return alerts
  }

  // Get smart alerts
  const getSmartAlerts = () => {
    const alerts = []
    const monthComparison = getMonthComparison()
    const weekComparison = getWeekComparison()
    const { totalIncome, netSavings } = getSummary()
    const categoryAlerts = getCategoryInsights()

    // Add category alerts
    alerts.push(...categoryAlerts)

    // Month comparison alert
    if (monthComparison.change > 20) {
      alerts.push({
        type: 'warning',
        icon: 'ri-error-warning-line',
        text: `You're spending ${monthComparison.change.toFixed(0)}% faster than last month`,
        color: 'text-red-600'
      })
    } else if (monthComparison.change < -20) {
      alerts.push({
        type: 'success',
        icon: 'ri-checkbox-circle-line',
        text: `Great job! You're spending ${Math.abs(monthComparison.change).toFixed(0)}% less than last month`,
        color: 'text-green-600'
      })
    }

    // Week comparison positive feedback
    if (weekComparison.change < 0) {
      alerts.push({
        type: 'success',
        icon: 'ri-thumb-up-line',
        text: `Great! You saved ${Math.abs(weekComparison.change).toFixed(0)}% more this week`,
        color: 'text-green-600'
      })
    }

    // Check for spending streaks
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
    const recentExpenses = sortedExpenses.filter(e => e.type === 'debit').slice(0, 7)
    const categories = new Set(recentExpenses.map(e => e.category))
    
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentDiningOut = expenses.filter(e => {
      return e.type === 'debit' && 
             e.category.toLowerCase().includes('food') && 
             new Date(e.date) >= sevenDaysAgo
    })

    if (recentDiningOut.length === 0 && expenses.length > 10) {
      alerts.push({
        type: 'milestone',
        icon: 'ri-trophy-line',
        text: 'Milestone: 7 days without food expenses!',
        color: 'text-yellow-600'
      })
    }

    // High savings achievement
    if (totalIncome > 0 && netSavings / totalIncome > 0.5) {
      alerts.push({
        type: 'success',
        icon: 'ri-medal-line',
        text: `Amazing! You're saving over 50% of your income`,
        color: 'text-green-600'
      })
    }

    return alerts.slice(0, 6) // Return top 6 alerts
  }

  // Get insights
  const getInsights = () => {
    const { totalIncome, totalExpenses, netSavings } = getSummary()
    const categoryData = getCategoryData()
    
    const insights = []

    // Top spending category
    if (categoryData.labels.length > 0) {
      insights.push({
        icon: 'ri-shopping-bag-line',
        text: `You spend most on ${categoryData.labels[0]}`,
        color: 'text-blue-600'
      })
    }

    // Savings status
    if (netSavings > 0) {
      const savingsRate = ((netSavings / totalIncome) * 100).toFixed(1)
      insights.push({
        icon: 'ri-profit-line',
        text: `You're saving ${savingsRate}% of your income`,
        color: 'text-green-600'
      })
    } else if (netSavings < 0) {
      insights.push({
        icon: 'ri-alarm-warning-line',
        text: `You're spending ₹${Math.abs(netSavings).toFixed(0)} more than earning`,
        color: 'text-red-600'
      })
    }

    // Transaction count
    const debitCount = filteredExpenses.filter(e => e.type === 'debit').length
    const creditCount = filteredExpenses.filter(e => e.type === 'credit').length
    insights.push({
      icon: 'ri-exchange-line',
      text: `${debitCount} expenses and ${creditCount} income transactions`,
      color: 'text-purple-600'
    })

    // Highest expense
    const highestExpense = filteredExpenses
      .filter(e => e.type === 'debit')
      .sort((a, b) => b.amount - a.amount)[0]
    
    if (highestExpense) {
      insights.push({
        icon: 'ri-arrow-up-circle-line',
        text: `Highest expense: ₹${highestExpense.amount} (${highestExpense.category})`,
        color: 'text-orange-600'
      })
    }

    return insights
  }

  const summary = getSummary()
  const categoryData = getCategoryData()
  const monthlyTrend = getMonthlyTrend()
  const dailyBreakdown = getDailyBreakdown()
  const insights = getInsights()
  const monthComparison = getMonthComparison()
  const weekComparison = getWeekComparison()
  const healthScore = getFinancialHealthScore()
  const predictions = getPredictions()
  const smartAlerts = getSmartAlerts()

  // Chart configurations
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

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] bg-fixed flex items-center justify-center relative">
        <div className="fixed inset-0 bg-linear-to-b from-blue-900/50 via-blue-600/40 to-blue-900/50 backdrop-blur-md"></div>
        <div className="relative z-10 bg-white/90 rounded-xl p-8 shadow-2xl">
          <i className="ri-loader-4-line animate-spin text-5xl text-blue-600 block mb-4 text-center"></i>
          <div className="text-blue-900 font-semibold text-xl">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] bg-fixed flex items-center justify-center relative">
        <div className="fixed inset-0 bg-linear-to-b from-blue-900/50 via-blue-600/40 to-blue-900/50 backdrop-blur-md"></div>
        <div className="relative z-10 bg-white/90 rounded-xl p-8 shadow-2xl max-w-md">
          <i className="ri-error-warning-line text-5xl text-red-600 block mb-4 text-center"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error Loading Data</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={() => { setError(''); setLoading(true); fetchExpenses(); }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <Link to="/home" className="block text-center mt-3 text-blue-600 hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] bg-fixed">
      <div className="fixed inset-0 bg-linear-to-b from-blue-900/50 via-blue-600/40 to-blue-900/50 backdrop-blur-md"></div>
      
      {/* Header */}
      <div className="fixed top-0 left-0 w-full h-20 z-50 bg-black/40 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between h-full px-8">
          <Link to='/home'>
            <img className='w-52 hover:scale-105 transition-transform duration-300 cursor-pointer drop-shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:drop-shadow-[0_0_35px_rgba(59,130,246,1)] brightness-110' src="/Logo.png" alt="Budgetify Logo" />
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='bg-blue-200/30 hover:bg-blue-300/40 text-white p-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm'
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-blue-200/98 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden border border-white/60">
                <Link 
                  to='/home' 
                  className='flex items-center gap-3 px-6 py-4 hover:bg-blue-500/20 transition-colors duration-200 text-gray-800'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-home-5-line text-2xl text-blue-600"></i>
                  <span className='font-semibold'>Home</span>
                </Link>
                <Link 
                  to='/account' 
                  className='flex items-center gap-3 px-6 py-4 hover:bg-blue-500/20 transition-colors duration-200 text-gray-800 border-t border-gray-200/50'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-account-circle-line text-2xl text-blue-600"></i>
                  <span className='font-semibold'>My Account</span>
                </Link>
                <Link 
                  to='/logout' 
                  className='flex items-center gap-3 px-6 py-4 hover:bg-red-500/20 transition-colors duration-200 text-gray-800 border-t border-gray-200/50'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="ri-logout-box-line text-2xl text-red-600"></i>
                  <span className='font-semibold'>Logout</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Title and Filters */}
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/95 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">₹{summary.totalIncome.toFixed(0)}</p>
                </div>
                <i className="ri-arrow-down-circle-fill text-4xl text-green-500"></i>
              </div>
            </div>

            <div className="bg-white/95 rounded-xl p-6 shadow-lg border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">₹{summary.totalExpenses.toFixed(0)}</p>
                </div>
                <i className="ri-arrow-up-circle-fill text-4xl text-red-500"></i>
              </div>
            </div>

            <div className={`bg-white/95 rounded-xl p-6 shadow-lg border-l-4 ${
              summary.netSavings >= 0 ? 'border-blue-500' : 'border-orange-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Net Savings</p>
                  <p className={`text-2xl font-bold ${
                    summary.netSavings >= 0 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    ₹{summary.netSavings.toFixed(0)}
                  </p>
                </div>
                <i className={`ri-wallet-fill text-4xl ${
                  summary.netSavings >= 0 ? 'text-blue-500' : 'text-orange-500'
                }`}></i>
              </div>
            </div>

            <div className="bg-white/95 rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Avg Daily Spend</p>
                  <p className="text-2xl font-bold text-purple-600">₹{summary.avgDaily.toFixed(0)}</p>
                </div>
                <i className="ri-calendar-check-fill text-4xl text-purple-500"></i>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
          </div>

          {/* Daily Breakdown Line Chart - Full Width */}
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

          {/* Financial Health Score */}
          <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg mb-6 text-white">
            <h3 className="text-2xl font-bold mb-4">
              <i className="ri-heart-pulse-line mr-2"></i>
              Financial Health Score
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="text-7xl font-bold">{healthScore.score}</div>
                  <div className="text-xl mt-2">/ 100</div>
                  <div className="absolute -top-4 -right-4">
                    {healthScore.score >= 80 ? '🏆' : healthScore.score >= 60 ? '⭐' : healthScore.score >= 40 ? '👍' : '💪'}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Savings Rate (30%)</span>
                    <span>{healthScore.breakdown.savings.toFixed(0)} pts</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: `${(healthScore.breakdown.savings / 30) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Income Consistency (20%)</span>
                    <span>{healthScore.breakdown.incomeConsistency.toFixed(0)} pts</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: `${(healthScore.breakdown.incomeConsistency / 20) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Expense Control (30%)</span>
                    <span>{healthScore.breakdown.expenseControl.toFixed(0)} pts</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: `${(healthScore.breakdown.expenseControl / 30) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Diversification (20%)</span>
                    <span>{healthScore.breakdown.diversification.toFixed(0)} pts</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: `${(healthScore.breakdown.diversification / 20) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Alerts */}
          {smartAlerts.length > 0 && (
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
          )}

          {/* Comparisons & Predictions */}
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

          {/* Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/95 rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
              <i className="ri-calendar-todo-line text-3xl text-blue-600 mb-2"></i>
              <p className="text-sm text-gray-600 font-semibold mb-1">Projected Month-End</p>
              <p className={`text-2xl font-bold ${predictions.projectedBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{predictions.projectedBalance.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on current trend</p>
            </div>

            <div className="bg-white/95 rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
              <i className="ri-time-line text-3xl text-purple-600 mb-2"></i>
              <p className="text-sm text-gray-600 font-semibold mb-1">Days Until Broke</p>
              <p className="text-2xl font-bold text-purple-600">
                {predictions.daysUntilBroke === Infinity ? '∞' : predictions.daysUntilBroke}
              </p>
              <p className="text-xs text-gray-500 mt-1">At current spending rate</p>
            </div>

            <div className="bg-white/95 rounded-xl p-6 shadow-lg border-t-4 border-orange-500">
              <i className="ri-calendar-event-line text-3xl text-orange-600 mb-2"></i>
              <p className="text-sm text-gray-600 font-semibold mb-1">Annual Estimate</p>
              <p className="text-2xl font-bold text-orange-600">₹{predictions.annualEstimate.toFixed(0)}</p>
              <p className="text-xs text-gray-500 mt-1">Projected yearly expenses</p>
            </div>

            <div className="bg-white/95 rounded-xl p-6 shadow-lg border-t-4 border-green-500">
              <i className="ri-hand-coin-line text-3xl text-green-600 mb-2"></i>
              <p className="text-sm text-gray-600 font-semibold mb-1">Monthly Projection</p>
              <p className="text-2xl font-bold text-green-600">₹{predictions.projectedMonthlyExpenses.toFixed(0)}</p>
              <p className="text-xs text-gray-500 mt-1">Estimated for this month</p>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white/95 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              <i className="ri-trophy-line mr-2"></i>
              Top Spending Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categoryData.labels.slice(0, 3).map((label, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg">`
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
        </div>
      </div>
    </div>
  )
}

export default Analysis
