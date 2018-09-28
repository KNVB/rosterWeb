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
		this.rosterSchedulerTable=new RosterSchedulerTable(rosterSchedulerUtility,this);
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
		});
	}
	exportRosterToExcel()
	{
		var rosterData={};
		var iTOShiftData,preferredShiftData,iTOPreferredShiftData;
		var allITOShiftData=this.rosterSchedulerTable.getAllShiftData();
		rosterData["rosterYear"]=this.rosterYear;
		rosterData["rosterMonth"]=this.rosterMonth;
		rosterData["itorosterList"]={};
		for (var itoId in this.itoList)
		{
			iTOShiftData={};
			iTOShiftData["shiftList"]=allITOShiftData[itoId];
			if (isNaN(this.rosterSchedulerTable.getLastMonthBalance(itoId)))
				iTOShiftData["balance"]=0;
			else
				iTOShiftData["balance"]=this.rosterSchedulerTable.getLastMonthBalance(itoId);
			rosterData["itorosterList"][itoId]=iTOShiftData;
		}
		rosterData["vacancyShiftData"]=this.rosterSchedulerTable.getVacancyShiftData();
		//console.log(this.rosterTable.getVacancyShiftData());
		this.utility.exportRosterToExcel(rosterData)
		.done(function(){
			alert("Export roster data to excel successfully.");
		})
		.fail(function(){
			alert("Export roster data to excel failure.");
		});
	}
	saveAllData()
	{
		var rosterData={};
		var iTOShiftData,preferredShiftData,iTOPreferredShiftData;
		var allITOShiftData=this.rosterSchedulerTable.getAllShiftData();
		var allPreferredShiftData=this.rosterSchedulerTable.getAllPreferredShiftData();
		rosterData["rosterYear"]=this.year;
		rosterData["rosterMonth"]=this.month;
		rosterData["itorosterList"]={};
		for (var itoId in this.itoList)
		{
			iTOShiftData={};
			iTOShiftData["shiftList"]=allITOShiftData[itoId];
			iTOShiftData["preferredShiftList"]=allPreferredShiftData[itoId];
			if (isNaN(this.rosterSchedulerTable.getThisMonthBalance(itoId)))
				iTOShiftData["balance"]=0;
			else
				iTOShiftData["balance"]=this.rosterSchedulerTable.getThisMonthBalance(itoId);
			rosterData["itorosterList"][itoId]=iTOShiftData;
		}
		this.utility.saveRosterData(rosterData)
		.done(function(serverResponse){
			alert("All roster data are saved.");
		})
		.fail(function(){
			alert("Save roster data failure.");
		});
	}
	validate()
	{
		var result=true;
		if (this.rosterSchedulerTable.haveMissingShift())
		{	
			alert("Missing shift found!");
			result=false;
		}
		else
		{	
			if (this.rosterSchedulerTable.haveDuplicateShift())
			{	
				result=false;
			}
			else
			{	
				if (this.rosterSchedulerTable.haveBlackListedShiftPattern())
				{	
					alert("Black list shift found!");
					result=false;
				}
				else
				{
					alert("This roster is valid.");
				}	
			}
		}
		return result;
	}
}