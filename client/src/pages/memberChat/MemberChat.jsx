import React, { useState } from "react";
import "./memberChat.scss";
import { IoMdSend } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useParams } from "react-router-dom";

// Aapka Final API Endpoint
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/orc/analyze`;

const Dashboard = ({member}) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [image, setImage] = useState(null); // File object
    const [loading, setLoading] = useState(false);
    const {id} = useParams()
    
    // Cloudinary functions hata di gayi hain.

    // File: MemberChat.jsx (handleSend function ko is tarah update karein)

const handleSend = async () => {
    if (!input && !image) return;
    
    // Agar loading ho raha ho (history ya pichli request), to wait karein
    if (loading) return; 
        
    const isImageUpload = !!image;
    const currentInput = input;
    const currentImage = image;

    // User ka message/upload display karein
    const userMessage = {
        id: Date.now(),
        text: currentInput,
        image: isImageUpload ? URL.createObjectURL(currentImage) : null,
        sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Input fields aur image preview clear karein
    setInput(""); 
    setImage(null); 
    setLoading(true); 

    let analysisResult = null;
    let endpoint = '';
    let bodyContent = null;
    // let headers = getAuthHeaders(); // Base headers with Authorization

    if (isImageUpload) {
        // 1. IMAGE UPLOAD & ANALYSIS (POST /member/:memberId/report)
        endpoint = `${API_BASE_URL}/${member._id}/report`;
        
        const formData = new FormData();
        formData.append("reportImage", currentImage); 
        if (currentInput.trim()) {
            formData.append("textPrompt", currentInput);
        }
        bodyContent = formData;
        // FormData ke liye Content-Type header ki zaroorat nahi

    } else {
        // 2. TEXT ONLY CHAT (POST /member/:memberId/chat)
        endpoint = `${API_BASE_URL}/${id}/chat`;
        
        bodyContent = JSON.stringify({
            textPrompt: currentInput
        });
        // Text/JSON ke liye Content-Type zaroori hai
        headers = { 
            ...headers, 
            'Content-Type': 'application/json' 
        };
    }

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: headers, 
            body: bodyContent,
        });

        const data = await res.json();
        
        if (data.success) {
            analysisResult = data.analysisResult;
            
            // Agar image upload hui hai aur report save hui hai, to history update karein
            if (isImageUpload && data.newReport) {
                 setReportsHistory((prev) => [...prev, data.newReport]);
            }
        } else {
            analysisResult = `❌ API Error: ${data.message || 'Processing failed.'}`;
        }

    } catch (error) {
        console.error("❌ API Error:", error);
        analysisResult = "❌ Connection Error: Server tak pohnch nahi paya.";
    }

    // AI ka jawab display karein
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now() + 1,
            text: analysisResult || "Error: Koi jawab nahi mila.",
            sender: "ai",
        },
    ]);
    
    setLoading(false);
};


    return (
     <>
     <Navbar />
   <div className="dashboard">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>HealthMate AI Assistant</h2>
                    <p>Report upload karein ya sawal poochein</p>
                </div>

                <div className="chat-body">
                    {messages.length === 0 && !loading && (
                        <div className="empty">
                            <p>Start by typing a message or uploading a report 📄</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message ${msg.sender === "user" ? "user" : "ai"}`}
                        >
                            {msg.image && (
                                <img src={msg.image} alt="upload" className="uploaded-image" />
                            )}
                            {/* Markdown support ke liye library use ho sakti hai, lekin abhi simple p tag use karein */}
                            {msg.text && <p>{msg.text}</p>}
                        </div>
                    ))}

                    {loading && (
                        <div className="loader">
                            <div className="spinner"></div>
                            <p>Processing...</p>
                        </div>
                    )}
                </div>

                {image && (
                    <div className="preview">
                        <div className="preview-box">
                            <img src={URL.createObjectURL(image)} alt="preview" />
                            <button className="remove" onClick={() => setImage(null)}>
                                <IoClose />
                            </button>
                        </div>
                    </div>
                )}

                <div className="chat-input">
                    <label htmlFor="file-upload" className="upload-btn">
                        <FaPlus style={{ marginTop: "5px" }} />
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        // Sirf file object ko state mein save karein
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <input
                        type="text"
                        placeholder={loading ? "Please wait..." : "Type your message..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={loading}
                    />

                    <button className="send-btn" onClick={handleSend} disabled={loading}>
                        <IoMdSend />
                    </button>
                </div>
            </div>
        </div>
     <Footer />
     </>
    );
};

export default Dashboard;