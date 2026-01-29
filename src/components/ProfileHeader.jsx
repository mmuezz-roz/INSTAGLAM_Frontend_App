
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import UserListModal from "./UserListModal";

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
    <div className="flex gap-12 items-start py-10 border-b max-w-5xl mx-auto">
      {/* Profile Pic */}
      <img
        src={user.profilePic || "/avatar.png"}
        alt="profile"
        className="w-36 h-36 rounded-full object-cover"
      />

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{user.username}</h2>

          {isOwnProfile ? (
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-4 py-1 border rounded text-sm hover:bg-gray-50 transition-colors"
            >
              Edit Profile
            </button>
          ) : requestSent ? (
            <button
              onClick={onFollow}
              className="px-4 py-1.5 border rounded text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Requested
            </button>
          ) : (
            <button
              onClick={onFollow}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all active:scale-95 ${isFollowing
                ? "border border-gray-300 text-black bg-white hover:bg-gray-50"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm shadow-blue-200"
                }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <span><b>{postCount}</b> posts</span>
          <span
            className="cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => handleShowList("followers")}
          >
            <b>{followersCount}</b> followers
          </span>
          <span
            className="cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => handleShowList("following")}
          >
            <b>{followingCount}</b> following
          </span>
        </div>

        {/* Bio */}
        <div className="mt-4 text-sm">
          <p className="font-semibold">{user.username}</p>
          <p className="whitespace-pre-wrap">{user.bio || "No bio yet"}</p>
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
