import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Upload,
  Users,
  Bell,
  Wallet,
  Search,
  FileText,
  MessageSquare,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

// Create Thirdweb client
const client = createThirdwebClient({
  clientId: "dd9048be1f5947a06c74343151cc4397" // Replace with your actual client ID
});

// Mock data
const papers = [
  {
    id: 1,
    title: 'Quantum Computing Applications in Biochemistry',
    status: 'published',
    date: '2025-02-10',
    citations: 12,
    views: 345,
    revenue: 250,
  },
  {
    id: 2,
    title: 'Neural Network Approaches to Climate Prediction',
    status: 'published',
    date: '2025-01-15',
    citations: 8,
    views: 223,
    revenue: 180,
  },
  {
    id: 3,
    title: 'Blockchain Solutions for Supply Chain Management',
    status: 'draft',
    date: '2025-03-01',
    citations: 0,
    views: 0,
    revenue: 0,
  },
];

const collaborationInvites = [
  {
    id: 1,
    title: 'Research on AI Ethics in Healthcare',
    from: 'Dr. Sarah Johnson',
    institution: 'Stanford University',
    date: '2025-03-05',
  },
  {
    id: 2,
    title: 'Sustainable Energy Distribution Models',
    from: 'Prof. Michael Chen',
    institution: 'MIT',
    date: '2025-03-02',
  },
];

