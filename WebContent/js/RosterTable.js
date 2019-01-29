class RosterTable
{
	constructor(container)
	{
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
		this.rosterBody=document.createElement("tbody");
		this.rosterFooter=document.createElement("tFoot");
		this.rosterHeader=document.createElement("thead");
		
		this.rosterTable=document.createElement("table");
		this.rosterMonthRow,this.rosterHolidayRow,this.rosterWeekDayRow,this.rosterDateRow;
		this.rosterList=null;
		this.rosterRule=new RosterRule();
		this.showNoOfPrevDate=0;
		this.utility=new Utility();
		
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
//========================================================
	_buildDateRow()
	{
		var now=new Date(); 
		$(this.rosterDateRow).empty();
		var cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		//cell.className="nameCell borderCell";
		$(cell).addClass(this.borderCellClassName);
		$(cell).addClass(this.nameCellClassName);
		cell.innerHTML="Resident Support<br>Team Members";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.dataCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.dataCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
			if (i<Object.keys(this.dateObjList).length)
			{
				cell.textContent=(i+1);
				if ((this.rosterYear==now.getFullYear()) &&
					(this.rosterMonth==(1+now.getMonth())) &&
					((i+1)==(now.getDate())))
					$(cell).addClass(this.highlightClassName);	
			}
		}
	
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Last<br>Month";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="This<br>Month";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total No. of <br>A Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total No. of <br>Bx Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total No. of <br>C Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Total No. of <br>Dx Shift";
		
		cell=this.rosterDateRow.insertCell(this.rosterDateRow.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
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
		//cell.className="borderCell alignLeft";
		$(cell).addClass(this.borderCellClassName);
		$(cell).addClass(this.alignLeftClassName);
		cell.innerHTML=rosterDataList.itoname+"<br>"+rosterDataList.itopostName+" Extn. 2458";
		
		var index=Object.keys(rosterDataList.previousMonthShiftList).length-this.showNoOfPrevDate+1;
		for (i=index;i<=Object.keys(rosterDataList.previousMonthShiftList).length;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.textContent=rosterDataList.previousMonthShiftList[i];
			cell.className=this.utility.getShiftCssClassName(rosterDataList.previousMonthShiftList[i]);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		for (i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);

			if (i<Object.keys(this.dateObjList).length)
			{
				//cell.className+=" cursorCell shiftCell";
				$(cell).addClass(this.cursorCellClassName);
				$(cell).addClass(this.shiftCellClassName);
				shiftType=rosterDataList.shiftList[i+1];
				if (shiftType!=null)
				{
					cell.textContent=shiftType;
					$(cell).addClass(this.utility.getShiftCssClassName(shiftType));
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
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_actualHour";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_lastMonthBalance";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_thisMonthHourTotal";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
				
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_thisMonthBalance";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_aShiftCount";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_bxShiftCount";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_cShiftCount";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_dxShiftCount";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		
		cell=row.insertCell(row.cells.length);
		cell.id=itoId+"_noOfWoringDay";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);

		this._updateShiftCount(itoId,totalHour,actualWorkingHour,rosterDataList.balance,thisMonthHourTotal,thisMonthBalance,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount);
	}
	_buildHolidayRow()
	{
		var dateObj;
		$(this.rosterHolidayRow).empty();
		var cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
		//cell.className="nameCell borderCell";
		$(cell).addClass(this.borderCellClassName);
		$(cell).addClass(this.nameCellClassName);
		cell.textContent="Holiday";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
			$(cell).addClass(this.dataCellClassName);
			
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterHolidayRow.insertCell(this.rosterHolidayRow.cells.length);
			//cell.className="dataCell alignCenter borderCell phCell";
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
			$(cell).addClass(this.dataCellClassName);
			$(cell).addClass(this.phCellClassName);
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
		//cell.className="borderCell";
		$(cell).addClass(this.borderCellClassName);
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
			var shiftCellHighLighter=new ShiftCellHighLighter(self,self.cursorCellClassName);
		});
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
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalNoOfCellClassName);
		//cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalNoOfCellClassName);
		//cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalNoOfCellClassName);
		//cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.totalNoOfCellClassName);
		//cell.className="totalNoOfCell";
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.noOfWorkingDayClassName);
		//cell.className="noOfWorkingDay";
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
		//cell.className="aShiftColor";
		$(cell).addClass(this.aShiftColorClassName);
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
		//cell.className="bShiftColor";
		$(cell).addClass(this.bShiftColorClassName);
		cell.textContent="b : 1630H - 2215H";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		//cell.className="bShiftColor";
		$(cell).addClass(this.bShiftColorClassName);
		cell.textContent="b1: 1500H - 2215H";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		//cell.className="cShiftColor";
		$(cell).addClass(this.cShiftColorClassName);
		cell.textContent="c : 2145H - 0830H (the next day)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		//cell.className="dShiftColor";
		$(cell).addClass(this.dShiftColorClassName);
		cell.textContent="d : 0800H - 1800H (on weekdays)";

		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		//cell.className="dShiftColor";
		$(cell).addClass(this.dShiftColorClassName);
		cell.textContent="d1 : 0800H - 1700H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		//cell.className="dShiftColor";
		$(cell).addClass(this.dShiftColorClassName);
		cell.textContent="d2 : 0900H - 1800H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		//cell.className="dShiftColor";
		$(cell).addClass(this.dShiftColorClassName);
		cell.textContent="d3 : 0800H - 1648H (on weekdays)";
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		//cell.className="sickLeaveColor";
		$(cell).addClass(this.sickLeaveColorClassName);
		cell.textContent="s : sick leave standby";

		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=shiftCellColSpan;
		//cell.className="oShiftColor";
		$(cell).addClass(this.oShiftColorClassName);
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
		
		//cell.className="nameCell borderCell";
		$(cell).addClass(this.nameCellClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.textContent="Days";
		for (var i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.dataCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		for (var i=0;i<31;i++)
		{
			cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
			//cell.className="dataCell alignCenter borderCell";
			$(cell).addClass(this.dataCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);

			if (i<Object.keys(this.dateObjList).length)
			{
				dateObj=this.dateObjList[i+1];
				if ((dateObj.publicHoliday==true)||(dateObj.dayOfWeek=="SATURDAY")||(dateObj.dayOfWeek=="SUNDAY"))
				{
					//cell.className+=" phCell";	
					$(cell).addClass(this.phCellClassName);
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
		//cell.className="alignCenter borderCell"; 
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.rowSpan=2;
		cell.innerHTML="Total<br>Hour";
		
		cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		//cell.className="alignCenter borderCell"; 
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.rowSpan=2;
		cell.innerHTML="Actual<br>Hour";
		
		cell=this.rosterWeekDayRow.insertCell(this.rosterWeekDayRow.cells.length);
		//cell.className="alignCenter borderCell"; 
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
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