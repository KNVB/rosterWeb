/**
 * 
 */
class Roster
{
	constructor()
	{
		this.month=0;	
		this.year=1970;
		this.utility=new Utility();
		this.rosterTable=new RosterTable();
	}
	init(year,month)
	{
		var self=this;
		this.year=year;
		this.month=month;
		this.rosterTable.init(year,month)
		.done(function(){
			$(".findMissingShiftButton").on("click",function(){
				self.rosterTable.haveMissingShift();
			});
			$(".findDuplicateShiftButton").on("click",function(){
				self.rosterTable.haveDuplicateShift();
			});
			$(".checkAllButton").on("click",function(){
				self.validate();	
			});
			$(".autoPlannerButton").on("click",function(){
				roster.autoAssign();
			});						 
			$(".clearAllButton").on("click",function(){
				self.rosterTable.clearAllShift()
			})
			$(".saveRosterToDBButton").on("click",function(){
				self.saveAllData();
			});	
		})
		.fail(function(error){
			alert("An error occur when retrieving roster data:"+data);	
		})
	}
	validate()
	{
		var result=true;
		if (this.rosterTable.haveMissingShift())
		{	
			alert("Missing shift found!");
			result=false;
		}
		else
		{	
			if (this.rosterTable.haveDuplicateShift())
			{	
				result=false;
			}
			else
			{	
				if (this.rosterTable.haveBlackListedShiftPattern())
				{	
					alert("Black list shift found!");
					result=false;
				}
			}
		}
		return result;
	}
	saveAllData()
	{
		/*console.log(this.rosterTable.getAllShiftData());
		console.log(this.rosterTable.getAllPreferredShiftData());*/
		var iTOShiftData;
		var allITOShiftData=this.rosterTable.getAllShiftData();
		for (var itoId in allITOShiftData)
		{
			iTOShiftData=allITOShiftData[itoId];
			console.log("ito id="+itoId+",shiftList="+iTOShiftData.shiftList.length);
		}	
	}
/*	getShiftAStdDev()
	{
		return this.rosterTable.shiftAStdDev;
	}
	getShiftBStdDev()
	{
		return this.rosterTable.shiftBStdDev;
	}
	getShiftCStdDev()
	{
		return this.rosterTable.shiftCStdDev;
	}
	getAverageShiftStdDev()
	{
		return this.rosterTable.averageShiftStdDev;
	}*/
}