


import { useEffect, useState } from "react";
import api from "../api/axios";
import ProfileHeader from "../components/ProfileHeader";
import ProfilePosts from "../components/ProfilePosts";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profileData) return <p>Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <ProfileHeader
  profileData={profileData}
  isOwnProfile={true}
/>

      {/* <ProfilePosts /> */}
      <ProfilePosts userId={profileData.user._id} />

    </div>
  );
}
