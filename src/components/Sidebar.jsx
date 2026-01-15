

// import {
//   FiHome,
//   FiSearch,
//   FiCompass,
//   FiHeart,
//   FiMessageCircle,
//   FiPlusSquare,
//   FiUser,
//   FiLogOut,
// } from "react-icons/fi";

// import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { AuthContext } from "../context/AuthContext";
// import SidebarItem from "./SidebarItem";

// export default function Sidebar() {
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [notificationCount, setNotificationCount] = useState(0);

//   // 🔔 FETCH UNREAD COUNT ONLY
//   useEffect(() => {
//     const fetchCount = async () => {
//       const res = await api.get("/user/notifications/unread-count");
//       setNotificationCount(res.data.count);
//     };
//     fetchCount();
//   }, []);

//   // 🔔 CLICK NOTIFICATIONS
//   const handleNotificationsClick = async () => {
//     await api.patch("/user/notifications/read");
//     setNotificationCount(0);
//     navigate("/notifications");
//   };

//   return (
//     <aside className="h-screen w-64 border-r bg-white fixed left-0 top-0 flex flex-col">
//       <div className="px-6 py-6 text-2xl font-semibold">
//         Instaglam
//       </div>

//       <nav className="flex flex-col gap-1 px-2">
//         <SidebarItem icon={FiHome} label="Home" to="/home" />
//         <SidebarItem icon={FiSearch} label="Search" to="/search" />
//         <SidebarItem icon={FiCompass} label="Explore" to="/explore" />

//         <SidebarItem
//           icon={FiHeart}
//           label="Notifications"
//           onClick={handleNotificationsClick}
//           badge={notificationCount}
//         />

//         <SidebarItem icon={FiMessageCircle} label="Messages" to="/messages" />
//         <SidebarItem icon={FiPlusSquare} label="Create" to="/create" />
//         <SidebarItem icon={FiUser} label="Profile" to="/profile" />
//       </nav>

//       <div className="mt-auto px-2 pb-6">
//         <button
//           onClick={() => {
//             logout();
//             navigate("/login");
//           }}
//           className="w-full flex items-center gap-4 px-4 py-3
//           text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
//         >
//           <FiLogOut className="text-xl" />
//           Log out
//         </button>
//       </div>
//     </aside>
//   );
// }


import {
  FiHome,
  FiSearch,
  FiCompass,
  FiHeart,
  FiMessageCircle,
  FiPlusSquare,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import SidebarItem from "./SidebarItem";
import { io } from "socket.io-client";

// 🔌 SOCKET INSTANCE (singleton)
const socket = io("http://localhost:3000", {
  withCredentials: true,
});

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notificationCount, setNotificationCount] = useState(0);

  /* ---------------- INITIAL FETCH ---------------- */
  useEffect(() => {
    if (!user?._id) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/user/notifications/unread-count");
        setNotificationCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    };

    fetchUnreadCount();
  }, [user]);

  /* ---------------- SOCKET LISTEN ---------------- */
  useEffect(() => {
    if (!user?._id) return;

    // 🔐 register user with socket server
    socket.emit("register", user._id);

    // 🔔 listen for new notifications
    socket.on("newNotification", () => {
      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  /* ---------------- CLICK NOTIFICATIONS ---------------- */
  const handleNotificationsClick = async () => {
    try {
      await api.patch("/user/notifications/read");
      setNotificationCount(0);
      navigate("/notifications");
    } catch (err) {
      console.error("Failed to mark notifications read", err);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 border-r bg-white fixed left-0 top-0 flex flex-col">

      {/* LOGO */}
      <div className="px-6 py-6 text-2xl font-semibold tracking-tight">
        Instaglam
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-1 px-2">
        <SidebarItem icon={FiHome} label="Home" to="/home" />
        <SidebarItem icon={FiSearch} label="Search" to="/search" />
        <SidebarItem icon={FiCompass} label="Explore" to="/explore" />

        {/* 🔔 NOTIFICATIONS */}
        <SidebarItem
          icon={FiHeart}
          label="Notifications"
          onClick={handleNotificationsClick}
          badge={notificationCount}
        />

        <SidebarItem icon={FiMessageCircle} label="Messages" to="/messages" />
        <SidebarItem icon={FiPlusSquare} label="Create" to="/create" />
        <SidebarItem icon={FiUser} label="Profile" to="/profile" />
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto px-2 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3
          text-sm font-medium text-red-600 rounded-lg
          hover:bg-red-50 transition"
        >
          <FiLogOut className="text-xl" />
          Log out
        </button>
      </div>
    </aside>
  );
}
