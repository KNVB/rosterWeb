export default class ShiftDetail {
    constructor(itoId, itoName, itoPostName, date) {
        this.shiftList=[];
/*
        this.claimType = "";
        this.description = "";
        this.duration = 0;
        this.endTime = new Date(date.getTime());
        
        this.shiftDetailId = "";
        this.shiftType = shiftType;
        this.status = "";
        this.startTime = new Date(date.getTime());
*/
        this.date = date;
        this.itoId = itoId;
        this.itoName = itoName;
        this.itoPostName = itoPostName;
    }
}