import React, { useState } from 'react'
import "./signup.scss"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toastAlert } from '../../utils/toastAlert.js'

const Signup = () => {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const signupHandler = async () => {

        if (userName === "" || email === "" || password === "") {
            return toastAlert({
                type: "error",
                message: "Missing Feilds!"
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                userName,
                email,
                password
            })
            navigate("/")
            setIsLoading(false)
            return toastAlert({
                type: "success",
                message: res.data.message
            })
        } catch (error) {
            setIsLoading(false)
            return toastAlert({
                type: "error",
                message: error?.response?.data?.message
            })
        }
    }


    return (
        <div className='signup'>

            <div className="container">

                <div className='userName'>
                    <span>User Name</span>
                    <input type="text" onChange={(e) => setUserName(e.target.value)} placeholder='UserName' />
                </div>

                <div className='email'>
                    <span>Email</span>
                    <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                </div>

                <div className="password">
                    <span>Password</span>
                    <div>
                        <input type={isPasswordHidden ? "password" : "text"} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        <div className='passwordToggle'>
                            {
                                isPasswordHidden ?
                                    <img src="/img/hideIcon.png" onClick={() => setIsPasswordHidden(false)} height="40px" alt="" /> :
                                    <img src="/img/showIcon.png" onClick={() => setIsPasswordHidden(true)} height="35px" alt="" />
                            }
                        </div>
                    </div>
                </div>

                <div className='btnCon'>
                    {
                        !isLoading ?
                            <button onClick={() => signupHandler()}>Signup</button> :
                            <div className='loaderContainer'><div className='loader'></div></div>
                    }
                    <span>Already have an account go to <Link to="/">Login</Link></span>
                </div>
            </div>

        </div>
    )
}

export default Signup