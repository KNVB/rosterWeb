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
		/*
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
		*/
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
	_buildDateRow()
	{
		var now=new Date();
		var dateNameCell=new DateNameCell();
		var lastMonthBalanceCell=new LastMonthBalanceCell();
		var noOfWorkingDayCountCell=new NoOfWorkingDayCountCell();
		var shiftACountCell=new ShiftACountCell();
		var shiftBxCountCell=new ShiftBxCountCell();
		var shiftCCountCell=new ShiftCCountCell();
		var shiftDxCountCell=new ShiftDxCountCell();
		var thisMonthBalanceCell=new ThisMonthBalanceCell();
		var thisMonthTotalCell=new ThisMonthTotalCell();
		
		
		$(this.rosterDateRow).empty();
		this.rosterDateRow.appendChild(dateNameCell);
		
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			var dateCell=new DateCell();
			this.rosterDateRow.appendChild(dateCell);
		}
		for (var i=0;i<31;i++)
		{
			var dateCell=new DateCell();
			this.rosterDateRow.appendChild(dateCell);
			if (i<Object.keys(this.dateObjList).length)
			{
				dateCell.textContent=(i+1);
				if ((this.rosterYear==now.getFullYear()) &&
						(this.rosterMonth==(1+now.getMonth())) &&
						((i+1)==(now.getDate())))
						$(dateCell).addClass(Css.highlightCellClassName);	
			}
		}
		this.rosterDateRow.appendChild(lastMonthBalanceCell);
		this.rosterDateRow.appendChild(thisMonthTotalCell);
		this.rosterDateRow.appendChild(thisMonthBalanceCell);
		
		this.rosterDateRow.appendChild(shiftACountCell);
		this.rosterDateRow.appendChild(shiftBxCountCell);
		this.rosterDateRow.appendChild(shiftCCountCell);
		this.rosterDateRow.appendChild(shiftDxCountCell);
		this.rosterDateRow.appendChild(noOfWorkingDayCountCell);
	}
	_buildHolidayRow()
	{
		var dateObj;
		var borderCell=new BorderCell();
		var holidayCell=new HolidayCell();

		$(this.rosterHolidayRow).empty();
		this.rosterHolidayRow.appendChild(holidayCell);
		
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			var dateCell=new DateCell();
			this.rosterHolidayRow.appendChild(dateCell);
		}
		
		for (var i=0;i<31;i++)
		{
			var phCell=new PHCell();
			this.rosterHolidayRow.appendChild(phCell);
			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i+1];
				if(dateObj.publicHoliday==true)
				{
					phCell.textContent="PH";
				}
			}
		}
		borderCell.colSpan=10;
		this.rosterHolidayRow.appendChild(borderCell);
	}
	_buildITORow(itoId)
	{
		var aShiftCount=0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0,balance=0.0;
		var	actualWorkingHour=0.0,thisMonthHourTotal=0.0,thisMonthBalance=0.0;

		var cell,i;
		var rosterDataList=this.rosterList[itoId]
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		var shiftType;
		
		cell=new BorderCell();
		row.id="shift_"+itoId;
		cell.innerHTML=rosterDataList.itoname+"<br>"+rosterDataList.itopostName+" Extn. 2458";
		row.appendChild(cell);
		
	}
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
		$(this.rosterMonthRow).empty();
		var nameCell=new NameCell();
		var rosterMonthSelectCell=new RosterMonthSelectCell(this,this.utility);
		this.rosterMonthRow.appendChild(nameCell);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		}
		this.rosterMonthRow.appendChild(rosterMonthSelectCell);
		var cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		cell.colSpan=10;
	}
	_buildRosterRows()
	{
		var self=this;
		Object.keys(this.rosterList).forEach(function(itoId){
			self._buildITORow(itoId);
		});
	}
	_buildTableBody()
	{
		var self=this;
		$(this.rosterBody).empty();
		this._getData()
		.then(function(){
			self._buildRosterRows();
			var shiftCellHighLighter=new ShiftCellHighLighter(self,Css.cursorCellClassName);
		});
	}
	_buildTableCaptionRow()
	{
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var actualHourCell =new ActualHourCell();
		var lastMonthCell=new LastMonthCell();
		var nameCell=new NameCell();
		var noOfWorkingDayCell=new NoOfWorkingDayCell(); 
		var thisMonthCell=new ThisMonthCell();
		var titleCell=new TitleCell();
		var totalCell=new TotalCell();
		
		row.appendChild(nameCell);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
		}
		row.appendChild(titleCell);
		row.appendChild(totalCell);
		row.appendChild(actualHourCell);
		row.appendChild(lastMonthCell);
		row.appendChild(thisMonthCell);
		totalCell=new TotalCell();
		row.appendChild(totalCell);
		
		for (var i=0;i<4;i++)
		{
			var shiftCountCell=new ShiftCountCell();
			row.appendChild(shiftCountCell);
		}
		row.appendChild(noOfWorkingDayCell);
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
	_buildWeekDayRow()
	{
		var dateObj;
		var actualHourCountCell=new ActualHourCountCell();
		var hourOffDueCell=new HourOffDueCell();
		var totalHourCell=new TotalHourCell();
		var weekDayNameCell=new WeekDayNameCell();
		$(this.rosterWeekDayRow).empty();
		this.rosterWeekDayRow.appendChild(weekDayNameCell);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			var dateCell=new DateCell();
			this.rosterWeekDayRow.appendChild(DateCell);
		}
		for (var i=0;i<31;i++)
		{
			var weekDayCell=new WeekDayCell();
			this.rosterWeekDayRow.appendChild(weekDayCell);
			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i+1];
				weekDayCell.setDateObj(dateObj);
				if ((dateObj.publicHoliday==true)||(dateObj.dayOfWeek=="SATURDAY")||(dateObj.dayOfWeek=="SUNDAY"))
				{
					$(weekDayCell).addClass(Css.phCellClassName);
				}
				else
					this.noOfWorkingDay++;
			}
		}
		this.rosterWeekDayRow.appendChild(totalHourCell);
		this.rosterWeekDayRow.appendChild(actualHourCountCell);
		this.rosterWeekDayRow.appendChild(hourOffDueCell);
	}
	_getData()
	{
		var self=this;
		return new Promise((resolve, reject) =>{
			 this.utility.getRosterList(this.rosterYear,this.rosterMonth)
			 .done(function(rosterList){
				 self.rosterList=rosterList;
				 resolve();
			 })
			 .fail(function(data){
				 alert("Failed to get roster list.");
				 reject();
			 });
		});
	}
}
customElements.define('roster-table',
		 RosterTable, {
			extends: 'table'
		});