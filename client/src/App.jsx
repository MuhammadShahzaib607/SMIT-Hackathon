import { useState } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import AuthRoute from './routes/AuthRoute'
import { ToastContainer, Bounce } from 'react-toastify'
import Home from './pages/home/Home'
import PrivateRoutes from './routes/PrivateRoutes'
import Navbar from './components/navbar/Navbar'
import About from './pages/about/About'
import Footer from './components/footer/Footer'
import Profile from './pages/profile/Profile'
import NotFound from './pages/notFound/NotFound'
import EditProfile from './pages/editProfile/EditProfile'
import ScrollToTop from './components/scrollToTop/ScrollToTop'
import Dashboard from './pages/dashboard/Dashboard'
import FamilyDashboard from './pages/familyDashboard/FamilyDashboard'
import MemberChat from './pages/memberChat/MemberChat'


const visibleRoutes = [
  "/home",
  "/about",
  "/profile",
  "/editProfile",
  "/dashboard",
  "/familyDashboard",
  "/memberChat",
]

function App() {

const {pathname} = useLocation()

  return (
    <>

<ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>


{visibleRoutes.includes(pathname) && <Navbar />}

<ScrollToTop />

    <Routes>
  
  <Route element={<AuthRoute />}>
    <Route index element={<Login />} />
      <Route path='/signup' element={<Signup />} />
  </Route>

  <Route element={<PrivateRoutes />}>
    <Route path="/home" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/editProfile" element={<EditProfile />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/familyDashboard" element={<FamilyDashboard />} />
    <Route path="/memberChat/:id" element={<MemberChat />} />
  </Route>
  
<Route path='*' element={<NotFound />} />
    </Routes>

    {visibleRoutes.includes(pathname) && <Footer />}

    </>
  )
}

export default App
