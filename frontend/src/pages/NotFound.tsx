import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-neutral-50 py-12 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900">Page not found</h2>
        <p className="mt-4 text-lg text-neutral-600 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/" className="btn-primary">
            <Home size={16} className="mr-2" />
            Back to Home
          </Link>
          <Link to="/marketplace" className="btn-outline">
            <Search size={16} className="mr-2" />
            Browse Research
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;