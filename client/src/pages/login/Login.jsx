import React, { useState } from 'react'
import "./login.scss"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toastAlert } from '../../utils/toastAlert'

const Login = () => {
const [isPasswordHidden, setIsPasswordHidden] = useState(true)
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [isLoading, setIsLoading] = useState(false)
const navigate = useNavigate()

const loginHandler = async ()=> {
    if (email === "" || password === "") {
        return toastAlert({
            type: "error",
            message: "All fields are required"
        })
    }
    
    if (!email.endsWith("@gmail.com")) {  
        return toastAlert({
            type: "error",
            message: "Please type valid email"
        })
    }
    
    if (password.length < 8) {
        return toastAlert({
        type: "error",
        message: "password Too short"
    })
        }
        try {
     setIsLoading(true)
     const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
    })
    localStorage.setItem("token", res.data.token)
    localStorage.setItem("userId", res.data.user._id)
    navigate("/home")
    setIsLoading(false)
    return toastAlert({
type: "success",
message: res.data.message
    })
 } catch (error) {
        setIsLoading(false)
    return toastAlert({
        type: "error",
        message: error.response.data.message
    })
 }
}

  return (
    <div className='login'>

<div className="container">
    <div className='email'>
    <span>Email</span>
    <input type="text" onChange={(e)=> setEmail(e.target.value)} placeholder='Email' />
</div>

<div className="password">
   <span>Password</span> 
   <div>
    <input type= {isPasswordHidden ? "password" : "text"} onChange={(e)=> setPassword(e.target.value)} placeholder='Password' />
    <div className='passwordToggle'>
        {
            isPasswordHidden ? 
            <img src="/img/hideIcon.png" onClick={()=> setIsPasswordHidden(false)} height="40px" alt="" />:
            <img src="/img/showIcon.png" onClick={()=> setIsPasswordHidden(true)} height="35px" alt="" />
        }
    </div>
   </div>
</div>

<div className='btnCon'>
    {
        !isLoading ? 
        <button onClick={()=> loginHandler()}>Login</button> :
        <div className='loaderContainer'><div className='loader'></div></div>
    }
<span>don't have an Account go to <Link to="/signup">Signup</Link></span>
</div>
</div>

    </div>
  )
}

export default Login