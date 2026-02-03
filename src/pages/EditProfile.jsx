

import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { FiX } from "react-icons/fi";

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
    <div className="min-h-screen bg-[#fafafa] dark:bg-black flex justify-center px-0 md:px-6 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white dark:bg-black border dark:border-gray-800 md:mt-14 md:rounded-sm min-h-screen md:min-h-0 dark:text-white"
      >

        <div className="px-6 md:px-8 py-4 md:py-6 border-b dark:border-gray-800 flex items-center">
          <button type="button" onClick={() => navigate(-1)} className="md:hidden mr-4 dark:text-white">
            <FiX size={24} />
          </button>
          <h2 className="text-xl font-semibold">Edit Profile</h2>
        </div>


        <div className="flex items-center gap-6 md:gap-8 px-6 md:px-8 py-8 md:py-10">
          <img
            src={
              preview ||
              JSON.parse(localStorage.getItem("user"))?.profilePic ||
              "/avatar.png"
            }
            alt="profile"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border dark:border-gray-800"
          />

          <div className="space-y-1">
            <p className="font-semibold text-base">{username}</p>
            <label className="text-blue-500 text-sm font-semibold cursor-pointer block">
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


        <div className="px-6 md:px-8 space-y-8 md:space-y-10 text-sm">


          <div className="flex flex-col md:grid md:grid-cols-4 md:items-center gap-2 md:gap-6">
            <label className="md:text-right font-semibold md:font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="md:col-span-3 border dark:border-gray-800 bg-transparent px-4 py-2.5 rounded-lg md:rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all dark:text-white"
            />
          </div>


          <div className="flex flex-col md:grid md:grid-cols-4 md:items-start gap-2 md:gap-6">
            <label className="md:text-right font-semibold md:font-medium text-gray-700 dark:text-gray-300 md:pt-1">
              Bio
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="md:col-span-3 border dark:border-gray-800 bg-transparent px-4 py-2.5 rounded-lg md:rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all resize-none dark:text-white"
            />
          </div>


          <div className="flex flex-col md:grid md:grid-cols-4 md:items-center gap-4 md:gap-6">
            <label className="md:text-right font-semibold md:font-medium text-gray-700 dark:text-gray-300">
              Private Account
            </label>

            <div className="md:col-span-3 flex items-center gap-6">
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-zinc-800 peer-checked:bg-blue-500 rounded-full transition-colors duration-200 ease-in-out"></div>
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white dark:bg-gray-300 rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></div>
              </label>

              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {isPrivate ? "Private: only followers can see your posts." : "Public: anyone can see your posts."}
              </span>
            </div>
          </div>


          <div className="flex flex-col md:grid md:grid-cols-4 gap-6 pt-4 pb-10">
            <div className="hidden md:block"></div>
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-3 bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );


};
