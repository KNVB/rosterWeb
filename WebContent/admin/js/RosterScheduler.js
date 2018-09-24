class RosterScheduler extends  RosterViewer
{
	constructor(rosterSchedulerUtility)
	{
		super(rosterSchedulerUtility);
		this.loadingScreen=new MyLoadingScreen({imgPath:"img/icon.gif"});
		
	}
	reloadRosterData(year,month)
	{
		var self=this;
		super.reloadRosterData(year,month).then(function (){
				self.refreshRosterTable();	
		});
			
		
	}
	refreshRosterTable()
	{
		this.rosterTable=new RosterSchedulerTable(rosterSchedulerUtility);
		this.rosterTable.refresh();
	}
}