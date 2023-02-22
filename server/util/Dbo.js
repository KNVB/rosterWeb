import { DbConfig } from './DbConfig.js';
import mysql from 'mysql2';

export default class Dbo {
    constructor() {
        DbConfig["multipleStatements"] = true;
        DbConfig["insecureAuth"] = true;

        const connection = mysql.createConnection(DbConfig);
        let sqlString;
        this.getActiveShiftList = async () => {
            let sqlString = "select * from shift_info where active=1 order by shift_type";
            return await executeQuery(sqlString);
        }
        this.getPreferredShiftList = async (year, month) => {
            let result = getStartEndDateString(year, month);
            let sqlString = "select ito_id,preferred_shift,day(shift_date) as d from preferred_shift where shift_date between ? and ? order by ito_id,shift_date";
            return await executeQuery(sqlString, [result.startDateString, result.endDateString]);
        }
        this.getPreviousMonthShiftList = async (year, month, systemParam) => {
            let result = getStartEndDateString(year, month);
            let sqlString = "select ito_id,shift from shift_record where shift_date >= ? and shift_date < ? order by ito_id,shift_date";
            result.endDateString = result.startDateString;
            let tempDate = new Date(result.startDateString);
            tempDate.setTime(tempDate.getTime() - systemParam.maxConsecutiveWorkingDay * 86400000);
            result.startDateString = tempDate.toLocaleDateString("en-CA");
            //console.log(result.startDateString, result.endDateString);            
            return await executeQuery(sqlString,[result.startDateString,result.endDateString]);
        }
        this.getRosterList = async (year, month) => {
            let result = getStartEndDateString(year, month);
            let sqlString = "select v.available_shift,v.ito_id,post_name,ito_name,working_hour_per_day,balance,day(Shift_date) as d,shift ";
            sqlString += "from (";
            sqlString += "SELECT available_shift,ito_info.ito_id,post_name,ito_name,working_hour_per_day ";
            sqlString += "from ito_info ";
            sqlString += "where ito_info.join_date<=? and ito_info.leave_date >=?";
            sqlString += ") as v left join shift_record ";
            sqlString += "on v.ito_id=shift_record.ITO_ID and  (shift_record.shift_date between ? and ?)";
            sqlString += "left join last_month_balance on v.ito_id=last_month_balance.ITO_ID and shift_month=? ";
            sqlString += "order by v.ito_id,shift_date";
            return await executeQuery(sqlString, [result.startDateString,
            result.endDateString,
            result.startDateString,
            result.endDateString,
            result.startDateString]);
        }

        this.getSystemParam = async () => {
            let sqlString = "select * from system_param order by param_type,param_key,param_value";
            return await executeQuery(sqlString);
        }
        //==================================================================================================================================================================		
        this.close = () => {
            connection.end(err => {
                if (err) throw err;
                console.log("Disconnect from " + DbConfig["host"] + " successfully!");
            });
        }
        function getStartEndDateString(year, month) {
            let tempDate = new Date();
            tempDate.setFullYear(year);
            tempDate.setMonth(month - 1);
            tempDate.setDate(1);
            let startDateString = tempDate.toLocaleDateString("en-CA");
            tempDate.setMonth(month);
            tempDate.setDate(0);
            let endDateString = tempDate.toLocaleDateString("en-CA");
            return { "startDateString": startDateString, "endDateString": endDateString };
        }
        async function executeQuery(sql, para) {
            try {
                const [rows] = await connection.promise().query(sql, para);
                return rows;
            } catch (err) {
                throw (err);
            }
        }
    }
}