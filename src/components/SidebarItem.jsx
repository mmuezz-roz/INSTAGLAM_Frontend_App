// import { NavLink } from "react-router-dom";

// export default function SidebarItem({ icon: Icon, label, to }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer
//          hover:bg-gray-100 transition
//          ${isActive ? "font-semibold" : ""}`
//       }
//     >
//       <Icon size={22} />
//       <span className="text-sm">{label}</span>
//     </NavLink>
//   );
// }

// import { NavLink } from "react-router-dom";

// export default function SidebarItem({ icon: Icon, label, to, badge = 0 }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer
//          hover:bg-gray-100 transition
//          ${isActive ? "font-semibold bg-gray-100" : ""}`
//       }
//     >
//       {/* ICON + BADGE WRAPPER */}
//       <div className="relative">
//         <Icon size={22} />

//         {/* 🔴 NOTIFICATION BADGE */}
//         {badge > 0 && (
//           <span
//             className="
//               absolute -top-2 -right-2
//               bg-red-500 text-white text-xs
//               w-5 h-5 flex items-center justify-center
//               rounded-full
//             "
//           >
//             {badge}
//           </span>
//         )}
//       </div>

//       <span className="text-sm">{label}</span>
//     </NavLink>
//   );
// }


// import { NavLink } from "react-router-dom";

// export default function SidebarItem({
//   icon: Icon,
//   label,
//   to,
//   onClick,
//   badge = 0
// }) {
//   const content = (
//     <div className="relative flex items-center gap-4 px-4 py-3">
//       <Icon size={22} />

//       <span className="text-sm">{label}</span>

//       {/* 🔔 Notification Badge */}
//       {badge > 0 && (
//         <span className="absolute left-6 top-2 bg-red-500 text-white
//           text-xs font-semibold px-1.5 py-0.5 rounded-full">
//           {badge}
//         </span>
//       )}
//     </div>
//   );

//   // If onClick is provided (Notifications), don’t use NavLink
//   if (onClick) {
//     return (
//       <button
//         onClick={onClick}
//         className="w-full text-left rounded-lg hover:bg-gray-100 transition"
//       >
//         {content}
//       </button>
//     );
//   }

//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `rounded-lg hover:bg-gray-100 transition
//          ${isActive ? "font-semibold" : ""}`
//       }
//     >
//       {content}
//     </NavLink>
//   );
// }


import { NavLink } from "react-router-dom";

export default function SidebarItem({
  icon: Icon,
  label,
  to,
  onClick,
  badge = 0,
}) {
  const content = (
    <div className="relative flex items-center gap-4 px-4 py-3">
      <Icon size={22} />
      <span className="text-sm">{label}</span>

      {badge > 0 && (
        <span className="absolute left-6 top-2 bg-red-500 text-white
          text-xs font-semibold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left rounded-lg hover:bg-gray-100"
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg hover:bg-gray-100 ${isActive ? "font-semibold" : ""}`
      }
    >
      {content}
    </NavLink>
  );
}
