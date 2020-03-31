/*==============================================================================================*
 *																				  				*
 *	It denote a roster table                                                 	                *
 *																				  				*
 *==============================================================================================*/
class RosterTable extends HTMLTableElement
{
	constructor(container){
		super();
		var self=this;

		this.dateObjList=null;
		this.monthPicker=null;
		this.noOfWorkingDay=0;
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
/*==============================================================================================*
 *																				  				*
 *	To build the roster table for the given year and month                  	                *
 *																				  				*
 *==============================================================================================*/
	build(year,month)
	{
		var self=this;
		this.rosterYear=year;
		this.rosterMonth=month;
		this.noOfWorkingDay=0;

		$(document).unbind();
		
		return this._getData()    
		.then(function(){
			self._buildTableHeader();
			self._buildTableBody();
			self._buildTableFooter();
		}) 
		.catch(function(error){
				if(error.readyState!=4)
				{
					alert("Ops! Something Wrong, please try again later.\nreadyState="+error.readyState);
					console.log(error);
				}	
				else
				{
					if (error.status==440)
					{
						alert("The client's session has expired, please login again.");
						location.href="./";
					}
					else
					{
						alert("status code="+error.status);
					}
				}
			   });
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Destroy rosterTable object related object                               	                *
	 *																				  				*
	 *==============================================================================================*/
	destroy()
	{
		if (this.monthPicker!=null)
		{	
			$(document).unbind();
			this.monthPicker=null;
		}		
	}
	/*==============================================================================================*
	 *																				  				*
	 *	High light the date and the ITO name for the specified shift/roster cell   	                *
	 *																				  				*
	 *==============================================================================================*/	
	markCoorindate(theCell)
	{
		var row=theCell.parentElement;
		var dateRow=document.getElementById("dateRow");
		var cell=dateRow.cells[theCell.cellIndex];

		$(cell).addClass(Css.highlightCellClassName);
		cell=row.cells[0];
		$(cell).addClass(Css.highlightCellClassName);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Remove high light from the specified shift/roster cell                  	                *
	 *																				  				*
	 *==============================================================================================*/	
	unMarkCoorindate(theCell)
	{
		var row=theCell.parentElement;
		var dateRow=document.getElementById("dateRow");
		var cell=dateRow.cells[theCell.cellIndex];

		$(cell).removeClass(Css.highlightCellClassName);
		cell=row.cells[0];
		$(cell).removeClass(Css.highlightCellClassName);
	}
/*******************************************************************************************************
 *                                                                                                     *
 *    Private method                                                                                   *
 *                                                                                                     *
 *******************************************************************************************************/
	/*==============================================================================================*
	 *																				  				*
	 *	Build the date row                   					                  	                *
	 *																				  				*
	 *==============================================================================================*/	
	_buildDateRow()
	{
		var borderedLastMonthCell=SimpleCellFactory.BorderedLastMonthCell;
		var borderedThisMonthCell=SimpleCellFactory.BorderedThisMonthCell;
		var borderedTotalCell=SimpleCellFactory.BorderedTotalCell;
		var dateNameCell=SimpleCellFactory.DateNameCell;
		var noOfWorkingDayCountCell=SimpleCellFactory.NoOfWorkingDayCountCell;
		var shiftACountCell=SimpleCellFactory.ShiftACountCell;
		var shiftBxCountCell=SimpleCellFactory.ShiftBxCountCell;
		var shiftCCountCell=SimpleCellFactory.ShiftCCountCell;
		var shiftDxCountCell=SimpleCellFactory.ShiftDxCountCell;
		
		$(this.rosterDateRow).empty();
		this.rosterDateRow.appendChild(dateNameCell);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			var dateCell=SimpleCellFactory.DateCell;
			this.rosterDateRow.appendChild(dateCell);
		}
		for (var i=0;i<31;i++)
		{
			var dateCell=SimpleCellFactory.DateCell;
			this.rosterDateRow.appendChild(dateCell);
			if (i<Object.keys(this.dateObjList).length)
			{
				dateCell.textContent=this.dateObjList[i].dateOfMonth;
				if (this.dateObjList[i].today)
					$(dateCell).addClass(Css.todayCellClassName);
			}
		}
		this.rosterDateRow.appendChild(borderedLastMonthCell);
		this.rosterDateRow.appendChild(borderedThisMonthCell);
		this.rosterDateRow.appendChild(borderedTotalCell);
		
		this.rosterDateRow.appendChild(shiftACountCell);
		this.rosterDateRow.appendChild(shiftBxCountCell);
		this.rosterDateRow.appendChild(shiftCCountCell);
		this.rosterDateRow.appendChild(shiftDxCountCell);
		this.rosterDateRow.appendChild(noOfWorkingDayCountCell);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build the holiday row                  					                  	                *
	 *																				  				*
	 *==============================================================================================*/	
	_buildHolidayRow()
	{
		var dateObj;
		var borderCell=SimpleCellFactory.BorderCell;
		var holidayCell=SimpleCellFactory.HolidayCell;

		$(this.rosterHolidayRow).empty();
		this.rosterHolidayRow.appendChild(holidayCell);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			var dateCell=SimpleCellFactory.DateCell;
			this.rosterHolidayRow.appendChild(dateCell);
		}
		for (var i=0;i<31;i++)
		{
			var phCell=SimpleCellFactory.PHCell;
			this.rosterHolidayRow.appendChild(phCell);
			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i];
				if((dateObj.publicHoliday==true) && (dateObj.dayOfWeek!="S")&& (dateObj.dayOfWeek!="Su"))
				{
					phCell.textContent="PH";
					phCell.title=dateObj.festivalInfo;
				}
			}
		}
		borderCell.colSpan=10;
		this.rosterHolidayRow.appendChild(borderCell);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build a shift row                   					                  	                *
	 *																				  				*
	 *==============================================================================================*/	
	_buildITORow(rosterRowData)
	{
		var cell=SimpleCellFactory.BorderCell,i,calculateResult=[];
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);

		row.id="shift_"+rosterRowData.itoId;
		
		var cell=SimpleCellFactory.BorderCell,i;

		cell.innerHTML=rosterRowData.itoname+"<br>"+rosterRowData.itopostName+" Extn. 2458";
		row.appendChild(cell);

		this._buildPreviousMonthShiftCells(rosterRowData,row);
		this._buildShiftCells(rosterRowData,row);
		//console.log("noOfWorkingDay="+this.noOfWorkingDay);
		var shiftCountData=this.utility.calculateShiftStat(this.noOfWorkingDay,rosterRowData,this.rosterRule.shiftHourCount);
		//console.log("shiftCountData.totalHour="+shiftCountData.totalHour);
		this._buildShiftCountCells(row,shiftCountData,rosterRowData.itoId);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Re build the roster table for the next month      					                  	    *
	 *																				  				*
	 *==============================================================================================*/	
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
	/*==============================================================================================*
	 *																				  				*
	 *	Re build the roster table for the previous month   					                  	    *
	 *																				  				*
	 *==============================================================================================*/		
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
	/*==============================================================================================*
	 *																				  				*
	 *	Build the roster cell for the previous month     					                  	    *
	 *																				  				*
	 *==============================================================================================*/		
	_buildPreviousMonthShiftCells(rosterRowData,row)
	{
		var index=Object.keys(rosterRowData.previousMonthShiftList).length-this.showNoOfPrevDate+1;
		for (var i=index;i<=Object.keys(rosterRowData.previousMonthShiftList).length;i++)
		{
			var cell=new ShiftCell(this.utility);
			cell.setShiftType(rosterRowData.previousMonthShiftList[i]);
			row.appendChild(cell);
		}
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build the roster rows for each ITO  								                  	    *
	 *																				  				*
	 *==============================================================================================*/		
	_buildRosterRows()
	{
		var self=this,shiftType;
		Object.keys(this.rosterList).forEach(function(itoId){
			var rosterRowData=self.rosterList[itoId];
			rosterRowData["itoId"]=itoId;
			self._buildITORow(rosterRowData);			
		});
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build a table row for roster date selector							                  	    *
	 *																				  				*
	 *==============================================================================================*/
	_buildSelectRosterMonthRow()
	{
		$(this.rosterMonthRow).empty();
		var nameCell=SimpleCellFactory.NameCell;
		var selectRosterMonthCell=SimpleCellFactory.getSelectRosterMonthCell(this);
		this.rosterMonthRow.appendChild(nameCell);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		}
		this.rosterMonthRow.appendChild(selectRosterMonthCell);
		var cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		cell.colSpan=10;
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build table cells for the given roster shift data					                  	    *
	 *																				  				*
	 *==============================================================================================*/
	_buildShiftCells(rosterRowData,row)
	{
		var cell,i;
		for (i=1;i<=Object.keys(rosterRowData.shiftList).length;i++)
		{
			cell=SimpleCellFactory.getCursoredShiftCell(this);
			cell.setShiftType(rosterRowData.shiftList[i]);
			row.appendChild(cell);
		}
		for (var j=i;j<32;j++)
		{
			cell=SimpleCellFactory.DateCell;
			row.appendChild(cell);
		}
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build table cells for the shift count data					                  	    		*
	 *																				  				*
	 *==============================================================================================*/
	_buildShiftCountCells(row,shiftCountData,itoId)
	{
		var cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_totalHour";
		cell.textContent=shiftCountData["totalHour"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_actualHour";
		cell.textContent=shiftCountData["actualHour"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_lastMonthBalance";
		cell.textContent=shiftCountData["lastMonthBalance"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_thisMonthHourTotal";
		cell.textContent=shiftCountData["thisMonthHourTotal"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_thisMonthBalance";
		cell.textContent=shiftCountData["thisMonthBalance"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_aShiftCount";
		cell.textContent=shiftCountData["aShiftCount"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_bxShiftCount";
		cell.textContent=shiftCountData["bxShiftCount"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_cShiftCount";
		cell.textContent=shiftCountData["cShiftCount"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_dxShiftCount";
		cell.textContent=shiftCountData["dxShiftCount"];
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.id=itoId+"_noOfWoringDay";
		cell.textContent=shiftCountData["noOfWorkingDay"];
		row.appendChild(cell);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build Roster table body												                  	    *
	 *																				  				*
	 *==============================================================================================*/
	_buildTableBody()
	{
		var self=this;
		$(this.rosterBody).empty();
		this._buildRosterRows();
	
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build Roster table caption row										                  	    *
	 *																				  				*
	 *==============================================================================================*/
	_buildTableCaptionRow()
	{
		var cell,row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var actualHourCell =SimpleCellFactory.ActualHourCell;
		var lastMonthCell=SimpleCellFactory.LastMonthCell;
		var nameCell=SimpleCellFactory.NameCell;
		var noOfWorkingDayCell=SimpleCellFactory.NoOfWorkingDayCell; 
		var thisMonthCell=SimpleCellFactory.ThisMonthCell;
		var captionCell=SimpleCellFactory.CaptionCell;
		var totalCell=SimpleCellFactory.TotalCell;
		var totalHourCell=SimpleCellFactory.TotalHourCell;
		row.appendChild(nameCell);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
		}
		row.appendChild(captionCell);
		row.appendChild(totalHourCell);
		row.appendChild(actualHourCell);
		row.appendChild(lastMonthCell);
		row.appendChild(thisMonthCell);
		row.appendChild(totalCell);

		for (var i=0;i<4;i++)
		{
			var shiftCountCell=SimpleCellFactory.ShiftCountCell;
			row.appendChild(shiftCountCell);
		}
		row.appendChild(noOfWorkingDayCell);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build Roster table footer row										                  	    *
	 *																				  				*
	 *==============================================================================================*/
	_buildTableFooter()
	{
		$(this.rosterFooter).empty();
		var shiftCellColSpan=11+this.showNoOfPrevDate;
		var row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		var cell=row.insertCell(row.cells.length);
		cell.colSpan=44+this.showNoOfPrevDate;
		cell.innerHTML="<br>";

		cell=SimpleCellFactory.AShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=row.insertCell(row.cells.length);
		cell.colSpan=21;
		cell.rowSpan=10;
		cell.id="autoScheduler"; 
		cell.style.verticalAlign="top";

		cell=row.insertCell(row.cells.length);
		cell.colSpan=10;
		cell.rowSpan=20;
		cell.id="yearlyStat"; 
		cell.style.verticalAlign="top";

		cell=SimpleCellFactory.BShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=SimpleCellFactory.B1ShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=SimpleCellFactory.CShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=SimpleCellFactory.DShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=SimpleCellFactory.D1ShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=SimpleCellFactory.D2ShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=SimpleCellFactory.D3ShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=SimpleCellFactory.SickLeaveShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);

		cell=SimpleCellFactory.OShiftLegendCell;
		cell.colSpan=shiftCellColSpan;
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		row.appendChild(cell);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build Roster table header row										                  	    *
	 *																				  				*
	 *==============================================================================================*/
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
		this._buildSelectRosterMonthRow();
		
		this._buildHolidayRow();
		this._buildWeekDayRow();
		this._buildDateRow();
		
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Build the week day row										                  	            *
	 *																				  				*
	 *==============================================================================================*/
	_buildWeekDayRow()
	{
		var dateObj;
		var borderedActualHourCell=SimpleCellFactory.BorderedActualHourCell;
		var hourOffDueCell=SimpleCellFactory.HourOffDueCell;
		var borderedTotalHourCell=SimpleCellFactory.BorderedTotalHourCell;
		var weekDayNameCell=SimpleCellFactory.WeekDayNameCell;
		$(this.rosterWeekDayRow).empty();
		
		borderedActualHourCell.innerHTML="Actual<br>Hour";
		borderedTotalHourCell.innerHTML="Total<br>Hour";
		borderedActualHourCell.rowSpan=2;
		borderedTotalHourCell.rowSpan=2;
		this.rosterWeekDayRow.appendChild(weekDayNameCell);
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			var dateCell=SimpleCellFactory.DateCell;
			this.rosterWeekDayRow.appendChild(dateCell);
		}
		for (var i=0;i<31;i++)
		{
			var weekDayCell=new WeekDayCell();
			this.rosterWeekDayRow.appendChild(weekDayCell);
			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i];
				weekDayCell.setDateObj(dateObj);
				if ((dateObj.publicHoliday==true)||(dateObj.dayOfWeek=="S")||(dateObj.dayOfWeek=="Su"))
				{
					$(weekDayCell).addClass(Css.phCellClassName);
				}
				else
					this.noOfWorkingDay++;
			}
		}
		this.rosterWeekDayRow.appendChild(borderedTotalHourCell);
		this.rosterWeekDayRow.appendChild(borderedActualHourCell);
		this.rosterWeekDayRow.appendChild(hourOffDueCell);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Get date object list and Roster data list							                  	    *
	 *																				  				*
	 *==============================================================================================*/
	async _getData()
	{
		var self=this;
		
		this.dateObjList=await this.utility.getDateList(this.rosterYear,this.rosterMonth); 
		this.rosterList=await this.utility.getRosterList(this.rosterYear,this.rosterMonth);
	}
}
customElements.define('roster-table',
		 RosterTable, {
			extends: 'table'
		}); 