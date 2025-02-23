import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const messagesEndRef = useRef(null);
  const token = Cookies.get("token");

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch chat: ${response.statusText}`);
      }
      const data = await response.json();
      setMessages(data.chat.messages);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveChat = async (updatedMessages) => {
    const promise = fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    toast.promise(promise, {
      error: (err) => `Failed to save chat: ${err.message}`
    });

    try {
      const response = await promise;
      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Save chat error:", error);
      throw error;
    }
  };

  useEffect(() => {
    scrollToBottom();
    // Save chat whenever messages change, but only if there are messages
    if (messages.length > 0) {
      saveChat(messages).catch(console.error);
    }
  }, [messages]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };

    try {
      setIsLoading(true);
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
    } catch (error) {
      toast.error(error.message);
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
      <div className="h-[34rem] overflow-y-auto p-4 px-10 space-y-4">
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
    </div>
  );
};

export default Chat;