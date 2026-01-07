import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Authentic/login";
import RegisterUser from "./Authentic/Register";
import GoogleAuth from "./Authentic/Googleauth";

import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import EditProfile from "./pages/EditProfile";
import Sidebar from "./components/SideBar";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/profile" /> : <Navigate to="/login" />
          }
        />

        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/google-login" element={<GoogleAuth />} />

       
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              
              </MainLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/edit-profile" 

          element={
            <ProtectedRoute>
              <MainLayout>
                <Sidebar/>
                <EditProfile/>
              
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
