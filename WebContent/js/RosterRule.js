/**
 * 
 */
class RosterRule
{
	constructor(utility,year,month)
	{
		this.year=year;
		this.month=month;
		this.shiftHourCount=[];
		this.utility=utility;
		this.utility.getRosterRule(this,year,month);
	}
	init(serverResponse)
	{
		console.log("RosterRule initialized successfully.");
	}
	getEssentialShift()
	{
		var result="";
		this.essentialShiftList.forEach(function(shift){
										result+=shift;	
		});
		return result;
	}
}