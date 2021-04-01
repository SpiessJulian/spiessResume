import pg from 'pg';
import Connection from './connection';
import SCUser from '../classes/SCUser';

const getUsers = async () => {
    try {
        const query: string = 'SELECT * FROM SCUser WHERE deleted = False;';
        const res: pg.QueryResult = await Connection.instance.cnn.query(query);

        let users: Array<SCUser> = new Array<SCUser>();
        for(const eachRow of res.rows){
            users.push(new SCUser(eachRow.id, eachRow.email, eachRow.userrole));
        }

        return users;
    } catch (error) {
        console.error(error);
    }
}

const getOneUser = async (email: string) => {
    try {
        const query: string = 'SELECT * FROM SCUser WHERE deleted = False AND email = $1;';
        const values = [email];
        const res: pg.QueryResult = await Connection.instance.cnn.query(query, values);

        const firstRow = res.rows[0];
        const user = new SCUser(firstRow.id, firstRow.email, firstRow.userrole);
        return user;
    } catch (error) {
        console.error(error);
    }
}

const newUser = async (user: SCUser, pass: string) => {
    try {
        const query: string = 'INSERT INTO SCUser(email, pass, userRole) VALUES ($1, $2, $3);';
        const values = [user.email, pass, user.userRole]
        const res: pg.QueryResult = await Connection.instance.cnn.query(query, values);

        return true;
    } catch (error) {
        console.error(error);
    }
}

const updateUser = async (user: SCUser) => {
    try {
        const query: string = 'UPDATE SCUser SET email = $2, userRole = $3 WHERE id = $1;';
        const values = [user.id, user.email, user.userRole]
        const res: pg.QueryResult = await Connection.instance.cnn.query(query, values);

        return true;
    } catch (error) {
        console.error(error);
    }
}

const deleteUser = async (id: number) => {
    try {
        const query: string = 'UPDATE SCUser SET deleted = True WHERE id = $1;';
        const values = [id]
        const res: pg.QueryResult = await Connection.instance.cnn.query(query, values);

        return true;
    } catch (error) {
        console.error(error);
    }
}

const getPassword = async (email: number) => {
    try {
        const query: string = 'SELECT pass FROM SCUser WHERE email = $1;';
        const values = [email]
        const res: pg.QueryResult = await Connection.instance.cnn.query(query, values);
        return res.rows[0].pass;
    } catch (error) {
        console.error(error);
    }
}

const changePassword = async (email: string, newPassword: string) => {
    try {
        const query: string = 'UPDATE SCUser SET pass = $2 WHERE email = $1;';
        const values = [email, newPassword]
        const res: pg.QueryResult = await Connection.instance.cnn.query(query, values);

        return true;
    } catch (error) {
        console.error(error);
    }
}

const userExist = async (email: number) => {
    try {
        const query: string = 'SELECT email FROM SCUser WHERE email = $1;';
        const values = [email]
        const res: pg.QueryResult = await Connection.instance.cnn.query(query, values);
        if(res.rows.length > 0){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getUsers,
    getOneUser,
    newUser,
    updateUser,
    deleteUser,
    getPassword,
    changePassword,
    userExist
}