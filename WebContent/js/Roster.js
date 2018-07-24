/**
 * 
 */
class Roster
{
	constructor(rosterTable)
	{
		this.rosterTable=rosterTable;
		this.itoList=this.rosterTable.itoList;
		this.shiftRule=this.rosterTable.shiftRule;
	}
	saveAllData()
	{
		var utility=new Utility();
		var lastMonthBalance;
		var shift,requirementShift,shiftDate;
		var shiftRowList=this.rosterTable.getAllShiftRow();
		var requirementRowList=this.rosterTable.getAllRequirementRow();
		var itoRosterString="";
		var rosterData ="{\"rosterYear\":"+this.rosterTable.year+",";
		rosterData+="\"rosterMonth\":"+(this.rosterTable.month+1)+",";
		var itoId="ITO1_1999-01-01";
		//for (var itoId in this.itoList)
		{
			itoRosterString+="\""+itoId+"\":{\"shiftList\":[";
			for (var index=this.rosterTable.shiftStartCellIndex;index<(this.rosterTable.shiftStartCellIndex+this.rosterTable.calendarList.length);index++)
			{
				shift=shiftRowList[itoId].cells[index].textContent;
				shiftDate=new Date(this.rosterTable.year,this.rosterTable.month,index-2);
				itoRosterString+="{\"itoId\":\""+itoId+"\",";
				itoRosterString+="\"shift\":\""+shift+"\",";
				itoRosterString+="\"shiftDate\":"+shiftDate.getTime();
				itoRosterString+="},";
			}

			//get the lastMonthanBalance value
			lastMonthBalance=shiftRowList[itoId].cells[this.rosterTable.totalHourCellIndex+4].textContent;
			
			itoRosterString=itoRosterString.substring(0,itoRosterString.length-1);
			itoRosterString+="],";
			itoRosterString+="\"lastMonthBalance\":"+lastMonthBalance;
			itoRosterString+="},";
		}
		itoRosterString=itoRosterString.substring(0,itoRosterString.length-1);
		rosterData+=itoRosterString;
		rosterData+="}";
		console.log(rosterData);
		jQuery.ajax({"url": "saveRosterData.jsp",
					 dataType: 'text',
					 data:rosterData,
					 method:"POST",
					 success:function(){
						 		alert("All roster data are saved.");
					 		 },	
					 error:utility.showAjaxErrorMessage
		});
	}
	autoAssign()
	{
		var startDate=parseInt($("#autoPlannStartDate").val());
		var endDate=parseInt($("#autoPlanEndDate").val());
		
		if (this.haveInvalidShiftRequirement(startDate,endDate))
			alert("Invalid shift requirement detected");
		else
		{
			var assigned=false;
			var ito,requirementShift,comparetor;
			var shift,shiftRow,thatShift,essentialShiftTemp;
			var shiftRowList=this.rosterTable.getAllShiftRow();
			var essentialShift=this.shiftRule.getEssentialShift();
			var requirementRowList=this.rosterTable.getAllRequirementRow();
			
			var result,utility=new Utility();		
			var index=startDate+2;
			//index=12;
			for (var index=(startDate+2);index<=(endDate+2);index++)
			{	
				//console.log(index,(startDate+2),(endDate+2));
				this.itoList=utility.shuffleProperties(this.itoList);
				essentialShiftTemp=essentialShift;
				for (var itoId in this.itoList)
				{
					//console.log(index,"itoId="+itoId);
					shiftRow=shiftRowList[itoId];
					requirementShift=requirementRowList[itoId].cells[index].textContent;
					$(shiftRow.cells[index]).html("");
					switch (requirementShift)
					{
						case "o":
								$(shiftRow.cells[index]).html("O").blur();
								break;
						case "d" : 
						case "d1":
						case "d2":
						case "d3":
								$(shiftRow.cells[index]).html(requirementShift).blur();
								break;
						default:
							ito=this.itoList[itoId];
							result=this.shiftRule.getITOAvailableShiftList(shiftRow,requirementShift,index,ito);
							if (result.length==0)
							{	
								$(shiftRow.cells[index]).html("O").blur();
								assigned=true;
							}
							else
							{	
								assigned=false;
								for (var i=0;i<result.length;i++)
								{
									switch (result[i])
									{
										case "b1": 
												comparetor="b";
												break;
										default:comparetor=result[i];	
												break;
									}
									if (essentialShiftTemp.indexOf(comparetor)>-1)
									{
										essentialShiftTemp=essentialShiftTemp.replace(comparetor,"");
										console.log((index-2)+" "+result[i]+" shift is assigned to "+itoId);
										$(shiftRow.cells[index]).html(result[i]).blur();
										assigned=true;
										break;
									}	
								}
								if (!assigned)
									$(shiftRow.cells[index]).html("O").blur();
							}	
							break;	
					}					
				}
			}
			this.validate();
		}
	}
	validate()
	{
		var result=true;
		if (this.haveMissingShift())
		{	
			alert("Missing shift found!");
			result=false;
		}
		else
		{	
			if (this.haveDuplicateShift())
			{	
				result=false;
			}
			else
			{	
				if (this.haveBlackListedShiftPattern())
				{	
					alert("Black list shift found!");
					result=false;
				}
			}
		}
		return result;
	}

