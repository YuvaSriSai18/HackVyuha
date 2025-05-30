import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, 
  Shield, 
  Mail, 
  Upload, 
  AlertCircle, 
  BookOpen,
  Users,
  FileText
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const VerifyIdentity = () => {
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'document'>('email');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [documentType, setDocumentType] = useState('student_id');
  const [document, setDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!institutionalEmail) {
      setError('Please enter your institutional email');
      return;
    }
    
    const validDomains = ['.edu', '.ac.uk', '.edu.au', '.edu.in'];

    if (!validDomains.some(domain => institutionalEmail.endsWith(domain))) {
      setError('Please enter a valid academic email address');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setEmailSent(true);
    }, 1500);
  };
  
  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!document) {
      setError('Please upload a document');
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 2000);
  };
  
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-custom max-w-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold">Verify Your Academic Identity</h1>
            <p className="text-neutral-600 mt-2 max-w-lg mx-auto">
              Verifying your academic identity helps build trust in the community and unlocks additional features.
            </p>
          </div>

          {/* Benefits of Verification */}
          <div className="mb-10 bg-primary-50 border border-primary-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-primary-700">Benefits of Verification</h2>
            <ul className="space-y-3 text-neutral-700 text-sm">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary-600 mr-2 mt-1" />
                <div>
                  <strong>Enhanced Credibility</strong><br />
                  Verified profiles gain higher visibility and trust.
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary-600 mr-2 mt-1" />
                <div>
                  <strong>Collaboration Access</strong><br />
                  Unlock exclusive collaboration opportunities.
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-primary-600 mr-2 mt-1" />
                <div>
                  <strong>Bonus Tokens</strong><br />
                  Earn additional tokens for research activities.
                </div>
              </li>
            </ul>
          </div>
          
          {/* Verification methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button 
              className={`p-4 border rounded-lg text-left ${
                verificationMethod === 'email' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
              onClick={() => setVerificationMethod('email')}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${
                  verificationMethod === 'email' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  <Mail size={20} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">Institutional Email</h3>
                  <p className="text-neutral-600 text-sm mt-1">
                    Verify using your academic email address from your institution.
                  </p>
                </div>
              </div>
            </button>
            
            <button 
              className={`p-4 border rounded-lg text-left ${
                verificationMethod === 'document' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
              onClick={() => setVerificationMethod('document')}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${
                  verificationMethod === 'document' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  <FileText size={20} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">Upload Document</h3>
                  <p className="text-neutral-600 text-sm mt-1">
                    Upload your student ID, faculty card, or institution letter.
                  </p>
                </div>
              </div>
            </button>
          </div>
          
          {error && (
            <div className="bg-error-50 text-error-800 p-4 rounded-md flex items-start mb-6">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Email verification form */}
          {verificationMethod === 'email' && !emailSent && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Institutional Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="yourname@university.edu"
                  value={institutionalEmail}
                  onChange={(e) => setInstitutionalEmail(e.target.value)}
                  className="input"
                  required
                />
                <p className="mt-1 text-sm text-neutral-500">
                  Must be an email address from an academic institution (.edu, .ac.uk, etc.)
                </p>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Verification Email...
                  </span>
                ) : (
                  <span>Send Verification Email</span>
                )}
              </button>
            </form>
          )}
          
          {/* Email sent confirmation */}
          {verificationMethod === 'email' && emailSent && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
                <Mail className="w-8 h-8 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verification Email Sent!</h2>
              <p className="text-neutral-600 max-w-md mx-auto mb-6">
                We've sent a verification link to <strong>{institutionalEmail}</strong>. Please check your inbox and click the link to complete verification.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-outline w-full py-3"
                >
                  I'll verify later
                </button>
                <p className="text-sm text-neutral-500">
                  Didn't receive the email? <button className="text-primary-600 hover:underline">Resend</button>
                </p>
              </div>
            </div>
          )}
          
          {/* Document upload form */}
          {verificationMethod === 'document' && (
            <form onSubmit={handleDocumentSubmit} className="space-y-6">
              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-neutral-700 mb-1">
                  Document Type
                </label>
                <select
                  id="documentType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="input"
                >
                  <option value="student_id">Student ID</option>
                  <option value="faculty_card">Faculty Card</option>
                  <option value="institution_letter">Institution Letter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Upload Document</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleDocumentChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button 
                  type="button" 
                  onClick={triggerFileSelect}
                  className="btn-secondary"
                >
                  <Upload className="inline mr-2" /> 
                  {document ? document.name : 'Choose File'}
                </button>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3"
              >
                {isSubmitting ? 'Uploading...' : 'Submit Document'}
              </button>
            </form>
          )}
          
          <div className="mt-12 text-center text-sm text-neutral-500">
            <Users className="inline-block mr-2 mb-1" /> 
            <span>Trusted by thousands of verified students and faculty worldwide.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyIdentity;
