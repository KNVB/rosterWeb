require('dotenv-flow').config();
//===============================================================
let bodyParser = require('body-parser')
let cors = require('cors')
let express = require('express');
let rosterManager=new (require("./classes/rosterManager.js"));
let path = require('path')

//===============================================================
let app = express();
let apiRouter= express.Router();
let httpServerPort = process.env["HTTP_PORT"];

//================================================================
/*****************************************************************/
/* if the server is connected to the internet via a web server   */
/* that have SSL cert,use the following 2 statements to start    */ 
/* the backend                                                   */    
/*****************************************************************/
let http =require('http');
let httpServer= http.createServer(app);
console.log(process.env.NODE_ENV);
//================================================================
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
if (process.env.NODE_ENV=="development"){
	app.use(cors());
}
//================================================================
app.use('/rosterWeb/api', apiRouter);
apiRouter.get('/getRosterRule',(req,res)=>{
	res.send(rosterManager.getRosterRule());
})
apiRouter.get('/getITORosterList',async function(req,res){
	//res.send(meetingManager.initMeeting(req.body));
	console.log(req.query);
	let result=await rosterManager.getRosterList(req.query.year,req.query.month);
	res.send(result);
});
httpServer.listen(httpServerPort, function() {
  console.log('server up and running at %s port', httpServerPort);
});