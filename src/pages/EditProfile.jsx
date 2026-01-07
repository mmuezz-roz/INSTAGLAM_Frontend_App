

import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function EditProfile() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
      setIsPrivate(user.isPrivate || false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("isPrivate", isPrivate);

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
  const token = localStorage.getItem("token");

  const res = await api.put("/user/edit-profile", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  
  localStorage.setItem("user", JSON.stringify(res.data.user));
  setUser(res.data.user);

  toast.success("Profile updated");

  navigate("/profile");
} catch (err) {
  console.error(err);
  toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-[#fafafa] flex justify-center px-6">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl bg-white border mt-14 rounded-sm"
    >
      
      <div className="px-8 py-6 border-b">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
      </div>

      
      <div className="flex items-center gap-8 px-8 py-10">
        <img
          src={
            preview ||
            JSON.parse(localStorage.getItem("user"))?.profilePic ||
            "/avatar.png"
          }
          alt="profile"
          className="w-20 h-20 rounded-full object-cover"
        />

        <div className="space-y-2">
          <p className="font-medium text-base">{username}</p>
          <label className="text-blue-500 text-sm cursor-pointer">
            Change profile photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfilePic(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>
      </div>

      
      <div className="px-8 space-y-10 text-sm">

        
        <div className="grid grid-cols-4 items-center gap-6">
          <label className="text-right font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="col-span-3 border px-4 py-2.5 rounded-sm focus:outline-none"
          />
        </div>

       
        <div className="grid grid-cols-4 items-start gap-6">
          <label className="text-right font-medium text-gray-700 pt-1">
            Bio
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="col-span-3 border px-4 py-2.5 rounded-sm focus:outline-none"
          />
        </div>

        
        <div className="grid grid-cols-4 items-center gap-6">
          <label className="text-right font-medium text-gray-700">
            Private
          </label>

          <div className="col-span-3 flex items-center gap-6">
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-gray-300 peer-checked:bg-black rounded-full transition"></div>
              <div className="absolute left-1.5 top-1.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
            </label>

            <span className="text-gray-600">
              {isPrivate ? "Private account" : "Public account"}
            </span>
          </div>
        </div>

        
        <div className="grid grid-cols-4 gap-6 pt-6 pb-10">
          <div></div>
          <button
            type="submit"
            disabled={loading}
            className="col-span-3 bg-blue-500 text-white px-5 py-2.5 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>

      </div>
    </form>
  </div>
);


};
