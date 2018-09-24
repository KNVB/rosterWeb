class RosterViewer
{
	constructor(utility)
	{
		this.utility=utility;
		var self=this;
		var monthSelect=document.getElementById("selectRosterMonth");
		self.itoList=[];
		monthSelect.onchange=function(){
			var month=parseInt(this.options[this.selectedIndex].value);
			var year=parseInt(this.nextSibling.textContent);
			self.reloadRosterData(year,month).then(function (){
				self.refreshRosterTable();
			},
			function(errorMsg){
				console.log(errorMsg);
			});
			
		};
	}
	reloadRosterData(year,month)
	{
		var self=this;
		self.rosterMonth=month;
		self.rosterYear=year;
		return new Promise((resolve, reject) => {
			this.utility.getRosterRule(year,month)
			.done(function(serverResponse){
				self.rosterRule=new RosterRule(self.utility);
				self.rosterRule.essentialShiftList=serverResponse.essentialShiftList;
				self.rosterRule.maxConsecutiveWorkingDay=serverResponse.maxConsecutiveWorkingDay;
				self.rosterRule.shiftHourCount=serverResponse.shiftHourCount;
				console.log("Get Roster Rule successfully.");
			})
			.then(function(serverResponse){
				self.utility.getRosterData(year,month)
				.done(function(serverResponse){
					console.log("Get Roster data successfully.");
					var temp,ito;
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
						}
					self.calendarList=serverResponse.calendarList;
					self.rosterRule=self.rosterRule;
					self.rosterList=serverResponse.rosterList;
					resolve();
				})
				.fail(function(jqXHR, textStatus, errorThrown){
					reject("Get Roster data failure.");
				});	
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				reject("Get Roster Rule failure.");
			});
		});
		
	}
	refreshRosterTable()
	{
		console.log("viewer");
	}
}