class DBO
{
	constructor(){
		let dbConfig = require('./config');
		dbConfig["multipleStatements"]=true;
		dbConfig["insecureAuth"]=true;
		const moment = require('moment');
		const mysql = require('mysql2');

        const connection = mysql.createConnection(dbConfig);

		this.getAllActiveShiftInfo=async()=>{
			let sqlString="select * from shift_info where active=1";
			return await executeQuery(sqlString);
		}
        this.getITOList=async(year, month)=>{
            let result=getStartEndDateString(year,month);			
            let sqlString ="SELECT join_date,leave_date,ito_info.ito_id,post_name,ito_name,available_shift,working_hour_per_day,black_list_pattern from ";
            sqlString+="ito_info inner join black_list_pattern ";
            sqlString+="on ito_info.ito_id=black_list_pattern.ito_id ";
            sqlString+="where join_date<=? and leave_date >=? ";
            sqlString+="order by ito_info.ito_id";

            return await executeQuery(sqlString,[result.startDateString,result.endDateString]);
        }
        this.getRosterList=async(year,month)=>{
			let result=getStartEndDateString(year,month);
            let sqlString="select v.ito_id,post_name,ito_name,working_hour_per_day,balance,day(Shift_date) as d,shift ";
            sqlString+="from (";
            sqlString+="SELECT ito_info.ito_id,post_name,ito_name,working_hour_per_day ";
            sqlString+="from ito_info ";
            sqlString+="where ito_info.join_date<=? and ito_info.leave_date >=?";
            sqlString+=") as v left join shift_record "; 
            sqlString+="on v.ito_id=shift_record.ITO_ID and  (shift_record.shift_date between ? and ?)";
            sqlString+="left join last_month_balance on v.ito_id=last_month_balance.ITO_ID and shift_month=? ";
            sqlString+="order by v.ito_id,shift_date";

            return await executeQuery(sqlString,[result.startDateString,
				                                 result.endDateString,
												 result.startDateString,
												 result.endDateString,
												 result.startDateString]);
        }
		this.getPreferredShiftList=async(year,month)=>{
			let result=getStartEndDateString(year,month);
			let sqlString="select ito_id,preferred_shift,day(shift_date) as d from preferred_shift where shift_date between ? and ? order by ito_id,shift_date";
			return await executeQuery(sqlString,[result.startDateString,result.endDateString]);
		}
		this.getPreivousMonthShiftList=async(year,month,systemParam)=>{
			let result=getStartEndDateString(year,month);
			let sqlString="select ito_id,shift from shift_record where shift_date >= ? and shift_date < ? order by ito_id,shift_date";
			result.endDateString=result.startDateString;
			result.startDateString=moment(result.startDateString).subtract(systemParam.noOfPrevDate, 'days').format('YYYY-MM-DD');
			return await executeQuery(sqlString,[result.startDateString,result.endDateString]);
		}
		
		this.getSystemParam=async()=>{
			let sqlString ="select * from system_param order by param_type,param_key,param_value";
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
		function getStartEndDateString(year,month){
			let startDateString=year+"-";
			if (month<10) {
				startDateString+="0"+month;
			} else {
				startDateString+=month;
			}
			startDateString+="-01";
            let endDateString=moment(startDateString).endOf('month').format('YYYY-MM-DD');
			return {"startDateString":startDateString,"endDateString":endDateString};
		}
    }
}
module.exports = DBO;    