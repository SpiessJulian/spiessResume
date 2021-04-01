import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const pgUsers = require('../PostgreSQL/pgUsers');
const router = Router();
import config from '../config/config';

router.post('/rest/login', async (req: Request, res: Response) => {
    try {
        let data = req.body;
        if(!data.email || !data.password){
            return res.status(400).json({
                ok: false,
                message: 'email and password are required'
            });
        }

        const dataResult = await pgUsers.getPassword(data.email);
        if (!dataResult) {
            return res.status(400).json({
                ok: false,
                message: 'User or password incorrect'
                
            });
        }
        if (!bcrypt.compareSync(data.password, dataResult)) {
            return res.status(400).json({
                ok: false,
                msg: 'User or password incorrect'
                
            });
        }
        
        const user = await pgUsers.getOneUser(data.email);

        const token = jwt.sign({
            user: user
        }, config.seed, { expiresIn: config.tokenExpires });

        return res.json({
            ok: true,
            user: user,
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Something went wrong'
        });
    }
});

export default router;


