class RosterScheduler extends  RosterViewer
{
	constructor(rosterSchedulerUtility)
	{
		super(rosterSchedulerUtility);
		this.loadingScreen=new MyLoadingScreen({imgPath:"img/icon.gif"});
		this.rosterSchedulerUtility=rosterSchedulerUtility;
	}	
}