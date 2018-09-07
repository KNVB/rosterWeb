class RosterTable
{
	constructor(utility,rosterScheduler)
	{
		var self=this;
		this.month=1;
		this.year=1970;
		this.rosterRule=null;
		this.utility=utility;
		this.shiftAStdDev=0.0;
		this.shiftBStdDev=0.0;
		this.shiftCStdDev=0.0;
		this.calendarList=null;

		this.showNoOfPrevDate=2;
		this.firstDate=new Date();
		this.totalHourCellIndex=34;
		this.shiftStartCellIndex=3;
		this.averageShiftStdDev=0.0;
		this.allPreviousMonthShiftList=[];
		
		this.table=document.getElementById("rosterTable");
		this.rosterFooter=document.getElementById("footer");
		this.rosterBody=document.getElementById("rosterBody");
		this.genResultTable=document.getElementById("genResult");
		this.rosterHeader=document.getElementById("rosterHeader");
		
		this.englishMonthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
		
		$(".findMissingShiftButton").on("click",function(){
			self.haveMissingShift();
		});
		$(".findDuplicateShiftButton").on("click",function(){
			self.haveDuplicateShift();
		});
		$(".clearAllButton").on("click",function(){
			self.clearAllShift();
		});
		
		$(".checkAllButton").on("click",function(){
			rosterScheduler.validate();	
		});
		
		$(".autoPlannerButton").on("click",function(){
			rosterScheduler.autoAssign();
		});
		
		$(".exportButton").on("click",function(){
			rosterScheduler.exportRosterToExcel();
		});
		$(".saveRosterToDBButton").on("click",function(){
			rosterScheduler.saveAllData();
		});
		
		
		$("#theLowestSD").on("click",function(){
			rosterScheduler.loadLowestSDRoster(0);
		});
		$("#secondLowestSD").on("click",function(){
			rosterScheduler.loadLowestSDRoster(1);
		});
		$("#thirdLowestSD").on("click",function(){
			rosterScheduler.loadLowestSDRoster(2);
		});
		
		$("#theLowestMissingShiftCount").on("click",function(){
			rosterScheduler.loadMissingShiftRoster(0);
		});
		$("#theSecondLowestMissingShiftCount").on("click",function(){
			rosterScheduler.loadMissingShiftRoster(1);
		});
		$("#theThirdLowestMissingShiftCount").on("click",function(){
			rosterScheduler.loadMissingShiftRoster(2);
		});
		
	}
	setRosterRule(rosterRule)
	{
		this.rosterRule=rosterRule;
	}
	init(year,month,rosterScheduler)
	{
		this.year=year;
		this.month=month;
		$(this.rosterFooter).hide();
		this._genRosterCaption();
		this._genRosterMonthRow(rosterScheduler);
		this._genEmptyRow();
		this._genRosterHeader();
		this._genRosterBody();
		this._initAutoPlanDropDown();
		$(this.rosterFooter).show();
	}
	loadRoster(finalRoster)
	{
		var row,cell,thisITOShiftList;
		for (var itoId in finalRoster.rosterData)
		{
			row=document.getElementById("shift_"+itoId);
			thisITOShiftList=finalRoster.rosterData[itoId];
			for (var dateIndex=0;dateIndex<thisITOShiftList.length;dateIndex++)
			{
				cell=row.cells[finalRoster.startDate+this.showNoOfPrevDate+dateIndex];
				$(cell).html(thisITOShiftList[dateIndex]).blur();
			}
		}
		this.haveMissingShift();
	}
	loadRosterData(rosterList)
	{
		var preferredShiftList,startIndex,cell,ito,diff;
		var previousMonthShiftList,previousMonthShiftListStartIndex;
		var shiftList,itoId,shiftRow,shiftDate,shiftRecord,preferredShiftRow;
	
		this.allPreviousMonthShiftList=[];
		for (var itoId in this.itoList)
		{
			ito=this.itoList[itoId];
			shiftList=rosterList[itoId].shiftList;
			shiftRow=document.getElementById("shift_"+itoId);
			preferredShiftRow=document.getElementById("preferredShift_"+itoId);

			preferredShiftList=rosterList[itoId].preferredShiftList;
			previousMonthShiftList=rosterList[itoId].previousMonthShiftList;
			if (previousMonthShiftList.length>this.showNoOfPrevDate)
			{
				previousMonthShiftListStartIndex=previousMonthShiftList.length-this.showNoOfPrevDate;
				this.allPreviousMonthShiftList[itoId]=previousMonthShiftList;
				//console.log(previousMonthShiftListStartIndex,previousMonthShiftList.length,this.showNoOfPrevDate);
				
				startIndex=1;
				cell=document.getElementById(itoId +"_lastMonthBalance");
				cell.textContent=rosterList[itoId].lastMonthBalance;
				
				//console.log(previousMonthShiftListStartIndex,previousMonthShiftList.length);
				for (var i=previousMonthShiftListStartIndex;i<previousMonthShiftList.length;i++)
				{
					cell=shiftRow.cells[startIndex++];
					$(cell).html(previousMonthShiftList[i].shift).blur();
				}
			}
			for (var i=0;i<shiftList.length;i++)
			{
				cell=shiftRow.cells[startIndex++];
				$(cell).html(shiftList[i].shift).blur();
			}
			for (var i=0;i<preferredShiftList.length;i++)
			{
				shiftRecord=preferredShiftList[i];
				shiftDate=new Date(shiftRecord.shiftDate);
				cell=preferredShiftRow.cells[shiftDate.getDate()+this.showNoOfPrevDate];
				$(cell).html(shiftRecord.shift);
				//console.log(shiftDate.getDate(),shiftRecord.shift);
			}	
		}
		this.haveMissingShift();
	}
//-----------------------------------------------------------------------------------------------------------------------------
	_initAutoPlanDropDown()
	{
		var i;
		var autoPlannStartDateSelectBox=document.getElementById("autoPlannStartDate");
		var autoPlanEndDateSelectBox=document.getElementById("autoPlanEndDate");
		
		$(autoPlannStartDateSelectBox).empty();
		$(autoPlanEndDateSelectBox).empty();
		for (i=1;i<=this.calendarList.length;i++)
		{
			$(autoPlannStartDateSelectBox).append("<option value="+i+">"+i+"</option>");
			$(autoPlanEndDateSelectBox).append("<option value="+i+">"+i+"</option>");
		}
		autoPlanEndDateSelectBox.options[i-2].selected=true;
	}
	_genRosterBody()
	{
		var i,ito;
		var self=this;
		var cell,shiftCell,preferredCell;
		var shiftRow,preferredShiftRow,vancantShiftRow;
		var shiftList,itoRoster,columnCount;
		$(this.rosterBody).empty();
		for (var itoId in this.itoList)
		{
			ito=this.itoList[itoId];
			//itoRoster=this.rosterList[itoId];
			shiftRow=this.rosterBody.insertRow(this.rosterBody.rows.length);
			preferredShiftRow=this.rosterBody.insertRow(this.rosterBody.rows.length);
			
			shiftRow.id="shift_"+itoId;
			preferredShiftRow.id="preferredShift_"+itoId;
			cell=shiftRow.insertCell(shiftRow.cells.length);
			
			cell.className="borderCell alignLeft";
			cell.innerHTML=ito.name+"<br>"+ito.postName+" Extn. 2458";
			
			cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
			cell.className="alignLeft borderCell";
			cell.innerHTML="Preferred Shift";
			
			for (i=0;i<this.showNoOfPrevDate;i++)
			{
				cell=shiftRow.insertCell(shiftRow.cells.length);
				cell.className="borderCell alignCenter dataCell";
				$(cell).on("blur",function()
						{
							self._updateValue(this);
						});
				cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
				cell.className="borderCell alignCenter dataCell";
			}
			
			for (i=0;i<31;i++)
			{
				shiftCell=shiftRow.insertCell(shiftRow.cells.length);
				preferredCell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
				
				shiftCell.className="borderCell alignCenter";
				preferredCell.className="borderCell alignCenter";
				if (i<this.calendarList.length)
				{
					shiftCell.contentEditable="true";
					preferredCell.contentEditable="true";
					shiftCell.className+=" shiftCell";
					preferredCell.className+=" shiftCell";
					/*
					$(shiftCell).on("blur",function(){
						self._updateValue(this);
					});
					$(shiftCell).keydown(function(event){
				 		self._inputCellKeyDownHandlder(event,this);
					});
					
					$(preferredCell).keydown(function(event){
				 		self._inputCellKeyDownHandlder(event,this);
					});
					$(preferredCell).on("blur",function(){
						this.className="borderCell alignCenter";
					});*/
				}	
			}
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.textContent=Math.round(this.workingDayCount*ito.workingHourPerDay*100)/100;
			
			cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
			cell.className="borderCell alignCenter";

			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			
			cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
			cell.className="borderCell alignCenter";

			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			//cell.textContent=itoRoster.lastMonthBalance;
			cell.id=itoId +"_lastMonthBalance";
			
			cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
			cell.className="borderCell alignCenter";
			
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId +"_thisMonthHourTotal";
			
			cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
			cell.className="borderCell alignCenter";
			
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="borderCell alignCenter";
			cell.id=itoId +"_thisMonthBalance";
			
			cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
			cell.className="borderCell alignCenter";

			for (i=0;i<5;i++)
			{
				cell=shiftRow.insertCell(shiftRow.cells.length);
				cell.className="borderCell alignCenter";
			
				cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
				cell.className="borderCell alignCenter";
			}
		}	
	}		
	_genRosterHeader()
	{
		var i,cell,holidayCell,daysCell,datesCell;
		var holidayRow,daysRow,datesRow;

		holidayRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		daysRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		datesRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
				
		cell=holidayRow.insertCell(holidayRow.cells.length);
		cell.className="nameCell borderCell";
		cell.textContent="Holiday";
		
		cell=daysRow.insertCell(daysRow.cells.length);
		cell.className="nameCell borderCell";
		cell.textContent="Days";
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="nameCell borderCell";
		cell.innerHTML="Resident Support<br>Team Members";
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=holidayRow.insertCell(holidayRow.cells.length);
			cell.className="dataCell alignCenter borderCell";
			
			cell=daysRow.insertCell(daysRow.cells.length);
			cell.className="dataCell alignCenter borderCell";
			
			cell=datesRow.insertCell(datesRow.cells.length);
			cell.className="dataCell alignCenter borderCell";
		}
		//console.log(this.calendarList);
		this.workingDayCount=this.calendarList.length;
		for (i=0;i<31;i++)
		{
			holidayCell=holidayRow.insertCell(holidayRow.cells.length);
			holidayCell.className="dataCell alignCenter borderCell phCell";
			
			daysCell=daysRow.insertCell(daysRow.cells.length);
			daysCell.className="dataCell alignCenter borderCell";
			
			datesCell=datesRow.insertCell(datesRow.cells.length);
			datesCell.className="dataCell alignCenter borderCell";
			
			if (this.calendarList.length>i)
			{	
				datesCell.textContent=(i+1);
				daysCell.textContent=this.calendarList[i].weekday;
				switch (this.calendarList[i].weekday)
				{
					case "S":
					case "Su":
							daysCell.className+=" weekend";
							this.workingDayCount--;
							break;
					default:
							if (this.calendarList[i].isHoliday)
							{
								holidayCell.textContent="PH";
								daysCell.className+=" weekend";
								this.workingDayCount--;
							}
							break;
				}
			}
		}
		//console.log(this.workingDayCount);
		cell=holidayRow.insertCell(holidayRow.cells.length);
		cell.className="borderCell";
		cell.colSpan=10;
		
		cell=daysRow.insertCell(daysRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total<br>Hour";
		cell.rowSpan=2;
		
		cell=daysRow.insertCell(daysRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Actual<br>Hour";
		cell.rowSpan=2;
		
		cell=daysRow.insertCell(daysRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Hour Off Due";
		cell.colSpan=8;
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Last<br>Month";
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="This<br>Month";

		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total";
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of<br>A shift";

		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of<br>Bx shift";
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of<br>C shift";

		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="Total No. of<br>Dx shift";

		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.innerHTML="No. of<br>working<br>day";
	}	
	_genEmptyRow()
	{
		var i,cell;
		var rosterEmptyRow;
		rosterEmptyRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		
		cell=rosterEmptyRow.insertCell(rosterEmptyRow.cells.length);
		cell.colSpan=44;				
	}
	_genRosterMonthRow(rosterScheduler)
	{
		var i,cell;
		var rosterMonthRow;
		var self=this;
		rosterMonthRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		rosterMonthRow.id="rosterMonthRow";
		cell=rosterMonthRow.insertCell(rosterMonthRow.cells.length);
		cell.className="nameCell";
		
		cell=rosterMonthRow.insertCell(rosterMonthRow.cells.length);
		cell.colSpan=2;
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
		cell.className="underlineText alignCenter rosterMonthSelectCell";
		monthSelect.className="underlineText rosterMonthSelect";
		monthSelect.onchange=function(){
			
			var month=parseInt(this.options[this.selectedIndex].value);
			var year=parseInt(this.nextSibling.textContent);
			rosterScheduler.init(year,month);
		};
		cell.append(document.createTextNode(this.year));
		cell=rosterMonthRow.insertCell(rosterMonthRow.cells.length);
		cell.colSpan=10;
	}
	_genRosterCaption()
	{
		var i,cell;
		//this.rosterHeader=this.table.createTHead();
		$(this.rosterHeader).empty();
		var captionRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.className="nameCell";
		
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.colSpan=2;
		
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		cell.className="alignCenter titleCell underlineText";
		cell.colSpan=31;
		
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.innerHTML="<br>";
		cell.className="totalHourCell";
		
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.innerHTML="<br>";
		cell.className="actualHourCell";

		cell=captionRow.insertCell(captionRow.cells.length);
		cell.innerHTML="<br>";
		cell.className="lastMonthCell";
		
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.innerHTML="<br>";
		cell.className="thisMonthCell";
				
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.innerHTML="<br>";
		cell.className="totalCell";

		for (i=0;i<4;i++)
		{
			cell=captionRow.insertCell(captionRow.cells.length);
			cell.innerHTML="<br>";
			cell.className="totalNoOfCell";
		}
		
		cell=captionRow.insertCell(captionRow.cells.length);
		cell.innerHTML="<br>";
		cell.className="noOfWorkingDay";		
	}
	_updateValue(theCell)
	{
		var shiftRow=theCell.parentElement;
		var itoId=shiftRow.id.replace("shift_","");
		var shift=theCell.textContent;
		if (shift=="")
		{
			theCell.className="borderCell alignCenter";
			if (theCell.cellIndex>=this.shiftStartCellIndex)
				this._reCalculate(shiftRow);
		}
		else
		{
			var ito=this.itoList[itoId];
			if (ito.isValidShift(shift))
			{
				theCell.className="borderCell alignCenter";
				switch (shift)
				{
					case "a":
							theCell.className+=" aShiftColor";
							break;	
					case "b":
					case "b1":
							theCell.className+=" bShiftColor";
							break;
					case "c":
							theCell.className+=" cShiftColor";
							break;
					case "d":
					case "d1":
					case "d2":
					case "d3":
							theCell.className+=" dxShiftColor";
							break;
					case "O":
							theCell.className+=" oShiftColor";
							break;
				}
				if (theCell.cellIndex>=this.shiftStartCellIndex)
					this._reCalculate(shiftRow);
			}
		}
	}
	_reCalculate(shiftRow,shift)
	{
		var i,shift;
		var actualHour=0,shiftCount,myShiftRow;
		var aShiftCount=0,bShiftCount=0,cShiftCount=0,dShiftCount=0;
		var totalCell,actualCell,thisMonthCell,thisMonthBalanceCell,lastMonthCell;
		var aShiftCountCell,bShiftCountCell,cShiftCountCell,dShiftCountCell,noOfWorkingDayCell;
		actualCell=shiftRow.cells[this.totalHourCellIndex+1];
		totalCell=shiftRow.cells[this.totalHourCellIndex];
		lastMonthCell=shiftRow.cells[this.totalHourCellIndex+2];
		thisMonthCell=shiftRow.cells[this.totalHourCellIndex+3];
		thisMonthBalanceCell=shiftRow.cells[this.totalHourCellIndex+4];
		aShiftCountCell=shiftRow.cells[this.totalHourCellIndex+5];
		bShiftCountCell=shiftRow.cells[this.totalHourCellIndex+6];
		cShiftCountCell=shiftRow.cells[this.totalHourCellIndex+7];
		dShiftCountCell=shiftRow.cells[this.totalHourCellIndex+8];
		noOfWorkingDayCell=shiftRow.cells[this.totalHourCellIndex+9];
		for (i=this.shiftStartCellIndex;i<this.totalHourCellIndex;i++)
		{
			shift=shiftRow.cells[i].textContent;
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
		actualCell.textContent=this.utility.roundTo(actualHour,2);
		
		thisMonthCell.textContent=this.utility.roundTo((parseFloat(actualHour)-parseFloat(totalCell.textContent)),2);
		thisMonthBalanceCell.textContent=this.utility.roundTo((parseFloat(thisMonthCell.textContent)+parseFloat(lastMonthCell.textContent)),2);
		
		//update total no. of varies shift value
		aShiftCountCell.textContent=aShiftCount;
		this._updateStandardDevValue("A",aShiftCountCell.cellIndex);
		
		bShiftCountCell.textContent=bShiftCount;
		this._updateStandardDevValue("B",bShiftCountCell.cellIndex);
		
		cShiftCountCell.textContent=cShiftCount;
		this._updateStandardDevValue("C",cShiftCountCell.cellIndex);
		
		dShiftCountCell.textContent=dShiftCount;
		
		noOfWorkingDayCell.textContent=(aShiftCount+bShiftCount+cShiftCount+dShiftCount);
		
	}
	_updateStandardDevValue(shiftName,cellIndex)
	{
		
		var shiftCount=[];
		var rows=this._getAllShiftRow(),row;
		for (var itoId in rows)
		{
			row=rows[itoId];
			
			if ((row.cells[cellIndex].textContent!="") &&(row.cells[cellIndex].textContent!="N.A."))
			{	
				shiftCount.push(parseInt(row.cells[cellIndex].textContent));
			}
		}

		if (shiftCount.length>0)
		{
			var value=this.utility.getSD(shiftCount);
			//console.log(shiftCount,value);
			eval("this.shift"+shiftName+"StdDev="+value);
			document.getElementById("shift"+shiftName+"StdDev").textContent=this.utility.roundTo(value,2);
		}
		shiftCount=[];
		shiftCount.push(this.shiftAStdDev);
		shiftCount.push(this.shiftBStdDev);
		shiftCount.push(this.shiftCStdDev);
		this.averageShiftStdDev=this.utility.getMean(shiftCount);
		document.getElementById("avgStdDev").textContent=this.utility.roundTo(this.averageShiftStdDev,2);
		//console.log("++++++++++++++++++++++++++++++++");
	}
	
}