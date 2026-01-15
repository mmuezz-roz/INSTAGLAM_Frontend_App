

import { useEffect, useState } from "react";
import api from "../api/axios";
import PostModal from "../components/PostModal";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);



useEffect(() => {
  const fetchFeed = async () => {
    try {
      
      const res = await api.get("/post/home");
      setPosts(res.data.posts || []);
      console.log("worked??")
    } catch (err) {
      console.error("Feed fetch failed", err);
    } finally {
      setLoading(false); 
    }
  };

  fetchFeed();
}, []);



 if (loading) {
  return <p className="text-center mt-10">Loading feed...</p>;
}

if (posts.length === 0) {
  return (
    <p className="text-center mt-10 text-gray-500">
      Follow people to see posts
    </p>
  );
}

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="border rounded bg-white"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <img
              src={post.user.profilePic || "/avatar.png"}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold text-sm">
              {post.user.username}
            </span>
          </div>

          {/* Image */}
          <div
            className="cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <img
              src={post.images[0]}
              className="w-full object-cover"
            />
          </div>

          {/* Actions */}
          <div className="px-4 py-2">
            <p className="text-sm font-medium">
              {post.likes.length} likes
            </p>
            {post.caption && (
              <p className="text-sm mt-1">
                <b>{post.user.username}</b> {post.caption}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}

