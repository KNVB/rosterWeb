import Dbo from "./Dbo.js";
export default class ITOUtil {
    constructor() {
        this.addITOToDB = async ito => {
            let dboObj = new Dbo();
            let temp = new Date(ito.joinDate);
            ito.joinDate = temp.toLocaleDateString("en-CA");
            temp = new Date(ito.leaveDate);
            ito.leaveDate = temp.toLocaleDateString("en-CA");
            ito.itoId = ito.post + "_" + ito.joinDate;
            try {
                return await dboObj.addITO(ito);
            } catch (error) {
                console.log("Something wrong when adding an ITO info to DB:" + error);
                throw (error);
            }
            finally {
                dboObj.close();
            };
        }
        this.getActiveITOList = async (year, month) => {
            let dboObj = new Dbo();
            try {
                let queryResult = await dboObj.getActiveITOList(year, month);
                let result = {};
                queryResult.forEach(record => {
                    result[record.ito_id] = {
                        isOperator:record.isOperator,
                        joinDate: record.join_date,
                        leaveDate: record.leave_date
                    }
                });
                console.log("Get (" + year + "," + month + ") Active ITO List successfully!");
                return result;
            } catch (error) {
                console.log("Something wrong when getting active ITO List from DB:" + error);
                throw (error);
            }
            finally {
                dboObj.close();
            };
        }
        this.getITOList = async () => {
            let dboObj = new Dbo();
            try {
                let queryResult = await dboObj.getITOList();
                let result = {};
                queryResult.forEach(record => {
                    if (result[record.ito_id] === undefined) {
                        result[record.ito_id] = {
                            availableShift: record.available_shift.split(","),
                            active: record.active,
                            blackListedShiftPattern: [record.black_list_pattern],
                            itoId: record.ito_id,
                            isOperator: record.isOperator,
                            joinDate: record.join_date,
                            leaveDate: record.leave_date,
                            name: record.ito_name,
                            post: record.post_name,
                            workingHourPerDay: record.working_hour_per_day
                        };
                    } else {
                        result[record.ito_id].blackListedShiftPattern.push(record.black_list_pattern);
                    }
                })
                return Object.values(result);
            } catch (error) {
                console.log("Something wrong when getting ITO list:" + error);
                throw (error);
            }
            finally {
                dboObj.close();
            };
        }
        this.updateITO = async ito => {
            let dboObj = new Dbo();
            let temp = new Date(ito.joinDate);
            ito.joinDate = temp.toLocaleDateString("en-CA");
            temp = new Date(ito.leaveDate);
            ito.leaveDate = temp.toLocaleDateString("en-CA");
            try {
                return await dboObj.updateITO(ito);
            } catch (error) {
                console.log("Something wrong when updating an ITO info to DB:" + error);
                throw (error);
            }
            finally {
                dboObj.close();
            };
        }
    }
}