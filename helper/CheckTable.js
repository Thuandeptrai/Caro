/* eslint-disable quotes */
/* eslint-disable no-var */
/* eslint-disable prettier/prettier */

const { wsWithStatusAndData } = require("../utils/SendResponse");

function checkWin(createArrayCaro, userDefault, n) {
  // Check rows
  for (let row = 0; row < n; row++) {
    let count = 0;
    for (let col = 0; col < n; col++) {
      if (createArrayCaro[row][col] === userDefault) {
        count++;
      } else {
        count = 0;
      }
      if (count === 5) {
        return true;
      }
    }
  }
  // Check columns
  for (let row = 0; row < n; row++) {
    let count = 0;
    for (let col = 0; col < n; col++) {
      if (createArrayCaro[col][row] === userDefault) {
        count++;
      } else {
        count = 0;
      }
      if (count === 5) {
        return true;
      }
    }
  }
  // Check diagonal
  for (let row = 0; row < n; row++) {
    let count = 0;
    for (let col = 0; col < n; col++) {
      if (createArrayCaro[row][col] === userDefault) {
        count++;
      } else {
        count = 0;
      }
      if (count === 5) {
        return true;
      }
    }
  }
  // Check diagonal
  for (let row = 0; row < n; row++) {
    let count = 0;
    for (let col = 0; col < n; col++) {
      if (createArrayCaro[col][row] === userDefault) {
        count++;
      } else {
        count = 0;
      }
      if (count === 5) {
        return true;
      }
    }
  }
}
function checkCanPlay(room, userModel, ws, msg) {
  if (
    !room ||
    room.status === "waiting" ||
    room.turn !== userModel ||
    room.status === "end" 
  ) {
    ws.send(
      wsWithStatusAndData("notify", {
        message: msg,
      })
    );
    return false;
  }
  return true;
}
module.exports = {
  checkWin,
  checkCanPlay,
};
