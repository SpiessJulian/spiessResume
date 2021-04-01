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
const SCUser_1 = __importDefault(require("../classes/SCUser"));
const { verifyToken, verifySuperAdminRole } = require('../middlewares/auth');
const pgUsers = require('../PostgreSQL/pgUsers');
const router = express_1.Router();
router.get('/rest/getUsers', [verifyToken, verifySuperAdminRole], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbResult = yield pgUsers.getUsers();
        if (!dbResult) {
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
        return res.json({
            ok: true,
            msg: 'Success: getting all users',
            users: dbResult
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}));
router.post('/rest/newUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email || req.body.email === null) {
            return res.status(400).json({
                ok: false,
                msg: 'email is required'
            });
        }
        if (!req.body.password || req.body.password === null) {
            return res.status(400).json({
                ok: false,
                msg: 'password is required'
            });
        }
        const userExist = yield pgUsers.userExist(req.body.email);
        if (userExist) {
            return res.status(400).json({
                ok: false,
                msg: 'email already exist'
            });
        }
        const user = new SCUser_1.default(0, req.body.email, 'user');
        const passwordHashed = bcrypt_1.default.hashSync(req.body.password, 10);
        const dbResult = yield pgUsers.newUser(user, passwordHashed);
        if (!dbResult) {
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
        return res.json({
            ok: true,
            msg: 'Success: new user created'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}));
router.put('/rest/updateUser', [verifyToken, verifySuperAdminRole], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.id || req.body.id === null) {
            return res.status(400).json({
                ok: false,
                msg: 'id is required'
            });
        }
        if (!req.body.email || req.body.email === null) {
            return res.status(400).json({
                ok: false,
                msg: 'email is required'
            });
        }
        if (!req.body.userRole || req.body.userRole === null) {
            return res.status(400).json({
                ok: false,
                msg: 'userRole is required'
            });
        }
        const user = new SCUser_1.default(req.body.id, req.body.email, req.body.userRole);
        const userDB = yield pgUsers.getOneUser(req.body.email);
        if (userDB.id !== user.id) {
            return res.status(400).json({
                ok: false,
                msg: 'email already exist'
            });
        }
        const dbResult = yield pgUsers.updateUser(user);
        if (!dbResult) {
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
        return res.json({
            ok: true,
            msg: 'Success: user updated'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}));
router.put('/rest/updateSelfUser', [verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedUser = new SCUser_1.default(req.user._id, req.user._email, req.user._userRole);
        if (!req.body.email || req.body.email === null) {
            return res.status(400).json({
                ok: false,
                msg: 'email is required'
            });
        }
        const user = new SCUser_1.default(loggedUser.id, req.body.email, loggedUser.userRole);
        const userDB = yield pgUsers.getOneUser(req.body.email);
        if (userDB.id !== user.id) {
            return res.status(400).json({
                ok: false,
                msg: 'email already exist'
            });
        }
        const dbResult = yield pgUsers.updateUser(user);
        if (!dbResult) {
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
        return res.json({
            ok: true,
            msg: 'Success: user updated'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}));
router.delete('/rest/deleteUser', [verifyToken, verifySuperAdminRole], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.id || req.body.id === null) {
            return res.status(400).json({
                ok: false,
                msg: 'id is required'
            });
        }
        const dbResult = yield pgUsers.deleteUser(req.body.id);
        if (!dbResult) {
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
        return res.json({
            ok: true,
            msg: 'Success: user deleted'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}));
router.put('/rest/changePass', [verifyToken, verifySuperAdminRole], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email || req.body.email === null) {
            return res.status(400).json({
                ok: false,
                msg: 'email is required'
            });
        }
        if (!req.body.oldPassword || req.body.oldPassword === null) {
            return res.status(400).json({
                ok: false,
                msg: 'oldPassword is required'
            });
        }
        if (!req.body.password || req.body.password === null) {
            return res.status(400).json({
                ok: false,
                msg: 'password is required'
            });
        }
        const dataResult = yield pgUsers.getPassword(req.body.email);
        if (!dataResult) {
            return res.status(500).json({
                ok: false,
                message: 'Something went wrong'
            });
        }
        if (!bcrypt_1.default.compareSync(req.body.oldPassword, dataResult)) {
            return res.status(400).json({
                ok: false,
                message: 'old password incorrect'
            });
        }
        const passwordHashed = bcrypt_1.default.hashSync(req.body.password, 10);
        const dbResult = yield pgUsers.changePassword(req.body.email, passwordHashed);
        if (!dbResult) {
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
        return res.json({
            ok: true,
            msg: 'Success: password updated'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}));
router.put('/rest/changeSelfPass', [verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedUser = new SCUser_1.default(req.user._id, req.user._email, req.user._userRole);
        if (!req.body.oldPassword || req.body.oldPassword === null) {
            return res.status(400).json({
                ok: false,
                msg: 'oldPassword is required'
            });
        }
        if (!req.body.password || req.body.password === null) {
            return res.status(400).json({
                ok: false,
                msg: 'password is required'
            });
        }
        const dataResult = yield pgUsers.getPassword(loggedUser.email);
        if (!dataResult) {
            return res.status(500).json({
                ok: false,
                message: 'Something went wrong'
            });
        }
        if (!bcrypt_1.default.compareSync(req.body.oldPassword, dataResult)) {
            return res.status(400).json({
                ok: false,
                message: 'old password incorrect'
            });
        }
        const passwordHashed = bcrypt_1.default.hashSync(req.body.password, 10);
        const dbResult = yield pgUsers.changePassword(loggedUser.email, passwordHashed);
        if (!dbResult) {
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
        return res.json({
            ok: true,
            msg: 'Success: password updated'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
}));
exports.default = router;
