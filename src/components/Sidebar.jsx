import {
  FiHome,
  FiSearch,
  FiCompass,
  FiHeart,
  FiMessageCircle,
  FiPlusSquare,
  FiUser,
} from "react-icons/fi";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 border-r bg-white fixed left-0 top-0 
      flex flex-col">

      
      <div className="px-6 py-6 text-2xl font-semibold tracking-tight">
        Instaglam
      </div>

     
      <nav className="flex flex-col gap-1 px-2">
        <SidebarItem icon={FiHome} label="Home" to="/home" />
        <SidebarItem icon={FiSearch} label="Search" to="/search" />
        <SidebarItem icon={FiCompass} label="Explore" to="/explore" />
        <SidebarItem icon={FiHeart} label="Notifications" to="/notifications" />
        <SidebarItem icon={FiMessageCircle} label="Messages" to="/messages" />
        <SidebarItem icon={FiPlusSquare} label="Create" to="/create" />
        <SidebarItem icon={FiUser} label="Profile" to="/profile" />
      </nav>
    </aside>
  );
}
