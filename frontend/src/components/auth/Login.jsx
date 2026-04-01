import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return setError('Please fill all fields');
    }

    try {
      setLoading(true);

      await login(form);

      setSuccess(true);

      setTimeout(() => {
        navigate('/workspaces');
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex bg-white"
    >
      {/* LEFT SIDE */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        <motion.div
          animate={{ background: `linear-gradient(to bottom right, #1e40af, #1e3a8a, #312e81)` }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        />

        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1932&auto=format&fit=crop"
          alt="workspace"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-fit">
            <FaArrowLeft size={13} />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>

          <div>
            <motion.div variants={itemVariants}>
              <FaLock className="text-4xl mb-6" />
              <h1 className="text-5xl font-black mb-4 leading-tight">Welcome Back</h1>
              <p className="text-blue-200 text-lg">Manage your tasks efficiently and stay productive.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-xs text-blue-200 mb-1 uppercase tracking-widest font-bold">Features</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">✓ Secure Authentication</li>
                <li className="flex items-center gap-2">✓ Workspace Management</li>
                <li className="flex items-center gap-2">✓ Real-time Sync</li>
              </ul>
            </motion.div>
          </div>

          <p className="text-blue-300 text-xs">Task Management System © 2026</p>
        </div>
      </motion.div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative bg-gray-50">

        <Link to="/" className="lg:hidden flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 w-fit">
          <FaArrowLeft size={13} />
          <span className="text-sm font-semibold">Back to Home</span>
        </Link>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="text-green-500 text-8xl mb-6"
              >
                <FaCheckCircle />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900">Login Successful!</h2>
              <p className="text-gray-500 mt-2">Welcome back. Redirecting to workspaces…</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-sm w-full mx-auto">
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500 text-sm">Enter your credentials to access your account</p>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm text-red-600 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* EMAIL */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaEnvelope size={13} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm"
              />
            </motion.div>

            {/* PASSWORD */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaLock size={13} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="block w-full pl-11 pr-12 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </motion.div>

            {/* OPTIONS */}
            <motion.div variants={itemVariants} className="flex justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link to="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Forgot password?
              </Link>
            </motion.div>

            {/* BUTTON */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-sm font-black rounded-2xl text-white transition-all shadow-lg shadow-blue-200 mt-2 ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in…
                </span>
              ) : 'Login'}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="text-center mt-6 text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-blue-600 hover:text-blue-700 transition-colors">
              Register here
            </Link>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
