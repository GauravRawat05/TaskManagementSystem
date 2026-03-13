// App.js
import React from 'react'
import { Routes, Route } from 'react-router-dom'  // Remove BrowserRouter from import
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Help from './pages/Help'
import PagesLayout from './components/Layout/PagesLayout'
import Login from './components/auth/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/Layout/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route element={<PagesLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
      </Route>

      {/* Auth Pages (Full Screen) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboards */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
        {/* Placeholder dashboards, replace with actual dashboard components later */}
        <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
      </Route>

      {/* 404 Catcher */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-3xl font-bold">404 - Page Not Found</div>} />
    </Routes>
  )
}

export default App
