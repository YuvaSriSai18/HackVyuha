import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Users, 
  BookOpen,
  Tag,
  ChevronDown,
  ExternalLink,
  ChevronRight,
  UserCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Define TypeScript interfaces
interface CollaborationProject {
  id: string | number;
  title: string;
  description: string;
  creator: string;
  creatorId?: string | number;
  contributors: number;
  tags: string[];
  image: string;
}

interface ResearchPaper {
  id: string | number;
  title: string;
  authors: string[];
  abstract: string;
  date: string;
  access: 'open' | 'paid';
  price: number;
  citations: number;
  tags: string[];
}

// Marketplace types
type MarketplaceType = 'projects' | 'papers';

const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [marketplaceType, setMarketplaceType] = useState<MarketplaceType>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState<CollaborationProject[]>([]);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState({
    projects: false,
    papers: false
  });
  
  // Replace the existing allTags calculation with:
  const [commonTags, setCommonTags] = useState<string[]>([
    'AI', 'Machine Learning', 'Blockchain', 'Climate Science', 
    'Healthcare', 'Quantum Computing', 'Supply Chain', 
    'Ethics', 'Neural Networks', 'Algorithms'
  ]);

  // All unique tags - computed from projects, papers, and common tags
  const allTags = Array.from(
    new Set([
      ...commonTags,
      ...projects.flatMap(project => project.tags),
      ...papers.flatMap(paper => paper.tags)
    ])
  );

  // Filter projects based on search query and selected tags
  const filteredProjects = projects.filter(project => {
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

  const handleApply = (projectId: string | number) => {
    navigate(`/apply/${projectId}`);
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
                <h3 className="font-medium mb-2 text-primary-700">Filter by tags:</h3>
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
          {loading.projects ? (
            <div className="text-center py-12">
              <Loader size={40} className="mx-auto animate-spin text-primary-600" />
              <p className="mt-4 text-neutral-600">Loading collaboration projects...</p>
            </div>
          ) : (
            <>
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
                      
                      <div className="border-t border-neutral-100 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500 flex items-center">
                            <Users size={16} className="mr-1" />
                            Contributors:
                          </span>
                          <span className="font-medium">{project.contributors} needed</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <Link
                          to={`/researcher/${project.creatorId || '#'}`}
                          className="flex items-center text-sm text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          <UserCircle size={18} className="mr-1" />
                          {project.creator}
                        </Link>
                        <button
                          onClick={() => handleApply(project.id)}
                          className="btn-primary py-1.5 px-3"
                        >
                          Apply
                        </button>
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
            </>
          )}
        </div>
      )}
      
      {/* Papers tab */}
      {marketplaceType === 'papers' && (
        <div className="container-custom py-8">
          {loading.papers ? (
            <div className="text-center py-12">
              <Loader size={40} className="mx-auto animate-spin text-primary-600" />
              <p className="mt-4 text-neutral-600">Loading research papers...</p>
            </div>
          ) : (
            <>
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
                        
                        <div className="mt-2">
                          <p className="text-neutral-700">
                            {paper.authors.join(', ')}
                          </p>
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
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Marketplace;