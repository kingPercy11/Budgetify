import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserLogout from './pages/UserLogout'
import UserSignup from './pages/UserSignup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import UserProtectWrapper from './pages/UserProtectWrapper'
import Home from './pages/Home'
import Expense from './pages/Expense'
import Account from './pages/Account'
import Limits from './pages/Limits'
import Analysis from './pages/Analysis'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start/>}/>
        <Route path='/login' element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route path="/account" element={
          <UserProtectWrapper>
            <Account />
          </UserProtectWrapper>
        } />
        <Route path="/limits" element={
          <UserProtectWrapper>
            <Limits />
          </UserProtectWrapper>
        } />
        <Route path="/analysis" element={
          <UserProtectWrapper>
            <Analysis />
          </UserProtectWrapper>
        } />
      </Routes>
    </div>
  )
}

export default App
