/**
 * 
 */
class Roster
{
	constructor()
	{
		
		this.month=0;	
		this.year=1970;
		this.itoList=[];
		this.rosterRule=null;
		
		this.utility=new Utility();
		this.rosterTable=new RosterTable(this.utility);
	}
	init(year,month)
	{
		var self=this;
		this.year=year;
		this.month=month;
		this.utility.getRosterRule(year,month)
		.done(function(serverResponse){
			self.rosterRule=new RosterRule(self.utility);
			self.rosterRule.essentialShiftList=serverResponse.essentialShiftList;
			self.rosterRule.maxConsecutiveWorkingDay=serverResponse.maxConsecutiveWorkingDay;
			self.rosterRule.shiftHourCount=serverResponse.shiftHourCount;
			
			self.rosterTable.setRosterRule(self.rosterRule);
			self.rosterTable.init(self.year,self.month);
			
		})
		.fail(function(){
			alert("RosterRule initialization failure.");
		});

		//this.rosterRule=new RosterRule(this.utility,year,month)
	}
}