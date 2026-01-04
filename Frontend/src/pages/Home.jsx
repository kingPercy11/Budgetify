import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { UserDataContext } from '../context/UserContext'

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useContext(UserDataContext)
  const helloRef = useRef(null)
  const userRef = useRef(null)
  const commaRef = useRef(null)
  const welcomeRef = useRef(null)
  const questionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {

    gsap.fromTo('.header-logo', 
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    gsap.fromTo('.header-menu', 
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )

    const timeline = gsap.timeline()
    
    timeline.fromTo(helloRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
    )
    .fromTo(userRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, 
      '-=0.4'
    )
    .fromTo(commaRef.current,
      { rotate: 180, opacity: 0 },
      { rotate: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(welcomeRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(questionRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )

    gsap.fromTo(cardsRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.5 }
    )

    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          y: -5,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1 + (index * 0.1),
          overwrite: false 
        })
      }
    })
  }, [])

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
            
            {/* Content below header */}
            <div className="relative z-10 pt-32 px-8 lg:px-16 pb-16">
                {/* Welcome Section */}
                <div className='mb-12'>
                    <div className='flex items-end gap-4 mb-4'>
                        <h1 ref={helloRef} className='text-7xl lg:text-8xl font-bold text-blue-200 drop-shadow-2xl leading-none'>
                            Hello  
                        </h1>
                        <h1 ref={userRef} className='text-8xl lg:text-9xl font-bold text-blue-900 drop-shadow-2xl leading-none'>
                            {user?.username || 'User'}
                        </h1>
                        <h1 ref={commaRef} className='text-7xl lg:text-8xl font-bold text-blue-200 drop-shadow-2xl leading-none'>
                            ,
                        </h1>
                    </div>
                    
                    <p ref={welcomeRef} className='text-3xl lg:text-4xl font-light text-white/95 drop-shadow-lg mb-3'>
                        Welcome to <span className='font-semibold text-blue-900'>Budgetify</span>
                    </p>
                    
                    <p ref={questionRef} className='text-2xl lg:text-3xl font-light text-white/90 drop-shadow-lg'>
                        What would you like to do today?
                    </p>
                </div>

                {/* Action Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl'>
                    <Link to='/expenses' ref={el => cardsRef.current[0] = el} className='group bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 cursor-pointer border border-white/30 hover:scale-105'>
                        <div className='flex flex-col items-center text-center'>
                            <div className='bg-cyan-400/40 p-4 rounded-2xl mb-4 group-hover:bg-cyan-400/60 transition-all duration-300'>
                                <img className='w-16 h-16' src="/icons/expenses.png" alt="Expenses Icon" />
                            </div>
                            <h3 className='text-xl font-bold text-white mb-2'>Manage Expenses</h3>
                            <p className='text-sm text-white/80'>Track and organize your daily expenses</p>
                        </div>
                    </Link>

                    <Link to='/analysis' ref={el => cardsRef.current[1] = el} className='group bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 cursor-pointer border border-white/30 hover:scale-105'>
                        <div className='flex flex-col items-center text-center'>
                            <div className='bg-emerald-400/40 p-4 rounded-2xl mb-4 group-hover:bg-emerald-400/60 transition-all duration-300'>
                                <img className='w-16 h-16' src="/icons/analysis.png" alt="Analysis Icon" />
                            </div>
                            <h3 className='text-xl font-bold text-white mb-2'>Analyze Spending</h3>
                            <p className='text-sm text-white/80'>View insights and spending patterns</p>
                        </div>
                    </Link>

                    <Link to='/settings' ref={el => cardsRef.current[2] = el} className='group bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 cursor-pointer border border-white/30 hover:scale-105'>
                        <div className='flex flex-col items-center text-center'>
                            <div className='bg-pink-400/40 p-4 rounded-2xl mb-4 group-hover:bg-pink-400/60 transition-all duration-300'>
                                <img className='w-16 h-16' src="/icons/limits.png" alt="Goals Icon" />
                            </div>
                            <h3 className='text-xl font-bold text-white mb-2'>Set Goals</h3>
                            <p className='text-sm text-white/80'>Define and track financial goals</p>
                        </div>
                    </Link>

                    <Link to='/account' ref={el => cardsRef.current[3] = el} className='group bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 cursor-pointer border border-white/30 hover:scale-105'>
                        <div className='flex flex-col items-center text-center'>
                            <div className='bg-amber-400/40 p-4 rounded-2xl mb-4 group-hover:bg-amber-400/60 transition-all duration-300'>
                                <img className='w-16 h-16' src="/icons/settings.png" alt="Settings Icon" />
                            </div>
                            <h3 className='text-xl font-bold text-white mb-2'>Settings</h3>
                            <p className='text-sm text-white/80'>Manage your account preferences</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home
