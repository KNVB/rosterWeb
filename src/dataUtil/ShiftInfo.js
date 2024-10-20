export default class ShiftInfo {
    constructor(shiftType) {
        this.claimType = "";
        this.description = "";
        this.duration = 0;
        this.endTime = null;
        this.shiftType = shiftType;
        this.shiftInfolId = "-1";
        this.status = "";
        this.startTime = null;
    }
}