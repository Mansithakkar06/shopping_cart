import React from 'react'
import Navbar from './components/user/Navbar'
import Footer from './components/user/Footer'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Layout() {
  const isLoggedin = useSelector(state => state.auth.isLoggedin)
  const user = useSelector(state => state.auth.user)

  if (isLoggedin && user?.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout