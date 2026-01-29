import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const getChatType = (me, other) => {
  // Add safety checks
  if (!me || !other || !me.following || !other.following) {
    return "stranger";
  }

  const iFollow = me.following.includes(other._id);
  const theyFollow = other.following.includes(me._id);

  if (iFollow && theyFollow) return "mutual";
  if (iFollow) return "one-way";
  return "stranger";
};

export default function ChatList({ conversations, onSelect }) {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("all");

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.participants.find(
      (p) => p._id !== user._id
    );

    // Skip if otherUser not found
    if (!otherUser) return false;

    const type = getChatType(user, otherUser);

    if (filter === "all") return true;
    return type === filter;
  });

  return (
    <div className="w-80 border-r h-full">

      {/* FILTER TABS */}
      <div className="flex gap-2 p-3 border-b">
        {["all", "mutual", "one-way", "stranger"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 text-sm rounded ${filter === t ? "bg-black text-white" : "bg-gray-100"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CHAT LIST */}
      <div className="overflow-y-auto">
        {filteredConversations.map((conv) => {
          const otherUser = conv.participants.find(
            (p) => p._id !== user._id
          );

          // Skip rendering if otherUser not found or incomplete
          if (!otherUser || !otherUser.username) return null;

          return (
            <div
              key={conv._id}
              onClick={() => onSelect(conv)}
              className="p-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={otherUser.profilePic || "/avatar.png"}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{otherUser.username}</p>
                <p className="text-xs text-gray-500">
                  {conv.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
