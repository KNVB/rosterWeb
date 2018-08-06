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
		this.year=year;
		this.month=month;
		$(this.rosterFooter).hide();
		this._genRosterCaption();
		this._genRosterMonthRow();
		this._genEmptyRow();
	}
	
//----------------------------------------------------------------------------------------
	_genEmptyRow()
	{
		var i,cell;
		var rosterEmptyRow;
		rosterEmptyRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		
		cell=rosterEmptyRow.insertCell(rosterEmptyRow.cells.length);
		cell.colSpan=46;
				
	}
	_genRosterMonthRow()
	{
		var i,cell;
		var rosterMonthRow;
		var self=this;
		rosterMonthRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		rosterMonthRow.id="rosterMonthRow";
		for (i=0;i<3;i++)
		{
			rosterMonthRow.insertCell(rosterMonthRow.cells.length);
		}
		var monthSelect=document.createElement("select");
		monthSelect.id="selectRosterMonth";
		cell=rosterMonthRow.insertCell(rosterMonthRow.cells.length);
		cell.append(monthSelect);
		
		for (i=0;i<this.englishMonthNames.length;i++)
		{
			var option=document.createElement("option");
			option.value=i;
			option.text=this.englishMonthNames[i];
			if (i==this.month)
				option.selected=true;
			monthSelect.append(option);
		}
		cell.colSpan=31;
		cell.className="underlineText alignCenter boldText";
		monthSelect.className="underlineText rosterMonthSelect";
		monthSelect.onchange=function(){
			self._refresh(self,this);
		};
		cell.append(document.createTextNode(this.year));
		for (i=0;i<10;i++)
		{
			rosterMonthRow.insertCell(rosterMonthRow.cells.length);
		}
	}
	_genRosterCaption()
	{
		var i,cell;
		//this.rosterHeader=this.table.createTHead();
		$(this.rosterHeader).empty();
		var captionRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		for (i=0;i<3;i++)
		{
			captionRow.insertCell(captionRow.cells.length);
		}
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		cell.className="underlineText alignCenter";
		cell.colSpan=31;
		for (i=0;i<10;i++)
		{
			captionRow.insertCell(captionRow.cells.length);
		}		
	}
}	