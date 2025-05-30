import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

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

export default function InstitutionalEmailGoogleAuth() {
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  function handleGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    setError('');
    setLoading(true);

    // Decode credential token to get user info (email)
    // The token is a JWT, you can decode it client-side

    try {
      const base64Url = credentialResponse.credential!.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const user = JSON.parse(jsonPayload);
      const email = user.email;

      if (isAcademicEmail(email)) {
        setUserEmail(email);
        setError('');
        // proceed with your flow, e.g. send verification email, or mark user as authenticated
      } else {
        setError('Please use an email address from an academic institution.');
        setUserEmail('');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError('Failed to verify email from Google login.');
      setUserEmail('');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLoginError() {
    setError('Google sign-in failed. Please try again.');
    setUserEmail('');
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        Sign in with your Institutional Google Account
      </label>

      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
      />

      {loading && <p className="text-sm text-neutral-500 mt-2">Verifying...</p>}

      {userEmail && (
        <p className="text-green-600 mt-2">Logged in as: {userEmail}</p>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <p className="mt-1 text-sm text-neutral-500">
        Must be an email address from an academic institution (.edu, .ac.uk, etc.)
      </p>
    </div>
  );
}
