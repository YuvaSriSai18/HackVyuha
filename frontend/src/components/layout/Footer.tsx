import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import Logo from '../common/Logo';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <Logo className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold">ResearchChain</span>
            </Link>
            <p className="mt-4 text-neutral-400">
              Decentralized platform for academic research, empowering scholars through blockchain technology.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-bold mb-4">Resources</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="text-neutral-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/marketplace" className="text-neutral-400 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/paper/upload" className="text-neutral-400 hover:text-white transition-colors">Upload Paper</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-bold mb-4">Company</h5>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/team" className="text-neutral-400 hover:text-white transition-colors">Team</Link></li>
              <li><Link to="/careers" className="text-neutral-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-bold mb-4">Legal</h5>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-neutral-400 hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 my-6"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} ResearchChain. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;