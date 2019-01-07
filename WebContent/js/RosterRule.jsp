<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.rosterWeb.RosterRule"%>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<% 
	ObjectMapper objectMapper = new ObjectMapper();
%>
/**
 * 
 */
class RosterRule
{
	constructor(utility)
	{
		this.essentialShiftList=<%=objectMapper.writeValueAsString(RosterRule.getEssentialShiftList()).replace("\\\"", "")%>;
		this.maxConsecutiveWorkingDay=<%=objectMapper.writeValueAsString(RosterRule.getMaxConsecutiveWorkingDay())%>;
		this.shiftHourCount=<%=objectMapper.writeValueAsString(RosterRule.getShiftHourCount())%>;
		this.utility=utility;
	}
	getEssentialShift()
	{
		var result="";
		this.essentialShiftList.forEach(function(shift){
										result+=shift;	
		});
		return result;
	}
	getITOAvailableShiftList(index,ito,preferredShift,previousShiftList,resultantShiftList)
	{
		var result=[];
		var self=this;
		//console.log(ito.itoId,index,previousShiftList);
		ito.availableShiftList.forEach(function(shift){
						if (self._isThatShiftOkForAssign(resultantShiftList,previousShiftList,preferredShift,index,ito,shift))
						{
							console.log(ito.itoId,shift);
							result.push(shift);
						}
		});
		return result;
	}
//----------------------------------------------------------------------------------------------------------------------------------	
	_getNoOfConsecutiveWorkingDay(ito,previousShiftList,thatShift)
	{
		var count=0,finished=false;
		var shiftList=this.utility.cloneArray(previousShiftList);
		shiftList.push(thatShift);
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
						count=0;
						break;
				default:
						count++;
						break;		
			}
		}
		console.log(ito.itoId,previousShiftList,shiftList,thatShift,count,this.maxConsecutiveWorkingDay);
		
		return count;
	}
	_getTotalNoOfThatShiftAssigned(resultantShiftList,thatShift)
	{
		var count=0;
		resultantShiftList.forEach(function(shift){
			if (shift==thatShift)
				count++;
		});
		return count;
	}
	_isConflictWithPreferredShift(preferredShift,thatShift)
	{
		var result=false;
		if (((typeof preferredShift)=="undefined") || (preferredShift=="")||(preferredShift==thatShift))
		//if (((typeof preferredShift)=="undefined")||(preferredShift==thatShift))
			return result;
		else
		{
			if (preferredShift.startsWith("n"))
			{
				if (preferredShift.indexOf(thatShift)>-1)
					result=true;
			}	
			else	
			{	
				switch (thatShift)
				{
					case "O":
					case "d" : 
					case "d1":
					case "d2":
					case "d3":
							break;
					default:
							result=true;
							break;
				}
				
				
			}
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
	
	_isThatShiftOkForAssign(resultantShiftList,previousShiftList,preferredShift,index,ito,thatShift)
	{
		var result=true;
//		console.log(ito.itoId+","+index+","+thatShift+","+this._getTotalNoOfThatShiftAssigned(resultantShiftList,thatShift));
		if (this._getTotalNoOfThatShiftAssigned(resultantShiftList,thatShift)==this.maxNoOfShiftPerMonth)
		{
			console.log(ito.itoId+","+index+","+thatShift+", cause over the max. no. of "+thatShift+" shift assigned in a month");
			result=false;
		}
		else
		{
			if (this._getNoOfConsecutiveWorkingDay(ito,previousShiftList,thatShift)>=this.maxConsecutiveWorkingDay)
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
						console.log(ito.itoId+","+index+","+thatShift+",conflict with preferred("+preferredShift+").");
					}	
				}	
			}	
		}
		return result;
	}
}