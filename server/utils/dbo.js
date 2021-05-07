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
            let sqlString="select v.available_shift,v.ito_id,post_name,ito_name,working_hour_per_day,balance,day(Shift_date) as d,shift ";
            sqlString+="from (";
            sqlString+="SELECT available_shift,ito_info.ito_id,post_name,ito_name,working_hour_per_day ";
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
			result.startDateString=moment(result.startDateString).subtract(systemParam.maxConsecutiveWorkingDay, 'days').format('YYYY-MM-DD');
			console.log(result.startDateString,result.endDateString);
			return await executeQuery(sqlString,[result.startDateString,result.endDateString]);
		}
		
		this.getSystemParam=async()=>{
			let sqlString ="select * from system_param order by param_type,param_key,param_value";
			return await executeQuery(sqlString);
		}
		this.getYearlyRosterStatistic=async(year, month)=>{
			let result=getStartEndDateString(year,month);
			let sqlString="select a.ito_id,b.post_name,";
			sqlString=sqlString+"			sum(case when shift ='a' then 1 else 0 end) as a,";
			sqlString=sqlString+"			sum(case when shift ='b' or shift ='b1' then 1 else 0 end) as b,";
			sqlString=sqlString+"			sum(case when shift ='c' then 1 else 0 end) as c,";
			sqlString=sqlString+"			sum(case when shift ='d' or shift='d1' or shift='d2' or shift='d3' then 1 else 0 end) as d,";
			sqlString=sqlString+"			sum(case when shift ='O' then 1 else 0 end) as o,";
			sqlString=sqlString+"			year(shift_date) as y,";
			sqlString=sqlString+"			month(shift_date) m ";
			sqlString=sqlString+"from ";
			sqlString=sqlString+"shift_record a inner join ito_info b ";
			sqlString=sqlString+"on join_date<? and ";
			sqlString=sqlString+"   leave_date>? and ";
			sqlString=sqlString+"   year(shift_date)=? and ";
			sqlString=sqlString+"   month(shift_date) <=? and ";
			sqlString=sqlString+"   a.ITO_ID =b.ito_id ";
			sqlString=sqlString+"group by a.ito_id,year(shift_date),month(shift_date)";

			return await executeQuery(sqlString,
									[
										result.startDateString,
										result.endDateString,
										year,
										month]
			);
		}
		this.saveRosterData=async(year,month,preferredShiftList,rosterList)=>{
			let dateString;
			let sqlString="";
			try{
				await connection.promise().beginTransaction();
				console.log("Update roster data transaction start.");
				console.log("===============================");
				console.log("year="+year+",month="+month);
				let itoIdList=Object.keys(rosterList);
				for (let i=0;i<itoIdList.length;i++){
					let itoId=itoIdList[i];
					console.log("itoId="+itoId);
					console.log("lastMonthBalance="+rosterList[itoId].lastMonthBalance.toFixed(2));
					console.log("thisMonthBalance="+rosterList[itoId].thisMonthBalance.toFixed(2));

					sqlString="replace into last_month_balance (ito_id,shift_month,balance) values (?,?,?)";
					dateString=moment({"year":year,"month":month-1,"date":1}).format('YYYY-MM-DD');
					await connection.promise().query(sqlString,[itoId,dateString,rosterList[itoId].lastMonthBalance.toFixed(2)]);
					
					dateString=getNextMonthStartDateString(year,month);
					await connection.promise().query(sqlString,[itoId,dateString,rosterList[itoId].thisMonthBalance.toFixed(2)])

					sqlString="delete from shift_record where ito_id=? and month(shift_date)=? and year(shift_date)=?";
					await connection.promise().query(sqlString,[itoId,month,year]);

					sqlString="replace into shift_record (ito_id,shift_date,shift,state) values (?,?,?,?)";
					let shiftList=rosterList[itoId].shiftList;
					Object.keys(shiftList).forEach(date=>{
						dateString=moment({"year":year,"month":month-1,"date":date}).format('YYYY-MM-DD');
						//console.log(dateString);
						//console.log(date+","+shiftList[date]);
						
						let shiftTypeList = shiftList[date].split("+");
						shiftTypeList.forEach(async(shiftType) => {
							await connection.promise().query(sqlString,[itoId,dateString,shiftType,'A']);
						});
					});
					console.log("Update "+itoId+" Shift List Completed.");
					sqlString="delete from preferred_shift where ito_id=? and month(shift_date)=? and year(shift_date)=?";
					await connection.promise().query(sqlString,[itoId,month,year]);

					sqlString="replace into preferred_shift (ito_id,preferred_shift,shift_date) values (?,?,?)";
					if (preferredShiftList[itoId]){
						Object.keys(preferredShiftList[itoId]).forEach(async(date)=>{
							dateString=moment({"year":year,"month":month-1,"date":date}).format('YYYY-MM-DD');
							await connection.promise().query(sqlString,[itoId,preferredShiftList[itoId][date],dateString]);
						});
					}
					console.log("Update "+itoId+" Preferred Shift List Completed.");
					console.log(itoId+" roster data update completed.");	
					console.log("===============================");
				}
				await connection.promise().commit();
				return true;
			}catch(error){
				if (connection) {
					await connection.promise().rollback();
				}
				throw error;
			}
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
		function getNextMonthStartDateString(year,month){
			let result="";
			let startDateString=year+"-";
			if (month<10) {
				startDateString+="0"+month;
			} else {
				startDateString+=month;
			}
			startDateString+="-01";
			result=moment(startDateString).add(1,'months').format('YYYY-MM-DD');
			return result;
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