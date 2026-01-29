import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function UserListModal({ title, users, onClose }) {
    const navigate = useNavigate();

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-sm rounded-xl overflow-hidden flex flex-col max-h-[70vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="w-8" /> {/* Spacer */}
                    <h3 className="font-semibold text-center flex-1">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <FiX size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 py-1">
                    {users.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 text-sm">
                            No users found.
                        </div>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u._id}
                                onClick={() => {
                                    navigate(`/user/${u._id}`);
                                    onClose();
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <div className="w-11 h-11 rounded-full overflow-hidden border flex-shrink-0">
                                    <img
                                        src={u.profilePic || "/avatar.png"}
                                        className="w-full h-full object-cover"
                                        alt=""
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{u.username}</p>
                                    <p className="text-xs text-gray-500 truncate">{u.bio || ""}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
