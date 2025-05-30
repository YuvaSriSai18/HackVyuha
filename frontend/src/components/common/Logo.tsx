import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <div className={`${className} flex items-center justify-center bg-primary-600 text-white rounded-md p-1`}>
      <BookOpen />
    </div>
  );
};

export default Logo;