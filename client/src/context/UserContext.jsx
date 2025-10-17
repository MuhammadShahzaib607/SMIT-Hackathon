import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext()

export const UserProvider = ({children})=> {

const [userData, setUserData] = useState({})

    const fetchUser = async ()=> {
        const userId = localStorage.getItem("userId")
        if (!userId) {
return
        }
try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/getUser/${userId}`)
    // console.log(response.data.user)
    setUserData(response?.data?.user)
} catch (error) {
    console.log(error.message)
}
    }

    
useEffect(() => {
fetchUser();
  }, []);

    return <UserContext.Provider value={{
        userData,
        setUserData,
    }}>
{children}
    </UserContext.Provider>
}