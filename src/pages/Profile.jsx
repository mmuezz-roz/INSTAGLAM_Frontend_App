import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import ProfileHeader from "../components/ProfileHeader";
import ProfilePosts from "../components/ProfilePosts";

export default function Profile() {
    const { user: currentUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/user/me");
                setProfileData(res.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="text-center mt-20">Loading Profile...</div>;
    if (!profileData) return <div className="text-center mt-20">Profile not found</div>;

    return (
        <div className="max-w-5xl mx-auto px-4">
            <ProfileHeader
                profileData={profileData}
                isOwnProfile={true}
            />
            <ProfilePosts userId={currentUser?._id} />
        </div>
    );
}
