import { useState } from "react";
import { useAuthContext } from "./UseAuthContext"; 
import axios from "axios";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        //console.log("Login function called with:", { email, password });
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }
        setIsLoading(true);
        setError(null); // Reset previous errors
        try {
            //console.log("Sending login request with:", { email, password });
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, { email, password });
            //console.log("API Response:", response);
            // console.log("API Response:", response.data);
            const {token , user} = response.data;
            if(token && user){
                localStorage.setItem("token", token);
                localStorage.setItem("userId", response.data.user.id); 
                //localStorage.setItem("userId", response.data.user.id);
                localStorage.setItem("user", JSON.stringify({user}));
                dispatch({ type: "LOGIN", payload: {token ,user} }); // Update the AuthContext state
                setIsLoading(false);
                return response
            } else {
                setError("Unexpected API response. Token not found.");
                // console.log("Unexpected Response Data:", response.data);
                return null;
            }

        } catch (error) {
            if (error.response) {
                // Errors returned by the server
                setError(error.response.data?.message || "Login failed.");
                console.error("Error response:", error.response.data);
            } else {
                // Network or unexpected errors
                setError("An unexpected error occurred. Please try again.");
                console.error("Unexpected error:", error);
            }
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
