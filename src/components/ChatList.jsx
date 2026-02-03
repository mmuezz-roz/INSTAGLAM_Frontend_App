import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ChatList({ conversations, onSelect, activeId }) {
  const { user } = useContext(AuthContext);

  const getOtherUser = (conv) => {
    return conv.participants.find((p) => p._id !== user._id);
  };

  return (
    <div className="flex flex-col">
      {conversations.length === 0 ? (
        <div className="p-6 text-center text-gray-500 text-sm">
          No messages found.
        </div>
      ) : (
        conversations.map((conv) => {
          const otherUser = getOtherUser(conv);
          if (!otherUser) return null;

          const isActive = activeId === conv._id;

          return (
            <div
              key={conv._id}
              onClick={() => onSelect(conv)}
              className={`px-6 py-3 flex items-center gap-3 cursor-pointer transition-colors ${isActive ? "bg-gray-100 dark:bg-zinc-900" : "hover:bg-gray-50 dark:hover:bg-zinc-900"
                }`}
            >
              <div className="relative">
                <img
                  src={otherUser.profilePic || "/avatar.png"}
                  alt={otherUser.username}
                  className="w-14 h-14 rounded-full object-cover border border-gray-100 dark:border-gray-800 shadow-sm"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm tracking-tight ${isActive ? 'font-semibold' : 'font-medium'} text-black dark:text-white truncate`}>
                  {otherUser.username}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
                    {conv.lastMessage?.text || (conv.lastMessage?.image ? "Sent an image" : "Start a conversation")}
                  </p>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    · {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.sender !== user._id && (
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
