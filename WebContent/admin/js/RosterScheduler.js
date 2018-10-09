class RosterScheduler
{
	constructor()
	{
		this.essentialShiftList;
		this.itoList;
		this.itoIdList;
		this.itoRosterList;
		this.maxConsecutiveWorkingDay;
		this.monthEndDate;
		this.noOfWorkingDay;
		this.preferredShiftList;
		this.rosterRule;
		this.rosterSchedulerTable=new RosterSchedulerTable();
		this.shiftHourCount;
		this.rosterSchedulerUtility=new RosterSchedulerUtility();
		this.yearlyStatistic;
	}
	exportRosterToExcel()
	{
		var rosterData={};
		var iTOShiftData,preferredShiftData,iTOPreferredShiftData;
		var allITOShiftData=this.rosterSchedulerTable.getAllShiftData();
		rosterData["rosterYear"]=this.rosterSchedulerTable.getRosterYear();
		rosterData["rosterMonth"]=this.rosterSchedulerTable.getRosterMonth();
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
		rosterData["vacantShiftData"]=this.rosterSchedulerTable.getVacantShiftData();
		
		//console.log(this.rosterTable.getVacancyShiftData());
		console.log(rosterData);
		this.rosterSchedulerUtility.exportRosterToExcel(rosterData)
		.done(function(){
			alert("Export roster data to excel successfully.");
		})
		.fail(function(){
			alert("Export roster data to excel failure.");
		});
	}
	initButton()
	{
		var self=this;
		$(".findMissingShiftButton").on("click",function(){
			self.rosterSchedulerTable.haveMissingShift();
		});
		$(".findDuplicateShiftButton").on("click",function(){
			self.rosterSchedulerTable.haveDuplicateShift();
		});
		$(".clearAllButton").on("click",function(){
			self.rosterSchedulerTable.clearAllShift();
		});
		
		$(".checkAllButton").on("click",function(){
			self.validate();	
		});
		
		$(".autoPlannerButton").on("click",function(){
			self.autoAssign();
		});
		
		$(".exportButton").on("click",function(){
			self.exportRosterToExcel();
		});
		$(".saveRosterToDBButton").on("click",function(){
			self.saveAllData();
		});
		
		
		$("#theLowestSD").on("click",function(){
			self.loadLowestSDRoster(0);
		});
		$("#secondLowestSD").on("click",function(){
			self.loadLowestSDRoster(1);
		});
		$("#thirdLowestSD").on("click",function(){
			self.loadLowestSDRoster(2);
		});
		
		$("#theLowestMissingShiftCount").on("click",function(){
			self.loadMissingShiftRoster(0);
		});
		$("#theSecondLowestMissingShiftCount").on("click",function(){
			self.loadMissingShiftRoster(1);
		});
		$("#theThirdLowestMissingShiftCount").on("click",function(){
			self.loadMissingShiftRoster(2);
		});
		$(".shiftCell").on("blur",function(){
			self.rosterSchedulerTable.updateValue(this);
		});
	}
	show()
	{
		var ito;
		this.rosterSchedulerTable.itoList=this.itoList;
		this.rosterSchedulerTable.itoIdList=this.itoIdList;
		this.rosterSchedulerTable.itoRosterList=this.itoRosterList;
		this.rosterSchedulerTable.monthEndDate=this.monthEndDate;
		this.rosterSchedulerTable.noOfWorkingDay=this.noOfWorkingDay;
		this.rosterSchedulerTable.itoRosterList=this.itoRosterList;
		this.rosterSchedulerTable.shiftHourCount=this.shiftHourCount;
		this.rosterSchedulerTable.preferredShiftList=this.preferredShiftList;
		this.rosterSchedulerTable.rosterRule=this.rosterRule;
		this.rosterSchedulerTable.yearlyStatistic=this.yearlyStatistic;
			
		this.rosterSchedulerTable.show();
		this.initButton();
	}
	saveAllData()
	{
		if (this.rosterSchedulerTable.haveInvalidPreferredShift())
			alert("Invalid preferred shift detected.");
		else
		{
			if (this.rosterSchedulerTable.haveInvalidShift())
				alert("Invalid shift detected.")
			else
			{
				var rosterData={};
				var iTOShiftData,preferredShiftData,iTOPreferredShiftData;
				var allITOShiftData=this.rosterSchedulerTable.getAllShiftData();
				var allPreferredShiftData=this.rosterSchedulerTable.getAllPreferredShiftData();
				rosterData["rosterYear"]=this.rosterSchedulerTable.getRosterYear();
				rosterData["rosterMonth"]=this.rosterSchedulerTable.getRosterMonth();
				rosterData["itorosterList"]={};
				rosterData["itopreferredShiftList"]={};
				for (var itoId in this.itoList)
				{
					iTOShiftData={};
					iTOShiftData["shiftList"]=allITOShiftData[itoId];
					if (isNaN(this.rosterSchedulerTable.getThisMonthBalance(itoId)))
						iTOShiftData["balance"]=0;
					else
						iTOShiftData["balance"]=this.rosterSchedulerTable.getThisMonthBalance(itoId);
					rosterData["itopreferredShiftList"][itoId]=allPreferredShiftData[itoId];
					rosterData["itorosterList"][itoId]=iTOShiftData;
				}
				console.log(rosterData);
				this.rosterSchedulerUtility.saveRosterData(rosterData)
				.done(function(serverResponse){
					alert("All roster data are saved.");
				})
				.fail(function(){
					alert("Save roster data failure.");
				});
			}	
		}	
		
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