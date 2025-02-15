import React, { useState } from "react";
import "../styles/signup.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
// import { signup } from "../api/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username , setUsername] = useState("");
  const navigate = useNavigate();
  const { signup , error , isLoading} = useSignup()

  const handleSubmit = async (e) => {
    // console.log("Form submitted");
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try{
      const response = await signup( username ,email , password)
      // console.log("Data being sent to the backend:", { username, email, password });
      
      if( response && response.data.token){
        alert("Signup successfull");
        navigate("/");
      }else{
        alert("Unexpected API response");
        // console.log("API Response:", response);
      }
    }catch(error){
      if(error.response){
        console.error("Signup Error:", error.response);
        alert(error.response.data.message || "Something went wrong");
      }else{
        console.error("General Error:", error.message);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="background">
    <Header/>
        <div className="auth-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                type="string"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
            />
            </div>
            <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            </div>
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
            />
            </div>
            <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
            />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Signup"}
            </button>
            {error && <p className="error-message">{error}</p>}
        </form>
        </div>
    </div>
  );
};

export default Signup;
