import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Download, 
  Share2,
  BookmarkPlus,
  ThumbsUp,
  AlertTriangle,
  Lock,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Mock paper data
const paperData = {
  id: 1,
  title: 'Quantum Computing Applications in Biochemistry',
  authors: ['John Smith', 'Maria Garcia', 'David Wong'],
  abstract: 'This research explores the applications of quantum computing in solving complex biochemical problems. We propose a novel algorithm that significantly reduces computation time for protein folding simulations. Our methodology combines quantum annealing techniques with machine learning approaches to overcome limitations in traditional computing methods. Results show a 200x speedup compared to classical methods for certain molecular structures.',
  date: '2025-02-10',
  keywords: ['quantum computing', 'biochemistry', 'protein folding', 'algorithms'],
  journal: 'Journal of Quantum Biochemistry',
  doi: '10.1234/jqb.2025.01.001',
  citations: 12,
  views: 345,
  downloads: 87,
  likes: 56,
  isPaid: true,
  price: 5,
  isPurchased: true,
  url: '#',
  content: [
    {
      section: 'Introduction',
      text: 'The intersection of quantum computing and biochemistry represents a frontier with enormous potential. As computational demands for modeling complex biological systems continue to increase, traditional computing approaches face significant limitations. Quantum computing offers a promising alternative, with its ability to handle exponentially larger computational spaces through quantum bits (qubits) and superposition.',
    },
    {
      section: 'Methodology',
      text: 'We developed a hybrid quantum-classical algorithm specifically designed for protein folding simulations. The approach utilizes quantum annealing for global optimization while incorporating machine learning components for feature extraction and parameter optimization. Our implementation was tested on the D-Wave quantum computer with 5000+ qubits, as well as on quantum circuit simulators for comparison.',
    },
    {
      section: 'Results',
      text: 'Our quantum-enhanced algorithm demonstrated significant performance improvements over classical methods. For medium-sized proteins (100-300 amino acids), we observed speedups ranging from 20x to 200x depending on the complexity of the folding landscape. The accuracy of predicted structures was comparable to state-of-the-art classical methods, with RMSD values averaging 2.3Å for tested structures.',
    },
    {
      section: 'Discussion',
      text: 'The results highlight the potential of quantum computing to address computationally intensive problems in biochemistry. While current quantum hardware still faces limitations in terms of qubit coherence and error rates, our hybrid approach mitigates many of these challenges. The performance improvements observed suggest that even with noisy intermediate-scale quantum (NISQ) devices, significant computational advantages can be achieved for specific biochemical applications.',
    },
    {
      section: 'Conclusion',
      text: 'Our work demonstrates the practical application of quantum computing to accelerate biochemical simulations. The hybrid algorithm developed provides a template for future quantum-enhanced applications in computational biology. As quantum hardware continues to advance, we anticipate further improvements in both speed and accuracy. Future work will focus on extending the approach to other challenging problems in structural biology and drug discovery.',
    },
  ],
  references: [
    'Smith, J. et al. (2023). Quantum algorithms for biochemical simulation. Nature Quantum Information, 5(2), 45-52.',
    'Garcia, M. & Wong, D. (2024). Machine learning enhancement of quantum annealing. Quantum Machine Intelligence, 3(1), 12-25.',
    'Johnson, A. et al. (2022). Protein folding on quantum annealers. Physical Review X, 12(3), 031038.',
    'Williams, R. (2024). The state of quantum computing for computational biology. Bioinformatics Advances, 2(1), 100-115.',
    'Chen, K. et al. (2023). Hybrid quantum-classical algorithms for molecular modeling. Journal of Chemical Theory and Computation, 19(5), 2817-2830.',
  ],
  relatedPapers: [
    {
      id: 2,
      title: 'Machine Learning Approaches to Quantum Chemistry',
      authors: ['Emily Chen', 'Robert Johnson'],
      date: '2024-11-15',
    },
    {
      id: 3,
      title: 'Quantum Supremacy in Computational Biology',
      authors: ['Sarah Williams', 'James Rodriguez'],
      date: '2024-09-22',
    },
    {
      id: 4,
      title: 'Novel Protein Structure Prediction Using Quantum Neural Networks',
      authors: ['Thomas Lee', 'Anna Schmidt'],
      date: '2025-01-05',
    },
  ],
};

