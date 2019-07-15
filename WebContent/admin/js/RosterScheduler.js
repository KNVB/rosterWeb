/*==============================================================================================*
 *																				  				*
 *	This is roster scheduler object. It is handling several buttons event.						*
 *																				  				*
 *==============================================================================================*/
class RosterScheduler
{	
	constructor()
	{
		this.rosterSchedulerTable=new RosterSchedulerTable($("#main")[0]);
		this.utility=new AdminUtility();
		this.loadingScreen=new LoadingScreen("img/icon.gif");
		this.rosterRule=new RosterRule(this.utility);
	}
/*==============================================================================================*
 *																				  				*
 *	Public Method																				*
 *																				  				*
 *==============================================================================================*/
	/*==============================================================================================*
	 *																				  				*
	 *It is automatic ITO shift assignment method.													*
	 *It iterates the shift assignment with the specified iteration count, and then find out 3 		*
	 *rosters that have the smallest standard deviation and missing shift count.					*
	 *																				  				* 
	 *==============================================================================================*/
	autoAssign()
	{
		var startDate=this.rosterSchedulerTable.getAutoPlanStartDate();
		var endDate=this.rosterSchedulerTable.getAutoPlanEndDate();
		var iterationCount=this.rosterSchedulerTable.getIterationCount();
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
						for (var i=0;i<iterationCount;i++)
						{	
							//this._genRoster(startDate,endDate);
							roster=new Roster(startDate,self._genRoster(startDate,endDate),self.utility,self.rosterRule,endDate-startDate+1);
							self.theLowestSDRosters.push(roster);
				    		self.theLowestSDRosters.sort(self._sortBySD);
				    		if (self.theLowestSDRosters.length==4)
				    		{	
			    				self.theLowestSDRosters.splice(3,1);
				    		}
				    		self.theLowestMissingShiftRosters.push(roster);
				    		self.theLowestMissingShiftRosters.sort(self._sortByMissingShift);
				    		if (self.theLowestMissingShiftRosters.length==4)
				    		{	
				    			self.theLowestMissingShiftRosters.splice(3,1);
				    		}
						}
						self.loadingScreen.hide();
						self.rosterSchedulerTable.setLowestSDData(self.theLowestSDRosters);
						self.rosterSchedulerTable.setMissingShiftData(self.theLowestMissingShiftRosters);
						self.rosterSchedulerTable.showGenResultTable();
						alert("Done");
					}, 50);				
			}	
		}
	}	
	/*==============================================================================================*
	 *																				  				*
	 *	It rebuild the roster table.																*
	 *																				  				*
	 *==============================================================================================*/
	buildRosterTable(year,month)
	{
		this.rosterYear=year;
		this.rosterMonth=month;
		this.rosterSchedulerTable.setScheduler(this);
		this.rosterSchedulerTable.build(year,month);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Destroy roster scheduler object related object.                            	                *
	 *																				  				*
	 *==============================================================================================*/
	destroy()
	{
		this.rosterSchedulerTable.destroy();
		this.loadingScreen=null;
		this.utility=null;
		this.rosterRule=null;
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It export the roster to an excel file.														*
	 *																				  				*
	 *==============================================================================================*/
	exportRosterToExcel()
	{
		var rosterData=this.rosterSchedulerTable.getRosterDataForExport();
		console.log(rosterData);
		this.utility.exportRosterToExcel(rosterData)
		.done(function(){
			alert("Export roster data to excel successfully.");
		})
		.fail(function(){
			alert("Export roster data to excel failure.");
		});
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It fills empty shift cell with "O"															*
	 *																				  				*
	 *==============================================================================================*/
	fillEmptyShiftWithO()
	{
		this.rosterSchedulerTable.fillEmptyShiftWithO();
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It loads the lowest SD roster to roster table												*
	 *																				  				*
	 *==============================================================================================*/
	loadLowestSDRoster(seq)
	{
		this.rosterSchedulerTable.loadRoster(this.theLowestSDRosters[seq]);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It loads the lowest missing shift count roster to roster table								*
	 *																				  				*
	 *==============================================================================================*/
	loadMissingShiftRoster(seq)
	{
		this.rosterSchedulerTable.loadRoster(this.theLowestMissingShiftRosters[seq]);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It initialize the button click handler														*
	 *																				  				*
	 *==============================================================================================*/
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
		
		$(".fillEmptyShiftWithOButton").on("click",function(){
			self.fillEmptyShiftWithO();
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
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It save the data in roster table to data base												*
	 *																				  				*
	 *==============================================================================================*/
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
				var rosterData=this.rosterSchedulerTable.getAllDataForSaveToDb();
				
				this.utility.saveRosterData(rosterData)
				.done(function(serverResponse){
					alert("All roster data are saved.");
				})
				.fail(function(){
					alert("Save roster data failure.");
				});
			}
		}
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It validate the data in roster table.														*
	 *																				  				*
	 *==============================================================================================*/
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
		/*==============================================================================================*
		 *																				  				*
		 *	It generates roster for the specified start date and end date.								*
		 *																				  				*
		 *==============================================================================================*/
		_genRoster(startDate,endDate)
		{
			var allPreviousShiftList,comparetor,dateIndex
			var dateObj,essentialShift,essentialShiftTemp;
			var i,ito,itoList,iTOAvailableShiftList,isAssigned;
			
			var lastMonthEndDate,preferredShift,preferredShiftList,previousShiftList;
			var startIndex,resultantRoster=[],resultantShiftList=[],tempList;
			
			dateObj=new Date(this.rosterYear,this.rosterMonth-1,1);
			dateObj.setTime(dateObj.getTime()-864000);
			lastMonthEndDate=dateObj.getDate();
			preferredShiftList=this.rosterSchedulerTable.getAllPreferredShiftData();
			allPreviousShiftList=this.rosterSchedulerTable.getPreviouseShiftList(startDate);
			itoList=this.rosterSchedulerTable.itoList;
			essentialShift=this.rosterRule.getEssentialShift();
			for (dateIndex=startDate;dateIndex<=endDate;dateIndex++)
			{
				essentialShiftTemp=essentialShift;
				itoList=this.utility.shuffleProperties(itoList);
				for (var itoId in itoList)
				{
					ito=itoList[itoId];
					if (resultantRoster[itoId]==null)
						resultantShiftList=[];
					else
						resultantShiftList=resultantRoster[itoId];
					previousShiftList=allPreviousShiftList[itoId];
					
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
									console.log("date="+dateIndex+",itoId="+itoId+",availableShift="+iTOAvailableShiftList);
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
		/*==============================================================================================*
		 *																				  				*
		 *	It get the previous shift list started form the specified start date.						*
		 *																				  				*
		 *==============================================================================================*/
		_getPreviouseShiftList(startDate)
		{
			return this.rosterSchedulerTable.getPreviouseShiftList(startDate);
		}
		/*==============================================================================================*
		 *																				  				*
		 *	It compares the given rosters by missing shift count.										*
		 *																				  				*
		 *==============================================================================================*/
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
		/*==============================================================================================*
		 *																				  				*
		 *	It compares the given rosters by the standard deviation.									*
		 *																				  				*
		 *==============================================================================================*/
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