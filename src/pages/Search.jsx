import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


export default function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(`/user/search/users?q=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);
      } catch (err) {
        console.error("Search failed", err);
      }
    };

    if (query.trim()) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [query]);

  return (
    <div className="max-w-xl mx-auto mb-96 px-4">
      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:outline-none"
      />

      {/* RESULTS */}
      <div className="mt-6 space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/user/${user._id}`)}
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <img
              src={user.profilePic || "DEFAULT_IMAGE"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium">{user.username}</span>
          </div>
        ))}

        {query && users.length === 0 && (
          <p className="text-gray-500 text-sm mt-4">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}
