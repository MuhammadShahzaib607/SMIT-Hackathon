import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./profile.scss"
import axios from 'axios'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'

const Profile = () => {

  const {userData} = useContext(UserContext)

  return (
    <div className='profileContainer'>
<div className="left">

<div className="firstName">
  <div>FirstName</div>
  <div>{userData?.firstName || <p style={{color: "#444", fontSize: "15px", fontWeight: 400, textDecoration: "line-through"}}>No FirstName Provided</p> }</div>
</div>

<div className="lastName">
  <div>LastName</div>
  <div>{userData?.lastName || <p style={{color: "#444", fontSize: "15px", fontWeight: 400, textDecoration: "line-through"}}>No LastName Provided</p> }</div>
</div>

    <div className="userName">
        <div>UserName</div>
        <div>{userData?.userName || <p style={{color: "#444", fontSize: "15px", fontWeight: 400, textDecoration: "line-through"}}>No UserName Provided</p> }</div>
    </div>
    <div className='email'>
        <div>Email</div>
        <div>{userData?.email || <p style={{color: "#444", fontSize: "15px", fontWeight: 400, textDecoration: "line-through"}}>No Email Provided</p> }</div>
    </div>

<div className="phoneNumber">
  <div>PhoneNumber</div>
  <div>{userData?.firstName || <p style={{color: "#444", fontSize: "15px", fontWeight: 400, textDecoration: "line-through"}}>No Phone Number Provided</p> }</div>
</div>

<div className="gender">
  <div>Gender</div>
  <div style={{textTransform: "capitalize"}}>{userData?.gender || <p style={{color: "#444", fontWeight: 400, fontSize: "15px", textDecoration: "line-through"}}>No Gender Provided</p> }</div>
</div>

<div className="location">
  <div>Location</div>
  <div>{userData?.location || <p style={{color: "#444", fontSize: "15px", fontWeight: 400, textDecoration: "line-through"}}>No Location Provided</p> }</div>
</div>


    <div className="desc">
        <div>Description</div>
        <div>{userData?.description || <p style={{color: "#444", fontSize: "15px", fontWeight: 400, textDecoration: "line-through"}}>No Description Provided</p> }</div>
    </div>

</div>

<div className="right">
        <h2>{userData?.userName || <p style={{color: "#444", fontSize: "20px", fontWeight: 400, textDecoration: "line-through"}}>No UserName Provided</p> }</h2>
    <img src={userData?.profilePic || "/img/avatar.png"} alt="" />
   <Link to="/editProfile"><div className="editBtn">Edit Profile</div></Link>
</div>
    </div>
  )
}

export default Profile