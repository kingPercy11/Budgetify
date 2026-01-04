import React from 'react'

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, expenseAmount, expenseCategory }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50'>
      <div className='bg-linear-to-br from-red-50 to-red-100 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 relative border border-red-200'>
        {/* Warning Icon */}
        <div className='flex justify-center mb-4'>
          <div className='bg-red-200 p-4 rounded-full'>
            <i className="ri-alert-line text-5xl text-red-600"></i>
          </div>
        </div>

        <h2 className='text-3xl font-bold text-red-900 mb-4 text-center drop-shadow-sm'>
          Delete Expense?
        </h2>

        <p className='text-center text-gray-700 mb-2'>
          Are you sure you want to delete this expense?
        </p>

        {expenseAmount && expenseCategory && (
          <div className='bg-white rounded-xl p-4 mb-6 border-2 border-red-200'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-red-900 mb-1'>
                ${parseFloat(expenseAmount).toFixed(2)}
              </p>
              <p className='text-sm text-gray-600 capitalize'>
                {expenseCategory}
              </p>
            </div>
          </div>
        )}

        <p className='text-center text-sm text-red-700 font-semibold mb-6'>
          This action cannot be undone!
        </p>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='flex-1 px-6 py-3 border-2 border-blue-400 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-all duration-300 shadow-md hover:shadow-lg'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmation
