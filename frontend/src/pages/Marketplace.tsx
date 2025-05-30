import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  DollarSign, 
  BookOpen,
  Tag,
  ChevronDown,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Mock data for collaboration projects
const collaborationProjects = [
  {
    id: 1,
    title: 'Neural Networks for Climate Prediction',
    description: 'Looking for researchers to collaborate on developing neural network models for improved climate change prediction. Expertise in ML and environmental science needed.',
    creator: 'Dr. Emily Parker',
    institution: 'Harvard University',
    funding: 1500,
    contributors: 3,
    timeframe: '6 months',
    tags: ['AI', 'Climate Science', 'Neural Networks'],
    image: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 2,
    title: 'Blockchain for Supply Chain Transparency',
    description: 'Research project exploring blockchain implementation for improving supply chain transparency in pharmaceutical industry. Seeking blockchain developers and supply chain experts.',
    creator: 'Prof. Robert Johnson',
    institution: 'MIT',
    funding: 2200,
    contributors: 2,
    timeframe: '8 months',
    tags: ['Blockchain', 'Supply Chain', 'Pharmaceuticals'],
    image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 3,
    title: 'Quantum Algorithms for Drug Discovery',
    description: 'Developing quantum computing algorithms to accelerate drug discovery process. Looking for quantum computing researchers and biochemistry experts.',
    creator: 'Dr. Michael Chen',
    institution: 'Stanford University',
    funding: 3000,
    contributors: 4,
    timeframe: '12 months',
    tags: ['Quantum Computing', 'Drug Discovery', 'Algorithms'],
    image: 'https://images.pexels.com/photos/4031321/pexels-photo-4031321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 4,
    title: 'AI Ethics in Healthcare Applications',
    description: 'Research on ethical frameworks for AI implementation in healthcare settings. Seeking contributors with backgrounds in ethics, healthcare policy, and AI.',
    creator: 'Dr. Sarah Williams',
    institution: 'Johns Hopkins University',
    funding: 1800,
    contributors: 3,
    timeframe: '10 months',
    tags: ['AI Ethics', 'Healthcare', 'Policy'],
    image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Mock data for papers
const papers = [
  {
    id: 1,
    title: 'Quantum Computing Applications in Biochemistry',
    authors: ['John Smith', 'Maria Garcia', 'David Wong'],
    institution: 'Stanford University',
    abstract: 'This research explores the applications of quantum computing in solving complex biochemical problems. We propose a novel algorithm that significantly reduces computation time for protein folding simulations.',
    date: '2025-02-10',
    access: 'paid',
    price: 5,
    citations: 12,
    tags: ['Quantum Computing', 'Biochemistry', 'Algorithms'],
  },
  {
    id: 2,
    title: 'Neural Network Approaches to Climate Prediction',
    authors: ['Lisa Zhang', 'Robert Johnson'],
    institution: 'MIT',
    abstract: 'We present a novel neural network architecture designed specifically for long-term climate prediction. Our approach combines recurrent neural networks with attention mechanisms to capture complex climate patterns.',
    date: '2025-01-15',
    access: 'open',
    price: 0,
    citations: 8,
    tags: ['Neural Networks', 'Climate Science', 'AI'],
  },
  {
    id: 3,
    title: 'Blockchain Solutions for Supply Chain Management',
    authors: ['Michael Brown', 'Sarah Lee', 'James Wilson'],
    institution: 'University of California, Berkeley',
    abstract: 'This paper explores blockchain-based solutions for improving transparency and efficiency in global supply chains. We propose a novel consensus mechanism optimized for supply chain applications.',
    date: '2025-03-01',
    access: 'paid',
    price: 8,
    citations: 5,
    tags: ['Blockchain', 'Supply Chain', 'Distributed Systems'],
  },
];

// Marketplace types
type MarketplaceType = 'projects' | 'papers';

const Marketplace = () => {
  const [marketplaceType, setMarketplaceType] = useState<MarketplaceType>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // All unique tags
  const allTags = Array.from(
    new Set([
      ...collaborationProjects.flatMap(project => project.tags),
      ...papers.flatMap(paper => paper.tags)
    ])
  );

  // Filter projects based on search query and selected tags
  const filteredProjects = collaborationProjects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => project.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Filter papers based on search query and selected tags
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = searchQuery === '' || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => paper.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-neutral-50"
    >
      {/* Marketplace header */}
      <div className="bg-primary-900 text-white">
        <div className="container-custom py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Research Marketplace</h1>
          <p className="text-lg text-neutral-200 max-w-2xl mb-8">
            Discover collaboration opportunities and research papers from the global academic community.
          </p>
          
          {/* Search bar */}
          <div className="max-w-3xl">
            <div className="flex">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={20} />
                <input
                  type="text"
                  placeholder="Search for projects, papers, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-l-md text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button 
                className="bg-white text-primary-900 px-4 py-2 rounded-r-md flex items-center hover:bg-neutral-100"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} className="mr-2" />
                Filters
                <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div className="bg-white p-4 rounded-b-md shadow-md -mt-1 animate-slideDown">
                <h3 className="font-medium mb-2">Filter by tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Marketplace tabs */}
      <div className="container-custom">
        <div className="flex border-b border-neutral-200 mt-6">
          <button
            className={`pb-4 px-6 font-medium ${
              marketplaceType === 'projects'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setMarketplaceType('projects')}
          >
            <div className="flex items-center">
              <Users size={18} className="mr-2" />
              Collaboration Projects
            </div>
          </button>
          
          <button
            className={`pb-4 px-6 font-medium ${
              marketplaceType === 'papers'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-primary-600'
            }`}
            onClick={() => setMarketplaceType('papers')}
          >
            <div className="flex items-center">
              <BookOpen size={18} className="mr-2" />
              Research Papers
            </div>
          </button>
        </div>
      </div>
      
      {/* Projects tab */}
      {marketplaceType === 'projects' && (
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-100"
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="border-t border-neutral-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500 flex items-center">
                        <Users size={16} className="mr-1" />
                        Contributors:
                      </span>
                      <span className="font-medium">{project.contributors} needed</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500 flex items-center">
                        <DollarSign size={16} className="mr-1" />
                        Funding:
                      </span>
                      <span className="font-medium">{project.funding} tokens</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500 flex items-center">
                        <Clock size={16} className="mr-1" />
                        Duration:
                      </span>
                      <span className="font-medium">{project.timeframe}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-neutral-500">By </span>
                      <span className="font-medium">{project.creator}</span>
                      <p className="text-neutral-500 text-xs">{project.institution}</p>
                    </div>
                    <Link 
                      to={`/project/${project.id}`}
                      className="btn-primary py-1.5 px-3"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No projects found</h3>
              <p className="mt-2 text-neutral-600">
                Try adjusting your search filters or check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Papers tab */}
      {marketplaceType === 'papers' && (
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 gap-6">
            {filteredPapers.map((paper) => (
              <motion.div
                key={paper.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-100 p-6"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1">
                    <Link 
                      to={`/paper/${paper.id}`}
                      className="text-xl font-semibold text-primary-800 hover:text-primary-600 transition-colors flex items-start"
                    >
                      {paper.title}
                      <ExternalLink size={16} className="ml-2 mt-1 flex-shrink-0" />
                    </Link>
                    
                    <div className="mt-2 flex flex-wrap">
                      <p className="text-neutral-700">
                        {paper.authors.join(', ')}
                      </p>
                      <span className="mx-2 text-neutral-400">•</span>
                      <p className="text-neutral-600">{paper.institution}</p>
                    </div>
                    
                    <p className="mt-3 text-neutral-600">
                      {paper.abstract}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {paper.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-56 mt-4 md:mt-0 md:ml-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-500">Published:</span>
                        <span className="text-sm font-medium">{paper.date}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-500">Citations:</span>
                        <span className="text-sm font-medium">{paper.citations}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-neutral-500">Access:</span>
                        {paper.access === 'open' ? (
                          <span className="px-2 py-0.5 bg-success-100 text-success-800 rounded text-xs font-medium">
                            Open Access
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded text-xs font-medium">
                            {paper.price} tokens
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Link
                      to={`/paper/${paper.id}`}
                      className="btn-primary w-full text-center flex items-center justify-center"
                    >
                      View Paper
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No papers found</h3>
              <p className="mt-2 text-neutral-600">
                Try adjusting your search filters or check back later for new publications.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Marketplace;