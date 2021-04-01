"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const config_1 = __importDefault(require("../config/config"));
const SCUser_1 = __importDefault(require("../classes/SCUser"));
//==============================
//Verify Token
//==============================
const verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, config_1.default.seed, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.user = decoded.user;
        next();
    });
};
//==============================
//Verify Super Admin Role
//==============================
const verifySuperAdminRole = (req, res, next) => {
    let user = new SCUser_1.default(req.user._id, req.user._email, req.user._userRole);
    if (user.userRole === 'admin') {
        next();
    }
    else {
        return res.status(403).json({
            ok: false,
            message: 'User Unauthorized'
        });
    }
};
module.exports = {
    verifyToken,
    verifySuperAdminRole
};
