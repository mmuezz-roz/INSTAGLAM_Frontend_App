import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "./Googleauth";



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
      const res = await api.post("/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      navigate("/Profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Email / Password Login */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

         <button  type="submit"  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
                  <button
                type="button"
                 onClick={() => navigate("/register")}
                 className="mt-4 w-full text-sm text-blue-600 hover:underline"> New here? Create an account
                    <span className="font-medium ml-2">Sign up</span>
        </button>
      </form>

      {/* Divider */}
      <hr style={{ margin: "20px 0" }} />

      {/* Google Login */}
      <GoogleAuth/>
    </div>
  );
}
