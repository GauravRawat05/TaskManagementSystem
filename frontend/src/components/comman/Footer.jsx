import React from 'react'
import { Athenura_Nav_Image, Athenura_Title_Image } from '../../assets'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white text-blue-900 border-t border-blue-100">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={Athenura_Nav_Image}
                alt="Athenura"
                className="w-60 h-20 object-cover border-blue-200"
              />
            </div>
            <p className="text-blue-600 text-sm">
              Your trusted platform for all your needs. We're here to help you succeed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="#help" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#faq" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Contact Us</h3>
            <ul className="space-y-3 text-blue-600">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Business Street, NY 10001</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@athenura.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar with copyright */}
      <div className="border-t border-blue-100 bg-blue-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-700">
            <p>© {currentYear} Athenura. All rights reserved.</p>
            <div className="flex gap-6 mt-2 md:mt-0">
              <a href="#privacy" className="hover:text-blue-900 transition-colors duration-300">Privacy</a>
              <a href="#terms" className="hover:text-blue-900 transition-colors duration-300">Terms</a>
              <a href="#cookies" className="hover:text-blue-900 transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Decorative blue wave or accent */}
      <div className="h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300"></div>
    </footer>
  )
}

export default Footer
