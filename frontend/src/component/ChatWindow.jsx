import "../Style/ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "../MyContext";
import { useNavigate,Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

export default function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId,prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const currentPrompt = prompt;
    const getReply = async () => {
        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: currentPrompt,
                threadId: currThreadId
            })
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, options);
            const res = await response.json();
            const aiMessage = res.assistantReply;

            setReply(aiMessage);
            console.log(aiMessage);

        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: currentPrompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
        };
        setPrompt("");
    }, [reply]);
    const handleProfileClick =(()=>{
        setIsOpen(!isOpen);
    });
    useEffect(() => {
        const token = localStorage.getItem("nexus_token");
        setIsLoggedIn(!!token); 
    }, []);
    const handleLogout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include" 
            });
            const data = await response.json();
            if (data.success) {
                setPrevChats([]);
                setCurrThreadId(null);
                localStorage.removeItem("nexus_token"); 
                navigate("/login");
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    return (
        <div className="chatWindow">
            <div className="navbar">
                <span className="name">
                    Nexus GPT
                </span>
                 <div className="userIconDiv">
                    <span className="userIcon" onClick={handleProfileClick}><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {isOpen && (
                <div className="dropDown">
                    {isLoggedIn ? (
                        <>
                            <div className="dropDownItem">
                                <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
                            </div>
                            <div className="dropDownItem">
                                <i className="fa-solid fa-gear"></i>Settings
                            </div>
                            <div className="dropDownItem" onClick={handleLogout} style={{color: '#f87171'}}>
                                <i className="fa-solid fa-arrow-right-from-bracket" style={{color: '#f87171'}}></i>Log out
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="dropDownItem" onClick={() => setIsOpen(false)}>
                                <i className="fa-solid fa-right-to-bracket"></i>Login
                            </Link>
                            <Link to="/signup" className="dropDownItem" onClick={() => setIsOpen(false)}>
                                <i className="fa-solid fa-user-plus"></i>Sign up
                            </Link>
                        </>
                    )}
                </div>
            )}
           
            <Chat></Chat>
            
            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getReply()}
                    />
                    <div
                        onClick={getReply}
                        id="submit"
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">Nexus can make mistakes. Check important info.</p>
            </div>
        </div>
    );
};