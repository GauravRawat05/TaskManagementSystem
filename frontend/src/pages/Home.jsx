import React, { useState } from 'react';
// Importing specific icons from React Icons
import {
  HiPlus,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineChartPie,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineStar,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineUsers,
  HiOutlinePlay,
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineChat,
  HiOutlineDeviceMobile,
  HiOutlineCloud,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { MdOutlineAssignment, MdOutlineDashboard, MdOutlineTrendingUp, MdOutlineWorkspacePremium } from "react-icons/md";
import { RiTaskLine, RiProgress5Line, RiTimerLine, RiTeamLine, RiNotificationLine } from "react-icons/ri";

const Home = () => {
  const [email, setEmail] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [activeDemo, setActiveDemo] = useState('tasks');

  // Features showcase for new users
  const features = [
    {
      icon: <RiTaskLine className="text-3xl" />,
      title: 'Smart Task Management',
      description: 'Create, organize, and prioritize tasks with ease. Set deadlines, add descriptions, and track progress.',
      color: 'from-blue-500 to-blue-600',
      demo: 'tasks',
      image: '📋'
    },
    {
      icon: <HiOutlineCalendar className="text-3xl" />,
      title: 'Deadline Tracking',
      description: 'Never miss a deadline with visual calendars, reminders, and smart notifications.',
      color: 'from-blue-500 to-cyan-500',
      demo: 'calendar',
      image: '📅'
    },
    {
      icon: <RiProgress5Line className="text-3xl" />,
      title: 'Progress Tracking',
      description: 'Watch your productivity grow with visual progress bars and completion metrics.',
      color: 'from-blue-500 to-purple-500',
      demo: 'progress',
      image: '📊'
    },
    {
      icon: <RiTeamLine className="text-3xl" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with shared tasks, comments, and real-time updates.',
      color: 'from-blue-500 to-indigo-500',
      demo: 'team',
      image: '👥'
    },
    {
      icon: <HiOutlineChartBar className="text-3xl" />,
      title: 'Personal Analytics',
      description: 'Understand your productivity patterns with detailed insights and reports.',
      color: 'from-blue-500 to-green-500',
      demo: 'analytics',
      image: '📈'
    },
    {
      icon: <HiOutlineDeviceMobile className="text-3xl" />,
      title: 'Mobile Ready',
      description: 'Access your tasks anywhere with our fully responsive mobile app.',
      color: 'from-blue-500 to-pink-500',
      demo: 'mobile',
      image: '📱'
    }
  ];

  // How it works steps
  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Account',
      description: 'Sign up for free in less than 30 seconds. No credit card required.',
      icon: '✍️'
    },
    {
      step: '02',
      title: 'Add Your First Task',
      description: 'Start by adding tasks, setting deadlines, and organizing your work.',
      icon: '📝'
    },
    {
      step: '03',
      title: 'Track Progress',
      description: 'Watch your productivity grow as you complete tasks and meet deadlines.',
      icon: '📈'
    },
    {
      step: '04',
      title: 'Achieve More',
      description: 'Use insights to improve and accomplish more every day.',
      icon: '🏆'
    }
  ];

  // Demo data to showcase what users can do
  const demoContent = {
    tasks: [
      { title: 'Design homepage mockup', status: 'in-progress', progress: 75, priority: 'high' },
      { title: 'Write project proposal', status: 'todo', progress: 0, priority: 'medium' },
      { title: 'Review team feedback', status: 'completed', progress: 100, priority: 'low' },
    ],
    calendar: [
      { date: 'Today', events: ['Team meeting at 10am', 'Submit report by 5pm'] },
      { date: 'Tomorrow', events: ['Client call', 'Design review'] },
    ]
  };

  // Testimonials from real users
  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Freelance Designer',
      content: 'This app transformed how I manage my freelance work. I went from missing deadlines to finishing projects early!',
      avatar: 'AT',
      achievement: 'Completed 45+ projects on time',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: 'Student',
      content: 'As a student with multiple assignments, this helps me track everything. My grades improved because I never miss deadlines now.',
      avatar: 'PP',
      achievement: '3.8 → 4.2 GPA',
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'Small Business Owner',
      content: 'Finally found a tool that helps me juggle all aspects of my business. The progress tracking keeps me motivated.',
      avatar: 'JW',
      achievement: 'Doubled daily task completion',
      rating: 5
    }
  ];

  // Stats that matter to new users
  const stats = [
    { value: '500K+', label: 'Active Users', icon: '👥' },
    { value: '10M+', label: 'Tasks Completed', icon: '✅' },
    { value: '95%', label: 'Meet Deadlines', icon: '🎯' },
    { value: '4.9★', label: 'User Rating', icon: '⭐' }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 10 tasks per day',
        'Basic deadline tracking',
        'Personal dashboard',
        'Mobile access',
        'Email support'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$8',
      period: 'per month',
      features: [
        'Unlimited tasks',
        'Advanced analytics',
        'Team collaboration (up to 5)',
        'Priority support',
        'Custom tags & filters',
        'Deadline reminders'
      ],
      buttonText: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Team',
      price: '$20',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Admin controls',
        'API access',
        'Dedicated account manager',
        'Custom integrations'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setShowSubscribeModal(true);
      setEmail('');
      setTimeout(() => setShowSubscribeModal(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section - For new users */}
      <section className="pt-16 pb-20 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Value proposition */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <HiOutlineSparkles className="text-lg" />
                <span>Join 500,000+ users achieving more every day</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                <span className="text-gray-900">
                  Master Your Tasks,
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Meet Every Deadline
                </span>
              </h1>

              <p className="text-xl text-gray-500 mb-8 max-w-lg">
                The simple, powerful way to organize your work, track progress, and achieve your goals. Join thousands of productive people today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-lg flex items-center gap-2 justify-center">
                  Start For Free <HiOutlineArrowRight className="text-xl" />
                </button>
                <button className="border-2 border-blue-200 text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all text-lg flex items-center gap-2 justify-center">
                  <HiOutlinePlay className="text-xl" /> Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">10,000+</span> people joined this week
                </p>
              </div>
            </div>

            {/* Right side - Visual showcase */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-sm text-gray-400">My Tasks Dashboard</span>
                </div>

                {/* Demo tasks */}
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">Design homepage</span>
                      <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">In Progress</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Due today</span>
                      <span>75% done</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">Write project proposal</span>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Todo</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Due tomorrow</span>
                      <span>Not started</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">Review feedback</span>
                      <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Completed</span>
                      <span>🎉 Great job!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar className="text-blue-600" />
                  <span className="text-sm font-medium">3 deadlines today</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-lg shadow-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <HiOutlineCheckCircle className="text-green-500" />
                  <span className="text-sm font-medium">12 tasks done this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-8 border-t border-blue-100">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Stay Productive</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Powerful features designed to help you organize tasks, track deadlines, and achieve more every day.
            </p>
          </div>

          {/* Feature tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['tasks', 'calendar', 'progress', 'team', 'analytics', 'mobile'].map((demo) => (
              <button
                key={demo}
                onClick={() => setActiveDemo(demo)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  activeDemo === demo
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {demo}
              </button>
            ))}
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl border transition-all ${
                  activeDemo === feature.demo
                    ? 'border-blue-300 shadow-xl shadow-blue-100 scale-105'
                    : 'border-blue-100 hover:border-blue-200 hover:shadow-lg'
                }`}
              >
                <div className="text-4xl mb-4">{feature.image}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>

                {activeDemo === feature.demo && (
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <span className="text-blue-600 text-sm font-medium">✨ Popular feature</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Get Started in
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> 4 Simple Steps</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Join thousands of users who transformed their productivity in minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-2xl border border-blue-100 text-center relative z-10">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="text-sm text-blue-600 font-bold mb-2">{step.step}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-2xl text-blue-300">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-2">
              Start Your Journey Today <HiOutlineArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* What Users Achieve */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              What Our
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Users Achieve</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Real stories from real people who transformed their productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <HiOutlineStar key={i} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">✨ {testimonial.achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
    

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Ready to Master Your Tasks?
          </h2>
          <p className="text-white/90 text-xl mb-10">
            Join 500,000+ users who are already achieving more every day.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap"
            >
              Get Started Free
            </button>
          </form>

          <p className="text-white/70 text-sm mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Success Modal */}
      {showSubscribeModal && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-up z-50">
          <div className="flex items-center gap-3">
            <HiOutlineCheckCircle className="text-2xl" />
            <span className="font-medium">Thanks! Check your email to get started.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
