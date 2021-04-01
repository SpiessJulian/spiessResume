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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pgUsers = require('../PostgreSQL/pgUsers');
const router = express_1.Router();
const config_1 = __importDefault(require("../config/config"));
router.post('/rest/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = req.body;
        if (!data.email || !data.password) {
            return res.status(400).json({
                ok: false,
                message: 'email and password are required'
            });
        }
        const dataResult = yield pgUsers.getPassword(data.email);
        if (!dataResult) {
            return res.status(400).json({
                ok: false,
                message: 'User or password incorrect'
            });
        }
        if (!bcrypt_1.default.compareSync(data.password, dataResult)) {
            return res.status(400).json({
                ok: false,
                msg: 'User or password incorrect'
            });
        }
        const user = yield pgUsers.getOneUser(data.email);
        const token = jsonwebtoken_1.default.sign({
            user: user
        }, config_1.default.seed, { expiresIn: config_1.default.tokenExpires });
        return res.json({
            ok: true,
            user: user,
            token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Something went wrong'
        });
    }
}));
exports.default = router;
