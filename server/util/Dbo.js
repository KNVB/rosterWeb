import { DbConfig } from './DbConfig.js';
import mysql from 'mysql2';
import Utility from './Utility.js';
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
        let result = Utility.getStartEndDateString(year, month);
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
        this.#sqlString += "order by leave_date desc,Cast(replace(post_name,\"ITO\",\"\") as unsigned)";
        return await this.#executeQuery(this.#sqlString);
    }
    getPreferredShiftList = async (year, month) => {
        let result = Utility.getStartEndDateString(year, month);
        this.#sqlString = "select ito_id,preferred_shift,day(shift_date) as d from preferred_shift where shift_date between ? and ? order by ito_id,shift_date";
        return await this.#executeQuery(this.#sqlString, [result.startDateString, result.endDateString]);
    }
    getPreviousMonthShiftList = async (year, month, systemParam) => {
        let result = Utility.getStartEndDateString(year, month);
        //this.#sqlString = "select ito_id,shift from shift_record where shift_date >= ? and shift_date < ? order by ito_id,shift_date";

        this.#sqlString = "SELECT v.ito_id, shift ";
        this.#sqlString += "FROM   (SELECT ito_id ";
        this.#sqlString += "FROM   ito_info ";
        this.#sqlString += "WHERE  ito_info.join_date <= ? ";
        this.#sqlString += "AND ito_info.leave_date >= ?) as v ";
        this.#sqlString += "LEFT JOIN shift_record ";
        this.#sqlString += "ON shift_record.ito_id = v.ito_id ";
        this.#sqlString += "AND shift_date >= ? ";
        this.#sqlString += "AND shift_date < ? ";
        this.#sqlString += "order by v.ito_id,shift_date";

        let lastMonthEndDate = result.startDateString;
        let tempDate = new Date(result.startDateString);
        tempDate.setTime(tempDate.getTime() - systemParam.maxConsecutiveWorkingDay * 86400000);
        let lastMonthStartDate = tempDate.toLocaleDateString("en-CA");
        //console.log(result.startDateString, result.endDateString,lastMonthStartDate,lastMonthEndDate);
        return await this.#executeQuery(this.#sqlString, [result.endDateString, result.startDateString, lastMonthStartDate, lastMonthEndDate]);
    }
    getRoster = async (year, month) => {
        let result = Utility.getStartEndDateString(year, month);
        this.#sqlString = "SELECT v.available_shift,";
        this.#sqlString += "	   balance,";
        this.#sqlString += "	   Day(shift_date) AS d,";
        this.#sqlString += "	   duty_pattern,";
        this.#sqlString += "	   v.ito_id,";
        this.#sqlString += "	   ito_name,";
        this.#sqlString += "	   post_name,";
        this.#sqlString += "	   shift,";
        this.#sqlString += "	   working_hour_per_day ";
        this.#sqlString += "FROM   (SELECT available_shift,";
        this.#sqlString += "	           duty_pattern,";
        this.#sqlString += "			   ito_name,";
        this.#sqlString += "			   ito_info.ito_id,";
        this.#sqlString += "			   post_name,";
        this.#sqlString += "			   working_hour_per_day ";
        this.#sqlString += "		FROM   ito_info ";
        this.#sqlString += "		WHERE  ito_info.join_date <= ?";
        this.#sqlString += "			   AND ito_info.leave_date >= ?) AS v";
        this.#sqlString += "	   LEFT JOIN shift_record";
        this.#sqlString += "			  ON v.ito_id = shift_record.ito_id";
        this.#sqlString += "				 AND ( shift_record.shift_date BETWEEN";
        this.#sqlString += "					   ? AND ? )";
        this.#sqlString += "	   LEFT JOIN last_month_balance";
        this.#sqlString += "			  ON v.ito_id = last_month_balance.ito_id";
        this.#sqlString += "				 AND shift_month = ?";
        this.#sqlString += "ORDER  BY Cast(replace(post_name,\"ITO\",\"\") as unsigned),";
        this.#sqlString += "		  shift_date,";
        this.#sqlString += "		  shift";
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
    getTimeOffAndOverTimeSummary = async (year, month) => {
        let result = Utility.getStartEndDateString(year, month);
        this.#sqlString = "select v.ito_id,sum(k.no_of_hour_applied_for) as 'sum'";
        this.#sqlString += "from ";
        this.#sqlString += "		(SELECT ";
        this.#sqlString += "               ito_info.ito_id,";
        this.#sqlString += "               post_name";
        this.#sqlString += "        FROM   ito_info";
        this.#sqlString += "        WHERE  ito_info.join_date <= ?";
        this.#sqlString += "               AND ito_info.leave_date >= ?) v";
        this.#sqlString += "		left join ";
        this.#sqlString += "(SELECT ito_id,no_of_hour_applied_for ";
        this.#sqlString += " FROM time_off_and_over_time ";
        this.#sqlString += " where ";
        this.#sqlString += " start_time  <= ? ";
        this.#sqlString += " and end_time>= ?)k";
        this.#sqlString += "			on v.ito_id=k.ito_id ";
        this.#sqlString += " group by v.ito_id ";
        this.#sqlString += " order by  Cast(replace(post_name,\"ITO\",\"\") as unsigned)";
        return await this.#executeQuery(this.#sqlString,
            [
                result.endDateString,
                result.startDateString,
                result.endDateString,
                result.startDateString
            ]
        );
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
    //=========================================================================================================================
    async #executeQuery(sql, para) {
        try {
            const [rows] = await this.#connection.promise().query(sql, para);
            return rows;
        } catch (err) {
            throw (err);
        }
    }   
}