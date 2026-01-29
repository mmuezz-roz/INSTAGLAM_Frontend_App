
// import { createContext, useState, useEffect } from "react";
// import socket from "../Socket";


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);


// useEffect(() => {
//   if (user?._id) {
//     socket.emit("register", user._id);
//   }
// }, [user]);


//   const login = (user, token) => {
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("token", token);
//     setUser(user);
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// import { createContext, useState, useEffect } from "react";
// import { socket } from "../Socket";


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // 🔹 Load user from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // 🔹 SOCKET REGISTER
//   useEffect(() => {
//     if (user?._id) {
//       socket.connect();              // ✅ CONNECT FIRST
//       socket.emit("register", user._id);
//       console.log("🟢 Socket registered:", user._id);
//     }

//     return () => {
//       socket.disconnect();           // ✅ CLEANUP
//     };
//   }, [user]);

//   const login = (user, token) => {
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("token", token);
//     setUser(user);
//   };

//   const logout = () => {
//     socket.disconnect();             // ✅ DISCONNECT
//     localStorage.clear();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// import { createContext, useEffect, useState } from "react";
// import socket from "../socket";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // load user
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // socket register ONCE
//   useEffect(() => {
//     if (!user?._id) return;

//     socket.auth = { token: localStorage.getItem("token") };
//     socket.connect();
//     socket.emit("register", user._id);
//     console.log("🟢 Socket registered:", user._id);

//     return () => {
//       // socket.off(); // ❌ no disconnect here
//     };
//   }, [user?._id]);

//   const login = (user, token) => {
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("token", token);
//     setUser(user);
//   };

//   const logout = () => {
//     socket.disconnect();   // ✅ only here
//     localStorage.clear();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout }}>
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

  // 🔐 VERIFY TOKEN ON APP LOAD
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

  // 🔌 SOCKET REGISTER
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
