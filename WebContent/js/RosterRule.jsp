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
	getEssentialShift()
	{
		var result="";
		this.essentialShiftList.forEach(function(shift){
										result+=shift;	
		});
		return result;
	}
	getITOAvailableShiftList(index,itoId,preferredShift,resultantShiftList,rosterTable)
	{
		var result=[];
		var self=this;
		var previousShiftList=rosterTable.getPreviousShiftList(index,itoId);
		//console.log(itoId,previousShiftList);
		
		var ito=rosterTable.itoList[itoId];
		ito.availableShift.forEach(function(shift){
						if (self._isThatShiftOkForAssign(resultantShiftList,previousShiftList,preferredShift,index,ito,shift))
						{
							//console.log(ito.itoId,shift);
							result.push(shift);
						}
		});
		return result;
	}	
//===================================================================================================================	
	_isThatShiftOkForAssign(resultantShiftList,previousShiftList,preferredShift,index,ito,thatShift)
	{
		var result=true;
		if (this._getNoOfConWorkingDay(ito.itoId,previousShiftList,thatShift)>this.maxConWorkingDay)
		{
			console.log(ito.itoId+","+index+","+thatShift+", cause over the max. consecutive working day");
			result=false;
		}
		else
		{
			if (this._isThatShiftFormBlackListedShiftPattern(ito,previousShiftList,thatShift))
			{
				console.log(ito.itoId+","+index+","+thatShift+", form black list");
				result=false;
			}
			else
			{
				if (this._isConflictWithPreferredShift(preferredShift,thatShift))
				{
					result=false;
					//console.log(ito.itoId+","+index+","+thatShift+",Conflict with preferred("+preferredShift+").");
				}
			}			
		}		
		return result;		
	}
	_getNoOfConWorkingDay(itoId,previousShiftList,thatShift)
	{
		//console.log(previousShiftList,thatShift);
		var count=0,finished=false;
		var shiftList=previousShiftList;
		shiftList.push(thatShift);
		console.log(itoId,thatShift,previousShiftList,shiftList);
		for (var i=0;i<shiftList.length;i++)
		{
			switch (shiftList[i])
			{
				case "":
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
	_isConflictWithPreferredShift(preferredShift,thatShift)
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
	_isThatShiftFormBlackListedShiftPattern(ito,previousShiftList,thatShift)
	{
		var shiftPattern="",indices=[];
		previousShiftList.forEach(function(shift){
			shiftPattern+=shift+",";
		});
		shiftPattern+=thatShift;
		indices=ito.getBlackListedShiftPatternIndex(shiftPattern);
		if (indices.length>0)
			return true;
		else
			return false;	
	}
}