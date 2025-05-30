import React, { useState, useEffect } from 'react';
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
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Removed ThirdWeb imports that were causing errors

// Define interfaces for your data types
interface Paper {
  id: string;
  title: string;
  status: 'published' | 'draft';
  date: string;
  citations: number;
  views: number;
  revenue: number;
}

interface CollaborationInvite {
  id: string;
  title: string;
  from: string;
  institution: string;
  date: string;
}

interface SuggestedCollaborator {
  id: string;
  name: string;
  institution: string;
  field: string;
  papers: number;
  match: number;
  image: string;
}

interface Notification {
  id: string;
  type: 'citation' | 'review' | 'token' | 'collaboration';
  message: string;
  time: string;
  read: boolean;
}

// Local interface for dashboard display purposes
interface DashboardUser {
  id: string;
  name: string;
  tokens?: number;
  contributionScore?: number;
}

interface LoadingState {
  papers: boolean;
  collaborations: boolean;
  suggested: boolean;
  notifications: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'papers' | 'collaborations' | 'suggested' | 'notifications'>('papers');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [collaborationInvites, setCollaborationInvites] = useState<CollaborationInvite[]>([]);
  const [suggestedCollaborators, setSuggestedCollaborators] = useState<SuggestedCollaborator[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    papers: true,
    collaborations: true,
    suggested: true,
    notifications: true
  });
  
  // Create a local dashboard user object from auth user
  const dashboardUser: DashboardUser | null = user ? {
    id: user.uid, // Map uid from AuthContext user to id for dashboard
    name: user.displayName || 'User',
    tokens: 0, // Default or fetch from elsewhere
    contributionScore: 0 // Default or fetch from elsewhere
  } : null;
  
  // Replace ThirdWeb hooks with local state for wallet management
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  // Mock disconnect function
  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
  };

  // Function to handle wallet connection (mock)
  const handleWalletConnect = () => {
    // Generate a fake wallet address
    const mockAddress = "0x" + Math.random().toString(16).substring(2, 14);
    setWalletConnected(true);
    setWalletAddress(mockAddress);
  };

  // Fetch user's papers
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        // Replace with actual API call
        // const response = await api.getPapersByUser(dashboardUser?.id);
        // setPapers(response.data);
        setPapers([]);
        setLoading(prev => ({ ...prev, papers: false }));
      } catch (error) {
        console.error('Error fetching papers:', error);
        setPapers([]);
        setLoading(prev => ({ ...prev, papers: false }));
      }
    };

    if (dashboardUser?.id) {
      fetchPapers();
    }
  }, [dashboardUser?.id]);

  // Fetch collaboration invites
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        // Replace with actual API call
        // const response = await api.getCollaborationInvites(dashboardUser?.id);
        // setCollaborationInvites(response.data);
        setCollaborationInvites([]);
        setLoading(prev => ({ ...prev, collaborations: false }));
      } catch (error) {
        console.error('Error fetching collaboration invites:', error);
        setCollaborationInvites([]);
        setLoading(prev => ({ ...prev, collaborations: false }));
      }
    };

    if (dashboardUser?.id) {
      fetchInvites();
    }
  }, [dashboardUser?.id]);

  // Fetch suggested collaborators
  useEffect(() => {
    const fetchSuggestedCollaborators = async () => {
      try {
        // Replace with actual API call
        // const response = await api.getSuggestedCollaborators(dashboardUser?.id);
        // setSuggestedCollaborators(response.data);
        setSuggestedCollaborators([]);
        setLoading(prev => ({ ...prev, suggested: false }));
      } catch (error) {
        console.error('Error fetching suggested collaborators:', error);
        setSuggestedCollaborators([]);
        setLoading(prev => ({ ...prev, suggested: false }));
      }
    };

    if (dashboardUser?.id) {
      fetchSuggestedCollaborators();
    }
  }, [dashboardUser?.id]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Replace with actual API call
        // const response = await api.getNotifications(dashboardUser?.id);
        // setNotifications(response.data);
        setNotifications([]);
        setLoading(prev => ({ ...prev, notifications: false }));
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
        setLoading(prev => ({ ...prev, notifications: false }));
      }
    };

    if (dashboardUser?.id) {
      fetchNotifications();
    }
  }, [dashboardUser?.id]);

  const handleMarkAllNotificationsAsRead = async (): Promise<void> => {
    try {
      // Replace with actual API call
      // await api.markAllNotificationsAsRead(dashboardUser?.id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleAcceptInvite = async (inviteId: string): Promise<void> => {
    try {
      // Replace with actual API call
      // await api.acceptCollaborationInvite(inviteId);
      setCollaborationInvites(prevInvites => 
        prevInvites.filter(invite => invite.id !== inviteId)
      );
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };

  const handleDeclineInvite = async (inviteId: string): Promise<void> => {
    try {
      // Replace with actual API call
      // await api.declineCollaborationInvite(inviteId);
      setCollaborationInvites(prevInvites => 
        prevInvites.filter(invite => invite.id !== inviteId)
      );
    } catch (error) {
      console.error('Error declining invite:', error);
    }
  };

  const handleSendInvite = async (collaboratorId: string): Promise<void> => {
    try {
      // Replace with actual API call
      // await api.sendCollaborationInvite(dashboardUser?.id, collaboratorId);
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

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
              <p className="mt-2">Welcome back, {dashboardUser?.name || 'Researcher'}</p>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-4">
              <Link to="/paper/upload" className="btn-primary">
                <Upload size={16} className="mr-2" />
                Upload Paper
              </Link>

              {/* Use local wallet state instead of ThirdWeb */}
              {!walletConnected ? (
                <button 
                  onClick={handleWalletConnect}
                  className="btn bg-white text-primary-800 hover:bg-gray-100 flex items-center"
                >
                  <Wallet size={16} className="mr-2" />
                  Connect Wallet
                </button>
              ) : (
                <div className="flex space-x-2">
                  <div className="btn bg-white text-primary-800">
                    <Wallet size={16} className="mr-2" />
                    {walletAddress?.substring(0, 6)}...{walletAddress?.substring((walletAddress?.length || 0) - 4)}
                  </div>
                  <button 
                    onClick={handleDisconnectWallet}
                    className="p-2 bg-white text-primary-800 rounded-md hover:bg-gray-100"
                    title="Disconnect wallet"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/70">Papers Published</p>
                  <h3 className="text-2xl font-bold mt-1">{papers.filter(p => p.status === 'published').length}</h3>
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
                  <h3 className="text-2xl font-bold mt-1">
                    {papers.reduce((total, paper) => total + (paper.citations || 0), 0)}
                  </h3>
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
                  <h3 className="text-2xl font-bold mt-1">{dashboardUser?.tokens || 0}</h3>
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
                  <h3 className="text-2xl font-bold mt-1">{dashboardUser?.contributionScore || 0}</h3>
                </div>
                <div className="p-2 bg-primary-800 rounded-md">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard content - Tab system */}
      <div className="container-custom py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('papers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'papers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen size={16} className="mr-2" />
              My Papers
            </button>

            <button
              onClick={() => setActiveTab('collaborations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'collaborations'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={16} className="mr-2" />
              Collaboration Invites 
              {collaborationInvites.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">
                  {collaborationInvites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('suggested')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'suggested'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Search size={16} className="mr-2" />
              Suggested Collaborators
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell size={16} className="mr-2" />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {/* My Papers Tab */}
          {activeTab === 'papers' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Papers</h2>
                <Link to="/paper/upload" className="btn-secondary-sm">
                  Upload New Paper
                </Link>
              </div>

              {loading.papers ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading your papers...</p>
                </div>
              ) : papers.length > 0 ? (
                <div className="bg-white rounded-lg shadow divide-y">
                  {papers.map((paper) => (
                    <div key={paper.id} className="p-4 hover:bg-gray-50">
                      <Link to={`/paper/${paper.id}`} className="block">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{paper.title}</h3>
                            <p className="text-sm text-gray-500">Published on {paper.date}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            paper.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {paper.status}
                          </span>
                        </div>
                        <div className="mt-2 flex text-sm text-gray-500 space-x-4">
                          <span>{paper.citations} citations</span>
                          <span>{paper.views} views</span>
                          <span>{paper.revenue} tokens earned</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 float-right" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">You haven't published any papers yet.</p>
                  <Link to="/paper/upload" className="btn-primary-sm mt-2">
                    Upload Your First Paper
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Collaboration Invites Tab */}
          {activeTab === 'collaborations' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Collaboration Invites</h2>

              {loading.collaborations ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading your invitations...</p>
                </div>
              ) : collaborationInvites.length > 0 ? (
                <div className="bg-white rounded-lg shadow divide-y">
                  {collaborationInvites.map((invite) => (
                    <div key={invite.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{invite.title}</h3>
                          <p className="text-sm text-gray-500">
                            From {invite.from} • {invite.institution}
                          </p>
                          <p className="text-sm text-gray-500">Received on {invite.date}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleAcceptInvite(invite.id)}
                          className="btn-primary-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(invite.id)}
                          className="btn-secondary-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">You don't have any pending collaboration invites.</p>
                </div>
              )}
            </div>
          )}

          {/* Suggested Collaborators Tab */}
          {activeTab === 'suggested' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Suggested Collaborators</h2>

              {loading.suggested ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-500">Finding collaborators for you...</p>
                </div>
              ) : suggestedCollaborators.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestedCollaborators.map((collaborator) => (
                    <div key={collaborator.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex items-center">
                        <img 
                          src={collaborator.image} 
                          alt={collaborator.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-900">{collaborator.name}</h3>
                          <p className="text-sm text-gray-500">{collaborator.institution}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Field: {collaborator.field}</p>
                        <p className="text-sm text-gray-500">{collaborator.papers} papers</p>
                        <div className="mt-1 flex items-center">
                          <span className="text-xs text-gray-500">Match:</span>
                          <div className="ml-1 w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-500 h-2 rounded-full" 
                              style={{ width: `${collaborator.match}%` }}
                            ></div>
                          </div>
                          <span className="ml-1 text-xs text-gray-500">{collaborator.match}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendInvite(collaborator.id)}
                        className="mt-3 w-full btn-primary-sm"
                      >
                        Invite to Collaborate
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">No suggested collaborators found at the moment.</p>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Notifications</h2>
                {notifications.length > 0 && (
                  <button 
                    onClick={handleMarkAllNotificationsAsRead}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {loading.notifications ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading notifications...</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="bg-white rounded-lg shadow divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start">
                        {notification.type === 'citation' && (
                          <div className="p-2 bg-green-100 rounded-full">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        {notification.type === 'review' && (
                          <div className="p-2 bg-blue-100 rounded-full">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        {notification.type === 'token' && (
                          <div className="p-2 bg-amber-100 rounded-full">
                            <Wallet className="h-5 w-5 text-amber-600" />
                          </div>
                        )}
                        {notification.type === 'collaboration' && (
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                        )}
                        <div className="ml-3 flex-1">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">You don't have any notifications yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;