import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineMail,
  HiOutlineQuestionMarkCircle,
  HiOutlineBell,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiOutlineMenu,
  HiOutlineX,
  HiCheck
} from 'react-icons/hi'
import { Athenura_Title_Image } from '../../assets'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const navLinks = [
    { id: 'home', path: '/', label: 'Home', icon: HiOutlineHome },
    { id: 'about', path: '/about', label: 'About', icon: HiOutlineInformationCircle },
    { id: 'contact', path: '/contact', label: 'Contact', icon: HiOutlineMail },
    { id: 'help', path: '/help', label: 'Help', icon: HiOutlineQuestionMarkCircle }
  ]

  // Handle scroll effect for transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine if link is active based on current path
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100/50'
        : 'bg-transparent backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo and brand */}
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <img
                src={Athenura_Title_Image}
                alt="Athenura"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400 ring-offset-2 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="hidden sm:block text-xs text-gray-500 font-medium">
                Organize Your Success
              </span>
            </div>
          </Link>

          {/* Center - Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = isActiveLink(link.path)

              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                    }`} />
                    <span>{link.label}</span>
                  </span>

                  {/* Animated underline for active link */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side - Login button and actions */}
          <div className="flex items-center space-x-4">
            {/* Notification icon */}
            {/* <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 group">
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
            </button> */}

            {/* Enhanced Login Button */}
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              Login
            </Link>

            {/* Enhanced Register Button */}
            <Link
              to="/register"
              className="relative px-6 py-2.5 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <HiOutlineUserAdd className="w-4 h-4" />
                <span>Sign Up</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <HiOutlineX className="w-6 h-6" />
              ) : (
                <HiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-in-out ${
          isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-white'
        } border-t border-blue-100 shadow-lg ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = isActiveLink(link.path)

            return (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className="font-medium">{link.label}</span>
                {isActive && (
                  <HiCheck className="w-5 h-5 ml-auto text-blue-600" />
                )}
              </Link>
            )
          })}

          {/* Mobile login button */}
          <Link
            to="/login"
            className="w-full mt-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <HiOutlineLogin className="w-5 h-5" />
            <span>Login</span>
          </Link>

          {/* Mobile register button */}
          <Link
            to="/register"
            className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <HiOutlineUserAdd className="w-5 h-5" />
            <span>Sign Up</span>
          </Link>
        </div>
      </div>

      {/* Decorative bottom border gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-500 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      } bg-gradient-to-r from-transparent via-blue-400 to-transparent`}></div>
    </nav>
  )
}

export default Navbar
