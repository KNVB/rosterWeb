import { DbConfig } from './DbConfig.js';
import mysql from 'mysql2';

export default class Dbo {
    #connection;
    #sqlString;
    constructor() {
        this.#connection = mysql.createConnection(DbConfig);
    }
    close() {
        this.#connection.end(err => {
            if (err) throw err;
            console.log("Disconnect from " + DbConfig["host"] + " successfully!");
        });
    }
    getActiveShiftList = async () => {
        this.#sqlString = "select * from shift_info where active=1 order by shift_type";
        return await this.#executeQuery(this.#sqlString);
    }
    getITOBlackListShiftPattern = async (year, month) => {
        let result = this.#getStartEndDateString(year, month);
        this.#sqlString = "select ito_info.ito_id,black_list_pattern ";
        this.#sqlString += "from ito_info inner join black_list_pattern on ito_info.join_date<=? and ito_info.leave_date >=? ";
        this.#sqlString += "and ito_info.ito_id = black_list_pattern.ito_id";
        return await this.#executeQuery(this.#sqlString, [result.startDateString, result.endDateString]);
    }
    getPreferredShiftList = async (year, month) => {
        let result = this.#getStartEndDateString(year, month);
        this.#sqlString = "select ito_id,preferred_shift,day(shift_date) as d from preferred_shift where shift_date between ? and ? order by ito_id,shift_date";
        return await this.#executeQuery(this.#sqlString, [result.startDateString, result.endDateString]);
    }
    getPreviousMonthShiftList = async (year, month, systemParam) => {
        let result = this.#getStartEndDateString(year, month);
        this.#sqlString = "select ito_id,shift from shift_record where shift_date >= ? and shift_date < ? order by ito_id,shift_date";
        result.endDateString = result.startDateString;
        let tempDate = new Date(result.startDateString);
        tempDate.setTime(tempDate.getTime() - systemParam.maxConsecutiveWorkingDay * 86400000);
        result.startDateString = tempDate.toLocaleDateString("en-CA");
        //console.log(result.startDateString, result.endDateString);
        return await this.#executeQuery(this.#sqlString, [result.startDateString, result.endDateString]);
    }
    getRoster = async (year, month) => {
        let result = this.#getStartEndDateString(year, month);
		this.#sqlString ="SELECT v.available_shift,";
		this.#sqlString+="	   v.ito_id,";
		this.#sqlString+="	   post_name,";
		this.#sqlString+="	   ito_name,";
		this.#sqlString+="	   working_hour_per_day,";
		this.#sqlString+="	   balance,";
		this.#sqlString+="	   Day(shift_date) AS d,";
		this.#sqlString+="	   shift,";
		this.#sqlString+="	   claim_type,";
		this.#sqlString+="	   description,";        
        this.#sqlString+="     no_of_hour_applied_for,";
		this.#sqlString+="	   end_time,";
        this.#sqlString+="	   start_time,";		
		this.#sqlString+="	   shift_detail.status,";
        this.#sqlString+="     shift_detail_id ";
		this.#sqlString+="FROM   (SELECT available_shift,";
		this.#sqlString+="			   ito_info.ito_id,";
		this.#sqlString+="			   post_name,";
		this.#sqlString+="			   ito_name,";
		this.#sqlString+="			   working_hour_per_day ";
		this.#sqlString+="		FROM   ito_info ";
		this.#sqlString+="		WHERE  ito_info.join_date <= ?";
		this.#sqlString+="			   AND ito_info.leave_date >= ?) AS v";
		this.#sqlString+="	   LEFT JOIN shift_record";
		this.#sqlString+="			  ON v.ito_id = shift_record.ito_id";
		this.#sqlString+="				 AND ( shift_record.shift_date BETWEEN";
		this.#sqlString+="					   ? AND ? )";
		this.#sqlString+="	   LEFT JOIN last_month_balance";
		this.#sqlString+="			  ON v.ito_id = last_month_balance.ito_id";
		this.#sqlString+="				 AND shift_month = ?";
		this.#sqlString+="	   LEFT JOIN shift_detail";
		this.#sqlString+="			  ON v.ito_id = shift_detail.ito_id";
		this.#sqlString+="				 AND Cast(start_time AS DATE) = shift_date ";
		this.#sqlString+="ORDER  BY v.ito_id,";
		this.#sqlString+="		  shift_date,";
        this.#sqlString+="		  shift";
        return await this.#executeQuery(this.#sqlString,
            [
                result.endDateString,
                result.startDateString,
                result.startDateString,
                result.endDateString,
                result.startDateString
            ]
        );
    }
    getSystemParam = async () => {
        this.#sqlString = "select * from system_param order by param_type,param_key,param_value";
        return await this.#executeQuery(this.#sqlString);
    }
    async #executeQuery(sql, para) {
        try {
            const [rows] = await this.#connection.promise().query(sql, para);
            return rows;
        } catch (err) {
            throw (err);
        }
    }    
    #getStartEndDateString(year, month) {
        let tempDate = new Date(year + "-" + month + "-1");
        let startDateString = tempDate.toLocaleDateString("en-CA");
        tempDate.setMonth(month);
        tempDate.setDate(0);
        let endDateString = tempDate.toLocaleDateString("en-CA");
        return { "startDateString": startDateString, "endDateString": endDateString };
    }
}