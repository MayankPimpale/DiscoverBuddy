import { useState , useEffect } from "react";
import axios from 'axios';

export const useProfile = () => {
    const [profile , setProfile] = useState(null);
    const [error , setError] = useState("");
    const [isLoading , setIsLoading] = useState(false);

    const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
    

    const token = localStorage.getItem("token");
    if(!token){
        setError("Please Log in first");
        setIsLoading(false);
        return;
    }

    try{
        const response = await axios.get(`https://discoverbuddy.onrender.com/api/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setProfile(response.data);
    }
    catch(error){
        if (error.response) {
            setError(error.response.data.message || "Failed to fetch profile.");
          } else {
            setError("An unexpected error occurred.");
          }
    }finally{
        setIsLoading(false);
    }
};

useEffect(() => {
    fetchProfile();
}, []);

return {profile , error , isLoading};
};