
import { useRef, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));
    formData.append("caption", caption);

    try {
      setLoading(true);
      await api.post("/post/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow border">

        {/* Header */}
        <div className="border-b px-4 py-3 text-center font-semibold">
          Create new post
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          {/* Upload Box */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer border-2 border-dashed rounded-lg h-52 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 16l4-4a3 3 0 014 0l4 4m0 0l4-4a3 3 0 014 0l4 4m-8-8v12"
              />
            </svg>

            <p className="text-sm">Drag photos here</p>
            <span className="mt-2 text-blue-500 font-medium text-sm">
              Select from computer
            </span>

            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages([...e.target.files])}
              className="hidden"
            />
          </div>

          {/* Selected count */}
          {images.length > 0 && (
            <p className="text-sm text-gray-500 text-center">
              {images.length} file{images.length > 1 && "s"} selected
            </p>
          )}

          {/* Preview grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Caption */}
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="w-full resize-none border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />

          {/* Submit */}
          <button
            disabled={loading}
            className={`w-full py-2 rounded font-medium text-white transition ${loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? "Posting..." : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
}
