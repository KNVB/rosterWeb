import Dbo from "../util/Dbo.js";
export default class TimeOff {
    constructor() {
    }
    getITOTimeOffList = async (year, month) => {
        let dbo = new Dbo();
        let itoTimeOffList = {};
        try {
            let results = await dbo.getITOTimeOffList(year, month);
            console.log("Get (" + year + "," + month + ") ITO Time off List successfully!");
            results.forEach(record => {
                if (itoTimeOffList[record.ito_id] === undefined) {
                    itoTimeOffList[record.ito_id] = {
                        name: record.ito_name,
                        postName: record.post_name,
                        records: [],
                        total: 0
                    };
                }
                if (record.time_off_start !== null) {
                    itoTimeOffList[record.ito_id].records.push({
                        description: record.description,
                        timeOffAmount: record.no_of_hour_applied_for,
                        timeOffEnd: record.time_off_end,
                        timeOffId: record.time_off_id,
                        timeOffStart: record.time_off_start,
                        timeOffStatus: record.time_off_status,
                    });
                    itoTimeOffList[record.ito_id].total += record.no_of_hour_applied_for;
                }
            });
            return itoTimeOffList;
        } catch (error) {
            console.log("An error occur when getting ITO Time off list from DB.");
            console.log(error);
            throw (error);
        } finally {
            dbo.close();
        }
    }
    getTimeOffList = async (year, month) => {
        let dbo = new Dbo();
        let timeOffList = {};
        try {
            let results = await dbo.getTimeOff(year, month);
            console.log("Get (" + year + "," + month + ") Time off List successfully!");
            results.forEach(record => {
                if (timeOffList[record.ito_id] === undefined) {
                    timeOffList[record.ito_id] = { records: [], total: 0 };
                }
                if (record.time_off_start !== null) {
                    timeOffList[record.ito_id].records.push({
                        description: record.description,
                        timeOffAmount: record.no_of_hour_applied_for,
                        timeOffEnd: record.time_off_end,
                        timeOffStart: record.time_off_start,
                        timeOffStatus: record.time_off_status,
                    });
                    timeOffList[record.ito_id].total += record.no_of_hour_applied_for;
                }
            });
            return timeOffList;
        } catch (error) {
            console.log("An error occur when getting Time off list from DB.");
            console.log(error);
            throw (error);
        } finally {
            dbo.close();
        }
    }
}