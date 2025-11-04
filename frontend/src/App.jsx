import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import WaveBackground from './components/WaveBackground'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Results from './pages/Results'

export default function App(){
  return (
    <div className="min-h-screen">
      {/* animated background placed behind UI - does not change any layout or content */}
      <WaveBackground />
      <Navbar />
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
