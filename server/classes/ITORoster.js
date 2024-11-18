export default class ITORoster {
    constructor() {
        this.availableShiftList = [];
        this.dutyPattern = "";
        this.itoName = "";
        this.itoPostName = "";
        this.lastMonthBalance = 0.0;
        this.shiftList = {};
        this.thisMonthBalance = 0.0;
    }
}