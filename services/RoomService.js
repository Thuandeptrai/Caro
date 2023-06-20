const { DEFAULT_TABLE } = require("../config/CONFIG");
const RoomModel = require("../models/RoomModel");

function createRoom() {
  const roomModel = new RoomModel();
  roomModel.roomName = "room " + Math.floor(Math.random() * 1000);
  return roomModel;
}
function joinRoom(userModal, roomModel, positionId) {
  if (positionId == 1) {
    roomModel.roomMember.push(userModal);
    roomModel.userX = userModal;
    roomModel.turn = userModal;
    roomModel.roomOwner = userModal;
    roomModel.status = "waiting";
    return roomModel;
  } else {
    roomModel.roomMember.push(userModal);
    roomModel.userO = userModal;
    roomModel.status = "playing";
    return roomModel;
  }
}
function resetRoom(roomModel) {
  roomModel.defaultTable = DEFAULT_TABLE;
  roomModel.status = "playing";
  roomModel.turn = roomModel.userX;
  roomModel.winner = null;
  roomModel.voteRestart = [];
  return roomModel;
}
function endRoom(roomModel, userModel) {
  roomModel.status = "end";
  roomModel.voteRestart = [];
  roomModel.turn = roomModel.userX;
  roomModel.winner = userModel;
  return roomModel;
}
function getRoomFromUserModel(userModel, allRoom) {
  const roomKey = allRoom.get(userModel);
  const room = allRoom.get(roomKey);
  return room;
}
module.exports = {
  createRoom,
   joinRoom,
  resetRoom,
  endRoom,
  getRoomFromUserModel,
};
