/**
 * 
 */
class RosterTable
{
	constructor(utility)
	{
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
		this.rosterHeader=document.getElementById("rosterHeader");
		this.englishMonthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];		
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
			preferredShiftList=rosterList[itoId].preferredShiftList;
			previousMonthShiftList=rosterList[itoId].previousMonthShiftList;
			previousMonthShiftListStartIndex=previousMonthShiftList.length-this.showNoOfPrevDate;
			this.allPreviousMonthShiftList[itoId]=previousMonthShiftList;
			//console.log(previousMonthShiftListStartIndex,previousMonthShiftList.length,this.showNoOfPrevDate);
			
			shiftRow=document.getElementById("shift_"+itoId);
			preferredShiftRow=document.getElementById("preferredShift_"+itoId);
			startIndex=1;
			cell=document.getElementById(itoId +"_lastMonthBalance");
			cell.textContent=rosterList[itoId].lastMonthBalance;
			for (var i=previousMonthShiftListStartIndex;i<previousMonthShiftList.length;i++)
			{
				cell=shiftRow.cells[startIndex++];
				$(cell).html(previousMonthShiftList[i].shift).blur();
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
	}
	haveMissingShift()
	{
		var ito,itoId,j,cell,i;
		var shift,shiftRow;
		var haveMissingShift=false;
		var shiftRowList=this._getAllShiftRow();
		
		for (i=this.shiftStartCellIndex;i<this.shiftStartCellIndex+this.calendarList.length;i++)
		{
			var essentialShift=this.rosterRule.getEssentialShift();
			for (var itoId in shiftRowList)
			{
				shiftRow=shiftRowList[itoId];
				ito=this.itoList[itoId];
				cell=shiftRow.cells[i];
				shift=cell.textContent;
				if (shift!="")
				{
					if (ito.isValidShift(shift))
					{
						essentialShift=essentialShift.replace(shift,"");
						if (shift=="b1")
						{
							essentialShift=essentialShift.replace("b","");
						}
					}
					else	
					{
						alert("Invalid shift");
						cell.className="borderCell alignCenter errorRedBlackGround";
						haveMissingShift=true;
						break;
					}	
				}
			}
			document.getElementById("vancantShift").cells[i].innerHTML=essentialShift;
			if (essentialShift!="")
				haveMissingShift=true;
			/*if (haveMissingShift)
				break;*/
		}		
		return haveMissingShift;
	}
	haveDuplicateShift()
	{
		var ito,itoId,j,cell,i;
		var shift,shiftRow;
		var haveDuplicateShift=false;
		var shiftRowList=this._getAllShiftRow();
		for (i=this.shiftStartCellIndex;i<this.shiftStartCellIndex+this.calendarList.length;i++)
		{
			var tempResult=[],temp="";
			for (var itoId in shiftRowList)
			{
				shiftRow=shiftRowList[itoId];
				ito=this.itoList[itoId];
				cell=shiftRow.cells[i];
				shift=cell.textContent;
				if (shift!="")  
				{
					if (ito.isValidShift(shift))
					{	switch (shift)
						{
							case "a":
							case "c":
									if ($.inArray (shift,tempResult)>-1)
									{
										alert("Duplicate Shift Found");
										cell.className="borderCell alignCenter errorRedBlackGround";
										haveDuplicateShift=true;
										break;	
									}
									else
									{	
										$(cell).blur();
										tempResult.push(shift);
									}
									break;
							case "b":		
							case "b1":
									if (($.inArray ("b1",tempResult)>-1) || ($.inArray ("b",tempResult)>-1))
									{
										alert("Duplicate Shift Found");
										cell.className="borderCell alignCenter errorRedBlackGround";
										haveDuplicateShift=true;
										break;	
									}
									else
									{	
										$(cell).blur();
										tempResult.push(shift);
									}
									break;
						}
					}
					else
					{
						alert("Invalid shift detected");
						cell.className="borderCell alignCenter errorRedBlackGround";
						haveDuplicateShift=true;
						break;
					}
				}
			}
			if (haveDuplicateShift)
				break;
		}
		return haveDuplicateShift;
	}
	haveBlackListedShiftPattern()
	{
		var self=this;
		var ito,indices,endIndex;
		var shiftRow,result=false;
		var shiftRowList=this._getAllShiftRow();
		var itoList=this.itoList;
		for (var itoId in shiftRowList)
		{
			shiftRow=shiftRowList[itoId];
			ito=itoList[itoId];
			endIndex=this.shiftStartCellIndex+this.calendarList.length;
			indices=ito.getBlackListedShiftPatternIndex(this._getShiftPattern(shiftRow,endIndex));

			//if Black Listed Shift Pattern found in a shift row
			if (indices.length>0)
			{
				for (var i=this.shiftStartCellIndex;i<endIndex;i++)
				{
					var cell=shiftRow.cells[i];
					
					//if the cell index matched with Black Listed Shift Index
					if ($.inArray (i,indices)>-1)
						shiftRow.cells[i].className="borderCell alignCenter errorRedBlackGround";
					else
					{	
						$(shiftRow.cells[i]).blur(); //reset cell style 
					}
				}
				result=true;
			}
			else
			{
				//reset all cell style in the shift row
				$(shiftRow.cells).blur();  
			}
		}
		return result;
	}
	haveInvalidPreferredShift(startDate,endDate)
	{
		var cell,ito,itoId;
		var result=false,preferredShiftRow;
		var preferredShiftRowList=this._getAllPreferredShiftRow();
		
		for (var itoId in preferredShiftRowList)
		{
			preferredShiftRow=preferredShiftRowList[itoId];
			ito=this.itoList[itoId];
			for(var i=startDate+2;i<=endDate+2;i++)
			{
				cell=preferredShiftRow.cells[i];
				if (!ito.isValidPreferredShift(cell.textContent))
				{	
					cell.className="borderCell alignCenter errorRedBlackGround";
					result=true;
				}
				else
					cell.className="borderCell alignCenter";
			}
		}
		return result;
	}
	clearAllShift()
	{
		var itoId,shiftRow,shiftRows=this._getAllShiftRow();
		var vancantShiftRow=document.getElementById("vancantShift");
		for (var itoId in shiftRows)
		{
			shiftRow=shiftRows[itoId];
			for (var j=this.shiftStartCellIndex;j<this.totalHourCellIndex;j++)
			{
				$(shiftRow.cells[j]).html("").blur();
				$(vancantShiftRow.cells[j]).html("");
			}	
		}
	}
	getAllShiftData()
	{
		var resultString="{";
		var shift,shiftDate;
		var shiftRowList=this._getAllShiftRow();
		
		for (var itoId in shiftRowList)
		{
			resultString+="\""+itoId+"\":{\"shiftList\":[";
			for (var index=this.shiftStartCellIndex;index<this.shiftStartCellIndex+this.calendarList.length;index++)
			{
				shift=shiftRowList[itoId].cells[index].textContent;
				resultString+="\""+shift+"\",";
			}
			resultString=resultString.substring(0,resultString.length-1);
			resultString+="]";
			resultString+="},";
		}
		resultString=resultString.substring(0,resultString.length-1);
		resultString+="}";
		return JSON.parse(resultString);
	}
	getAllPreferredShiftData()
	{
		var resultString="{";
		var preferredShift="",shiftDate;
		var preferredShiftRowList=this._getAllPreferredShiftRow();
		
		for (var itoId in preferredShiftRowList)
		{
			resultString+="\""+itoId+"\":{\"preferredShiftList\":[";
			for (var index=this.shiftStartCellIndex;index<this.shiftStartCellIndex+this.calendarList.length;index++)
			{
				preferredShift=preferredShiftRowList[itoId].cells[index].textContent;
				if (preferredShift!="")
				{
					resultString+="{\"shift\":\""+preferredShift+"\",";
					resultString+="\"shiftDate\":"+(index-2);
					resultString+="},";
				}			
			}
			if (resultString.endsWith(","))
				resultString=resultString.substring(0,resultString.length-1);
			resultString+="]";
			resultString+="},";
		}
		resultString=resultString.substring(0,resultString.length-1);
		resultString+="}";
//		console.log(resultString);
		return JSON.parse(resultString);
	}
	getPreviousShiftList(startDate,itoList)
	{
		var result=[];
		var shiftDataList,resultList=[];
		var startIndex=startDate-this.rosterRule.maxConsecutiveWorkingDay;
		for (var itoId in itoList)
		{
			result=[];
			shiftDataList=this.getAllShiftData()[itoId].shiftList;
			if (startIndex<1)
			{
				var previousMonthShiftList=this.allPreviousMonthShiftList[itoId];
				startIndex=startDate-1;
				for (var i=startIndex;i<this.rosterRule.maxConsecutiveWorkingDay;i++)
				{
					result.push(previousMonthShiftList[i].shift);
				}
			}
			for (var i=0;i<startDate-1;i++)
			{
				result.push(shiftDataList[i]);
			}
			resultList[itoId]=result;
		}	
		return resultList;
	}
	getPreferredShiftList(startDate,endDate)
	{
		var cell;
		var preferredShiftRow;
		var preferredShiftRowList=this._getAllPreferredShiftRow();
		var itoId="ITO1_1999-01-01";
		var itoPreferredShiftList=[];
		var preferredShiftList=[];
		
		for (var itoId in preferredShiftRowList)
		{
			preferredShiftList=[];
			preferredShiftRow=preferredShiftRowList[itoId];
			for (var i=startDate-1;i<endDate;i++)
			{
				cell=preferredShiftRow.cells[i+this.shiftStartCellIndex];
				preferredShiftList[i]=(cell.textContent);
			}
			itoPreferredShiftList[itoId]=preferredShiftList;
		}
		return itoPreferredShiftList;
	}
	getThisMonthBalance(itoId)
	{
		return parseFloat(document.getElementById(itoId +"_thisMonthBalance").textContent);
	}	
//----------------------------------------------------------------------------------------
	// Private method
	_getShiftPattern(shiftRow,endIndex)
	{
		var shiftPattern="",cell;
		for (var i=1;i<endIndex;i++)
		{
			cell=shiftRow.cells[i];
			shiftPattern+=cell.textContent+",";
		}
		shiftPattern=shiftPattern.substring(0,shiftPattern.length-1);
		return shiftPattern;
	}
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
			cell.className="alignLeft borderCell";
			
