import React, { useState } from 'react'
import AddExpense from './AddExpense'

const ManageExpenses = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [transactionType, setTransactionType] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleExpenseAdded = (newExpense) => {
    // Handle the newly added expense (e.g., refresh list, show notification)
    console.log('New expense added:', newExpense)
  }

  return (
    <div className='bg-blue-100 rounded-2xl h-full w-full mt-10 shadow-inner shadow-blue-200/50 border border-blue-300/70'>
      <div className='flex items-center justify-between flex-wrap gap-4 m-6'>
        <div className='flex items-center gap-3 flex-wrap'>
          {/* Start Date Filter */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-blue-900'>Start Date</label>
            <input 
              type='date' 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>

          {/* End Date Filter */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-blue-900'>End Date</label>
            <input 
              type='date' 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>

          {/* Transaction Type Filter */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-blue-900'>Type</label>
            <select 
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer'
            >
              <option value='all'>All</option>
              <option value='debit'>Debit</option>
              <option value='credit'>Credit</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className='bg-green-500 rounded-xl inline-flex items-center gap-1 text-black font-bold px-4 py-2 hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl'
        >
          <p>Add</p>
          <i className="ri-add-line text-xl"></i>
        </button>
      </div>

      <AddExpense 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />
    </div>
  )
}

export default ManageExpenses
