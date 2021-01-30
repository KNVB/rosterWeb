class DBO
{
	constructor(){
		let dbConfig = require('./config');
		dbConfig["multipleStatements"]=true;
		dbConfig["insecureAuth"]=true;
		const moment = require('moment');
		const mysql = require('mysql2');

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
module.exports = DBO;    