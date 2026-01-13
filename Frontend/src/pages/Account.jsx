import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import { format } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Import components
import PageHeader from '../components/shared/PageHeader'
import AccountDetailsCard from '../components/account/AccountDetailsCard'
import FinancialOverviewCard from '../components/account/FinancialOverviewCard'
import DailyActivityChart from '../components/account/DailyActivityChart'

const Account = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, setUser } = useContext(UserDataContext)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  // Country list with flags
  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' }
  ]
  
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

  const getDailyBreakdown = () => {
    const dailyData = {}
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const recentExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo)
    const sortedExpenses = [...recentExpenses].sort((a, b) => new Date(a.date) - new Date(b.date))

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

  const handleUpdateProfile = async () => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      setError('Phone number is required')
      setTimeout(() => setError(''), 3000)
      return
    }
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update-profile`,
        { 
          age: age ? parseInt(age) : undefined,
          state,
          country,
          phoneNumber
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUser(response.data.user)
      setMessage('Profile updated successfully!')
      setIsEditingProfile(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] bg-fixed">
      <div className="fixed inset-0 bg-linear-to-b from-blue-900/50 via-blue-600/40 to-blue-900/50 backdrop-blur-md"></div>
        
      <PageHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
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
              <AccountDetailsCard 
                user={user}
                message={message}
                error={error}
                isEditingUsername={isEditingUsername}
                setIsEditingUsername={setIsEditingUsername}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                handleUpdateUsername={handleUpdateUsername}
                isEditingEmail={isEditingEmail}
                setIsEditingEmail={setIsEditingEmail}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                handleUpdateEmail={handleUpdateEmail}
                isEditingPassword={isEditingPassword}
                setIsEditingPassword={setIsEditingPassword}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showCurrentPassword={showCurrentPassword}
                setShowCurrentPassword={setShowCurrentPassword}
                showNewPassword={showNewPassword}
                setShowNewPassword={setShowNewPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                handleUpdatePassword={handleUpdatePassword}
                isEditingProfile={isEditingProfile}
                setIsEditingProfile={setIsEditingProfile}
                age={age}
                setAge={setAge}
                state={state}
                setState={setState}
                country={country}
                setCountry={setCountry}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                setCity={setCity}
                handleUpdateProfile={handleUpdateProfile}
                countries={countries}
              />

          <div className='space-y-6'>
            {/* Financial Overview Card */}
            <FinancialOverviewCard stats={stats} />
            
            {/* Daily Activity Chart */}
            <DailyActivityChart 
              getDailyBreakdown={getDailyBreakdown}
              expenses={expenses}
            />
          </div>
        </div>
          </div>
        </div>
      </div>

  )
}

export default Account
