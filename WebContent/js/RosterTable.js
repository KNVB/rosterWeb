class RosterTable
{
	constructor(container)
	{
		var self=this;
		this.utility=new Utility();
		this.rosterList=null;
		this.rosterRule=new RosterRule();
		this.showNoOfPrevDate=0;
		this.dateObjList=null;
		
		this.rosterBody=document.createElement("tbody");
		this.rosterFooter=document.createElement("tFoot");
		this.rosterHeader=document.createElement("thead");
		
		this.rosterTable=document.createElement("table");
		this.rosterMonthRow,this.rosterHolidayRow,this.rosterWeekDayRow,this.rosterDateRow;
		
		this.rosterBody.id="rosterBody";
		this.rosterFooter.id="rosterFooter";
		this.rosterHeader.id="rosterHeader";
		this.rosterTable.id="rosterTable";
		
		this.rosterTable.append(this.rosterHeader);
		
		$(this.rosterTable).attr("border","0");
		this.container=container;
		
		container.append(this.rosterTable);
		this.rosterTable.append(this.rosterHeader);
		this.rosterTable.append(this.rosterBody);
		this.rosterTable.append(this.rosterFooter);
	}
	build(year,month)
	{
		var self=this;
		this.rosterYear=year;
		this.rosterMonth=month;
		this.noOfWorkingDay=0;

		this._buildTableHeader();
		this._buildTableBody();
		this._buildTableFooter();

		var mP=new MonthPicker({elements:$("#rosterMonth"),initYear:this.rosterYear,minValue: "01/2017"});
		mP.onPick(function (year,month){
			self.build(year,month);
		});

	}
	markCoorindate(theCell)
	{
		var row=theCell.parentElement;
		var dateRow=document.getElementById("dateRow");
		
		var cell=dateRow.cells[theCell.cellIndex];
		$(cell).addClass("highlight");
		cell=row.cells[0];
		$(cell).addClass("highlight");
	}
	unMarkCoorindate(theCell)
	{
		var row=theCell.parentElement;
		var dateRow=document.getElementById("dateRow");
		var cell=dateRow.cells[theCell.cellIndex];
		$(cell).removeClass("highlight");
		cell=row.cells[0];
		$(cell).removeClass("highlight");
	}
//========================================================
	_buildDateRow()
	{
		var now=new Date(); 
		$(this.rosterDateRow).empty();
		var cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="nameCell borderCell";
		cell.innerHTML="Resident Support<br>Team Members";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
			cell.className="dataCell alignCenter borderCell";
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
			cell.className="dataCell alignCenter borderCell";
			
			if (i<Object.keys(this.dateObjList).length)
			{
				cell.textContent=(i+1);
				if ((this.rosterYear==now.getFullYear()) &&
					(this.rosterMonth==(1+now.getMonth())) &&
					((i+1)==(now.getDate())))
					cell.className+=" highlight";	
			}
		}
	
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Last<br>Month";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="This<br>Month";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of <br>A Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of <br>Bx Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of <br>C Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of <br>Dx Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="No. of <br>working<br>day";
	}
	_buildITORow(itoId)
	{
		var aShiftCount=0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0,balance=0.0;
		var	actualWorkingHour=0.0,thisMonthHourTotal=0.0,thisMonthBalance=0.0;

		var cell,i;
		var rosterDataList=this.rosterList[itoId]
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		var shiftType;
		cell=row.insertCell(row.cells.length);
		row.id="shift_"+itoId;
		cell.className="borderCell alignLeft";
		cell.innerHTML=rosterDataList.itoname+"<br>"+rosterDataList.itopostName+" Extn. 2458";
		
		var index=Object.keys(rosterDataList.previousMonthShiftList).length-this.showNoOfPrevDate+1;
		for (i=index;i<=Object.keys(rosterDataList.previousMonthShiftList).length;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.textContent=rosterDataList.previousMonthShiftList[i];
			cell.className=this.utility.getShiftCssClassName(rosterDataList.previousMonthShiftList[i]);
			cell.className+=" alignCenter borderCell";
		}
		for (i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="alignCenter borderCell";

			if (i<Object.keys(this.dateObjList).length)
			{
				cell.className+=" cursorCell shiftCell";
				shiftType=rosterDataList.shiftList[i+1];
				if (shiftType!=null)
				{
					cell.textContent=shiftType;
					cell.className+=" "+this.utility.getShiftCssClassName(shiftType);
					actualWorkingHour+=this.rosterRule.shiftHourCount[shiftType];
					switch(shiftType)
					{
						case "a":
								aShiftCount++;
								break;
						case "b":
						case "b1":
								bxShiftCount++;
								break;
						case "c":
								cShiftCount++;
								break;
						case "d":
						case "d1":
						case "d2":
						case "d3":
								dxShiftCount++;
								break;		
					}
				}	
			}	
		}	
		var totalHour=rosterDataList.itoworkingHourPerDay*this.noOfWorkingDay;
		thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=thisMonthHourTotal+rosterDataList.balance;
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_totalHour";
		cell.className="alignCenter borderCell";
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_actualHour";
		cell.className="alignCenter borderCell";
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_lastMonthBalance";
		cell.className="alignCenter borderCell";
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_thisMonthHourTotal";
		cell.className="alignCenter borderCell";
				
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_thisMonthBalance";
		cell.className="alignCenter borderCell";
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_aShiftCount";
		cell.className="alignCenter borderCell";
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_bxShiftCount";
		cell.className="alignCenter borderCell";
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_cShiftCount";
		cell.className="alignCenter borderCell";
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_dxShiftCount";
		cell.className="alignCenter borderCell";
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_noOfWoringDay";
		cell.className="alignCenter borderCell";

		this._updateShiftCount(itoId,totalHour,actualWorkingHour,rosterDataList.balance,thisMonthHourTotal,thisMonthBalance,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount);
	}
	_buildHolidayRow()
	{
		var dateObj;
		$(this.rosterHolidayRow).empty();
		var cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
		cell.className="nameCell borderCell";
		cell.textContent="Holiday";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
			cell.className="dataCell alignCenter borderCell";
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
			cell.className="dataCell alignCenter borderCell phCell";
			
			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i+1];
				if(dateObj.publicHoliday==true)
				{
					cell.textContent="PH";
				}
			}
		}
		cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
		cell.colSpan=10;
		cell.className="borderCell";
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
		var input,span;
		var self=this;
		$(this.rosterMonthRow).empty();
		var cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		cell.className="nameCell";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		}
		cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
		cell.className="alignCenter rosterMonthSelectCell";
		cell.colSpan=31;
		
		span=document.createElement("span");
		span.innerHTML="<&nbsp;&nbsp;";
		span.className="underlineText clickable";
		cell.append(span);
		$(span).click(function(){
			self._buildPreviousMonth();	
		});
		
		span=document.createElement("span");
		span.id="rosterMonth";
		span.className="underlineText clickable";
		span.textContent=this.utility.monthNames[this.rosterMonth]+" "+this.rosterYear;
		cell.append(span);	
	
		span=document.createElement("span");
		span.innerHTML="&nbsp;&nbsp;>";
		span.className="underlineText clickable";
		cell.append(span);		
		$(span).click(function(){
			self._buildNextMonth();	
		});
		
		cell=this.rosterMonthRow.insertCell(this.rosterMonthRow.cells.length);
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
			var shiftCellHighLighter=new ShiftCellHighLighter(self,"cursorCell");
		});
	}
	_buildTableCaptionRow()
	{
		var row=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		var cell=row.insertCell(row.cells.length);
		cell.className="nameCell";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
		}
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter titleCell underlineText";
		cell.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		cell.colSpan=31;
		cell=row.insertCell(row.cells.length);
		cell.className="totalHourCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="actualHourCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="lastMonthCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="thisMonthCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		cell.className="noOfWorkingDay";
	}	
	_buildTableFooter()
	{
		$(this.rosterFooter).empty();
		var shiftCellColSpan=11+this.showNoOfPrevDate;
		var row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		var cell=row.insertCell(row.cells.length);
		cell.colSpan=44+this.showNoOfPrevDate;
		cell.innerHTML="<br>";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="aShiftColor";
		cell.textContent="a : 0800H - 1700H";
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=21;
		cell.rowSpan=10;
		cell.id="autoScheduler"; 
		cell.style.verticalAlign="top";
		//this._buildSchedulerButton(cell);
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=10;
		cell.rowSpan=20;
		cell.id="yearlyStat"; 
		cell.style.verticalAlign="top";
		//this._buildStatisticReport(cell);
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="bShiftColor";
		cell.textContent="b : 1630H - 2215H";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="bShiftColor";
		cell.textContent="b1: 1500H - 2215H";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="cShiftColor";
		cell.textContent="c : 2145H - 0830H (the next day)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="dShiftColor";
		cell.textContent="d : 0800H - 1800H (on weekdays)";

		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="dShiftColor";
		cell.textContent="d1 : 0800H - 1700H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="dShiftColor";
		cell.textContent="d2 : 0900H - 1800H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="dShiftColor";
		cell.textContent="d3 : 0800H - 1648H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="sickLeaveColor";
		cell.textContent="s : sick leave standby";

		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		cell.className="oShiftColor";
		cell.textContent="O : dayoff";
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
		$(this.rosterWeekDayRow).empty();
		var cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		
		cell.className="nameCell borderCell";
		cell.textContent="Days";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
			cell.className="dataCell alignCenter borderCell";
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
			cell.className="dataCell alignCenter borderCell";
			
			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i+1];
				if ((dateObj.publicHoliday==true)||(dateObj.dayOfWeek=="SATURDAY")||(dateObj.dayOfWeek=="SUNDAY"))
				{
					cell.className+=" phCell";	
				}
				else
					this.noOfWorkingDay++;
				
				switch (dateObj.dayOfWeek)
				{
					case "MONDAY":
								cell.textContent="M";
								break;	
					case "TUESDAY":
								cell.textContent="T";
								break;	
					case "WEDNESDAY":
								cell.textContent="W";
								break;	
					case "THURSDAY":
								cell.textContent="Th";
								break;	
					case "FRIDAY":
								cell.textContent="F";
								break;	
					case "SATURDAY":
								cell.textContent="S";
								break;	
					case "SUNDAY":
								cell.textContent="Su";
								break;	
				}					
			}
		}
		cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		cell.className="alignCenter borderCell"; 
		cell.rowSpan=2;
		cell.innerHTML="Total<br>Hour";
		
		cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		cell.className="alignCenter borderCell"; 
		cell.rowSpan=2;
		cell.innerHTML="Actual<br>Hour";
		
		cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		cell.className="alignCenter borderCell"; 
		cell.colSpan=8;
		cell.innerHTML="Hour Off Due";
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
	_updateShiftCount(itoId,totalHour,actualWorkingHour,balance,thisMonthHourTotal,thisMonthBalance,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount)
	{
		document.getElementById(itoId+"_totalHour").textContent=this.utility.roundTo(totalHour,2);
		document.getElementById(itoId+"_actualHour").textContent=this.utility.roundTo(actualWorkingHour,2);
		document.getElementById(itoId+"_lastMonthBalance").textContent=this.utility.roundTo(balance,2);
		document.getElementById(itoId+"_thisMonthHourTotal").textContent=this.utility.roundTo(thisMonthHourTotal,2);
		document.getElementById(itoId+"_thisMonthBalance").textContent=this.utility.roundTo(thisMonthBalance,2);
		document.getElementById(itoId+"_aShiftCount").textContent=aShiftCount;
		document.getElementById(itoId+"_bxShiftCount").textContent=bxShiftCount;
		document.getElementById(itoId+"_cShiftCount").textContent=cShiftCount;
		document.getElementById(itoId+"_dxShiftCount").textContent=dxShiftCount;
		document.getElementById(itoId+"_noOfWoringDay").textContent=aShiftCount+bxShiftCount+cShiftCount+dxShiftCount;
	}
}