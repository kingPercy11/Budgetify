import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import InstallPWA, { usePWAInstall } from './InstallPWA'

const PageHeader = ({ isMenuOpen, setIsMenuOpen, title = 'My Profile' }) => {
  const [showInstallModal, setShowInstallModal] = useState(false)
  const { canInstall, isInstalled } = usePWAInstall()

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 w-full h-20 z-50 bg-black/40 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between h-full px-8">
          <Link to='/home'>
            <img className='w-52 hover:scale-105 transition-transform duration-300 cursor-pointer drop-shadow-[0_0_25px_rgba(59,130,246,0.8)] hover:drop-shadow-[0_0_35px_rgba(59,130,246,1)] brightness-110' src="/Logo.png" alt="Budgetify Logo" />
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='bg-blue-200/30 hover:bg-blue-300/40 text-white p-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm'
            >
              <i className="ri-menu-line text-2xl"></i>
            </button>

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

                {/* Install App Option - shown if installable and not already installed */}
                {!isInstalled && (
                  <button
                    onClick={() => {
                      setShowInstallModal(true)
                      setIsMenuOpen(false)
                    }}
                    className='w-full flex items-center gap-3 px-6 py-4 hover:bg-green-500/20 transition-colors duration-200 text-gray-800 border-t border-gray-200/50'
                  >
                    <i className="ri-install-line text-2xl text-green-600"></i>
                    <span className='font-semibold'>Install App</span>
                  </button>
                )}

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

      {/* Install PWA Modal */}
      <InstallPWA
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </>
  )
}

export default PageHeader

