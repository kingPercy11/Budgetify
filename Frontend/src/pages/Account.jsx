import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import { format } from 'date-fns'

const Account = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, setUser } = useContext(UserDataContext)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    savingsRate: 0,
    avgDailySpend: 0
  })

  useEffect(() => {
    gsap.fromTo('.header-logo', 
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    gsap.fromTo('.header-menu', 
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    gsap.fromTo('.profile-card', 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.3 }
    )

    gsap.fromTo('.stats-card', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5, stagger: 0.1 }
    )

    if (user?.username) {
      fetchExpenses()
    }
  }, [user?.username])

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenditures/user/${user.username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      const allExpenses = response.data.map(exp => ({
        ...exp,
        type: exp.type || 'debit'
      }))
      
      setExpenses(allExpenses)
      calculateStats(allExpenses)
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    }
  }

  const calculateStats = (expenseData) => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const recentExpenses = expenseData.filter(e => new Date(e.date) >= thirtyDaysAgo)
    
    const totalIncome = recentExpenses
      .filter(e => e.type === 'credit')
      .reduce((sum, e) => sum + e.amount, 0)
    
    const totalExpenses = recentExpenses
      .filter(e => e.type === 'debit')
      .reduce((sum, e) => sum + e.amount, 0)
    
    const netBalance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0
    const avgDailySpend = totalExpenses / 30

    setStats({
      totalTransactions: recentExpenses.length,
      totalIncome,
      totalExpenses,
      netBalance,
      savingsRate,
      avgDailySpend
    })
  }
  
  const handleUpdateUsername = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update-username`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser({ ...user, username: response.data.user.username })
      setMessage('Username updated successfully!')
      setIsEditingUsername(false)
      setNewUsername('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update username')
      setTimeout(() => setError(''), 3000)
    }
  }
  
  const handleUpdateEmail = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update-email`,
        { email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser({ ...user, email: response.data.user.email })
      setMessage('Email updated successfully!')
      setIsEditingEmail(false)
      setNewEmail('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email')
      setTimeout(() => setError(''), 3000)
    }
  }
  
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setTimeout(() => setError(''), 3000)
      return
    }
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Password updated successfully!')
      setIsEditingPassword(false)
      setNewPassword('')
      setConfirmPassword('')
      setCurrentPassword('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] bg-fixed">
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900/50 via-blue-600/40 to-blue-900/50 backdrop-blur-md"></div>
        
        {/* Header */}
        <div className="fixed top-0 left-0 w-full h-20 z-50 bg-black/40 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between h-full px-8">
            <Link to='/home' className='header-logo'>
              <img className='w-52 hover:scale-105 transition-transform duration-300 cursor-pointer drop-shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:drop-shadow-[0_0_35px_rgba(59,130,246,1)] brightness-110' src="/Logo.png" alt="Budgetify Logo" />
            </Link>
            
            {/* Menu Dropdown */}
            <div className="relative header-menu">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='bg-blue-200/30 hover:bg-blue-300/40 text-white p-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm'
              >
                <i className="ri-menu-line text-2xl"></i>
              </button>
              
              {/* Dropdown Menu */}
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
        
        {/* Content */}
        <div className="relative z-10 pt-24 px-4 pb-16">
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='text-center mb-8'>
              <i className="ri-account-circle-fill text-7xl text-white drop-shadow-2xl mb-4 block"></i>
              <h1 className='text-5xl font-bold text-white drop-shadow-lg mb-2'>
                My Profile
              </h1>
              <p className='text-blue-100 text-lg drop-shadow'>Welcome back, {user.username}!</p>
            </div>

            {/* Profile Information Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
              {/* Account Details Card */}
              <div className='profile-card bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-blue-200 h-fit'>
                <h2 className='text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2'>
                  <i className="ri-user-settings-line"></i>
                  Account Details
                </h2>
            
            {message && (
              <div className='bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-2'>
                <i className="ri-checkbox-circle-line text-xl"></i>
                <p className="text-sm font-semibold">{message}</p>
              </div>
            )}
            
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2'>
                <i className="ri-error-warning-line text-xl"></i>
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}
            
            {/* Username Section */}
            <div className='bg-blue-50 rounded-2xl p-6 mb-4 border border-blue-200'>
              <div className='flex items-center justify-between mb-2'>
                <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Username</label>
                {!isEditingUsername && (
                  <button 
                    onClick={() => setIsEditingUsername(true)}
                    className='text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1'
                  >
                    <i className="ri-edit-line"></i> Edit
                  </button>
                )}
              </div>
              {!isEditingUsername ? (
                <p className='text-2xl font-bold text-gray-800'>{user.username || 'N/A'}</p>
              ) : (
                <div className='space-y-3'>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className='w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
                  />
                  <div className='flex gap-2'>
                    <button 
                      onClick={handleUpdateUsername}
                      className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingUsername(false)
                        setNewUsername('')
                      }}
                      className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Email Section */}
            <div className='bg-blue-50 rounded-2xl p-6 mb-4 border border-blue-200'>
              <div className='flex items-center justify-between mb-2'>
                <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Email</label>
                {!isEditingEmail && (
                  <button 
                    onClick={() => setIsEditingEmail(true)}
                    className='text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1'
                  >
                    <i className="ri-edit-line"></i> Edit
                  </button>
                )}
              </div>
              {!isEditingEmail ? (
                <p className='text-2xl font-bold text-gray-800'>{user.email || 'N/A'}</p>
              ) : (
                <div className='space-y-3'>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                    className='w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
                  />
                  <div className='flex gap-2'>
                    <button 
                      onClick={handleUpdateEmail}
                      className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingEmail(false)
                        setNewEmail('')
                      }}
                      className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Password Section */}
            <div className='bg-blue-50 rounded-2xl p-6 border border-blue-200'>
              <div className='flex items-center justify-between mb-2'>
                <label className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Password</label>
                {!isEditingPassword && (
                  <button 
                    onClick={() => setIsEditingPassword(true)}
                    className='text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1'
                  >
                    <i className="ri-edit-line"></i> Change
                  </button>
                )}
              </div>
              {!isEditingPassword ? (
                <p className='text-2xl font-bold text-gray-800'>••••••••</p>
              ) : (
                <div className='space-y-3'>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className='w-full px-4 py-3 pr-12 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i className={`${showCurrentPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className='w-full px-4 py-3 pr-12 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i className={`${showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className='w-full px-4 py-3 pr-12 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none'
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
                    </button>
                  </div>
                  <div className='flex gap-2'>
                    <button 
                      onClick={handleUpdatePassword}
                      className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'
                    >
                      Update Password
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingPassword(false)
                        setNewPassword('')
                        setConfirmPassword('')
                        setCurrentPassword('')
                      }}
                      className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Overview Card */}
          <div className='profile-card bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-blue-200 h-fit'>
            <h2 className='text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2'>
              <i className="ri-line-chart-line"></i>
              Financial Overview
            </h2>
            <p className='text-sm text-gray-600 mb-6'>Last 30 Days Summary</p>
            
            <div className='space-y-4'>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Total Income</p>
                    <p className="text-3xl font-bold text-green-600">₹{stats.totalIncome.toFixed(0)}</p>
                  </div>
                  <i className="ri-arrow-down-circle-fill text-5xl text-green-500"></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-5 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Total Expenses</p>
                    <p className="text-3xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(0)}</p>
                  </div>
                  <i className="ri-arrow-up-circle-fill text-5xl text-red-500"></i>
                </div>
              </div>

              <div className={`bg-gradient-to-r rounded-xl p-5 border-l-4 ${
                stats.netBalance >= 0 
                  ? 'from-blue-50 to-blue-100 border-blue-500' 
                  : 'from-orange-50 to-orange-100 border-orange-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Net Balance</p>
                    <p className={`text-3xl font-bold ${
                      stats.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      ₹{stats.netBalance.toFixed(0)}
                    </p>
                  </div>
                  <i className={`ri-wallet-fill text-5xl ${
                    stats.netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'
                  }`}></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Savings Rate</p>
                    <p className={`text-3xl font-bold ${
                      stats.savingsRate >= 20 ? 'text-green-600' : stats.savingsRate >= 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {stats.savingsRate.toFixed(1)}%
                    </p>
                  </div>
                  <i className="ri-percent-line text-5xl text-purple-500"></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-5 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Avg Daily Spend</p>
                    <p className="text-3xl font-bold text-indigo-600">₹{stats.avgDailySpend.toFixed(0)}</p>
                  </div>
                  <i className="ri-calendar-check-fill text-5xl text-indigo-500"></i>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-5 border-l-4 border-pink-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">Total Transactions</p>
                    <p className="text-3xl font-bold text-pink-600">{stats.totalTransactions}</p>
                  </div>
                  <i className="ri-exchange-line text-5xl text-pink-500"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

  )
}

export default Account
