/**
 * 
 */
class RosterScheduler
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
	saveAllData()
	{
		var iTOShiftData,preferredShiftData,iTOPreferredShiftData;
		var allITOShiftData=this.rosterTable.getAllShiftData();
		var allPreferredShiftData=this.rosterTable.getAllPreferredShiftData();
		
		var rosterData ="{\"rosterYear\":"+this.year+",";
		rosterData+="\"rosterMonth\":"+(this.month+1)+",";
		rosterData+="\"itorosterList\":{";
		var itoId="ITO1_1999-01-01";
		
		
		for (var itoId in allITOShiftData)
		{
			//console.log("ito_id="+itoId);
			rosterData+="\""+itoId+"\":{\"shiftList\":[";
			iTOShiftData=allITOShiftData[itoId].shiftList;
			for (var i=0;i<iTOShiftData.length;i++)
			{
				rosterData+="{";
				rosterData+="\"shift\":\""+iTOShiftData[i]+"\",";
				rosterData+="\"shiftDate\":"+Date.UTC(this.year,this.month,i+1);
				rosterData+="},";
			}
			rosterData=rosterData.substring(0,rosterData.length-1);
			rosterData+="],";
			rosterData+="\"preferredShiftList\":[";
			preferredShiftData=allPreferredShiftData[itoId].preferredShiftList;
			for (var i=0;i<preferredShiftData.length;i++)
			{
				iTOPreferredShiftData=preferredShiftData[i];
			//	console.log(iTOPreferredShiftData.shiftDate);
				rosterData+="{";
				rosterData+="\"shift\":\""+iTOPreferredShiftData.shift+"\",";
				rosterData+="\"shiftDate\":"+Date.UTC(this.year,this.month,iTOPreferredShiftData.shiftDate);
				rosterData+="},";
			}
			if (rosterData.endsWith(","))
				rosterData=rosterData.substring(0,rosterData.length-1);
			rosterData+="],";
			rosterData+="\"balance\":"+this.rosterTable.getThisMonthBalance(itoId)+"},";
			/*
			console.log(this.rosterTable.getThisMonthBalance(itoId));
			console.log("========================================");
			*/
		}
		rosterData=rosterData.substring(0,rosterData.length-1);
		rosterData+="}}";
		this.utility.saveRosterData(rosterData)
		.done(function(serverResponse){
			alert("All roster data are saved.");
		})
		.fail(function(){
			alert("Save roster data failure.");
		});
	}
	autoAssign()
	{
		var startDate=parseInt($("#autoPlannStartDate").val());
		var endDate=parseInt($("#autoPlanEndDate").val());
		
		if (startDate>endDate)
			alert("Invalid start date or end date selection");
		else
		{	
			if (this.rosterTable.haveInvalidPreferredShift(startDate,endDate))
				alert("Invalid shift requirement detected");
			else
			{
				this._genRoster(startDate,endDate);
			}	
		}		
	}
//--------------------------------------------------------------------------------------------------------------------------
	_genRoster(startDate,endDate)
	{
		var ito,essentialShiftTemp;
		var resultantRoster=[],resultantShiftList=[];
		var preferredShiftList,previousShiftList,startIndex,preferredShift;
		preferredShiftList=this.rosterTable.getPreferredShiftList(startDate,endDate);
		
		for (var i=startDate;i<=endDate;i++)
		{
			essentialShiftTemp=this.rosterRule.getEssentialShift()
			this.itoList=this.utility.shuffleProperties(this.itoList);
			console.log("Day "+i);
			for (var itoId in this.itoList)
			{
				ito=this.itoList[itoId];
				previousShiftList=this.rosterTable.getPreviousShiftList(startDate,itoId);
				if (resultantRoster[itoId]==null)
					resultantShiftList=[];
				else
					resultantShiftList=resultantRoster[itoId];
				
				console.log("ito name:"+ito.name);
				//console.log("previousShiftList:"+previousShiftList);
				//console.log("preferredShiftList:"+preferredShiftList[itoId][i]);
				if (typeof preferredShiftList[itoId][i-1]=="undefined")
					preferredShift="";
				else		
					preferredShift=preferredShiftList[itoId][i-1];
				switch (preferredShift)
				{
					case "o":
							console.log(i+" O shift is assigned");
							resultantShiftList[i-startDate]="O";
							break;
					case "d" : 
					case "d1":
					case "d2":
					case "d3":
							console.log(preferredShift+" shift is assigned on "+i);
							resultantShiftList[i-startDate]=preferredShift;
							break;
					default:
							
				}
				console.log("========================================");	
			}
		}	
	}
}