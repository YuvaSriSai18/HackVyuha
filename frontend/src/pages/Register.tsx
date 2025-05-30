import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, Info, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Comprehensive list of academic email domains
const academicDomains = [
  // US domains
  '.edu',
  // UK domains
  '.ac.uk',
  // Australia domains
  '.edu.au',
  // Canada domains
  '.edu.ca',
  // India domains
  '.edu.in', 
  '.ac.in',
  // European domains
  '.ac.fr', // France
  '.edu.es', // Spain
  '.uni-*.de', // Germany
  '.ac.at', // Austria
  '.edu.it', // Italy
  '.ac.be', // Belgium
  '.edu.pl', // Poland
  '.edu.nl', // Netherlands
  '.edu.ch', // Switzerland
  '.edu.se', // Sweden
  '.edu.dk', // Denmark
  '.edu.fi', // Finland
  '.edu.no', // Norway
  // Asia domains
  '.edu.cn', // China
  '.ac.jp', // Japan
  '.edu.sg', // Singapore
  '.ac.kr', // South Korea
  '.edu.hk', // Hong Kong
  '.edu.tw', // Taiwan
  '.ac.th', // Thailand
  // Additional international domains
  '.edu.br', // Brazil
  '.edu.mx', // Mexico
  '.edu.ar', // Argentina
  '.ac.za', // South Africa
  '.edu.eg', // Egypt
  '.edu.ru', // Russia
  '.ac.nz', // New Zealand
];

// Function to check if the email is from an academic institution
const isAcademicEmail = (email: string): boolean => {
  const lowerCaseEmail = email.toLowerCase();
  return academicDomains.some(domain => {
    if (domain.includes('*')) {
      // Handle wildcard domains like .uni-*.de
      const pattern = domain.replace('*', '.*');
      const regex = new RegExp(pattern.replace('.', '\\.') + '$');
      return regex.test(lowerCaseEmail);
    }
    return lowerCaseEmail.endsWith(domain);
  });
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAcademicInfo, setShowAcademicInfo] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [verificationCheckCount, setVerificationCheckCount] = useState(0);
  
  const { register, sendVerificationEmail, firebaseUser } = useAuth();
  const navigate = useNavigate();

  // Check if email is verified periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (registrationComplete && !checkingVerification) {
      setCheckingVerification(true);
      
      intervalId = setInterval(() => {
        // Force refresh the token to get the latest email verification status
        if (firebaseUser) {
          firebaseUser.reload().then(() => {
            setVerificationCheckCount(prev => prev + 1);
            
            if (firebaseUser.emailVerified) {
              // Email is verified, navigate to dashboard
              clearInterval(intervalId);
              navigate('/dashboard');
            } else if (verificationCheckCount >= 60) {
              // Stop checking after 5 minutes (60 checks * 5 seconds)
              clearInterval(intervalId);
              setCheckingVerification(false);
            }
          }).catch(err => {
            console.error("Error checking verification status:", err);
          });
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [registrationComplete, checkingVerification, firebaseUser, navigate, verificationCheckCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Academic email validation
    if (!isAcademicEmail(email)) {
      setError('Please use an academic or institutional email address');
      setShowAcademicInfo(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Register the user and send verification email
      await register(name, email, password);
      setRegistrationComplete(true);
      setVerificationCheckCount(0); // Reset the counter
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
      setRegistrationComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setIsSubmitting(true);
    try {
      await sendVerificationEmail();
      setError('');
      setVerificationCheckCount(0); // Reset the counter after resending
      alert('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualCheckVerification = async () => {
    setIsSubmitting(true);
    try {
      if (firebaseUser) {
        await firebaseUser.reload();
        if (firebaseUser.emailVerified) {
          navigate('/dashboard');
        } else {
          setError('Your email is not verified yet. Please check your inbox and click the verification link.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Could not check verification status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md"
      >
        {!registrationComplete ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-900">Create an account</h2>
              <p className="mt-2 text-neutral-600">
                Join ResearchChain to publish and collaborate
              </p>
            </div>
            
            {error && (
              <div className="bg-error-50 text-error-800 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                    Academic Email Address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="your.name@university.edu"
                    />
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    Must be an academic institution email (.edu, .ac.uk, etc.)
                    <button 
                      type="button"
                      className="ml-1 text-primary-600 hover:underline focus:outline-none"
                      onClick={() => setShowAcademicInfo(!showAcademicInfo)}
                    >
                      <Info className="h-4 w-4 inline" />
                    </button>
                  </p>

                  {showAcademicInfo && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                      <p className="font-medium mb-1">Supported academic domains include:</p>
                      <div className="max-h-40 overflow-y-auto pl-2">
                        <ul className="list-disc pl-4 space-y-1">
                          {academicDomains.map((domain, index) => (
                            <li key={index}>{domain}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="mt-2">
                        If your institution uses a different domain, please contact support.
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-10"
                      placeholder="Create a password"
                    />
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input pl-10"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex justify-center py-3"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {/* <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> */}
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create account
                    </span>
                  )}
                </button>
              </div>
            </form>
            
            <div className="text-center mt-4">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        ) : (
          // Registration complete - Email verification needed with auto-checking
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
            <p className="text-neutral-600 mb-6">
              We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to verify your email address.
            </p>
            
            <div className="space-y-4">
              {checkingVerification && (
                <div className="flex items-center justify-center text-primary-600 mb-4">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    {/* <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> */}
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Waiting for email verification...</span>
                </div>
              )}
              
              <p className="text-sm text-neutral-500">
                You need to verify your email before you can access the dashboard.
                <br />
                Once verified, you'll be automatically redirected.
              </p>
              
              <button
                onClick={handleManualCheckVerification}
                disabled={isSubmitting}
                className="btn-primary w-full py-2"
              >
                {isSubmitting ? 'Checking...' : 'I have already verified my email'}
              </button>
              
              <button
                onClick={handleResendVerification}
                disabled={isSubmitting}
                className="btn-outline w-full py-2"
              >
                {isSubmitting ? 'Sending...' : 'Resend verification email'}
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="text-neutral-600 hover:text-neutral-800 text-sm"
              >
                Go to login page
              </button>
            </div>
            
            {error && (
              <div className="mt-4 bg-error-50 text-error-800 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;