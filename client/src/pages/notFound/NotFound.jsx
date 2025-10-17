import React from 'react'
import { Link } from 'react-router-dom'
import './notFound.scss'

const NotFound = () => {
  return (
    <div className="notfound">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
        <Link to="/home" className="notfound-btn">Go to Home</Link>
      </div>
    </div>
  )
}

export default NotFound
