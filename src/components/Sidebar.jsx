import {
    FiHome,
    FiSearch,
    FiCompass,
    FiHeart,
    FiMessageCircle,
    FiPlusSquare,
    FiUser,
    FiLogOut,
    FiInstagram
} from "react-icons/fi";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import SidebarItem from "./SidebarItem.jsx";
import socket from "../Socket.js";
// import socket from "../socket";

export default function Sidebar({ onSearchClick, isSearchOpen }) {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    useEffect(() => {
        if (!user?._id) return;

        const loadCounts = async () => {
            try {
                const [notifRes, msgRes] = await Promise.all([
                    api.get("/user/notifications/unread-count"),
                    api.get("/chat/unread"),
                ]);

                setNotificationCount(notifRes.data.count);
                setMessageCount(
                    msgRes.data.reduce((sum, c) => sum + c.count, 0)
                );
            } catch (err) {
                console.error("Failed to load sidebar counts", err);
            }
        };

        loadCounts();
    }, [user]);

    useEffect(() => {
        if (!user?._id) return;

        const onNewNotification = () => {
            setNotificationCount((prev) => prev + 1);
        };

        const onNewMessage = () => {
            setMessageCount((prev) => prev + 1);
        };

        socket.on("newNotification", onNewNotification);
        socket.on("newMessageNotification", onNewMessage);

        return () => {
            socket.off("newNotification", onNewNotification);
            socket.off("newMessageNotification", onNewMessage);
        };
    }, [user]);

    const handleNotificationsClick = async () => {
        await api.patch("/user/notifications/read");
        setNotificationCount(0);
        navigate("/notifications");
    };

    const handleMessagesClick = async () => {
        setMessageCount(0);
        navigate("/messages");
        api.patch("/chat/read-all").catch(console.error);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside
            className={`h-screen border-r bg-white fixed left-0 top-0 flex flex-col z-40 transition-all duration-300 ${isSearchOpen ? "w-[72px]" : "w-64"
                }`}
        >
            {/* LOGO */}
            <div
                className={`px-6 py-10 transition-all duration-300 ${isSearchOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
            >
                <span
                    className="italic font-bold text-2xl tracking-tighter block"
                    style={{ fontFamily: '"Lobster", cursive' }}
                >
                    Instaglam
                </span>
            </div>

            {/* MINI LOGO (when closed) */}
            {isSearchOpen && (
                <div className="absolute top-10 left-0 w-full flex justify-center cursor-pointer" onClick={() => navigate("/home")}>
                    <FiInstagram size={28} className="hover:scale-110 transition" />
                </div>
            )}

            {/* NAV */}
            <nav className={`flex flex-col gap-1 px-2 ${isSearchOpen ? "items-center" : ""}`}>
                <SidebarItem icon={FiHome} label="Home" to="/home" hideLabel={isSearchOpen} />

                {/* SEARCH TOGGLE */}
                <SidebarItem
                    icon={FiSearch}
                    label="Search"
                    onClick={onSearchClick}
                    hideLabel={isSearchOpen}
                    isActive={isSearchOpen}
                />

                <SidebarItem
                    icon={FiHeart}
                    label="Notifications"
                    onClick={handleNotificationsClick}
                    badge={notificationCount}
                    hideLabel={isSearchOpen}
                />

                <SidebarItem
                    icon={FiMessageCircle}
                    label="Messages"
                    onClick={handleMessagesClick}
                    badge={messageCount}
                    hideLabel={isSearchOpen}
                />

                <SidebarItem icon={FiPlusSquare} label="Create" to="/create" hideLabel={isSearchOpen} />
                <SidebarItem icon={FiUser} label="Profile" to="/profile" hideLabel={isSearchOpen} />
            </nav>

            {/* LOGOUT */}
            <div className={`mt-auto px-2 pb-6 ${isSearchOpen ? "flex justify-center" : ""}`}>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all ${isSearchOpen ? "justify-center" : ""
                        }`}
                >
                    <FiLogOut className="text-xl flex-shrink-0" />
                    {!isSearchOpen && <span>Log out</span>}
                </button>
            </div>
        </aside>
    );
}
