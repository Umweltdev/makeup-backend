import { Server } from "socket.io";
import User from "../models/User.js";

let io;
const activeUsers = new Map(); // userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: true,
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("login", (userId) => {
      activeUsers.set(userId, socket.id);
      console.log("User logged in:", userId);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          break;
        } 
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

export const emitToUser = (userId, event, data) => {
  const socketId = activeUsers.get(userId.toString());
  console.log({event})
  if (socketId) getIO().to(socketId).emit(event, data);
};

// Helper to find available staff
export const findAvailableStaff = async (department) => {
  const onlineStaffIds = Array.from(activeUsers.keys());
  const onlineStaff = await User.find({
    _id: { $in: onlineStaffIds },
    role: department,
  }).limit(1);

  if (onlineStaff.length > 0) return onlineStaff[0];

  return await User.findOne({ role: department });
};