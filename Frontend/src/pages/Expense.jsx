import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { UserDataContext } from '../context/UserContext'
import ManageExpenses from '../components/ManageExpenses'


const Expense = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  useEffect(() => { 
    gsap.fromTo('.header-logo', 
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    gsap.fromTo('.header-menu', 
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
  }, [])

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] flex flex-col relative">
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/40 via-blue-600/30 to-blue-900/40 backdrop-blur-sm">
        </div>
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
        <div className="relative z-10 pt-32 px-8 lg:px-16 pb-16">
            <h1 className='text-3xl text-blue-950 lg:text-4xl font-bold drop-shadow-3xl leading-none'> Manage your expenses </h1>
            <ManageExpenses />
        </div>
    </div>
  )
}

export default Expense
