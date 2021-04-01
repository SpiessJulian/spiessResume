"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./connection"));
const SCUser_1 = __importDefault(require("../classes/SCUser"));
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM SCUser WHERE deleted = False;';
        const res = yield connection_1.default.instance.cnn.query(query);
        let users = new Array();
        for (const eachRow of res.rows) {
            users.push(new SCUser_1.default(eachRow.id, eachRow.email, eachRow.userrole));
        }
        return users;
    }
    catch (error) {
        console.error(error);
    }
});
const getOneUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM SCUser WHERE deleted = False AND email = $1;';
        const values = [email];
        const res = yield connection_1.default.instance.cnn.query(query, values);
        const firstRow = res.rows[0];
        const user = new SCUser_1.default(firstRow.id, firstRow.email, firstRow.userrole);
        return user;
    }
    catch (error) {
        console.error(error);
    }
});
const newUser = (user, pass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'INSERT INTO SCUser(email, pass, userRole) VALUES ($1, $2, $3);';
        const values = [user.email, pass, user.userRole];
        const res = yield connection_1.default.instance.cnn.query(query, values);
        return true;
    }
    catch (error) {
        console.error(error);
    }
});
const updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE SCUser SET email = $2, userRole = $3 WHERE id = $1;';
        const values = [user.id, user.email, user.userRole];
        const res = yield connection_1.default.instance.cnn.query(query, values);
        return true;
    }
    catch (error) {
        console.error(error);
    }
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE SCUser SET deleted = True WHERE id = $1;';
        const values = [id];
        const res = yield connection_1.default.instance.cnn.query(query, values);
        return true;
    }
    catch (error) {
        console.error(error);
    }
});
const getPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT pass FROM SCUser WHERE email = $1;';
        const values = [email];
        const res = yield connection_1.default.instance.cnn.query(query, values);
        return res.rows[0].pass;
    }
    catch (error) {
        console.error(error);
    }
});
const changePassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE SCUser SET pass = $2 WHERE email = $1;';
        const values = [email, newPassword];
        const res = yield connection_1.default.instance.cnn.query(query, values);
        return true;
    }
    catch (error) {
        console.error(error);
    }
});
const userExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT email FROM SCUser WHERE email = $1;';
        const values = [email];
        const res = yield connection_1.default.instance.cnn.query(query, values);
        if (res.rows.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.error(error);
    }
});
module.exports = {
    getUsers,
    getOneUser,
    newUser,
    updateUser,
    deleteUser,
    getPassword,
    changePassword,
    userExist
};
