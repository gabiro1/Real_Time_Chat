import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import {connectDB} from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';


// Load environment variables
dotenv.config();

// create express app
const app = express();
const server = http.createServer(app);

// initiation of socket.io
export const io = new Server(server, {
    cors:{origin: "*"}
});



export const userSocketMap = {};

// socket.io connection
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);

    if (userId) userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// middleware
app.use(cors());
app.use(express.json({limit: '10mb'}));

// routes setups
app.use("/api/status", (req, res) => { res.send("Server is running");});
app.use('/api/auth', userRouter); 
app.use('/api/messages', messageRouter);

//connect to database
await connectDB();

console.log("Cloudinary ENV:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.Cloudinary_API_KEY,
  api_secret: process.env.Cloudinary_API_SECRET,
});

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});