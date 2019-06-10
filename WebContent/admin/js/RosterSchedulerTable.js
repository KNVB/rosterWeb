class RosterSchedulerTable extends RosterTable
{
	constructor(container)
	{
		super(container);
		this.showNoOfPrevDate=2;
		this.utility=new AdminUtility();
		this.itoList;
	}
/*==============================================================================================*
 *																				  				*
 *	Public Method																				*
 *																				  				*
 *==============================================================================================*/	
	build(year,month)
	{
		super.build(year,month);
	}
	
	setScheduler(rosterScheduler)
	{
		this.rosterScheduler=rosterScheduler;
	}
/*==============================================================================================*
 *																				  				*
 *	Private Method																				*
 *																				  				*
 *==============================================================================================*/
	_buildITORow(itoId)
	{
		super._buildITORow(itoId);
	}
}
customElements.define('roster-scheduler-table',
		RosterSchedulerTable, {
			extends: 'table'
		});