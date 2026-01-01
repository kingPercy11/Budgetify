import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
const App = () => {
  return (
    <div>
      <Routes>
       <Route path='/' element={<Start/>}/>
      </Routes>
    </div>
  )
}

export default App
