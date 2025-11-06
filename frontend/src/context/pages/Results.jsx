import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getJobAnalytics } from '../../data/jobData'
import { calculateATSScore, extractContactInfo, extractExperience, extractEducation } from '../../utils/resumeParser'

function Donut({score=0}){
  const dash = score
  const color = score >= 70 ? '#00C4B3' : score >= 40 ? '#FFA94D' : '#FF6B6B'
  
  return (
    <svg width="180" height="180" viewBox="0 0 36 36" className="mx-auto">
      <defs>
        <linearGradient id="g1" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#00C4B3" />
          <stop offset="100%" stopColor="#FF8C32" />
        </linearGradient>
      </defs>
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
      <motion.path 
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
        fill="none"
        stroke="url(#g1)" 
        strokeWidth="3" 
        strokeDasharray={`${dash} ${100-dash}`} 
        strokeLinecap="round"
        initial={{ strokeDasharray: '0 100' }}
        animate={{ strokeDasharray: `${dash} ${100-dash}` }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{score}%</text>
    </svg>
  )
}

export default function Results(){
  const [score, setScore] = useState(0)
  const [matchedKeywords, setMatchedKeywords] = useState([])
  const [missingKeywords, setMissingKeywords] = useState([])
  const [selectedJobTitle, setSelectedJobTitle] = useState('')
  const [jobAnalytics, setJobAnalytics] = useState(null)
  const [resumeInfo, setResumeInfo] = useState({
    experience: 0,
    education: 'Not specified',
    contact: {}
  })
  
  useEffect(()=>{
    const job = localStorage.getItem('jobText') || ''
    const resume = localStorage.getItem('resumeName') || ''
    const resumeText = localStorage.getItem('resumeText') || '' // NEW: Get actual resume content
    const jobTitle = localStorage.getItem('selectedJobTitle') || ''
    
    setSelectedJobTitle(jobTitle)
    
    console.log('📊 === RESULTS PAGE LOADED ===');
    console.log('Resume Name:', resume);
    console.log('Resume Text Length:', resumeText.length);
    console.log('Job Description Length:', job.length);
    console.log('Selected Job:', jobTitle);
    console.log('==============================');
    
    // Get analytics for selected job
    if (jobTitle) {
      const analytics = getJobAnalytics(jobTitle)
      setJobAnalytics(analytics)
      
      // If job is selected and we have resume text, use the improved parser
      if (analytics && analytics.skills.length > 0 && resumeText && resumeText.length > 50) {
        console.log('🎯 Using improved resume parser with actual resume content');
        console.log('📋 Job Required Skills:', analytics.skills);
        
        // Use the comprehensive ATS scoring function
        const result = calculateATSScore(resumeText, job, analytics.skills)
        
        console.log('📈 ATS Scoring Result:', result);
        
        setMatchedKeywords(result.matched)
        setMissingKeywords(result.missing)
        setResumeInfo({
          experience: result.experience,
          education: result.education,
          contact: result.contact
        })
        
        setTimeout(() => setScore(result.score), 600)
      } else if (analytics && analytics.skills.length > 0) {
        // Fallback: Job selected but no resume text (old behavior with job description)
        console.log('⚠️ WARNING: Job selected but no resume text found!');
        console.log('   This means the resume file was not properly read.');
        console.log('   Falling back to basic keyword matching from filename + job description');
        
        const combinedText = (resume + ' ' + job).toLowerCase()
        const matched = []
        const missing = []
        
        analytics.skills.forEach(skill => {
          if (combinedText.includes(skill.toLowerCase())) {
            matched.push(skill)
          } else {
            missing.push(skill)
          }
        })
        
        if (job) {
          const jobWords = job.toLowerCase().split(/\s+/).filter(w => w.length > 4)
          const additionalMatched = jobWords.slice(0, 10).map(w => 
            w.charAt(0).toUpperCase() + w.slice(1)
          ).filter(w => !matched.includes(w))
          matched.push(...additionalMatched.slice(0, 5))
        }
        
        setMatchedKeywords(matched)
        setMissingKeywords(missing)
        
        const skillMatchPercentage = analytics.skills.length > 0 
          ? (matched.filter(m => analytics.skills.includes(m)).length / analytics.skills.length) * 100 
          : 0
        
        let calculatedScore = Math.round(skillMatchPercentage)
        if (job && job.length > 50) calculatedScore = Math.min(100, calculatedScore + 15)
        if (resume) calculatedScore = Math.min(100, calculatedScore + 10)
        
        setTimeout(() => setScore(Math.max(35, calculatedScore)), 600)
      } else {
        // Fallback: No job-specific data
        const words = job.trim().split(/\s+/).filter(Boolean)
        const sampleKeywords = words.slice(0, 8)
        setMatchedKeywords(sampleKeywords)
        setMissingKeywords(['Leadership', 'Communication', 'Project Management'])
        
        let calculatedScore = sampleKeywords.length > 0 ? Math.min(85, 50 + (sampleKeywords.length * 4)) : 0
        if (resume && job) calculatedScore = Math.min(95, calculatedScore + 10)
        
        setTimeout(() => setScore(calculatedScore), 600)
      }
    } else {
      // No job title selected - use generic matching
      const words = job.trim().split(/\s+/).filter(Boolean)
      const sampleKeywords = words.slice(0, 8)
      setMatchedKeywords(sampleKeywords)
      setMissingKeywords(['Leadership', 'Communication', 'Project Management'])
      
      let calculatedScore = sampleKeywords.length > 0 ? Math.min(85, 50 + (sampleKeywords.length * 4)) : 0
      if (resume && job) calculatedScore = Math.min(95, calculatedScore + 10)
      
      setTimeout(() => setScore(calculatedScore), 600)
    }
  },[])

  const getScoreMessage = () => {
    if (score >= 80) return { text: 'Excellent Match! 🎉', color: 'text-tealGlow' }
    if (score >= 60) return { text: 'Good Match! 👍', color: 'text-orangeGlow' }
    if (score >= 40) return { text: 'Fair Match 📊', color: 'text-accentText' }
    return { text: 'Needs Improvement 📝', color: 'text-red-400' }
  }
  
  const scoreMessage = getScoreMessage()

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-offWhite">Match Results</h2>
          {selectedJobTitle && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2 bg-tealGlow/10 border border-tealGlow/30 rounded-full"
            >
              <span className="text-tealGlow font-semibold">🎯 {selectedJobTitle}</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Score Visualization */}
          <div className="text-center lg:col-span-1">
            <motion.div 
              initial={{scale:0.8, opacity:0}} 
              animate={{scale:1, opacity:1}} 
              transition={{type:'spring', stiffness:120, delay: 0.2}}
            >
              <Donut score={score} />
            </motion.div>
            <h3 className="mt-4 text-xl font-bold text-offWhite">ATS Match Score</h3>
            <p className={`text-lg font-semibold mt-2 ${scoreMessage.color}`}>{scoreMessage.text}</p>
            <p className="text-offWhite/70 mt-1 text-sm">How well your resume matches the job</p>
          </div>

          {/* Keywords & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Matched Keywords */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-bold text-lg mb-3 text-offWhite flex items-center gap-2">
                ✅ Matched Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.length > 0 ? (
                  matchedKeywords.map((kw, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="px-4 py-2 rounded-full bg-tealGlow/10 border border-tealGlow/30 text-tealGlow font-medium"
                    >
                      {kw}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-offWhite/70">No matched keywords found. Try adding more details.</p>
                )}
              </div>
            </motion.div>

            {/* Missing Keywords */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-bold text-lg mb-3 text-offWhite flex items-center gap-2">
                ⚠️ Missing Keywords {selectedJobTitle && '(Required for ' + selectedJobTitle + ')'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.length > 0 ? (
                  missingKeywords.map((m,i)=>(
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      className="px-4 py-2 rounded-full bg-orangeGlow/10 border border-orangeGlow/30 text-orangeGlow font-medium"
                    >
                      {m}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-tealGlow">🎉 All required skills matched!</p>
                )}
              </div>
            </motion.div>

            {/* Job Market Analytics */}
            {jobAnalytics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-5 bg-offWhite/5 border border-offWhite/10 rounded-xl"
              >
                <h4 className="font-bold text-lg mb-3 text-offWhite flex items-center gap-2">
                  📊 Job Market Insights for {selectedJobTitle}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-offWhite/60">Demand:</span>
                    <span className="ml-2 text-offWhite font-semibold">{jobAnalytics.demand}</span>
                  </div>
                  <div>
                    <span className="text-offWhite/60">Salary:</span>
                    <span className="ml-2 text-tealGlow font-semibold">{jobAnalytics.avgSalary}</span>
                  </div>
                  <div>
                    <span className="text-offWhite/60">Growth:</span>
                    <span className="ml-2 text-orangeGlow font-semibold">{jobAnalytics.growth}</span>
                  </div>
                  <div>
                    <span className="text-offWhite/60">Openings:</span>
                    <span className="ml-2 text-offWhite font-semibold">{jobAnalytics.openings}</span>
                  </div>
                </div>
                
                {/* Required Skills Match Status */}
                {jobAnalytics.skills && jobAnalytics.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-offWhite/10">
                    <h5 className="text-sm font-semibold text-offWhite/80 mb-2">
                      Required Skills Status:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {jobAnalytics.skills.map((skill, i) => {
                        const isMatched = matchedKeywords.includes(skill)
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + i * 0.05 }}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isMatched 
                                ? 'bg-tealGlow/20 border border-tealGlow/40 text-tealGlow' 
                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                            }`}
                          >
                            {isMatched ? '✓' : '✗'} {skill}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Resume Profile Info */}
            {(resumeInfo.experience > 0 || resumeInfo.education !== 'Not specified' || resumeInfo.contact.email) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="p-5 bg-offWhite/5 border border-offWhite/10 rounded-xl"
              >
                <h4 className="font-bold text-lg mb-3 text-offWhite flex items-center gap-2">
                  👤 Resume Profile
                </h4>
                <div className="space-y-2 text-sm">
                  {resumeInfo.experience > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-offWhite/60">Experience:</span>
                      <span className="text-tealGlow font-semibold">{resumeInfo.experience} years</span>
                    </div>
                  )}
                  {resumeInfo.education !== 'Not specified' && (
                    <div className="flex items-center gap-2">
                      <span className="text-offWhite/60">Education:</span>
                      <span className="text-offWhite font-semibold">{resumeInfo.education}</span>
                    </div>
                  )}
                  {resumeInfo.contact.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-offWhite/60">Email:</span>
                      <span className="text-offWhite font-semibold">{resumeInfo.contact.email}</span>
                    </div>
                  )}
                  {resumeInfo.contact.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-offWhite/60">Phone:</span>
                      <span className="text-offWhite font-semibold">{resumeInfo.contact.phone}</span>
                    </div>
                  )}
                  {resumeInfo.contact.linkedin && (
                    <div className="flex items-center gap-2">
                      <span className="text-offWhite/60">LinkedIn:</span>
                      <a 
                        href={`https://linkedin.com/in/${resumeInfo.contact.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tealGlow font-semibold hover:underline"
                      >
                        /{resumeInfo.contact.linkedin}
                      </a>
                    </div>
                  )}
                  {resumeInfo.contact.github && (
                    <div className="flex items-center gap-2">
                      <span className="text-offWhite/60">GitHub:</span>
                      <a 
                        href={`https://github.com/${resumeInfo.contact.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tealGlow font-semibold hover:underline"
                      >
                        /{resumeInfo.contact.github}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="p-5 bg-tealGlow/5 border border-tealGlow/20 rounded-xl"
            >
              <h4 className="font-bold text-lg mb-3 text-offWhite flex items-center gap-2">
                💡 Recommendations
              </h4>
              <ul className="space-y-2 text-offWhite/80">
                {selectedJobTitle && missingKeywords.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      <strong className="text-orangeGlow">Priority:</strong> Add these {selectedJobTitle} skills to your resume: {missingKeywords.slice(0, 3).join(', ')}
                    </span>
                  </li>
                )}
                {score < 50 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Your resume needs more relevant keywords for this {selectedJobTitle || 'job'} position</span>
                  </li>
                )}
                {score >= 50 && score < 80 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Include the missing keywords in your experience section naturally</span>
                  </li>
                )}
                {score >= 80 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Great job! Your resume is well-optimized for {selectedJobTitle || 'this position'}</span>
                  </li>
                )}
                {matchedKeywords.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Highlight your expertise in: {matchedKeywords.slice(0, 3).join(', ')}</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Quantify your achievements with numbers and metrics</span>
                </li>
                {jobAnalytics && (
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      This role has <strong className="text-tealGlow">{jobAnalytics.demand}</strong> demand with {jobAnalytics.growth} growth rate
                    </span>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <Link to="/" className="btn-neon">🏠 Home</Link>
          <Link to="/upload" className="px-6 py-3 bg-offWhite/5 border border-offWhite/20 rounded-full text-offWhite hover:bg-offWhite/10 transition">
            🔄 Try Another
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
