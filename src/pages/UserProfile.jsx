


import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import ProfileHeader from "../components/ProfileHeader";
import ProfilePosts from "../components/ProfilePosts";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH USER PROFILE
  useEffect(() => {
    setRequestSent(false); // 🔥 IMPORTANT: reset when switching profiles
    setLoading(true);

    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${userId}`);
        const fetchedUser = res.data.user;

        setProfileData({
          user: fetchedUser,
          followersCount: fetchedUser.followers.length,
          followingCount: fetchedUser.following.length,
          postCount: fetchedUser.postsCount || 0,
        });

        // check follow state
        setIsFollowing(
          fetchedUser.followers.includes(currentUser._id)
        );
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser._id]);

  // 🔹 FOLLOW / UNFOLLOW / REQUEST
  const handleFollow = async () => {
    try {
      const res = await api.post(`/user/${userId}/follow`);

      // 🔒 private → request sent
      if (res.data.requested) {
        setRequestSent(true);
        return;
      }

      // 🌍 public follow/unfollow
      setIsFollowing(res.data.following);

      // optimistic followers count update
      setProfileData((prev) => ({
        ...prev,
        followersCount: res.data.following
          ? prev.followersCount + 1
          : prev.followersCount - 1,
      }));
    } catch (err) {
      console.error("Follow action failed", err);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profileData) return <p className="p-6">User not found</p>;

  // ✅ SAFE FLAGS
  const isOwnProfile = profileData.user._id === currentUser._id;

  const isLocked =
    profileData.user.isPrivate &&
    !isFollowing &&
    !isOwnProfile;

  return (
    <div className="w-full px-10">
      <ProfileHeader
        profileData={profileData}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        requestSent={requestSent}
        onFollow={handleFollow}
      />

      {/* 🔒 PRIVATE ACCOUNT MESSAGE */}
      {isLocked ? (
        <p className="mt-10 text-center text-gray-500">
          🔒 This account is private. Follow to see posts.
        </p>
      ) : (
        <ProfilePosts userId={profileData.user._id} />
      )}
    </div>
  );
}

