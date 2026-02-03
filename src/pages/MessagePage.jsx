import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import NewChatModal from "../components/NewChatModal";
import socket from "../socket";
import { AuthContext } from "../context/AuthContext";
import { FiEdit, FiChevronDown, FiInfo } from "react-icons/fi";

export default function Messages() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    api.get("/chat/conversations")
      .then(res => setConversations(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleNewMessage = ({ conversationId, message }) => {
      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv._id === conversationId) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                text: message.text,
                sender: message.sender,
                updatedAt: message.updatedAt || Date.now(),
              },
            };
          }
          return conv;
        });

        const found = updated.find((c) => c._id === conversationId);
        if (found) {
          const others = updated.filter((c) => c._id !== conversationId);
          return [found, ...others];
        }
        return updated;
      });
    };

    socket.on("newMessageNotification", handleNewMessage);
    return () => socket.off("newMessageNotification", handleNewMessage);
  }, []);

  const handleStartChat = async (targetUser) => {
    try {
      const res = await api.post(`/chat/conversation/${targetUser._id}`);
      if (res.data && res.data._id) {
        setActiveChat(res.data);
        setShowSearch(false);
        setConversations(prev => {
          const exists = prev.find(c => c._id === res.data._id);
          if (!exists) return [res.data, ...prev];
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black overflow-hidden relative transition-colors duration-300">
      {/* LEFT SIDEBAR: Chat List */}
      <div className={`w-full md:w-[350px] flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black z-10 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-6 py-5 flex items-center justify-between sticky top-0 bg-white dark:bg-black">
          <div className="flex items-center gap-2 cursor-pointer group">
            <h2 className="text-xl font-bold text-black dark:text-white">{user?.username}</h2>
            <FiChevronDown className="text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
          </div>
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
          >
            <FiEdit size={24} className="text-black dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-6 pb-2">
            <h3 className="text-base font-semibold text-black dark:text-white mb-1">Messages</h3>
          </div>
          <ChatList
            conversations={conversations}
            onSelect={setActiveChat}
            activeId={activeChat?._id}
          />
        </div>
      </div>

      {/* RIGHT SIDE: Chat Window */}
      <div className={`flex-1 flex flex-col relative bg-white dark:bg-black h-screen ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <ChatWindow conversation={activeChat} onBack={() => setActiveChat(null)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-24 h-24 rounded-full border-2 border-black dark:border-white flex items-center justify-center mb-4 text-black dark:text-white">
              <svg aria-label="Direct" color="currentColor" fill="currentColor" height="48" role="img" viewBox="0 0 96 96" width="48">
                <path d="M48 0C21.5 0 0 21.5 0 48s21.5 48 48 48 48-21.5 48-48S74.5 0 48 0zm0 88C25.9 88 8 70.1 8 48S25.9 8 48 8s40 17.9 40 40-17.9 40-40 40zm21-48L40.7 54.4c-1.4.7-2.6 1.9-3.3 3.3L31.1 72.8c-.5 1.1-.1 2.4 1 2.9.3.1.6.2.9.2.9 0 1.7-.5 2-1.3l6.3-15.1c.4-.8 1-1.4 1.8-1.8l15.1-6.3c1.1-.5 1.6-1.8 1.1-2.9-.3-.8-1.1-1.3-1.9-1.3zm-14.1 6c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-medium text-black dark:text-white mb-1">Your messages</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Send a message to start a chat with a friend.</p>
            <button
              onClick={() => setShowSearch(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Send message
            </button>
          </div>
        )}
      </div>

      {showSearch && (
        <NewChatModal
          onClose={() => setShowSearch(false)}
          onSelect={handleStartChat}
        />
      )}
    </div>
  );
}
