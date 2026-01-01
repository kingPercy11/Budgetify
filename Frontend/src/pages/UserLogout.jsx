import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('token')
                navigate('/login')
            }
        }).catch((error) => {
            console.error('Logout error:', error)
            localStorage.removeItem('token')
            navigate('/login')
        })
    }, [])

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl">Logging out...</div>
        </div>
    )
}

export default UserLogout