class RosterViewer
{
	constructor(utility)
	{
		this.utility=utility;
		this.rosterTable=new RosterTable(utility);
		var self=this;
		var monthSelect=document.getElementById("selectRosterMonth");
		
		monthSelect.onchange=function(){
			var month=parseInt(this.options[this.selectedIndex].value);
			var year=parseInt(this.nextSibling.textContent);
			self.reloadRosterData(year,month);
		};
	}
	reloadRosterData(year,month)
	{
		var self=this;
		this.utility.getRosterRule(year,month)
		.done(function(serverResponse){
			self.rosterRule=new RosterRule(self.utility);
			self.rosterRule.essentialShiftList=serverResponse.essentialShiftList;
			self.rosterRule.maxConsecutiveWorkingDay=serverResponse.maxConsecutiveWorkingDay;
			self.rosterRule.shiftHourCount=serverResponse.shiftHourCount;
			
			self.utility.getRosterData(year,month)
			.done(function(serverResponse){
				
				var temp,ito;
				var itoList=[];
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
						itoList[itoId]=ito;
					}
				self.rosterTable.calendarList=serverResponse.calendarList;
				self.rosterTable.setRosterRule(self.rosterRule);
				self.rosterTable.itoList=itoList;
				self.rosterTable.refresh(serverResponse.rosterList);
			});			
		});
	}
}	