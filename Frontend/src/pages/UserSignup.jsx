import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'


const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const newUser = {
      username: username,
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
      setEmail('')
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] flex items-center justify-center p-6 relative">
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-sm"></div>
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <Link to='/' className='block w-fit mx-auto mb-6'>
          <img className='w-52 hover:scale-105 transition-transform duration-300' src="/Logo.png" alt="Budgetify Logo" />
        </Link>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              required
              className='bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base outline-none transition'
              type="text"
              placeholder='Choose a username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base outline-none transition'
              type="email"
              placeholder='email@example.com'
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              className='bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base outline-none transition'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              type="password"
              placeholder='Create a password (min 6 characters)'
              minLength={6}
            />
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4'>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            disabled={loading}
            className='bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-4 py-3 w-full text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className='text-center mt-6 text-gray-600'>
          Already have an account? <Link to='/login' className='text-blue-600 font-semibold hover:underline'>Login here</Link>
        </p>
        
        <div className="mt-6">
          <p className='text-xs text-gray-500 text-center leading-tight'>
            This site is protected by reCAPTCHA and the{' '}
            <span className='underline cursor-pointer'>Google Privacy Policy</span> and{' '}
            <span className='underline cursor-pointer'>Terms of Service</span> apply.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup