import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  getFirestore, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { 
   
  XCircle, 
  FileText, 
   
  Calendar, 
  CheckCheck,
  X,
  ExternalLink,
  
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface ReviewerApplication {
  id: string;
  fullName: string;
  email: string;
  institution: string;
  position: string;
  domains: string[];
  otherDomain: string;
  publications: string;
  experience: string;
  reason: string;
  availability: string;
  cvUrl: string | null;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const db = getFirestore();
  
  const [applications, setApplications] = useState<ReviewerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<ReviewerApplication | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  
  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.isAdmin) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Fetch reviewer applications
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        let q = query(
          collection(db, 'reviewer_applications'),
          orderBy('submittedAt', 'desc')
        );
        
        if (filter !== 'all') {
          q = query(
            collection(db, 'reviewer_applications'),
            where('status', '==', filter),
            orderBy('submittedAt', 'desc')
          );
        }
        
        const snapshot = await getDocs(q);
        const applicationsData: ReviewerApplication[] = [];
        
        snapshot.forEach((doc) => {
          applicationsData.push({
            id: doc.id,
            ...doc.data() as Omit<ReviewerApplication, 'id'>
          });
        });
        
        setApplications(applicationsData);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load reviewer applications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [db, filter]);
  
  const handleStatusChange = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    setProcessing(applicationId);
    try {
      const applicationRef = doc(db, 'reviewer_applications', applicationId);
      await updateDoc(applicationRef, { status: newStatus });
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      // Close details if this was the selected application
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status');
    } finally {
      setProcessing(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };
  
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Access Denied</h1>
          <p className="mt-2 text-neutral-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-neutral-50 py-6 px-4"
    >
      <div className="container-custom">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Reviewer Applications</h2>
          
          {/* Filter tabs */}
          <div className="flex border-b border-neutral-200 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`pb-2 px-4 font-medium ${
                filter === 'all'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`pb-2 px-4 font-medium ${
                filter === 'pending'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`pb-2 px-4 font-medium ${
                filter === 'approved'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`pb-2 px-4 font-medium ${
                filter === 'rejected'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-neutral-600 hover:text-primary-600'
              }`}
            >
              Rejected
            </button>
          </div>
          
          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded flex items-center">
              <XCircle size={20} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader size={30} className="text-primary-600 animate-spin" />
              <span className="ml-2 text-neutral-600">Loading applications...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Applications list */}
              <div className="lg:col-span-1 border-r border-neutral-200 pr-6">
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {applications.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                      No applications found.
                    </div>
                  ) : (
                    applications.map((application) => (
                      <div 
                        key={application.id} 
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors ${
                          selectedApplication?.id === application.id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                        }`}
                        onClick={() => setSelectedApplication(application)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-neutral-900">{application.fullName}</h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">{application.email}</p>
                        <p className="text-sm text-neutral-600 mb-1">
                          {application.institution || 'No institution provided'}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {application.domains.slice(0, 3).map((domain, idx) => (
                            <span key={idx} className="text-xs bg-neutral-100 px-2 py-0.5 rounded">
                              {domain}
                            </span>
                          ))}
                          {application.domains.length > 3 && (
                            <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded">
                              +{application.domains.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-neutral-500 mt-3">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(application.submittedAt)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Application details */}
              <div className="lg:col-span-2">
                {selectedApplication ? (
                  <div className="bg-white p-6 rounded-lg border border-neutral-200">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                          {selectedApplication.fullName}
                        </h3>
                        <p className="text-neutral-600">{selectedApplication.email}</p>
                      </div>
                      <div>
                        {getStatusBadge(selectedApplication.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-neutral-500 mb-1">Institution</p>
                        <p className="font-medium">
                          {selectedApplication.institution || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 mb-1">Position</p>
                        <p className="font-medium">
                          {selectedApplication.position || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 mb-1">Availability</p>
                        <p className="font-medium">
                          {selectedApplication.availability || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 mb-1">Submitted</p>
                        <p className="font-medium">
                          {formatDate(selectedApplication.submittedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-sm text-neutral-500 mb-1">Domain Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.domains.map((domain, idx) => (
                          <span key={idx} className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                            {domain}
                          </span>
                        ))}
                        {selectedApplication.otherDomain && (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                            {selectedApplication.otherDomain}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-sm text-neutral-500 mb-1">Experience</p>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <p className="text-neutral-800 whitespace-pre-wrap">
                          {selectedApplication.experience}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-sm text-neutral-500 mb-1">Reason for applying</p>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <p className="text-neutral-800 whitespace-pre-wrap">
                          {selectedApplication.reason}
                        </p>
                      </div>
                    </div>
                    
                    {selectedApplication.publications && (
                      <div className="mb-6">
                        <p className="text-sm text-neutral-500 mb-1">Publications</p>
                        <div className="bg-neutral-50 p-3 rounded-md">
                          <p className="text-neutral-800 whitespace-pre-wrap">
                            {selectedApplication.publications}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {selectedApplication.cvUrl && (
                      <div className="mb-6">
                        <p className="text-sm text-neutral-500 mb-1">CV/Resume</p>
                        <a 
                          href={selectedApplication.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary-600 hover:text-primary-800"
                        >
                          <FileText size={18} className="mr-2" />
                          View CV
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    )}
                    
                    {/* Actions */}
                    {selectedApplication.status === 'pending' && (
                      <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-neutral-200">
                        <button
                          onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                          disabled={!!processing}
                          className="px-4 py-2 border border-error-300 text-error-700 rounded-md hover:bg-error-50 flex items-center"
                        >
                          {processing === selectedApplication.id ? (
                            <>
                              <Loader size={16} className="animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <X size={16} className="mr-2" />
                              Reject
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                          disabled={!!processing}
                          className="px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700 flex items-center"
                        >
                          {processing === selectedApplication.id ? (
                            <>
                              <Loader size={16} className="animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCheck size={16} className="mr-2" />
                              Approve
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center py-20 text-neutral-500 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p>Select an application to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;