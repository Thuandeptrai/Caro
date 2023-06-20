const uuid = require("uuid");

class UserModel {
  constructor(name, email, age, password, ws) {
    (this._name = name);
    (this._email = email);
    (this._age = age);
    (this._userId = uuid.v4());
    (this._password = password);
    (this._ws = ws);
  }
  get userId() {
    return this._userId;
  }
  set userId(value) {
    this._userId = value;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get email() {
    return this._email;
  }
  set email(value) {
    this._email = value;
  }
  get age() {
    return this._age;
  }
  set age(value) {
    this._age = value;
  }
  get password() {
    return this._password;
  }
  set password(value) {
    this._password = value;
  }
  get ws() {
    return this._ws;
  }
  set ws(value) {
    this._ws = value;
  }
}
module.exports = UserModel;
