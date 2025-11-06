import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobCategories, getJobAnalytics } from '../data/jobData';

export default function JobSearchDropdown({ onSelectJob, selectedJob }) {
  const [searchTerm, setSearchTerm] = useState(selectedJob || '');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const dropdownRef = useRef(null);

  // Filter jobs based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobCategories.slice(0, 10)); // Show first 10 by default
    } else {
      const filtered = jobCategories.filter(job =>
        job.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowAnalytics(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredJobs.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredJobs[highlightedIndex]) {
          handleSelectJob(filteredJobs[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setShowAnalytics(false);
        break;
      default:
        break;
    }
  };

  const handleSelectJob = (job) => {
    setSearchTerm(job);
    setIsOpen(false);
    setShowAnalytics(true);
    if (onSelectJob) {
      onSelectJob(job);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const analytics = searchTerm ? getJobAnalytics(searchTerm) : null;

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search job titles (e.g., Digital Marketing Manager)..."
          className="w-full px-4 py-3 bg-transparent border rounded-lg neon-border text-offWhite placeholder-offWhite/50 focus:outline-none focus:ring-2 focus:ring-tealGlow/50 transition"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-offWhite/50">
          {isOpen ? '▲' : '▼'}
        </div>
      </div>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && filteredJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 glass neon-border rounded-lg overflow-hidden shadow-2xl max-h-80 overflow-y-auto"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job}
                onClick={() => handleSelectJob(job)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  highlightedIndex === index
                    ? 'bg-tealGlow/20 text-offWhite'
                    : 'text-offWhite/80 hover:bg-offWhite/5'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{job}</span>
                  {highlightedIndex === index && (
                    <span className="text-tealGlow text-sm">→</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {isOpen && searchTerm && filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-2 glass neon-border rounded-lg p-4 text-center text-offWhite/70"
        >
          No jobs found matching "{searchTerm}"
        </motion.div>
      )}

      {/* Real-Time Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && analytics && searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mt-4 glass neon-border rounded-xl p-6 relative overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-tealGlow/5 to-orangeGlow/5 pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-offWhite flex items-center gap-2">
                  📊 Job Market Analytics
                </h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-offWhite/50 hover:text-offWhite transition"
                >
                  ✕
                </button>
              </div>

              <div className="mb-3">
                <h4 className="text-lg font-semibold text-tealGlow mb-2">{searchTerm}</h4>
              </div>

              {/* Analytics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {/* Demand */}
                <div className="bg-offWhite/5 rounded-lg p-3 border border-offWhite/10">
                  <div className="text-offWhite/60 text-sm mb-1">Market Demand</div>
                  <div className="text-offWhite font-bold text-lg flex items-center gap-2">
                    {analytics.demand}
                    {analytics.demand === 'Very High' && '🔥'}
                    {analytics.demand === 'High' && '📈'}
                  </div>
                </div>

                {/* Salary */}
                <div className="bg-offWhite/5 rounded-lg p-3 border border-offWhite/10">
                  <div className="text-offWhite/60 text-sm mb-1">Avg. Salary</div>
                  <div className="text-tealGlow font-bold text-lg">{analytics.avgSalary}</div>
                </div>

                {/* Growth */}
                <div className="bg-offWhite/5 rounded-lg p-3 border border-offWhite/10">
                  <div className="text-offWhite/60 text-sm mb-1">Growth Rate</div>
                  <div className="text-orangeGlow font-bold text-lg">{analytics.growth}</div>
                </div>

                {/* Openings */}
                <div className="bg-offWhite/5 rounded-lg p-3 border border-offWhite/10">
                  <div className="text-offWhite/60 text-sm mb-1">Job Openings</div>
                  <div className="text-offWhite font-bold text-lg">{analytics.openings}</div>
                </div>

                {/* Competition */}
                <div className="bg-offWhite/5 rounded-lg p-3 border border-offWhite/10">
                  <div className="text-offWhite/60 text-sm mb-1">Competition</div>
                  <div className="text-offWhite font-bold text-lg">{analytics.competition}</div>
                </div>

                {/* Skills Count */}
                <div className="bg-offWhite/5 rounded-lg p-3 border border-offWhite/10">
                  <div className="text-offWhite/60 text-sm mb-1">Key Skills</div>
                  <div className="text-offWhite font-bold text-lg">{analytics.skills.length}</div>
                </div>
              </div>

              {/* Top Skills */}
              {analytics.skills.length > 0 && (
                <div className="mt-4">
                  <div className="text-offWhite/80 text-sm font-semibold mb-2">🎯 Top Skills Required:</div>
                  <div className="flex flex-wrap gap-2">
                    {analytics.skills.map((skill, idx) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-3 py-1 bg-tealGlow/10 border border-tealGlow/30 rounded-full text-tealGlow text-sm font-medium"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3 bg-tealGlow/5 border border-tealGlow/20 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <span className="text-tealGlow text-lg">💡</span>
                  <div className="text-offWhite/80 text-sm">
                    <strong className="text-offWhite">Pro Tip:</strong>{' '}
                    {analytics.demand === 'Very High' || analytics.demand === 'High'
                      ? 'This is a hot job market! Highlight relevant skills in your resume to stand out.'
                      : 'Focus on specialized skills and certifications to increase your competitiveness.'}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}