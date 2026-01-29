// import { Navigate, Outlet } from "react-router-dom";

// export default function ProtectedRoute() {
//   const token = localStorage.getItem("token");

//   // Strict check: must exist and not be string "null"/"undefined"
//   const isAuthenticated = token && token !== "null" && token !== "undefined";

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// }

// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }


import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; 

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
