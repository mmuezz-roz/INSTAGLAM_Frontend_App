



import { useEffect, useState } from "react";
import api from "../api/axios";
import PostModal from "./PostModal";
import { FiGrid } from "react-icons/fi";

export default function ProfilePosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  /* ---------------- FETCH POSTS ---------------- */
  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const res = await api.get(`/post/posts/${userId}`);
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  /* ---------------- DELETE POST (NO REFRESH) ---------------- */
  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setSelectedPost(null); // close modal
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center dark:text-white">
        <div className="w-16 h-16 border-2 border-black dark:border-white rounded-full flex items-center justify-center mb-4">
          <FiGrid size={30} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Posts Yet</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">When you share photos, they will appear here on your profile.</p>
      </div>
    );
  }

  return (
    <>
      {/* GRID */}
      <div className="max-w-5xl mx-auto md:mt-2">
        <div className="grid grid-cols-3 gap-[1px] md:gap-4 lg:gap-8 transition-colors duration-300">
          {posts.map((post) => (
            <div
              key={post._id}
              onClick={() => setSelectedPost(post)}
              className="relative aspect-square overflow-hidden cursor-pointer group bg-gray-100 dark:bg-zinc-900 border dark:border-gray-800"
            >
              <img
                src={post.images[0]}
                alt="post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                {/* Visual placeholders for likes/comments would go here if available */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={handlePostDelete}   // 🔥 IMPORTANT
        />
      )}
    </>
  );
}
