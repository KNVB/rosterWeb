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
	refresh(rosterList)
	{
		this._refreshRosterHeader();
		this._rebuildRosterBody();
		this.shiftCellEventHandler=new ShiftCellEventHandler(this,"shiftCell");
		this._refreshRosterData(rosterList);
	}
	setRosterRule(rosterRule)
	{
		this.rosterRule=rosterRule;
	}
	updateValue(theCell)
	{
		var actualHour=0,cell;
		var shiftRow=theCell.parentElement,shift;
		var aShiftCount=0,bShiftCount=0,cShiftCount=0,dShiftCount=0;
		var totalCell,actualCell,thisMonthHourTotalCell,thisMonthBalanceCell,lastMonthCell;
		var aShiftCountCell,bShiftCountCell,cShiftCountCell,dShiftCountCell,noOfWorkingDayCell;
		var itoId=shiftRow.id.replace("shift_","");
		
		//console.log("itoid="+itoId);
		$(theCell).addClass(this.utility.getShiftCssClassName(theCell.textContent));
		for (var i=1;i<=31;i++)
		{
			cell=shiftRow.cells[i+this.showNoOfPrevDate];
			shift=cell.textContent;
			if (this.rosterRule.shiftHourCount[shift]!=null)
			{	
				actualHour+=this.rosterRule.shiftHourCount[shift];
				switch (shift)
				{
					case "a":
							aShiftCount++;
							break;	
					case "b":
					case "b1":
							bShiftCount++;
							break;
					case "c":
							cShiftCount++;
							break;
					case "d":
					case "d1":
					case "d2":
					case "d3":
							dShiftCount++;
							break;					
				}
				
			}
		}
		totalCell=document.getElementById(itoId+"_totalHour");
		actualCell=document.getElementById(itoId+"_actualHour");
		actualCell.textContent=this.utility.roundTo(actualHour,2);
		lastMonthCell=document.getElementById(itoId+"_lastMonthBalance");
		thisMonthHourTotalCell=document.getElementById(itoId+"_thisMonthHourTotal");
		thisMonthHourTotalCell.textContent=this.utility.roundTo(actualHour-totalCell.textContent,2);
		thisMonthBalanceCell=document.getElementById(itoId+"_thisMonthBalance");
		thisMonthBalanceCell.textContent=this.utility.roundTo(parseFloat(thisMonthHourTotalCell.textContent)+parseFloat(lastMonthCell.textContent),2);

		aShiftCountCell=document.getElementById(itoId+"_aShiftCount");
		aShiftCountCell.textContent=aShiftCount;
			
		bShiftCountCell=document.getElementById(itoId+"_bxShiftCount");
		bShiftCountCell.textContent=bShiftCount;
			
		cShiftCountCell=document.getElementById(itoId+"_cShiftCount");
		cShiftCountCell.textContent=cShiftCount;
			
		dShiftCountCell=document.getElementById(itoId+"_dxShiftCount");
		dShiftCountCell.textContent=dShiftCount;
			
		noOfWorkingDayCell=document.getElementById(itoId+"_noOfWoringDay");
		noOfWorkingDayCell.textContent=(aShiftCount+bShiftCount+cShiftCount+dShiftCount);
	}
//===========================================================================
	_rebuildRosterBody()
	{
		var cell,i,ito,itoId;
		var self,shiftRow,startIndex;

		self=this;
		$(this.rosterBody).empty();
		for (itoId in this.itoList)
		{
			ito=this.itoList[itoId];
			shiftRow=this.rosterBody.insertRow(this.rosterBody.rows.length);
			shiftRow.id="shift_"+itoId;
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignLeft";
			cell.innerHTML=ito.name+"<br>"+ito.postName+" Extn. 2458";
			
			for (i=0;i<this.showNoOfPrevDate;i++)
			{
				cell=shiftRow.insertCell(shiftRow.cells.length);
				cell.className="borderCell alignCenter dataCell";
				$(cell).on("blur",function()
						{
							self.updateValue(this);
						});
			}
			for (i=1;i<=31;i++)
			{
				cell=shiftRow.insertCell(shiftRow.cells.length);
				if (this.calendarList[i-1]==null)
					cell.className="borderCell alignCenter";
				else	
					cell.className="borderCell alignCenter shiftCell";
			}
			
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_totalHour";

			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_actualHour";

			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_lastMonthBalance";

			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_thisMonthHourTotal";

			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_thisMonthBalance";
			
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_aShiftCount";
			
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_bxShiftCount";
			
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_cShiftCount";
			
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_dxShiftCount";
			
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId+"_noOfWoringDay";

		}	
	}
	_refreshRosterData(rosterList)
	{
		var cell,ito,itoId,shiftList,shiftRow;
		var previousMonthShiftList,previousMonthShiftListStartIndex;
		var startIndex;
		for (itoId in this.itoList)
		{
			ito=this.itoList[itoId];
			previousMonthShiftList=rosterList[itoId].previousMonthShiftList;
			if (previousMonthShiftList.length>this.showNoOfPrevDate)
			{
				startIndex=1;
				shiftRow=document.getElementById("shift_"+itoId);
				previousMonthShiftListStartIndex=previousMonthShiftList.length-this.showNoOfPrevDate;
				for (var i=previousMonthShiftListStartIndex;i<previousMonthShiftList.length;i++)
				{
					cell=shiftRow.cells[startIndex++];
					$(cell).html(previousMonthShiftList[i].shift).blur();
				}
			}
			shiftList=rosterList[itoId].shiftList;
			if (Object.keys(shiftList).length>0)
			{
				cell=document.getElementById(itoId+"_totalHour");
				cell.textContent=this.utility.roundTo(this.workingDayCount*ito.workingHourPerDay,2);
				cell=document.getElementById(itoId+"_lastMonthBalance");
				cell.textContent=this.utility.roundTo(rosterList[itoId].lastMonthBalance,2);

				for (var i=1;i<=31;i++)
				{
					cell=shiftRow.cells[i+this.showNoOfPrevDate];
					if(shiftList[i]!=null)
					{
						$(cell).html(shiftList[i]).blur();
					}
				}
			}
		}
	}
	_refreshRosterHeader()
	{
		var i,cell,holidayCell,weekdayCell,dateCell;
		this.workingDayCount=this.calendarList.length;
		for (i=1;i<=31;i++)
		{
			holidayCell=this.holidayRow.cells[i+this.showNoOfPrevDate];
			weekdayCell=this.weekdayRow.cells[i+this.showNoOfPrevDate];
			dateCell=this.dateRow.cells[i+this.showNoOfPrevDate];
			if (this.calendarList.length>=i)
			{
				if (this.calendarList[i-1].isHoliday)
				{
					holidayCell.textContent="PH";
				}
				else
				{
					holidayCell.textContent="";
				}
				
				switch (this.calendarList[i-1].weekday)
				{
					case "S":
					case "Su":
							this.workingDayCount--;
							weekdayCell.className+=" phCell";
							break;
					default:
							if (this.calendarList[i-1].isHoliday)
							{	
								this.workingDayCount--;
								weekdayCell.className+=" phCell";
							}
							else	
								$(weekdayCell).removeClass("phCell");
							break
				}			
				weekdayCell.textContent=this.calendarList[i-1].weekday;
				dateCell.textContent=i;
			}
			else
			{
				holidayCell.textContent="";
				weekdayCell.textContent="";
				dateCell.textContent="";
			}
		}
	}

}