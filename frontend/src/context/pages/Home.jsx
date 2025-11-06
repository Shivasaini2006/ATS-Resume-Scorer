import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logo1 from '../../assets/logo1.png'

export default function Home(){
  return (
    <section className="text-center py-20 relative">
      {/* Hero Logo with cinematic glow */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-center mb-8"
      >
        <img 
          src={logo1} 
          alt="ATS Resume Scorer Logo" 
          className="h-32 md:h-40 w-auto"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))',
          }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-4">
          AI Resume & Job Matcher
        </p>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
          Upload your resume and paste a job description to see how well they match.
          <br />
          <span className="text-glow-red font-medium">Powered by intelligent ATS scoring</span>
        </p>
      </motion.div>

      {/* CTA Card with enhanced cinematic styling */}
      <motion.div 
        initial={{opacity:0, y:40}} 
        animate={{opacity:1, y:0}} 
        transition={{delay:0.5, duration:0.8, type: "spring", stiffness: 100}} 
        className="mt-16 mx-auto max-w-2xl glass neon-border p-10 rounded-2xl relative overflow-hidden"
      >
        {/* Subtle animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 244, 79, 0.05))',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Ready to optimize your resume?</h2>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold text-white/90">Job Matching</div>
              <div className="text-white/60">25+ job types</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-white/90">ATS Scoring</div>
              <div className="text-white/60">Real-time analysis</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl mb-2">💡</div>
              <div className="font-semibold text-white/90">Smart Tips</div>
              <div className="text-white/60">Instant feedback</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/upload" className="btn-neon pulse-ring">
              🚀 Get Started
            </Link>
            <Link 
              to="/upload" 
              className="px-8 py-4 bg-white/5 border border-white/20 rounded-full text-white hover:bg-white/10 transition-all duration-300 font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Floating stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 flex justify-center gap-8 flex-wrap"
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-glow-red">100+</div>
          <div className="text-sm text-white/60">Job Categories</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-glow-white">98%</div>
          <div className="text-sm text-white/60">Accuracy Rate</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color: '#FFF44F' }}>Instant</div>
          <div className="text-sm text-white/60">Results</div>
        </div>
      </motion.div>
    </section>
  )
}
