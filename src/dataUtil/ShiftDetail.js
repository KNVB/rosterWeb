export default class ShiftDetail {
    constructor(itoId, itoName, itoPostName, date, shiftType) {
        this.claimType = "";
        this.date = date;
        this.description = "";
        this.duration = 0;
        this.endTime = new Date(date.getTime());
        this.itoId = itoId;
        this.itoName = itoName;
        this.itoPostName = itoPostName;
        this.shiftDetailId = "";
        this.shiftType = shiftType;
        this.status = "";
        this.startTime = new Date(date.getTime());
    }
}