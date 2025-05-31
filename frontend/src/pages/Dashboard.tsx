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
import { ethers } from 'ethers';
import { uploadPaperToIPFS, getFromIPFS } from '../services/ipfs'; // Import IPFS functions

// Define ethereum property on window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract ABIs
// Note: You'll need to create these ABI files based on your contract compilation
import ReChainTokenABI from '../contracts/ReChainToken.json';
import PlatformABI from '../contracts/Platform.json';
import PaperPublishABI from '../contracts/PaperPublish.json';
import AccessControlABI from '../contracts/AccessControl.json';
import RevenueSharingABI from '../contracts/RevenueSharing.json';

// Contract addresses
const CONTRACT_ADDRESSES = {
  RESEARCH_TOKEN: "0x2b81cd876cb2045e6ce3939d9c01d39279a775aa",
  PLATFORM: "0xdaaff4d4485ede45244c7d2adc453377e0458f43",
  PAPER_PUBLISH: "0xe002ec13f6d5c8bab7fc1612cb934ab50e8c8d2e",
  ACCESS_CONTROL: "0x46a8a6405028e617e60789839342f77c17325d4f",
  REVENUE_SHARING: "0xbf562b3b8c6f3761647065747097b497c2c59de7"
};

// Define interfaces for your data types
interface Paper {
  id: string;
  title: string;
  status: 'published' | 'draft';
  date: string;
  citations: number;
  views: number;
  revenue: number;
  ipfsHash?: string;
  abstractText?: string;
  keywords?: string[];
  access?: 'OPEN' | 'PAID';
  authors?: string[];
  cost?: string;
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
  contracts: boolean;
  upload: boolean;
}

interface ContractInterfaces {
  token: ethers.Contract | null;
  platform: ethers.Contract | null;
  paperPublish: ethers.Contract | null;
  accessControl: ethers.Contract | null;
  revenueSharing: ethers.Contract | null;
}

