import Dbo from "./Dbo.js";
import Shift from "../classes/Shift.js";
export default class ShiftUtil {
    constructor() {
        this.getActiveShiftList = async () => {
            let dboObj = new Dbo();
            let essentialShift = "";
            let shiftInfoList = {};

            try {
                let results = await dboObj.getActiveShiftList();
                results.forEach(record => {
                    let shift = new Shift();
                    shift.cssClassName = record.css_class_name;
                    shift.duration = parseFloat(record.shift_duration);
                    shift.isEssential = (record.is_essential === 1);
                    shift.timeSlot = record.time_slot;
                    shift.type = record.shift_type;
                    shiftInfoList[shift.type] = shift;
                    if (record.is_essential === 1) {
                        essentialShift += shift.type;
                    }
                });
                console.log("Get All Active Shift Info. success.");
                shiftInfoList["essentialShift"] = essentialShift;
                return shiftInfoList;
            }
            catch (error) {
                console.log("Something wrong when getting active shift info list:" + error);
                console.log(shiftInfoList);
            }
            finally {
                dboObj.close();
            };
        }
        this.getITOBlackListShiftPattern = async (year, month) => {
            let dboObj = new Dbo();
            let itoBlackListShiftPattern = {};
            try {
                let results = await dboObj.getITOBlackListShiftPattern(year, month);
                console.log("Get (" + year + "," + month + ") ITO black list shift pattern successfully!");
                results.forEach(record => {
                    if (itoBlackListShiftPattern[record.ito_id] === undefined) {
                        itoBlackListShiftPattern[record.ito_id] = [];
                    }
                    itoBlackListShiftPattern[record.ito_id].push(record.black_list_pattern);
                });
                return itoBlackListShiftPattern;
            } catch (error) {
                console.log("Something wrong when getting ITO black list shift pattern:" + error);
                console.log(itoBlackListShiftPattern);
            }
            finally {
                dboObj.close();
            };
        }
    }
}