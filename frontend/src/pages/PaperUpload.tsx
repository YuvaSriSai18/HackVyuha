import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Tag, 
  DollarSign, 
  Check, 
  Info, 
  AlertTriangle,
  ArrowLeft,
  Lock,
  Unlock
} from 'lucide-react';

const PaperUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [accessModel, setAccessModel] = useState('open');
  const [price, setPrice] = useState('5');
  const [royaltyPercent, setRoyaltyPercent] = useState('10');
  const [currentStep, setCurrentStep] = useState(1);
  const [aiSummary, setAiSummary] = useState('');
  const [plagiarismResult, setPlagiarismResult] = useState<null | { score: number, status: 'pass' | 'warning' | 'fail' }>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate file upload with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploadComplete(true);
        setIsUploading(false);
        
        // Simulate AI processing
        setTimeout(() => {
          setAiSummary("This research paper explores the applications of quantum computing in solving complex biochemical problems. The authors propose a novel algorithm that significantly reduces computation time for protein folding simulations. The methodology combines quantum annealing techniques with machine learning approaches to overcome limitations in traditional computing methods. Results show a 200x speedup compared to classical methods for certain molecular structures.");
          
          setPlagiarismResult({
            score: 3.2,
            status: 'pass'
          });
          
          setCurrentStep(2);
        }, 1500);
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 2) {
      // Simulate publishing to blockchain
      setCurrentStep(3);
      
      // Simulate smart contract deployment
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div 
        className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {!file ? (
          <div>
            <Upload className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900">Upload your research paper</h3>
            <p className="mt-1 text-sm text-neutral-500">PDF format, max 50MB</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            <button className="mt-4 btn-primary">
              Select File
            </button>
          </div>
        ) : (
          <div>
            <FileText className="mx-auto h-12 w-12 text-primary-500" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900">{file.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            
            {!isUploading && !uploadComplete ? (
              <button 
                className="mt-4 btn-primary"
                onClick={handleFileUpload}
              >
                Upload
              </button>
            ) : isUploading ? (
              <div className="mt-4">
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-neutral-600">Uploading... {uploadProgress}%</p>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-center text-success-500">
                <Check className="mr-2" />
                <span>Upload complete</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {uploadComplete && (
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <p className="text-center text-neutral-500 mb-2">Processing your paper...</p>
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMetadataStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Paper Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
            placeholder="Enter the full title of your paper"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="authors" className="block text-sm font-medium text-neutral-700 mb-1">
            Authors
          </label>
          <input
            type="text"
            id="authors"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            required
            className="input"
            placeholder="e.g., John Smith, Jane Doe (comma separated)"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="abstract" className="block text-sm font-medium text-neutral-700 mb-1">
            Abstract
          </label>
          <textarea
            id="abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            required
            rows={5}
            className="input"
            placeholder="Enter the abstract of your paper"
          ></textarea>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="keywords" className="block text-sm font-medium text-neutral-700 mb-1">
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
            className="input"
            placeholder="e.g., quantum computing, biochemistry (comma separated)"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Access Model
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div 
              className={`border rounded-lg p-4 cursor-pointer ${
                accessModel === 'open' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-300 hover:border-primary-300'
              }`}
              onClick={() => setAccessModel('open')}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${
                  accessModel === 'open' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  <Unlock size={20} />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-neutral-900">Open Access</h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    Your paper will be freely available to all users. You'll receive tokens based on citations and engagement.
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer ${
                accessModel === 'paid' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-300 hover:border-primary-300'
              }`}
              onClick={() => setAccessModel('paid')}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${
                  accessModel === 'paid' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  <Lock size={20} />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-neutral-900">Paid Access</h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    Users will pay tokens to access your paper. You'll receive direct revenue and citation rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {accessModel === 'paid' && (
          <>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                Price (tokens)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
                required
                className="input"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Recommended: 5-20 tokens based on paper length and complexity
              </p>
            </div>
            
            <div>
              <label htmlFor="royalty" className="block text-sm font-medium text-neutral-700 mb-1">
                Co-author Royalty (%)
              </label>
              <input
                type="number"
                id="royalty"
                value={royaltyPercent}
                onChange={(e) => setRoyaltyPercent(e.target.value)}
                min="0"
                max="100"
                required
                className="input"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Percentage of revenue shared with co-authors
              </p>
            </div>
          </>
        )}
      </div>
      
      {/* AI Analysis Results */}
      {aiSummary && (
        <div className="mt-8 space-y-6">
          <div className="border border-neutral-200 rounded-lg p-6 bg-neutral-50">
            <h3 className="text-lg font-medium flex items-center">
              <Info className="mr-2 text-primary-600" size={20} />
              AI-Generated Summary
            </h3>
            <p className="mt-2 text-neutral-700">{aiSummary}</p>
          </div>
          
          {plagiarismResult && (
            <div className={`border rounded-lg p-6 ${
              plagiarismResult.status === 'pass' 
                ? 'border-success-200 bg-success-50' 
                : plagiarismResult.status === 'warning'
                ? 'border-warning-200 bg-warning-50'
                : 'border-error-200 bg-error-50'
            }`}>
              <h3 className="text-lg font-medium flex items-center">
                {plagiarismResult.status === 'pass' ? (
                  <Check className="mr-2 text-success-600\" size={20} />
                ) : (
                  <AlertTriangle className="mr-2 text-warning-600" size={20} />
                )}
                Plagiarism Check
              </h3>
              <div className="mt-2">
                <p className="text-neutral-700">
                  Similarity score: <span className="font-semibold">{plagiarismResult.score}%</span>
                </p>
                <p className="mt-1 text-sm">
                  {plagiarismResult.status === 'pass' 
                    ? 'Your paper passed the plagiarism check. It appears to be original work.'
                    : plagiarismResult.status === 'warning'
                    ? 'Your paper contains some similarities with existing works. Please review before proceeding.'
                    : 'High similarity detected. Please review your paper for potential plagiarism issues.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between pt-6 border-t border-neutral-200">
        <button 
          type="button" 
          className="btn-outline"
          onClick={() => setCurrentStep(1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <button 
          type="submit" 
          className="btn-primary"
        >
          Publish Paper
        </button>
      </div>
    </form>
  );

  const renderPublishingStep = () => (
    <div className="space-y-6 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
      <h3 className="text-xl font-medium">Publishing your paper to the blockchain</h3>
      <div className="space-y-4 max-w-md mx-auto text-left">
        <div>
          <div className="flex items-center">
            <Check className="text-success-500 mr-2" size={20} />
            <span>Uploading to decentralized storage (IPFS)</span>
          </div>
          <div className="h-1 bg-success-500 rounded mt-1"></div>
        </div>
        <div>
          <div className="flex items-center">
            <Check className="text-success-500 mr-2" size={20} />
            <span>Registering metadata on blockchain</span>
          </div>
          <div className="h-1 bg-success-500 rounded mt-1"></div>
        </div>
        <div>
          <div className="flex items-center">
            <div className="animate-pulse">
              <div className="h-5 w-5 bg-primary-600 rounded-full mr-2"></div>
            </div>
            <span>Deploying smart contracts</span>
          </div>
          <div className="h-1 bg-neutral-300 rounded mt-1">
            <div className="h-1 bg-primary-500 rounded" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
      <p className="text-neutral-500">This may take a few moments. Please don't close this page.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h1 className="text-3xl font-bold mb-2">Upload Research Paper</h1>
          <p className="text-neutral-600 mb-6">Share your research with the academic community</p>
          
          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  1
                </div>
                <div className="ml-2 text-sm font-medium">Upload</div>
              </div>
              <div className={`h-0.5 w-12 ${currentStep > 1 ? 'bg-primary-600' : 'bg-neutral-200'}`}></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  2
                </div>
                <div className="ml-2 text-sm font-medium">Metadata</div>
              </div>
              <div className={`h-0.5 w-12 ${currentStep > 2 ? 'bg-primary-600' : 'bg-neutral-200'}`}></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  3
                </div>
                <div className="ml-2 text-sm font-medium">Publish</div>
              </div>
            </div>
          </div>
          
          {/* Step content */}
          {currentStep === 1 && renderUploadStep()}
          {currentStep === 2 && renderMetadataStep()}
          {currentStep === 3 && renderPublishingStep()}
        </motion.div>
      </div>
    </div>
  );
};

export default PaperUpload;