"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SCUser {
    constructor(id, email, userRole) {
        this._id = id;
        this._email = email;
        this._userRole = userRole;
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
    set userRole(userRole) {
        this._userRole = userRole;
    }
    get userRole() {
        return this._userRole;
    }
}
exports.default = SCUser;
