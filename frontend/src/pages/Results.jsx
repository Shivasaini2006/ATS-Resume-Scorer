import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Donut({score=0}){
  const dash = score
  return (
    <svg width="160" height="160" viewBox="0 0 36 36" className="mx-auto">
      <defs>
        <linearGradient id="g1" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#00C4B3" />
          <stop offset="100%" stopColor="#FF8C32" />
        </linearGradient>
      </defs>
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
        stroke="url(#g1)" strokeWidth="3" strokeDasharray={`${dash} ${100-dash}`} strokeLinecap="round"/>
      <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle" fontSize="6" fill="white">{score}%</text>
    </svg>
  )
}

export default function Results(){
  const [score, setScore] = useState(0)
  const [keywords, setKeywords] = useState([])
  useEffect(()=>{
    const job = localStorage.getItem('jobText') || ''
    const resume = localStorage.getItem('resumeName') || ''
    const words = job.trim().split(/\s+/).filter(Boolean)
    const sampleKeywords = words.slice(0,5)
    setKeywords(sampleKeywords)
    // dummy scoring: if job text present -> 78 else 0
    setTimeout(()=> setScore(sampleKeywords.length ? 78 : 0), 600)
  },[])

  const missing = ['Leadership','SQL','Python'].filter(k=>!keywords.includes(k))

  return (
    <div className="max-w-4xl mx-auto glass p-8 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">Match Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="text-center">
          <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'spring', stiffness:120}}>
            <Donut score={score} />
          </motion.div>
          <h3 className="mt-4 text-lg font-semibold">Match Score</h3>
          <p className="text-offWhite/70">How well your resume matches the job description</p>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-semibold">Matched Keywords</h4>
          <p className="text-offWhite/70">{keywords.length ? keywords.join(', ') : 'No matched keywords found.'}</p>

          <h4 className="mt-6 font-semibold">Missing Keywords</h4>
          <div className="flex gap-3 mt-2">
            {missing.map((m,i)=>(<div key={i} className="px-3 py-1 rounded-full bg-white/6">{m}</div>))}
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/" className="btn-neon">Home</Link>
            <Link to="/upload" className="btn-neon">Try Another</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
