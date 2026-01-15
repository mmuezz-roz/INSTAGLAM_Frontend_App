

import { useNavigate } from "react-router-dom";

export default function  ProfileHeader({
  profileData,
  isOwnProfile,
  isFollowing,
  requestSent,
  onFollow,
}) {
  const navigate = useNavigate();
  const { user, followersCount, followingCount, postCount } = profileData;

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
              className="px-4 py-1 border rounded text-sm"
            >
              Edit Profile
            </button>
          ) : requestSent ? (
            <button
              disabled
              className="px-4 py-1.5 border rounded text-sm text-gray-500 cursor-not-allowed"
            >
              Requested
            </button>
          ) : (
            <button
              onClick={onFollow}
              className={`px-4 py-1.5 rounded text-sm font-medium ${
                isFollowing
                  ? "border border-gray-300 text-black bg-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <span><b>{postCount}</b> posts</span>
          <span><b>{followersCount}</b> followers</span>
          <span><b>{followingCount}</b> following</span>
        </div>

        {/* Bio */}
        <div className="mt-4 text-sm">
          <p className="font-semibold">{user.username}</p>
          <p>{user.bio || "No bio yet"}</p>
        </div>
      </div>
    </div>
  );
}


