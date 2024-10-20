import dotenv from 'dotenv';
import http from 'http';

import Express from 'express';
import PrivateAPI from './util/PrivateAPI.js';
import PublicAPI from "./util/PublicAPI.js";
import SystemParam from './classes/SystemParam.js';

dotenv.config({ path: './.env.' + process.env.NODE_ENV });
let systemParam = await SystemParam();
let app = new Express();
let httpServer = http.createServer(app);
app.use(Express.json());
app.use('/publicAPI', PublicAPI(null, systemParam));
app.use('/privateAPI', PrivateAPI(null, systemParam));

httpServer.listen(process.env.REACT_APP_SOCKET_PORT, () => {
    console.log('Express server is running on localhost:' + process.env.REACT_APP_SOCKET_PORT);
});