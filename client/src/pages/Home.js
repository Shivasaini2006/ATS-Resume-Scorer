import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>AI-Powered ATS Resume Scorer</h1>
          <p className="hero-subtitle">
            Get your resume scored, match with perfect jobs, and auto-apply to opportunities
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Login
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="container">
        <div className="features">
          <h2>Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>📊 ATS Score Analysis</h3>
              <p>Upload your resume and get a comprehensive ATS score (0-100) with detailed insights</p>
            </div>
            <div className="feature-card">
              <h3>🔍 Keyword Matching</h3>
              <p>See which keywords match and which are missing to optimize your resume</p>
            </div>
            <div className="feature-card">
              <h3>💼 Job Recommendations</h3>
              <p>Get personalized job recommendations based on your resume and skills</p>
            </div>
            <div className="feature-card">
              <h3>🤖 Auto-Apply</h3>
              <p>Automatically apply to matching jobs that fit your profile</p>
            </div>
            <div className="feature-card">
              <h3>💡 AI Improvements</h3>
              <p>Receive AI-powered suggestions to improve your resume</p>
            </div>
            <div className="feature-card">
              <h3>🔔 Real-time Notifications</h3>
              <p>Get notified about new job matches and application updates</p>
            </div>
          </div>
        </div>

        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Resume</h3>
              <p>Upload your resume in PDF or DOCX format</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Get ATS Score</h3>
              <p>Receive instant analysis and scoring</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Match Jobs</h3>
              <p>Browse matched jobs based on your profile</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Apply Automatically</h3>
              <p>Enable auto-apply and let us handle the rest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
