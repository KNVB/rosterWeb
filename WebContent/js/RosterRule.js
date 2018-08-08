/**
 * 
 */
class RosterRule
{
	constructor(utility)
	{
		this.utility=utility;
		this.shiftHourCount=[];
		this.maxConWorkingDay;
		this.essentialShiftList=[];
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
		console.log(itoId,index,previousShiftList);
		ito.availableShiftList.forEach(function(shift){
						if (self._isThatShiftOkForAssign(resultantShiftList,previousShiftList,preferredShift,index,ito,shift))
						{
							//console.log(ito.itoId,shift);
							result.push(shift);
						}
		});
		return result;
	}
//----------------------------------------------------------------------------------------------------------------------------------	
	_isThatShiftOkForAssign(resultantShiftList,previousShiftList,preferredShift,index,ito,thatShift)
	{
		var result=true;
		if (this._getNoOfConWorkingDay(ito,previousShiftList,thatShift)>this.maxConWorkingDay)
		{
		//	console.log(ito.itoId+","+index+","+thatShift+", cause over the max. consecutive working day");
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
			if (finished)
				break;
		}
		
		//console.log(itoId,previousShiftList,shiftList,thatShift,count);
		
		return count;
	}	
}