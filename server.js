// import { DB_URL, FIREBASE_TOKEN } from "./config";

// import mongoose from "mongoose";
const mongoose = require("mongoose");
// import express from "express";
const express = require("express");
// import path from "path";
const path = require("path");
// import { DB_URL } from "./config";
const { DB_URL } = require("./config");
// import errorHandler from "./middlewares/errorHandler";
const errorHandler = require("./middlewares/errorHandler");

// import routes from "./routes";
const routes = require("./routes");
// import cors from "cors";
const cors = require("cors");

// import Emitter from "events";
const Emitter = require("events");
// import FirebaseService from "./services/FirebaseService";
const FirebaseService = require("./services/FirebaseService");

// import admin from "firebase-admin";
// import serviceAccount from "./food-app-69e18-firebase-adminsdk-24cyc-46dcb2530f.json";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })

// admin.messaging().send({
//   token: FIREBASE_TOKEN,
//   data:{
//     customData: "Wegoz",
//     id: '1',
//     ad: "Nouman"
//   },
//   android: {
//     notification: {
//       body: "Welcome to Wegoz!",
//       title: "Wegoz Title",
//       color: '#ffffff',
//       priority: 'high',
//       sound: 'default',
//       vibrateTimingsMillis: [200, 500, 800]
//     }
//   }
// }).then((msg)=>{
//   console.log("msg", msg)
// })

// FirebaseService.trigger()

const APP_PORT = process.env.PORT || 5000;

// App Config
const app = express();
// const http = require("http").Server(app);

// Event Emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

// Middleware
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Headers", "X-Requested-Width");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

// DB Config
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected...");
});

app.get("/", (req, res) => {
  res.send("Welcome food server");
});

// App Listener
const server = app.listen(APP_PORT, () => {
  console.log(`Listening on port ${APP_PORT}`);
});

// Socket Connection
// const io = require("socket.io")(server);
// const { Server } = require("socket.io");
// chat config
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

const io = require("socket.io")(server);

// const io = ioSocket(server);
// io.on("connection", (socket) => {
//   //Join
//   socket.on("join", (orderId) => {
//     socket.join(orderId);
//   });
// });

io.on("connection", (socket) => {
  console.log("a user connected: D");
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log("mesage", data);
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("update_status", (socket) => {
    console.log("mesage", socket);
    io.emit("update_status");
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  socket.on("reconnect", (data) => {
    socket.emit("join_room", data);
  });
});

// this is for update order status in customer side
eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

// this is for orderPlaced in admin side
// eventEmitter.on('orderPlaced', (data) => {
//     io.to('adminRoom').emit('orderPlaced', data)
// })
