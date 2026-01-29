import { FiX, FiHeart, FiMoreHorizontal, FiMessageCircle, FiSend, FiBookmark, FiSmile } from "react-icons/fi";
import { FaHeart, FaTrash } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function PostModal({ post, onClose, onDelete }) {
  const { user } = useContext(AuthContext);
  if (!user) return null;

  const isOwner = post.user?._id === user._id;

  const [liked, setLiked] = useState(post.likes?.includes(user._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // UI only
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ESC close */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  /* ❤️ LIKE */
  const handleLike = async () => {
    const res = await api.post(`/post/posts/${post._id}/like`);
    setLiked(res.data.liked);
    setLikesCount(res.data.likesCount);
  };

  /* 💬 COMMENT */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    const res = await api.post(`/post/posts/${post._id}/comment`, {
      text: newComment,
    });

    setComments((prev) => [...prev, res.data.comment]);
    setNewComment("");
    setLoading(false);
  };

  /* 🗑 DELETE POST */
  const handleDeletePost = async () => {
    await api.delete(`/post/posts/${post._id}`);
    onDelete(post._id);
    setShowDeleteModal(false);
    onClose();
  };

  /* 🗑 DELETE COMMENT */
  const handleDeleteComment = async (commentId) => {
    await api.delete(
      `/post/posts/${post._id}/comment/${commentId}`
    );

    setComments((prev) =>
      prev.filter((c) => c._id !== commentId)
    );
  };

  /* ❤️ LIKE COMMENT */
  const handleCommentLike = async (commentId) => {
    try {
      const res = await api.post(`/post/posts/${post._id}/comment/${commentId}/like`);

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
              ...c,
              likes: res.data.liked
                ? [...(c.likes || []), user._id]
                : (c.likes || []).filter((id) => id !== user._id),
            }
            : c
        )
      );
    } catch (err) {
      console.error("Comment like failed", err);
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div
        className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white max-w-4xl w-full h-[80vh] flex relative rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl z-10"
          >
            <FiX />
          </button>

          {/* IMAGE */}
          <div className="w-2/3 bg-black flex items-center justify-center">
            <img
              src={post.images[currentIndex]}
              className="max-h-full object-contain"
              alt=""
            />
          </div>

          {/* RIGHT */}
          <div className="w-1/3 flex flex-col border-l">
            {/* HEADER */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border">
                  <img src={post.user?.profilePic || "/avatar.png"} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{post.user?.username}</span>
                </div>
              </div>

              {isOwner ? (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                >
                  <FaTrash size={16} />
                </button>
              ) : (
                <button className="text-gray-500 hover:text-black">
                  <FiMoreHorizontal size={20} />
                </button>
              )}
            </div>

            {/* COMMENTS */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
              {/* Caption as first comment */}
              {post.caption && (
                <div className="flex gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full overflow-hidden border flex-shrink-0">
                    <img src={post.user?.profilePic || "/avatar.png"} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <span className="font-semibold mr-2">{post.user?.username}</span>
                    <span>{post.caption}</span>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {comments.map((c) => {
                const canDelete =
                  c.user?._id === user._id ||
                  post.user?._id === user._id;

                return (
                  <div key={c._id} className="group flex justify-between items-start text-sm">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border flex-shrink-0">
                        <img src={c.user?.profilePic || "/avatar.png"} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col">
                        <div>
                          <span className="font-semibold mr-2">{c.user?.username}</span>
                          <span>{c.text}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                          <span>{new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                          {c.likes?.length > 0 && (
                            <span className="font-semibold">{c.likes.length} likes</span>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(c._id)}
                              className="hover:text-red-500 transition"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCommentLike(c._id)}
                      className="text-gray-400 hover:text-red-500 transition ml-2 mt-2"
                    >
                      {c.likes?.includes(user._id) ? (
                        <FaHeart className="text-red-500" size={12} />
                      ) : (
                        <FiHeart size={12} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="px-4 py-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button onClick={handleLike}>
                    {liked ? (
                      <FaHeart className="text-red-500 transition-transform active:scale-125" size={24} />
                    ) : (
                      <FiHeart className="hover:text-gray-500 transition-transform active:scale-125" size={24} />
                    )}
                  </button>
                  <button><FiMessageCircle size={24} className="hover:text-gray-500" /></button>
                  <button><FiSend size={24} className="hover:text-gray-500" /></button>
                </div>
                <button><FiBookmark size={24} className="hover:text-gray-500" /></button>
              </div>

              <p className="text-sm font-semibold mb-1">{likesCount} likes</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>

              <form onSubmit={handleAddComment} className="flex items-center gap-3 pt-3 border-t">
                <FiSmile size={24} className="text-gray-500" />
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-sm outline-none bg-transparent"
                  placeholder="Add a comment…"
                />
                <button
                  disabled={loading || !newComment.trim()}
                  className="text-[#0095f6] text-sm font-semibold disabled:opacity-30"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE POST MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[320px] rounded-xl overflow-hidden">
            <div className="p-5 text-center border-b">
              <h3 className="font-semibold text-lg">Delete Post?</h3>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col">
              <button
                onClick={handleDeletePost}
                className="py-3 text-red-600 font-semibold hover:bg-gray-50"
              >
                Delete
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-3 border-t text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
