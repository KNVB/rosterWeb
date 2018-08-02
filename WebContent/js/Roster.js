/**
 * 
 */
class Roster
{
	constructor()
	{
		this.month=0;	
		this.year=1970;
		this.utility=new Utility();
		this.rosterTable=new RosterTable();
	}
	init(year,month)
	{
		var self=this;
		this.year=year;
		this.month=month;
		console.log((new Date()).getTime());
		this.rosterTable.init(year,month,this)
		.done(function(){
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
		var startDate=parseInt($("#autoPlannStartDate").val());
		var endDate=parseInt($("#autoPlanEndDate").val());
		
		if (this.rosterTable.haveInvalidPreferredShift(startDate,endDate))
			alert("Invalid shift requirement detected");
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