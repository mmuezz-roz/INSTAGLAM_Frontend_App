import { useEffect, useState, useContext, useRef } from "react";
import socket from "../socket";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { FiImage, FiX, FiInfo, FiSmile, FiTrash2, FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ChatWindow({ conversation, onBack }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Stores messageId to delete

  const emojis = ["😀", "😂", "😍", "🔥", "❤️", "👍", "🙌", "✨", "😢", "😮"];
  const otherUser = conversation.participants.find((p) => p._id !== user._id);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load message history
  useEffect(() => {
    const convoIdStr = conversation._id.toString();
    setMessages([]);
    api
      .get(`/chat/messages/${convoIdStr}`)
      .then((res) => {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const newHistory = res.data.filter((m) => !existingIds.has(m._id));
          return [...newHistory, ...prev].sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
          );
        });
      })
      .catch((err) => console.error("Error loading messages:", err));
  }, [conversation._id]);

  // Mark conversation as read
  useEffect(() => {
    const convoIdStr = conversation._id.toString();
    api.patch(`/chat/read/${convoIdStr}`).catch(() => { });
  }, [conversation._id]);

  // Socket logic
  useEffect(() => {
    const convoIdStr = conversation._id.toString();
    socket.emit("joinConversation", convoIdStr);

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === msg._id || (m.tempId && m.tempId === msg.tempId));
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [conversation._id]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (!text.trim() && !imagePreview) return;

    const tempId = Date.now().toString();
    const newMessage = {
      _id: tempId,
      tempId,
      text: text || "",
      image: imagePreview,
      sender: user._id,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit("sendMessage", {
      conversationId: conversation._id.toString(),
      text,
      image: imagePreview,
      tempId,
    });

    setText("");
    setImage(null);
    setImagePreview(null);
    setShowEmojis(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
  };

  const navigateToProfile = () => {
    if (otherUser?._id) {
      navigate(`/user/${otherUser._id}`);
    }
  };

  const deleteMessage = (msgId) => {
    setDeleteConfirm(msgId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/chat/delete/${deleteConfirm}`);
      socket.emit("deleteMessage", {
        conversationId: conversation._id.toString(),
        messageId: deleteConfirm
      });
      setMessages((prev) => prev.filter(m => m._id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete failed", err);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-black relative transition-colors duration-300">
      <div className="h-[75px] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden mr-2 p-1 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full dark:text-white">
              <FiChevronLeft size={24} />
            </button>
          )}
          <div className="flex items-center gap-3 cursor-pointer" onClick={navigateToProfile}>
            <div className="relative">
              <img
                src={otherUser?.profilePic || "/avatar.png"}
                alt={otherUser?.username}
                className="w-8 h-8 rounded-full object-cover border border-gray-100 dark:border-gray-800"
              />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white dark:border-black rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-black dark:text-white leading-tight hover:text-gray-600 transition-colors">
                {otherUser?.username}
              </p>
              <p className="text-[11px] text-gray-400">Active now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-black dark:text-white">
          <button className="hover:text-gray-500 transition-colors"><FiInfo size={22} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 custom-scrollbar flex flex-col">
        <div className="flex flex-col items-center py-10 mb-6">
          <img
            src={otherUser?.profilePic || "/avatar.png"}
            alt={otherUser?.username}
            className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm cursor-pointer"
            onClick={navigateToProfile}
          />
          <h3 className="text-xl font-bold text-black dark:text-white cursor-pointer" onClick={navigateToProfile}>
            {otherUser?.username}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Chat on Sway</p>
          <button
            onClick={navigateToProfile}
            className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          >
            View profile
          </button>
        </div>

        {messages.map((m, idx) => {
          const isMe = m.sender?.toString() === user?._id?.toString();
          const prevMsg = messages[idx - 1];
          const isGrouped = prevMsg && prevMsg.sender?.toString() === m.sender?.toString();

          return (
            <div
              key={m._id}
              className={`flex w-full group ${isMe ? "justify-end" : "justify-start"} ${isGrouped ? "mt-0.5" : "mt-4"}`}
            >
              {isMe && (
                <button
                  onClick={() => deleteMessage(m._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500 mt-auto mb-1 order-1"
                >
                  <FiTrash2 size={14} />
                </button>
              )}

              {!isMe && !isGrouped && (
                <div className="w-8 h-8 mr-2 self-end cursor-pointer" onClick={navigateToProfile}>
                  <img
                    src={otherUser?.profilePic || "/avatar.png"}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-gray-100 dark:border-gray-800"
                  />
                </div>
              )}
              {isGrouped && !isMe && <div className="w-10"></div>}

              <div
                className={`max-w-[75%] rounded-[22px] text-sm overflow-hidden flex flex-col ${isMe
                  ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white order-2"
                  : "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white"
                  } ${isMe
                    ? (isGrouped ? "rounded-tr-[4px]" : "rounded-br-[4px]")
                    : (isGrouped ? "rounded-tl-[4px]" : "rounded-bl-[4px]")
                  }`}
              >
                {m.image && (
                  <img
                    src={m.image}
                    alt="attachment"
                    className="max-w-full max-h-[300px] object-cover"
                  />
                )}
                {m.text && (
                  <div className="px-4 py-[7px] leading-relaxed">
                    {m.text}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {imagePreview && (
        <div className="absolute bottom-[80px] left-6 right-6 p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <img src={imagePreview} className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-800" alt="Preview" />
            <div>
              <p className="text-xs font-semibold text-black dark:text-white">Selected Photo</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Ready to send</p>
            </div>
          </div>
          <button
            onClick={() => { setImage(null); setImagePreview(null); }}
            className="p-2 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-black dark:text-white rounded-full transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      {showEmojis && (
        <div className="absolute bottom-[80px] left-6 p-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-10 flex gap-2">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="text-xl hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="px-6 pb-6 pt-2">
        <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-[26px] min-h-[44px]">
          <button
            onClick={() => setShowEmojis(!showEmojis)}
            className={`transition-colors ${showEmojis ? "text-blue-500" : "text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400"}`}
          >
            <FiSmile size={22} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 p-1 transition-colors"
          >
            <FiImage size={24} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
            accept="image/*"
          />

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setShowEmojis(false)}
            className="flex-1 bg-transparent text-sm text-black dark:text-white placeholder:text-gray-400 focus:outline-none py-1"
            placeholder="Message..."
          />

          {(text.trim() || imagePreview) ? (
            <button
              onClick={sendMessage}
              className="text-blue-500 font-bold text-sm hover:text-blue-700 transition-colors pr-1 px-2"
            >
              Send
            </button>
          ) : null}
        </div>
      </div>
      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-[400px] rounded-xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 dark:text-white">
            <div className="p-8 text-center border-b dark:border-gray-800">
              <h3 className="text-xl font-semibold mb-2">Unsend message?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Unsending will remove the message for everyone. People may have already seen or forwarded it.</p>
            </div>
            <div className="flex flex-col">
              <button
                onClick={confirmDelete}
                className="py-3 text-red-500 font-bold border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Unsend
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="py-3 text-black dark:text-white font-normal hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
