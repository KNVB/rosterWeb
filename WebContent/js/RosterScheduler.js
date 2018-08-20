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
		this.rosterTable=new RosterTable(this.utility,this);
		this.loadingScreen=new MyLoadingScreen({imgPath:"img/icon.gif"});
		
		//console.log((new Date()).getTime());
		/*
		$(".checkAllButton").on("click",function(){
			self.validate();	
		});
		
		$(".autoPlannerButton").on("click",function(){
			self.autoAssign();
		});
		
		$(".saveRosterToDBButton").on("click",function(){
			self.saveAllData();
		});*/			
	}
	init(year,month)
	{
		var self=this,itoCount=0;
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
				self.itoList=[];
				for (var itoId in serverResponse.itoList)
					{
						temp=(serverResponse.itoList[itoId]);
						ito=new ITO();
						ito.name=temp.itoName;
						ito.itoId=itoId;
						ito.postName=temp.postName;
						ito.availableShiftList=temp.availableShiftList;
						ito.workingHourPerDay=temp.workingHourPerDay;
						ito.blackListShiftPatternList=temp.blackListedShiftPatternList;
						self.itoList[itoId]=ito;
						itoCount++;
					}
				self.rosterRule.maxNoOfShiftPerMonth=Math.floor(serverResponse.calendarList.length/itoCount);
				self.rosterTable.itoList=self.itoList;
				self.rosterTable.setRosterRule(self.rosterRule);
				self.rosterTable.calendarList=serverResponse.calendarList;
				self.rosterTable.init(self.year,self.month,self);
				self.rosterTable.loadRosterData(serverResponse.rosterList);
			//	console.log(self.rosterRule.maxNoOfShiftPerMonth);
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
		rosterData+="\"rosterMonth\":"+(this.month)+",";
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
			
			if (isNaN(this.rosterTable.getThisMonthBalance(itoId)))
				rosterData+="\"balance\":0},";
			else
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
		var startDate=this.rosterTable.getAutoPlanStartDate();
		var endDate=this.rosterTable.getAutoPlanEndDate();
		if (startDate>endDate)
			alert("Invalid start date or end date selection");
		else
		{	
			if (this.rosterTable.haveInvalidPreferredShift(startDate,endDate))
				alert("Invalid shift requirement detected");
			else
			{
				var self=this;
				var finalRoster,tempArray,tempRoster;
				var roster,tempAverageSD,lowestAverageSD=100.0;
				 
				this.theLowestSDRosters=[];
				this.theLowestMissingShiftRosters=[];
				this.loadingScreen.show();
				setTimeout(() => {
					  for (var i = 0; i < 100; i++) {
						roster=new Roster(startDate,this._genRoster(startDate,endDate),this.utility,this.rosterRule,endDate-startDate+1);
			    		this.theLowestSDRosters.push(roster);
			    		this.theLowestSDRosters.sort(this._sortBySD);
			    		if (this.theLowestSDRosters.length==4)
			    		{	
		    				this.theLowestSDRosters.splice(3,1);
			    		}
			    		this.theLowestMissingShiftRosters.push(roster);
			    		this.theLowestMissingShiftRosters.sort(this._sortByMissingShift);
			    		if (this.theLowestMissingShiftRosters.length==4)
			    		{	
			    			this.theLowestMissingShiftRosters.splice(3,1);
			    		}
			    		//this.theLowestSDRosters[roster.averageShiftStdDev]=roster;
				       	//this.theLowestMissingShiftRosters[roster.missingShiftCount]=roster;
					  }
					  this.loadingScreen.hide();
					  this.rosterTable.setLowestSDData(this.theLowestSDRosters);
					  this.rosterTable.setMissingShiftData(this.theLowestMissingShiftRosters);
					  this.rosterTable.showGenResultTable();
					}, 50);
				
				/*console.log("The lowest average SD="+lowestAverageSD);
				console.log("The lowest missing shift="+lowestAverageSD);
				console.log(finalRoster);
				//this.rosterTable.clearAllShift();
				this.rosterTable.loadRoster(startDate,finalRoster);*/
			}	
		}
	}
	loadLowestSDRoster(seq)
	{
		this.rosterTable.loadRoster(this.theLowestSDRosters[seq]);
	}
	loadMissingShiftRoster(seq)
	{
		this.rosterTable.loadRoster(this.theLowestMissingShiftRosters[seq]);
	}
