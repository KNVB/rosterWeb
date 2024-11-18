import Dbo from "../util/Dbo.js";
import ITORoster from "./ITORoster.js";
import Utility from "../util/Utility.js";
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
                    let itoRoster = new ITORoster();
                    itoRoster.availableShiftList = record.available_shift.split(",");
                    itoRoster.dutyPattern = record.duty_pattern;
                    itoRoster.itoName = record.ito_name;
                    itoRoster.itoPostName = record.post_name;
                    itoRoster.workingHourPerDay = parseFloat(record.working_hour_per_day);
                    if (record.balance) {
                        itoRoster.lastMonthBalance = parseFloat(record.balance);
                    }
                    itoRosterList[record.ito_id] = itoRoster;
                    /*
                    itoRosterList[record.ito_id] = {
                        availableShiftList: record.available_shift.split(","),
                        dutyPattern: record.duty_pattern,
                        itoName: record.ito_name,
                        itoPostName: record.post_name,
                        lastMonthBalance: 0.0,
                        shiftList: {},
                        thisMonthBalance: 0.0,
                        workingHourPerDay: parseFloat(record.working_hour_per_day)
                    }
                    if (record.balance) {
                        itoRosterList[record.ito_id].lastMonthBalance = parseFloat(record.balance);
                    }*/
                }
                if (record.d) {
                    itoRosterList[record.ito_id].shiftList[record.d] = record.shift;
                } else {
                    let endDate = Utility.getEndDate(year, month);
                    for (let i = 0; i < endDate; i++) {
                        itoRosterList[record.ito_id].shiftList[i + 1] = "";
                    }
                    //console.log(`year=${year},month=${month},endDate=${endDate}`);
                }
            });
            return itoRosterList;
        }
        catch (error) {
            console.log("An error occur when getting roster list from DB.");
            console.log(error);
            throw (error);
        } finally {
            dbo.close();
        }
    }
}