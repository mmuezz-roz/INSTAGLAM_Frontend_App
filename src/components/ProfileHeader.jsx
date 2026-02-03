import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import UserListModal from "./UserListModal";
import { FiGrid } from "react-icons/fi";

export default function ProfileHeader({
  profileData,
  isOwnProfile,
  isFollowing,
  requestSent,
  onFollow,
}) {
  const navigate = useNavigate();
  const { user, followersCount, followingCount, postCount } = profileData;

  const [modalTitle, setModalTitle] = useState("");
  const [modalUsers, setModalUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const handleShowList = async (type) => {
    try {
      setLoading(true);
      setModalTitle(type === "followers" ? "Followers" : "Following");
      const res = await api.get(`/user/${user._id}/${type}`);
      setModalUsers(res.data);
      setShowModal(true);
    } catch (err) {
      console.error(`Failed to fetch ${type}`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto md:px-0 pt-6 md:pt-10">
      {/* Desktop Layout (md and up) */}
      <div className="hidden md:flex gap-12 items-start px-4 md:px-0 pb-10 border-b dark:border-gray-800">
        <div className="flex-shrink-0">
          <img
            src={user.profilePic || "/avatar.png"}
            alt="profile"
            className="w-36 h-36 rounded-full object-cover border border-gray-100 dark:border-gray-800 shadow-sm"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-6 mb-6">
            <h2 className="text-xl font-normal text-[#262626] dark:text-white font-sans">{user.username}</h2>
            <div className="flex gap-2">
              {isOwnProfile ? (
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors dark:text-white"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={onFollow}
                    className={`px-8 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${isFollowing
                      ? "border border-gray-300 text-black bg-white hover:bg-gray-50"
                      : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                      }`}
                  >
                    {requestSent ? "Requested" : isFollowing ? "Following" : "Follow"}
                  </button>
                  <button
                    onClick={() => navigate("/messages")}
                    className="px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors dark:text-white"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-10 mb-6 dark:text-gray-300">
            <span><b className="font-semibold dark:text-white">{postCount}</b> posts</span>
            <span className="cursor-pointer" onClick={() => handleShowList("followers")}>
              <b className="font-semibold dark:text-white">{followersCount}</b> followers
            </span>
            <span className="cursor-pointer" onClick={() => handleShowList("following")}>
              <b className="font-semibold dark:text-white">{followingCount}</b> following
            </span>
          </div>

          <div className="text-sm">
            <p className="font-semibold mb-1 dark:text-white">{user.name || user.username}</p>
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-300 leading-relaxed max-w-md">{user.bio || "No bio yet"}</p>
          </div>
        </div>
      </div>

      {/* Mobile Layout (below md) */}
      <div className="md:hidden flex flex-col gap-4 border-b dark:border-gray-800 pb-6 px-4">
        {/* Top Section: Avatar and Stats */}
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src={user.profilePic || "/avatar.png"}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover border border-gray-100 dark:border-gray-800 shadow-sm"
            />
          </div>
          <div className="flex-1 flex justify-around text-center dark:text-white">
            <div className="flex flex-col">
              <span className="font-bold text-base leading-none">{postCount}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">posts</span>
            </div>
            <div className="flex flex-col cursor-pointer" onClick={() => handleShowList("followers")}>
              <span className="font-bold text-base leading-none">{followersCount}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">followers</span>
            </div>
            <div className="flex flex-col cursor-pointer" onClick={() => handleShowList("following")}>
              <span className="font-bold text-base leading-none">{followingCount}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">following</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Name and Bio */}
        <div className="text-sm">
          <p className="font-bold mb-0.5 dark:text-white">{user.name || user.username}</p>
          <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-tight">{user.bio || "No bio yet"}</p>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="flex gap-2">
          {isOwnProfile ? (
            <button
              onClick={() => navigate("/edit-profile")}
              className="flex-1 py-1.5 bg-[#efefef] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-semibold transition-colors dark:text-white"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={onFollow}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95 ${isFollowing
                  ? "bg-[#efefef] dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-700"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                  }`}
              >
                {requestSent ? "Requested" : isFollowing ? "Following" : "Follow"}
              </button>
              <button
                onClick={() => navigate("/messages")}
                className="flex-1 py-1.5 bg-[#efefef] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-semibold transition-colors dark:text-white"
              >
                Message
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center border-t dark:border-gray-800 md:border-none uppercase tracking-widest text-xs font-semibold text-gray-500">
        <div
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-1.5 px-6 py-4 cursor-pointer transition-all ${activeTab === "posts" ? "border-t border-black dark:border-white text-black dark:text-white -mt-[1px]" : "hover:text-black dark:hover:text-gray-300"}`}
        >
          <FiGrid size={16} className={activeTab === "posts" ? "text-black dark:text-white" : "text-gray-400"} />
          <span className="hidden md:inline">Posts</span>
        </div>
      </div>

      {showModal && (
        <UserListModal
          title={modalTitle}
          users={modalUsers}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
