import pg = require('pg');

export default class Connection {
    private static _instance: Connection;
    cnn: pg.Client;

    constructor(){
        console.log('DB Inicialized');
        let cnnConfig = {
            user: 'postgres',
            host: '127.0.0.1',
            database: 'syersycallusers',
            password: 'sqlpost1234',
            port: 5432,
        }
        this.cnn = new pg.Client(cnnConfig);
        this.connectDB();
    }

    public static get instance(){
        return this._instance || ( this._instance = new this() );
    }

    private connectDB(){
        this.cnn.connect((err) =>{
            if(err){
                console.error(err.message);
                return;
            }
            console.log('DB Connected');
        });
    }
}