// Form data for paper upload
interface PaperUploadData {
  title: string;
  abstract: string;
  keywords: string[];
  file: File | null;
  access: 'OPEN' | 'PAID';
  cost: string;
  additionalAuthors: string[];
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
    notifications: true,
    contracts: true,
    upload: false
  });
  
  // Paper upload form state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadData, setUploadData] = useState<PaperUploadData>({
    title: '',
    abstract: '',
    keywords: [],
    file: null,
    access: 'OPEN',
    cost: '0',
    additionalAuthors: []
  });
  
  // Create a local dashboard user object from auth user
  const dashboardUser: DashboardUser | null = user ? {
    id: user.uid, // Map uid from AuthContext user to id for dashboard
    name: user.displayName || 'User',
    tokens: 0, // Default or fetch from elsewhere
    contributionScore: 0 // Default or fetch from elsewhere
  } : null;
  
  // MetaMask and contract states
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contracts, setContracts] = useState<ContractInterfaces>({
    token: null,
    platform: null,
    paperPublish: null,
    accessControl: null,
    revenueSharing: null
  });
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registrationInProgress, setRegistrationInProgress] = useState<boolean>(false);

  // Initialize providers and contracts
  const initializeEthers = async (currentProvider: any) => {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(currentProvider);
      const ethersSigner = ethersProvider.getSigner();
      
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      
      // Initialize contracts
      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.RESEARCH_TOKEN,
        ReChainTokenABI,
        ethersSigner
      );
      
      const platformContract = new ethers.Contract(
        CONTRACT_ADDRESSES.PLATFORM,
        PlatformABI,
        ethersSigner
      );
      
      const paperPublishContract = new ethers.Contract(
        CONTRACT_ADDRESSES.PAPER_PUBLISH,
        PaperPublishABI,
        ethersSigner
      );
      
      const accessControlContract = new ethers.Contract(
        CONTRACT_ADDRESSES.ACCESS_CONTROL,
        AccessControlABI,
        ethersSigner
      );
      
      const revenueSharingContract = new ethers.Contract(
        CONTRACT_ADDRESSES.REVENUE_SHARING,
        RevenueSharingABI,
        ethersSigner
      );
      
      setContracts({
        token: tokenContract,
        platform: platformContract,
        paperPublish: paperPublishContract,
        accessControl: accessControlContract,
        revenueSharing: revenueSharingContract
      });
      
      setLoading(prev => ({...prev, contracts: false}));
      
      return { 
        provider: ethersProvider, 
        signer: ethersSigner, 
        contracts: {
          token: tokenContract,
          platform: platformContract,
          paperPublish: paperPublishContract,
          accessControl: accessControlContract,
          revenueSharing: revenueSharingContract
        }
      };
    } catch (error) {
      console.error("Error initializing ethers:", error);
      setLoading(prev => ({...prev, contracts: false}));
      return null;
    }
  };

  // Updated MetaMask disconnect function
  const handleDisconnectWallet = () => {
    // Note: MetaMask doesn't actually have a disconnect method
    // We can only clear our app's state
    setWalletConnected(false);
    setWalletAddress(null);
    setProvider(null);
    setSigner(null);
    setContracts({
      token: null,
      platform: null,
      paperPublish: null,
      accessControl: null,
      revenueSharing: null
    });
    setTokenBalance("0");
    setIsRegistered(false);
    
    // Optional: Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
    }
  };

  // Updated function to handle MetaMask wallet connection
  const handleWalletConnect = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Get the first account
        const address = accounts[0];
        setWalletConnected(true);
        setWalletAddress(address);
        
        // Initialize ethers
        const ethersData = await initializeEthers(window.ethereum);
        
        if (ethersData) {
          // Fetch token balance
          fetchTokenBalance(address, ethersData.contracts.token);
          
          // Check if user is registered
          checkUserRegistration(address, ethersData.contracts.platform);
        }
        
        // Optional: Subscribe to account changes
        window.ethereum.on('accountsChanged', async (newAccounts: string[]) => {
          setWalletAddress(newAccounts[0]);
          if (newAccounts[0] && contracts.token) {
            fetchTokenBalance(newAccounts[0], contracts.token);
            if (contracts.platform) {
              checkUserRegistration(newAccounts[0], contracts.platform);
            }
          } else {
            setTokenBalance("0");
            setIsRegistered(false);
          }
        });
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    } else {
      // MetaMask is not installed
      alert('MetaMask is not installed. Please install MetaMask to connect your wallet.');
    }
  };

  // Fetch token balance
  const fetchTokenBalance = async (address: string, tokenContract: ethers.Contract) => {
    try {
      const balance = await tokenContract.balanceOf(address);
      setTokenBalance(ethers.utils.formatEther(balance));
      
      // Update dashboard user
      if (dashboardUser) {
        dashboardUser.tokens = parseFloat(ethers.utils.formatEther(balance));
      }
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setTokenBalance("0");
    }
  };

  // Check if user is registered
  const checkUserRegistration = async (address: string, platformContract: ethers.Contract) => {
    try {
      const registered = await platformContract.isRegistered(address);
      setIsRegistered(registered);
    } catch (error) {
      console.error("Error checking registration:", error);
      setIsRegistered(false);
    }
  };

  // Register user
  const registerUser = async () => {
    if (!contracts.platform || !signer) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      setRegistrationInProgress(true);
      const tx = await contracts.platform.registerUser();
      await tx.wait();
      setIsRegistered(true);
      
      // Refresh token balance
      if (walletAddress && contracts.token) {
        fetchTokenBalance(walletAddress, contracts.token);
      }
      alert("Registration successful! You've received 100 RCHN tokens.");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setRegistrationInProgress(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({
        ...uploadData,
        file: e.target.files[0]
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'keywords') {
      setUploadData({
        ...uploadData,
        keywords: value.split(',').map(keyword => keyword.trim())
      });
    } else if (name === 'additionalAuthors') {
      setUploadData({
        ...uploadData,
        additionalAuthors: value.split(',').map(author => author.trim())
      });
    } else {
      setUploadData({
        ...uploadData,
        [name]: value
      });
    }
  };

  // Handle paper upload
  const handlePaperUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnected || !contracts.paperPublish) {
      alert("Please connect your wallet first");
      return;
    }

    if (!uploadData.file) {
      alert("Please select a file to upload");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, upload: true }));
      
      // Upload file to IPFS using Pinata
      const ipfsHash = await uploadPaperToIPFS(uploadData.file);
      
      if (!ipfsHash) {
        throw new Error("Failed to upload to IPFS");
      }
      
      // Format authors list - start with current wallet
      const authors = [walletAddress as string];
      // Add additional authors if provided
      if (uploadData.additionalAuthors.length > 0) {
        authors.push(...uploadData.additionalAuthors);
      }
      
      // Determine access type (0 for OPEN, 1 for PAID)
      const accessTypeEnum = uploadData.access === 'OPEN' ? 0 : 1;
      
      // Call smart contract to publish paper
      const tx = await contracts.paperPublish.publishPaper(
        uploadData.title,
        authors,
        uploadData.abstract,
        uploadData.keywords,
        ipfsHash,
        accessTypeEnum,
        { gasLimit: 500000 } // Add explicit gas limit to ensure transaction goes through
      );
      
      await tx.wait();
      console.log("Paper published successfully");
      
      // If PAID access, set price
      if (accessTypeEnum === 1 && contracts.accessControl && contracts.token) {
        try {
          // Convert cost to BigNumber with proper error handling
          const cost = ethers.utils.parseEther(uploadData.cost || "0");
          
          // Get the paper ID correctly using BigNumber
          const nextPaperIdBN = await contracts.paperPublish.nextPaperId();
          // Subtract 1 to get the ID of the paper we just published - using proper BigNumber subtraction
          const paperId = nextPaperIdBN.sub(ethers.BigNumber.from(1));
          
          console.log("Setting cost for paper ID:", paperId.toString());
          console.log("Cost amount:", ethers.utils.formatEther(cost), "RCHN");
          
          // First, check if we need to approve the access control contract to handle tokens
          // This step might be necessary if your contract design requires approval
          const approveGasLimit = 100000;
          const approveTx = await contracts.token.approve(
            CONTRACT_ADDRESSES.ACCESS_CONTROL,
            cost,
            { gasLimit: approveGasLimit }
          );
          await approveTx.wait();
          console.log("Token approval successful");
          
          // Then set the paper access cost with a higher gas limit
          const costTx = await contracts.accessControl.setPaperAccessCost(
            paperId,
            cost,
            { 
              gasLimit: 500000 // Set a higher gas limit to avoid estimation issues
            }
          );
          
          // Wait for transaction confirmation
          await costTx.wait();
          console.log("Successfully set paper access cost");
        } catch (costError) {
          console.error("Failed to set paper access cost:", costError);
          alert("Paper was published, but setting the access cost failed. The paper will be available for free.");
          // Continue with the flow despite this error
        }
      }
      
      // Reset the form
      setUploadData({
        title: '',
        abstract: '',
        keywords: [],
        file: null,
        access: 'OPEN',
        cost: '0',
        additionalAuthors: []
      });
      
      // Close the modal
      setShowUploadModal(false);
      
      // Refresh papers list
      fetchPapersFromBlockchain();
      
      alert("Paper published successfully to the blockchain!");
    } catch (error) {
      console.error("Error publishing paper:", error);
      alert("Failed to publish paper. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
    }
  };

  // Fetch user's papers from blockchain
  const fetchPapersFromBlockchain = async () => {
    if (!walletAddress || !contracts.paperPublish) return;
    
    try {
      const paperPublish = contracts.paperPublish; // Store reference to avoid null checks
      const paperIds = await paperPublish.getPapersByPublisher(walletAddress);
      const paperPromises = paperIds.map(async (id: ethers.BigNumber) => {
        const paper = await paperPublish.getPaper(id);
        
        // If we have access control contract, try to get the cost
        let cost = "0";
        if (contracts.accessControl) {
          try {
            const accessCost = await contracts.accessControl.paperAccessCosts(id);
            cost = ethers.utils.formatEther(accessCost);
          } catch (err) {
            console.log("No cost set for paper", id.toString());
          }
        }
        
        return {
          id: id.toString(),
          title: paper.title,
          status: 'published',
          date: new Date(paper.timestamp.toNumber() * 1000).toLocaleDateString(),
          citations: 0, // This would need to be tracked elsewhere
          views: 0, // This would need to be tracked elsewhere
          revenue: 0, // This would need to be tracked elsewhere
          ipfsHash: paper.ipfsHash,
          abstractText: paper.abstractText,
          keywords: paper.keywords,
          access: paper.access === 0 ? 'OPEN' : 'PAID',
          authors: paper.authors,
          cost: cost
        };
      });
      
      const fetchedPapers = await Promise.all(paperPromises);
      setPapers(fetchedPapers);
    } catch (error) {
      console.error("Error fetching papers from blockchain:", error);
      setPapers([]);
    } finally {
      setLoading(prev => ({...prev, papers: false}));
    }
  };

  // Check if MetaMask is already connected when component mounts
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletConnected(true);
            setWalletAddress(accounts[0]);
            
            // Initialize ethers
            const ethersData = await initializeEthers(window.ethereum);
            
            if (ethersData && accounts[0]) {
              // Fetch token balance
              fetchTokenBalance(accounts[0], ethersData.contracts.token);
              
              // Check if user is registered
              checkUserRegistration(accounts[0], ethersData.contracts.platform);
            }
          }
        } catch (error) {
          console.error("Error checking MetaMask connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Fetch user's papers
  useEffect(() => {
    if (walletConnected && contracts.paperPublish) {
      fetchPapersFromBlockchain();
    } else {
      const fetchPapers = async () => {
        try {
          // Replace with actual API call if you have a backend
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
      
      fetchPapers();
    }
  }, [walletConnected, contracts.paperPublish, dashboardUser?.id]);

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
              {walletConnected && !isRegistered && (
                <button 
                  onClick={registerUser}
                  className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300"
                  disabled={registrationInProgress}
                >
                  {registrationInProgress ? 'Registering...' : 'Register for free RCHN tokens'}
                </button>
              )}
            </div>

            <div className="flex mt-4 md:mt-0 space-x-4">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="btn-primary"
              >
                <Upload size={16} className="mr-2" />
                Upload Paper
              </button>

              {/* MetaMask wallet integration */}
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
                  <h3 className="text-2xl font-bold mt-1">{walletConnected ? parseFloat(tokenBalance).toFixed(2) : "0"} RCHN</h3>
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
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn-secondary-sm"
                >
                  Upload New Paper
                </button>
              </div>

              {!walletConnected ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500 mb-4">Connect your wallet to see your published papers on the blockchain.</p>
                  <button 
                    onClick={handleWalletConnect}
                    className="btn-primary-sm"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : loading.papers ? (
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
                            paper.access === 'OPEN' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {paper.access}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap text-sm text-gray-500 space-x-4">
                          <span>{paper.citations} citations</span>
                          <span>{paper.views} views</span>
                          <span>{paper.revenue} tokens earned</span>
                          {paper.access === 'PAID' && (
                            <span className="font-semibold">Cost: {paper.cost} RCHN</span>
                          )}
                          {paper.ipfsHash && (
                            <span className="break-all">
                              IPFS: <a 
                                href={`https://ipfs.io/ipfs/${paper.ipfsHash}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (paper.ipfsHash) {
                                    getFromIPFS(paper.ipfsHash)
                                      .then(url => window.open(url, '_blank'))
                                      .catch(err => console.error("Error fetching from IPFS:", err));
                                  }
                                }}
                              >
                                {paper.ipfsHash.substring(0, 16)}...
                              </a>
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 float-right" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">You haven't published any papers yet.</p>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary-sm mt-2"
                  >
                    Upload Your First Paper
                  </button>
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

      {/* Upload Paper Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upload Research Paper</h2>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <form onSubmit={handlePaperUpload} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Paper Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={uploadData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-1">
                    Abstract *
                  </label>
                  <textarea
                    id="abstract"
                    name="abstract"
                    value={uploadData.abstract}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords (comma separated) *
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    placeholder="e.g. blockchain, research, decentralized"
                    value={uploadData.keywords.join(', ')}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="additionalAuthors" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Authors (comma separated wallet addresses)
                  </label>
                  <input
                    type="text"
                    id="additionalAuthors"
                    name="additionalAuthors"
                    placeholder="0x123..., 0x456..."
                    value={uploadData.additionalAuthors.join(', ')}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Your wallet address will be added automatically as an author</p>
                </div>
                
                <div>
                  <label htmlFor="access" className="block text-sm font-medium text-gray-700 mb-1">
                    Access Type *
                  </label>
                  <select
                    id="access"
                    name="access"
                    value={uploadData.access}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="OPEN">Open Access (Free)</option>
                    <option value="PAID">Paid Access</option>
                  </select>
                </div>
                
                {uploadData.access === 'PAID' && (
                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                      Access Cost (RCHN Tokens) *
                    </label>
                    <input
                      type="number"
                      id="cost"
                      name="cost"
                      value={uploadData.cost}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      required={uploadData.access === 'PAID'}
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                    Paper File (PDF) *
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                {!walletConnected && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-yellow-700 text-sm">
                      Please connect your wallet first to publish a paper on the blockchain.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!walletConnected || loading.upload}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed"
                  >
                    {loading.upload ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                        Uploading...
                      </span>
                    ) : (
                      'Publish Paper'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;