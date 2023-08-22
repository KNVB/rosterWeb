export default class ITO{
    constructor(){
        this.availableShift= ["a","b","c","d1","O"];
        this.blackListedShiftPattern=[""];
        this.itoId="";
        this.joinDate=new Date();
        this.leaveDate=new Date("2099-12-31");
        this.name="";
        this.post="";
        this.workingHourPerDay="";
    }
}