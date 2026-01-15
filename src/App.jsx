// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./Authentic/login";
// import RegisterUser from "./Authentic/Register";
// import GoogleAuth from "./Authentic/Googleauth";

// import Profile from "./pages/Profile";

// import ProtectedRoute from "./components/ProtectedRoute";
// import MainLayout from "./components/MainLayout";
// import EditProfile from "./pages/EditProfile";

// import Search from "./pages/Search";
// import Sidebar from "./components/Sidebar";

// export default function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             token ? <Navigate to="/profile" /> : <Navigate to="/login" />
//           }
//         />

        
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<RegisterUser />} />
//         <Route path="/google-login" element={<GoogleAuth />} />

       
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <MainLayout>
//                 <Profile />
              
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />
//          <Route
//           path="/edit-profile" 

//           element={
//             <ProtectedRoute>
//               <MainLayout>
//                 <Sidebar/>
//                 <EditProfile/>
              
//               </MainLayout>
//             </ProtectedRoute>
//           }
//         />

//         <Route path="/search" element={<Search/>} />


//       </Routes>
//     </BrowserRouter>
//   );
// }


// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./Authentic/Login";
// import RegisterUser from "./Authentic/Register";


// import Profile from "./pages/Profile";
// import EditProfile from "./pages/EditProfile";
// import Search from "./pages/Search";

// import ProtectedRoute from "./components/ProtectedRoute";
// import MainLayout from "./components/MainLayout";
// import GoogleAuth from "./Authentic/Googleauth";

// export default function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Redirect root */}
//         <Route
//           path="/"
//           element={token ? <Navigate to="/profile" /> : <Navigate to="/login" />}
//         />

//         {/* ❌ NO SIDEBAR */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<RegisterUser />} />
//         <Route path="/google-login" element={<GoogleAuth />} />

//         {/* ✅ PROTECTED + SIDEBAR */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<MainLayout />}>
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/edit-profile" element={<EditProfile />} />
//             <Route path="/search" element={<Search />} />
//           </Route>
//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// }


// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./Authentic/login";
// import RegisterUser from "./Authentic/Register";
// import GoogleAuth from "./Authentic/Googleauth";

// import Profile from "./pages/Profile";
// import EditProfile from "./pages/EditProfile";
// import Search from "./pages/Search";

// import ProtectedRoute from "./components/ProtectedRoute";
// import MainLayout from "./components/MainLayout";
// import UserProfile from "./pages/UserProfile";
// import Notifications from "./pages/Notifications";

// export default function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Root redirect */}
//         <Route
//           path="/"
//           element={token ? <Navigate to="/profile" /> : <Navigate to="/login" />}
//         />

//         {/* Auth pages (NO SIDEBAR) */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<RegisterUser />} />
//         <Route path="/google-login" element={<GoogleAuth />} />

//         {/* Protected + Sidebar */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<MainLayout />}>
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/edit-profile" element={<EditProfile />} />
//             <Route path="/search" element={<Search />} />
//             <Route path="/user/:userId" element={<UserProfile />} />
//             <Route path="/notifications"element={<Notifications />}
// />

//           </Route>
//   {/* <Route
//   path="/notifications"
//   element={
//     <ProtectedRoute>
//       <MainLayout>
//         <Notifications />
//       </MainLayout>
//     </ProtectedRoute>
//   }
// /> */}


//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

import Login from "./Authentic/login";
import RegisterUser from "./Authentic/Register";
import GoogleAuth from "./Authentic/Googleauth";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Search from "./pages/Search";
// import Notifications from "./pages/Notifications";
import UserProfile from "./pages/UserProfile";
import CreatePost from "./components/CreatePost";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/google-login" element={<GoogleAuth />} />

        {/* 🔐 PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

          <Route path="/home" element={<Home />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/create" element={<CreatePost />} />

          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}
