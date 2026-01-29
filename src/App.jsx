import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

// import Login from "./Authentic/Login";
import RegisterUser from "./Authentic/Register";
import Login from "./Authentic/login";
// import { GoogleAuth } from "./Authentic/Googleauth";
// import GoogleAuth from "./Authentic/GoogleAuth";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";
import CreatePost from "./components/CreatePost";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";
import MessagesPage from "./pages/MessagePage";
import GoogleAuth from "./Authentic/Googleauth";

/* 🚪 AUTH GUARD FOR LOGIN/REGISTER */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "null" && token !== "undefined";
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌎 PUBLIC ROUTES (Redirect to home if logged in) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterUser /></PublicRoute>} />
        <Route path="/google-login" element={<GoogleAuth />} />

        {/*  PROTECTED ROUTES (Redirect to login if not logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/messages" element={<MessagesPage />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
