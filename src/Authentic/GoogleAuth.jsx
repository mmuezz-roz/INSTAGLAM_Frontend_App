

// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { GoogleLogin } from "@react-oauth/google";
// import { AuthContext } from "../context/AuthContext";

// export default function GoogleAuth() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   return (
//     <GoogleLogin
//       onSuccess={async (credentialResponse) => {
//         try {
//           const res = await api.post("/user/googlelog", {
//             token: credentialResponse.credential,
//           });

//           login(res.data.user, res.data.token);
//           navigate("/profile");
//         } catch (err) {
//           console.error("Google login failed", err);
//         }
//       }}
//       onError={() => {
//         console.log("Google Login Failed");
//       }}
//     />
//   );
// }


// import { createContext, useEffect, useState } from "react";
// import api from "../api/axios";

// export const AuthContext = createContext();

// export const GoogleAuth = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // 🔥 IMPORTANT

//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await api.get("/user/me"); // 🔐 VERIFY TOKEN
//         setUser(res.data.user);
//       } catch {
//         localStorage.clear();
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const login = (user, token) => {
//     localStorage.setItem("token", token);
//     setUser(user);
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function GoogleAuth() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const res = await api.post("/user/googlelog", {
            token: credentialResponse.credential,
          });

          login(res.data.user, res.data.token);
          navigate("/home");
        } catch (err) {
          console.error("Google login failed", err);
        }
      }}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  );
}
