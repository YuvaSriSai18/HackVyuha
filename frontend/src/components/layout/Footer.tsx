import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-1">
            <h5 className="font-bold mb-4">HackVyuha</h5>
            <p className="text-neutral-400 text-sm mb-4">
              Advancing research through decentralized collaboration and knowledge sharing.
            </p>
            <div className="flex space-x-4 text-neutral-400">
              <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h5 className="font-bold mb-4">Platform</h5>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-neutral-400 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/dashboard" className="text-neutral-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/projects" className="text-neutral-400 hover:text-white transition-colors">Start a Project</Link></li>
              <li><Link to="/paper/upload" className="text-neutral-400 hover:text-white transition-colors">Upload Paper</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-bold mb-4">Company</h5>
            <ul className="space-y-2">
              <li><Link to="/interested-reviewer" className="text-neutral-400 hover:text-white transition-colors">Become a Reviewer</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-bold mb-4">Legal</h5>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-800 text-neutral-500 text-sm">
          <div className="flex flex-col md:flex-row justify-between">
            <p>© {new Date().getFullYear()} HackVyuha. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Built with care for the research community.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;