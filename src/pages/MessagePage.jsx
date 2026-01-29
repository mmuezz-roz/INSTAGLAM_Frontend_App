// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import ChatList from "../components/ChatList";
// import ChatWindow from "../components/ChatWindow";
// import NewChatModal from "../components/NewChatModal";


// export default function Messages() {
//   const [conversations, setConversations] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [showSearch, setShowSearch] = useState(false);


//   useEffect(() => {
//     api.get("/chat/conversations")
//       .then(res => setConversations(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const handleStartChat = async (user) => {
//   const res = await api.post(`/chat/conversation/${user._id}`);
//   setActiveChat(res.data);
//   setShowSearch(false);
// };


//   return (
//     <div className="flex h-screen pl-64">
//       <div className="flex items-center justify-between px-6 py-4 border-b">
//   <h2 className="text-xl font-semibold">Messages</h2>
//   {showSearch && (
//   <NewChatModal
//     onClose={() => setShowSearch(false)}
//     onSelect={handleStartChat}
//   />
// )}


//   <button
//     onClick={() => setShowSearch(true)}
//     className="text-blue-500 font-medium"
//   >
//     New message
//   </button>
// </div>

//       <ChatList
//         conversations={conversations}
//         onSelect={setActiveChat}
//       />

//       {activeChat ? (
//         <ChatWindow conversation={activeChat} />
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-gray-400">
//           Select a chat
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "../api/axios";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import NewChatModal from "../components/NewChatModal";
import socket from "../socket"; // Import socket

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    api.get("/chat/conversations")
      .then(res => setConversations(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔔 Listen for incoming messages to update the list
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

        // Optional: Move updated conversation to top
        const found = updated.find((c) => c._id === conversationId);
        if (found) {
          const others = updated.filter((c) => c._id !== conversationId);
          return [found, ...others];
        }
        return updated;
      });
    };

    socket.on("newMessageNotification", handleNewMessage);

    return () => {
      socket.off("newMessageNotification", handleNewMessage);
    };
  }, []);

  const handleStartChat = async (targetUser) => {
    try {
      const res = await api.post(`/chat/conversation/${targetUser._id}`);

      if (res.data && res.data._id) {
        setActiveChat(res.data);
        setShowSearch(false);

        // Add to list if not present
        setConversations(prev => {
          const exists = prev.find(c => c._id === res.data._id);
          if (!exists) return [res.data, ...prev];
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Could not start chat.";
      alert(`${errorMsg} (ID: ${targetUser?._id})`);
    }
  };


  return (
    <div className="flex h-screen pl-64">

      {/* LEFT PANEL */}
      <div className="w-80 border-r flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button
            onClick={() => setShowSearch(true)}
            className="text-blue-500 font-medium"
          >
            New message
          </button>
        </div>

        <ChatList
          conversations={conversations}
          onSelect={setActiveChat}
        />
      </div>

      {/* RIGHT PANEL */}
      {activeChat ? (
        <ChatWindow conversation={activeChat} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a chat
        </div>
      )}

      {/* MODAL */}
      {showSearch && (
        <NewChatModal
          onClose={() => setShowSearch(false)}
          onSelect={handleStartChat}
        />
      )}
    </div>
  );
}
