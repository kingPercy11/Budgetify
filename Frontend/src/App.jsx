import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserLogout from './pages/UserLogout'
import UserSignup from './pages/UserSignup'
import UserProtectWrapper from './pages/UserProtectWrapper'
import Home from './pages/Home'
import Expense from './pages/Expense'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start/>}/>
        <Route path='/login' element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path='/logout' element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
        } />
        <Route path="/home" element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        } />
        <Route path="/expenses" element={
          <UserProtectWrapper>
            <Expense />
          </UserProtectWrapper>
        } />
      </Routes>
    </div>
  )
}

export default App