//--------------------------------------------------------------------------------------------------------------------------
	_sortByMissingShift(a,b)
	{
		let comparison = 0;
		if (a.missingShiftCount>b.missingShiftCount)
			comparison = 1;
		else
		{
			if (b.missingShiftCount>a.missingShiftCount)
				comparison = -1;
			else
			{
				if (a.averageShiftStdDev>b.averageShiftStdDev)
					comparison = 1;
				else
				{
					if (b.averageShiftStdDev>a.averageShiftStdDev)
						comparison = -1;
				}	
			}	
		}	
		return comparison;
	}
	_sortBySD(a,b)
	{
		let comparison = 0;
		if (a.averageShiftStdDev>b.averageShiftStdDev)
			comparison = 1;
		else
		{
			if (b.averageShiftStdDev>a.averageShiftStdDev)
				comparison = -1;
			else
			{
				if (a.missingShiftCount>b.missingShiftCount)
					comparison = 1;
				else
					if (b.missingShiftCount>a.missingShiftCount)
						comparison = -1;
			}	
		}	
		return comparison;
	}
	_genRoster(startDate,endDate)
	{
		var ito,essentialShiftTemp;
		var resultantRoster=[],resultantShiftList=[];
		var iTOAvailableShiftList,isAssigned,comparetor,dateIndex;
		var preferredShiftList,previousShiftList,startIndex,preferredShift,allPreviousShiftList;
		preferredShiftList=this.rosterTable.getPreferredShiftList(startDate,endDate);
		allPreviousShiftList=this.rosterTable.getPreviousShiftList(startDate,this.itoList);
		for (dateIndex=startDate;dateIndex<=endDate;dateIndex++)
		{
			//console.log("Day "+dateIndex);
			essentialShiftTemp=this.rosterRule.getEssentialShift();
			this.itoList=this.utility.shuffleProperties(this.itoList);
			for (var itoId in this.itoList)
			{
				ito=this.itoList[itoId];
				if (resultantRoster[itoId]==null)
					resultantShiftList=[];
				else
					resultantShiftList=resultantRoster[itoId];
				previousShiftList=allPreviousShiftList[itoId];
				if (typeof preferredShiftList[itoId][dateIndex-1]=="undefined")
					preferredShift="";
				else		
					preferredShift=preferredShiftList[itoId][dateIndex-1];
				
				//console.log("ito name:"+ito.name);
				//console.log("previousShiftList:"+previousShiftList);
				//console.log("preferredShift:"+preferredShift);
				switch (preferredShift)
				{
					case "o":
					//		console.log(" O shift is assigned on day "+dateIndex);
							resultantShiftList[dateIndex-startDate]="O";
							previousShiftList.shift();
							previousShiftList.push("O");
							break;
					case "d" : 
					case "d1":
					case "d2":
					case "d3":
						//	console.log(preferredShift+" shift is assigned on day "+dateIndex);
							resultantShiftList[dateIndex-startDate]=preferredShift;
							previousShiftList.shift();
							previousShiftList.push(preferredShift);
							break;
					default:
							iTOAvailableShiftList=this.rosterRule.getITOAvailableShiftList(dateIndex,ito,preferredShift,previousShiftList,resultantShiftList);
							if ((essentialShiftTemp=="") || (iTOAvailableShiftList.length==0))
							{
							//	console.log("O shift is assigned on day "+dateIndex);
								resultantShiftList[dateIndex-startDate]="O";
								previousShiftList.shift();
								previousShiftList.push("O");
							}
							else
							{
							//	console.log("available shift:"+iTOAvailableShiftList);
							//	console.log(itoId+","+resultantShiftList);
								isAssigned=false;
								for (var j=0;j<iTOAvailableShiftList.length;j++)
								{
									switch (iTOAvailableShiftList[j])
									{
										case "b1":
												comparetor="b";
												break;
										default:
												comparetor=iTOAvailableShiftList[j];
												break;
									}
							//		console.log(comparetor,result[j]);
									if (essentialShiftTemp.indexOf(comparetor)>-1)
									{
										essentialShiftTemp=essentialShiftTemp.replace(comparetor,"");
								//		console.log(iTOAvailableShiftList[j]+" shift is assigned on day "+dateIndex);
										resultantShiftList[dateIndex-startDate]=iTOAvailableShiftList[j];
										previousShiftList.shift();
										previousShiftList.push(iTOAvailableShiftList[j]);
										isAssigned=true;
										break;
									}	
								}
								if (!isAssigned)
								{
								//	console.log(" O shift is assigned on day "+dateIndex);
									resultantShiftList[dateIndex-startDate]="O";
									previousShiftList.shift();
									previousShiftList.push("O");
								}	
							}
							break;
				}			
				//console.log("========================================");
				resultantRoster[itoId]=resultantShiftList;
			}
		}
		return(resultantRoster);
	}
}