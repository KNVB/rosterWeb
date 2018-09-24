class RosterScheduler extends  RosterViewer
{
	constructor(rosterSchedulerUtility)
	{
		super(rosterSchedulerUtility);
		this.loadingScreen=new MyLoadingScreen({imgPath:"img/icon.gif"});
		this.rosterSchedulerUtility=rosterSchedulerUtility;
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
		this.rosterTable=new RosterSchedulerTable(this.rosterSchedulerUtility);
		this.rosterTable.refresh();
	}
}