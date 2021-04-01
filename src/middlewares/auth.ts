import {Response, NextFunction} from 'express';
const jwt = require('jsonwebtoken');
import config from '../config/config';
import SCUser from '../classes/SCUser';

//==============================
//Verify Token
//==============================
const verifyToken = (req: any, res: Response, next: NextFunction) => {
    let token = req.get('Authorization');

    jwt.verify(token, config.seed, (err: Error, decoded: any) => {
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
const verifySuperAdminRole = (req: any, res: Response, next: NextFunction) => {
    let user = new SCUser(req.user._id, req.user._email, req.user._userRole);
    
    if (user.userRole === 'admin') {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            message: 'User Unauthorized'
        });
    }
};

module.exports = {
    verifyToken,
    verifySuperAdminRole
}