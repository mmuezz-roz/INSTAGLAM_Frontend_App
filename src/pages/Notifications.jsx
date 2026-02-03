import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { FiChevronLeft } from "react-icons/fi";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/user/notifications");
            setNotifications(res.data.notifications || []);
            await api.patch("/user/notifications/read");
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        // Listen for real-time notification updates
        socket.on("newNotification", fetchNotifications);
        return () => {
            socket.off("newNotification", fetchNotifications);
        };
    }, []);

    const handleAction = async (notifId, action, requesterId) => {
        try {
            if (action === "accept") {
                await api.post(`/user/request/${requesterId}/accept`);
            } else if (action === "reject") {
                await api.post(`/user/request/${requesterId}/reject`);
            }
            // Remove all notifications of this type from this sender (clears duplicates)
            setNotifications(prev => prev.filter(n =>
                !(n.sender?._id === requesterId && n.type === "follow_request")
            ));
        } catch (err) {
            console.error(`Failed to ${action} request`, err);
            // If 400, the request was likely already processed by another click
            if (err.response?.status === 400) {
                setNotifications(prev => prev.filter(n =>
                    !(n.sender?._id === requesterId && n.type === "follow_request")
                ));
            }
        }
    };

    if (loading) return <div className="text-center mt-20 text-gray-400 dark:text-gray-500">Loading...</div>;

    return (
        <div className="max-w-[600px] mx-auto py-4 md:py-10 px-4 md:px-0">
            <div className="flex items-center gap-4 mb-4 md:mb-8 border-b dark:border-gray-800 md:border-none pb-2 md:pb-0">
                <button onClick={() => navigate(-1)} className="md:hidden dark:text-white">
                    <FiChevronLeft size={24} />
                </button>
                <h1 className="text-xl md:text-2xl font-bold dark:text-white">Notifications</h1>
            </div>

            <div className="space-y-1">
                {notifications.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No activity yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">When someone likes or comments on your posts, you'll see them here.</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div key={n._id} className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors px-2 rounded-lg group">
                            <div className="flex items-center gap-3 flex-1">

                                <div
                                    className="w-11 h-11 rounded-full overflow-hidden border dark:border-gray-800 cursor-pointer flex-shrink-0"
                                    onClick={() => navigate(`/user/${n.sender._id}`)}
                                >
                                    <img
                                        src={n.sender.profilePic || "/avatar.png"}
                                        className="w-full h-full object-cover"
                                        alt=""
                                    />
                                </div>


                                <div className="flex-1 text-sm leading-snug">
                                    <span
                                        className="font-bold cursor-pointer hover:text-gray-600 dark:text-white dark:hover:text-gray-400"
                                        onClick={() => navigate(`/user/${n.sender._id}`)}
                                    >
                                        {n.sender.username}
                                    </span>
                                    <span className="ml-1 text-[#262626] dark:text-gray-300">
                                        {n.type === "like" && "liked your post."}
                                        {n.type === "comment" && "commented: " + (n.commentText || "your post.")}
                                        {n.type === "follow_request" && "sent a follow request."}
                                        {n.type === "follow" && "started following you."}
                                        {n.type === "comment_like" && "liked your comment."}
                                    </span>
                                    <span className="ml-2 text-gray-400 text-xs whitespace-nowrap dark:text-gray-500">
                                        {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>


                            <div className="ml-4 flex-shrink-0">
                                {(n.type === "like" || n.type === "comment" || n.type === "comment_like") && n.post && (
                                    <div
                                        className="w-11 h-11 rounded cursor-pointer overflow-hidden border dark:border-gray-800 bg-black hover:opacity-80 transition"
                                        onClick={() => navigate(`/home`)}
                                    >
                                        <img
                                            src={n.post.images?.[0] || "/placeholder.png"}
                                            className="w-full h-full object-cover"
                                            alt=""
                                        />
                                    </div>
                                )}

                                {n.type === "follow_request" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(n._id, "accept", n.sender._id)}
                                            className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleAction(n._id, "reject", n.sender._id)}
                                            className="bg-[#efefef] dark:bg-zinc-800 hover:bg-[#dbdbdb] dark:hover:bg-zinc-700 text-black dark:text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}

                                {n.type === "follow" && (
                                    <button
                                        onClick={() => navigate(`/user/${n.sender._id}`)}
                                        className="bg-[#efefef] dark:bg-zinc-800 hover:bg-[#dbdbdb] dark:hover:bg-zinc-700 text-black dark:text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition"
                                    >
                                        Following
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
