import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlineDocumentReport,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineArrowNarrowRight,
  HiCheck,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineCog,
  HiOutlineViewGrid,
  HiOutlineChip
} from 'react-icons/hi';


const Stars = () => (
  <>
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white animate-pulse pointer-events-none"
        style={{
          top: `${(i * 37 + 7) % 100}%`,
          left: `${(i * 53 + 13) % 100}%`,
          width: i % 5 === 0 ? 3 : 1.5,
          height: i % 5 === 0 ? 3 : 1.5,
          opacity: 0.2,
          animationDuration: `${2 + (i % 3)}s`,
          animationDelay: `${(i % 4) * 0.5}s`,
        }}
      />
    ))}
  </>
);

// Animated counter hook
const useCountUp = (target, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    const isNumeric = !isNaN(parseFloat(target));
    if (!isNumeric) { setCount(target); return; }
    const end = parseFloat(target);
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end);
    };
    requestAnimationFrame(tick);
  }, [startCounting, target, duration]);
  return count;
};

const StatCard = ({ stat, idx, inView }) => {

  let rawValue = stat.value;
  let suffix = '';

  if (typeof stat.value === 'string') {
    if (stat.value.includes('/')) {
      const parts = stat.value.split('/');
      rawValue = parts[0];
      suffix = '/' + parts[1];
    } else {
      rawValue = stat.value.replace(/[^0-9.]/g, '');
      suffix = stat.value.replace(/[0-9.]/g, '');
    }
  }

  const isNumeric = rawValue !== '';
  const count = useCountUp(Number(rawValue), 1800, inView);

  const colors = [
    { accent: 'from-violet-400 to-indigo-400', iconBg: 'bg-violet-50', iconColor: 'text-violet-500', ring: 'border-violet-200', shimmer: 'bg-violet-100', dot: 'bg-violet-400' },
    { accent: 'from-emerald-400 to-teal-400',  iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', ring: 'border-emerald-200', shimmer: 'bg-emerald-100', dot: 'bg-emerald-400' },
    { accent: 'from-amber-400 to-orange-400',  iconBg: 'bg-amber-50',  iconColor: 'text-amber-500',  ring: 'border-amber-200',  shimmer: 'bg-amber-100',  dot: 'bg-amber-400' },
    { accent: 'from-pink-400 to-rose-400',     iconBg: 'bg-pink-50',   iconColor: 'text-pink-500',   ring: 'border-pink-200',   shimmer: 'bg-pink-100',   dot: 'bg-pink-400' },
  ];
  const c = colors[idx % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.13, type: 'spring', stiffness: 90, damping: 14 }}
      whileHover={{ y: -10, scale: 1.03 }}
      className="relative group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default flex flex-col items-center text-center p-7"
    >
      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.accent} group-hover:h-[3px] transition-all duration-300 rounded-t-3xl`} />

      {/* Rotating dashed rings (visible on hover) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 14 + idx * 4, ease: 'linear' }}
        className={`absolute -top-8 -right-8 w-28 h-28 rounded-full border-[2.5px] border-dashed ${c.ring} opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none`}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 20 + idx * 3, ease: 'linear' }}
        className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full border-[1.5px] border-dashed ${c.ring} opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Soft glow blob on hover */}
      <div className={`absolute inset-0 ${c.shimmer} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-3xl`} />

      {/* Pulse dot */}
      <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${c.dot} opacity-60`}>
        <span className={`absolute inset-0 rounded-full ${c.dot} opacity-50 animate-ping`} />
      </span>

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 10, scale: 1.18 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`w-14 h-14 rounded-2xl ${c.iconBg} flex items-center justify-center mb-5 mt-1 shadow-sm`}
      >
        <stat.icon className={`w-6 h-6 ${c.iconColor}`} />
      </motion.div>

      {/* Animated value */}
      <div className="text-4xl font-bold text-slate-800 mb-1 tracking-tight tabular-nums">
        {isNumeric ? `${count}${suffix}` : stat.value}
      </div>

      {/* Label */}
      <div className="text-sm font-medium text-slate-400 mb-5">{stat.label}</div>

      {/* Trend badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: idx * 0.13 + 0.55, type: 'spring' }}
        className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full"
      >
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, delay: idx * 0.25 }}
        >
          <HiOutlineTrendingUp className="w-3.5 h-3.5" />
        </motion.span>
        {stat.trend}
      </motion.div>

      {/* Bottom shimmer on hover */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.45 }}
        className={`absolute bottom-0 left-8 right-8 h-[3px] rounded-full origin-left bg-gradient-to-r ${c.accent}`}
      />
    </motion.div>
  );
};

