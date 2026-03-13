import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await axios.post('/api/v1/tms/auth/user/login', formData);
      const userData = res.data.data;
      // Token lives in httpOnly cookie on the backend; store user info in context
      login(userData?.accessToken || 'cookie-auth', userData);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.div
      initial="hidden" animate="visible" variants={containerVariants}
      className="min-h-screen flex bg-white"
    >
      {/* Left Panel */}
      <motion.div
        initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900" />
        <motion.img
          initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1932&auto=format&fit=crop"
          alt="Workspace" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Back to home */}
          <Link to="/" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-fit">
            <FaArrowLeft size={13} />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div>
            <motion.div variants={itemVariants}>
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8">
                <FaLock className="text-blue-300 text-xl" />
              </div>
              <h1 className="text-5xl font-black mb-4 leading-tight">Welcome<br />Back</h1>
              <p className="text-blue-200 text-lg max-w-xs">Your tasks are waiting. Log in to stay on top of your goals.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-12 space-y-4">
              {['Secure JWT Authentication', 'Role-based Access Control', 'Real-time Updates'].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-300" />
                  <span className="text-blue-100 text-sm">{f}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <p className="text-blue-300 text-xs">Task Management System © 2025</p>
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative bg-gray-50">

        {/* Mobile back link */}
        <Link to="/" className="lg:hidden flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 w-fit">
          <FaArrowLeft size={13} />
          <span className="text-sm font-semibold">Back to Home</span>
        </Link>

        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-50"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="text-green-500 text-8xl mb-6">
                <FaCheckCircle />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900">Welcome back!</h2>
              <p className="text-gray-500 mt-2">Redirecting to your dashboard…</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-sm w-full mx-auto">
          <motion.div variants={itemVariants} className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500">Welcome back! Please enter your details.</p>
            {errorMsg && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-red-600 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                {errorMsg}
              </motion.p>
            )}
          </motion.div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaEnvelope size={14} />
              </div>
              <input
                name="email" type="email" required onChange={handleChange}
                placeholder="Email address"
                className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-gray-900 bg-white focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm"
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaLock size={14} />
              </div>
              <input
                name="password" type={showPassword ? 'text' : 'password'} required onChange={handleChange}
                placeholder="Password"
                className="block w-full pl-11 pr-12 py-4 border-2 border-gray-200 rounded-2xl text-gray-900 bg-white focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors">
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </motion.div>

            {/* Remember / Forgot */}
            <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
            </motion.div>

            {/* Submit */}
            <motion.button
              variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={isSubmitting} type="submit"
              className={`w-full py-4 text-sm font-black rounded-2xl text-white transition-all shadow-lg shadow-blue-200 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in…
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="text-center mt-8 text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-blue-600 hover:text-blue-700 transition-colors">Register now</Link>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
