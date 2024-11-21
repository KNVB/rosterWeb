import Dbo from "../util/Dbo.js";
import ITORoster from "./ITORoster.js";
import Utility from "../util/Utility.js";
export default class Roster {
    constructor() {
    }
    getPreferredShiftList = async (year, month) => {
        let dboObj = new Dbo();
        let itoPreferredShiftList = {};
        try {
            let results = await dboObj.getPreferredShiftList(year, month);
            console.log("Get (" + year + "," + month + ") Preferred Shift List successfully!");
            results.forEach(record => {
                if (itoPreferredShiftList[record.ito_id] === undefined) {
                    itoPreferredShiftList[record.ito_id] = {};
                }
                if (record.d) {
                    itoPreferredShiftList[record.ito_id][record.d] = record.preferred_shift;
                }
            });
            return itoPreferredShiftList;
        } catch (error) {
            console.log("Something wrong when getting Preferred shift list:" + error);
            throw (error);
        }
        finally {
            dboObj.close();
        };
    }
    getPreviousMonthShiftList = async (year, month, systemParam) => {
        let dboObj = new Dbo();
        let previousMonthShiftList = {};
        try {
            let results = await dboObj.getPreviousMonthShiftList(year, month, systemParam);
            results.forEach(record => {
                if (previousMonthShiftList[record.ito_id] === undefined) {
                    previousMonthShiftList[record.ito_id] = [];
                }
                if (record.shift) {
                    previousMonthShiftList[record.ito_id].push(record.shift);
                }
            });
            console.log("Get (" + year + "," + month + ") Previous Month Shift List successfully!");
            return previousMonthShiftList;
        } catch (error) {
            console.log("Something wrong when getting Previous month shift list:" + error);
            throw (error);
        }
        finally {
            dboObj.close();
        };
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
                    if (itoRosterList[record.ito_id].shiftList[record.d]) {
                        itoRosterList[record.ito_id].shiftList[record.d] += "+" + record.shift;
                    } else {
                        itoRosterList[record.ito_id].shiftList[record.d] = record.shift;
                    }
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