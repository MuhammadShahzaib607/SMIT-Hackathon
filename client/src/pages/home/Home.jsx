import React from 'react';
import { FaHeartbeat, FaSearchPlus, FaShieldAlt, FaClock } from 'react-icons/fa';
import { IoMdArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import "./home.scss"

const Home = () => {
  return (
    <div className="homepage-content">
      
      {/* 1. HERO SECTION: High-Impact Statement */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="headline">
            Your Medical Reports, <span className="highlight">Analyzed by AI</span>.
          </h1>
          <p className="subhead">
            Instantly upload your lab results. Our Gemini-powered AI delivers a clear, detailed, and **immediate analysis** of complex health indicators.
          </p>
          
          <div className="action-area">
            <Link to="/dashboard" className="cta-button primary">
              Analyze Your Report <IoMdArrowForward className="icon" />
            </Link>
          </div>
        </div>
        
        {/* Visual Element Placeholder */}
        <div className="hero-visual">
          <div className="visual-placeholder">AI Analysis Dashboard View</div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION: Key Features */}
      <section className="value-section">
        <h2 className="section-title">HealthMate AI: Your Smart Health Partner</h2>
        
        <div className="value-grid">
          
          <div className="value-card">
            <FaSearchPlus className="value-icon" />
            <h3>In-Depth Analysis</h3>
            <p>Gemini AI identifies every **abnormal value** and explains the potential impact in simple, easy-to-understand terms.</p>
          </div>

          <div className="value-card">
            <FaShieldAlt className="value-icon" />
            <h3>Data Security & Privacy</h3>
            <p>Your uploaded data is used solely for analysis. We uphold the highest standards of patient **confidentiality**.</p>
          </div>

          <div className="value-card">
            <FaClock className="value-icon" />
            <h3>Instant Time Savings</h3>
            <p>Get an immediate health overview in **seconds**, without waiting for a doctor's appointment for preliminary review.</p>
          </div>

        </div>
      </section>
      
      {/* 3. FINAL CALL TO ACTION */}
      <section className="final-cta-section">
        <h2 className="cta-title">Start Your Health Journey Today.</h2>
        <p className="cta-subtitle">No signup required. Just upload and receive your personalized analysis.</p>
        <Link to="/dashboard" className="cta-button secondary">
          Get Started with Free Analysis!
        </Link>
      </section>

    </div>
  );
};

export default Home;