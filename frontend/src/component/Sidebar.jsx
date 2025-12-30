import { MyContext } from "../MyContext";
import "../Style/Sidebar.css";
import { useContext, useEffect, useState } from "react";
import myLogo from '../assets/nexuslogo.jpeg';
import { v1 as uuidv1 } from "uuid";
export default function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const [isOpen, setIsOpen] = useState(false);
    const getAllThreads = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`);
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));

            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            };
        } catch (err) {
            console.log(err);
        }
    };
    const toggleSidebar = (() => {
        setIsOpen(!isOpen);
    })
    return (
        <>
            {!isOpen && (
                <button className="mobile-toggle-btn" onClick={toggleSidebar}>
                    <i className="fa-solid fa-bars"></i>
                </button>
            )}
            <section className={`sidebar ${isOpen ? "open" : ""}`}>
                <button className="button" onClick={createNewChat}>
                    <img src={myLogo} alt="nexus-logo" className="logo" />
                    <div className="button-right-group">
                        <span><i className="fa-solid fa-pen-to-square"></i></span>
                        <div className="mobile-toggle" onClick={(e) => {
                            e.stopPropagation();
                            toggleSidebar();
                        }}>
                            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </div>
                    </div>
                </button>
                <ul className="history">
                    {allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={() => {
                                changeThread(thread.threadId);
                                if (window.innerWidth <= 1000) setIsOpen(false);
                            }}
                            className={thread.threadId === currThreadId ? "highlighted" : ""}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))}
                </ul>
                <div className="sign">
                    <p>By Amit Gupta</p>
                </div>
            </section>
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
};