import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Loader2, Code, ExternalLink, Copy, Check } from 'lucide-react';
import { forgetPasswordRequest } from '../../api/index';
import { requestHandler } from '../../utils/index';

const ForgotPasswordRequset = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [testingUrl, setTestingUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ type: '', message: '' });

    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email address' });
      return;
    }

    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }
    
    await requestHandler(
      async () => {
        const response = await forgetPasswordRequest({ email });
        return response.data;
      },
      setIsLoading,
      (data) => {
        // Check if API returns a testing URL
        if (data?.forgotPasswordUrl || data?.resetUrl || data?.url) {
          const url = data.forgotPasswordUrl || data.resetUrl || data.url;

          setTestingUrl(url);
        }

        setStatus({
          type: 'success',
          message: data?.message || 'Password reset instructions have been sent to your email.'
        });
        setEmail('');
      },
      (error) => {
        setStatus({
          type: 'error',
          message: error?.message || 'Failed to send reset link. Please try again.'
        });
      }
    );
  };

  return (
    <>
      {/* Testing URL Banner - Only shows if testingUrl exists */}
      {testingUrl && (
        <div className="bg-yellow-50 border-b border-yellow-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Code className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <span className="text-sm font-medium text-yellow-800">Testing URL:</span>
                <a
                  href={testingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-yellow-700 hover:text-yellow-900 underline underline-offset-2 truncate flex items-center gap-1"
                >
                  {testingUrl}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(testingUrl)}
                  className="p-1.5 hover:bg-yellow-100 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-yellow-600" />
                  )}
                </button>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  Test Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Login Link */}
          <a
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </a>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  <Mail className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
              <p className="text-blue-100 text-center text-sm">
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {/* Status Messages */}
              {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  status.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 ${status.type === 'error' && status.message.includes('email') ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        status.type === 'error' && status.message.includes('email')
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:text-gray-500`}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    We'll send a password reset link to this email address.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              {/* Additional Help Text */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Remember your password?{' '}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 We'll never share your email with anyone else.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordRequset;
