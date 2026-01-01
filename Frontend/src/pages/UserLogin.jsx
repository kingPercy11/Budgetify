import React, { useState, useContext } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from "../context/UserContext"


const UserLogin = () => {   
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [check, setCheck] = useState(true)
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
        <div className="min-h-screen bg-linear-to-br from-blue-500 via-blue-400 to-cyan-400 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
                <Link to='/' className='block w-fit mx-auto mb-6'>
                    <img className='w-52 hover:scale-105 transition-transform duration-300' src="/Logo.png" alt="Budgetify Logo" />
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
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full text-base outline-none transition"
                            type="password"
                            placeholder="Enter your password" 
                        />
                    </div>
                    
                    {!check && (
                        <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4'>
                            <p className="text-sm">Invalid email or password</p>
                        </div>
                    )}
                    
                    <button className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-4 py-3 w-full text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg">
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