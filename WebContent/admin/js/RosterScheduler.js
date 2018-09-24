class RosterScheduler extends  RosterViewer
{
	constructor(utility)
	{
		super(utility);
		this.loadingScreen=new MyLoadingScreen({imgPath:"img/icon.gif"});
		
	}
	reloadRosterData(year,month)
	{
		return new Promise((resolve, reject) => {
			super.reloadRosterData(year,month).then(function (){
				resolve();
				
			});
			
		});
	}
	refreshRosterTable()
	{
		console.log("scheduler");
	}
}