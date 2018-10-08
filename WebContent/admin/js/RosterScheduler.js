class RosterScheduler
{
	constructor()
	{
		this.essentialShiftList;
		this.itoList;
		this.itoIdList;
		this.itoRosterList;
		this.maxConsecutiveWorkingDay;
		this.noOfWorkingDay;
		this.preferredShiftList;
		this.rosterSchedulerTable=new RosterSchedulerTable();
		this.shiftHourCount;
		this.yearlyStatistic;
	}
	show()
	{
		this.rosterSchedulerTable.itoIdList=this.itoIdList;
		this.rosterSchedulerTable.noOfWorkingDay=this.noOfWorkingDay;
		this.rosterSchedulerTable.itoRosterList=this.itoRosterList;
		this.rosterSchedulerTable.shiftHourCount=this.shiftHourCount;
		this.rosterSchedulerTable.preferredShiftList=this.preferredShiftList;
		console.log(this.preferredShiftList);
		this.rosterSchedulerTable.show();
	}
}