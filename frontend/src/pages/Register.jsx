import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft, FaPhone, FaKey } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Register = () => {
  const [role, setRole] = useState('manager');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    secretKey: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await axios.post('/api/v1/tms/auth/user/register', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        secretKey: formData.secretKey,
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
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

  const panelColors = {
    manager: 'from-blue-700 via-blue-600 to-indigo-800',
    admin: 'from-violet-700 via-purple-600 to-indigo-900',
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
        <motion.div
          animate={{ background: `linear-gradient(to bottom right, ${role === 'admin' ? '#6d28d9, #7c3aed, #312e81' : '#1d4ed8, #2563eb, #312e81'})` }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        />
        <motion.img
          initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
          alt="Office" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link to="/" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors w-fit">
            <FaArrowLeft size={13} />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div>
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl font-black mb-4 leading-tight">Master Your<br />Workflow</h1>
              <p className="text-blue-200 text-lg max-w-xs">Join the team and start managing projects, interns and tasks efficiently.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-10 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-xs text-blue-200 mb-1 uppercase tracking-widest font-bold">Currently Registering As</p>
              <p className="text-2xl font-black capitalize">{role}</p>
              <p className="text-blue-300 text-sm mt-1">
                {role === 'manager' ? 'Can create projects, upload interns & manage teams.' : 'Super user — full system visibility and control.'}
              </p>
            </motion.div>
          </div>
          <p className="text-blue-300 text-xs">Task Management System © 2025</p>
        </div>
      </motion.div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative bg-gray-50">

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
              <h2 className="text-3xl font-black text-gray-900">Account Created!</h2>
              <p className="text-gray-500 mt-2">Welcome to the team. Redirecting to login…</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-sm w-full mx-auto">
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500 text-sm">Join us and start managing your tasks efficiently</p>
            {errorMsg && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-red-600 font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                {errorMsg}
              </motion.p>
            )}
          </motion.div>

          {/* Role Toggle */}
          <motion.div variants={itemVariants} className="flex gap-3 mb-6 p-1 bg-gray-200 rounded-2xl">
            {['manager', 'admin'].map(r => (
              <button
                key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${role === r ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {r}
              </button>
            ))}
          </motion.div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Full Name */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaUser size={13} />
              </div>
              <input name="fullName" type="text" required onChange={handleChange} placeholder="Full Name"
                className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm" />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaEnvelope size={13} />
              </div>
              <input name="email" type="email" required onChange={handleChange} placeholder="Email address"
                className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm" />
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaPhone size={13} />
              </div>
              <input name="phone" type="tel" required onChange={handleChange} placeholder="Phone Number"
                className="block w-full pl-11 pr-4 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm" />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaLock size={13} />
              </div>
              <input name="password" type={showPassword ? 'text' : 'password'} required onChange={handleChange} placeholder="Password"
                className="block w-full pl-11 pr-12 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors">
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </motion.div>

            {/* Secret Key */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                <FaKey size={13} />
              </div>
              <input name="secretKey" type={showSecretKey ? 'text' : 'password'} required onChange={handleChange}
                placeholder={role === 'admin' ? 'Admin Secret Key' : 'Manager Secret Key'}
                className="block w-full pl-11 pr-12 py-4 border-2 border-blue-200 bg-blue-50 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 transition-all placeholder-gray-400 text-sm" />
              <button type="button" onClick={() => setShowSecretKey(!showSecretKey)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors">
                {showSecretKey ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </motion.div>
            <motion.p variants={itemVariants} className="text-xs text-gray-400 pl-1">
              {role === 'admin' ? '🔐 Enter the Admin secret key provided by your system administrator.' : '🔑 Enter the Manager secret key to register as a manager.'}
            </motion.p>

            {/* Submit */}
            <motion.button
              variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={isSubmitting} type="submit"
              className={`w-full py-4 text-sm font-black rounded-2xl text-white transition-all shadow-lg shadow-blue-200 mt-2 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account…
                </span>
              ) : 'Sign Up'}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="text-center mt-6 text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-blue-600 hover:text-blue-700 transition-colors">Login here</Link>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;