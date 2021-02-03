require('dotenv-flow').config();
//===============================================================
const accessTokenSecret='SD@FD{S=*(^dsv$bm%dl&kf}';
let bodyParser = require('body-parser')
let cookierParser = require('cookie-parser');
let express = require('express');
let jwt = require('jsonwebtoken');
let PrivateAPI = require('./utils/privateAPI.js');
let PublicAPI = require('./utils/publicAPI.js');
let rosterManager=new (require("./classes/rosterManager.js"));
let util=require("./utils/utility.js");
let privateAPI =new PrivateAPI(rosterManager);
let publicAPI=new PublicAPI(rosterManager);
//===============================================================
let app = express();
let privateAPIRouter= express.Router();
let publicAPIRouter= express.Router();
let httpServerPort = process.env["HTTP_PORT"];

//================================================================
/*****************************************************************/
/* if the server is connected to the internet via a web server   */
/* that have SSL cert,use the following 2 statements to start    */ 
/* the backend                                                   */    
/*****************************************************************/
let http =require('http');
let httpServer= http.createServer(app);

console.log(process.env.NODE_ENV+" Mode");
console.log("DB server name="+process.env.DATABASE_HOST);
//================================================================
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookierParser(accessTokenSecret)); //signed cookie key
app.use('/rosterWeb/publicAPI',publicAPIRouter);
app.use('/rosterWeb/privateAPI',util.checkToken,privateAPIRouter);
publicAPIRouter.get('/getITORosterList',publicAPI.getITORosterList);
publicAPIRouter.get('/getRosterParam',publicAPI.getRosterParam);
publicAPIRouter.post('/adminLogin',util.adminLogin);
privateAPIRouter.post('/logout',privateAPI.logout);
httpServer.listen(httpServerPort, function() {
  console.log('server up and running at %s port', httpServerPort);
});