import React from 'react'
import { Link } from 'react-router-dom'
import logo1 from '../assets/logo1.png'

export default function Navbar(){
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6">
        {/* Logo with cinematic glow */}
        <Link to="/" className="relative group flex items-center gap-3 py-6">
        <img 
          src={logo1} 
          alt="Score It Logo" 
          className="h-12 w-auto transition-all duration-300 group-hover:scale-105"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.4))',
          }}
        />
        <div 
          className="text-2xl font-extrabold tracking-tight"
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FFF44F, #FFD700)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient-shift 3s ease infinite',
          }}
        >
          Score It
        </div>
        <div 
          className="h-0.5 w-0 group-hover:w-full transition-all duration-300 absolute -bottom-1 left-0"
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FFF44F)',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
          }}
        />
      </Link>
      </div>

      {/* Navigation links removed per request; only logo remains */}
    </nav>
  )
}
