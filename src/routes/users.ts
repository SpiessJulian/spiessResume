import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import SCUser from '../classes/SCUser';
const { verifyToken, verifySuperAdminRole } = require('../middlewares/auth');
const pgUsers = require('../PostgreSQL/pgUsers');
const router = Router();

router.get('/rest/getUsers', [verifyToken, verifySuperAdminRole], async (req: Request, res: Response) => {
    try {
        const dbResult: Array<SCUser> = await pgUsers.getUsers();
        if(!dbResult){
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
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
});


router.post('/rest/newUser', async (req: Request, res: Response) => {
    try {
        if(!req.body.email || req.body.email === null){
            return res.status(400).json({
                ok: false,
                msg: 'email is required'
            });
        }
    
        if(!req.body.password || req.body.password === null){
            return res.status(400).json({
                ok: false,
                msg: 'password is required'
            });
        }
        
        const userExist: boolean = await pgUsers.userExist(req.body.email);
        if(userExist){
            return res.status(400).json({
                ok: false,
                msg: 'email already exist'
            });
        }

        const user = new SCUser(0, req.body.email, 'user');
        const passwordHashed = bcrypt.hashSync(req.body.password, 10);
    
        const dbResult: boolean = await pgUsers.newUser(user, passwordHashed);
        if(!dbResult){
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
    
        return res.json({
            ok: true,
            msg: 'Success: new user created'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
});


router.put('/rest/updateUser', [verifyToken, verifySuperAdminRole], async (req: Request, res: Response) => {
    try {

        if(!req.body.id || req.body.id === null){
            return res.status(400).json({
                ok: false,
                msg: 'id is required'
            });
        }

        if(!req.body.email || req.body.email === null){
            return res.status(400).json({
                ok: false,
                msg: 'email is required'
            });
        }
    
        if(!req.body.userRole || req.body.userRole === null){
            return res.status(400).json({
                ok: false,
                msg: 'userRole is required'
            });
        }
        
        const user = new SCUser(req.body.id, req.body.email, req.body.userRole);

        const userDB = await pgUsers.getOneUser(req.body.email);
        
        if(userDB.id !== user.id){
            return res.status(400).json({
                ok: false,
                msg: 'email already exist'
            });
        }

        const dbResult: boolean = await pgUsers.updateUser(user);
        if(!dbResult){
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
    
        return res.json({
            ok: true,
            msg: 'Success: user updated'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
});


router.put('/rest/updateSelfUser', [verifyToken], async (req: any, res: Response) => {
    try {
        const loggedUser = new SCUser(req.user._id, req.user._email, req.user._userRole);

        if(!req.body.email || req.body.email === null){
            return res.status(400).json({
                ok: false,
                msg: 'email is required'
            });
        }
        
        const user = new SCUser(loggedUser.id, req.body.email, loggedUser.userRole);
        
        const userDB = await pgUsers.getOneUser(req.body.email);
        
        if(userDB.id !== user.id){
            return res.status(400).json({
                ok: false,
                msg: 'email already exist'
            });
        }

        const dbResult: boolean = await pgUsers.updateUser(user);
        if(!dbResult){
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
    
        return res.json({
            ok: true,
            msg: 'Success: user updated'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
});


router.delete('/rest/deleteUser', [verifyToken, verifySuperAdminRole], async (req: Request, res: Response) => {
    try {

        if(!req.body.id || req.body.id === null){
            return res.status(400).json({
                ok: false,
                msg: 'id is required'
            });
        }
    
        const dbResult: boolean = await pgUsers.deleteUser(req.body.id);
        if(!dbResult){
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
    
        return res.json({
            ok: true,
            msg: 'Success: user deleted'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
});


router.put('/rest/changePass', [verifyToken, verifySuperAdminRole], async (req: Request, res: Response) => {
    try {

        if(!req.body.email || req.body.email === null){
            return res.status(400).json({
                ok: false,
                msg: 'email is required'
            });
        }

        if(!req.body.oldPassword || req.body.oldPassword === null){
            return res.status(400).json({
                ok: false,
                msg: 'oldPassword is required'
            });
        }

        if(!req.body.password || req.body.password === null){
            return res.status(400).json({
                ok: false,
                msg: 'password is required'
            });
        }

        const dataResult = await pgUsers.getPassword(req.body.email);
        if (!dataResult) {
            return res.status(500).json({
                ok: false,
                message: 'Something went wrong'
                
            });
        }
        if (!bcrypt.compareSync(req.body.oldPassword, dataResult)) {
            return res.status(400).json({
                ok: false,
                message: 'old password incorrect'
                
            });
        }

        const passwordHashed = bcrypt.hashSync(req.body.password, 10);
    
        const dbResult: boolean = await pgUsers.changePassword(req.body.email, passwordHashed);
        if(!dbResult){
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
    
        return res.json({
            ok: true,
            msg: 'Success: password updated'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
});


router.put('/rest/changeSelfPass', [verifyToken], async (req: any, res: Response) => {
    try {
        const loggedUser = new SCUser(req.user._id, req.user._email, req.user._userRole);

        if(!req.body.oldPassword || req.body.oldPassword === null){
            return res.status(400).json({
                ok: false,
                msg: 'oldPassword is required'
            });
        }

        if(!req.body.password || req.body.password === null){
            return res.status(400).json({
                ok: false,
                msg: 'password is required'
            });
        }

        const dataResult = await pgUsers.getPassword(loggedUser.email);
        if (!dataResult) {
            return res.status(500).json({
                ok: false,
                message: 'Something went wrong'
                
            });
        }
        if (!bcrypt.compareSync(req.body.oldPassword, dataResult)) {
            return res.status(400).json({
                ok: false,
                message: 'old password incorrect'
                
            });
        }

        const passwordHashed = bcrypt.hashSync(req.body.password, 10);
    
        const dbResult: boolean = await pgUsers.changePassword(loggedUser.email, passwordHashed);
        if(!dbResult){
            return res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            });
        }
    
        return res.json({
            ok: true,
            msg: 'Success: password updated'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        });
    }
});


export default router;