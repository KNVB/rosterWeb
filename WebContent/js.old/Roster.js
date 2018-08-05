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
		this.rosterTable=new RosterTable();
		this.rosterRule=this.rosterTable.rosterRule;
	}
	init(year,month)
	{
		var self=this;
		this.year=year;
		this.month=month;
		
		console.log((new Date()).getTime());
		this.rosterTable.init(year,month,this)
		.done(function(){
			self.itoList=self.rosterTable.itoList;
			console.log((new Date()).getTime());
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
		})
		.fail(function(error){
			alert("An error occur when retrieving roster data:"+data);	
		})
	}
	autoAssign()
	{
		var ito;
		var result,shift;
		var preferredShift;
		var itoPreferredShift;
		var resultantRoster=[];
		var resultantShiftList;
		var itoShiftList,itoShift;
		var utility=new Utility(),isAssigned,comparetor;	
		var itoPreviousShiftList,itoPreferredShiftList,essentialShiftTemp;
		var startDate=parseInt($("#autoPlannStartDate").val());
		var endDate=parseInt($("#autoPlanEndDate").val());
		
		if (this.rosterTable.haveInvalidPreferredShift(startDate,endDate))
			alert("Invalid shift requirement detected");
		else
		{
			itoPreferredShiftList=this.rosterTable.getPreferredShiftList(startDate,endDate);
			var i=startDate;
			for (var i=startDate;i<=endDate;i++)
			{
				essentialShiftTemp=this.rosterRule.getEssentialShift()
				this.itoList=utility.shuffleProperties(this.itoList);
				
				//var itoId="ITO6_1999-01-01";
				//var itoId="ITO3_2017-10-18";
				for (var itoId in this.itoList)
				{
				//	console.log(itoId);
					itoPreferredShift=itoPreferredShiftList[itoId];
					preferredShift=itoPreferredShift[i-1];
					if (resultantRoster[itoId]==null)
						resultantShiftList=[];
					else
						resultantShiftList=resultantRoster[itoId];

					switch (preferredShift)
					{
						case "o":
						//		console.log(i+" O shift is assigned");
								resultantShiftList[i-startDate]="O";
								break;
						case "d" : 
						case "d1":
						case "d2":
						case "d3":
						//		console.log(i+" "+preferredShift+" shift is assigned");
								resultantShiftList[i-startDate]=preferredShift;
								break;
						default:
								result=this.rosterRule.getITOAvailableShiftList(i,itoId,preferredShift,resultantShiftList,this.rosterTable);
								if ((essentialShiftTemp=="") || (result.length==0))
								{
									console.log(i+" O shift is assigned to "+itoId);
									resultantShiftList[i-startDate]="O";
								}
								else
								{
								//	console.log(preferredShift);
									console.log("available shift:"+result);
									isAssigned=false;
									for (var j=0;j<result.length;j++)
									{
										switch (result[j])
										{
											case "b1":
													comparetor="b";
													break;
											default:
													comparetor=result[j];
													break;
										}
								//		console.log(comparetor,result[j]);
										if (essentialShiftTemp.indexOf(comparetor)>-1)
										{
											essentialShiftTemp=essentialShiftTemp.replace(comparetor,"");
											console.log(i+" "+result[j]+" shift is assigned to "+itoId);
											resultantShiftList[i-startDate]=result[j];
											isAssigned=true;
											break;
										}	
									}
									if (!isAssigned)
									{
										console.log(i+" O shift is assigned to "+itoId);
										resultantShiftList[i-startDate]="O";
									}	
								}
								break;
					}
					//console.log("==============================================");
					resultantRoster[itoId]=resultantShiftList;
				}
			}
			console.log(resultantRoster);
		}
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
				rosterData+="{\"itoId\":\""+itoId+"\",";
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
				console.log(iTOPreferredShiftData.shiftDate);
				rosterData+="{\"itoId\":\""+itoId+"\",";
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
		//console.log(rosterData);
		jQuery.ajax({"url": "saveRosterData.jsp",
			 dataType: 'text',
			 data:rosterData,
			 method:"POST",
			 success:function(){
				 		alert("All roster data are saved.");
			 		 },	
			 error:this.utility.showAjaxErrorMessage
		});
		
	}
/*	getShiftAStdDev()
	{
		return this.rosterTable.shiftAStdDev;
	}
	getShiftBStdDev()
	{
		return this.rosterTable.shiftBStdDev;
	}
	getShiftCStdDev()
	{
		return this.rosterTable.shiftCStdDev;
	}
	getAverageShiftStdDev()
	{
		return this.rosterTable.averageShiftStdDev;
	}*/
}