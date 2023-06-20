/* eslint-disable quotes */
/* eslint-disable no-var */
/* eslint-disable prettier/prettier */
const { notifyWithData } = require("./SendNotifyForResponse");

function checkValidTable(ws, defaultTable, position, n) {
  if (position.x > n || position.y > n) {
    ws.send(notifyWithData("Invalid move"));
    return false;
  }
  if (defaultTable[position.x][position.y] !== 0) {
    ws.send(notifyWithData("Invalid move"));
    return false;
  }
  
  return true;
}
module.exports = checkValidTable;
