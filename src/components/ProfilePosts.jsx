



import { useEffect, useState } from "react";
import api from "../api/axios";
import PostModal from "./PostModal";

export default function ProfilePosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

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

  if (loading) {
    return <p className="text-center mt-10">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No posts yet
      </p>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              onClick={() => setSelectedPost(post)}
              className="aspect-square overflow-hidden cursor-pointer bg-black"
            >
              {/* <img
                src={post.image} */}
                <img src={post.images[0]}
                alt="post"
                className="w-full h-full object-cover hover:opacity-80 transition"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 MODAL */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
