import Dbo from "./Dbo.js";
export default class RosterUtil {
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