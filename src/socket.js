// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", {
//   withCredentials: true,
// });

// export default socket;


// const userSocketMap = new Map();

// export const setupSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     socket.on("register", (userId) => {
//       userSocketMap.set(userId.toString(), socket.id);
//       console.log("User registered:", userId);
//     });

//     socket.on("disconnect", () => {
//       for (const [userId, socketId] of userSocketMap.entries()) {
//         if (socketId === socket.id) {
//           userSocketMap.delete(userId);
//           break;
//         }
//       }
//       console.log("Socket disconnected:", socket.id);
//     });
//   });
// };

// export const getSocketId = (userId) => {
//   return userSocketMap.get(userId.toString());
// };


// import { io } from "socket.io-client";

//  const socket = io("http://localhost:3000", {
//   // withCredentials: true,
//   autoConnect: false, // IMPORTANT
// });


// export default socket

import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default socket;
