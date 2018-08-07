class Roster
{
	constructor()
	{
		var self=this;
		this.month=0;	
		this.year=1970;
		this.itoList=[];
		this.rosterRule=null;
		
		this.utility=new Utility();
		this.rosterTable=new RosterTable(this.utility);
		//console.log((new Date()).getTime());
		$(".findMissingShiftButton").on("click",function(){
			self.rosterTable.haveMissingShift();
		});
		$(".findDuplicateShiftButton").on("click",function(){
			self.rosterTable.haveDuplicateShift();
		});
		$(".checkAllButton").on("click",function(){
			self.validate();	
		});
		$(".autoPlannerButton").on("click",function(){
			self.autoAssign();
		});						 
		$(".clearAllButton").on("click",function(){
			self.rosterTable.clearAllShift()
		})
		$(".saveRosterToDBButton").on("click",function(){
			self.saveAllData();
		});			
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
			
			self.utility.getRosterData(self.year,self.month)
			.done(function(serverResponse){
				var temp,ito;
				for (var itoId in serverResponse.itoList)
					{
						temp=(serverResponse.itoList[itoId]);
						ito=new ITO();
						ito.name=temp.itoName;
						ito.itoId=temp.itoId;
						ito.postName=temp.postName;
						ito.availableShiftList=temp.availableShiftList;
						ito.workingHourPerDay=temp.workingHourPerDay;
						ito.blackListShiftPatternList=temp.blackListedShiftPatternList;
						self.itoList[itoId]=ito;
					}
				self.rosterTable.itoList=self.itoList;
				self.rosterTable.setRosterRule(self.rosterRule);
				self.rosterTable.calendarList=serverResponse.calendarList;
				self.rosterTable.init(self.year,self.month,self);
				self.rosterTable.loadRosterData(serverResponse.rosterList);
			})
			.fail(function(){
				alert("Failed to get Roster Data.");
			});
			
			
		})
		.fail(function(){
			alert("RosterRule initialization failure.");
		});
 		//this.rosterRule=new RosterRule(this.utility,year,month)
	}
	validate()
	{
		var result=true;
		if (this.rosterTable.haveMissingShift())
		{	
			alert("Missing shift found!");
			result=false;
		}
		else
		{	
			if (this.rosterTable.haveDuplicateShift())
			{	
				result=false;
			}
			else
			{	
				if (this.rosterTable.haveBlackListedShiftPattern())
				{	
					alert("Black list shift found!");
					result=false;
				}
			}
		}
		return result;
	}
} 