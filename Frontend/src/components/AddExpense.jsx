import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AddExpense = ({ isOpen, onClose, onExpenseAdded }) => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('debit')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleAddExpense = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    // Validation
    if (!amount || !category || !date || !type) {
      setError('Amount, category, date, and type are required')
      return
    }

    // Check if date is in the future
    const selectedDate = new Date(date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate > today) {
      setError('Cannot add expenses for future dates')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/expenditures/add`,
        {
          amount: parseFloat(amount),
          category,
          date,
          description,
          type
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSuccessMessage('Expense added successfully!')
      
      // Reset form
      setAmount('')
      setCategory('')
      setDate('')
      setDescription('')
      setType('debit')
      
      // Call callback if provided
      if (onExpenseAdded) {
        onExpenseAdded(response.data)
      }
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose()
        setSuccessMessage('')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense')
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50'>
      <div className='bg-linear-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 mt-18 relative border border-blue-200'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-blue-700 hover:text-blue-900 transition-colors'
        >
          <i className="ri-close-line text-3xl"></i>
        </button>

        <h2 className='text-3xl font-bold text-blue-900 mb-6 drop-shadow-sm'>Add New Expense</h2>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        {successMessage && (
          <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4'>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAddExpense}>
          {/* Amount */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-blue-900 mb-2'>
              Amount <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              step='1'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className='w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'
              placeholder='Enter amount'
            />
          </div>

          {/* Type */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-blue-900 mb-2'>
              Type <span className='text-red-500'>*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className='w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm'
            >
              <option value='debit'>Debit</option>
              <option value='credit'>Credit</option>
            </select>
          </div>

          {/* Category */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-blue-900 mb-2'>
              Category <span className='text-red-500'>*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className='w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm'
            >
              <option value=''>Select category</option>
              <option value='food'>Food & Dining</option>
              <option value='transport'>Transportation</option>
              <option value='shopping'>Shopping</option>
              <option value='entertainment'>Entertainment</option>
              <option value='bills'>Bills & Utilities</option>
              <option value='healthcare'>Healthcare</option>
              <option value='education'>Education</option>
              <option value='other'>Other</option>
            </select>
          </div>

          {/* Date */}
          <div className='mb-4'>
            <label className='block text-sm font-bold text-blue-900 mb-2'>
              Date <span className='text-red-500'>*</span>
            </label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
              required
              className='w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm'
            />
          </div>

          {/* Description */}
          <div className='mb-6'>
            <label className='block text-sm font-bold text-blue-900 mb-2'>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows='3'
              className='w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm'
              placeholder='Optional description'
            />
          </div>

          {/* Submit Button */}
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-6 py-3 border-2 border-blue-400 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition-all duration-300 shadow-md hover:shadow-lg'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105'
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpense
