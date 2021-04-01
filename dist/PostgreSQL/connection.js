"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg = require("pg");
class Connection {
    constructor() {
        console.log('DB Inicialized');
        let cnnConfig = {
            user: 'postgres',
            host: '127.0.0.1',
            database: 'syersycallusers',
            password: 'sqlpost1234',
            port: 5432,
        };
        this.cnn = new pg.Client(cnnConfig);
        this.connectDB();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    connectDB() {
        this.cnn.connect((err) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('DB Connected');
        });
    }
}
exports.default = Connection;
