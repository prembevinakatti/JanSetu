import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBot.css";

const API_URL = "http://localhost:8000/chat";

/* ---------------- TRANSLATE FUNCTION ---------------- */

const translateText = async (text, targetLang) => {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    const data = await res.json();
    return data[0][0][0];
  } catch {
    return text;
  }
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "text",
      sender: "bot",
      message: "Hello 👋 I am Civic Assistant. How can I help you?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [listening, setListening] = useState(false);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SPEECH RECOGNITION ---------------- */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      kn: "kn-IN",
      te: "te-IN",
      ta: "ta-IN"
    };

    recognition.lang = langMap[language] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, [language]);

  const startVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      console.log("Voice already running");
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    let userMessage = input;

    setMessages((prev) => [
      ...prev,
      { type: "text", sender: "user", message: userMessage }
    ]);

    setInput("");
    setLoading(true);

    try {
      if (language !== "en") {
        userMessage = await translateText(userMessage, "en");
      }

      const res = await axios.post(API_URL, {
        message: userMessage
      });

      let botData = res.data || {};

      /* Ensure valid response structure */

      if (!botData.type) {
        botData = {
          type: "text",
          message: botData.message || "Sorry, I didn't understand."
        };
      }

      /* Translate response if needed */

      if (language !== "en" && botData.type === "text") {
        botData.message = await translateText(botData.message, language);
      }

      setMessages((prev) => [
        ...prev,
        {
          ...botData,
          sender: "bot"
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          sender: "bot",
          message: "⚠ Server error. Please try again."
        }
      ]);
    }

    setLoading(false);
  };

  /* ---------------- RENDER MESSAGE ---------------- */

  const renderMessage = (msg, index) => {
    if (!msg) return null;

    /* TEXT MESSAGE */

    if (msg.type === "text") {
      return (
        <div key={index} className={`chat-bubble ${msg.sender}`}>
          {msg.message}
        </div>
      );
    }

    /* COMPLAINT CARDS */

    if (msg.type === "complaints") {
      return (
        <div key={index} className="chat-bubble bot">

          <div className="complaint-summary">
            <strong>Total High Priority Complaints:</strong> {msg.total || 0}
          </div>

          <div className="card-list">

            {(msg.data || []).map((c, i) => (
              <div key={i} className="complaint-card">

                <h4>{c.title || "Complaint"}</h4>

                <div className="complaint-meta">
                  <span className={`status ${c.status?.toLowerCase()}`}>
                    {c.status || "Reported"}
                  </span>

                  <span className="category">
                    {c.category || "General"}
                  </span>
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

    /* TOTAL COUNT */

    if (msg.type === "count") {
      return (
        <div key={index} className="chat-bubble bot">

          <div className="stat-card">
            <h4>Total Complaints</h4>
            <div className="stat-value">{msg.total || 0}</div>
          </div>

        </div>
      );
    }

    /* HOTSPOT */

    if (msg.type === "hotspot") {
      return (
        <div key={index} className="chat-bubble bot">
          <strong>{msg.location}</strong>
          <div>{msg.count || 0} complaints</div>
        </div>
      );
    }

    return (
      <div key={index} className="chat-bubble bot">
        {JSON.stringify(msg)}
      </div>
    );
  };

  return (
    <>
      {/* CHAT BUTTON */}

      <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>

      {isOpen && (
        <div className="chat-container">

          {/* HEADER */}

          <div className="chat-header">

            Civic Assistant

            <div className="language-selector">
              🌐
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 Hindi</option>
                <option value="kn">🇮🇳 Kannada</option>
                <option value="te">🇮🇳 Telugu</option>
                <option value="ta">🇮🇳 Tamil</option>
              </select>
            </div>

            <span onClick={() => setIsOpen(false)}>✖</span>

          </div>

          {/* CHAT BODY */}

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

          {/* INPUT */}

          <div className="chat-footer">

            <button className="mic-btn" onClick={startVoice}>
              {listening ? "🎙 Listening..." : "🎤"}
            </button>

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