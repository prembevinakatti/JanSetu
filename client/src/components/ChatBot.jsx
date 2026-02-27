import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "text",
      sender: "bot",
      data: "Hello 👋 I am Civic Assistant. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { type: "text", sender: "user", data: input },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: input,
      });

      setMessages((prev) => [...prev, { ...res.data, sender: "bot" }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          sender: "bot",
          data: "Server error. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const renderMessage = (msg, index) => {
    if (msg.type === "text") {
      return (
        <div key={index} className={`chat-bubble ${msg.sender}`}>
          {msg.data}
        </div>
      );
    }

    if (msg.type === "complaints") {
      return (
        <div key={index} className="chat-bubble bot">
          <div className="card-list">
            {msg.data.map((c, i) => (
              <div key={i} className="complaint-card">
                <h4>{c.title}</h4>
                <span className={`status ${c.status?.toLowerCase()}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === "hotspots") {
      return (
        <div key={index} className="chat-bubble bot">
          <div className="card-list">
            {msg.data.map(([location, count], i) => (
              <div key={i} className="hotspot-card">
                <strong>{location}</strong>
                <span>{count} complaints</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
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
            {messages.map(renderMessage)}

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
