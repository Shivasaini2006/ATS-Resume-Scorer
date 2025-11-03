import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Results from './pages/Results'

export default function App(){
  return (
    <div className="min-h-screen">
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
