


import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MainLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await api.get(`/user/search/users?q=${q}`);
      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleUserClick = (userId) => {
    setIsSearchOpen(false);
    navigate(`/user/${userId}`);
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <Sidebar onSearchClick={() => setIsSearchOpen(!isSearchOpen)} isSearchOpen={isSearchOpen} />

      {/* Search Drawer Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/5 z-20"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* Search Drawer Panel */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white border-r z-30 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden ${isSearchOpen ? "w-[390px] ml-[72px]" : "w-0 ml-[72px]"
          }`}
      >
        <div className="p-6 w-[390px]">
          <h2 className="text-2xl font-bold mb-6">Search</h2>
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#efefef] rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gray-300"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
            {results.length === 0 && searchQuery && (
              <p className="text-center text-sm text-gray-400 mt-10">No results found.</p>
            )}
            {!searchQuery && (
              <p className="text-sm font-semibold mb-4 text-gray-600">Recent</p>
            )}

            {results.map((u) => (
              <div
                key={u._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                onClick={() => handleUserClick(u._id)}
              >
                <img
                  src={u.profilePic || "/avatar.png"}
                  className="w-11 h-11 rounded-full object-cover border"
                  alt=""
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{u.username}</span>
                  <span className="text-gray-500 text-sm">{u.name || u.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className={`flex-1 transition-all duration-300 ${isSearchOpen ? "ml-[72px]" : "ml-64"}`}>
        <Outlet />
      </main>
    </div>
  );
}
