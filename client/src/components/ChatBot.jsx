import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBot.css";

const API_URL = "http://localhost:8000/chat";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "text",
      sender: "bot",
      message: "Hello 👋 I am Civic Assistant. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { type: "text", sender: "user", message: userMessage },
    ]);

    setLoading(true);

    try {
      const res = await axios.post(API_URL, {
        message: userMessage,
      });

      const botData = res.data;

      
      if (typeof botData === "object" && botData !== null) {
        setMessages((prev) => [...prev, { ...botData, sender: "bot" }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "text",
            sender: "bot",
            message: "Invalid response format.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          sender: "bot",
          message: "Server error. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  

  const renderMessage = (msg, index) => {
    if (!msg) return null;

    // // 🔥 UNWRAP NESTED RESPONSE (IMPORTANT FIX)
    // if (msg.type === "text" && msg.data && typeof msg.data === "object") {
    //   msg = msg.data;
    // }

    // TEXT MESSAGE
    if (msg.type === "text") {
      return (
        <div key={index} className={`chat-bubble ${msg.sender}`}>
          {msg.message || "No message"}
        </div>
      );
    }

    // COMPLAINTS
    if (msg.type === "complaints" && Array.isArray(msg.data)) {
      return (
        <div key={index} className="chat-bubble bot">
          <div className="complaint-summary">
            Total High Priority Complaints: {msg.total || 0}
          </div>

          <div className="card-list">
            {msg.data.map((c, i) => (
              <div key={i} className="complaint-card">
                <h4>{c.title}</h4>

                <div className="complaint-meta">
                  <span className={`status ${c.status?.toLowerCase()}`}>
                    {c.status || "Not Reported"}
                  </span>

                  <span className="category">{c.category || "General"}</span>
                </div>

                <p className="location">
                  📍 {c.location || "Location not available"}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === "count") {
      return (
        <div key={index} className="chat-bubble bot">
          <div className="stat-card">
            <h4>Total Web Complaints</h4>
            <div className="stat-value">{msg.total}</div>
          </div>
        </div>
      );
    }

    // HOTSPOT
    if (msg.type === "hotspot") {
      return (
        <div key={index} className="chat-bubble bot">
          <strong>{msg.location}</strong>
          <div>{msg.count} complaints</div>
        </div>
      );
    }

    // FALLBACK DEBUG (TEMPORARY)
    return (
      <div key={index} className="chat-bubble bot">
        {JSON.stringify(msg)}
      </div>
    );
  };

  return (
    <>
      <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            Civic Assistant
            <span onClick={() => setIsOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => renderMessage(msg, index))}

            {loading && (
              <div className="chat-bubble bot typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-footer">
            <input
              placeholder="Ask about complaints, hotspots..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
