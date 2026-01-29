import { useEffect, useState } from "react";
import api from "../api/axios";
import { FiX } from "react-icons/fi";

export default function NewChatModal({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/chat/chatsearch/users?q=${query}`);
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleChat = () => {
    if (selectedUser) {
      onSelect(selectedUser);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <FiX size={24} />
          </button>
          <h3 className="font-semibold text-base">New message</h3>
          <button
            onClick={handleChat}
            disabled={!selectedUser}
            className={`text-sm font-semibold transition ${selectedUser ? "text-[#0095f6]" : "text-gray-300"}`}
          >
            Next
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="px-4 py-2 border-b flex items-center gap-3">
          <span className="font-medium text-sm">To:</span>
          <div className="flex-1 relative flex flex-wrap gap-1">
            {selectedUser && (
              <div className="bg-[#e0f1ff] text-[#0095f6] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                {selectedUser.username}
                <button onClick={() => setSelectedUser(null)}><FiX size={14} /></button>
              </div>
            )}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="flex-1 min-w-[100px] text-sm outline-none py-1"
            />
          </div>
        </div>

        {/* USER LIST */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar min-h-[200px]">
          {loading && (
            <div className="p-10 flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          )}

          {!loading && users.length === 0 && query && (
            <div className="p-10 text-center text-sm text-gray-400 font-medium">
              No account found.
            </div>
          )}

          {!loading && !query && (
            <div className="p-4 text-sm font-semibold text-gray-800">Suggested</div>
          )}

          {!loading && users.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.profilePic || "/avatar.png"}
                  alt={u.username}
                  className="w-11 h-11 rounded-full object-cover border"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{u.username}</span>
                  <span className="text-gray-400 text-sm font-normal">{u.name || u.username}</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${selectedUser?._id === u._id ? "bg-[#0095f6] border-[#0095f6]" : "border-gray-300"}`}>
                {selectedUser?._id === u._id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-4">
          <button
            onClick={handleChat}
            disabled={!selectedUser}
            className={`w-full font-semibold py-2 rounded-lg transition ${selectedUser
                ? "bg-[#0095f6] text-white hover:bg-[#1877f2]"
                : "bg-[#0095f6] text-white opacity-30 cursor-not-allowed"
              }`}
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}
