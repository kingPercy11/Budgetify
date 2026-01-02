import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className="fixed top-0 left-0 w-full h-20 z-50 bg-black/40 backdrop-blur-md shadow-sm">
            <div className="flex items-center h-full">
                <Link to='/home'>
                    <img className='w-52 hover:scale-105 transition-transform duration-300 cursor-pointer' src="/Logo.png" alt="Budgetify Logo" />
                </Link>
            </div>

        </div> 
    </div>
  )
}

export default Home
