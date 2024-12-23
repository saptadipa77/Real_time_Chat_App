//node server which will handle socket ioconnections
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);

// // Use CORS middleware
// app.use(cors());

// //Create Socket.IO server with CORS options
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Replace with the client URL
//     methods: ["GET", "POST"], // Allowed HTTP methods
//     credentials: true // Allow credentials like cookies, authorization headers
//   }
// });
// server.listen(8000, () => {
//     console.log('Server is running on http://localhost:8000');
//   });

// const users={};

// io.on('connection',socket=>{               //io.on is a socket.io instance which listen multiple socket.on connections
//     socket.on('new-user-joined',name=>{        //socket.on is an instance of http which listens incoming events. it is a single connection
//      console.log("New user",name);
//       users[socket.id]=name;
//       socket.broadcast.emit('user-joined',name); //sends messages to every person in the chat that a new user has joined except the person who has newly joined
//     });

//     socket.on('send',message=>{
//         socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
//     });
// })

//const express = require('express');
import express from 'express';
//const http = require('http');
import http from 'http'
//const { Server } = require('socket.io');
import { Server } from 'socket.io';
//const cors = require('cors');
import cors from 'cors';

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Use CORS middleware
app.use(cors());

// Create Socket.IO server with CORS options
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your client URL in production (e.g., http://localhost:3000)
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true // Allow credentials like cookies, authorization headers
  }
});

// Users object to store connected users
const users = {};

// Start listening for Socket.IO connections
io.on('connection', (socket) => {
  console.log('A new user connected:', socket.id);

  // Listen for 'new-user-joined' event
  socket.on('new-user-joined', (name) => {
    console.log("New user joined:", name);

    // Map the user's socket ID to their name
    users[socket.id] = name;

    // Notify all other users that a new user has joined
    socket.broadcast.emit('user-joined', name);
  });

  // Listen for 'send' event (when a user sends a message)
  socket.on('send', (message) => {
    // const senderName = users[socket.id];
    // if (senderName) {
      // Notify all other users about the new message
      socket.broadcast.emit('receive', { message:message, name: users[socket.id] });

  });

  // Handle disconnection
  socket.on('disconnect', (message) => {
    //const disconnectedUserName = users[socket.id];
    //if (disconnectedUserName) {
      // Notify all other users that this user has left
      socket.broadcast.emit('left', users[socket.id]);

      // Remove the user from the users object
      delete users[socket.id];
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
    res.send('Server is running!');
  });
  
// Start the server on port 8000
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
