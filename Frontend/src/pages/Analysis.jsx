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

// Import components
import AnalysisHeader from '../components/analysis/AnalysisHeader'
import SummaryCards from '../components/analysis/SummaryCards'
import CategoryPieChart from '../components/analysis/CategoryPieChart'
import TrendLineChart from '../components/analysis/TrendLineChart'
import CategoryBarChart from '../components/analysis/CategoryBarChart'
import SmartInsights from '../components/analysis/SmartInsights'
import DailyLineChart from '../components/analysis/DailyLineChart'
import FinancialHealthScore from '../components/analysis/FinancialHealthScore'
import SmartAlerts from '../components/analysis/SmartAlerts'
import ComparisonCards from '../components/analysis/ComparisonCards'
import PredictionCards from '../components/analysis/PredictionCards'
import TopCategories from '../components/analysis/TopCategories'

const Analysis = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useContext(UserDataContext)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [periodFilter, setPeriodFilter] = useState('all') // Dropdown filter: all, day, week, month, prevMonth
  const [dayRange, setDayRange] = useState('') // Button filter: 7, 30, 90, 365
  const [filteredExpenses, setFilteredExpenses] = useState([])

  useEffect(() => {
    if (user?.username) {
      fetchExpenses()
    }
  }, [user?.username])

  useEffect(() => {
    filterExpensesByDateRange()
  }, [expenses, periodFilter, dayRange])

  const fetchExpenses = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenditures/user/${user.username}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const expensesWithType = response.data.map(exp => ({
        ...exp,
        type: exp.type || 'debit'
      }))

      setExpenses(expensesWithType)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to format date in local timezone (YYYY-MM-DD)
  const formatLocalDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const filterExpensesByDateRange = () => {
    // If both are default/empty, show all
    if (periodFilter === 'all' && !dayRange) {
      setFilteredExpenses(expenses)
      return
    }

    const today = new Date()
    let startDate, endDate

    // Day range button takes priority if set
    if (dayRange) {
      const days = parseInt(dayRange)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      startDate = formatLocalDate(cutoffDate)
      endDate = formatLocalDate(today)
    } else {
      // Period filter from dropdown
      switch (periodFilter) {
        case 'day':
          startDate = formatLocalDate(today)
          endDate = formatLocalDate(today)
          break
        case 'week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
          startDate = formatLocalDate(weekStart)
          endDate = formatLocalDate(today)
          break
        case 'month':
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
          startDate = formatLocalDate(monthStart)
          endDate = formatLocalDate(today)
          break
        case 'prevMonth':
          const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
          startDate = formatLocalDate(prevMonthStart)
          endDate = formatLocalDate(prevMonthEnd)
          break
        default: // 'all'
          setFilteredExpenses(expenses)
          return
      }
    }

    const filtered = expenses.filter(expense => {
      const expDate = formatLocalDate(new Date(expense.date))
      return expDate >= startDate && expDate <= endDate
    })
    setFilteredExpenses(filtered)
  }

  // Handler for dropdown - clears day range buttons
  const handlePeriodChange = (value) => {
    setPeriodFilter(value)
    setDayRange('') // Clear day range when dropdown is used
  }

  // Handler for day range buttons - resets dropdown to 'all'
  const handleDayRangeClick = (days) => {
    setDayRange(days)
    setPeriodFilter('all') // Reset dropdown when button is used
  }

  const getSummary = () => {
    const totalIncome = filteredExpenses
      .filter(e => e.type === 'credit')
      .reduce((sum, e) => sum + e.amount, 0)

    const totalExpenses = filteredExpenses
      .filter(e => e.type === 'debit')
      .reduce((sum, e) => sum + e.amount, 0)

    const netSavings = totalIncome - totalExpenses
    // Calculate days based on active filter
    let days = 30 // default
    if (dayRange) {
      days = parseInt(dayRange)
    } else if (periodFilter === 'day') {
      days = 1
    } else if (periodFilter === 'week') {
      days = 7
    } else if (periodFilter === 'month') {
      days = new Date().getDate() // Days elapsed in current month
    } else if (periodFilter === 'prevMonth') {
      const now = new Date()
      days = new Date(now.getFullYear(), now.getMonth(), 0).getDate() // Days in previous month
    }
    const avgDaily = totalExpenses / days

    return { totalIncome, totalExpenses, netSavings, avgDaily }
  }

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

  const getFinancialHealthScore = () => {
    const { totalIncome, totalExpenses, netSavings } = getSummary()
    let score = 0
    const breakdown = {}

    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) : 0
    const savingsScore = Math.min(30, Math.max(0, savingsRate * 100 * 0.3))
    score += savingsScore
    breakdown.savings = savingsScore

    const creditTransactions = filteredExpenses.filter(e => e.type === 'credit')
    const incomeConsistency = creditTransactions.length > 0 ? Math.min(20, creditTransactions.length * 2) : 0
    score += incomeConsistency
    breakdown.incomeConsistency = incomeConsistency

    const avgDaily = getSummary().avgDaily
    const expenseControl = totalIncome > 0 ? Math.min(30, 30 - (avgDaily / (totalIncome / 30)) * 30) : 0
    score += expenseControl
    breakdown.expenseControl = expenseControl

    const categories = new Set(filteredExpenses.map(e => e.category))
    const diversification = Math.min(20, categories.size * 2)
    score += diversification
    breakdown.diversification = diversification

    return { score: Math.round(score), breakdown }
  }

  const getPredictions = () => {
    const { totalIncome, totalExpenses, avgDaily } = getSummary()
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const daysElapsed = now.getDate()

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

  const getSmartAlerts = () => {
    const alerts = []
    const monthComparison = getMonthComparison()
    const weekComparison = getWeekComparison()
    const { totalIncome, netSavings } = getSummary()
    const categoryAlerts = getCategoryInsights()

    alerts.push(...categoryAlerts)

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

    if (weekComparison.change < 0) {
      alerts.push({
        type: 'success',
        icon: 'ri-thumb-up-line',
        text: `Great! You saved ${Math.abs(weekComparison.change).toFixed(0)}% more this week`,
        color: 'text-green-600'
      })
    }

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

    if (totalIncome > 0 && netSavings / totalIncome > 0.5) {
      alerts.push({
        type: 'success',
        icon: 'ri-medal-line',
        text: `Amazing! You're saving over 50% of your income`,
        color: 'text-green-600'
      })
    }

    return alerts.slice(0, 6)
  }

  const getInsights = () => {
    const { totalIncome, totalExpenses, netSavings } = getSummary()
    const categoryData = getCategoryData()

    const insights = []

    if (categoryData.labels.length > 0) {
      insights.push({
        icon: 'ri-shopping-bag-line',
        text: `You spend most on ${categoryData.labels[0]}`,
        color: 'text-blue-600'
      })
    }

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

    const debitCount = filteredExpenses.filter(e => e.type === 'debit').length
    const creditCount = filteredExpenses.filter(e => e.type === 'credit').length
    insights.push({
      icon: 'ri-exchange-line',
      text: `${debitCount} expenses and ${creditCount} income transactions`,
      color: 'text-purple-600'
    })

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
        <div className="fixed inset-0 bg-gradient-to-b from-blue-900/50 via-blue-600/40 to-blue-900/50 backdrop-blur-md"></div>
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
        <div className="fixed inset-0 bg-gradient-to-b from-blue-900/50 via-blue-600/40 to-blue-900/50 backdrop-blur-md"></div>
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
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900/50 via-blue-600/40 to-blue-900/50 backdrop-blur-md"></div>

      <AnalysisHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div className="relative z-10 pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                <i className="ri-bar-chart-box-line mr-2"></i>
                Financial Analysis
              </h1>

              {/* Period Dropdown Filter - Left Side */}
              <select
                value={periodFilter}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer ${dayRange ? 'bg-white/80 text-blue-900' : 'bg-blue-600 text-white'
                  }`}
              >
                <option value="all">All Time</option>
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="prevMonth">Prev Month</option>
              </select>
            </div>

            {/* Day Range Buttons - Right Side */}
            <div className="flex gap-2 flex-wrap">
              {['7', '30', '90', '365'].map(days => (
                <button
                  key={days}
                  onClick={() => handleDayRangeClick(days)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${dayRange === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/80 text-blue-900 hover:bg-white'
                    }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          <SummaryCards summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryPieChart categoryData={categoryData} chartOptions={chartOptions} />
            <TrendLineChart monthlyTrend={monthlyTrend} chartOptions={chartOptions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryBarChart categoryData={categoryData} chartOptions={chartOptions} />
            <SmartInsights insights={insights} />
          </div>

          <DailyLineChart dailyBreakdown={dailyBreakdown} chartOptions={chartOptions} />

          <FinancialHealthScore healthScore={healthScore} />

          <SmartAlerts smartAlerts={smartAlerts} />

          <ComparisonCards monthComparison={monthComparison} weekComparison={weekComparison} />

          <PredictionCards predictions={predictions} />

          <TopCategories categoryData={categoryData} />
        </div>
      </div>
    </div>
  )
}

export default Analysis