	haveInvalidShiftRequirement(startDate,endDate)
	{
		var cell,ito,itoId;
		var result=false,requirementRow;
		var itoList=this.rosterTable.itoList;
		var requirementRowList=this.rosterTable.getAllRequirementRow();
		
		for (var itoId in requirementRowList)
		{
			requirementRow=requirementRowList[itoId];
			ito=itoList[itoId];
			for(var i=startDate+2;i<=endDate+2;i++)
			{
				cell=requirementRow.cells[i];
				if (!ito.isValidShiftRequirement(cell.textContent))
				{	
					$(cell).addClass("errorRedBlackGround");
					result=true;
				}
				else
					cell.className="borderCell shiftCell";
			}
		}
		return result;
	}
	haveBlackListedShiftPattern()
	{
		var self=this;
		var ito,indices,endIndex;
		var shiftRow,result=false;
		var shiftRowList=this.rosterTable.getAllShiftRow();
		var itoList=this.rosterTable.itoList;
		for (var itoId in shiftRowList)
		{
			shiftRow=shiftRowList[itoId];
			ito=itoList[itoId];
			endIndex=this.rosterTable.shiftStartCellIndex+this.rosterTable.calendarList.length;
			indices=this.shiftRule.getBlackListedShiftPatternIndex(shiftRow,endIndex,ito);
			if (indices.length>0)
			{
				indices.forEach(function (index){
									if (index<self.rosterTable.shiftStartCellIndex)
										index=self.rosterTable.shiftStartCellIndex;
									$(shiftRow.cells[index]).addClass("errorRedBlackGround");
							});
				result=true;
			}
		}
		return result;
	}
	haveMissingShift()
	{
		var ito,itoId,j,cell,i;
		var shift,shiftRow;
		var haveMissingShift=false;
		var shiftRowList=this.rosterTable.getAllShiftRow();
		var itoList=this.rosterTable.itoList;
		for (i=this.rosterTable.shiftStartCellIndex;i<this.rosterTable.shiftStartCellIndex+this.rosterTable.calendarList.length;i++)
		{
			var essentialShift=this.shiftRule.getEssentialShift();
			for (var itoId in shiftRowList)
			{
				shiftRow=shiftRowList[itoId];
				ito=itoList[itoId];
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
						$(cell).addClass("errorRedBlackGround");
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
		var shiftRowList=this.rosterTable.getAllShiftRow();
		var itoList=this.rosterTable.itoList;
		for (i=this.rosterTable.shiftStartCellIndex;i<this.rosterTable.shiftStartCellIndex+this.rosterTable.calendarList.length;i++)
		{
			var tempResult=[],temp="";
			for (var itoId in shiftRowList)
			{
				shiftRow=shiftRowList[itoId];
				ito=itoList[itoId];
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
										$(cell).addClass("errorRedBlackGround");
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
										$(cell).addClass("errorRedBlackGround");
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
						alert("Invalid shift");
						$(cell).addClass("errorRedBlackGround");
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
}