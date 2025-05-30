import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const { user, firebaseUser, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [verificationCheckCount, setVerificationCheckCount] = useState(0);
  
  // Redirect if already verified or not logged in
  useEffect(() => {
    if (!firebaseUser) {
      navigate('/login');
      return;
    }
    
    if (firebaseUser.emailVerified) {
      navigate('/dashboard');
    }
  }, [firebaseUser, navigate]);
  
  // Check if email is verified periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (firebaseUser && !firebaseUser.emailVerified && !checkingVerification) {
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
  }, [checkingVerification, firebaseUser, navigate, verificationCheckCount]);

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

  const handleResendVerification = async () => {
    setIsSubmitting(true);
    try {
      await sendVerificationEmail();
      setError(null);
      setVerificationCheckCount(0); // Reset the counter after resending
      alert('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md"
      >
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-neutral-600 mb-6">
            We've sent a verification link to <strong>{user?.email}</strong>. Please check your inbox and click the link to verify your email address.
          </p>
          
          <div className="space-y-4">
            {/* {checkingVerification && (
              <div className="flex items-center justify-center text-primary-600 mb-4">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Waiting for email verification...</span>
              </div>
            )} */}
            
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
              className="text-neutral-600 hover:text-neutral-800 text-sm flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to login page
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-error-50 text-error-800 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;