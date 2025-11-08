import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CinematicBackground from './components/CinematicBackground'
import Home from './context/pages/Home'
import Upload from './context/pages/Upload'
import Results from './context/pages/Results'

export default function App(){
  return (
    <div className="min-h-screen">
      {/* Cinematic Spider-Man themed background - high-tech, mysterious, elegant */}
      <CinematicBackground />
      <main className="container mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/results" element={<Results/>} />
        </Routes>
      </main>
    </div>
  )
}
