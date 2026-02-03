import {
    FiHome,
    FiSearch,
    FiCompass,
    FiHeart,
    FiMessageCircle,
    FiPlusSquare,
    FiUser,
    FiLogOut,
    FiInstagram,
    FiMoon,
    FiSun
} from "react-icons/fi";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import SidebarItem from "./SidebarItem.jsx";
import socket from "../socket";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ onSearchClick, isSearchOpen }) {
    const { logout, user } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
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
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex h-screen border-r bg-white dark:bg-black dark:border-gray-800 fixed left-0 top-0 flex-col z-40 transition-all duration-300 ${isSearchOpen ? "w-[72px]" : "w-64"
                    }`}
            >
                {/* LOGO */}
                <div
                    className={`px-6 py-10 transition-all duration-300 ${isSearchOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"
                        }`}
                >
                    <span
                        className="font-bold text-3xl tracking-tight block dark:text-white"
                        style={{ fontFamily: '"Fredoka", sans-serif' }}
                    >
                        Sway
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

                    {/* THEME TOGGLE */}
                    <SidebarItem
                        icon={theme === "light" ? FiMoon : FiSun}
                        label={theme === "light" ? "Dark Mode" : "Light Mode"}
                        onClick={toggleTheme}
                        hideLabel={isSearchOpen}
                    />
                </nav>

                {/* LOGOUT */}
                <div className={`mt-auto px-2 pb-6 ${isSearchOpen ? "flex justify-center" : ""}`}>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${isSearchOpen ? "justify-center" : ""
                            }`}
                    >
                        <FiLogOut className="text-xl flex-shrink-0" />
                        {!isSearchOpen && <span>Log out</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t dark:border-gray-800 flex justify-around items-center h-12 z-50 px-2 dark:text-white">
                <button onClick={() => navigate("/home")} className="p-2">
                    <FiHome size={24} />
                </button>
                <button onClick={onSearchClick} className="p-2">
                    <FiSearch size={24} />
                </button>
                <button onClick={() => navigate("/create")} className="p-2">
                    <FiPlusSquare size={24} />
                </button>
                <button onClick={handleMessagesClick} className="relative p-2">
                    <FiMessageCircle size={24} />
                    {messageCount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                            {messageCount}
                        </span>
                    )}
                </button>
                <button onClick={() => navigate("/profile")} className="p-2">
                    <FiUser size={24} />
                </button>
            </div>

            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-black border-b dark:border-gray-800 flex justify-between items-center h-12 z-50 px-4 dark:text-white">
                <span className="font-bold text-2xl" style={{ fontFamily: '"Fredoka", sans-serif' }}>
                    Sway
                </span>
                <div className="flex gap-4">
                    <button onClick={handleNotificationsClick} className="relative">
                        <FiHeart size={24} />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    <button onClick={toggleTheme}>
                        {theme === "light" ? <FiMoon size={24} /> : <FiSun size={24} />}
                    </button>
                </div>
            </div>
        </>
    );
}
