class Roster
{
	constructor(startDate,rosterData,utility,rosterRule,rosterDataLength)
	{
		this.startDate=startDate;
		this.rosterData=rosterData;
		this.shiftAStdDev=0.0;
		this.shiftBStdDev=0.0;
		this.shiftCStdDev=0.0;
		this.missingShiftCount=0;
		this.averageShiftStdDev=0.0;
		this.shiftACount=[];
		this.shiftBCount=[];
		this.shiftCCount=[];
		this.essentialShiftTemp;
		var itoShiftList,shift;
		
		var shiftAData=[],shiftBData=[],shiftCData=[];
		for (var dateIndex=0;dateIndex<rosterDataLength;dateIndex++)
		{
			this.essentialShiftTemp=rosterRule.getEssentialShift();
			for (var itoId in rosterData)
			{
				itoShiftList=rosterData[itoId];
				shift=itoShiftList[dateIndex];
				switch(shift)
				{
					case "a":
					case "b":
					case "c":	
							this._calShiftCount(shift,itoId);	
							break;
					case "b1":
							this._calShiftCount("b",itoId);
							break;
				}
			}
			if (this.essentialShiftTemp!="")
				this.missingShiftCount++;
		}
		for (var itoId in rosterData)
		{
			if (this.shiftACount[itoId]==null)
				shiftAData.push(0);
			else	
				shiftAData.push(this.shiftACount[itoId]);
			
			if (this.shiftBCount[itoId]==null)
				shiftBData.push(0);
			else	
				shiftBData.push(this.shiftBCount[itoId]);
			
			if (this.shiftCCount[itoId]==null)
				shiftCData.push(0);
			else	
				shiftCData.push(this.shiftCCount[itoId]);
		}
		
		this.shiftAStdDev=utility.getSD(shiftAData);
		this.shiftBStdDev=utility.getSD(shiftBData);
		this.shiftCStdDev=utility.getSD(shiftCData);
		this.averageShiftStdDev=utility.getMean([this.shiftAStdDev,this.shiftBStdDev,this.shiftCStdDev]).toFixed(3);
	}
/*==============================================================================================*
 *																				  				*
 *	Private Method																				*
 *																				  				*
 *==============================================================================================*/
	_calShiftCount(shift,itoId)
	{
		var myShift=shift.toUpperCase();
		
		var result=eval("(this.shift"+myShift+"Count[\""+itoId+"\"]==null)");
		if (result)
			eval("this.shift"+myShift+"Count[\""+itoId+"\"]=1;");
		else
			eval("this.shift"+myShift+"Count[\""+itoId+"\"]++;");
			
		this.essentialShiftTemp=this.essentialShiftTemp.replace(shift,"");
	}
}