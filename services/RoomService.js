const RoomModel = require("../models/RoomModel");

function createRoom() {
  const roomModel = new RoomModel();
  roomModel.roomName = "room " + Math.floor(Math.random() * 1000);
  return roomModel;
}
function joinRoomAsFirstPlayer(userModal, roomModel) { 
  roomModel.roomMember.push(userModal);
  roomModel.userX = userModal;
  roomModel.turn = userModal;
  roomModel.roomOwner = userModal;
  roomModel.status = "waiting";
  return roomModel;
}
function joinRoomAsSecondPlayer(userModal, roomModel) {
  roomModel.roomMember.push(userModal);
  roomModel.userO = userModal;
  roomModel.status = "playing";
  return roomModel;
}
module.exports = {
  createRoom,
  joinRoomAsFirstPlayer,
  joinRoomAsSecondPlayer,
};
