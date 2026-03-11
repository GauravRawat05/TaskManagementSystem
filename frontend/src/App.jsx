// App.js
import React from 'react'
import { Routes, Route } from 'react-router-dom'  // Remove BrowserRouter from import
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Help from './pages/Help'
import PagesLayout from './components/Layout/PagesLayout'

const App = () => {
  return (
    <Routes>  {/* Just Routes, no BrowserRouter */}
      <Route element={<PagesLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
      </Route>
    </Routes>
  )
}

export default App
