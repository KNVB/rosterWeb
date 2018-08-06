/**
 * 
 */
class RosterTable
{
	constructor(utility)
	{
		this.month=1;
		this.year=1970;
	
		this.calendarList=null;
		this.showNoOfPrevDate=2;
		this.firstDate=new Date();
		this.utility=utility;
		this.totalHourCellIndex=34;
		this.shiftStartCellIndex=3;
		this.averageShiftStdDev=0.0;

		this.rosterRule=null;
		this.table=document.getElementById("rosterTable");
		this.rosterFooter=document.getElementById("footer");
		this.rosterBody=document.getElementById("rosterBody");
		this.rosterHeader=document.getElementById("rosterHeader");
		this.englishMonthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];		
	}
	setRosterRule(rosterRule)
	{
		this.rosterRule=rosterRule;
	}
	init(year,month)
	{
		
	}
}	