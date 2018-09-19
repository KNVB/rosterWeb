class RosterScheduler extends  RosterViewer
{
	constructor(utility)
	{
		super(utility);
		this.loadingScreen=new MyLoadingScreen({imgPath:"img/icon.gif"});
	}	
}