


// import { createContext, useEffect, useState } from "react";
// import api from "../api/axios";
// import socket from "../Socket";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔐 VERIFY TOKEN ON APP LOAD
//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await api.get("/user/me");
//         setUser(res.data.user);
//       } catch (err) {
//         localStorage.clear();
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   // 🔌 SOCKET REGISTER
//   useEffect(() => {
//     if (user?._id) {
//       socket.emit("register", user._id);
//     }
//   }, [user]);

//   const login = (user, token) => {
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("token", token);
//     setUser(user);
//   };

//   const logout = () => {
//     socket.disconnect();
//     localStorage.clear();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../Socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Verify token on app load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
    if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/user/me");
        setUser(res.data.user);
      } catch (err) {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔌 socket register
  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }
  }, [user]);

  const login = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    socket.disconnect();
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
