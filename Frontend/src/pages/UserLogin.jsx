import React, { useState, useContext } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from "../context/UserContext"


const UserLogin = () => {   
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [check, setCheck] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    // const [userData, setUserData] = useState({})

    const { user, setUser } = useContext(UserDataContext)
    const navigate = useNavigate()

    // const submitHandler = async(e) => {
    //     e.preventDefault();
    //     const userData = {
    //         email: email,
    //         password: password
    //     }
    //     // console.log(userData)
    //     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
    //     if(response.status === 200){
    //         const data = response.data
    //         setUser(data.user)
    //         localStorage.setItem('token', data.token)
    //         // console.log("LOGIN")
    //         navigate('/home')
    //     }
        
    //     setEmail('')
    //     setPassword('')
    // }

    const submitHandler = async(e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
            const data = response.data
            setUser(data.user)
            localStorage.setItem('token', data.token)
            navigate('/home')
            setCheck(true)
        } catch (error) {
            setCheck(false)
            console.error('Login error:', error)
        } finally {
            setEmail('')
            setPassword('')
        }
    }


    return (
        <div className="min-h-screen bg-cover bg-center bg-[url('/Home.png')] flex items-center justify-center p-6 relative">
            {/* Translucent overlay */}
            <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-sm"></div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
                <Link to='/' className='block w-fit mx-auto mb-6'>
                    <img className='w-64 hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:drop-shadow-[0_0_40px_rgba(59,130,246,1)]' src="/Logo.png" alt="Budgetify Logo" />
                </Link>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
                
                <form onSubmit={(e) => submitHandler(e)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base outline-none transition"
                            type="email" 
                            placeholder="email@example.com" 
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-100 rounded-xl px-4 py-3 pr-12 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base outline-none transition"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password" 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-xl`}></i>
                            </button>
                        </div>
                    </div>
                    
                    <div className="mb-6 text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    
                    {!check && (
                        <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4'>
                            <p className="text-sm">Invalid email or password</p>
                        </div>
                    )}
                    
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-4 py-3 w-full text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
                        Log In
                    </button>
                </form>
                
                <p className="text-center mt-6 text-gray-600"> 
                    New here? <Link to='/signup' className="text-blue-600 font-semibold hover:underline">Create new Account</Link>
                </p>
            </div>
        </div>
    )
}

export default UserLogin