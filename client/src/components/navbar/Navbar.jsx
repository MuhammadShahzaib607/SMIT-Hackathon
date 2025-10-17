import React, { useState } from 'react'
import './navbar.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isToggle, setIsToggle] = useState(false)
  const [toggleOptions, setToggleOptions] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const {userData} = useContext(UserContext)
  // console.log(userData)


useEffect(() => {
  if (toggleOptions || isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto"; // cleanup
  };
}, [toggleOptions, isOpen]);

  const handleOptionClick = (path) => {
    setIsOpen(false)
    navigate(path)
  }

  const token = true // temporary token check

  return (
    <>
      <div className='navbar'>

        <div className='webName'>
          <Link to='/home'>
            <h1 onClick={() => setIsOpen(false)}>Web Name</h1>
          </Link>
        </div>

        <div className='navLinks'>
          <Link to='/home' onClick={() => setIsOpen(false)}>
            <li className={pathname === '/home' ? 'navLinkActive' : ''}>home</li>
          </Link>
          <Link to='/about' onClick={() => setIsOpen(false)}>
            <li className={pathname === '/about' ? 'navLinkActive' : ''}>about</li>
          </Link>
          <Link onClick={() => setIsOpen(false)}>
            <li className={pathname === '/peoples' ? 'navLinkActive' : ''}>Link 3</li>
          </Link>
          <Link onClick={() => setIsOpen(false)}>
            <li className={pathname === '/contact' ? 'navLinkActive' : ''}>Link 4</li>
          </Link>
        </div>

        {token ? (
          <div className='navIcons' style={{ display: "flex", gap: "25px" }}>
            <div className="profileWrapper">
              <div className='profile' onClick={() => setIsOpen(!isOpen)}>
                <div className="profilePic">
                  <img
                    src={userData.profilePic || "/img/avatar.png"}
                    width='30px'
                    height='30px'
                    style={{ borderRadius: '50%' }}
                    alt=''
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "25px" }}>
            <div style={{ color: "#D63384", fontSize: "13px", cursor: "pointer", backgroundColor: "white", borderRadius: "30px", padding: "7px 18px" }} onClick={() => navigate("/signup")}>Join Now</div>
            <div style={{ color: "white", fontSize: "15px", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</div>
          </div>
        )}

<div className='toggleHeader'>
  <img src="/img/menuBar.png" height="27px" width="27px" onClick={() => { setIsToggle(!isToggle); setToggleOptions(false) }} className='menuBar' alt="" />

                <div className='profile' onClick={() => setIsOpen(!isOpen)}>
                <div className="profilePic">
                  <img
                    src={userData.profilePic || "/img/avatar.png"}
                    width='33px'
                    height='33px'
                    style={{ borderRadius: '50%', marginTop: "10px", cursor: "pointer" }}
                    alt=''
                  />
                </div>
              </div>

</div>

        <div className={`options ${isOpen ? 'active' : ''}`}>
          <Link to="/profile" onClick={() => handleOptionClick('/orders')}>
            <li>Profile</li>
          </Link>
          <Link to="/editProfile" onClick={() => handleOptionClick('/profile')}>
            <li>Edit Profile</li>
          </Link>
          <Link onClick={() => handleOptionClick('/editProfile')}>
            <li>Option 3</li>
          </Link>
          <li onClick={() => {
            setIsOpen(false)
            localStorage.removeItem("token")
            localStorage.removeItem("userId")
            navigate("/")
                              setIsToggle(false)
                  setIsOpen(false)
          }}>logout</li>
        </div>
      </div>

      {isToggle && (
        <div className="toggleNavbar">
          <div className='toggleNavLinks'>
            <Link to='/home' onClick={() => {
                setIsOpen(false)
                setIsToggle(false)
            }}>
              <li className={pathname === '/home' ? 'navLinkActive' : ''}>home</li>
            </Link>
            <Link to='/about' onClick={() => {
                setIsOpen(false)
                setIsToggle(false)
            }}>
              <li className={pathname === '/about' ? 'navLinkActive' : ''}>about</li>
            </Link>
            <Link onClick={() => {
                setIsOpen(false)
                setIsToggle(false)
            }}>
              <li className={pathname === '/peoples' ? 'navLinkActive' : ''}>Link 3</li>
            </Link>
            <Link onClick={() => {
                setIsOpen(false)
                setIsToggle(false)
            }}>
              <li className={pathname === '/contact' ? 'navLinkActive' : ''}>Link 4</li>
            </Link>
          </div>
{/* 
          <div className="toggleNavIcons">
            <div className="profileWrapper">

              <div className={`toggleOptions ${toggleOptions ? 'active' : ''}`}>
                <Link to="/profile" onClick={() => { handleOptionClick('/orders'); setIsToggle(false); setToggleOptions(false) }}>
                  <li>Profile</li>
                </Link>
                <Link to="/editProfile" onClick={() => { handleOptionClick('/profile'); setIsToggle(false); setToggleOptions(false) }}>
                  <li>Edit Profile</li>
                </Link>
                <Link onClick={() => { handleOptionClick('/editProfile'); setIsToggle(false); setToggleOptions(false) }}>
                  <li>Option 3</li>
                </Link>
                <li onClick={() => {
                  setIsOpen(false)
                  localStorage.removeItem("token")
                  localStorage.removeItem("userId")
                  navigate("/")
                  setIsToggle(false)
                  setIsOpen(false)
                }}>logout</li>
              </div>
            </div>
          </div> */}

        </div>
      )}
    </>
  )
}

export default Navbar
