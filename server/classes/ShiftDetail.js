import Dbo from "../util/Dbo.js";
export default class ShiftDetail {
    constructor() {
    }
    getITOShiftDetailList = async (year, month) => { 
        let dbo = new Dbo();
        let itoShiftDetailList = {};
        try {
            let results = await dbo.getITOShiftDetailList(year, month);
            console.log("Get (" + year + "," + month + ") ITO Shift detail List successfully!");
            results.forEach(record => {
                if (itoShiftDetailList[record.ito_id] === undefined) {
                    itoShiftDetailList[record.ito_id] = {
                        name: record.ito_name,
                        postName: record.post_name,
                        records: [],
                        total: 0
                    };
                }
                if (record.start_time !== null) {
                    itoShiftDetailList[record.ito_id].records.push({
                        claimType:record.claim_type,
                        description: record.description,
                        duration:record.no_of_hour_applied_for,
                        endTime:record.end_time,
                        startTime:record.start_time,
                        status:record.status
                    });
                    itoShiftDetailList[record.ito_id].total+=record.no_of_hour_applied_for; 
                }
            });
            return itoShiftDetailList;
        } catch (error) {
            console.log("An error occur when getting ITO Time off list from DB.");
            console.log(error);
            throw (error);
        } finally {
            dbo.close();
        }            
    }
    getShiftDetailList = async (year, month) => {
        let dbo = new Dbo();
        let shiftDetailList = {};
        try {
            let results = await dbo.getShiftDetailList(year, month);
            console.log("Get (" + year + "," + month + ") Shift detail List successfully!");
            results.forEach(record => {
                if (shiftDetailList[record.ito_id] === undefined) {
                    shiftDetailList[record.ito_id] = { records: {}, total: 0 };
                }
                if (record.start_time !== null) {
                    shiftDetailList[record.ito_id].records[record.start_time.getDate()]={
                        claimType:record.claim_type,
                        description: record.description,
                        duration:record.no_of_hour_applied_for,
                        endTime:record.end_time,
                        startTime:record.start_time,
                        status:record.status
                    }
                    shiftDetailList[record.ito_id].total += record.no_of_hour_applied_for;
                }
            });
            return shiftDetailList;
        } catch (error) {
            console.log("An error occur when getting Shift detail list from DB.");
            console.log(error);
            throw (error);
        } finally {
            dbo.close();
        }
    }
}