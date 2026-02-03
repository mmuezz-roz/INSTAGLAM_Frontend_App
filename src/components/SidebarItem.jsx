import { NavLink } from "react-router-dom";

export default function SidebarItem({ icon: Icon, label, to, onClick, badge, hideLabel, isActive: isForcedActive }) {
    const content = (
        <>
            <div className="relative flex-shrink-0">
                <Icon className={`text-2xl transition-transform ${isForcedActive ? "scale-110" : "group-hover:scale-110"}`} />
                {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border-2 border-white dark:border-black">
                        {badge > 9 ? "9+" : badge}
                    </span>
                )}
            </div>
            {!hideLabel && (
                <span className="hidden lg:inline text-base whitespace-nowrap overflow-hidden transition-all duration-300 dark:text-white">
                    {label}
                </span>
            )}
        </>
    );

    const baseClasses = `group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-900 w-full text-left active:scale-95 dark:text-gray-300 ${isForcedActive ? "bg-gray-100 dark:bg-gray-900 font-bold border border-gray-200 dark:border-gray-700 text-black dark:text-white" : "font-medium"
        }`;

    const linkClasses = ({ isActive }) =>
        `${baseClasses} ${isActive && !isForcedActive ? "font-bold" : ""}`;

    if (onClick) {
        return (
            <button onClick={onClick} className={baseClasses}>
                {content}
            </button>
        );
    }

    return (
        <NavLink to={to} className={linkClasses}>
            {content}
        </NavLink>
    );
}
