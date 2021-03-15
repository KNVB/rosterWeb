require('dotenv-flow').config();
//===============================================================
const accessTokenSecret='SD@FD{S=*(^dsv$bm%dl&kf}';
let bodyParser = require('body-parser')
let cookierParser = require('cookie-parser');
let express = require('express');
let PrivateAPI = require('./utils/privateAPI.js');
let PublicAPI = require('./utils/publicAPI.js');
let RosterManager=require("./classes/rosterManager.js");
let SystemParam=require("./classes/SystemParam");
//===============================================================
let systemParam=new SystemParam();
let rosterManager=new RosterManager(systemParam);

let util=require("./utils/utility.js");
let privateAPI =new PrivateAPI(rosterManager,systemParam);
let publicAPI=new PublicAPI(rosterManager,systemParam);
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

//==============================================================================
publicAPIRouter.post('/adminLogin',publicAPI.adminLogin);
publicAPIRouter.get('/getAllActiveShiftInfo',publicAPI.getAllActiveShiftInfo);
publicAPIRouter.get('/getExcel',publicAPI.getExcel);
publicAPIRouter.get('/getITORosterList',publicAPI.getITORosterList);
publicAPIRouter.get('/getSystemParam',publicAPI.getSystemParam);


//==============================================================================
privateAPIRouter.post('/getRosterSchedulerList',privateAPI.getRosterSchedulerList);
privateAPIRouter.post('/getYearlyRosterStatistic',privateAPI.getYearlyRosterStatistic);
privateAPIRouter.post('/logout',privateAPI.logout);
privateAPIRouter.post('/saveRosterToDB',privateAPI.saveRosterToDB);
httpServer.listen(httpServerPort, function() {
  console.log('server up and running at %s port', httpServerPort);
});