import Dbo from "../util/Dbo.js";
export default class NonStandardWorkingHour {
    constructor() {
    }
    getNonStandardWorkingHourRecodrds = async (year, month) => {
        let dbo = new Dbo();
        let result = {}
        try {
            let resultList = await dbo.getNonStandardWorkingHourRecords(year, month);
            resultList.forEach(record => {
                if (result[record.ito_id] === undefined) {
                    result[record.ito_id] = {};
                }
                if (record.start_time) {
                    if (result[record.ito_id][record.start_time.getDate()]===undefined){
                        result[record.ito_id][record.start_time.getDate()]=[] 
                    }
                    result[record.ito_id][record.start_time.getDate()].push({
                        claimType: record.claim_type,
                        description: record.description,
                        endTime: record.end_time,
                        id: record.id,
                        noOfHourAppliedFor: record.no_of_hour_applied_for,
                        startTime: record.start_time,
                        status: record.status
                    });
                }
            });

            return result;
        } catch (err) {
            console.log("Some wrong when getting Non Standard Working Hour Records:" + err);
        }
        finally {
            dbo.close();
        };
    }
    getNonStandardWorkingHourSummary = async (year, month) => {
        let dbo = new Dbo();
        let summary = {}
        try {
            let resultList = await dbo.getNonStandardWorkingHourSummary(year, month);
            resultList.forEach(record => {
                if (record.sum === null) {
                    summary[record.ito_id] = 0;
                } else {
                    summary[record.ito_id] = record.sum;
                }
            });
            return summary;
        } catch (err) {
            console.log("Some wrong when getting Non Standard Working Hour Summary:" + err);
        }
        finally {
            dbo.close();
        };
    }
}