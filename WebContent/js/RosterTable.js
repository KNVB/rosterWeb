/**
 * 
 */
class RosterTable
{
	constructor()
	{
		this.itoList=[];
		this.rosterList=[];
		this.year=1970;
		this.month=1;
		this.roster=null;
		this.shiftAStdDev=0.0;
		this.shiftBStdDev=0.0;
		this.shiftCStdDev=0.0;
		this.calendarList=null;
		
		this.showNoOfPrevDate=2;
		this.firstDate=new Date();
		this.utility=new Utility();
		this.totalHourCellIndex=34;
		this.shiftStartCellIndex=3;
		this.averageShiftStdDev=0.0;
		
		this.rosterRule=new RosterRule();
		this.table=document.getElementById("rosterTable");
		this.rosterFooter=document.getElementById("footer");
		this.rosterBody=document.getElementById("rosterBody");
		this.rosterHeader=document.getElementById("rosterHeader");
		this.englishMonthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];		
	}
	init(year,month,roster)
	{
		var temp;
		var self=this;
		this.year=year;
		this.month=month;
		this.roster=roster;
		
		this.firstDate=new Date(year,month,1);
		$(this.rosterFooter).hide();
		var ito;
		var requestParameters={"year":year,"month":month}; 
		//console.log(requestParameters);
		
		return	jQuery.ajax({"url": "getRoster.jsp",
			 			dataType: 'json',
			 			data:requestParameters,
			 			success:function (requestResult)
								{
			 						this.itoList=[];
			 						self.calendarList=requestResult.calendarList;
			 						for (var itoId in requestResult.itoList)
			 						{
			 							temp=(requestResult.itoList[itoId]);
			 							ito=new ITO();
			 							ito.name=temp.itoName;
			 							ito.itoId=temp.itoId;
			 							ito.postName=temp.postName;
			 							ito.availableShift=temp.availableShift;
			 							ito.workingHourPerDay=temp.workingHourPerDay;
			 							ito.blackListShiftPatternList=temp.blackListShiftPatternList;
			 							self.itoList[itoId]=ito;
			 						}			 						
			 						self.rosterList=requestResult.rosterList;
			 						//$(self.table).empty();
			 						self._genRosterCaption();
			 						self._genRosterMonthRow();
			 						self._genEmptyRow();
			 						self._genRosterHeader();
			 						self._genRosterBody();
			 						self._loadRosterData();
			 						
			 						self._initAutoPlanDropDown();
			 						$(self.rosterFooter).show();
				 						
		 						},
			 			error:this.utility.showAjaxErrorMessage
					});
	}
	updateValue(theCell)
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
										tempResult.push(shift);
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
										tempResult.push(shift);
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
			indices=this.rosterRule.getBlackListedShiftPatternIndex(shiftRow,endIndex,ito);
			
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
	getThisMonthBalance(itoId)
	{
		return parseFloat(document.getElementById(itoId +"_thisMonthBalance").textContent);
	}
