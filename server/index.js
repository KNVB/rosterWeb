import dotenv from 'dotenv';
import http from 'http';
import path from "path";
import { fileURLToPath } from 'url';
import AdminUtil from "./util/AdminUtil.js";
import Express from 'express';
import SystemParam from './util/SystemParam.js';
import {PublicAPI} from './util/PublicAPI.js';
import { PrivateAPI } from './util/PrivateAPI.js';
let app = new Express();
let httpServer = http.createServer(app);

app.use(Express.json());
dotenv.config({ path: './.env.' + process.env.NODE_ENV });
let adminUtil = new AdminUtil(process.env.SESSION_TIMEOUT);
let systemParam=new SystemParam();
app.use('/rosterWeb/publicAPI', PublicAPI(adminUtil,systemParam));
app.use('/rosterWeb/privateAPI', adminUtil.isAuthenticated, PrivateAPI(systemParam));
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