const PaperView = () => {
  const { id } = useParams<{ id: string }>();
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    'Introduction': true,
    'Methodology': false,
    'Results': false,
    'Discussion': false,
    'Conclusion': false,
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  // In a real application, we would fetch the paper data based on the ID
  // For now, we'll just use our mock data
  const paper = paperData;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-custom max-w-5xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Paper header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">{paper.title}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {paper.authors.map((author, index) => (
                    <span key={index} className="text-primary-700 hover:text-primary-900 cursor-pointer">
                      {author}{index < paper.authors.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-neutral-600 mb-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>{paper.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    <span>{paper.views} views</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare size={16} className="mr-1" />
                    <span>{paper.citations} citations</span>
                  </div>
                  <div className="flex items-center">
                    <Download size={16} className="mr-1" />
                    <span>{paper.downloads} downloads</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp size={16} className="mr-1" />
                    <span>{paper.likes} likes</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {paper.keywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs hover:bg-primary-50 hover:text-primary-700 cursor-pointer transition-colors"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-neutral-800 mb-2">Abstract</h3>
                  <p className="text-neutral-600">{paper.abstract}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {paper.isPaid && !paper.isPurchased ? (
                    <button 
                      className="btn-primary"
                      onClick={() => setShowPurchaseModal(true)}
                    >
                      <Lock size={16} className="mr-2" />
                      Purchase Access ({paper.price} tokens)
                    </button>
                  ) : (
                    <a href={paper.url} className="btn-primary">
                      <Download size={16} className="mr-2" />
                      Download PDF
                    </a>
                  )}
                  <button className="btn-outline">
                    <Share2 size={16} className="mr-2" />
                    Share
                  </button>
                  <button className="btn-outline">
                    <BookmarkPlus size={16} className="mr-2" />
                    Save
                  </button>
                  <button className="btn-outline">
                    <ThumbsUp size={16} className="mr-2" />
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Paper content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Content access */}
              {paper.isPaid && !paper.isPurchased ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <Lock className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">This content is locked</h3>
                  <p className="text-neutral-600 mb-6">
                    Purchase access to view the full paper and download the PDF.
                  </p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowPurchaseModal(true)}
                  >
                    <DollarSign size={16} className="mr-2" />
                    Purchase for {paper.price} tokens
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-xl font-semibold mb-6">Paper Content</h2>
                  
                  {paper.content.map((section, index) => (
                    <div key={index} className="mb-6 border-b border-neutral-100 pb-6 last:border-0 last:pb-0">
                      <div 
                        className="flex justify-between items-center cursor-pointer" 
                        onClick={() => toggleSection(section.section)}
                      >
                        <h3 className="text-lg font-medium">{section.section}</h3>
                        {expandedSections[section.section] ? (
                          <ChevronUp size={20} className="text-neutral-500" />
                        ) : (
                          <ChevronDown size={20} className="text-neutral-500" />
                        )}
                      </div>
                      
                      {expandedSections[section.section] && (
                        <div className="mt-3 text-neutral-700">
                          <p>{section.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* References */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-xl font-semibold mb-6">References</h2>
                <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                  {paper.references.map((reference, index) => (
                    <li key={index} className="hover:text-primary-700 cursor-pointer">
                      {reference}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Paper details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Paper Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-neutral-500">Journal:</span>
                    <p className="text-neutral-800">{paper.journal}</p>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-500">DOI:</span>
                    <p className="text-neutral-800">{paper.doi}</p>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-500">Published:</span>
                    <p className="text-neutral-800">{paper.date}</p>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-500">Access:</span>
                    <p className="text-neutral-800">{paper.isPaid ? 'Paid' : 'Open Access'}</p>
                  </div>
                </div>
              </div>
              
              {/* Related papers */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Related Papers</h3>
                <div className="space-y-4">
                  {paper.relatedPapers.map((relatedPaper) => (
                    <div key={relatedPaper.id} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                      <Link 
                        to={`/paper/${relatedPaper.id}`}
                        className="text-primary-700 hover:text-primary-900 font-medium"
                      >
                        {relatedPaper.title}
                      </Link>
                      <p className="text-sm text-neutral-600 mt-1">
                        {relatedPaper.authors.join(', ')}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {relatedPaper.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Citation information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Cite This Paper</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">APA</h4>
                    <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded">
                      {paper.authors.join(', ')}. ({paper.date.split('-')[0]}). {paper.title}. {paper.journal}, {paper.doi}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">MLA</h4>
                    <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded">
                      {paper.authors.map(author => {
                        const parts = author.split(' ');
                        return `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(' ')}`;
                      }).join(', ')}. "{paper.title}." {paper.journal}, {paper.date.split('-')[0]}, {paper.doi}
                    </p>
                  </div>
                  <button className="btn-outline w-full text-sm">
                    <FileText size={16} className="mr-2" />
                    Download Citation
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Purchase modal */}
          {showPurchaseModal && (
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold mb-4">Purchase Paper Access</h3>
                <p className="mb-6 text-neutral-700">
                  You're about to purchase access to "{paper.title}" for {paper.price} tokens.
                </p>
                
                <div className="bg-neutral-50 p-4 rounded-md mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Paper price:</span>
                    <span className="font-medium">{paper.price} tokens</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Transaction fee:</span>
                    <span className="font-medium">0.1 tokens</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-neutral-200 pt-2 mt-2">
                    <span>Total:</span>
                    <span>{(paper.price + 0.1).toFixed(1)} tokens</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    className="btn-outline"
                    onClick={() => setShowPurchaseModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn-primary">
                    <DollarSign size={16} className="mr-2" />
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaperView;