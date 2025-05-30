import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Lock, BarChart2, FileText } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Revolutionizing Academic Research with Blockchain
              </h1>
              <p className="text-lg md:text-xl mb-8 text-neutral-100">
                Publish, collaborate, and get rewarded for your contributions to the scientific community on a decentralized platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="btn bg-white text-primary-800 hover:bg-neutral-100">
                  Get Started
                </Link>
                <Link to="/marketplace" className="btn border border-white text-white hover:bg-primary-800">
                  Explore Research
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <img 
                src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Researchers collaborating" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ResearchChain?</h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Our platform combines blockchain technology with academic research to create a more transparent, 
              rewarding, and collaborative ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Decentralized Publishing</h3>
              <p className="text-neutral-600">
                Publish your research on the blockchain with permanent, immutable records and receive credit for your work.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-secondary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaboration Marketplace</h3>
              <p className="text-neutral-600">
                Find research partners, funding opportunities, and collaborative projects in your field of interest.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-accent-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Award className="text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Token Rewards</h3>
              <p className="text-neutral-600">
                Earn tokens for contributions, citations, peer reviews, and more. Build your reputation in the research community.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-success-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Lock className="text-success-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Identity Verification</h3>
              <p className="text-neutral-600">
                Secure academic identity verification system to ensure authenticity and prevent academic fraud.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-warning-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart2 className="text-warning-900" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Impact Metrics</h3>
              <p className="text-neutral-600">
                Transparent and fair metrics to measure research impact beyond traditional citation counts.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div 
              className="card p-6"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-error-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="text-error-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Research Tools</h3>
              <p className="text-neutral-600">
                Leverage AI for plagiarism checking, summary generation, and research recommendations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ResearchChain Works</h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Our platform simplifies the research process while ensuring security, transparency, and fair rewards.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-12 relative">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row md:justify-between items-center">
                <div className="md:w-5/12 mb-8 md:mb-0 md:text-right">
                  <h3 className="text-2xl font-semibold mb-3">Connect Your Wallet</h3>
                  <p className="text-neutral-600">
                    Create an account and connect your crypto wallet to get started with ResearchChain.
                  </p>
                </div>
                
                <div className="z-10 relative flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white">
                  1
                </div>
                
                <div className="md:w-5/12 mt-8 md:mt-0">
                  <img 
                    src="https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Connect wallet" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row md:justify-between items-center">
                <div className="md:w-5/12 mb-8 md:mb-0 order-1 md:order-3">
                  <img 
                    src="https://images.pexels.com/photos/4126724/pexels-photo-4126724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Verify identity" 
                    className="rounded-lg shadow-md"
                  />
                </div>
                
                <div className="z-10 relative flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white order-2">
                  2
                </div>
                
                <div className="md:w-5/12 mt-8 md:mt-0 md:text-right order-3 md:order-1">
                  <h3 className="text-2xl font-semibold mb-3">Verify Your Academic Identity</h3>
                  <p className="text-neutral-600">
                    Complete our simple verification process to confirm your academic credentials.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row md:justify-between items-center">
                <div className="md:w-5/12 mb-8 md:mb-0 md:text-right">
                  <h3 className="text-2xl font-semibold mb-3">Upload Your Research</h3>
                  <p className="text-neutral-600">
                    Upload your papers and select your preferred access model. Your work is securely stored on IPFS.
                  </p>
                </div>
                
                <div className="z-10 relative flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white">
                  3
                </div>
                
                <div className="md:w-5/12 mt-8 md:mt-0">
                  <img 
                    src="https://images.pexels.com/photos/414974/pexels-photo-414974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Upload research" 
                    className="rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row md:justify-between items-center">
                <div className="md:w-5/12 mb-8 md:mb-0 order-1 md:order-3">
                  <img 
                    src="https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Earn rewards" 
                    className="rounded-lg shadow-md"
                  />
                </div>
                
                <div className="z-10 relative flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white order-2">
                  4
                </div>
                
                <div className="md:w-5/12 mt-8 md:mt-0 md:text-right order-3 md:order-1">
                  <h3 className="text-2xl font-semibold mb-3">Earn Rewards & Collaborate</h3>
                  <p className="text-neutral-600">
                    Get cited, review papers, and collaborate with peers to earn tokens and build your reputation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-gradient-to-r from-secondary-900 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Academic Revolution?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of researchers already using ResearchChain to publish, collaborate, and get rewarded for their contributions.
          </p>
          <Link to="/register" className="btn bg-white text-secondary-800 hover:bg-neutral-100 text-lg px-8 py-3">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;