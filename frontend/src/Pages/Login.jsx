import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import "../Style/Login.css";
export default function Login() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const { email, password } = inputValue;
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };
    const handleError = (err) => toast.error(err, { position: "bottom-left" });
    const handleSuccess = (msg) => toast.success(msg, { position: "bottom-right" });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputValue),
            });

            const data = await response.json();
            
            if (data.success) {
                handleSuccess(data.message);
                localStorage.setItem("nexus_token", data.token);
                setTimeout(() => navigate("/chat"), 1000);
            } else {
                handleError(data.message);
            }
        } catch (error) {
            handleError("Connection to server failed");
        }
        setInputValue({ email: "", password: "" });
    };
    const onGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await fetch("http://localhost:3000/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential })
            });
            const data = await res.json();
            if (data.success) {
                handleSuccess("Google Login Successful!");
                localStorage.setItem("nexus_token", data.token);
                navigate("/chat");
            } else {
                handleError(data.message);
            }
        } catch (err) {
            handleError("Google Login Failed");
        }
    };
    return (
        <div className="form_container">
            <h2>Login Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={handleOnChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
               <div className="divider-container">OR</div>
                <div className="google-btn">
                    <GoogleLogin
                        onSuccess={onGoogleSuccess}
                        onError={() => handleError("Google Login Failed")}
                        theme="filled_white"
                        shape="pill"
                    />
                </div>

                <span style={{ display: "block", marginTop: "15px" }}>
                    Don't have an account? <Link to={"/signup"}>Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
};