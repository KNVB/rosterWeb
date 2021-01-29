class DBO
{
	constructor(){
		const mysql = require('mysql2');
		const util =require('util');
		
		const dbConfig={
				charset	:"utf8",
				host		:"server",
				user     	:"cstsang",
				password	:"30Dec2010",
				port		:3306,
				database 	:"roster"
			};
		dbConfig["multipleStatements"]=true;
		dbConfig["insecureAuth"]=true;	
		const connection = mysql.createConnection(dbConfig);
		this.getRosterRule=async()=>{
			let sqlString ="select * from roster_rule order by rule_type,rule_key,rule_value";
			return await executeQuery(sqlString);
		}
		this.close=()=>{
			connection.end(err=>{
				if (err) throw err;
				console.log("Disconnect from "+dbConfig["host"]+" successfully!");
			});
		}
		function executeQuery(sql,para){
			return connection.promise().query(sql,para)
            .then(([rows]) => {
				return rows
			})
            .catch(err=>{                
               throw(err);
            })	
		}			
	}
}
let dboObj=new DBO();
dboObj.getRosterRule()
.then(result=>{
	console.log("Get RosterRule ok");
})
.catch(err=>{
	console.log("Some wrong when getting data:"+err);
})
.finally(()=>{
	dboObj.close();
});


