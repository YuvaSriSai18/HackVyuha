import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader, AlertCircle } from 'lucide-react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';

// Domain expertise options
const domainOptions = [
  "Computer Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Blockchain Technology",
  "Medicine",
  "Biology",
  "Physics",
  "Chemistry",
  "Economics",
  "Finance",
  "Psychology",
  "Neuroscience",
  "Engineering",
  "Mathematics",
  "Social Sciences",
  "Environmental Science",
  "Agriculture",
  "Law",
  "Education"
];

const InterestedReviewer = () => {
  const { user } = useAuth();
  const db = getFirestore();
  const storage = getStorage();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    position: '',
    domains: [] as string[],
    otherDomain: '',
    publications: '',
    experience: '',
    reason: '',
    availability: '',
    cv: null as File | null
  });
  
  // UI states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherDomainSelected, setOtherDomainSelected] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, cv: e.target.files[0] });
    }
  };

  const toggleDomain = (domain: string) => {
    if (domain === "Other") {
      setOtherDomainSelected(!otherDomainSelected);
      return;
    }
    
    setFormData(prevState => {
      if (prevState.domains.includes(domain)) {
        return {
          ...prevState,
          domains: prevState.domains.filter(d => d !== domain)
        };
      } else {
        return {
          ...prevState,
          domains: [...prevState.domains, domain]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!formData.fullName || !formData.email || formData.domains.length === 0 || !formData.experience || !formData.reason) {
      setError("Please fill in all required fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setSubmitting(true);
    
    try {
      let cvUrl = null;
      
      // Upload CV if provided
      if (formData.cv) {
        const cvRef = ref(storage, `reviewer_applications/${formData.email}/${formData.cv.name}`);
        await uploadBytes(cvRef, formData.cv);
        cvUrl = await getDownloadURL(cvRef);
      }
      
      // Prepare data for Firestore
      const applicationData = {
        fullName: formData.fullName,
        email: formData.email,
        institution: formData.institution,
        position: formData.position,
        domains: formData.domains,
        otherDomain: formData.otherDomain,
        publications: formData.publications,
        experience: formData.experience,
        reason: formData.reason,
        availability: formData.availability,
        cvUrl: cvUrl,
        submittedBy: user ? user.uid : null,
        submittedAt: new Date().toISOString(),
        status: 'pending', // pending, approved, rejected
      };
      
      // Save to Firestore
      await addDoc(collection(db, 'reviewer_applications'), applicationData);
      
      setSubmitting(false);
      setSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        institution: '',
        position: '',
        domains: [],
        otherDomain: '',
        publications: '',
        experience: '',
        reason: '',
        availability: '',
        cv: null
      });
      
    } catch (err) {
      setSubmitting(false);
      setError("Something went wrong. Please try again later.");
      console.error("Error submitting reviewer application:", err);
    }
  };

  // Format domains for display
  const domainsDisplay = formData.domains.join(", ");
  const hasOtherDomain = formData.otherDomain.trim() !== '';
  const finalDomainsDisplay = hasOtherDomain 
    ? `${domainsDisplay}${domainsDisplay ? ", " : ""}${formData.otherDomain}` 
    : domainsDisplay;

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-neutral-50 py-12 px-4"
      >
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
              <Check size={32} className="text-success-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Application Submitted!</h2>
            <p className="mb-6 text-neutral-600">
              Thank you for your interest in becoming a reviewer! We've received your application and will review it shortly.
              You'll receive a confirmation email with further details.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-neutral-50 py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Become a Reviewer</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Join our network of expert reviewers and contribute to maintaining the quality and integrity of academic research. 
            Fill out the form below to express your interest.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-neutral-700 mb-1">
                      Institution/Organization
                    </label>
                    <input
                      type="text"
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-neutral-700 mb-1">
                      Current Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                  Professional Expertise
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Domain Expertise <span className="text-error-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {domainOptions.map((domain) => (
                      <button
                        type="button"
                        key={domain}
                        onClick={() => toggleDomain(domain)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.domains.includes(domain)
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setOtherDomainSelected(!otherDomainSelected)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        otherDomainSelected
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Other
                    </button>
                  </div>
                  
                  {otherDomainSelected && (
                    <div className="mt-3">
                      <label htmlFor="otherDomain" className="block text-sm font-medium text-neutral-700 mb-1">
                        Specify Other Domain(s)
                      </label>
                      <input
                        type="text"
                        id="otherDomain"
                        name="otherDomain"
                        value={formData.otherDomain}
                        onChange={handleInputChange}
                        placeholder="e.g., Quantum Computing, Robotics"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="publications" className="block text-sm font-medium text-neutral-700 mb-1">
                    Notable Publications/Research
                  </label>
                  <textarea
                    id="publications"
                    name="publications"
                    value={formData.publications}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="List your key publications or research work"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="experience" className="block text-sm font-medium text-neutral-700 mb-1">
                    Review Experience <span className="text-error-500">*</span>
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe your experience with academic reviews (if any) or relevant expertise that qualifies you as a reviewer"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
                  Additional Information
                </h3>

                <div className="mb-6">
                  <label htmlFor="reason" className="block text-sm font-medium text-neutral-700 mb-1">
                    Why do you want to be a reviewer? <span className="text-error-500">*</span>
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tell us why you're interested in becoming a reviewer on our platform"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="availability" className="block text-sm font-medium text-neutral-700 mb-1">
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="">Select your availability</option>
                    <option value="1-2 papers per month">1-2 papers per month</option>
                    <option value="3-5 papers per month">3-5 papers per month</option>
                    <option value="6-10 papers per month">6-10 papers per month</option>
                    <option value="10+ papers per month">10+ papers per month</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="cv" className="block text-sm font-medium text-neutral-700 mb-1">
                    Upload CV/Resume (PDF, max 5MB)
                  </label>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Sharing your CV helps us better understand your qualifications
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-neutral-50 p-4 rounded-md">
                <h4 className="font-medium text-neutral-900 mb-2">Application Summary</h4>
                <p className="text-sm text-neutral-600">
                  <strong>Name:</strong> {formData.fullName || "Not provided"}<br />
                  <strong>Email:</strong> {formData.email || "Not provided"}<br />
                  <strong>Domain Expertise:</strong> {finalDomainsDisplay || "Not provided"}<br />
                  <strong>CV:</strong> {formData.cv ? formData.cv.name : "Not uploaded"}
                </p>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2 px-6"
                >
                  {submitting ? (
                    <>
                      <Loader size={18} className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default InterestedReviewer;