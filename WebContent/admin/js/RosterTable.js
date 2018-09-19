class RosterTable
{
	constructor(utility)
	{
		this.itoList=[];
		this.calendarList;
		this.showNoOfPrevDate=2;
		this.shiftStartCellIndex=3;
		this.averageShiftStdDev=0.0;
		this.allPreviousMonthShiftList=[];
		this.utility=utility;
		this.rosterRule;
		this.table=document.getElementById("rosterTable");
		this.rosterFooter=document.getElementById("footer");
		this.rosterBody=document.getElementById("rosterBody");
		this.rosterHeader=document.getElementById("rosterHeader");
		this.weekdayRow=document.getElementById("weekdayRow");
		this.holidayRow=document.getElementById("holidayRow");
		this.dateRow=document.getElementById("dateRow");
		this.shiftCellEventHandler=new ShiftCellEventHandler(this,"shiftCell");
	}
	setRosterRule(rosterRule)
	{
		this.rosterRule=rosterRule;
	}
	updateValue(theCell)
	{
		
	}
}	