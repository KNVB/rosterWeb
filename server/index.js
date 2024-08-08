import dotenv from 'dotenv';
import http from 'http';
import path from "path";
import { fileURLToPath } from 'url';
import AdminUtil from "./util/AdminUtil.js";
import Express from 'express';
import PublicAPI from "./util/PublicAPI.js";
import PrivateAPI from "./util/PrivateAPI.js";
import SystemParam from './util/SystemParam.js';
let systemParam = new SystemParam();
dotenv.config({ path: './.env.' + process.env.NODE_ENV });
let app = new Express();
let httpServer = http.createServer(app);
let adminUtil = new AdminUtil(process.env.SESSION_TIMEOUT);

app.use(Express.json());
app.use('/publicAPI', PublicAPI(adminUtil, systemParam));
app.use('/privateAPI',PrivateAPI(adminUtil,systemParam));
if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.use(Express.static(path.resolve(__dirname, '../build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
    });
}

httpServer.listen(process.env.REACT_APP_SOCKET_PORT, () => {
    console.log('Express server is running on localhost:' + process.env.REACT_APP_SOCKET_PORT);
});