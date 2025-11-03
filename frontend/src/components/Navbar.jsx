import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <nav className="flex items-center justify-between px-6 py-6 container mx-auto">
      <div className="text-2xl font-extrabold text-offWhite">Rezoomed</div>
      <div className="space-x-6">
        <Link className="text-offWhite/70 hover:text-offWhite transition" to="/">Home</Link>
        <Link className="text-offWhite/70 hover:text-offWhite transition" to="/upload">Upload</Link>
        <Link className="text-offWhite/70 hover:text-offWhite transition" to="/results">Results</Link>
      </div>
    </nav>
  )
}
