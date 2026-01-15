

import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";

export default function Notifications() {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch follow requests
  useEffect(() => {
    api.get("/user/follow-requests")
      .then(res => setRequests(res.data.requests))
      .catch(err => console.error(err));
  }, []);

  // 🔹 Fetch activity notifications (likes, comments, follows)
  useEffect(() => {
    api.get("/user/notifications")
      .then(res => setNotifications(res.data.notifications))
      .catch(() => {}); // silent if not implemented yet
  }, []);

  const handleAccept = async (id) => {
    await api.post(`/user/request/${id}/accept`);
    setRequests(prev => prev.filter(r => r._id !== id));
  };

  const handleReject = async (id) => {
    await api.post(`/user/request/${id}/reject`);
    setRequests(prev => prev.filter(r => r._id !== id));
  };

  return (
    <div className="pl-72 pr-10 pt-10 max-w-2xl">

      {/* 🔔 FOLLOW REQUESTS */}
      <h2 className="text-xl font-semibold mb-4">Follow Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500 mb-8">No follow requests</p>
      ) : (
        <div className="space-y-4 mb-10">
          {requests.map(user => (
            <div
              key={user._id}
              className="flex items-center justify-between border p-4 rounded"
            >
              {/* CLICKABLE USER */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/user/${user._id}`)}
              >
                <img
                  src={user.profilePic || "/avatar.png"}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium hover:underline">
                  {user.username}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(user._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  className="px-3 py-1 border rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ❤️ ACTIVITY */}
      <h2 className="text-xl font-semibold mb-4">Activity</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No activity yet</p>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <div
              key={n._id}
              className="flex items-center justify-between border p-4 rounded"
            >
              <div className="flex items-center gap-3">
                <img
                  src={n.sender.profilePic || "/avatar.png"}
                  className="w-10 h-10 rounded-full"
                />

                <p className="text-sm">
                  <span
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate(`/user/${n.sender._id}`)}
                  >
                    {n.sender.username}
                  </span>{" "}
                  {n.type === "like" && "liked your post"}
                  {n.type === "comment" && "commented on your post"}
                  {n.type === "follow" && "started following you"}
                </p>
              </div>

              {n.post && (
                <img
                  src={n.post.image}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
