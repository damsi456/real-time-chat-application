import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express(); // the express app
const server = http.createServer(app);  // Wrap express app in HTTP server

const io = new Server(server, { // Attach Socket.IO to HTTP server 
    cors: {
        origin: ["http://localhost:5173"]
    }
});

export const getReceiverScoketId = (userId) => {
    return userScoketMap[userId];
}

// For online users
const userScoketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);
     
    const userId = socket.handshake.query.userId;
    if(userId) userScoketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userScoketMap));

    socket.on("disconnect", () => {
        console.log("A user diconnected: ", socket.id);
        delete userScoketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userScoketMap));
    })
})

export { io, app, server };