			cell.innerHTML=ito.name+"<br>"+ito.postName+" Extn. 2458";
			
			cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
			cell.className="alignLeft borderCell";
			cell.innerHTML="Preferred Shift";
			
			for (i=0;i<this.showNoOfPrevDate;i++)
			{
				cell=shiftRow.insertCell(shiftRow.cells.length);
				cell.className="borderCell alignCenter";
				$(cell).on("blur",function()
						{
							self._updateValue(this);
						});
				cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
				cell.className="borderCell alignCenter";
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
					});
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
		vancantShiftRow=this.rosterBody.insertRow(this.rosterBody.rows.length);
		vancantShiftRow.id="vancantShift";
		cell=vancantShiftRow.insertCell(vancantShiftRow.cells.length);
		cell.className="vancantShift borderCell alignCenter";
		cell.textContent="Vancant Shifts";
		for (i=0;i<33;i++)
		{
			cell=vancantShiftRow.insertCell(vancantShiftRow.cells.length);
			cell.className="borderCell alignCenter";
		}
		cell=vancantShiftRow.insertCell(vancantShiftRow.cells.length);
		cell.className="borderCell alignCenter";
		cell.colSpan=5;

		cell=vancantShiftRow.insertCell(vancantShiftRow.cells.length);
		cell.className="borderCell alignCenter";
		cell.id="shiftAStdDev";
		
		cell=vancantShiftRow.insertCell(vancantShiftRow.cells.length);
		cell.className="borderCell alignCenter";
		cell.id="shiftBStdDev";
		
		cell=vancantShiftRow.insertCell(vancantShiftRow.cells.length);
		cell.className="borderCell alignCenter";
		cell.id="shiftCStdDev";
		
		cell=vancantShiftRow.insertCell(vancantShiftRow.cells.length);
		cell.className="borderCell alignCenter";
		cell.id="avgStdDev";
		
		cell=vancantShiftRow.insertCell(vancantShiftRow.cells.length);
		cell.className="borderCell alignCenter";
	}

	_genRosterHeader()
	{
		var i,cell,holidayCell,daysCell,datesCell;
		var holidayRow,daysRow,datesRow;

		holidayRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		daysRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		datesRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
				
		cell=holidayRow.insertCell(holidayRow.cells.length);
		cell.className="borderCell alignLeft";
		cell.textContent="Holiday";
		
		cell=daysRow.insertCell(daysRow.cells.length);
		cell.className="borderCell alignLeft";
		cell.textContent="Days";
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignLeft";
		cell.innerHTML="Resident Support<br>Team Members";
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=holidayRow.insertCell(holidayRow.cells.length);
			cell.className="dateCell borderCell";
			
			cell=daysRow.insertCell(daysRow.cells.length);
			cell.className="dateCell borderCell";
			
			cell=datesRow.insertCell(datesRow.cells.length);
			cell.className="dateCell borderCell";
		}
		//console.log(this.calendarList);
		this.workingDayCount=this.calendarList.length;
		for (i=0;i<31;i++)
		{
			holidayCell=holidayRow.insertCell(holidayRow.cells.length);
			holidayCell.className="borderCell boldText weekend";
			
			daysCell=daysRow.insertCell(daysRow.cells.length);
			daysCell.className="borderCell dateCell";
			
			datesCell=datesRow.insertCell(datesRow.cells.length);
			datesCell.className="borderCell dateCell";
			
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
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="Total<br>Hour";
		cell.rowSpan=2;
		
		cell=daysRow.insertCell(daysRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="Actual<br>Hour";
		cell.rowSpan=2;
		
		cell=daysRow.insertCell(daysRow.cells.length);
		cell.className="borderCell alignCenter";
		cell.innerHTML="Hour Off Due";
		cell.colSpan=8;
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="Last<br>Month";
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="This<br>Month";

		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="Total";
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="Total No. of<br>A shift";

		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="Total No. of<br>Bx shift";
		
		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="Total No. of<br>C shift";

		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="Total No. of<br>Dx shift";

		cell=datesRow.insertCell(datesRow.cells.length);
		cell.className="borderCell alignCenter theRestCell";
		cell.innerHTML="No. of<br>working<br>day";
	}
	_genEmptyRow()
	{
		var i,cell;
		var rosterEmptyRow;
		rosterEmptyRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		
		cell=rosterEmptyRow.insertCell(rosterEmptyRow.cells.length);
		cell.colSpan=46;
				
	}
	_genRosterMonthRow(rosterScheduler)
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
			
			var month=parseInt(this.options[this.selectedIndex].value);
			var year=parseInt(this.nextSibling.textContent);
			rosterScheduler.init(year,month);
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
	_inputCellKeyDownHandlder(event,cell)
	{
		switch(event.which)
			{
				//When Enter key is pressed
				case 13:event.preventDefault();
						cell.blur();
						//console.log("I am here.");
						break;
				/*		
				left = 37
				up = 38
				right = 39
				down = 40
				*/
			
						//handle left arrow key
				case 37:event.preventDefault();
						cell.previousSibling.focus();
						break;
		
						//handle up arrow key
				case 38:event.preventDefault();
						var cellIndex=cell.cellIndex;
						var thisRow=cell.parentElement;
						var rowIndex=thisRow.rowIndex
						var preRow=this.table.rows[rowIndex-1];
						preRow.cells[cellIndex].focus();
						break;
						
						//handle right arrow key
				case 39:event.preventDefault();
						cell.nextSibling.focus();
						break;
						
						//handle down arrow key
				case 40:event.preventDefault();
						var cellIndex=cell.cellIndex;
						var thisRow=cell.parentElement;
						var rowIndex=thisRow.rowIndex
						var nextRow=this.table.rows[rowIndex+1];
						nextRow.cells[cellIndex].focus();
						break;
			}
	}
	_getAllShiftRow()
	{
		var result=[];
		var shiftRow;
		for (var itoId in this.itoList)
		{
			shiftRow=document.getElementById("shift_"+itoId);
			result[itoId]=shiftRow;
		}
		return result;
	}
	_getAllPreferredShiftRow()
	{
		var result=[];
		var preferredShiftRow;
		for (var itoId in this.itoList)
		{
			preferredShiftRow=document.getElementById("preferredShift_"+itoId);
			result[itoId]=preferredShiftRow;
		}
		return result;
	}	
}	