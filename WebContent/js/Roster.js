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
		this.utility=new Utility();
		
	}
	init(year,month)
	{
		var self=this;
		this.year=year;
		this.month=month;
		this.rosterRule=new RosterRule(this.utility,year,month);
	}
}