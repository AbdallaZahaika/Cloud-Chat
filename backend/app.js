const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const mongodb = require("./db/mongoConnect");
const socket = require("socket.io");
const socketEvents = require("./socketEvents");
const { secret } = require("./config/secret");
const { fileUploadAccess, routersInit } = require("./routes/app_routers");
app.use(
  cors({
    origin: secret.CLIENT_URL,
  })
);

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

fileUploadAccess(app);

routersInit(app);

const port = 3001;

const server = http.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

const io = socket(server);
socketEvents(io);
