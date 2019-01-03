class RosterScheduler
{	
	constructor()
	{
		this.rosterSchedulerTable=new RosterSchedulerTable($("#main")[0]);
	}
	buildRosterTable(year,month)
	{
		this.rosterYear=year;
		this.rosterMonth=month;
		this.rosterSchedulerTable.setScheduler(this);
		this.rosterSchedulerTable.build(year,month);
	}
	initButton()
	{
		var self=this;
		$(".findMissingShiftButton").on("click",function(){
			self.rosterSchedulerTable.haveMissingShift();
		});
		$(".findDuplicateShiftButton").on("click",function(){
			self.rosterSchedulerTable.haveDuplicateShift();
		});
		$(".clearAllButton").on("click",function(){
			self.rosterSchedulerTable.clearAllShift();
		});
		
		$(".checkAllButton").on("click",function(){
			self.validate();	
		});
		
		$(".autoPlannerButton").on("click",function(){
			self.autoAssign();
		});
		
		$(".exportButton").on("click",function(){
			self.exportRosterToExcel();
		});
		$(".saveRosterToDBButton").on("click",function(){
			self.saveAllData();
		});
		
		
		$("#theLowestSD").on("click",function(){
			self.loadLowestSDRoster(0);
		});
		$("#secondLowestSD").on("click",function(){
			self.loadLowestSDRoster(1);
		});
		$("#thirdLowestSD").on("click",function(){
			self.loadLowestSDRoster(2);
		});
		
		$("#theLowestMissingShiftCount").on("click",function(){
			self.loadMissingShiftRoster(0);
		});
		$("#theSecondLowestMissingShiftCount").on("click",function(){
			self.loadMissingShiftRoster(1);
		});
		$("#theThirdLowestMissingShiftCount").on("click",function(){
			self.loadMissingShiftRoster(2);
		});
	}
}