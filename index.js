const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sql = require("mssql");
const uuid = require("uuid");
const UserModel = require("./models/UserModel");
const bcryptjs = require("bcryptjs");
const AuthController = require("./controller/AuthController");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const RoomController = require("./controller/RoomController");
const { notifyWithData } = require("./handler/SendNotifyForResponse");
const { SQLCONFIG } = require("./config/CONFIG");
const UserController = require("./controller/UserController");
const { wsWithStatusAndData } = require("./utils/SendResponse");
const { isJson } = require("./utils/checkValidJSON");
const app = express();
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", function (ws) {
  const newAuthClass = new AuthController(ws, SQLCONFIG, sql, bcryptjs);
  ws.on("message", async function (message) {
    // Check is valid JSON
    if (!isJson(message)) {
      ws.send(wsWithStatusAndData("notify", "Invalid JSON"));
      ws.close();
      return;
    }
    const parseMessage = JSON.parse(message);
    switch (parseMessage.type) {
      case "login": {
        try {
          const { email } = parseMessage.data;
          if (!UserController.checkValidLoginByEmail(email)) {
            notifyWithData("You are already login ");
            return;
          }
          const data = await newAuthClass.login(parseMessage.data);
          if (!data) {
            ws.close();
            return;
          }
          const userModel = new UserModel(
            data.name,
            data.email,
            data.age,
            data.password,
            ws
          );

          UserController.addNewUser(ws, userModel);
          RoomController.createRoom(userModel, ws);
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "register": {
        try {
          await newAuthClass.signUp(parseMessage.data);
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "play": {
        try {
          const { position } = parseMessage.data;
          const userModal = UserController.getUserByWs(ws);
          await RoomController.playChess(ws, position, userModal);
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "voteRestart": {
        try {
          const userModal = UserController.getUserByWs(ws);
          await RoomController.voteRestart(ws, userModal);
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "chat": {
        try {
          const { message } = parseMessage.data;
          const userModal = UserController.getUserByWs(ws);
          await RoomController.chatRoom(ws, message, userModal);
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
  ws.on("error", console.error);

  ws.on("close", function () {
    // Remove
    const userModel = UserController.getUserByWs(ws);
    if (userModel) {
      RoomController.leaveRoom(userModel);
      UserController.removeUser(ws);
    }
  });
});

server.listen(8080, function () {
  console.log("Listening on http://localhost:8080");
});
