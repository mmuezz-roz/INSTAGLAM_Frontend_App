import { useEffect, useState, useContext } from "react";

import socket from "../socket";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function ChatWindow({ conversation }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    api
      .get(`/chat/messages/${conversation._id}`)
      .then((res) => setMessages(res.data));
  }, [conversation._id]);


  useEffect(() => {
    api.patch(`/chat/read/${conversation._id}`);
  }, [conversation._id]);



  useEffect(() => {
    socket.emit("joinConversation", conversation._id);

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversation._id]);



  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      conversationId: conversation._id,
      text,
    });

    setText("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`max-w-xs p-2 rounded ${m.sender === user._id
              ? "bg-blue-500 text-white ml-auto"
              : "bg-gray-200"
              }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3"
          placeholder="Message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}



