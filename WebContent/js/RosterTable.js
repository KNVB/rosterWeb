class RosterTable extends HTMLTableElement
{
	constructor(container){
		super();
		var self=this;

		this.dateObjList=null;
		this.monthPicker=null;
		this.rosterBody=document.createElement("tbody");
		this.rosterFooter=document.createElement("tFoot");
		this.rosterHeader=document.createElement("thead");
		
		this.rosterMonthRow,this.rosterHolidayRow,this.rosterWeekDayRow,this.rosterDateRow;
		this.rosterList=null;
		this.rosterRule=new RosterRule();
		this.showNoOfPrevDate=0;
		this.utility=new Utility();
		
		this.rosterBody.id="rosterBody";
		this.rosterFooter.id="rosterFooter";
		this.rosterHeader.id="rosterHeader";
		this.id="rosterTable";
		
		this.appendChild(this.rosterHeader);
		
		$(this.rosterTable).attr("border","0");
		this.appendChild(this.rosterHeader);
		this.appendChild(this.rosterBody);
		this.appendChild(this.rosterFooter);
		container.append(this);
	}
	build(year,month)
	{
		this.rosterYear=year;
		this.rosterMonth=month;
		this.noOfWorkingDay=0;

		this._buildTableHeader();
		this._buildTableBody();
		this._buildTableFooter();

		if (this.monthPicker!=null)
		{	
			this.monthPicker.destroy();
			this.monthPicker=null;
		}
		this.monthPicker=new MonthPicker({elements:$("#rosterMonth"),initYear:this.rosterYear,minValue: "01/2017"});
		this.monthPicker.onPick(function (year,month){
			self.build(year,month);
		});
	}
	markCoorindate(theCell)
	{
		var row=theCell.parentElement;
		var dateRow=document.getElementById("dateRow");
		
		var cell=dateRow.cells[theCell.cellIndex];
		$(cell).addClass(this.highlightClassName);
		cell=row.cells[0];
		$(cell).addClass(this.highlightClassName);
	}
	unMarkCoorindate(theCell)
	{
		var row=theCell.parentElement;
		var dateRow=document.getElementById("dateRow");
		var cell=dateRow.cells[theCell.cellIndex];
		$(cell).removeClass(this.highlightClassName);
		cell=row.cells[0];
		$(cell).removeClass(this.highlightClassName);
	}
//===========================================================================================================================================
	_buildNextMonth()
	{
		if (this.rosterMonth==12)
		{
			this.rosterMonth=1;
			this.rosterYear++;
		}	
		else
			this.rosterMonth++;
		this.build(this.rosterYear,this.rosterMonth);
	}
	_buildPreviousMonth()
	{
		if (this.rosterMonth==1)
		{
			this.rosterMonth=12;
			this.rosterYear--;
		}	
		else
			this.rosterMonth--;
		this.build(this.rosterYear,this.rosterMonth);
	}
	
}
customElements.define('roster-table',
		 RosterTable, {
			extends: 'table'
		});	