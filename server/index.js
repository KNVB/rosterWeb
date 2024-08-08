import dotenv from 'dotenv';
import http from 'http';
import path from "path";
import { fileURLToPath } from 'url';
import AdminUtil from "./util/AdminUtil.js";
import Express from 'express';
import PublicAPI from "./util/PublicAPI.js";
import SystemParam from './util/SystemParam.js';
let systemParam = new SystemParam();
dotenv.config({ path: './.env.' + process.env.NODE_ENV });
let app = new Express();
let httpServer = http.createServer(app);
let adminUtil = new AdminUtil(process.env.SESSION_TIMEOUT);

app.use(Express.json());
app.use('/publicAPI', PublicAPI(adminUtil, systemParam));
httpServer.listen(process.env.REACT_APP_SOCKET_PORT, () => {
    console.log('Express server is running on localhost:' + process.env.REACT_APP_SOCKET_PORT);
});