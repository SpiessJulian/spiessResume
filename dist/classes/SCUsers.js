"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SCUsers {
    constructor(id, email, userRol) {
        this._id = id;
        this._email = email;
        this._userRol = userRol;
    }
    set id(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    set email(email) {
        this._email = email;
    }
    get email() {
        return this._email;
    }
    set userRol(userRol) {
        this._userRol = userRol;
    }
    get userRol() {
        return this._userRol;
    }
}
exports.default = SCUsers;