const suggestedCollaborators = [
  {
    id: 1,
    name: 'Dr. Emily Parker',
    institution: 'Harvard University',
    field: 'Quantum Physics',
    match: 92,
    papers: 48,
    image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 2,
    name: 'Prof. David Rodriguez',
    institution: 'UC Berkeley',
    field: 'Machine Learning',
    match: 87,
    papers: 36,
    image: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 3,
    name: 'Dr. Lisa Zhang',
    institution: 'Caltech',
    field: 'Biochemistry',
    match: 85,
    papers: 42,
    image: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const notifications = [
  {
    id: 1,
    type: 'citation',
    message: 'Your paper was cited in "Advanced Neural Networks"',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'review',
    message: 'New review request for "Quantum Computing Applications"',
    time: '1 day ago',
    read: false,
  },
  {
    id: 3,
    type: 'token',
    message: 'You earned 50 tokens from paper citations',
    time: '2 days ago',
    read: true,
  },
  {
    id: 4,
    type: 'collaboration',
    message: 'Dr. Emily Parker accepted your collaboration request',
    time: '3 days ago',
    read: true,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('papers'); // <-- Remove extra setActive404 if not needed

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-neutral-50 min-h-screen"
    >
      {/* Dashboard header */}
      <div className="bg-primary-900 text-white">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="mt-2">Welcome back, {user?.name || 'Researcher'}</p>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-4">
              <Link to="/paper/upload" className="btn-primary">
                <Upload size={16} className="mr-2" />
                Upload Paper
              </Link>
              <ConnectButton
                client={client}
                connectButton={{
                  className: "btn bg-white text-primary-800 hover:bg-neutral-100",
                  label: "Connect Wallet",
                }}
                theme="light"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/70">Papers Published</p>
                  <h3 className="text-2xl font-bold mt-1">2</h3>
                </div>
                <div className="p-2 bg-primary-800 rounded-md">
                  <FileText size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/70">Total Citations</p>
                  <h3 className="text-2xl font-bold mt-1">20</h3>
                </div>
                <div className="p-2 bg-primary-800 rounded-md">
                  <MessageSquare size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/70">Token Balance</p>
                  <h3 className="text-2xl font-bold mt-1">{user?.tokens || 0}</h3>
                </div>
                <div className="p-2 bg-primary-800 rounded-md">
                  <Wallet size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/70">Contribution Score</p>
                  <h3 className="text-2xl font-bold mt-1">{user?.contributionScore || 0}</h3>
                </div>
                <div className="p-2 bg-primary-800 rounded-md">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-custom py-8">
        <div className="flex overflow-x-auto scrollbar-hide space-x-4 border-b border-neutral-200 mb-8">
          <button
            className={`pb-4 px-1 font-medium whitespace-nowrap flex items-center ${
              activeTab === 'papers'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('papers')}
          >
            <BookOpen size={18} className="mr-2" />
            My Papers
          </button>

          <button
            className={`pb-4 px-1 font-medium whitespace-nowrap flex items40-center ${
              activeTab === 'collaborations'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('collaborations')}
          >
            <Users size={18} className="mr-2" />
            Collaboration Invites
            <span className="ml-2 text-xs bg-primary-100 text-primary-800 rounded-full px-2 py-0.5">
              {collaborationInvites.length}
            </span>
          </button>

          <button
            className={`pb-4 px-1 font-medium whitespace-nowrap flex items-center ${
              activeTab === 'suggested'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('suggested')}
          >
            <Users size={18} className="mr-2" />
            Suggested Collaborators
          </button>

          <button
            className={`pb-4 px-1 font-medium whitespace-nowrap flex items-center ${
              activeTab === 'notifications'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} className="mr-2" />
            Notifications
            <span className="ml-2 text-xs bg-primary-100 text-primary-800 rounded-full px-2 py-0.5">
              {notifications.filter((n) => !n.read).length}
            </span>
          </button>
        </div>

        {/* Papers tab */}
        {activeTab === 'papers' && (
          <div>
            <div className="flex justify-between items40-center mb-6">
              <h2 className="text-2xl font-bold">My Papers</h2>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search papers..."
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-5 focus:border-primary-5"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Citations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-5 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {papers.map((paper) => (
                      <tr key={paper.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">{paper.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {paper.status === 'published' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {paper.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {paper.citations}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {paper.views}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-5">
                          {paper.revenue} tokens
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/paper/${paper.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {papers.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-sm font-medium text-neutral-900">No papers yet</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Get started by uploading your research paper.
                  </p>
                  <div className="mt-6">
                    <Link to="/paper/upload" className="btn-primary">
                      <Upload size={16} className="mr-2" />
                      Upload Paper
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collaboration invites tab */}
        {activeTab === 'collaborations' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Collaboration Invites</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collaborationInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="bg-white rounded-lg shadow-sm p-6 border border-neutral-100"
                >
                  <h3 className="font-semibold text-lg">{invite.title}</h3>
                  <div className="mt-2 text-neutral-600">
                    <p>
                      From: <span className="font-medium">{invite.from}</span>
                    </p>
                    <p>Institution: {invite.institution}</p>
                    <p className="text-sm text-neutral-500 mt-1">Received: {invite.date}</p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button className="btn-primary py-1.5 px-3">Accept</button>
                    <button className="btn-outline py-1.5 px-3">Decline</button>
                    <button className="btn-ghost py-1.5 px-3">View Details</button>
                  </div>
                </div>
              ))}

              {collaborationInvites.length === 0 && (
                <div className="col-span-2 text-center py-8 bg-white rounded-lg shadow-sm">
                  <Users className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-sm font-medium text-neutral-900">
                    No collaboration invites
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    You don't have any pending collaboration invites at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suggested collaborators tab */}
        {activeTab === 'suggested' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Suggested Collaborators</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedCollaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-100"
                >
                  <div className="h-28 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                  <div className="relative px-6 pb-6">
                    <div className="absolute -top-12 left-6">
                      <img
                        src={collaborator.image}
                        alt={collaborator.name}
                        className="h-24 w-24 rounded-full border-4 border-white object-cover"
                      />
                    </div>
                    <div className="pt-14">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{collaborator.name}</h3>
                          <p className="text-neutral-600">{collaborator.institution}</p>
                          <p className="text-sm text-neutral-500">Field: {collaborator.field}</p>
                          <p className="text-sm text-neutral-5">Papers: {collaborator.papers}</p>
                        </div>
                        <div className="bg-primary-50 text-primary-800 rounded-full px-2 py-1 text-sm font-medium">
                          {collaborator.match}% match
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button className="btn-primary py-1.5 px-3 flex-1">Invite</button>
                        <button className="btn-outline py-1.5 px-3 flex-1">View Profile</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <button className="text-sm text-primary-600 hover:text-primary-800">
                Mark all as read
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 flex items-start ${notification.read ? '' : 'bg-primary-50'}`}
                >
                  <div className="mr-4">
                    {notification.type === 'citation' && (
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <MessageSquare size={20} />
                      </div>
                    )}
                    {notification.type === 'review' && (
                      <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                        <FileText size={20} />
                      </div>
                    )}
                    {notification.type === 'token' && (
                      <div className="bg-green-100 p-2 rounded-full text-green-6">
                        <Wallet size={20} />
                      </div>
                    )}
                    {notification.type === 'collaboration' && (
                      <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                        <Users size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`${
                        notification.read ? 'text-neutral-7' : 'text-neutral-9 font-medium'
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">{notification.time}</p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-800 ml-4">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="mx-auto h-12 w-12 text-neutral-400" />
                  <h3 className="mt-2 text-sm font-medium text-neutral-900">No notifications</h3>
                  <p className="mt-1 text-sm text-neutral-500">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
