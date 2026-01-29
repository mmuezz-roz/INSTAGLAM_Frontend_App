import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
// import { GoogleAuth } from "./Googleauth";
// import GoogleAuth from "./GoogleAuth";



export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/user/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-sm bg-white border rounded-sm px-8 py-10">


        <h2 className="text-3xl font-semibold text-center mb-2">
          Instaglam
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Log in to your account
        </p>


        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-sm text-sm
          border-gray-300 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-sm text-sm
          border-gray-300 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-2.5 rounded-md text-sm font-medium
          bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Log in
          </button>
        </form>


        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>


        <div className="flex justify-center">
          <GoogleLogin />
        </div>


        <div className="text-center text-sm text-gray-500 mt-8">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-500 font-medium hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );

}
