/* eslint-disable quotes */
/* eslint-disable no-var */
/* eslint-disable prettier/prettier */

const { wsWithStatusAndData } = require("../utils/SendResponse");

function checkWin(createArrayCaroNxN,userDefault ,n) {
  // Check rows
  for(let i = 0; i < n; i++){
    let count = 0;
    for(let j = 0; j < n; j++){
      if(createArrayCaroNxN[i][j] === userDefault){
        count++;
      }else{
        count = 0;
      }
      if(count === 5){
        return true;
      }
    }
  }
  // Check columns
  for(let i = 0; i < n; i++){
    let count = 0;
    for(let j = 0; j < n; j++){
      if(createArrayCaroNxN[j][i] === userDefault){
        count++;
      }else{
        count = 0;
      }
      if(count === 5){
        return true;
      }
    }
  }
  // Check diagonal
  for(let i = 0; i < n; i++){
    let count = 0;
    for(let j = 0; j < n; j++){
      if(createArrayCaroNxN[i][j] === userDefault){
        count++;
      }else{
        count = 0;
      }
      if(count === 5){
        return true;
      }
    }
  }
  // Check diagonal
  for(let i = 0; i < n; i++){
    let count = 0;
    for(let j = 0; j < n; j++){
      if(createArrayCaroNxN[j][i] === userDefault){
        count++;
      }else{
        count = 0;
      }
      if(count === 5){
        return true;
      }
    }
  }

}
function checkCanPlay(room, userModel, ws,msg) {
    if(!room ||
      room.status === "waiting" ||
      room.turn !== userModel ||
      room.status === "end")
      {
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
  checkCanPlay
};