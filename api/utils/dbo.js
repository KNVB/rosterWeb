class DBO
{
	constructor(){
		const dbConfig = require('./config');
		const moment = require('moment');
		const mysql = require('mysql');
		const connection = mysql.createConnection(dbConfig);
		const util = require('util');
		const query = util.promisify(connection.query).bind(connection);
		
		
		this.getITOList=async (year,month)=>{
			const startDateString=year+"-"+month+"-01";
			const endDateString=moment(startDateString).add(1,"M").add(-1,"d").format('YYYY-MM-DD');
			
			let sqlString ="SELECT join_date,leave_date,ito_info.ito_id,post_name,ito_name,available_shift,working_hour_per_day,black_list_pattern from ";
			sqlString+="ito_info inner join black_list_pattern ";
			sqlString+="on ito_info.ito_id=black_list_pattern.ito_id ";
			sqlString+="where join_date<=? and leave_date >=? ";
			sqlString+="order by ito_info.ito_id";
			console.log("startDateString="+startDateString+",endDateString="+endDateString);
			
			try{
				const result=await query({sql:sqlString},[startDateString,endDateString]);
				return result;
			} catch (error) {
				throw error;
			} finally{
				connection.end(err=>{
				if (err) throw err;
					console.log("Disconnect from "+dbConfig.host+" successfully!");
				});
			}
		}
		this.getRosterList=async (year,month,itoIdList)=>{
			const startDateString=year+"-"+month+"-01";
			const endDateString=moment(startDateString).add(1,"M").add(-1,"d").format('YYYY-MM-DD');
		}
		this.close=()=>{
			connection.end(err=>{
				if (err) throw err;
				console.log("Disconnect form "+process.env["DATABASE_HOST"]+" successfully!");
			});
		}		
	}
}
module.exports = DBO;