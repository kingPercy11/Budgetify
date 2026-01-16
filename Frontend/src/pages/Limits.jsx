import React, { useState, useEffect } from 'react'
import axios from 'axios'
import gsap from 'gsap'
import PageHeader from '../components/shared/PageHeader'

const Limits = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Limits state
  const [categoryLimits, setCategoryLimits] = useState({
    food: 0,
    transport: 0,
    shopping: 0,
    entertainment: 0,
    bills: 0,
    healthcare: 0,
    education: 0,
    other: 0
  })
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [dailyLimit, setDailyLimit] = useState(0)
  const [savingsGoal, setSavingsGoal] = useState(0)
  const [weeklyLimit, setWeeklyLimit] = useState(0)
  
  // Spending analysis state
  const [analysis, setAnalysis] = useState(null)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [isTelegramSetupExpanded, setIsTelegramSetupExpanded] = useState(false)

  // Auto-sync monthly budget with sum of category limits
  useEffect(() => {
    if (autoSyncEnabled) {
      const totalCategoryLimits = Object.values(categoryLimits).reduce((sum, limit) => sum + (parseFloat(limit) || 0), 0)
      if (totalCategoryLimits > 0) {
        setMonthlyBudget(totalCategoryLimits)
      }
    }
  }, [categoryLimits, autoSyncEnabled])

  useEffect(() => {
    gsap.fromTo('.header-logo', 
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    gsap.fromTo('.header-menu', 
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    gsap.fromTo('.limits-content', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
    )
    
    fetchLimits()
  }, [])

  const fetchLimits = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/limits`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const data = response.data
      
      // Set limits
      if (data.limits) {
        setCategoryLimits(data.limits.categoryLimits || {
          food: 0, transport: 0, shopping: 0, entertainment: 0,
          bills: 0, healthcare: 0, education: 0, other: 0
        })
        setMonthlyBudget(data.limits.monthlyBudget || 0)
        setDailyLimit(data.limits.dailyLimit || 0)
        setSavingsGoal(data.limits.savingsGoal || 0)
        setWeeklyLimit(data.limits.weeklyLimit || 0)
      }
      
      // Set analysis
      setAnalysis(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching limits:', err)
      setError('Failed to load limits')
      setLoading(false)
    }
  }

  const handleSaveLimits = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccessMessage('')
      
      const token = localStorage.getItem('token')
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/limits/update`,
        {
          categoryLimits,
          monthlyBudget: parseFloat(monthlyBudget) || 0,
          dailyLimit: parseFloat(dailyLimit) || 0,
          savingsGoal: parseFloat(savingsGoal) || 0,
          weeklyLimit: parseFloat(weeklyLimit) || 0
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      setSuccessMessage('Limits saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Refresh analysis
      fetchLimits()
      setSaving(false)
    } catch (err) {
      console.error('Error saving limits:', err)
      setError(err.response?.data?.message || 'Failed to save limits')
      setSaving(false)
    }
  }

  const handleCategoryChange = (category, value) => {
    setCategoryLimits(prev => ({
      ...prev,
      [category]: parseFloat(value) || 0
    }))
  }

  const handleMonthlyBudgetChange = (value) => {
    setAutoSyncEnabled(false) // Disable auto-sync when manually editing monthly budget
    setMonthlyBudget(value)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 90) return 'bg-orange-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getAlertBadge = (status) => {
    switch (status) {
      case 'exceeded':
        return <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">Exceeded</span>
      case 'critical':
        return <span className="text-xs px-2 py-1 bg-orange-500 text-white rounded-full">90%+</span>
      case 'warning':
        return <span className="text-xs px-2 py-1 bg-yellow-500 text-white rounded-full">80%+</span>
      default:
        return <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full">Safe</span>
    }
  }

  const categoryNames = {
    food: 'Food & Dining',
    transport: 'Transportation',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    bills: 'Bills & Utilities',
    healthcare: 'Healthcare',
    education: 'Education',
    other: 'Other'
  }

  const categoryIcons = {
    food: 'ri-restaurant-2-line',
    transport: 'ri-car-line',
    shopping: 'ri-shopping-bag-3-line',
    entertainment: 'ri-movie-2-line',
    bills: 'ri-file-list-3-line',
    healthcare: 'ri-health-book-line',
    education: 'ri-book-open-line',
    other: 'ri-more-2-line'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-600/30 to-blue-900/40 backdrop-blur-sm"></div>
        <div className="relative z-10 text-white text-2xl">
          <i className="ri-loader-4-line animate-spin text-4xl"></i>
          <p className="mt-4">Loading limits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] bg-fixed">
      <div className="fixed inset-0 bg-linear-to-b from-blue-900/40 via-blue-600/30 to-blue-900/40 backdrop-blur-md"></div>
      
      {/* Header */}
      <PageHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 pb-16 limits-content">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 drop-shadow-2xl mb-2">
              <i className="ri-funds-line mr-3"></i>
              Budget Limits
            </h1>
            <p className="text-lg text-white/90 drop-shadow-lg">
              Set spending limits and track your progress
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Limit Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category-wise Limits */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <i className="ri-pie-chart-line mr-2"></i>
                  Category-wise Monthly Limits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(categoryLimits).map(category => (
                    <div key={category} className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-blue-900">
                        <i className={`${categoryIcons[category]} mr-2 text-lg`}></i>
                        {categoryNames[category]}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={categoryLimits[category] || ''}
                          onChange={(e) => handleCategoryChange(category, e.target.value)}
                          className="w-full pl-8 pr-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                      {/* Progress bar if data exists */}
                      {analysis?.categoryAlerts?.[category] && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-blue-900">
                            <span>₹{analysis.categoryAlerts[category].spent.toFixed(0)} spent</span>
                            <span>{analysis.categoryAlerts[category].percentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${getProgressColor(analysis.categoryAlerts[category].percentage)}`}
                              style={{ width: `${Math.min(100, analysis.categoryAlerts[category].percentage)}%` }}
                            ></div>
                          </div>
                          {getAlertBadge(analysis.categoryAlerts[category].status)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Budget */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <i className="ri-calendar-line mr-2"></i>
                  Overall Monthly Budget
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 font-semibold text-xl">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={monthlyBudget || ''}
                      onChange={(e) => handleMonthlyBudgetChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xl bg-blue-50 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="30000"
                    />
                  </div>
                  {analysis?.monthly && monthlyBudget > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-blue-900">
                        <span>Spent: ₹{analysis.monthly.totalSpent.toFixed(0)}</span>
                        <span>Remaining: ₹{analysis.monthly.remaining.toFixed(0)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all ${getProgressColor(analysis.monthly.percentage)}`}
                          style={{ width: `${Math.min(100, analysis.monthly.percentage)}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-lg font-bold text-blue-900">
                        {analysis.monthly.percentage.toFixed(1)}% of budget used
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily Limit */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                    <i className="ri-sun-line mr-2"></i>
                    Daily Spending Limit
                  </h2>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 font-semibold">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={dailyLimit || ''}
                      onChange={(e) => setDailyLimit(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1000"
                    />
                  </div>
                  {analysis?.daily && dailyLimit > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="text-sm text-blue-900">
                        Today: ₹{analysis.daily.spent.toFixed(0)} / ₹{dailyLimit}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(analysis.daily.percentage)}`}
                          style={{ width: `${Math.min(100, analysis.daily.percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekly Limit */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                    <i className="ri-calendar-week-line mr-2"></i>
                    Weekly Budget Limit
                  </h2>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 font-semibold">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={weeklyLimit || ''}
                      onChange={(e) => setWeeklyLimit(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="7000"
                    />
                  </div>
                  {analysis?.weekly && weeklyLimit > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="text-sm text-blue-900">
                        This week: ₹{analysis.weekly.spent.toFixed(0)} / ₹{weeklyLimit}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(analysis.weekly.percentage)}`}
                          style={{ width: `${Math.min(100, analysis.weekly.percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Savings Goal and Transaction Limit */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Savings Goal */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                    <i className="ri-piggy-bank-line mr-2"></i>
                    Monthly Savings Goal
                  </h2>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 font-semibold">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={savingsGoal || ''}
                      onChange={(e) => setSavingsGoal(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-blue-50 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10000"
                    />
                  </div>
                  {analysis?.savings && savingsGoal > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="text-sm text-blue-900">
                        Saved: ₹{Math.max(0, analysis.savings.actual).toFixed(0)} / ₹{savingsGoal}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${analysis.savings.percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(100, analysis.savings.percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveLimits}
                disabled={saving}
                className="w-full bg-linear-to-r from-blue-600 to-blue-800 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save All Limits'}
              </button>
            </div>

            {/* Right Column - Quick Stats */}
            <div className="space-y-6">
              {/* Overall Summary */}
              <div className="bg-linear-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-2xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <i className="ri-dashboard-line mr-2"></i>
                  Quick Summary
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <div className="text-sm opacity-90">This Month</div>
                    <div className="text-3xl font-bold">₹{analysis?.monthly?.totalSpent?.toFixed(0) || 0}</div>
                    <div className="text-sm">of ₹{monthlyBudget || 0} budget</div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <div className="text-sm opacity-90">This Week</div>
                    <div className="text-2xl font-bold">₹{analysis?.weekly?.spent?.toFixed(0) || 0}</div>
                    <div className="text-sm">of ₹{weeklyLimit || 0} limit</div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <div className="text-sm opacity-90">Today</div>
                    <div className="text-2xl font-bold">₹{analysis?.daily?.spent?.toFixed(0) || 0}</div>
                    <div className="text-sm">of ₹{dailyLimit || 0} limit</div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4">
                    <div className="text-sm opacity-90">Savings Progress</div>
                    <div className="text-2xl font-bold">₹{Math.max(0, analysis?.savings?.actual || 0).toFixed(0)}</div>
                    <div className="text-sm">of ₹{savingsGoal || 0} goal</div>
                  </div>
                </div>
              </div>

              {/* Telegram Setup Expandable Section */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
                <button
                  onClick={() => setIsTelegramSetupExpanded(!isTelegramSetupExpanded)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-cyan-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-600 text-white rounded-full p-3">
                      <i className="ri-telegram-line text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-cyan-900">Set Up Telegram Alerts</h3>
                      <p className="text-sm text-cyan-600">Get instant budget notifications</p>
                    </div>
                  </div>
                  <i className={`ri-arrow-${isTelegramSetupExpanded ? 'up' : 'down'}-s-line text-3xl text-cyan-600 transition-transform`}></i>
                </button>
                
                {isTelegramSetupExpanded && (
                  <div className="p-6 pt-0 border-t-2 border-cyan-100 animate-fadeIn">
                    <div className="bg-linear-to-br from-cyan-50 to-blue-50 rounded-xl p-5">
                      <p className="text-cyan-800 mb-4 font-medium">
                        Follow these easy steps to receive budget alerts on Telegram:
                      </p>
                      
                      <ol className="space-y-3 mb-5">
                        <li className="flex items-start gap-3">
                          <span className="shrink-0 w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                          <div>
                            <p className="font-semibold text-cyan-900">Open the Budgetify Alert Bot</p>
                            <p className="text-sm text-cyan-700">Click the button below to open Telegram</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="shrink-0 w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                          <div>
                            <p className="font-semibold text-cyan-900">Tap "Start" in the bot</p>
                            <p className="text-sm text-cyan-700">Then share your phone number when prompted</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="shrink-0 w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                          <div>
                            <p className="font-semibold text-cyan-900">You're all set!</p>
                            <p className="text-sm text-cyan-700">Receive alerts when you hit 80%, 90%, or exceed your limits</p>
                          </div>
                        </li>
                      </ol>
                      
                      <a
                        href="https://t.me/Budgetify_alert_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <i className="ri-telegram-line text-xl"></i>
                        Open Budgetify Alert Bot
                        <i className="ri-external-link-line text-sm"></i>
                      </a>
                      
                      <div className="mt-4 p-3 bg-cyan-100 border border-cyan-300 rounded-lg">
                        <p className="text-xs text-cyan-800 flex items-center gap-2">
                          <i className="ri-shield-check-line text-base"></i>
                          Your phone number is only used to securely link your account. We never share your data.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Alerts */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <i className="ri-alarm-warning-line mr-2"></i>
                  Active Alerts
                </h2>
                <div className="space-y-3">
                  {analysis?.categoryAlerts && Object.entries(analysis.categoryAlerts).map(([category, alert]) => {
                    if (alert.status !== 'safe') {
                      return (
                        <div key={category} className={`p-3 rounded-xl ${
                          alert.status === 'exceeded' ? 'bg-red-100 border border-red-300' :
                          alert.status === 'critical' ? 'bg-orange-100 border border-orange-300' :
                          'bg-yellow-100 border border-yellow-300'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <i className={`${categoryIcons[category]} text-xl mr-2`}></i>
                              <div>
                                <div className="font-semibold text-sm">{categoryNames[category]}</div>
                                <div className="text-xs">{alert.percentage.toFixed(0)}% used</div>
                              </div>
                            </div>
                            {getAlertBadge(alert.status)}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                  {(!analysis?.categoryAlerts || Object.values(analysis.categoryAlerts).every(a => a.status === 'safe')) && (
                    <div className="text-center py-4 text-green-600">
                      <i className="ri-checkbox-circle-line text-3xl mb-2"></i>
                      <p className="text-sm">All limits are under control!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Limits

