/**
 * 
 */
class RosterRule
{
	constructor(utility)
	{
		this.utility=utility;
		this.shiftHourCount=[];
		this.maxConWorkingDay;
		this.essentialShiftList=[];
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