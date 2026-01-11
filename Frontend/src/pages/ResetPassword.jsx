import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [searchParams])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // Validation
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/reset-password`,
        { token, newPassword }
      )
      
      setMessage(response.data.message)
      setNewPassword('')
      setConfirmPassword('')
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] flex items-center justify-center p-6 relative">
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-sm"></div>
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <Link to='/login' className='block w-fit mx-auto mb-6'>
          <img className='w-64 hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:drop-shadow-[0_0_40px_rgba(59,130,246,1)]' src="/Logo.png" alt="Budgetify Logo" />
        </Link>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-3 text-center">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your new password below.
        </p>
        
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-100 rounded-xl px-4 py-3 pr-12 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base outline-none transition"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                disabled={loading || !token}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-100 rounded-xl px-4 py-3 pr-12 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base outline-none transition"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                disabled={loading || !token}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
              </button>
            </div>
          </div>
          
          {message && (
            <div className='bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4'>
              <p className="text-sm">{message}</p>
              <p className="text-xs mt-1">Redirecting to login...</p>
            </div>
          )}
          
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4'>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading || !token}
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-4 py-3 w-full text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <Link to='/login' className="text-blue-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
