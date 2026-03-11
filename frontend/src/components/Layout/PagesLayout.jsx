import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../comman/Navbar'
import Footer from '../comman/Footer'

const PagesLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Ensure Navbar has proper z-index if it's getting hidden */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default PagesLayout
