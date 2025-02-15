import React , {useState} from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useLogin } from "../hooks/useLogin";



const Login = () => {
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const {login , error , isLoading} = useLogin();
    const navigate = useNavigate();

    const handleRedirectToSignup = () => {
        navigate("/signup");
    }


    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!email || !password) {
            alert("Please fill in all fields!");
            return;
          }
        try{
            const response = await login(email , password);

            if (response && response.data.token) {
                const token = response.data;
                //console.log("Token received:", token);
                navigate("/");
            }else{
                alert("Unexpected API response");
                // console.log("API Response:", response);
            }
        } catch(error){
            if(error.response){
                console.error("Login Error:", error.response);
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
            <h2 style={{fontFamily: "Raleway"}}>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="login-button" disabled={isLoading} >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
                {error && <div className="error-message">{error}</div>}
                <h4 onClick={handleRedirectToSignup} style={{cursor:'pointer', fontFamily: "Raleway"}}>New here? Register yourself !!</h4>
            </form>
        </div>
        </div>
    );
};
export default Login;