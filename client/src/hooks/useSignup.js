import { useState } from "react";
import { useAuthContext } from "./UseAuthContext";
import axios from "axios";

export const useSignup = () => {
    const [error , setError] = useState("");
    const [isLoading , setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (username ,email , password) => {
        // console.log("Signup function called with:", { username, email, password });
        if (!username || !email || !password) {
            setError("Username , Email and password are required.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try{
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
                username,email,password,
            });
            // console.log("API Response:", response.data);
            const {token , user} = response.data;
            if( token && user){
                localStorage.setItem('user' , JSON.stringify(user));
                localStorage.setItem('token' , JSON.stringify(token));
                dispatch({type: 'SIGNUP' , payload: {token , user}})
                setIsLoading(false);
                return response;
            }else{
                setError("Unexpected API response. Token not found.");
                // console.log("Unexpected Response Data:", response.data);
                return null;
            }
        }catch(error){
            if (error.response) {
                // Errors returned by the server
                setError(error.response.data?.message || "Signup failed.");
                console.error("Error response:", error.response.data);
            } else {
                // Network or unexpected errors
                setError("An unexpected error occurred. Please try again.");
                console.error("Unexpected error:", error);
            }
            setIsLoading(false);
        }
    }
    return {signup , error , isLoading};
};