//-----------------------------------------------------------------------------------------------------------
// Private method
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
	_refresh(self,select)
	{
		//console.log(self,select);
		var month=parseInt(select.options[select.selectedIndex].value);
		var year=parseInt(select.nextSibling.textContent);
		console.log(year,month);
		this.roster.year=year;
		this.roster.month=month;

		//console.log(year,month);
		self.init(year,month,this.roster);
	}
	_genEmptyRow()
	{
		var i,cell;
		var rosterEmptyRow;
		rosterEmptyRow=this.rosterHeader.insertRow(this.rosterHeader.rows.length);
		
		cell=rosterEmptyRow.insertCell(rosterEmptyRow.cells.length);
		cell.colSpan=46;
				
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
		
		for (i=0;i<2;i++)
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
		cell.className="borderCell theRestCell";
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
	_genRosterBody()
	{
		var i,ito;
		var self=this;
		var shiftRow,preferredShiftRow,vancantShiftRow,cell;
		var shiftList,itoRoster,columnCount;
		$(this.rosterBody).empty();
		for (var itoId in this.itoList)
		{
			ito=this.itoList[itoId];
			itoRoster=this.rosterList[itoId];
			shiftRow=this.rosterBody.insertRow(this.rosterBody.rows.length);
			preferredShiftRow=this.rosterBody.insertRow(this.rosterBody.rows.length);
			
			shiftRow.id="shift_"+ito.itoId;
			preferredShiftRow.id="preferredShift_"+ito.itoId;
			cell=shiftRow.insertCell(shiftRow.cells.length);
			cell.className="alignLeft borderCell";
			
			cell.innerHTML=ito.name+"<br>"+ito.postName+" Extn. 2458";
			
			cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
			cell.className="alignLeft borderCell";
			cell.innerHTML="Preferred Shift";
			
			for (i=0;i<2;i++)
			{
				cell=shiftRow.insertCell(shiftRow.cells.length);
				cell.className="borderCell alignCenter";
				$(cell).on("blur",function()
						{
							self.updateValue(this);
						});
				cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
				cell.className="borderCell alignCenter";
			}
			for (i=0;i<31;i++)
			{
				cell=shiftRow.insertCell(shiftRow.cells.length);
				cell.className="borderCell alignCenter";
				cell.contentEditable="true";
				$(cell).on("blur",function()
						{
							self.updateValue(this);
						});
				$(cell).keydown(function(event)
								{
					 				self._inputCellKeyDownHandlder(event,this);
								});
				cell=preferredShiftRow.insertCell(preferredShiftRow.cells.length);
				cell.className="borderCell alignCenter";
				cell.contentEditable="true";
				$(cell).keydown(function(event)
						{
							self._inputCellKeyDownHandlder(event,this);
						});
				$(cell).on("blur",function(){
					this.className="borderCell alignCenter";
				});
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
			cell.textContent=itoRoster.lastMonthBalance;
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
	_loadRosterData()
	{
		var preferredShiftList,startIndex,cell,ito,diff;
		var shiftList,itoId,shiftRow,shiftDate,shiftRecord,preferredShiftRow;
		startIndex=this.rosterRule.maxConWorkingDay-this.showNoOfPrevDate;
		diff=startIndex-1;
		//var itoId="ITO1_1999-01-01";
		for (var itoId in this.itoList)
		{
			ito=this.itoList[itoId];
			shiftList=this.rosterList[itoId].shiftList;
			preferredShiftList=this.rosterList[itoId].preferredShiftList;
			//console.log(shiftList);
			shiftRow=document.getElementById("shift_"+ito.itoId);
			preferredShiftRow=document.getElementById("preferredShift_"+ito.itoId);
			for (var i=1;i<shiftList.length;i++)
			{
				shiftRecord=shiftList[i+diff];
//				console.log(i,i+diff,new Date(shiftRecord.shiftDate),shiftRecord.shiftDate,shiftRecord.shift);
				cell=shiftRow.cells[i];
				
				shiftRecord=shiftList[i+diff];
				if (shiftRecord!=null)
				{	
					$(cell).html(shiftRecord.shift).blur();
				}
			}	
			for (var i=0;i<preferredShiftList.length;i++)
			{
				shiftRecord=preferredShiftList[i];
				shiftDate=new Date(shiftRecord.shiftDate);
				cell=preferredShiftRow.cells[shiftDate.getDate()+this.showNoOfPrevDate];
				$(cell).html(shiftRecord.shift);
				//console.log(shiftDate.getDate(),shiftRecord.shift);
			}	
			//console.log(this.rosterList[itoId].preferredShiftList);
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
		actualCell.textContent=Math.round(actualHour*100)/100;
		
		thisMonthCell.textContent=Math.round((actualHour-totalCell.textContent)*100)/100;
		thisMonthBalanceCell.textContent=Math.round((parseFloat(thisMonthCell.textContent)+parseFloat(lastMonthCell.textContent))*100)/100;
		
		//update total no. of varies shift value
		aShiftCountCell.textContent=aShiftCount;
		this._updateStandardDevValue("A",aShiftCountCell.cellIndex);
		
		bShiftCountCell.textContent=bShiftCount;
		this._updateStandardDevValue("B",bShiftCountCell.cellIndex);
		
		cShiftCountCell.textContent=cShiftCount;
		this._updateStandardDevValue("C",cShiftCountCell.cellIndex);
		
		dShiftCountCell.textContent=dShiftCount;
		
		noOfWorkingDayCell.textContent=Math.round((aShiftCount+bShiftCount+cShiftCount+dShiftCount)*100)/100;
		
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
				case 39:event.preventDefault();
						cell.nextSibling.focus();
						break;
				case 37:event.preventDefault();
						cell.previousSibling.focus();
						break;
			}
	}
}	