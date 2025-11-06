import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import JobSearchDropdown from '../../components/JobSearchDropdown'
import { extractTextFromFile } from '../../utils/resumeParser'

export default function Upload(){
  const [fileName, setFileName] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobText, setJobText] = useState('')
  const [selectedJobTitle, setSelectedJobTitle] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleFile(e){
    const f = e.target.files[0]
    if(!f) return
    
    setFileName(f.name)
    setResumeFile(f)
    setError('')
    setIsProcessing(true)
    
    try {
      // Extract text from the resume file
      const text = await extractTextFromFile(f)
      setResumeText(text)
      console.log('✅ Resume uploaded successfully!')
      console.log('File name:', f.name)
      console.log('Extracted text length:', text.length)
      console.log('First 500 characters:', text.substring(0, 500))
      console.log('Text includes "JavaScript"?', text.toLowerCase().includes('javascript'))
      console.log('Text includes "React"?', text.toLowerCase().includes('react'))
      console.log('Text includes "Python"?', text.toLowerCase().includes('python'))
    } catch (err) {
      setError(`Failed to read file: ${err.message}`)
      console.error('File reading error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  function handleCheck(){
    if (!fileName && !jobText && !selectedJobTitle) {
      setError('Please upload a resume, select a job, or paste a job description')
      return
    }
    
    // Critical check: Ensure resume text was extracted
    if (fileName && (!resumeText || resumeText.length < 50)) {
      setError('⚠️ Resume file uploaded but text could not be extracted. Please try uploading again or use a .txt file.')
      console.error('❌ Resume text is empty or too short!');
      console.error('Resume text length:', resumeText.length);
      return
    }
    
    console.log('=== STORING DATA IN LOCALSTORAGE ===');
    console.log('Resume Name:', fileName);
    console.log('Resume Text Length:', resumeText.length);
    console.log('Resume Text Preview:', resumeText.substring(0, 200));
    console.log('Job Title:', selectedJobTitle);
    console.log('Job Description Length:', jobText.length);
    console.log('=====================================');
    
    // Store all data in localStorage
    localStorage.setItem('jobText', jobText)
    localStorage.setItem('resumeName', fileName)
    localStorage.setItem('resumeText', resumeText) // Store actual resume content
    localStorage.setItem('selectedJobTitle', selectedJobTitle)
    
    // Verify storage immediately
    const stored = localStorage.getItem('resumeText');
    console.log('✅ Verification - Stored text length:', stored ? stored.length : 0);
    if (!stored || stored.length < 50) {
      console.error('❌ CRITICAL: localStorage did not save resume text properly!');
      setError('Failed to store resume. Please try again.');
      return;
    }
    
    navigate('/results')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-8 rounded-2xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-offWhite">Upload Resume & Search Job</h2>
        <p className="text-offWhite/70 mb-6">Let AI analyze your resume and match it with the perfect job</p>

        {/* Job Search Dropdown */}
        <div className="mb-6">
          <label className="block text-offWhite font-semibold mb-2">
            🔍 Search Job Title
          </label>
          <JobSearchDropdown
            selectedJob={selectedJobTitle}
            onSelectJob={setSelectedJobTitle}
          />
        </div>

        {/* Resume Upload */}
        <div className="mb-6">
          <label className="block text-offWhite font-semibold mb-2">
            📄 Upload Your Resume
          </label>
          <label className="block border-dashed border-2 p-8 rounded-lg neon-border cursor-pointer hover:bg-offWhite/5 transition">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.txt" 
              className="hidden" 
              onChange={handleFile}
              disabled={isProcessing}
            />
            <div className="text-center">
              <div className="text-5xl mb-3">
                {isProcessing ? '⏳' : '📁'}
              </div>
              <div className="text-offWhite font-medium mb-1">
                {isProcessing 
                  ? 'Processing resume...' 
                  : fileName || 'Drag & drop your resume here or click to upload'
                }
              </div>
              <div className="text-offWhite/50 text-sm">
                {isProcessing 
                  ? 'Extracting text from your resume...'
                  : 'Supported formats: PDF, DOC, DOCX, TXT'
                }
              </div>
              {resumeText && (
                <div className="mt-2 text-tealGlow text-xs">
                  ✅ Resume text loaded: {resumeText.length} characters
                  <div className="mt-1 text-offWhite/50">
                    Preview: {resumeText.substring(0, 100)}...
                  </div>
                </div>
              )}
            </div>
          </label>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block text-offWhite font-semibold mb-2">
            📝 Paste Job Description (Optional)
          </label>
          <textarea 
            value={jobText} 
            onChange={e=>setJobText(e.target.value)} 
            rows={8} 
            className="w-full bg-transparent border rounded-lg p-4 neon-border text-offWhite/90 focus:outline-none focus:ring-2 focus:ring-tealGlow/50 transition" 
            placeholder="Paste the full job description here for better matching..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button 
            onClick={handleCheck} 
            disabled={!fileName && !jobText && !selectedJobTitle}
            className="btn-neon pulse-ring flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ✨ Analyze Resume
          </motion.button>
          <motion.button 
            onClick={() => {
              setFileName('');
              setResumeFile(null);
              setResumeText('');
              setJobText('');
              setSelectedJobTitle('');
              setError('');
            }}
            className="px-6 py-3 bg-offWhite/5 border border-offWhite/20 rounded-full text-offWhite hover:bg-offWhite/10 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔄 Reset
          </motion.button>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-tealGlow/5 border border-tealGlow/20 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="text-offWhite/80 text-sm">
              <strong className="text-offWhite">How it works:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Search and select your target job title</li>
                <li>Upload your resume in any format</li>
                <li>Optionally paste the job description for precise matching</li>
                <li>Get instant ATS score and improvement suggestions</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
