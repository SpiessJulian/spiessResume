import Server from './server/server';
import bodyParser = require('body-parser');
import cors = require('cors');
import loginRouter from './routes/login';
import usersRouter from './routes/users';
import * as dotenv from 'dotenv';
dotenv.config();
import config from './config/config';

const server = Server.init(config.port);

server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());
server.app.use(cors());

server.app.use(loginRouter);
server.app.use(usersRouter);

server.start( () => {
    console.log(`Server running on port ${server.port}`);
});