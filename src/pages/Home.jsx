import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import PostModal from "../components/PostModal";
import { AuthContext } from "../context/AuthContext";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
  FiSmile
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feedRes = await api.get("/post/home");
        setPosts(feedRes.data.posts || []);
      } catch (err) {
        console.error("Feed fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFeed();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLike = async (postId) => {
    try {
      const res = await api.post(`/post/posts/${postId}/like`);
      setPosts(prev => prev.map(p =>
        p._id === postId ? {
          ...p,
          likes: res.data.liked ? [...p.likes, user._id] : p.likes.filter(id => id !== user._id)
        } : p
      ));
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    try {
      const res = await api.post(`/post/posts/${postId}/comment`, { text });
      setPosts(prev => prev.map(p =>
        p._id === postId ? { ...p, comments: [...p.comments, res.data.comment] } : p
      ));
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="flex justify-center max-w-[1000px] mx-auto px-4 py-8 gap-12">
      {/* Feed Area */}
      <div className="flex-1 max-w-[470px] space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white border p-10 text-center rounded-lg">
            <p className="text-gray-500 font-semibold mb-2">Welcome to Instaglam</p>
            <p className="text-sm text-gray-400 mb-4">You are not following anyone yet or they haven't posted.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border cursor-pointer">
                    <img src={post.user.profilePic || "/avatar.png"} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className="font-semibold text-sm hover:text-gray-500 cursor-pointer">{post.user.username}</span>
                </div>
                <button className="text-gray-500 hover:text-black">
                  <FiMoreHorizontal size={20} />
                </button>
              </div>

              {/* Post Image */}
              <div
                className="bg-black aspect-square flex items-center justify-center cursor-pointer select-none"
                onClick={() => setSelectedPost(post)}
              >
                <img src={post.images[0]} className="max-w-full max-h-full object-contain" alt="" />
              </div>

              {/* Actions Area */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleLike(post._id)}>
                      {post.likes.includes(user?._id) ? (
                        <FaHeart className="text-red-500 transition-transform active:scale-125" size={24} />
                      ) : (
                        <FiHeart className="hover:text-gray-500 transition-transform active:scale-125" size={24} />
                      )}
                    </button>
                    <button onClick={() => setSelectedPost(post)}>
                      <FiMessageCircle className="hover:text-gray-500" size={24} />
                    </button>
                    <button>
                      <FiSend className="hover:text-gray-500" size={24} />
                    </button>
                  </div>
                  <button>
                    <FiBookmark className="hover:text-gray-500" size={24} />
                  </button>
                </div>

                {/* Likes Count */}
                <p className="font-semibold text-sm mb-1">{post.likes.length} likes</p>

                {/* Caption */}
                <div className="text-sm leading-tight flex gap-1">
                  <span className="font-semibold whitespace-nowrap hover:underline cursor-pointer">{post.user.username}</span>
                  <span className="line-clamp-2">{post.caption}</span>
                </div>

                {/* View Comments Link */}
                {post.comments?.length > 0 && (
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-gray-500 text-sm mt-1 hover:text-gray-400"
                  >
                    View all {post.comments.length} comments
                  </button>
                )}

                {/* Timestamp placeholder */}
                <p className="text-[10px] text-gray-500 uppercase mt-2 tracking-wider">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Inline Comment Input */}
              <form
                onSubmit={(e) => handleAddComment(e, post._id)}
                className="border-t p-3 flex items-center gap-3"
              >
                {/* <FiSmile size={24} className="text-gray-500 cursor-pointer" /> */}
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 text-sm outline-none bg-transparent"
                  value={commentInputs[post._id] || ""}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                />
                <button
                  disabled={!commentInputs[post._id]?.trim()}
                  className="text-[#0095f6] font-semibold text-sm disabled:opacity-30"
                >
                  Post
                </button>
              </form>
            </div>
          ))
        )}
      </div>

      {/* Post Details Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
