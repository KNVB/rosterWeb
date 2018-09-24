class RosterTable
{
	constructor(utility)
	{
		this.calendarList;
		this.dateRow=document.getElementById("dateRow");
		this.holidayRow=document.getElementById("holidayRow");
		this.rosterBody=document.getElementById("rosterBody");
		this.rosterFooter=document.getElementById("footer");
		this.rosterHeader=document.getElementById("rosterHeader");
		this.rosterList;
		this.rosterMonth;
		this.rosterRule;
		this.rosterYear;
		this.showNoOfPrevDate=2;
		this.table=document.getElementById("rosterTable");
		this.utility=utility;
		this.weekdayRow=document.getElementById("weekdayRow");
		this.workingDayCount;
	}
	refresh()
	{
		this._refreshRosterHeader();
		this._rebuildRosterBody();
	}
//=========================================================================================================	
	_rebuildRosterBody()
	{
		$(this.rosterBody).empty();
	}
	_refreshRosterHeader()
	{
		var i,cell,holidayCell,weekdayCell,dateCell;
		this.workingDayCount=this.calendarList.length;
		for (i=0;i<this.calendarList.length;i++)
		{
			holidayCell=this.holidayRow.cells[i+this.showNoOfPrevDate+1];
			weekdayCell=this.weekdayRow.cells[i+this.showNoOfPrevDate+1];
			dateCell=this.dateRow.cells[i+this.showNoOfPrevDate+1];
			if (this.calendarList[i].isHoliday)
			{
				holidayCell.textContent="PH";
			}	
			else
			{
				holidayCell.textContent="";
			}
			switch (this.calendarList[i].weekday)
			{
				case "S":
				case "Su":
						this.workingDayCount--;
						weekdayCell.className+=" phCell";
						break;
				default:
						if (this.calendarList[i].isHoliday)
						{	
							this.workingDayCount--;
							weekdayCell.className+=" phCell";
						}
						else	
							$(weekdayCell).removeClass("phCell");
						break
			}			
			weekdayCell.textContent=this.calendarList[i].weekday;
			dateCell.textContent=i+1;
		}
		for (i=this.calendarList.length;i<31;i++)
		{
			holidayCell=this.holidayRow.cells[i+this.showNoOfPrevDate+1];
			weekdayCell=this.weekdayRow.cells[i+this.showNoOfPrevDate+1];
			dateCell=this.dateRow.cells[i+this.showNoOfPrevDate+1];
			holidayCell.textContent="";
			weekdayCell.textContent="";
			$(weekdayCell).removeClass("phCell");
			dateCell.textContent="";
		}
	}
	
}