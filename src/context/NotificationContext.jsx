import { createContext, useEffect, useState, useContext } from "react";
import api from "../api/axios";
import socket from "../socket";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/user/notifications");
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUnread = async () => {
        try {
            const res = await api.get("/user/notifications/unread-count");
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        // Initial fetch
        fetchNotifications();
        fetchUnread();

        // Listen for new notifications
        socket.on("newNotification", async () => {
            await fetchNotifications();
            await fetchUnread();
        });

        return () => socket.off("newNotification");
    }, [user]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            setUnreadCount,
            fetchNotifications,
            fetchUnread
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
