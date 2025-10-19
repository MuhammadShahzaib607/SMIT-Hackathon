import React, { useState } from "react";
import "./dashboard.scss";
import { IoMdSend } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// Aapka Final API Endpoint
const API_URL = `${import.meta.env.VITE_API_URL}/orc/analyze`;

const Dashboard = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [image, setImage] = useState(null); // File object
    const [loading, setLoading] = useState(false);
    
    // Cloudinary functions hata di gayi hain.

    const handleSend = async () => {
        // Agar na input hai na image, to ruk jayen.
        if (!input && !image) return;
        setLoading(true);
        setImage(null)

        // 1. User ka message display karein
        const userMessage = {
            id: Date.now(),
            text: input,
            image: image ? URL.createObjectURL(image) : null,
            sender: "user",
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput(""); // Input field clear

        let analysisResult = null;

        // 2. Agar Image hai, to Backend API ko call karein
        if (image) {
            const formData = new FormData();
            // Backend Controller is field ka naam 'reportImage' expect kar raha hai.
            formData.append("reportImage", image); 
            
            // Text ko bhi sath bhej sakte hain (agar aapko input bhi analyze karwana ho)
            if (input.trim()) {
                formData.append("textPrompt", input);
            }
            
            try {
                // Backend API Call (FormData ke saath)
                const res = await fetch(API_URL, {
                    method: "POST",
                    // 'Content-Type': 'application/json' ZAROORI NAHI hai (aur ghalat hai)
                    // Jab FormData use karte hain, browser khud Content-Type set karta hai.
                    body: formData,
                });

                const data = await res.json();
                
                if (data.success) {
                    // Gemini ka analysis result
                    analysisResult = data.analysisResult;
                } else {
                    analysisResult = `❌ Analysis Error: ${data.message || 'Report analyze nahi ho saki.'}`;
                }

            } catch (error) {
                console.error("❌ Backend API Error:", error);
                analysisResult = "❌ Connection Error: Backend server tak pohnch nahi paya.";
            }
        } else {
            // Agar sirf text hai aur image nahi, to simple AI response de sakte hain (Optional)
             analysisResult = "AI: Aapka text message mila. Image report upload karein ya mazeed sawaal poochein.";
        }

        // 3. AI ka jawab display karein
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + 1,
                // Agar image analyze hui hai, to uska result dikhayein, warna default text
                text: analysisResult || "Error: Koi jawab nahi mila.",
                sender: "ai",
            },
        ]);
        
        // State reset karein
        setImage(null);
        setLoading(false);
    };


    return (
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
    );
};

export default Dashboard;