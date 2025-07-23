import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './Pages/Home'
import LoginPage from './Pages/Login'
import RegisterPage from './Pages/Register'
import ProfilePage from './Pages/Profile'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from './context/authContext'

const App = () => {

  const {Authuser} = useContext(AuthContext)
  return (
    <div className='bg-[url(./assets/bgImage.JPG)] bg-cover bg-no-repeat bg-center h-screen w-screen'>
      <Toaster />
      <Routes>
        <Route path="/" element={Authuser ? <HomePage /> : <Navigate to='/login'/>} />
        <Route path="/login" element={!Authuser ? <LoginPage /> : <Navigate to="/"/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={Authuser ? <ProfilePage /> : <Navigate to='/login'/>} />
      </Routes>
    </div>
  )
}

export default App
