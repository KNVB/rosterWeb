require('dotenv-flow').config();
//===============================================================
let bodyParser = require('body-parser')
let express = require('express');
let PublicAPI = require('./PublicAPI.js');
let rosterManager=new (require("./classes/rosterManager.js"));
let publicAPI=new PublicAPI(rosterManager);
//===============================================================
let app = express();
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
app.use('/publicAPI',publicAPIRouter);
publicAPIRouter.get('/getITORosterList',publicAPI.getITORosterList);
publicAPIRouter.get('/getRosterRule',publicAPI.getRosterRule);
httpServer.listen(httpServerPort, function() {
  console.log('server up and running at %s port', httpServerPort);
});