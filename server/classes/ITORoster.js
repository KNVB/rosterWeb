class ITORoster{
	constructor(){
		this.lastMonthBalance=0.0;
		this.thisMonthBalance=0.0;
		this.workingHourPerDay=0.0;
		this.shiftList={};
		this.availableShiftList=[];
		this.itoName="";
		this.itoPostName="";		
	}
}
module.exports = ITORoster;