const Home = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);

  const taglines = [
    { text: "Streamline Your Workflow", icon: HiOutlineCog },
    { text: "Empower Your Teams", icon: HiOutlineUsers },
    { text: "Track Progress Seamlessly", icon: HiOutlineChartBar },
    { text: "Achieve More Together", icon: HiOutlineSparkles }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [taglines.length]);

  // IntersectionObserver for stats section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsInView(true); },
      { threshold: 0.25 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: HiOutlineOfficeBuilding,
      title: 'Project Management',
      desc: 'Create projects, set deadlines, and monitor progress across teams.',
      gradient: 'from-slate-700 to-slate-800',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
      illustration: () => (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
          <rect x="10" y="10" width="100" height="60" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
          <rect x="18" y="18" width="26" height="8" rx="3" fill="#94a3b8" />
          <rect x="50" y="18" width="26" height="8" rx="3" fill="#7c3aed" opacity="0.4" />
          <rect x="82" y="18" width="26" height="8" rx="3" fill="#3b82f6" opacity="0.4" />
          <rect x="18" y="30" width="26" height="10" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.6" />
          <rect x="18" y="44" width="26" height="10" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.6" />
          <rect x="50" y="30" width="26" height="10" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.6" />
          <rect x="82" y="30" width="26" height="10" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.6" />
          <rect x="82" y="44" width="26" height="10" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="0.6" />
          <rect x="18" y="60" width="84" height="4" rx="2" fill="#e2e8f0" />
          <rect x="18" y="60" width="55" height="4" rx="2" fill="#475569" />
        </svg>
      ),
    },
    {
      icon: HiOutlineUsers,
      title: 'Team Coordination',
      desc: 'Assign Team Leaders, onboard interns in bulk, and manage hierarchies.',
      gradient: 'from-indigo-700 to-indigo-800',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-700',
      illustration: () => (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
          <circle cx="60" cy="38" r="13" fill="#e0e7ff" stroke="#a5b4fc" strokeWidth="1" />
          <circle cx="60" cy="33" r="5" fill="#6366f1" />
          <path d="M49 50c0-6 5-9 11-9s11 3 11 9" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="38" r="24" stroke="#c7d2fe" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="36" cy="26" r="8" fill="#ede9fe" stroke="#a5b4fc" strokeWidth="0.8" />
          <circle cx="36" cy="23" r="3" fill="#818cf8" />
          <path d="M30 33c0-4 3-5 6-5s6 1 6 5" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" fill="none" />
          <circle cx="84" cy="26" r="8" fill="#ede9fe" stroke="#a5b4fc" strokeWidth="0.8" />
          <circle cx="84" cy="23" r="3" fill="#818cf8" />
          <path d="M78 33c0-4 3-5 6-5s6 1 6 5" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" fill="none" />
          <circle cx="36" cy="54" r="8" fill="#ede9fe" stroke="#a5b4fc" strokeWidth="0.8" />
          <circle cx="36" cy="51" r="3" fill="#818cf8" />
          <path d="M30 61c0-4 3-5 6-5s6 1 6 5" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" fill="none" />
          <circle cx="84" cy="54" r="8" fill="#ede9fe" stroke="#a5b4fc" strokeWidth="0.8" />
          <circle cx="84" cy="51" r="3" fill="#818cf8" />
          <path d="M78 61c0-4 3-5 6-5s6 1 6 5" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" fill="none" />
          <line x1="44" y1="30" x2="50" y2="34" stroke="#c7d2fe" strokeWidth="0.8" />
          <line x1="76" y1="30" x2="70" y2="34" stroke="#c7d2fe" strokeWidth="0.8" />
          <line x1="44" y1="50" x2="50" y2="44" stroke="#c7d2fe" strokeWidth="0.8" />
          <line x1="76" y1="50" x2="70" y2="44" stroke="#c7d2fe" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      icon: HiOutlineDocumentReport,
      title: 'Daily Reporting',
      desc: 'Date-wise task submissions with status tracking and remarks.',
      gradient: 'from-emerald-700 to-emerald-800',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      illustration: () => (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
          <rect x="22" y="8" width="76" height="64" rx="5" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="0.8" />
          <path d="M82 8 L98 24 L82 24 Z" fill="#d1fae5" stroke="#bbf7d0" strokeWidth="0.8" />
          <rect x="30" y="30" width="60" height="3.5" rx="1.5" fill="#6ee7b7" />
          <rect x="30" y="38" width="45" height="3.5" rx="1.5" fill="#a7f3d0" />
          <rect x="30" y="46" width="52" height="3.5" rx="1.5" fill="#6ee7b7" opacity="0.6" />
          <rect x="30" y="54" width="38" height="3.5" rx="1.5" fill="#a7f3d0" opacity="0.5" />
          <circle cx="26" cy="31.5" r="2.5" fill="#10b981" />
          <circle cx="26" cy="39.5" r="2.5" fill="#f59e0b" />
          <circle cx="26" cy="47.5" r="2.5" fill="#10b981" />
          <circle cx="26" cy="55.5" r="2.5" fill="#ef4444" />
          <rect x="30" y="14" width="28" height="12" rx="3" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="0.6" />
          <line x1="30" y1="19" x2="58" y2="19" stroke="#6ee7b7" strokeWidth="0.6" />
        </svg>
      ),
    },
    {
      icon: HiOutlineChartBar,
      title: 'Analytics Dashboard',
      desc: 'Role-based dashboards for Admin & Manager with performance visibility.',
      gradient: 'from-amber-700 to-amber-800',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-700',
      illustration: () => (
        <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
          <line x1="12" y1="20" x2="112" y2="20" stroke="#fde68a" strokeWidth="0.6" />
          <line x1="12" y1="35" x2="112" y2="35" stroke="#fde68a" strokeWidth="0.6" />
          <line x1="12" y1="50" x2="112" y2="50" stroke="#fde68a" strokeWidth="0.6" />
          <line x1="12" y1="68" x2="112" y2="68" stroke="#fbbf24" strokeWidth="0.8" />
          <rect x="18" y="46" width="11" height="22" rx="3" fill="#fcd34d" />
          <rect x="34" y="32" width="11" height="36" rx="3" fill="#f59e0b" />
          <rect x="50" y="40" width="11" height="28" rx="3" fill="#fcd34d" />
          <rect x="66" y="24" width="11" height="44" rx="3" fill="#d97706" />
          <rect x="82" y="36" width="11" height="32" rx="3" fill="#fcd34d" />
          <rect x="98" y="18" width="11" height="50" rx="3" fill="#b45309" />
          <polyline points="23,46 39,32 55,40 71,24 87,36 103,18" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="3 2" />
          <circle cx="23" cy="46" r="2.5" fill="#92400e" />
          <circle cx="39" cy="32" r="2.5" fill="#92400e" />
          <circle cx="55" cy="40" r="2.5" fill="#92400e" />
          <circle cx="71" cy="24" r="2.5" fill="#92400e" />
          <circle cx="87" cy="36" r="2.5" fill="#92400e" />
          <circle cx="103" cy="18" r="2.5" fill="#92400e" />
        </svg>
      ),
    },
  ];

  const hierarchy = [
    { name: 'Admin', description: 'Oversight & Control', icon: '👑', color: 'from-purple-600 to-purple-700' },
    { name: 'Manager', description: 'Strategy & Planning', icon: '📊', color: 'from-blue-600 to-blue-700' },
    { name: 'Team Leader', description: 'Coordination & Guidance', icon: '👥', color: 'from-emerald-600 to-emerald-700' },
    { name: 'Interns', description: 'Execution & Learning', icon: '🎯', color: 'from-amber-600 to-amber-700' }
  ];

  const stats = [
    { value: '500+', label: 'Active Organizations', icon: HiOutlineOfficeBuilding, trend: '+28%' },
    { value: '10k+', label: 'Projects Managed', icon: HiOutlineDocumentReport, trend: '+156%' },
    { value: '98%', label: 'Satisfaction Rate', icon: HiOutlineTrendingUp, trend: '+12%' },
    { value: '24/7', label: 'Support Available', icon: HiOutlineClock, trend: 'Always' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans overflow-hidden">
      {/* Hero Section with Card */}
      <section className="pt-24 pb-20 px-4 relative overflow-hidden">
        <motion.div 
          animate={{ x: [0, 30, -20, 0], y: [0, -50, 20, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-slate-200/30 to-indigo-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, -30, 20, 0], y: [0, 50, -20, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-amber-200/20 to-rose-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
        ></motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-full px-4 py-2 mb-6 shadow-lg leading-none"
              >
                <HiOutlineSparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium tracking-wide">TASK MANAGEMENT SYSTEM</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl lg:text-6xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-600 bg-clip-text text-transparent">
                  TMS
                </span>
              </motion.h1>

              <div className="h-20 mb-6">
                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTagline}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-2xl lg:text-3xl font-semibold text-slate-600 flex items-center gap-3"
                    >
                      {taglines[currentTagline].text}
                    </motion.div>
                  </AnimatePresence>
                  {/* <motion.span 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }} 
                    className="text-indigo-500 text-3xl font-light"
                  >
                    |
                  </motion.span> */}
                </div>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg"
              >
                Role-based project management system for modern organizations.
                Streamline projects, empower teams, and track daily work with
                intelligent monitoring and analytics.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/register"
                  className="group px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105 duration-300"
                >
                  Get Started
                  <motion.span 
                    animate={{ x: [0, 4, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <HiOutlineArrowNarrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all transform hover:scale-105 duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
              className="relative"
            >
              <motion.div 
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl"
              ></motion.div>
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl  border-slate-200 p-6 transform hover:scale-[1.02] transition-all duration-500">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <HiOutlineChip className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 leading-tight">TaskFlow TMS</h3>
                      <p className="text-xs text-slate-500">Enterprise Edition</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4 border border-slate-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Projects</span>
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 1 }}
                        className="text-xs font-semibold text-emerald-600"
                      >
                        +23%
                      </motion.span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 mb-2">24</div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                      ></motion.div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">8 projects due this week</p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm transition-all duration-300"
                    >
                      <HiOutlineUsers className="w-5 h-5 text-indigo-500 mb-2" />
                      <div className="text-xl font-bold text-slate-800">48</div>
                      <div className="text-xs text-slate-500">Team Members</div>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-slate-50 rounded-xl p-3 border border-slate-200 shadow-sm transition-all duration-300"
                    >
                      <HiOutlineClock className="w-5 h-5 text-emerald-500 mb-2" />
                      <div className="text-xl font-bold text-slate-800">92%</div>
                      <div className="text-xs text-slate-500">On-time Delivery</div>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold hover:scale-110 hover:z-10 transition-transform duration-300 cursor-pointer">JD</div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold hover:scale-110 hover:z-10 transition-transform duration-300 cursor-pointer">MK</div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold hover:scale-110 hover:z-10 transition-transform duration-300 cursor-pointer">AL</div>
                      <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-bold hover:scale-110 hover:z-10 transition-transform duration-300 cursor-pointer">+12</div>
                    </div>
                    <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                      View Workplace
                      <HiOutlineArrowNarrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hierarchy Flow */}
      <section className="py-20 px-4 bg-white shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 mb-4"
            >
              <HiOutlineViewGrid className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Organizational Structure</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-slate-800 mb-4"
            >
              Clear Role-Based Hierarchy
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-600 max-w-2xl mx-auto"
            >
              Streamlined management flow from strategic oversight to operational execution
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {hierarchy.map((role, idx) => (
              <React.Fragment key={role.name}>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group relative"
                >
                  <div className={`bg-gradient-to-br ${role.color} rounded-2xl shadow-lg px-6 py-4 min-w-[140px] text-center transition-all duration-300 cursor-pointer`}>
                    <motion.div whileHover={{ rotate: 10, scale: 1.2 }} className="text-3xl mb-2 flex justify-center">
                      {role.icon}
                    </motion.div>
                    <span className="text-lg font-semibold text-white block">{role.name}</span>
                    <span className="text-xs text-white/80 block mt-1">{role.description}</span>
                  </div>
                </motion.div>
                {idx < hierarchy.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.1 }}
                    className="hidden md:flex items-center"
                  >
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <HiOutlineArrowNarrowRight className="w-5 h-5 text-slate-400" />
                    </motion.div>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 text-slate-600 bg-slate-50 px-6 py-2 rounded-full border border-slate-200 hover:shadow-md transition-shadow duration-300">
              <HiCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-sm">Clear responsibility flow from leadership to execution level</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 border bg-indigo-50"
              style={{ borderColor: "rgba(129,140,248,0.35)" }}
            >
              <HiOutlineSparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Powerful Features</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold mb-4 text-slate-800"
            >
              Everything You Need to Succeed
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto text-lg text-slate-600"
            >
              Comprehensive tools for project management, team coordination, and performance tracking
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Illustration = feature.illustration;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    background: "white",
                    border: "1px solid #f1f5f9",
                    transition: "border-color .3s, background .3s, box-shadow .3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#e0e7ff";
                    e.currentTarget.style.boxShadow = "0 10px 40px rgba(99,102,241,0.12)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#f1f5f9";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className={`h-[3px] w-full bg-gradient-to-r ${feature.gradient} group-hover:h-[4px] transition-all duration-300`} />
                  <div className="w-full h-28 px-4 pt-4">
                    <Illustration />
                  </div>
                  <div className="px-5 pb-5 pt-3">
                    <div className={`w-10 h-10 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-base font-semibold mb-2 text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── modern, light, animated ── */}
      <section ref={statsRef} className="py-24 px-4 relative z-10 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50/30">

        {/* Large decorative background rings */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-indigo-100/60 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full border border-violet-100/50 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full border border-slate-100/70 pointer-events-none" />

        {/* Floating soft blobs */}
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
          className="absolute top-10 right-20 w-32 h-32 rounded-full bg-violet-100/40 blur-2xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-10 left-16 w-40 h-40 rounded-full bg-indigo-100/30 blur-2xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 right-10 w-20 h-20 rounded-full bg-emerald-100/30 blur-xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Section header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            >
              <motion.span
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <HiOutlineTrendingUp className="w-3.5 h-3.5" />
              </motion.span>
              Trusted Worldwide
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3"
            >
              Numbers that speak for themselves
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-slate-500 text-base max-w-xl mx-auto"
            >
              Real impact across organizations, teams, and daily operations
            </motion.p>
          </div>

          {/* Stat cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {stats.map((stat, idx) => (
    <StatCard key={idx} stat={stat} idx={idx} inView={statsInView} />
  ))}
</div>

          {/* Bottom trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-14 flex flex-wrap justify-center gap-6"
          >
            {['No credit card required', 'Free 14-day trial', 'Cancel anytime', '24/7 support'].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06, y: -2 }}
                className="flex items-center gap-2 bg-white border border-slate-100 shadow-sm rounded-full px-5 py-2 text-sm text-slate-600 font-medium cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-indigo-800"></div>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}
            />
            <div className="relative z-10 p-12 md:p-16 text-center text-white">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold mb-6"
              >
                Ready to Transform Your Workflow?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto leading-relaxed"
              >
                Join thousands of organizations that trust TaskFlow for efficient project management and team collaboration.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  Start Free Trial
                  <HiOutlineArrowNarrowRight className="w-5 h-5 text-slate-600" />
                </Link>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 text-sm mt-8 font-medium"
              >
                No credit card required • Free 14-day trial
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;