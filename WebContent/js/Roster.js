/**
 * 
 */
class Roster
{
	constructor(rosterData,utility,rosterRule)
	{
		this.rosterData=rosterData;
		this.shiftAStdDev=0.0;
		this.shiftBStdDev=0.0;
		this.shiftCStdDev=0.0;
		this.missingShiftCount=0;
		this.averageShiftStdDev=0.0;
		var itoShiftList,essentialShiftTemp;
		var shiftACount,shiftBCount,shiftCCount;
		var shiftAData=[],shiftBData=[],shiftCData=[];
		for (var itoId in rosterData)
		{
			itoShiftList=rosterData[itoId];
			shiftACount=0;
			shiftBCount=0;
			shiftCCount=0;
			essentialShiftTemp=rosterRule.getEssentialShift();
			itoShiftList.forEach(function(shift){
				switch (shift)
				{
					case "a":shiftACount++;
						//	essentialShiftTemp=essentialShiftTemp.replace("a",""); 
							break;
					case "b":
					case "b1":
						//	essentialShiftTemp=essentialShiftTemp.replace("b",""); 
							shiftBCount++;
							break;
					case "c":shiftCCount++;
						//	 essentialShiftTemp=essentialShiftTemp.replace("c","");
							 break;	
				}
			});
			shiftAData.push(shiftACount);
			shiftBData.push(shiftBCount);
			shiftCData.push(shiftCCount);
		}
		
		this.shiftAStdDev=utility.getSD(shiftAData);
		this.shiftBStdDev=utility.getSD(shiftBData);
		this.shiftCStdDev=utility.getSD(shiftCData);
		this.averageShiftStdDev=utility.getMean([this.shiftAStdDev,this.shiftBStdDev,this.shiftCStdDev]);
	}
}