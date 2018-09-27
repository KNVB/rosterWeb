class RosterScheduler
{
	constructor(rosterSchedulerUtility,year,month)
	{
		var self=this;
		this.itoList=[];
		this.loadingScreen=new MyLoadingScreen({imgPath:"img/icon.gif"});
		this.rosterMonth=month;
		this.rosterRule;
		this.rosterSchedulerUtility=rosterSchedulerUtility;
		this.rosterSchedulerTable=new RosterSchedulerTable(rosterSchedulerUtility);
		this.rosterYear=year;
		
		this.rosterSchedulerUtility.getRosterRule(year,month)
		.done(function(serverResponse){
			self.rosterRule=new RosterRule(self.utility);
			self.rosterRule.essentialShiftList=serverResponse.essentialShiftList;
			self.rosterRule.maxConsecutiveWorkingDay=serverResponse.maxConsecutiveWorkingDay;
			self.rosterRule.shiftHourCount=serverResponse.shiftHourCount;
			self.rosterSchedulerUtility.getITOList(year,month)
			.done(function(serverResponse){
				var ito,temp;
				self.itoList=[];
				for (var itoId in serverResponse)
				{
					temp=(serverResponse[itoId]);
					ito=new ITO();
					ito.name=temp.name;
					ito.itoId=itoId;
					ito.postName=temp.postName;
					ito.availableShiftList=temp.availableShiftList;
					ito.workingHourPerDay=temp.workingHourPerDay;
					ito.blackListShiftPatternList=temp.blackListedShiftPatternList;
					self.itoList[itoId]=ito;
				}
				self.rosterSchedulerTable.rosterRule=self.rosterRule;	
				self.rosterSchedulerTable.itoList=self.itoList;
			})
			.fail(function(serverResponse){
				alert("ITO list initialization failure.");
			});
		})
		.fail(function(){
			alert("RosterRule initialization failure.");
		});;
	}	
}