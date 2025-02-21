import React, { useEffect, useState } from "react";
import { Send, Sparkles, Save, RotateCcw } from "lucide-react";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const BrainstormingSession = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const newMessages = [...messages, { role: "user", content: input }];
      setMessages(newMessages);
      setInput("");

      // Make API call to Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Ensure response has valid output
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("messages", messages );
  }, [messages]);

  return (
    <div className="max-w-[95%] mx-auto pt-28">
      <div className="bg-white">
        {/* Starter Chat UI */}
        {messages.length === 0 && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Creative Brainstorming
                </h1>
              </div>
              <p className="text-gray-600">
                Explore ideas, develop characters, and enhance your story with
                AI-powered brainstorming.
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <textarea
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !isLoading && sendMessage()
                  }
                  placeholder="Ask anything about your story, characters, or plot..."
                  className="flex-1 w-full h-28 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </>
        )}

        {messages.length !== 0 && (
          <>
            <div className="h-[32rem] overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl p-3 rounded-3xl ${
                      message.role === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 rounded-bl-none"
                    }`}
                  >
                    {message.content.split("\n").map((line, index) => {
                      if (line.startsWith("**")) {
                        // Bold headings
                        return (
                          <h2 key={index} className="text-lg font-bold mt-3">
                            {line.replace(/\*\*/g, "")}
                          </h2>
                        );
                      } else if (line.startsWith("*")) {
                        // Bullet points
                        return (
                          <ul key={index} className="list-disc pl-5">
                            <li>{line.replace(/\*/g, "")}</li>
                          </ul>
                        );
                      } else {
                        // Normal text
                        return <p key={index}>{line}</p>;
                      }
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-xl">Thinking...</div>
                </div>
              )}
              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                    {error}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !isLoading && sendMessage()
                  }
                  placeholder="Ask anything about your story, characters, or plot..."
                  className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrainstormingSession;
