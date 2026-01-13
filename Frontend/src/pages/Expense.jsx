import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { UserDataContext } from '../context/UserContext'
import ManageExpenses from '../components/ManageExpenses'
import PageHeader from '../components/shared/PageHeader'


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
        <PageHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="relative z-10 pt-32 px-8 lg:px-16 pb-16">
            <h1 className='text-3xl text-blue-950 lg:text-4xl font-bold drop-shadow-3xl leading-none'> Manage your expenses </h1>
            <ManageExpenses />
        </div>
    </div>
  )
}

export default Expense
