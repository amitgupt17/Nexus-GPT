import './App.css'
import ChatWindow from './component/ChatWindow'
import Sidebar from './component/Sidebar'
import { MyContext } from './MyContext'
import { useState } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { Login, Signup } from "./Pages";
import { v1 as uuidv1 } from "uuid";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("nexus_token");
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

export default function App() {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv1());
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    const providerValues = {
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        newChat, setNewChat,
        prevChats, setPrevChats,
        allThreads, setAllThreads,
    };
    return (
        <div className='app'>
            <MyContext.Provider value={providerValues}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route 
                        path="/chat" 
                        element={
                            <ProtectedRoute>
                                <div className="main-layout">
                                    <Sidebar />
                                    <ChatWindow />
                                </div>
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </MyContext.Provider>
        </div>
    );
};

