import express from "express";
import mongoose from "mongoose";
import path from "path";
import { DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";
import cors from "cors";
import Emitter from "events";

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

// home route for heroku app
app.get("/", (req, res) => {
  res.send("Welcome on Fits");
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
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
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
