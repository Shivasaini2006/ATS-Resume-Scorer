import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Upload(){
  const [fileName, setFileName] = useState('')
  const [jobText, setJobText] = useState('')
  const navigate = useNavigate()

  function handleFile(e){
    const f = e.target.files[0]
    if(f) setFileName(f.name)
  }

  function handleCheck(){
    localStorage.setItem('jobText', jobText)
    localStorage.setItem('resumeName', fileName)
    navigate('/results')
  }

  return (
    <div className="max-w-3xl mx-auto glass p-8 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">Upload Resume</h2>

      <label className="block border-dashed border-2 p-8 rounded-lg neon-border cursor-pointer mb-6">
        <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFile} />
        <div className="text-center">
          <div className="text-3xl mb-2">📁</div>
          <div className="text-offWhite/70">{fileName || 'Drag & drop your resume here or click to upload'}</div>
        </div>
      </label>

      <h3 className="font-semibold mb-2">Paste Job Description</h3>
      <textarea value={jobText} onChange={e=>setJobText(e.target.value)} rows={8} className="w-full bg-transparent border rounded-lg p-4 neon-border text-offWhite/90" placeholder="Paste the job description here..."></textarea>

      <div className="mt-6 flex gap-3">
        <button onClick={handleCheck} className="btn-neon pulse-ring">Check Match</button>
      </div>
    </div>
  )
}
