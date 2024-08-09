import { DbConfig } from './DbConfig.js';
import mysql from 'mysql2';

export default class Dbo {
    #connection;
    #sqlString;
    constructor() {
        this.#connection = mysql.createConnection(DbConfig);
    }
    getActiveShiftList = async () => {
        this.#sqlString = "select * from shift_info where active=1 order by shift_type";
        return await this.#executeQuery(this.#sqlString);
    }
    getITOList = async () => {
        this.#sqlString = "select * from ito_info a inner join black_list_pattern b on a.ito_id = b.ito_id order by leave_date desc,a.ito_id";
        return await this.#executeQuery(this.#sqlString);
    }
    getRoster = async (year, month) => {
        let result = this.#getStartEndDateString(year, month);
        this.#sqlString = "select v.available_shift,v.ito_id,post_name,ito_name,working_hour_per_day,balance,day(Shift_date) as d,shift ";
        this.#sqlString += "from (";
        this.#sqlString += "SELECT available_shift,ito_info.ito_id,post_name,ito_name,working_hour_per_day ";
        this.#sqlString += "from ito_info ";
        this.#sqlString += "where ito_info.join_date<=? and ito_info.leave_date >=?";
        this.#sqlString += ") as v left join shift_record ";
        this.#sqlString += "on v.ito_id=shift_record.ITO_ID and  (shift_record.shift_date between ? and ?)";
        this.#sqlString += "left join last_month_balance on v.ito_id=last_month_balance.ITO_ID and shift_month=? ";
        this.#sqlString += "order by v.ito_id,shift_date";

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
    close(){
        this.#connection.end(err => {
            if (err) throw err;
            console.log("Disconnect from " + DbConfig["host"] + " successfully!");
        });
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