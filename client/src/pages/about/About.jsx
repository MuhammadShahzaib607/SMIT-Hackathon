import React from "react";
import "./about.scss";
import { FaHeartbeat, FaLaptopMedical, FaShieldAlt, FaUsers, FaBrain } from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";

const About = () => {
  return (
    <div className="about">
      {/* SECTION 1 - HEADER */}
      <section className="about-header">
        <h1>About HealthMate</h1>
        <p>
          HealthMate – Sehat ka Smart Dost – is your AI-powered health partner
          that helps you understand your medical reports and vitals in simple
          language. Our goal is to make healthcare data easy, friendly, and
          accessible for everyone.
        </p>
      </section>

      {/* SECTION 2 - OUR STORY */}
      <section className="our-story">
        <div className="icon-box">
          <FaHeartbeat className="icon" />
        </div>
        <div className="content">
          <h2>Our Story</h2>
          <p>
            Every household struggles with managing health records. HealthMate
            was born from a simple idea — to help people store, understand, and
            track their reports in one secure digital place. We believe AI can
            bridge the gap between complex medical terms and human
            understanding.
          </p>
        </div>
      </section>

      {/* SECTION 3 - OUR VALUES */}
      <section className="values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <FaLaptopMedical className="value-icon" />
            <h3>Smart Health Insights</h3>
            <p>
              Gemini AI reads and explains your medical reports in simple,
              bilingual summaries.
            </p>
          </div>
          <div className="value-card">
            <FaShieldAlt className="value-icon" />
            <h3>Privacy & Security</h3>
            <p>
              We protect your data using encryption, signed URLs, and JWT
              authentication for maximum safety.
            </p>
          </div>
          <div className="value-card">
            <FaUsers className="value-icon" />
            <h3>User Empowerment</h3>
            <p>
              Designed for students, families, and everyone who wants to take
              control of their health data.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4 - TECHNOLOGY */}
      <section className="technology">
        <div className="content">
          <h2>Powered by Innovation</h2>
          <p>
            Built using the MERN stack and powered by Gemini 1.5 Pro, HealthMate
            can analyze images and PDFs directly. It turns medical data into
            meaningful health insights — fast, accurate, and user-friendly.
          </p>
        </div>
        <div className="icon-box">
          <FaBrain className="icon" />
        </div>
      </section>

      {/* SECTION 5 - COMMITMENT */}
      <section className="commitment">
        <MdOutlineHealthAndSafety className="icon" />
        <h2>Our Commitment</h2>
        <p>
          HealthMate is here to make healthcare simple and transparent. We
          promise to keep improving, learning, and building tools that make
          people’s lives easier.
        </p>
        <span className="disclaimer">
          “AI is for understanding only, not for medical advice.”
        </span>
      </section>
    </div>
  );
};

export default About;
