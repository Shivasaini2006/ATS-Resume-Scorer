import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home(){
  return (
    <section className="text-center py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-offWhite">ReXoomed — AI Resume & Job Matcher</h1>
      <p className="mt-4 text-offWhite/70 max-w-2xl mx-auto">Upload your resume and paste a job description to see how well they match. Green neon theme, glowing UI.</p>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="mt-12 mx-auto max-w-2xl glass neon-border p-8 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Ready to get started?</h2>
        <div className="flex justify-center gap-4">
          <Link to="/upload" className="btn-neon pulse-ring">Get Started</Link>
        </div>
      </motion.div>
    </section>
  )
}
