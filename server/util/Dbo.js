import { DbConfig } from './DbConfig.js';
import mysql from 'mysql2';

export default class Dbo {
    #connection;
    #sqlString;
    constructor() {
        this.#connection = mysql.createConnection(DbConfig);
    }
    addITO = async ito => {
        try {
            await this.#connection.promise().beginTransaction();
            console.log("Add ITO info. transaction start.");
            console.log("===============================");
            console.log(ito);
            this.#sqlString = "insert into ito_info (available_Shift,duty_pattern,ito_Id,join_date,leave_date,ito_name,post_name,working_hour_per_day) values(?,?,?,?,?,?,?,?)";
            await this.#executeQuery(this.#sqlString, [
                ito.availableShift.join(","),
                ito.dutyPattern,
                ito.itoId,
                ito.joinDate,
                ito.leaveDate,
                ito.name,
                ito.post,
                ito.workingHourPerDay
            ]);
            this.#sqlString = "insert into black_list_pattern (ito_Id, black_list_pattern) values(?,?)";
            for (let i = 0; i < ito.blackListedShiftPattern.length; i++) {
                let shiftPattern = ito.blackListedShiftPattern[i];
                await this.#executeQuery(this.#sqlString, [ito.itoId, shiftPattern]);
            }
            await this.#connection.promise().commit();
            console.log("ITO info added successfully.");
            console.log("===============================");
            return true;
        } catch (error) {
            if (this.#connection) {
                await this.#connection.promise().rollback();
            }
            throw error;
        }
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
    getITOList = async () => {
        this.#sqlString = "select a.ito_id,a.ito_name,a.available_shift,";
        this.#sqlString += "b.black_list_pattern,duty_pattern,";
        this.#sqlString += "DATE_FORMAT(join_date,\"%Y-%m-%d\") as join_date,";
        this.#sqlString += "DATE_FORMAT(leave_Date ,\"%Y-%m-%d\") as leave_date,";
        this.#sqlString += "post_name,working_hour_per_day ";
        this.#sqlString += "from ito_info a ";
        this.#sqlString += "left join black_list_pattern b on a.ito_id = b.ito_id ";
        this.#sqlString += "order by leave_date desc,a.ito_id";
        return await this.#executeQuery(this.#sqlString);
    }
    getITOTimeOffList = async (year, month) => {
        let result = this.#getStartEndDateString(year, month);
        this.#sqlString = "select b.ito_id,b.post_name,b.ito_name,time_off_start,";
        this.#sqlString += "time_off_end,description,no_of_hour_applied_for,time_off_id,time_off_status ";
        this.#sqlString += "from ";
        this.#sqlString += "(select *";
        this.#sqlString += "from time_off ";
        this.#sqlString += "where time_off_start between ? and ?) a right join ";
        this.#sqlString += "(select ";
        this.#sqlString += "ito_id,post_name,ito_name ";
        this.#sqlString += "from ito_info ";
        this.#sqlString += "where ";
        this.#sqlString += "join_date<=? and leave_date >=?";
        this.#sqlString += ")b on a.ito_id=b.ito_id";

        return await this.#executeQuery(this.#sqlString,
            [
                result.startDateString,
                result.endDateString,                
                result.endDateString,
                result.startDateString
            ]);
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
    getTimeOff = async (year, month) => {
        let result = this.#getStartEndDateString(year, month);
        this.#sqlString = "select b.ito_id,time_off_start,";
        this.#sqlString += "time_off_end,description,no_of_hour_applied_for ";
        this.#sqlString += "from ";
        this.#sqlString += "(select *";
        this.#sqlString += "from time_off ";
        this.#sqlString += "where time_off_start between ? and ?) a right join ";
        this.#sqlString += "(select ";
        this.#sqlString += "ito_id ";
        this.#sqlString += "from ito_info ";
        this.#sqlString += "where ";
        this.#sqlString += "join_date<=? and leave_date >=?";
        this.#sqlString += ")b on a.ito_id=b.ito_id";

        return await this.#executeQuery(this.#sqlString,
            [
                result.startDateString,
                result.endDateString,                
                result.endDateString,
                result.startDateString
            ]);
    }
    updateITO = async ito => {
        try {

            await this.#connection.promise().beginTransaction();
            console.log("Update ITO (" + ito.itoId + ") info. transaction start.");
            console.log("===============================");
            console.log(ito);
            this.#sqlString = "update ito_info set available_Shift=?,duty_pattern=?,join_date=?,leave_date=?,ito_name=?,post_name=?,working_hour_per_day=?";
            this.#sqlString += " where ito_Id=?";
            await this.#executeQuery(this.#sqlString, [
                ito.availableShift.join(","),
                ito.dutyPattern,
                ito.joinDate,
                ito.leaveDate,
                ito.name,
                ito.post,
                ito.workingHourPerDay,
                ito.itoId
            ]);
            this.#sqlString = "delete from black_list_pattern where ito_Id=?";
            await this.#executeQuery(this.#sqlString, [ito.itoId]);
            this.#sqlString = "insert into black_list_pattern (ito_Id, black_list_pattern) values(?,?)";
            for (let i = 0; i < ito.blackListedShiftPattern.length; i++) {
                let shiftPattern = ito.blackListedShiftPattern[i];
                await this.#executeQuery(this.#sqlString, [ito.itoId, shiftPattern]);
            }
            await this.#connection.promise().commit();
            console.log("ITO (" + ito.itoId + ")info updated successfully.");
            console.log("===============================");
            return true;
        } catch (error) {
            if (this.#connection) {
                await this.#connection.promise().rollback();
            }
            throw error;
        }
    }
    close() {
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