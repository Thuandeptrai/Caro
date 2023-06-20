const { wsWithStatusAndData } = require("../utils/SendResponse");

function sendSocketFromRoomMember(roomMember, status, data) {
  roomMember.forEach((userModel) => {
    userModel.ws.send(wsWithStatusAndData(status, data));
  });
}
module.exports = {
  sendSocketFromRoomMember,
};
