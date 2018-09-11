<%@ page language="java" contentType="text/javascript; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.RosterRule"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Hashtable"%>
class RosterRule
{
	constructor()
	{
		this.shiftHourCount=[];
<% 
		Hashtable<String,Float>shiftHourCount=RosterRule.getShiftHourCount();

		for (String shift:shiftHourCount.keySet())
		{%>
			this.shiftHourCount["<%=shift%>"]=<%=shiftHourCount.get(shift)%>;
<%		}%>
		
		//maximum number of Consecutive working day
		this.maxConWorkingDay=<%=RosterRule.getMaxConsecutiveWorkingDay()%>;
		this.essentialShiftList=[];
<% 
		for (String shift:RosterRule.getEssentialShiftList())
		{	
			out.println("this.essentialShiftList.push("+shift+");");
		} 
%>
	}
	getNoOfConWorkingDay(shiftRow,index)
	{
		var cell;
		var count=0,finished=false;
		
		for (var i=index;i>0;i--)
		{
			cell=shiftRow.cells[i];
			switch (cell.textContent)
			{
				case "O":
				case "d" : 
				case "d1":
				case "d2":
				case "d3":
							finished=true;
							break;
				default:
						count++;
						break;
			}
			if (finished)
				break;
		}	
		return count;
	}
	getEssentialShift()
	{
		var result="";
		this.essentialShiftList.forEach(function(shift){
										result+=shift;	
		});
		return result;
	}
	isConflictWithPreferredShift(preferredShift,thatShift)
	{
		var result=false;
		if ((preferredShift=="")||(preferredShift==thatShift))
			return result;
		else
		{
			if (preferredShift.startsWith("n"))
			{
				if (preferredShift.indexOf(thatShift)>-1)
					result=true;
			}	
			else	
				result=true;
		}
		return result;
	}
	isThatShiftFormBlackListedShiftPattern(shiftRow,index,ito,thatShift)
	{
		var result=false;
		var indices=this.getBlackListedShiftPatternIndex(shiftRow,index,ito,thatShift);
		if (indices.length>0)
			result=true;
	//	console.log(ito.itoId,thatShift,result);
		return result;
	}
	getBlackListedShiftPatternIndex(shiftRow,endIndex,ito)
	{
		this.getBlackListedShiftPatternIndex(shiftRow,endIndex,ito,null);
	}
	getBlackListedShiftPatternIndex(shiftRow,endIndex,ito,thatShift)
	{
		var indices,cell;
		var allShift="";
		for (var i=1;i<endIndex;i++)
		{
			cell=shiftRow.cells[i];
			allShift+=cell.textContent+",";
		}
		if (thatShift==null)
			allShift=allShift.substring(0,allShift.length-1);
		else
			allShift+=thatShift;
		//console.log(allShift);
		indices=ito.getBlackListedShiftPatternIndex(allShift);
		return indices;
	}	
	getITOAvailableShiftList(shiftRow,preferredShift,index,ito,thatShift)
	{
		var result=[];
		var self=this;
		switch (preferredShift)
		{
			case "o":
			case "d" : 
			case "d1":
			case "d2":
			case "d3":
			case "al":					
						break;
			default:
					ito.availableShift.forEach(function(shift){
						if (self._isThatShiftOkForAssign(shiftRow,preferredShift,index,ito,shift))
						{
							//console.log(ito.itoId,shift);
							result.push(shift);
						}
					});
		}
		return result;
	}
	_isThatShiftOkForAssign(shiftRow,preferredShift,index,ito,thatShift)
	{
		var result=true;
		
		if (this.isConflictWithPreferredShift(preferredShift,thatShift))
		{
//			console.log(ito.itoId+","+(index-2)+","+thatShift+",Conflict with requirement("+requirementShift+").");
			result=false;
		}
		else
		{
			if (this.isThatShiftFormBlackListedShiftPattern(shiftRow,index,ito,thatShift))
			{	
		//		console.log(ito.itoId+","+(index-2)+","+thatShift+",black list");
				result=false;
			}
			else
			{
				var count=this.getNoOfConWorkingDay(shiftRow,index);
				if (count>this.maxConWorkingDay)
				{	
			//		console.log(ito.itoId+","+(index-2)+","+count+","+thatShift+",longer than maximum number of Consecutive working day");
					result=false;
				}
			}			
		}
		/*
		result=result | this.isConflictWithRequirementShift(requirementShift,thatShift);*/
		return result;
	}	
}