const { DEFAULT_TABLE } = require("../config/CONFIG");

class RoomModel {
  constructor() {
      (this._roomOwner = ""),
      (this._roomMember = []),
      (this._userX = ""),
      (this._turn = ""),
      (this._userO = ""),
      (this._defaultTable = DEFAULT_TABLE),
      (this._voteRestart = []),
      (this._status = "waiting");
      (this._winner = "");
      (this._roomName = "");
  }
  // Appying Getter Setter
  get roomName() {
    return this._roomName;
  }
  get winner() {
    return this._winner;
  }
  set winner(value) {
    this._winner = value;
  }
  set roomName(value) {
    this._roomName = value;
  }
  get roomOwner() {
    return this._roomOwner;
  }
  set userO(value) {
    this._userO = value;
  }
  get userO() {
    return this._userO;
  }
  set roomOwner(value) {
    this._roomOwner = value;
  }
  get roomMember() {
    return this._roomMember;
  }
  set roomMember(value) {
    this._roomMember = value;
  }
  get userX() {
    return this._userX;
  }
  set userX(value) {
    this._userX = value;
  }
  get turn() {
    return this._turn;
  }
  set turn(value) {
    this._turn = value;
  }
  get defaultTable() {
    return this._defaultTable;
  }
  set defaultTable(value) {
    this._defaultTable = value;
  }
  get voteRestart() {
    return this._voteRestart;
  }
  set voteRestart(value) {
    this._voteRestart = value;
  }
  get status() {
    return this._status;
  }
  set status(value) {
    this._status = value;
  }
}
module.exports = RoomModel;
