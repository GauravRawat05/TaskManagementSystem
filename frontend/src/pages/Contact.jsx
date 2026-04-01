import React, { useState } from 'react';
import { HiOutlineMail, HiOutlineOfficeBuilding, HiOutlinePhone, HiOutlineClock, HiCheck, HiLocationMarker, HiOutlineSparkles } from 'react-icons/hi';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFocus = (field) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field) => setFocused({ ...focused, [field]: false });

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-slideUp">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-sky-100 rounded-full px-4 py-1.5 mb-6 shadow-sm border border-blue-200 animate-scaleIn">
            <HiOutlineSparkles className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">We'd Love to Hear From You</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-800 via-blue-600 to-sky-600 bg-clip-text text-transparent mb-4 animate-fadeIn">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slideUp animation-delay-200">
            Have questions about TaskFlow? Our team is here to help you streamline your project management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-blue-100 animate-slideRight">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-sky-600 rounded-full animate-slideRight"></div>
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    focused.name
                      ? 'border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              <div className="relative animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    focused.email
                      ? 'border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              <div className="relative animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={() => handleBlur('message')}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none ${
                    focused.message
                      ? 'border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] animate-fadeIn"
                style={{ animationDelay: '400ms' }}
              >
                Send Message
              </button>
              {submitted && (
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl animate-fadeIn">
                  <HiCheck className="w-5 h-5" />
                  <p>Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100 animate-slideUp animation-delay-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-sky-600 rounded-full"></div>
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300 animate-slideRight" style={{ animationDelay: '100ms' }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HiOutlineMail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-500 hover:text-blue-600 transition-colors">support@taskflow.com</p>
                    <p className="text-sm text-gray-400">24/7 Support</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300 animate-slideRight" style={{ animationDelay: '200ms' }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HiOutlinePhone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-gray-500 hover:text-blue-600 transition-colors">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-400">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300 animate-slideRight" style={{ animationDelay: '300ms' }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HiLocationMarker className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Office</p>
                    <p className="text-gray-500">123 Innovation Drive, Tech Valley, CA 94043</p>
                    <p className="text-sm text-gray-400">United States</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-blue-600 to-sky-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden animate-scaleIn animation-delay-400">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16 animate-pulse animation-delay-2000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <HiOutlineClock className="w-8 h-8 animate-pulse" />
                  <h3 className="text-xl font-bold">Business Hours</h3>
                </div>
                <div className="space-y-2 text-blue-100">
                  <div className="flex justify-between hover:translate-x-1 transition-transform duration-300">
                    <span>Monday - Friday:</span>
                    <span className="font-semibold text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between hover:translate-x-1 transition-transform duration-300">
                    <span>Saturday:</span>
                    <span className="font-semibold text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between hover:translate-x-1 transition-transform duration-300">
                    <span>Sunday:</span>
                    <span className="font-semibold text-white">Closed</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-blue-400">
                  <p className="text-sm text-blue-100">
                    For urgent inquiries, please use the contact form and we'll respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Response Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn animation-delay-500">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <HiOutlineSparkles className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600">
                Average response time: <span className="font-semibold text-blue-600 animate-pulse">&lt; 24 hours</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Contact;
