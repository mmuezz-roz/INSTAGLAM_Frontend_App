import { NavLink } from "react-router-dom";

export default function SidebarItem({ icon: Icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer
         hover:bg-gray-100 transition
         ${isActive ? "font-semibold" : ""}`
      }
    >
      <Icon size={22} />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}
