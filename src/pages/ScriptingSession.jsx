import React, { useEffect, useState, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import Cookies from "js-cookie";
import { LuSave } from "react-icons/lu";
import { Navigate, useNavigate } from "react-router-dom";

const ScriptingSession = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [shouldSaveChat, setShouldSaveChat] = useState(false); // New state for save trigger
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const token = Cookies.get("token");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (shouldSaveChat) {
      saveChat();
      setShouldSaveChat(false); // Reset flag after saving
    }
  }, [messages]); // Trigger saveChat when messages update

  const saveChat = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/chat/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ messages }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save chat: ${response.statusText}`);
      }

      const data = await response.json();
      navigate(`/chat/${data.chat._id}`);
      console.log("Chat saved successfully:", data);
    } catch (error) {
      setError(`Failed to save chat: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };

    try {
      setIsLoading(true);
      setError(null);
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input.trim() }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        throw new Error("No response received from AI");
      }

      const assistantMessage = { role: "assistant", content: aiResponse };
      setMessages((prev) => [...prev, assistantMessage]);
      setShouldSaveChat(true); // Mark that chat should be saved after response
    } catch (error) {
      console.error("Error in sendMessage:", error);
      setError(error.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageContent = ({ content }) => (
    <>
      {content.split("\n").map((line, index) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <h2 key={index} className="text-lg font-bold mt-3">
              {line.replace(/\*\*/g, "")}
            </h2>
          );
        } else if (line.startsWith("* ")) {
          return (
            <ul key={index} className="list-disc pl-5">
              <li>{line.substring(2)}</li>
            </ul>
          );
        } else {
          return (
            <p key={index} className="my-1">
              {line}
            </p>
          );
        }
      })}
    </>
  );

  return (
    <div className="max-w-full mx-auto pt-20">
      <div>
        {messages.length === 0 ? (
          <div className="space-y-4 p-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Creative Scripting
                </h1>
              </div>
              <p className="text-gray-600">
                Explore ideas, develop characters, and enhance your story with
                AI-powered Script Writer.
              </p>
            </div>

            <form onSubmit={sendMessage} className="p-4">
              <div className="space-y-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your story, characters, or plot..."
                  className="w-full h-32 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="h-[30rem] overflow-y-auto p-4 px-10 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl p-2 rounded-2xl ${
                      message.role === "user"
                        ? "bg-orange-500 text-white rounded-br-none"
                        : "bg-gray-200 rounded-bl-none"
                    }`}
                  >
                    <MessageContent content={message.content} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-xl animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                    {error}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your story, characters, or plot..."
                  className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex items-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ScriptingSession;
