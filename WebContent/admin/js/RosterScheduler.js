class RosterScheduler
{
	constructor()
	{
		this.essentialShiftList;
		this.itoList;
		this.itoIdList;
		this.itoRosterList;
		this.loadingScreen=new LoadingScreen("img/icon.gif");
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
/*==============================================================================================*
 *																				  				*
 *	Public Method																				*
 *																				  				*
 *==============================================================================================*/
	autoAssign()
	{
		var startDate=this.rosterSchedulerTable.getAutoPlanStartDate();
		var endDate=this.rosterSchedulerTable.getAutoPlanEndDate();
		if (startDate>endDate)
			alert("Invalid start date or end date selection");
		else
		{	
			if (this.rosterSchedulerTable.haveInvalidPreferredShift(startDate,endDate))
				alert("Invalid shift requirement detected");
			else
			{
				var self=this;
				var finalRoster,tempArray,tempRoster;
				var roster,tempAverageSD,lowestAverageSD=100.0;
				 
				this.theLowestSDRosters=[];
				this.theLowestMissingShiftRosters=[];
				this.loadingScreen.show();
				
				/*
				 * 
				 * It looks like _genRoster is blocking the browser, and not giving it any resources to re-render/repaint until the loop is completed. 
				 * One possibility would be to run the loop after giving the browser a few ms to render the .loading
				 * https://stackoverflow.com/questions/51869613/create-an-loading-screen-for-long-calculation?noredirect=1#comment90691880_51869613
				 */
				setTimeout(() => {
						for (var i=0;i<10;i++)
						{	
							this._genRoster(startDate,endDate);
							roster=new Roster(startDate,this._genRoster(startDate,endDate),this.rosterSchedulerUtility,this.rosterRule,endDate-startDate+1);
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
						}
						this.loadingScreen.hide();
						this.rosterSchedulerTable.setLowestSDData(this.theLowestSDRosters);
						this.rosterSchedulerTable.setMissingShiftData(this.theLowestMissingShiftRosters);
						this.rosterSchedulerTable.showGenResultTable();
					}, 50);
			}	
		}
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
	loadLowestSDRoster(seq)
	{
		this.rosterSchedulerTable.loadRoster(this.theLowestSDRosters[seq]);
	}
	loadMissingShiftRoster(seq)
	{
		this.rosterSchedulerTable.loadRoster(this.theLowestMissingShiftRosters[seq]);
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
/*==============================================================================================*
 *																				  				*
 *	Private Method																				*
 *																				  				*
 *==============================================================================================*/
	_genRoster(startDate,endDate)
	{
		var allPreviousShiftList,comparetor,dateIndex
		var dateObj,essentialShiftTemp;
		var i,ito,iTOAvailableShiftList,isAssigned;
		
		var lastMonthEndDate,preferredShift,preferredShiftList,previousShiftList;
		var startIndex,resultantRoster=[],resultantShiftList=[],tempList;
		
		dateObj=new Date(this.rosterYear,this.rosterMonth,1);
		dateObj.setTime(dateObj.getTime()-864000);
		lastMonthEndDate=dateObj.getDate();
		preferredShiftList=this.rosterSchedulerTable.getPreferredShiftList(startDate,endDate);
		//console.log(this.previousMonthShiftList);
		allPreviousShiftList=this._getPreviouseShiftList(startDate);
		//console.log(allPreviousShiftList);
		for (dateIndex=startDate;dateIndex<=endDate;dateIndex++)
		{
			essentialShiftTemp=this.rosterRule.getEssentialShift();
			this.itoList=this.rosterSchedulerUtility.shuffleProperties(this.itoList);
			for (var itoId in this.itoList)
			{
				ito=this.itoList[itoId];
				if (resultantRoster[itoId]==null)
					resultantShiftList=[];
				else
					resultantShiftList=resultantRoster[itoId];
				previousShiftList=allPreviousShiftList[itoId];
				//console.log(itoId,previousShiftList);
				if (typeof preferredShiftList[itoId][dateIndex]=="undefined")
					preferredShift="";
				else		
					preferredShift=preferredShiftList[itoId][dateIndex];
				console.log("====================");
				console.log("itoId="+itoId);
				console.log("date="+dateIndex);
				console.log("preferredShift=",preferredShift);
				
				
				switch (preferredShift)
				{
					case "o"	:
								resultantShiftList[dateIndex-startDate]="O";
								previousShiftList.shift();
								previousShiftList.push("O");
								break;
					case "d" 	: 
					case "d1"	:
					case "d2"	:
					case "d3"	:
								resultantShiftList[dateIndex-startDate]=preferredShift;
								previousShiftList.shift();
								previousShiftList.push(preferredShift);
								break;
					default		:
								iTOAvailableShiftList=this.rosterRule.getITOAvailableShiftList(dateIndex,ito,preferredShift,previousShiftList,resultantShiftList);
								console.log("date="+dateIndex,iTOAvailableShiftList);
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
				resultantRoster[itoId]=resultantShiftList;
				console.log("itoId="+itoId+",resultantShiftList="+resultantShiftList);
				console.log("====================");
			}	
		}
		
		return resultantRoster;
	}
	_getPreviouseShiftList(startDate)
	{
		var i,j,itoRoster;
		var result=[];
		var shiftDataList,resultList=[];
		var startIndex=startDate-this.rosterRule.maxConsecutiveWorkingDay-1;
		var allITOShiftList=this.rosterSchedulerTable.getShiftList(1,startDate);
		for (var itoId in this.itoList)
		{
			result=[];
			shiftDataList=allITOShiftList[itoId];
			itoRoster=this.itoRosterList[itoId];
			if (startIndex<1)
			{
				j=startDate;
				for (i=j;i<this.rosterRule.maxConsecutiveWorkingDay;i++)
				{
					result.push(itoRoster.previousMonthShiftList[i+1]);
				}
			}
			if (shiftDataList!=null)
			{
				for (i=1;i<startDate;i++)
				{
					result.push(shiftDataList[i]);
				}	
			}	
			resultList[itoId]=result;
		}
		return resultList;
	}
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
}