import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import UpdateExpense from './UpdateExpense'
import DeleteConfirmation from './DeleteConfirmation'

const ExpenseList = ({ startDate, endDate, refreshTrigger }) => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useContext(UserDataContext)
  const [editingExpense, setEditingExpense] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState(null)

  useEffect(() => {
    fetchExpenses()
  }, [startDate, endDate, refreshTrigger])

  const fetchExpenses = async () => {
    if (!user?.username) return
    
    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/expenditures/user/${user.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      let filteredExpenses = response.data
      
      // Apply date filters if provided
      if (startDate || endDate) {
        filteredExpenses = filteredExpenses.filter(expense => {
          const expenseDate = new Date(expense.date)
          if (startDate && new Date(startDate) > expenseDate) return false
          if (endDate && new Date(endDate) < expenseDate) return false
          return true
        })
      }
      
      // Sort by date descending (newest first)
      filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date))
      
      setExpenses(filteredExpenses)
    } catch (err) {
      setError('Failed to fetch expenses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!expenseToDelete) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/expenditures/delete/${expenseToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      // Refresh list and close modal
      fetchExpenses()
      setIsDeleteModalOpen(false)
      setExpenseToDelete(null)
    } catch (err) {
      alert('Failed to delete expense')
      console.error(err)
    }
  }

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense)
    setIsDeleteModalOpen(true)
  }

  const handleExpenseUpdated = (updatedExpense) => {
    console.log('Expense updated:', updatedExpense)
    // Refresh the expense list
    fetchExpenses()
    setIsUpdateModalOpen(false)
    setEditingExpense(null)
  }

  const handleUpdateClick = (expense) => {
    setEditingExpense(expense)
    setIsUpdateModalOpen(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-blue-900 font-semibold'>Loading expenses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg m-6'>
        {error}
      </div>
    )
  }

  return (
    <div className='px-4 sm:px-6 pb-6 w-full'>
      <div className='max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100'>
        {expenses.length === 0 ? (
          <div className='text-center py-12 text-gray-500'>
            <i className="ri-inbox-line text-5xl mb-3 block"></i>
            <p className='text-lg font-semibold'>No expenses found</p>
            <p className='text-sm'>Add your first expense to get started!</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {expenses.map((expense) => (
              <div 
                key={expense._id} 
                className='bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-blue-200 w-full'
              >
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-2'>
                      <div className='flex items-center gap-2'>
                        <div className={`w-3 h-3 rounded-full ${
                          expense.type === 'credit' ? 'bg-green-600' : 'bg-red-600'
                        }`} title={expense.type === 'credit' ? 'Credit (Income)' : 'Debit (Expense)'}></div>
                        <span className='text-xl sm:text-2xl font-bold text-blue-900 wrap-break-word'>
                          {expense.type === 'credit' ? '+' : '-'}{formatAmount(expense.amount)}
                        </span>
                      </div>
                      <span className='px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize wrap-break-word'>
                        {expense.category}
                      </span>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600'>
                      <span className='flex items-center gap-1'>
                        <i className="ri-calendar-line"></i>
                        <span className='wrap-break-word'>{formatDate(expense.date)}</span>
                      </span>
                      {expense.description && (
                        <span className='flex items-start sm:items-center gap-1 text-gray-500 wrap-break-word'>
                          <i className="ri-file-text-line mt-0.5 sm:mt-0"></i>
                          <span className='wrap-break-word'>{expense.description}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className='flex gap-2 shrink-0'>
                    <button
                      onClick={() => handleUpdateClick(expense)}
                      className='px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-1'
                      title='Update expense'
                    >
                      <i className="ri-edit-line text-lg"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(expense)}
                      className='px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-1'
                      title='Delete expense'
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UpdateExpense
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false)
          setEditingExpense(null)
        }}
        expense={editingExpense}
        onExpenseUpdated={handleExpenseUpdated}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setExpenseToDelete(null)
        }}
        onConfirm={handleDelete}
        expenseAmount={expenseToDelete?.amount}
        expenseCategory={expenseToDelete?.category}
      />
    </div>
  )
}

export default ExpenseList
