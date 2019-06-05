class RosterTable extends HTMLTableElement
{
	constructor(container){
		super();
		var self=this;
		this.actualHourCellClassName="actualHourCell"; 
		this.alignCenterClassName="alignCenter"; 
		this.alignLeftClassName="alignLeft";
		this.aShiftColorClassName="aShiftColor";
		this.borderCellClassName="borderCell";
		this.bShiftColorClassName="bShiftColor";
		this.clickableClassName="clickable";
		this.cShiftColorClassName="cShiftColor";
		this.cursorCellClassName="cursorCell";
		this.dataCellClassName="dataCell";
		this.dShiftColorClassName="dShiftColor";
		this.highlightClassName="highlight";
		this.lastMonthCellClassName="lastMonthCell";
		this.nameCellClassName="nameCell";
		this.noOfWorkingDayClassName="noOfWorkingDay";
		this.oShiftColorClassName="oShiftColor";
		this.phCellClassName="phCell";
		this.rosterMonthSelectCellClassName="rosterMonthSelectCell";
		this.shiftCellClassName="shiftCell";
		this.sickLeaveColorClassName="sickLeaveColor";
		this.thisMonthCellClassName="thisMonthCell";
		this.titleCellClassName="titleCell";
		this.totalCellClassName="totalCell";
		this.totalHourCellClassName="totalHourCell";
		this.totalNoOfCellClassName="totalNoOfCell";
		this.underlineTextClassName="underlineText"; 

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
	_buildRosterMonthRow()
	{
		var input,span;
		var self=this;
		$(this.rosterMonthRow).empty();
		var cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		//cell.className="nameCell";
		$(cell).addClass(this.nameCellClassName);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		}
		cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		//cell.className="alignCenter rosterMonthSelectCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.rosterMonthSelectCellClassName);
		cell.colSpan=31;
		
		span=document.createElement("span");
		span.innerHTML="<&nbsp;&nbsp;";
		//span.className="underlineText clickable";
		$(span).addClass(this.underlineTextClassName);
		$(span).addClass(this.clickableClassName);
		cell.append(span);
		$(span).click(function(){
			self._buildPreviousMonth();	
		});
		
		span=document.createElement("span");
		span.id="rosterMonth";
		//span.className="underlineText clickable";
		$(span).addClass(this.underlineTextClassName);
		$(span).addClass(this.clickableClassName);
		span.textContent=this.utility.monthNames[this.rosterMonth]+" "+this.rosterYear;
		cell.append(span);	
	
		span=document.createElement("span");
		span.innerHTML="&nbsp;&nbsp;>";
		//span.className="underlineText clickable";
		$(span).addClass(this.underlineTextClassName);
		$(span).addClass(this.clickableClassName);
		cell.append(span);		
		$(span).click(function(){
			self._buildNextMonth();	
		});
		
		cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		cell.colSpan=10;		
	}
	_buildTableCaptionRow()
	{
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var cell=row.insertCell(row.cells.length);
		//cell.className="nameCell";
		$(cell).addClass(this.nameCellClassName);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
		}
		cell=row.insertCell(row.cells.length);
		//cell.className="alignCenter titleCell underlineText";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.titleCellClassName)
		$(cell).addClass(this.underlineTextClassName);
		cell.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		cell.colSpan=31;
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalCellClassName);
		//cell.className="totalHourCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className=this.actualHourCellClassName;
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.lastMonthCellClassName);
		//cell.className="lastMonthCell";
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.thisMonthCellClassName);
		//cell.className="thisMonthCell";
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalCellClassName);
		//cell.className="totalCell";
		
		for (var i=0;i<4;i++)
		{
			cell=row.insertCell(row.cells.length);
			$(cell).addClass(this.totalNoOfCellClassName);
			//cell.className="totalNoOfCell";
		}
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.noOfWorkingDayClassName);
		//cell.className="noOfWorkingDay";
	}
	
	_buildTableHeader()
	{
		var self=this;
		$(this.rosterHeader).empty();
		this._buildTableCaptionRow();
		this.rosterMonthRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		this.rosterHolidayRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		this.rosterWeekDayRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		this.rosterDateRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		this.rosterMonthRow.id="rosterMonthRow";
		this.rosterHolidayRow.id="holidayRow";
		this.rosterWeekDayRow.id="dayRow";
		this.rosterDateRow.id="dateRow";	
		this._buildRosterMonthRow();
		this.utility.getDateList(this.rosterYear,this.rosterMonth)
		.done(function(dateObjList){
			self.dateObjList=dateObjList;
			self._buildHolidayRow();
			self._buildWeekDayRow();
			self._buildDateRow();
		})
		.fail(function(data){
			alert("Fail to get Date Object List");
		});
	}	
}
customElements.define('roster-table',
		 RosterTable, {
			extends: 'table'
		});	