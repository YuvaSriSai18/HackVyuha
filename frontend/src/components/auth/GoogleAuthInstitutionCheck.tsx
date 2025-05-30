import React, { useState } from 'react';

const allowedDomains = [
  '.edu',
  '.ac.uk',
  '.edu.au',
  '.edu.in',
  // Add more academic domains as needed
];

function isAcademicEmail(email: string) {
  return allowedDomains.some((domain) => email.toLowerCase().endsWith(domain));
}

interface InstitutionalEmailVerificationProps {
  onVerified?: (email: string) => void;
}

export default function InstitutionalEmailVerification({ onVerified }: InstitutionalEmailVerificationProps) {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleVerifyEmail(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter an email address');
        return;
      }

      if (isAcademicEmail(email)) {
        setVerified(true);
        if (onVerified) {
          onVerified(email);
        }
      } else {
        setError('Please use an email address from an academic institution.');
      }
    } catch (e) {
      setError('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label htmlFor="institution-email" className="block text-sm font-medium text-neutral-700 mb-1">
        Verify your Institutional Email
      </label>

      <form onSubmit={handleVerifyEmail} className="mt-2">
        <div className="flex space-x-2">
          <input
            id="institution-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.name@institution.edu"
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            disabled={verified}
          />
          <button
            type="submit"
            disabled={loading || !email || verified}
            className={`px-4 py-2 rounded-md ${
              verified 
                ? 'bg-green-500 text-white'
                : 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            } disabled:opacity-50 transition-colors`}
          >
            {loading ? 'Verifying...' : verified ? 'Verified' : 'Verify'}
          </button>
        </div>
      </form>

      {verified && (
        <p className="text-green-600 mt-2">
          Verified institutional email: {email}
        </p>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <div className="mt-2 text-sm text-neutral-500">
        <p>Supported institutional domain extensions:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          {allowedDomains.map((domain) => (
            <li key={domain}>{domain}</li>
          ))}
        </ul>
        <p className="mt-2">
          If your institution uses a different domain, please contact support.
        </p>
      </div>
    </div>
  );
}