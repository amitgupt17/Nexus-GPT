import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google'; // Import Google Component
import "../Style/Signup.css";
export default function Signup() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
        username: "",
    });

    const { email, password, username } = inputValue;

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
    };

    const handleError = (err) => toast.error(err, { position: "bottom-left" });
    const handleSuccess = (msg) => toast.success(msg, { position: "bottom-right" });

    // 1. Manual Signup Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputValue),
            });

            const data = await response.json();
            if (data.success) {
                handleSuccess(data.message);
                localStorage.setItem("nexus_token", data.token); // Save token
                setTimeout(() => navigate("/chat"), 1000);
            } else {
                handleError(data.message);
            }
        } catch (err) {
            handleError("Server connection failed");
        }
        setInputValue({ email: "", password: "", username: "" });
    };

    // 2. Google Signup Success Handler
    const onGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await fetch("http://localhost:3000/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential })
            });
            const data = await res.json();
            if (data.success) {
                handleSuccess("Google Signup Successful!");
                localStorage.setItem("nexus_token", data.token);
                navigate("/chat");
            }
        } catch (err) {
            handleError("Google Signup Failed");
        }
    };
    return (
        <div className="form-container">
            <h2>Signup Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" name="email" value={email} onChange={handleOnChange} required />
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" value={username} onChange={handleOnChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={handleOnChange} required />
                </div>
                <button type="submit">Submit</button>
                <div style={{ margin: "15px 0", textAlign: "center", color: "#94A3B8" }}>OR</div>
                <div className="google-btn-wrapper">
                    <GoogleLogin
                        onSuccess={onGoogleSuccess}
                        onError={() => handleError("Google Login Failed")}
                        theme="filled_black"
                        shape="pill"
                        // useOneTap={false} 
                        // auto_select={false}
                    ></GoogleLogin>
                </div>
                <span style={{ display: "block", marginTop: "15px" }}>
                    Don't have an account? <Link to={"/login"}>login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}