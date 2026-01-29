// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { AuthProvider } from './context/AuthContext.jsx'
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { NotificationProvider } from './context/NotificationContext.jsx';

// createRoot(document.getElementById("root")).render(
//   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//     <AuthProvider>
//       <NotificationProvider>

//         <App />
//       </NotificationProvider>
//     </AuthProvider>
//   </GoogleOAuthProvider>
//   ,
// )

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <Toaster position="top-center" />
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
