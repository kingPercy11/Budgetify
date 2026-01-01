import React from "react"
import { Link } from "react-router-dom"

const Start = () => {    
    return (
        <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')]">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full h-20 z-50 bg-black/40 backdrop-blur-md shadow-sm">
                <div className="flex items-center h-full">
                    <img className='w-44 ml-8 drop-shadow-lg' src="/Logo.png" alt="Logo"/>
                </div>
            </div> 
            
            {/* Hero Section */}
            <div className="min-h-screen pt-20 flex items-center relative overflow-hidden">
                
                {/* Content */}
                <div className='relative z-10 w-full max-w-7xl mx-auto'> 
                    <div className="max-w-2xl">
                        <h1 className='text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
                            Take control of your finances with Budgetify
                        </h1>
                        <p className='text-xl text-white/90 mb-10 leading-relaxed'>
                            Easily track your expenses, set budgets, and achieve your financial goals with Budgetify
                        </p>
                        <Link 
                            to='/login' 
                            className='inline-flex items-center justify-center px-12 py-4 bg-linear-to-r from-green-400 to-green-500 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 hover:from-green-500 hover:to-green-600'
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Start