class DBO
{
	constructor(){
		let dbConfig = require('./config');
		dbConfig["multipleStatements"]=true;
		dbConfig["insecureAuth"]=true;
		const moment = require('moment');
		const mysql = require('mysql2');
		const util =require('util');
		const connection = mysql.createConnection(dbConfig);
		//const query = util.promisify(connection.query).bind(connection);
		this.getLastMonthBalance=(year,month,itoId,callBack)=>{
			const startDateString=year+"-"+month+"-01";
			let sqlString='select balance from last_month_balance where ito_Id=? and shift_month=?';
			connection.execute(sqlString,[itoId,startDateString],(err, results, fields)=>{
                connection.end(err=>{
                    if (err) {
                        throw err;
                    } else {						
                        callBack(err,results[0].balance);
                        console.log("Get Roster successfully!");
                    }
                });
            });
		}
		this.getITOList=(year,month,callBack)=>{
            const startDateString=year+"-"+month+"-01";
            const endDateString=moment(startDateString).add(1,"M").add(-1,"d").format('YYYY-MM-DD');
            
            let sqlString ="SELECT join_date,leave_date,ito_info.ito_id,post_name,ito_name,available_shift,working_hour_per_day,black_list_pattern from ";
            sqlString+="ito_info inner join black_list_pattern ";
            sqlString+="on ito_info.ito_id=black_list_pattern.ito_id ";
            sqlString+="where join_date<=? and leave_date >=? ";
            sqlString+="order by ito_info.ito_id";
            console.log("startDateString="+startDateString+",endDateString="+endDateString);
            connection.execute(sqlString,[startDateString,endDateString],(err, results, fields)=>{
                connection.end(err=>{
                    if (err) {
                        throw err;
                    } else {
                        callBack(err,results);
                        console.log("Get ITO List successfully.");
                    }
                });
            });
        }
		this.getRoster=(year,month,itoId,callBack)=>{
			let sqlString ="select day(shift_date) as d,shift from shift_record where ito_Id=? and (shift_record.shift_date between ? and ?)";
			const startDateString=year+"-"+month+"-01";
            const endDateString=moment(startDateString).add(1,"M").add(-1,"d").format('YYYY-MM-DD');
			connection.execute(sqlString,[itoId,startDateString,endDateString],(err, results, fields)=>{
                connection.end(err=>{
                    if (err) {
                        throw err;
                    } else {
                        callBack(err,results);
                        console.log("Get Roster successfully!");
                    }
                });
            });
		}
		this.getRosterRule=(callBack)=>{
            let sqlString ="select * from roster_rule order by rule_type,rule_key,rule_value";
            connection.execute(sqlString,(err, results, fields)=>{
                connection.end(err=>{
                    if (err) {
                        throw err;
                    } else {
                        callBack(err,results);
                        console.log("Get Roster Rule successfully!");
                    }
                });
            });
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