const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const { DB_URL } = require("./config");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const cors = require("cors");
const Emitter = require("events");

const APP_PORT = process.env.PORT || 5000;

// App Config
const app = express();

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
  res.send("Welcome Adwoa Linda Api");
});

// App Listener
const server = app.listen(APP_PORT, () => {
  console.log(`Listening on port ${APP_PORT}`);
});
