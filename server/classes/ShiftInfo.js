import Dbo from "../util/Dbo.js";
export default class ShiftInfo {
    constructor(activeShiftList, essentialShift) {
        this.activeShiftList = activeShiftList;
        this.essentialShift = essentialShift;
    }
    static async create() {
        let dboObj = new Dbo();
        let essentialShift = "";
        let shiftInfoList = {};
        try {
            let results = await dboObj.getActiveShiftList();
            results.forEach(record => {
                let shift = {};
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
            return new ShiftInfo(shiftInfoList, essentialShift);
        } catch (error) {
            console.log("An error occur when getting active shift list from DB.");
            throw (error);
        } finally {
            dboObj.close();
        }
    }
}