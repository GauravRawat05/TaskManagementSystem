import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineMail,
  HiOutlineQuestionMarkCircle,
  HiOutlineBell,
  HiOutlineLogin,
  HiOutlineMenu,
  HiOutlineX,
  HiCheck,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineBriefcase,
  HiOutlineSparkles
} from 'react-icons/hi'
import { Athenura_Title_Image } from '../../assets'

import {useAuth} from '../../context/AuthContext'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { id: 'home', path: '/', label: 'Home', icon: HiOutlineHome },
    { id: 'about', path: '/about', label: 'About', icon: HiOutlineInformationCircle },
    { id: 'contact', path: '/contact', label: 'Contact', icon: HiOutlineMail },
    { id: 'help', path: '/help', label: 'Help', icon: HiOutlineQuestionMarkCircle }
  ]

  const { user, logout } = useAuth()

  // Handle scroll effect for transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isUserMenuOpen])

  // Determine if link is active based on current path
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleWorkplaceClick = () => {
    navigate('/workplace')
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-white/98 backdrop-blur-md shadow-xl border-b border-gray-100'
        : 'bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo and brand */}
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              {/*  */}
                <img
                  src={Athenura_Title_Image}
                  alt="Logo"
                  className="w-15 h-15 rounded-xl"
                />
            </div>
            <div className="flex flex-col">
<span className="text-xl font-bold bg-linear-to-r from-blue-500 via-blue-700 to-black [background-size:200%_200%] animate-gradient bg-clip-text text-transparent">
  TMS
</span>
              <span className="text-[10px] tracking-wider text-black font-medium">
                Task Management System
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
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-400'
                    }`} />
                    <span>{link.label}</span>
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Right side - Auth buttons or User menu */}
          <div className="flex items-center space-x-4">
            {/* Notification icon - only show when logged in */}
            {user && (
              <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-all duration-300 group">
                <HiOutlineBell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-red-400 to-red-500 rounded-full border-2 border-white"></span>
              </button>
            )}

            {/* Conditional rendering based on authentication */}
            {user ? (
              /* User is logged in - Show elegant user menu */
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-full hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user.name?.split(' ')[0] || 'User'}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fadeInDown overflow-hidden">
                    <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/30 to-transparent">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold shadow-md">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <HiOutlineUserCircle className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>

                    <button
                      onClick={handleWorkplaceClick}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <HiOutlineBriefcase className="w-4 h-4" />
                      <span>Go to Workplace</span>
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <HiOutlineLogout className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* User is not logged in - Show elegant single login button */
              <Link
                to="/login"
                className="group relative px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <HiOutlineLogin className="w-4 h-4" />
                  <span>Login</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 focus:outline-none"
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

      {/* Mobile menu with elegant animation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-in-out ${
          isScrolled ? 'bg-white/98 backdrop-blur-md' : 'bg-white'
        } border-t border-gray-100 shadow-2xl ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
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
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <span className="font-medium">{link.label}</span>
                {isActive && (
                  <HiCheck className="w-4 h-4 ml-auto text-blue-600" />
                )}
              </Link>
            )
          })}

          {/* Mobile auth based on login status */}
          {user ? (
            <>
              <div className="flex items-center space-x-3 px-4 py-4 border-t border-gray-100 mt-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold shadow-md">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleWorkplaceClick}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <HiOutlineBriefcase className="w-5 h-5" />
                <span>Go to Workplace</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <HiOutlineLogout className="w-5 h-5" />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full mt-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-lg transform transition-all duration-300 flex items-center justify-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HiOutlineLogin className="w-5 h-5" />
              <span>Login to TMS</span>
            </Link>
          )}
        </div>
      </div>

      {/* Elegant bottom border gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      } bg-gradient-to-r from-transparent via-blue-400/50 to-transparent`}></div>
    </nav>
  )
}

export default Navbar
