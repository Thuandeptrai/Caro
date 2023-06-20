const uuid = require("uuid");
const {
  sendNotifyForLogin: sendNotifyForAddToRoom,
} = require("../handler/SendNotifyForResponse");
const checkValidTable = require("../handler/CheckValidTable");
const { checkWin, checkCanPlay } = require("../helper/CheckTable");
const { wsWithStatusAndData } = require("../utils/SendResponse");
const { DEFAULT_TABLE, TABLE_SIZE } = require("../config/CONFIG");
const {
  createRoom,
  joinRoomAsFirstPlayer,
  resetRoom,
  endRoom,
} = require("../services/roomService");
const { sendSocketFromRoomMember } = require("../services/SocketService");
// store _allRoom In map
class RoomController {
  constructor() {
    this._allRoom = new Map();
    this._wsContain = new Map();
    this._roomFree = [];
  }
  async createRoom(userModal, ws) {
    // Applying SOLID
    const keysArray = [...this._allRoom.keys()];
    const lastKey = keysArray[keysArray.length - 1];
    if (
      this._allRoom.size === 0 ||
      this._allRoom.get(lastKey)?.roomMember?.length == 2
    ) {
      const mapKey = uuid.v4();
      const createRoomForUser = createRoom(userModal);
      const JoinRoom = joinRoomAsFirstPlayer(userModal, createRoomForUser, 1);
      this._allRoom.set(mapKey, JoinRoom);
      this._wsContain.set(ws, mapKey);
      ws.send(sendNotifyForAddToRoom(this._allRoom.get(mapKey), userModal));
    } else {
      let position = lastKey;
      if (this._roomFree.length > 0) {
        position = this._roomFree[0];
        this._roomFree.shift();
      }
      const getRoomObj = this._allRoom.get(position);
      const finalObj = joinRoomAsFirstPlayer(userModal, getRoomObj, 2);
      this._allRoom.set(position, finalObj);
      ws.send(sendNotifyForAddToRoom(this._allRoom.get(lastKey), userModal));
      this._wsContain.set(ws, position);
      sendSocketFromRoomMember(finalObj.roomMember, "start", `The room ${finalObj.roomName} is ready to play`);
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
      room = endRoom(room);
      sendSocketFromRoomMember(room.roomMember, "end", {
        winner: userModel.userId,
      });
    } else {
      sendSocketFromRoomMember(room.roomMember, "play", {
        defaultTable: room.defaultTable,
        turn: room.turn.userId,
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
        room = resetRoom(room);
        sendSocketFromRoomMember(room.roomMember, "restart", {
          defaultTable: room.defaultTable,
          turn: room.turn.userId,
        });
      } else {
        sendSocketFromRoomMember(room.roomMember, "vote", {
          message: "You voted",
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

    sendSocketFromRoomMember(room.roomMember, "chat", {
      message,
      userId: userModal.userId,
    });
  }
}
module.exports = new RoomController();
