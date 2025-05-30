import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  BookOpen, 
  Users, 
  Award, 
  Edit, 
  Mail, 
  MapPin, 
  Globe, 
  FileText, 
  Calendar,
  TrendingUp,
  Download,
  ExternalLink,
  Check,
  AlertTriangle,
  Wallet,
  MessageSquare,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mock user data
const userData = {
  name: 'John Researcher',
  title: 'Associate Professor of Computer Science',
  institution: 'Stanford University',
  location: 'Palo Alto, CA',
  email: 'john.researcher@stanford.edu',
  website: 'https://johnresearcher.com',
  bio: 'Computational scientist specializing in quantum algorithms and their applications in biochemistry. Previously worked at MIT and IBM Research. Published over 40 papers in leading journals.',
  education: [
    {
      degree: 'Ph.D. in Computer Science',
      institution: 'MIT',
      year: '2020'
    },
    {
      degree: 'M.S. in Applied Mathematics',
      institution: 'Harvard University',
      year: '2016'
    },
    {
      degree: 'B.S. in Computer Science',
      institution: 'UC Berkeley',
      year: '2014'
    }
  ],
  expertise: ['Quantum Computing', 'Machine Learning', 'Computational Biology', 'Algorithms', 'Data Science'],
  socialProfiles: {
    orcid: '0000-0001-8352-7954',
    github: 'johnresearcher',
    twitter: 'johnresearcher',
    linkedin: 'johnresearcher'
  },
  profileImage: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  isVerified: true,
  stats: {
    papers: 42,
    citations: 1250,
    hIndex: 18,
    collaborators: 36,
    reviewsDone: 65
  },
  papers: [
    {
      id: 1,
      title: 'Quantum Computing Applications in Biochemistry',
      journal: 'Nature Quantum Information',
      year: '2025',
      citations: 12,
      views: 345
    },
    {
      id: 2,
      title: 'Neural Network Approaches to Climate Prediction',
      journal: 'Journal of Machine Learning Research',
      year: '2024',
      citations: 8,
      views: 223
    },
    {
      id: 3,
      title: 'Blockchain Solutions for Supply Chain Management',
      journal: 'IEEE Transactions on Information Technology',
      year: '2024',
      citations: 5,
      views: 187
    }
  ],
  collaborations: [
    {
      id: 1,
      title: 'Quantum Algorithms for Drug Discovery',
      role: 'Lead Researcher',
      status: 'active',
      partners: ['Dr. Sarah Johnson', 'Prof. Michael Chen'],
      institution: 'Stanford University'
    },
    {
      id: 2,
      title: 'AI Ethics in Healthcare Applications',
      role: 'Contributor',
      status: 'completed',
      partners: ['Dr. Emily Parker', 'Dr. David Wong'],
      institution: 'Johns Hopkins University'
    }
  ],
  transactions: [
    {
      id: 1,
      type: 'earned',
      amount: 50,
      description: 'Paper citations reward',
      date: '2025-03-01'
    },
    {
      id: 2,
      type: 'earned',
      amount: 100,
      description: 'Review completion bonus',
      date: '2025-02-15'
    },
    {
      id: 3,
      type: 'spent',
      amount: 5,
      description: 'Paper access purchase',
      date: '2025-02-10'
    },
    {
      id: 4,
      type: 'earned',
      amount: 150,
      description: 'Research collaboration contribution',
      date: '2025-01-20'
    }
  ]
};

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, we would fetch user data from an API
  // For now, we'll use our mock data
  const profileData = userData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-neutral-50"
    >
      {/* Profile header */}
      <div className="bg-primary-900 text-white">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="relative">
              <img 
                src={profileData.profileImage} 
                alt={profileData.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover"
              />
              {profileData.isVerified && (
                <div className="absolute bottom-0 right-0 bg-success-500 rounded-full p-1 border-2 border-white">
                  <Check size={16} />
                </div>
              )}
            </div>
            
            <div className="md:ml-8 mt-4 md:mt-0">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                {!profileData.isVerified && (
                  <div className="ml-3 px-2 py-1 bg-warning-500 text-warning-900 rounded text-xs font-medium flex items-center">
                    <AlertTriangle size={12} className="mr-1" />
                    Not Verified
                  </div>
                )}
              </div>
              <p className="text-xl mt-1">{profileData.title}</p>
              <div className="flex flex-wrap items-center mt-2 text-neutral-200">
                <div className="flex items-center mr-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{profileData.institution}, {profileData.location}</span>
                </div>
                {!profileData.isVerified && (
                  <Link to="/verify-identity" className="text-white underline mt-2 md:mt-0">
                    Verify Academic Identity
                  </Link>
                )}
              </div>
            </div>
            
            <div className="md:ml-auto mt-4 md:mt-0">
              <button className="btn-outline border-white text-white hover:bg-white/10">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <FileText size={20} />
              </div>
              <p className="text-2xl font-bold">{profileData.stats.papers}</p>
              <p className="text-sm text-white/70">Papers</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <MessageSquare size={20} />
              </div>
              <p className="text-2xl font-bold">{profileData.stats.citations}</p>
              <p className="text-sm text-white/70">Citations</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp size={20} />
              </div>
              <p className="text-2xl font-bold">{profileData.stats.hIndex}</p>
              <p className="text-sm text-white/70">h-index</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Users size={20} />
              </div>
              <p className="text-2xl font-bold">{profileData.stats.collaborators}</p>
              <p className="text-sm text-white/70">Collaborators</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Eye size={20} />
              </div>
              <p className="text-2xl font-bold">{profileData.stats.reviewsDone}</p>
              <p className="text-sm text-white/70">Reviews</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile tabs */}
      <div className="container-custom">
        <div className="flex overflow-x-auto scrollbar-hide space-x-4 border-b border-neutral-200 mt-6">
          <button
            className={`pb-4 px-1 font-medium whitespace-nowrap flex items-center ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={18} className="mr-2" />
            Overview
          </button>
          
          <button
            className={`pb-4 px-1 font-medium whitespace-nowrap flex items-center ${
              activeTab === 'papers'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('papers')}
          >
            <BookOpen size={18} className="mr-2" />
            Papers
          </button>
          
          <button
            className={`pb-4 px-1 font-medium whitespace-nowrap flex items-center ${
              activeTab === 'collaborations'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('collaborations')}
          >
            <Users size={18} className="mr-2" />
            Collaborations
          </button>
          
          <button
            className={`pb-4 px-1 font-medium whitespace-nowrap flex items-center ${
              activeTab === 'wallet'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('wallet')}
          >
            <Wallet size={18} className="mr-2" />
            Token Wallet
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="container-custom py-8">
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {/* Bio */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Biography</h2>
                <p className="text-neutral-700">{profileData.bio}</p>
              </div>
              
              {/* Education */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                <div className="space-y-4">
                  {profileData.education.map((edu, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4">
                        <div className="w-3 h-3 rounded-full bg-primary-600 mt-1.5"></div>
                      </div>
                      <div>
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-neutral-600">{edu.institution}, {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent papers */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Papers</h2>
                  <button 
                    className="text-primary-600 text-sm"
                    onClick={() => setActiveTab('papers')}
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {profileData.papers.slice(0, 3).map((paper) => (
                    <div key={paper.id} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                      <Link 
                        to={`/paper/${paper.id}`}
                        className="font-medium text-primary-700 hover:text-primary-900"
                      >
                        {paper.title}
                      </Link>
                      <p className="text-sm text-neutral-600 mt-1">
                        {paper.journal}, {paper.year}
                      </p>
                      <div className="flex text-xs text-neutral-500 mt-1">
                        <span className="flex items-center mr-3">
                          <MessageSquare size={12} className="mr-1" />
                          {paper.citations} citations
                        </span>
                        <span className="flex items-center">
                          <Eye size={12} className="mr-1" />
                          {paper.views} views
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              {/* Contact info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-neutral-500 mr-3" />
                    <a href={`mailto:${profileData.email}`} className="text-primary-600 hover:underline">
                      {profileData.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-neutral-500 mr-3" />
                    <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {profileData.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-neutral-500 mr-3" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Expertise */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.expertise.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Blockchain identity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Blockchain Identity</h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-neutral-500">Wallet Address</div>
                    <div className="font-mono text-sm mt-1 break-all">
                      {user?.walletAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Verification Status</div>
                    <div className="flex items-center mt-1">
                      {profileData.isVerified ? (
                        <span className="px-2 py-0.5 bg-success-100 text-success-800 rounded flex items-center text-sm">
                          <Check size={14} className="mr-1" />
                          Verified Academic
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-warning-100 text-warning-800 rounded flex items-center text-sm">
                          <AlertTriangle size={14} className="mr-1" />
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Token Balance</div>
                    <div className="flex items-center mt-1 font-semibold">
                      {user?.tokens || 250} tokens
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Contribution Score</div>
                    <div className="flex items-center mt-1 font-semibold">
                      {user?.contributionScore || 78}/100
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Papers tab */}
        {activeTab === 'papers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Published Papers</h2>
              <Link to="/paper/upload" className="btn-primary py-1.5 px-4">
                Upload New Paper
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {profileData.papers.map((paper) => (
                <motion.div
                  key={paper.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <Link 
                        to={`/paper/${paper.id}`}
                        className="text-xl font-semibold text-primary-700 hover:text-primary-900 flex items-center"
                      >
                        {paper.title}
                        <ExternalLink size={16} className="ml-2 flex-shrink-0" />
                      </Link>
                      
                      <p className="text-neutral-600 mt-2">
                        {paper.journal}, {paper.year}
                      </p>
                      
                      <div className="flex mt-4 space-x-4">
                        <div className="flex items-center">
                          <MessageSquare size={16} className="text-neutral-500 mr-1" />
                          <span className="text-sm">{paper.citations} citations</span>
                        </div>
                        <div className="flex items-center">
                          <Eye size={16} className="text-neutral-500 mr-1" />
                          <span className="text-sm">{paper.views} views</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 md:mt-0">
                      <Link 
                        to={`/paper/${paper.id}`}
                        className="btn-outline py-1.5 px-3 mr-2"
                      >
                        View
                      </Link>
                      <button className="btn-ghost p-2">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Collaborations tab */}
        {activeTab === 'collaborations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Research Collaborations</h2>
              <Link to="/marketplace" className="btn-primary py-1.5 px-4">
                Find New Collaborations
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData.collaborations.map((collab) => (
                <div key={collab.id} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold">{collab.title}</h3>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Role:</span>
                      <span className="font-medium">{collab.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Status:</span>
                      <span className={`px-2 py-0.5 rounded text-sm font-medium ${
                        collab.status === 'active' 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Institution:</span>
                      <span>{collab.institution}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Collaborators:</span>
                      <div className="mt-1">
                        {collab.partners.map((partner, idx) => (
                          <div key={idx} className="text-primary-700 hover:text-primary-900 cursor-pointer">
                            {partner}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button className="btn-outline py-1.5 px-3">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Wallet tab */}
        {activeTab === 'wallet' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-2xl font-bold">Token Wallet</h2>
                  <p className="text-neutral-600 mt-1">Manage your research tokens</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-4">
                  <div className="text-center">
                    <p className="text-neutral-500 text-sm">Current Balance</p>
                    <p className="text-2xl font-bold text-primary-700">{user?.tokens || 250}</p>
                  </div>
                  
                  <button className="btn-primary">
                    <Wallet size={16} className="mr-2" />
                    Transfer Tokens
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-xl font-semibold">Transaction History</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {profileData.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={transaction.type === 'earned' ? 'text-success-600' : 'text-neutral-600'}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'earned' 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;