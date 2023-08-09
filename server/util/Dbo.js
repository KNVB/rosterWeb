import { DbConfig } from './DbConfig.js';
import mysql from 'mysql2';

export default class Dbo {
    constructor() {
        DbConfig["multipleStatements"] = true;
        DbConfig["insecureAuth"] = true;

        const connection = mysql.createConnection(DbConfig);
        let sqlString;
        this.addITO = async ito => {
            try {
                await connection.promise().beginTransaction();
                console.log("Add ITO info. transaction start.");
                console.log("===============================");
                console.log(ito);
                sqlString = "insert into ito_info (available_Shift,isOperator,ito_Id,join_date,leave_date,ito_name,post_name,working_hour_per_day) values(?,?,?,?,?,?,?,?)";
                await executeQuery(sqlString, [
                    ito.availableShift.join(","),                    
                    parseInt(ito.isOperator),
                    ito.itoId,                    
                    ito.joinDate,
                    ito.leaveDate,
                    ito.name,
                    ito.post,
                    ito.workingHourPerDay
                ]);
                sqlString = "insert into black_list_pattern (ito_Id, black_list_pattern) values(?,?)";
                for (let i = 0; i < ito.blackListedShiftPattern.length; i++) {
                    let shiftPattern = ito.blackListedShiftPattern[i];
                    await executeQuery(sqlString, [ito.itoId, shiftPattern]);
                }
                await connection.promise().commit();
                console.log("ITO info added successfully.");
                console.log("===============================");
                return true;
            } catch (error) {
                if (connection) {
                    await connection.promise().rollback();
                }
                throw error;
            }
        }
        this.getActiveITOList= async (year, month) => {
            let result = getStartEndDateString(year, month);
            sqlString = "select ito_info.isOperator,ito_info.ito_id,ito_info.leave_date,ito_info.join_date ";
            sqlString += "from ito_info ";
            sqlString += "where ito_info.join_date<=? and ito_info.leave_date >=?";
            sqlString += "order by ito_info.ito_id";
            return await executeQuery(sqlString,
                [
                    result.endDateString,
                    result.startDateString
                ]
            );
        }
        this.getActiveShiftList = async () => {
            sqlString = "select * from shift_info where active=1 order by shift_type";
            return await executeQuery(sqlString);
        }
        this.getITOList = async () => {
            sqlString = "SELECT *, (case when leave_date>sysdate() then \"Yes\" else \"No\" end) as \"active\" from ito_info a inner join black_list_pattern b on a.ito_id = b.ito_id order by a.ito_id";
            return await executeQuery(sqlString);
        }
        this.getITOBlackListShiftPattern = async (year, month) => {
            let result = getStartEndDateString(year, month);
            sqlString = "select ito_info.ito_id,black_list_pattern ";
            sqlString += "from ito_info inner join black_list_pattern on ito_info.join_date<=? and ito_info.leave_date >=? ";
            sqlString += "and ito_info.ito_id = black_list_pattern.ito_id";
            return await executeQuery(sqlString, [result.endDateString, result.startDateString]);
        }
        this.getPreferredShiftList = async (year, month) => {
            let result = getStartEndDateString(year, month);
            sqlString = "select ito_id,preferred_shift,day(shift_date) as d from preferred_shift where shift_date between ? and ? order by ito_id,shift_date";
            return await executeQuery(sqlString, [result.startDateString, result.endDateString]);
        }
        this.getPreviousMonthShiftList = async (year, month, systemParam) => {
            let result = getStartEndDateString(year, month);
            sqlString = "select ito_id,shift from shift_record where shift_date >= ? and shift_date < ? order by ito_id,shift_date";
            result.endDateString = result.startDateString;
            let tempDate = new Date(result.startDateString);
            tempDate.setTime(tempDate.getTime() - systemParam.maxConsecutiveWorkingDay * 86400000);
            result.startDateString = tempDate.toLocaleDateString("en-CA");
            //console.log(result.startDateString, result.endDateString);            
            return await executeQuery(sqlString, [result.startDateString, result.endDateString]);
        }
        this.getRoster = async (year, month) => {
            let result = getStartEndDateString(year, month);
            sqlString = "select v.available_shift,v.ito_id,post_name,ito_name,working_hour_per_day,balance,day(Shift_date) as d,shift ";
            sqlString += "from (";
            sqlString += "SELECT available_shift,ito_info.ito_id,post_name,ito_name,working_hour_per_day ";
            sqlString += "from ito_info ";
            sqlString += "where ito_info.join_date<=? and ito_info.leave_date >=?";
            sqlString += ") as v left join shift_record ";
            sqlString += "on v.ito_id=shift_record.ITO_ID and  (shift_record.shift_date between ? and ?)";
            sqlString += "left join last_month_balance on v.ito_id=last_month_balance.ITO_ID and shift_month=? ";
            sqlString += "order by v.ito_id,shift_date";

            return await executeQuery(sqlString,
                [
                    result.endDateString,
                    result.startDateString,
                    result.startDateString,
                    result.endDateString,
                    result.startDateString
                ]
            );
        }
        this.getSystemParam = async () => {
            sqlString = "select * from system_param order by param_type,param_key,param_value";
            return await executeQuery(sqlString);
        }
        this.getYearlyRosterStatistic = async (year, month) => {
            sqlString = "select a.ito_id,b.post_name,";
            sqlString = sqlString + "			sum(case when shift ='a' then 1 else 0 end) as a,";
            sqlString = sqlString + "			sum(case when shift ='b' or shift ='b1' then 1 else 0 end) as b,";
            sqlString = sqlString + "			sum(case when shift ='c' then 1 else 0 end) as c,";
            sqlString = sqlString + "			sum(case when shift ='d' or shift='d1' or shift='d2' or shift='d3' then 1 else 0 end) as d,";
            sqlString = sqlString + "			sum(case when shift ='O' then 1 else 0 end) as o,";
            sqlString = sqlString + "			year(shift_date) as y,";
            sqlString = sqlString + "			month(shift_date) m ";
            sqlString = sqlString + "from ";
            sqlString = sqlString + "shift_record a inner join ito_info b ";
            sqlString = sqlString + "on join_date<? and ";
            sqlString = sqlString + "   leave_date>? and ";
            sqlString = sqlString + "   year(shift_date)=? and ";
            sqlString = sqlString + "   month(shift_date) <=? and ";
            sqlString = sqlString + "   a.ITO_ID =b.ito_id ";
            sqlString = sqlString + "group by year(shift_date),month(shift_date),a.ito_id";
            let result = getStartEndDateString(year, month);
            return await executeQuery(sqlString,
                [
                    result.endDateString,
                    result.startDateString,
                    year,
                    month
                ]);
        }
        this.saveRosterData = async (year, month, rosterRows, preferredShiftList) => {
            let dateString;
            let sqlString = "";
            try {
                await connection.promise().beginTransaction();
                console.log("Update roster data transaction start.");
                console.log("===============================");
                console.log("year=" + year + ",month=" + month);
                for (const [itoId, rosterRow] of Object.entries(rosterRows)) {
                    sqlString = "replace into last_month_balance (ito_id,shift_month,balance) values (?,?,?)";
                    dateString = new Date(year + "-" + (month + 1) + "-1").toLocaleDateString("en-CA");
                    await executeQuery(sqlString, [itoId, dateString, rosterRow.thisMonthBalance]);

                    sqlString = "delete from shift_record where ito_id=? and month(shift_date)=? and year(shift_date)=?";
                    await executeQuery(sqlString, [itoId, month, year]);
                    console.log("delete " + itoId + " shift record for:" + month + "/" + year);
                    console.log(itoId + " Shift List:");
                    sqlString = "replace into shift_record (ito_id,shift_date,shift,state) values (?,?,?,?)";
                    let dateList = Object.keys(rosterRow.shiftList);
                    for (let i = 0; i < dateList.length; i++) {
                        //console.log("itoId="+itoId+",date="+dateList[i]+",shiftType="+rosterRow.shiftList[dateList[i]]);
                        await executeQuery(sqlString, [itoId, year + "-" + month + "-" + dateList[i], rosterRow.shiftList[dateList[i]], "A"]);
                    }
                    console.log("update " + itoId + " shift record for:" + month + "/" + year);
                    sqlString = "delete from preferred_shift where ito_id=? and month(shift_date)=? and year(shift_date)=?";
                    await executeQuery(sqlString, [itoId, month, year]);
                    console.log("delete " + itoId + " preferred shift data for:" + month + "/" + year);
                    sqlString = "replace into preferred_shift (ito_id,preferred_shift,shift_date) values (?,?,?)";
                    for (let date in preferredShiftList[itoId]) {
                        await executeQuery(sqlString, [itoId, preferredShiftList[itoId][date], year + "-" + month + "-" + date]);
                    }
                    console.log("update " + itoId + " preferred shift record for:" + month + "/" + year);
                    console.log(itoId + " roster data update completed.");
                    console.log("===============================");
                }
                await connection.promise().commit();
                return true;
            } catch (error) {
                if (connection) {
                    await connection.promise().rollback();
                }
                throw error;
            }
        }
        this.updateITO = async ito =>{
            try {
                await connection.promise().beginTransaction();
                console.log("Update ITO ("+ito.itoId+") info. transaction start.");
                console.log("===============================");
                console.log(ito);
                sqlString = "update ito_info set available_Shift=?,isOperator=?,join_date=?,leave_date=?,ito_name=?,post_name=?,working_hour_per_day=?";
                sqlString +=" where ito_Id=?";
                await executeQuery(sqlString, [
                    ito.availableShift.join(","),
                    parseInt(ito.isOperator),
                    new Date(ito.joinDate),
                    new Date(ito.leaveDate),
                    ito.name,
                    ito.post,
                    ito.workingHourPerDay,
                    ito.itoId
                ]);
                sqlString = "delete from black_list_pattern where ito_Id=?";
                await executeQuery(sqlString, [ito.itoId]);
                sqlString = "insert into black_list_pattern (ito_Id, black_list_pattern) values(?,?)";
                for (let i = 0; i < ito.blackListedShiftPattern.length; i++) {
                    let shiftPattern = ito.blackListedShiftPattern[i];
                    await executeQuery(sqlString, [ito.itoId, shiftPattern]);
                }
                await connection.promise().commit();
                console.log("ITO ("+ito.itoId+")info updated successfully.");
                console.log("===============================");
                return true;
            } catch (error) {
                if (connection) {
                    await connection.promise().rollback();
                }
                throw error;
            }
        }
        //==================================================================================================================================================================		
        this.close = () => {
            connection.end(err => {
                if (err) throw err;
                console.log("Disconnect from " + DbConfig["host"] + " successfully!");
            });
        }
        function getStartEndDateString(year, month) {
            let tempDate = new Date(year + "-" + month + "-1");
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