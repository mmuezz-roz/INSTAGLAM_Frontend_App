import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function RegisterUser() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);


  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        return value.length < 3 ? "Username must be at least 3 characters" : "";
      case "email":
        return !/^\S+@\S+\.\S+$/.test(value)
          ? "Enter a valid email address"
          : "";
      case "password":
        return value.length < 6
          ? "Password must be at least 6 characters"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const isFormValid =
    !errors.username &&
    !errors.email &&
    !errors.password &&
    formData.username &&
    formData.email &&
    formData.password;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!isFormValid) {
  //     toast.error("Please fix validation errors");
  //     return;
  //   }

  //   try {
  //     const res = await api.post("/user/register", formData);
  //     toast.success(res.data.message || "Registered successfully");
  //     navigate("/login");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Registration failed");
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isFormValid) {
    toast.error("Please fix validation errors");
    return;
  }

  try {
    const res = await api.post("/user/register", formData);

    // ✅ AUTO LOGIN AFTER REGISTER
    login(res.data.user, res.data.token);

    toast.success(res.data.message);
    navigate("/home");
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  }
};


  return (
  <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-white border rounded-sm px-8 py-10"
    >
      
      <h2 className="text-3xl font-semibold text-center mb-2">
        Instaglam
      </h2>
      <p className="text-sm text-gray-500 text-center mb-8">
        Sign up to see photos and videos from your friends.
      </p>

      
      <div className="mb-5">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 border rounded-sm text-sm
            focus:outline-none
            ${errors.username ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        )}
      </div>

      
      <div className="mb-5">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 border rounded-sm text-sm
            focus:outline-none
            ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      
      <div className="mb-6">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 border rounded-sm text-sm
            focus:outline-none
            ${errors.password ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      
      <button
        type="submit"
        disabled={!isFormValid}
        className={`w-full py-2.5 rounded-md text-sm font-medium text-white
          ${
            isFormValid
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-blue-300 cursor-not-allowed"
          }`}
      >
        Sign up
      </button>

      
      <div className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-500 font-medium hover:underline"
        >
          Log in
        </button>
      </div>
    </form>
  </div>
);

}

export default RegisterUser;