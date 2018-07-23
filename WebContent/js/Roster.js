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
	autoAssign()
	{
		var startDate=parseInt($("#autoPlannStartDate").val());
		var endDate=parseInt($("#autoPlanEndDate").val());
		
		if (this.haveInvalidShiftRequirement(startDate,endDate))
			alert("Invalid shift requirement detected");
		else
		{
			var ito,requirementShift;
			var shift,shiftRow,thatShift;
			var shiftRowList=this.rosterTable.getAllShiftRow();
			var requirementRowList=this.rosterTable.getAllRequirementRow();
			var result;		
			var index=startDate+2;
			var itoId="ITO1_1999-01-01";
			//var itoId="ITO4_1999-01-01";
			//var itoId="ITO3_2017-10-18";
			//for (var itoId in shiftRowList)
			{
				shiftRow=shiftRowList[itoId];
				requirementShift=requirementRowList[itoId].cells[index].textContent;
				ito=this.itoList[itoId];
				for (var i=0;i<this.shiftRule.essentialShiftList.length;i++)
				{
					thatShift=this.shiftRule.essentialShiftList[i];
					result=this.shiftRule.isThatShiftOkForAssign(shiftRow,requirementShift,index,ito,thatShift);
					//console.log(itoId,thatShift,requirementShift,result);
					if (result)
						break;
				}
				console.log(itoId,index-2,thatShift,result);
			}
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