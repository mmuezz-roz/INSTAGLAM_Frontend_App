


import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiX } from "react-icons/fi";

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
    <div className="flex min-h-screen bg-[#fafafa] dark:bg-black transition-colors duration-300">
      <Sidebar onSearchClick={() => setIsSearchOpen(!isSearchOpen)} isSearchOpen={isSearchOpen} />

      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/5 dark:bg-black/40 z-20"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-black border-r dark:border-gray-800 z-[60] transition-all duration-300 ease-in-out shadow-2xl overflow-hidden ${isSearchOpen
          ? "w-full md:w-[390px] md:ml-[72px]"
          : "w-0 md:ml-[72px] ml-0"
          }`}
      >
        <div className="p-0 md:p-6 w-full md:w-[390px] flex flex-col h-full bg-white dark:bg-black dark:text-white">
          {/* Mobile Header with Close */}
          <div className="flex items-center justify-between p-4 md:px-0 md:pt-0 md:pb-6">
            <h2 className="text-2xl font-bold">Search</h2>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="px-4 md:px-0 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#efefef] dark:bg-[#262626] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 dark:text-white"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-0">
            {results.length === 0 && searchQuery && (
              <p className="text-center text-sm text-gray-400 mt-10">No results found.</p>
            )}
            {!searchQuery && (
              <p className="text-sm font-semibold mb-4 text-gray-600">Recent</p>
            )}

            <div className="space-y-4 pb-10">
              {results.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer transition active:bg-gray-100 dark:active:bg-gray-800"
                  onClick={() => handleUserClick(u._id)}
                >
                  <img
                    src={u.profilePic || "/avatar.png"}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-800 shadow-sm"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm dark:text-white">{u.username}</span>
                    <span className="text-gray-500 text-sm dark:text-gray-400">{u.name || u.username}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className={`flex-1 transition-all duration-300 pt-12 pb-12 md:pt-0 md:pb-0 ${isSearchOpen ? "md:ml-[72px]" : "md:ml-64 ml-0"
        }`}>
        <Outlet />
      </main>
    </div>
  );
}
