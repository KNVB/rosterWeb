import dotenv from 'dotenv';
import http from 'http';
import path from "path";
import { fileURLToPath } from 'url';
import AdminUtil from './util/AdminUtil.js';
import Express from 'express';
import PrivateAPI from "./util/PrivateAPI.js";
import PublicAPI from "./util/PublicAPI.js";

let app = new Express();
let adminUtil = new AdminUtil(process.env.SESSION_TIMEOUT);
let httpServer = http.createServer(app);

app.use(Express.json());
dotenv.config({ path: './.env.' + process.env.NODE_ENV });
if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(Express.static(path.resolve(__dirname, '../build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
    });
}
console.log(process.env.NODE_ENV+" Mode");
console.log("DB server name="+process.env.DATABASE_HOST);

app.use("/rosterWeb/privateAPI",adminUtil.isAuthenticated, PrivateAPI);
app.use('/rosterWeb/publicAPI', PublicAPI(adminUtil));
httpServer.listen(process.env.REACT_APP_SOCKET_PORT, () => {
    console.log('Express server is running on localhost:' + process.env.REACT_APP_SOCKET_PORT);
});