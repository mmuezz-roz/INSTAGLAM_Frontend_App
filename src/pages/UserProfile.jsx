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

  /* ✅ HOOKS ALWAYS AT TOP */
  useEffect(() => {
    if (!currentUser?._id) return;

    setLoading(true);
    setRequestSent(false);

    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${userId}`);
        const { user: fetchedUser, isFollowing: followingStatus, requestSent: requestedStatus } = res.data;

        setProfileData({
          user: fetchedUser,
          followersCount: fetchedUser.followers.length,
          followingCount: fetchedUser.following.length,
          postCount: fetchedUser.postsCount || 0,
        });

        setIsFollowing(followingStatus);
        setRequestSent(requestedStatus);
      } catch (err) {
        console.error("Failed to load user profile", err);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser?._id]);

  /* ✅ SAFE RETURNS AFTER HOOKS */
  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profileData) return <p className="p-6">User not found</p>;

  const isOwnProfile = profileData.user._id === currentUser._id;
  const isLocked =
    profileData.user.isPrivate &&
    !isFollowing &&
    !isOwnProfile;

  const handleFollow = async () => {
    try {
      const res = await api.post(`/user/${userId}/follow`);

      const { following, requested } = res.data;

      // Update both states
      setIsFollowing(following);
      setRequestSent(requested);

      // Adjust follower count optimistically (prevent negative values)
      setProfileData((prev) => {
        let newCount = prev.followersCount;
        if (following && !isFollowing) newCount += 1;
        else if (!following && isFollowing) newCount = Math.max(0, newCount - 1);

        return { ...prev, followersCount: newCount };
      });
    } catch (err) {
      console.error("Follow action failed", err);
    }
  };

  return (
    <div className="w-full px-10">
      <ProfileHeader
        profileData={profileData}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        requestSent={requestSent}
        onFollow={handleFollow}
      />

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
