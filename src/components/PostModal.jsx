




import { FiX, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function PostModal({ post, onClose }) {
  const { user } = useContext(AuthContext);

  const [liked, setLiked] = useState(
    post.likes?.includes(user._id)
  );
  const [likesCount, setLikesCount] = useState(
    post.likes?.length || 0
  );

  const [comments, setComments] = useState(
    Array.isArray(post.comments) ? post.comments : []
  );
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);


  // ESC close
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ❤️ LIKE
  const handleLike = async () => {
    try {
      const res = await api.post(`/post/posts/${post._id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  // 💬 ADD COMMENT
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const res = await api.post(
        `/post/posts/${post._id}/comment`,
        { text: newComment }
      );

      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(
        `/post/posts/${post._id}/comment/${commentId}`
      );

      setComments((prev) =>
        prev.filter((c) => c._id !== commentId)
      );
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl w-full h-[80vh] flex relative rounded"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl"
        >
          <FiX />
        </button>

        {/* Image */}
        {/* <div className="w-2/3 bg-black flex items-center justify-center">
          <img
            src={post.image}
            alt="post"
            className="max-h-full object-contain"
          />
        </div> */}

          {/* Image / Carousel */}
<div className="w-2/3 bg-black relative flex flex-col items-center justify-center">

  {/* Image */}
  <img
    src={post.images[currentIndex]}
    alt="post"
    className="max-h-full object-contain"
  />

  {/* ⬅️ LEFT ARROW */}
  {post.images.length > 1 && currentIndex > 0 && (
    <button
      onClick={() => setCurrentIndex((i) => i - 1)}
      className="absolute left-4 text-white text-4xl font-bold"
    >
      ‹
    </button>
  )}

  {/* ➡️ RIGHT ARROW */}
  {post.images.length > 1 &&
    currentIndex < post.images.length - 1 && (
      <button
        onClick={() => setCurrentIndex((i) => i + 1)}
        className="absolute right-4 text-white text-4xl font-bold"
      >
        ›
      </button>
    )}

  {/* 🔵 DOTS INDICATOR */}
  {post.images.length > 1 && (
    <div className="absolute bottom-4 flex gap-2">
      {post.images.map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${
            i === currentIndex
              ? "bg-blue-500"
              : "bg-gray-400"
          }`}
        />
      ))}
    </div>
  )}
</div>



        {/* Right */}
        <div className="w-1/3 flex flex-col border-l">

          {/* Header */}
          <div className="p-4 border-b font-semibold">
            {post.user?.username}
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="px-4 py-2 text-sm">
              <span className="font-semibold">
                {post.user?.username}
              </span>{" "}
              {post.caption}
            </div>
          )}

          {/* COMMENTS */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
            {comments.length === 0 && (
              <p className="text-sm text-gray-400">
                No comments yet
              </p>
            )}

            {comments.map((c) => {
              const canDelete =
                c.user?._id === user._id ||
                post.user?._id === user._id;

              return (
                <div
                  key={c._id}
                  className="flex justify-between items-start text-sm"
                >
                  <div>
                    <span className="font-semibold mr-1">
                      {c.user?.username}
                    </span>
                    {c.text}
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="px-4 py-2 border-t">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={handleLike}>
                {liked ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FiHeart className="text-xl" />
                )}
              </button>

              <span className="text-sm font-medium">
                {likesCount} likes
              </span>
            </div>

            {/* ADD COMMENT */}
            <form
              onSubmit={handleAddComment}
              className="flex items-center gap-2"
            >
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="text-blue-500 font-semibold text-sm"
              >
                Post
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

