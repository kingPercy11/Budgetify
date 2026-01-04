import React, { useState } from 'react'
import AddExpense from './AddExpense'
import ExpenseList from './ExpenseList'

const ManageExpenses = () => {
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleExpenseAdded = (newExpense) => {
    console.log('New expense added:', newExpense)
    // Trigger refresh of expense list
    setRefreshTrigger(prev => prev + 1)
  }

  // Calculate date ranges based on selected period
  const getDateRange = () => {
    const today = new Date()
    let start = ''
    let end = ''

    switch (filterPeriod) {
      case 'current':
        start = today.toISOString().split('T')[0]
        end = today.toISOString().split('T')[0]
        break
      case 'previous':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        start = yesterday.toISOString().split('T')[0]
        end = yesterday.toISOString().split('T')[0]
        break
      case 'currMonth':
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        start = firstDay.toISOString().split('T')[0]
        end = today.toISOString().split('T')[0]
        break
      case 'prevMonth':
        const prevMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const prevMonthLast = new Date(today.getFullYear(), today.getMonth(), 0)
        start = prevMonthFirst.toISOString().split('T')[0]
        end = prevMonthLast.toISOString().split('T')[0]
        break
      case 'currQuarter':
        const quarter = Math.floor(today.getMonth() / 3)
        const quarterFirst = new Date(today.getFullYear(), quarter * 3, 1)
        start = quarterFirst.toISOString().split('T')[0]
        end = today.toISOString().split('T')[0]
        break
      case 'custom':
        start = startDate
        end = endDate
        break
      default: // 'all'
        start = ''
        end = ''
    }

    return { start, end }
  }

  const dateRange = getDateRange()

  return (
    <div className='bg-blue-100 rounded-2xl h-full w-full mt-10 shadow-inner shadow-blue-200/50 border border-blue-300/70'>
      <div className='flex items-center justify-between flex-wrap gap-4 m-6'>
        <div className='flex items-center gap-3 flex-wrap'>
          {/* Period Filter */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-blue-900'>Period</label>
            <select 
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer'
            >
              <option value='all'>All Time</option>
              <option value='current'>Current Day</option>
              <option value='previous'>Previous Day</option>
              <option value='currMonth'>Current Month</option>
              <option value='prevMonth'>Previous Month</option>
              <option value='currQuarter'>Current Quarter</option>
              <option value='custom'>Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range - Show only when Custom is selected */}
          {filterPeriod === 'custom' && (
            <>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-semibold text-blue-900'>Start Date</label>
                <input 
                  type='date' 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-xs font-semibold text-blue-900'>End Date</label>
                <input 
                  type='date' 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                />
              </div>
            </>
          )}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className='bg-green-500 rounded-xl inline-flex items-center gap-1 text-black font-bold px-4 py-2 hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl'
        >
          <p>Add</p>
          <i className="ri-add-line text-xl"></i>
        </button>
      </div>

      {/* Expense List */}
      <ExpenseList 
        startDate={dateRange.start} 
        endDate={dateRange.end}
        refreshTrigger={refreshTrigger}
      />

      <AddExpense 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />
    </div>
  )
}

export default ManageExpenses
