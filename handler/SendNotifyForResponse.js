function sendNotifyForLogin(allRoom, userObj) {
  return JSON.stringify({
    type: "notify",
    data: `You has been add to ${allRoom.roomName}`,
    userKey: userObj.v4Id,
    currentUser: userObj.userId,
  });
}

function notifyWithData(data) {
  return JSON.stringify({
    type: "notify",
    data: data,
  });
}
function checkValidTable(ws, defaultTable, position) {
  if (defaultTable[position.x][position.y] !== 0) {
    ws.send(notifyWithData("Position is not valid"));
    return false;
    
  }
  if (position.x > 4 || position.y > 4) {
    ws.send(notifyWithData("Position is not valid"));
    return false; 
  }
  return true;
}
module.exports = {
  sendNotifyForLogin,
  notifyWithData,
  checkValidTable,
};