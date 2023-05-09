import dotenv from 'dotenv';
import http from 'http';
import path from "path";
import { fileURLToPath } from 'url';
import AdminUtil from "./AdminUtil.js";
import Express from 'express';
import {PublicAPI} from './PublicAPI.js';
let app = new Express();
let httpServer = http.createServer(app);

app.use(Express.json());
dotenv.config({ path: './.env.' + process.env.NODE_ENV });
let adminUtil = new AdminUtil(process.env.SESSION_TIMEOUT);
app.use('/publicAPI', PublicAPI(adminUtil));
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