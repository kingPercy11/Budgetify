import React, { useState } from 'react'
import AddExpense from './AddExpense'
import ExpenseList from './ExpenseList'

const ManageExpenses = () => {
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleExpenseAdded = (newExpense) => {
    console.log('New expense added:', newExpense)
    // Trigger refresh of expense list
    setRefreshTrigger(prev => prev + 1)
  }

  // Helper function to format date in local timezone (YYYY-MM-DD)
  const formatLocalDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Calculate date ranges based on selected period
  const getDateRange = () => {
    const today = new Date()
    let start = ''
    let end = ''

    switch (filterPeriod) {
      case 'current':
        start = formatLocalDate(today)
        end = formatLocalDate(today)
        break
      case 'previous':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        start = formatLocalDate(yesterday)
        end = formatLocalDate(yesterday)
        break
      case 'currWeek':
        const currWeekStart = new Date(today)
        currWeekStart.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
        start = formatLocalDate(currWeekStart)
        end = formatLocalDate(today)
        break
      case 'prevWeek':
        const prevWeekEnd = new Date(today)
        prevWeekEnd.setDate(today.getDate() - today.getDay() - 1) // End of previous week (Saturday)
        const prevWeekStart = new Date(prevWeekEnd)
        prevWeekStart.setDate(prevWeekEnd.getDate() - 6) // Start of previous week (Sunday)
        start = formatLocalDate(prevWeekStart)
        end = formatLocalDate(prevWeekEnd)
        break
      case 'currMonth':
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        start = formatLocalDate(firstDay)
        end = formatLocalDate(today)
        break
      case 'prevMonth':
        const prevMonthFirst = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const prevMonthLast = new Date(today.getFullYear(), today.getMonth(), 0)
        start = formatLocalDate(prevMonthFirst)
        end = formatLocalDate(prevMonthLast)
        break
      case 'currQuarter':
        const quarter = Math.floor(today.getMonth() / 3)
        const quarterFirst = new Date(today.getFullYear(), quarter * 3, 1)
        start = formatLocalDate(quarterFirst)
        end = formatLocalDate(today)
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
              <option value='currWeek'>Current Week</option>
              <option value='prevWeek'>Previous Week</option>
              <option value='currMonth'>Current Month</option>
              <option value='prevMonth'>Previous Month</option>
              <option value='currQuarter'>Current Quarter</option>
              <option value='custom'>Custom Range</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-blue-900'>Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer'
            >
              <option value='all'>All Categories</option>
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

          {/* Type Filter */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-blue-900'>Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer'
            >
              <option value='all'>All Types</option>
              <option value='debit'>Debit (Expense)</option>
              <option value='credit'>Credit (Income)</option>
            </select>
          </div>

          {/* Search Filter */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-blue-900'>Search</label>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by description...'
              className='px-3 py-2 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
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
        categoryFilter={categoryFilter}
        typeFilter={typeFilter}
        searchQuery={searchQuery}
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
