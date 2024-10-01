import Dbo from "../util/Dbo.js";
export default class Roster {
    constructor() {
    }
    getRoster = async (year, month) => {
        let dbo = new Dbo();
        let itoRosterList = {};
        try {
            let results = await dbo.getRoster(year, month);
            console.log("Get (" + year + "," + month + ") Roster successfully!");
            results.forEach(record => {
                if (itoRosterList[record.ito_id] === undefined) {
                    itoRosterList[record.ito_id] = {
                        availableShiftList: record.available_shift.split(","),
                        itoName: record.ito_name,
                        itoPostName: record.post_name,
                        lastMonthBalance: 0.0,
                        shiftDetail: {
                            records: {},
                            total: 0
                        },
                        shiftList: {},
                        thisMonthBalance: 0.0,
                        workingHourPerDay: parseFloat(record.working_hour_per_day)
                    }
                    if (record.balance) {
                        itoRosterList[record.ito_id].lastMonthBalance = parseFloat(record.balance);
                    }
                }
                if (record.d) {
                    if (itoRosterList[record.ito_id].shiftList[record.d] === undefined) {
                        itoRosterList[record.ito_id].shiftList[record.d] = record.shift;
                    } else {
                        itoRosterList[record.ito_id].shiftList[record.d] += "+" + record.shift;
                    }
                    if (record.shift === "t") {                       
                        if (itoRosterList[record.ito_id].shiftDetail.records[record.d] === undefined) {
                            itoRosterList[record.ito_id].shiftDetail.records[record.d] = [];
                        }
                        itoRosterList[record.ito_id].shiftDetail.records[record.d].push({
                            claimType: record.claim_type,
                            description: record.description,
                            duration: record.no_of_hour_applied_for,
                            endTime: record.end_time,
                            startTime: record.start_time,
                            status: record.status
                        });
                        itoRosterList[record.ito_id].shiftDetail.total += record.no_of_hour_applied_for;
                    }
                }
            });
            return itoRosterList;
        } catch (error) {
            console.log("An error occur when getting roster list from DB.");
            console.log(error);
            throw (error);
        } finally {
            dbo.close();
        }
    }
}