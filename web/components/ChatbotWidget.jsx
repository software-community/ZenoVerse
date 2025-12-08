import React, { useState, useRef, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { accountContext } from "@/context/accountContext";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm Zeno, your sky-guide. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { NFTs, setNFTs } = useContext(accountContext);

  // Scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function ChatMessage({ message, isUser }) {
    return (
        <div className={`message ${isUser ? "user" : "bot"}`}>
            <div className="prose prose-invert max-w-none">
                <ReactMarkdown>
                    {message}
                </ReactMarkdown>
            </div>
        </div>
    );
    }

  // Handle user send
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    const query = input;
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: query, contextMessages: messages.slice(0, -1).map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })), nfts: NFTs })
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.answer || "I'm here to help!" };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong. Try again!" }
      ]);
    }
  };

  // Allow Enter key to send
  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* ======== Floating Button ======== */}
      {!isOpen && <button
        onClick={() => {
            console.log("Opening chatbot");
            setIsOpen(true)
            console.log("Chatbot opened");
        }}
        className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full p-4 shadow-lg hover:scale-105 transition z-[999999]"
      >
        Zeno AI
      </button>}

      {/* ======== Chat Panel ======== */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-[#0f0f2b] text-white shadow-xl rounded-xl border border-purple-700 flex flex-col p-3 z-50">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-purple-700 pb-2 mb-2">
            <h2 className="font-semibold text-lg text-purple-300">Zeno AI</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[85%] ${
                  msg.sender === "user"
                    ? "ml-auto bg-purple-600"
                    : "mr-auto bg-purple-900"
                }`}
              >
                <ChatMessage key={index} message={msg.text} isUser={msg.sender === "user"} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="mt-2 flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask something..."
              className="flex-1 bg-[#1a1a3d] text-white p-2 rounded-l-lg outline-none border border-purple-700"
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 px-4 rounded-r-lg hover:bg-purple-700 transition"
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}
