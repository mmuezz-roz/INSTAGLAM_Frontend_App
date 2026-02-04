import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import PostModal from "../components/PostModal";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
  FiSmile,
  FiPlusSquare,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

// Helper component for carousel to handle local state per post
function PostCarousel({ images, onLike, onClick }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative group bg-white dark:bg-zinc-900 flex items-center justify-center min-h-[300px] select-none">
      {images?.length > 1 && (
        <>
          {index > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIndex(index - 1); }}
              className="absolute left-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-black/80 text-black dark:text-white hover:bg-white dark:hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 shadow-md"
            >
              <FiChevronLeft size={16} />
            </button>
          )}
          {index < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setIndex(index + 1); }}
              className="absolute right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-black/80 text-black dark:text-white hover:bg-white dark:hover:bg-black transition-opacity opacity-0 group-hover:opacity-100 shadow-md"
            >
              <FiChevronRight size={16} />
            </button>
          )}
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? "bg-blue-500 scale-110" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        </>
      )}
      <img
        src={images?.[index]}
        onDoubleClick={onLike}
        onClick={onClick}
        className="w-full h-auto max-h-[700px] object-contain transition-opacity group-hover:opacity-95 cursor-pointer"
        alt=""
      />
    </div>
  );
}

export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [followLoading, setFollowLoading] = useState({});
  const [activeEmojiPostId, setActiveEmojiPostId] = useState(null);
  const emojis = ["😀", "😂", "😍", "🔥", "❤️", "👍", "🙌", "✨", "😢", "😮"];

  const handleEmojiClick = (emoji, postId) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: (prev[postId] || "") + emoji
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedRes, suggestionsRes] = await Promise.all([
          api.get("/post/home"),
          api.get("/user/search/users")
        ]);
        setPosts(feedRes.data.posts || []);

        // Filter out me and anyone I already follow
        const followedIds = user?.following || [];
        const filtered = (suggestionsRes.data || []).filter(u =>
          u._id !== user?._id && !followedIds.includes(u._id)
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error("Data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
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

  const handleFollowSuggestion = async (userId) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const res = await api.post(`/user/${userId}/follow`);
      if (res.data.following) {
        setUser(prev => ({
          ...prev,
          following: [...prev.following, userId]
        }));
        setSuggestions(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      console.error("Follow failed", err);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="flex justify-center max-w-[935px] mx-auto md:px-4 py-0 md:py-8 gap-0 md:gap-8">
      {/* Feed Column */}
      <div className="flex-1 w-full max-w-[470px] space-y-0 md:space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-black border dark:border-gray-800 p-12 text-center rounded-lg shadow-sm m-4 dark:text-white">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-black dark:border-white flex items-center justify-center">
                <FiPlusSquare size={32} />
              </div>
            </div>
            <p className="text-xl font-bold mb-2">Welcome to Sway</p>
            <p className="text-sm text-gray-500 mb-6 px-4">Follow people to start seeing their photos and videos in your feed.</p>
            <Link to="/home" className="text-blue-500 font-bold hover:text-blue-700">Find people to follow</Link>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white dark:bg-black border-b md:border border-gray-200 dark:border-gray-800 md:rounded-lg overflow-hidden md:shadow-sm">
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <Link to={`/user/${post.user?._id}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full p-[1.5px] border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer bg-gray-50 dark:bg-zinc-900">
                    <img src={post.user?.profilePic || "/avatar.png"} className="w-full h-full rounded-full object-cover" alt="" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm group-hover:text-gray-500 transition-colors dark:text-gray-200">
                      {post.user?.username}
                    </span>
                    <span className="text-[11px] text-gray-400">Original audio</span>
                  </div>
                </Link>
                <button className="text-gray-500 hover:text-black dark:hover:text-white p-1">
                  <FiMoreHorizontal size={20} />
                </button>
              </div>

              {/* POST CONTENT WITH CAROUSEL SUPPORT */}
              <PostCarousel
                images={post.images}
                onLike={() => handleLike(post._id)}
                onClick={() => setSelectedPost(post)}
              />

              {/* Actions Area */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleLike(post._id)} className="dark:text-white">
                      {post.likes?.includes(user?._id) ? (
                        <FaHeart className="text-red-500 transition-transform active:scale-125" size={24} />
                      ) : (
                        <FiHeart className="hover:text-gray-500 transition-transform active:scale-125" size={24} />
                      )}
                    </button>
                    <button onClick={() => setSelectedPost(post)} className="dark:text-white">
                      <FiMessageCircle className="hover:text-gray-500" size={24} />
                    </button>
                    <button className="dark:text-white">
                      <FiSend className="hover:text-gray-500" size={24} />
                    </button>
                  </div>
                  <button className="dark:text-white">
                    <FiBookmark className="hover:text-gray-500" size={24} />
                  </button>
                </div>

                <p className="font-bold text-sm mb-2 dark:text-gray-200">{post.likes?.length || 0} likes</p>

                <div className="text-sm leading-snug">
                  <Link to={`/user/${post.user?._id}`} className="font-bold mr-2 hover:underline dark:text-gray-200">
                    {post.user?.username}
                  </Link>
                  <span className="text-gray-800 dark:text-gray-300">{post.caption}</span>
                </div>

                {post.comments?.length > 0 && (
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-gray-500 text-sm mt-2 hover:text-gray-400 block"
                  >
                    View all {post.comments.length} comments
                  </button>
                )}

                <p className="text-[10px] text-gray-400 uppercase mt-2 tracking-wide font-medium">
                  {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </p>
              </div>

              <form
                onSubmit={(e) => handleAddComment(e, post._id)}
                className="border-t border-gray-100 dark:border-gray-800 p-3 flex items-center gap-3 group relative"
              >
                {activeEmojiPostId === post._id && (
                  <div className="absolute bottom-12 left-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex gap-1 z-10 animate-in fade-in slide-in-from-bottom-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiClick(emoji, post._id)}
                        className="hover:scale-125 transition-transform text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveEmojiPostId(activeEmojiPostId === post._id ? null : post._id)}
                  className={`transition-colors ${activeEmojiPostId === post._id ? "text-yellow-500" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
                >
                  <FiSmile size={24} />
                </button>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 text-sm outline-none bg-transparent py-1 dark:text-white"
                  value={commentInputs[post._id] || ""}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                />
                <button
                  disabled={!commentInputs[post._id]?.trim()}
                  className="text-[#0095f6] font-bold text-sm disabled:opacity-20 transition-opacity"
                >
                  Post
                </button>
              </form>
            </div>
          ))
        )}
      </div>

      <div className="hidden lg:block w-[320px] pt-4 sticky top-4 h-fit">
        <div className="flex items-center justify-between mb-4">
          <Link to="/profile" className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900">
              <img src={user?.profilePic || "/avatar.png"} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm dark:text-gray-200">{user?.username}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{user?.name || user?.username}</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4 py-1">
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Suggested for you</span>
          <button className="text-black dark:text-white text-xs font-bold hover:text-gray-400">See All</button>
        </div>

        <div className="space-y-3 mb-8">
          {suggestions.map((suggestion) => (
            <div key={suggestion._id} className="flex items-center justify-between">
              <Link to={`/user/${suggestion._id}`} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-50 dark:border-gray-800 bg-gray-100 dark:bg-zinc-900">
                  <img src={suggestion.profilePic || "/avatar.png"} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm hover:underline dark:text-gray-200">{suggestion.username}</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Suggested for you</span>
                </div>
              </Link>
              <button
                onClick={() => handleFollowSuggestion(suggestion._id)}
                disabled={followLoading[suggestion._id]}
                className="text-blue-500 text-xs font-bold hover:text-black disabled:opacity-50"
              >
                {followLoading[suggestion._id] ? "..." : "Follow"}
              </button>
            </div>
          ))}
          {suggestions.length === 0 && !loading && (
            <p className="text-xs text-gray-400 text-center py-4">No suggestions at the moment.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-8 mb-4">
          {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language', 'Meta Verified'].map((link) => (
            <span key={link} className="text-[11px] text-gray-300 hover:underline cursor-pointer">{link}</span>
          ))}
        </div>
        <p className="text-[11px] text-gray-300 font-semibold uppercase">© 2026 SWAY FROM META</p>
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
