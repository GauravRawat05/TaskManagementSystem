import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaKey, FaArrowRight, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    adminSecretKey: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    console.log('Registration Data:', { ...formData, role });
    
    // Reset success after 3 seconds or redirect
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex bg-white overflow-hidden" 
      style={{ minHeight: "calc(100vh - 80px)", marginTop: "80px" }}
    >
      {/* Left Side - Image */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-shrink-0"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-600/90 to-indigo-900/90" />
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
          alt="Productivity"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center px-12 text-white">
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl font-black mb-4">Master Your Workflow</h1>
            <p className="text-xl text-blue-100 max-w-md">
              Join thousands of professionals who manage their tasks with ATHENURA.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-4 group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <FaArrowRight className="text-blue-300" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">Smart Organization</h3>
                <p className="text-blue-200">Keep all your tasks in one place.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 overflow-y-auto bg-gray-50/30 relative">
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
            >
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="text-green-500 text-7xl mb-4"
              >
                <FaCheckCircle />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900">Account Created!</h2>
              <p className="text-gray-500 mt-2">Welcome to the team. Redirecting...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-md w-full mx-auto">
          <motion.div variants={itemVariants} className="text-left mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">
              Join us and start managing your tasks efficiently
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-[1.02] ${
                role === 'user'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-gray-200'
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-[1.02] ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-gray-200'
              }`}
            >
              Admin
            </button>
          </motion.div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <FaUser />
                </div>
                <input
                  name="fullName"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all placeholder-gray-400 bg-white hover:border-gray-200"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <FaEnvelope />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all placeholder-gray-400 bg-white hover:border-gray-200"
                  placeholder="Email address"
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <FaLock />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all placeholder-gray-400 bg-white hover:border-gray-200"
                  placeholder="Password"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </motion.div>

              <AnimatePresence>
                {role === 'admin' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0, y: -20 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -20 }}
                    className="relative group overflow-hidden"
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500">
                      <FaKey />
                    </div>
                    <input
                      name="adminSecretKey"
                      type="password"
                      required
                      className="block w-full pl-12 pr-4 py-4 border-2 border-blue-100 bg-blue-50 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all"
                      placeholder="Admin Secret Key"
                      onChange={handleChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className={`w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white transition-all duration-300 shadow-xl shadow-blue-100 ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : 'Sign Up'}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="text-center mt-8">
            <span className="text-gray-500">Already have an account? </span>
            <Link
              to="/login"
              className="font-black text-blue-600 hover:text-blue-700 transition-colors"
            >
              Login here
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;