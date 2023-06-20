const uuid = require("uuid");
const { sendNotifyForLogin } = require("../handler/SendNotifyForResponse");
const checkValidTable = require("../handler/CheckValidTable");
const { checkWin, checkCanPlay } = require("../helper/CheckTable");
const { wsWithStatusAndData } = require("../utils/SendResponse");
const { DEFAULT_TABLE, TABLE_SIZE } = require("../config/CONFIG");
const {
  createRoom,
  joinRoomAsFirstPlayer,
  joinRoomAsSecondPlayer,
} = require("../services/roomService");
// store _allRoom In map
class RoomController {
  constructor() {
    this._allRoom = new Map();
    this._wsContain = new Map();
    this._roomFree = [];
  }
  async createRoom(userModal, ws) {
    const keysArray = [...this._allRoom.keys()];
    const lastKey = keysArray[keysArray.length - 1];

    if (
      this._allRoom.size === 0 ||
      this._allRoom.get(lastKey)?.roomMember?.length == 2
    ) {
      const mapKey = uuid.v4();
      const createRoomForUser = createRoom(userModal);
      const JoinRoom = joinRoomAsFirstPlayer(userModal, createRoomForUser);
      this._allRoom.set(mapKey, JoinRoom);
      this._wsContain.set(ws, mapKey);
      ws.send(sendNotifyForLogin(this._allRoom.get(mapKey), userModal));
    } else {
      let position = lastKey;
      if (this._roomFree.length > 0) {
        position = this._roomFree[0];
        this._roomFree.shift();
      }
      const getRoomObj = this._allRoom.get(position);
      const finalObj = joinRoomAsSecondPlayer(userModal, getRoomObj);
      this._allRoom.set(position, finalObj);
      ws.send(sendNotifyForLogin(this._allRoom.get(lastKey), userModal));
      this._wsContain.set(ws, position);
      this._allRoom.get(lastKey).roomMember.forEach((userModal) => {
        userModal.ws.send(wsWithStatusAndData("status", "playing"));
      });
    }
    // Appying Singleton
  }
  async leaveRoom(ws) {
    const roomKey = this._wsContain.get(ws);
    const room = this._allRoom.get(roomKey);
    const position = room?.roomMember?.indexOf(ws);
    room.roomMember?.splice(position, 1);
    if (room.roomMember?.length === 0) {
      this._allRoom?.delete(roomKey);
      this._roomFree?.slice(this._roomFree.indexOf(roomKey), 1);
    } else {
      this._allRoom.set(roomKey, room);
      this._roomFree.push(roomKey);
    }
  }
  async playChess(ws, position, userModel) {
    const roomKey = this._wsContain.get(ws);
    const room = this._allRoom.get(roomKey);
    if (!checkCanPlay(room, userModel, ws, "You can't play now")) {
      return;
    }
    const { defaultTable } = room;
    if (!checkValidTable(ws, defaultTable, position, TABLE_SIZE - 1)) {
      return;
    }
    defaultTable[position.x][position.y] = userModel.userId;
    room.turn = userModel === room.userX ? room.userO : room.userX;
    room.defaultTable = defaultTable;

    if (checkWin(defaultTable, userModel.userId, TABLE_SIZE)) {
      room.status = "end";
      room.voteRestart = [];
      room.turn = room.userX;
      room.winner = userModel;
      room.roomMember.forEach((userModal) => {
        userModal.ws.send(
          wsWithStatusAndData("end", {
            winner: userModal.userId === userModel.userId ? "you" : "opponent",
          })
        );
      });
    } else {
      room.roomMember.forEach((userModal) => {
        userModal.ws.send(
          wsWithStatusAndData("play", {
            defaultTable: room.defaultTable,
            turn: room.turn.userId,
          })
        );
      });
    }
    this._allRoom.set(roomKey, room);
  }
  async voteRestart(ws, userModel) {
    const roomKey = this._wsContain.get(ws);
    const room = this._allRoom.get(roomKey);
    if (!checkCanPlay(room, userModel, ws, "You can't vote now")) {
      return;
    }
    if (room.voteRestart.includes(userModel)) {
      ws.send(
        wsWithStatusAndData("notify", {
          message: "You voted",
        })
      );
      return;
    } else {
      room.voteRestart.push(userModel);
      if (room.voteRestart.length === 2) {
        room.defaultTable = DEFAULT_TABLE;
        room.status = "playing";
        room.turn = room.userX;
        room.winner = null;
        room.voteRestart = [];
        room.roomMember.forEach((userModel) => {
          userModel.ws.send(
            wsWithStatusAndData("restart", {
              defaultTable: room.defaultTable,
              turn: room.turn.userId,
            })
          );
        });
      } else {
        room.roomMember.forEach((userModel) => {
          userModel.ws.send(
            wsWithStatusAndData("vote", {
              message: "You voted",
            })
          );
        });
      }
    }
  }
  async chatRoom(ws, message, userModal) {
    const roomKey = this._wsContain.get(ws);
    const room = this._allRoom.get(roomKey);
    if (!checkCanPlay(room, userModel, ws, "You can't chat now")) {
      return;
    }

    room.roomMember.forEach((userModel) => {
      userModel.ws.send(
        wsWithStatusAndData("chat", {
          message,
          userId: userModal.userId,
        })
      );
    });
  }
 
}
module.exports = new RoomController();
