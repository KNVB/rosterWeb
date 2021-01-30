class DBO
{
	constructor(){
		
		const moment = require('moment');
		const mysql = require('mysql2');
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
		this.getITOList=async(year, month)=>{
            let startDateString=year+"-";
			if (month<10) {
				startDateString+="0"+month;
			} else {
				startDateString+=month;
			}
			startDateString+="-01";
			const endDateString=moment(startDateString).endOf('month').format('YYYY-MM-DD');            
			
            let sqlString ="SELECT join_date,leave_date,ito_info.ito_id,post_name,ito_name,available_shift,working_hour_per_day,black_list_pattern from ";
            sqlString+="ito_info inner join black_list_pattern ";
            sqlString+="on ito_info.ito_id=black_list_pattern.ito_id ";
            sqlString+="where join_date<=? and leave_date >=? ";
            sqlString+="order by ito_info.ito_id";

            return await executeQuery(sqlString,[startDateString,endDateString]);
        }

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

async function getITOList(){
	let dboObj=new DBO();
	try{
		let resultList=await dboObj.getITOList(2021,1);
		return resultList;
	}
	catch(err){
		console.log("Some wrong when getting ITO data:"+err);
	}
	finally{
		dboObj.close();
	};
}

/*
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
*/
getITOList()
.then(resultList=>{
	console.log(resultList);
});