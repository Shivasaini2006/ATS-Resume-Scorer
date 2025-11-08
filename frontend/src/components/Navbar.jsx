import React from 'react'
import { Link } from 'react-router-dom'
import logo1 from '../assets/logo1.png'

export default function Navbar(){
  return (
    <nav className="flex items-center justify-between px-6 py-6 container mx-auto relative z-50">
      {/* Logo with cinematic glow */}
      <Link to="/" className="group flex items-center gap-3">
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

      {/* Navigation Links with cinematic hover effects */}
      <div className="flex items-center space-x-8">
        <Link 
          className="relative text-white/70 hover:text-white transition-colors duration-300 font-medium group" 
          to="/"
        >
          <span className="relative z-10">Home</span>
          <span 
            className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #FFD700, #FFF44F)',
              boxShadow: '0 0 8px rgba(255, 215, 0, 0.5)'
            }}
          />
        </Link>
        
        <Link 
          className="relative text-white/70 hover:text-white transition-colors duration-300 font-medium group" 
          to="/upload"
        >
          <span className="relative z-10">Upload</span>
          <span 
            className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #FFD700, #FFF44F)',
              boxShadow: '0 0 8px rgba(255, 215, 0, 0.5)'
            }}
          />
        </Link>
        
        <Link 
          className="relative text-white/70 hover:text-white transition-colors duration-300 font-medium group" 
          to="/results"
        >
          <span className="relative z-10">Results</span>
          <span 
            className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #FFD700, #FFF44F)',
              boxShadow: '0 0 8px rgba(255, 215, 0, 0.5)'
            }}
          />
        </Link>
      </div>
    </nav>
  )
}
