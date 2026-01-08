import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

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
  }, [])
  
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
    <div>
      <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] flex flex-col relative">
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/40 via-blue-600/30 to-blue-900/40 backdrop-blur-sm"></div>
        
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
        <div className="relative z-10 pt-32 px-4 pb-16 flex items-center justify-center min-h-screen">
          <div className='profile-card w-full max-w-3xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-blue-200'>
            <div className='text-center mb-8'>
              <i className="ri-account-circle-fill text-7xl text-blue-600 mb-4 block drop-shadow-lg"></i>
              <h1 className='text-4xl font-bold text-blue-900 drop-shadow-sm'>
                My Profile
              </h1>
            </div>
            
            {message && (
              <div className='bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6'>
                <p className="text-sm font-semibold">{message}</p>
              </div>
            )}
            
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6'>
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
        </div>
      </div>
    </div>
  )
}

export default Account
