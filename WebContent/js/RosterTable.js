class RosterTable
{
	constructor()
	{
		this.aShiftData=[];
		this.bShiftData=[];
		this.cShiftData=[];
		this.dateRow=document.getElementById("dateRow");
		this.holidayRow=document.getElementById("holidayRow");
		this.itoIdList=[];
		this.itoRosterList={};
		this.monthEndDate;
		this.noOfWorkingDay=0;
		this.showNoOfPrevDate=2;
		this.rosterBody=document.getElementById("rosterBody");
		this.rosterFooter=document.getElementById("rosterFooter");
		this.rosterHeader=document.getElementById("rosterHeader");
		this.rosterRule;
		this.rosterRowList={};
		this.table=document.getElementById("rosterTable");
		this.utility=new Utility();
		this.weekdayRow=document.getElementById("weekdayRow");
	}
	genRosterRowList()
	{
		var actualWorkingHour, aShiftCount;
		var bxShiftCount;
		var cell,cShiftCount;
		var dxShiftCount,endIndex,i,itoRoster;
		var row,self=this,shiftType,shiftTypeList,startIndex=0;
		var thisMonthBalance,thisMonthHourTotal ,totalHour;
		
		this.itoIdList.forEach(function(itoId){
			
			aShiftCount=0;bxShiftCount=0;cShiftCount=0;dxShiftCount=0;
			actualWorkingHour=0.0;thisMonthHourTotal=0.0;thisMonthBalance=0.0;
			itoRoster=self.itoRosterList[itoId];
			//console.log(itoRoster);
			totalHour=itoRoster.itoworkingHourPerDay*self.noOfWorkingDay;
			//row=self.rosterBody.insertRow(self.rosterBody.rows.length);
			row=document.createElement("tr");
			row.id="shift_"+itoId;
			cell=row.insertCell(row.cells.length);
			cell.className="borderCell alignLeft";
			cell.innerHTML=itoRoster.itoname+"<br>"+itoRoster.itopostName+" Extn. 2458";
			if ($.isEmptyObject(itoRoster.previousMonthShiftList))
			{
				startIndex=0;
				endIndex=self.showNoOfPrevDate;
			}	
			else
			{
				startIndex=Object.keys(itoRoster.previousMonthShiftList).length-self.showNoOfPrevDate+1;
				endIndex=Object.keys(itoRoster.previousMonthShiftList).length+1;
			}
			for (i=startIndex;i<endIndex;i++)
			{
				cell=row.insertCell(row.cells.length);
				cell.className="alignCenter borderCell";
				if (itoRoster.previousMonthShiftList[i]!=null)
				{
					shiftType=itoRoster.previousMonthShiftList[i];
					cell.textContent=shiftType
					$(cell).addClass(self.utility.getShiftCssClassName(shiftType));
				}
			}
			for (i=0;i<31;i++)
			{
				cell=row.insertCell(row.cells.length);
				if ((i+1)<=self.monthEndDate)
					cell.className="alignCenter borderCell cursorCell shiftCell";
				else
					cell.className="alignCenter borderCell";
				if (itoRoster.shiftList[i+1]!=null)
				{
					shiftType=itoRoster.shiftList[i+1];
					cell.textContent=shiftType;
					$(cell).addClass(self.utility.getShiftCssClassName(shiftType));
					shiftTypeList=shiftType.split("\+");
					shiftTypeList.forEach(function(shiftType){
						switch(shiftType)
						{
							case "a":
									aShiftCount++;
									break;
							case "b":
							case "b1":
									bxShiftCount++;
									break;
							case "c":
									cShiftCount++;
									break;
							case "d":
							case "d1":
							case "d2":
							case "d3":
									dxShiftCount++;
									break;		
						}
						actualWorkingHour+=self.rosterRule.shiftHourCount[shiftType];
						//console.log(i+1,shiftType,self.shiftHourCount[shiftType]);
					});
				}	
			}
			//console.log(actualWorkingHour,totalHour);
			thisMonthHourTotal=actualWorkingHour-totalHour;
			thisMonthBalance=thisMonthHourTotal+itoRoster.balance;
			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_totalHour";
			cell.className="alignCenter borderCell";
			cell.textContent=self.utility.roundTo(totalHour,2);
			
			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_actualHour";
			cell.className="alignCenter borderCell";
			cell.textContent=self.utility.roundTo(actualWorkingHour,2);
			
			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_lastMonthBalance";
			cell.className="alignCenter borderCell";
			cell.textContent=self.utility.roundTo(itoRoster.balance,2);
			
			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_thisMonthHourTotal";
			cell.className="alignCenter borderCell";
			cell.textContent=self.utility.roundTo(thisMonthHourTotal,2);
			
			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_thisMonthBalance";
			cell.className="alignCenter borderCell";
			cell.textContent=self.utility.roundTo(thisMonthBalance,2);
			
			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_aShiftCount";
			cell.className="alignCenter borderCell";
			cell.textContent=aShiftCount;

			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_bxShiftCount";
			cell.className="alignCenter borderCell";
			cell.textContent=bxShiftCount;

			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_cShiftCount";
			cell.className="alignCenter borderCell";
			cell.textContent=cShiftCount;

			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_dxShiftCount";
			cell.className="alignCenter borderCell";
			cell.textContent=dxShiftCount;

			cell=row.insertCell(row.cells.length);
			cell.id=itoId+"_noOfWoringDay";
			cell.className="alignCenter borderCell";
			cell.textContent=(dxShiftCount+cShiftCount+bxShiftCount+aShiftCount);
			self.rosterRowList[itoId]=row;
			if ($.isEmptyObject(itoRoster.shiftList))
			{
				self.aShiftData.push(0);
				self.bShiftData.push(0);
				self.cShiftData.push(0);
			}	
			else
			{
				self.aShiftData.push(aShiftCount); 
				self.bShiftData.push(bxShiftCount); 
				self.cShiftData.push(cShiftCount);
			}	
		});
	}
	getRosterMonth()
	{
		var dropDownBox=document.getElementById("selectRosterMonth");
		var result=dropDownBox.value;
		//var result=dropDownBox.options[dropDownBox.selectedIndex].value;
		return result;
	}
	getRosterYear()
	{
		var rosterYear=document.getElementById("selectRosterYear");
		return rosterYear.value;
	}
	markCoorindate(theCell)
	{
		var row=theCell.parentElement;
		var dateRow=this.dateRow;
		var cell=dateRow.cells[theCell.cellIndex];
		$(cell).addClass("highlight");
		
		cell=row.cells[0];
		$(cell).addClass("highlight");
	}
	unMarkCoorindate(theCell)
	{
		var row=theCell.parentElement;
		var dateRow=this.dateRow;
		var cell=dateRow.cells[theCell.cellIndex];
		$(cell).removeClass("highlight");
		cell=row.cells[0];
		$(cell).removeClass("highlight");
	}
	show()
	{
		var self=this;
		this.genRosterRowList();
		this.itoIdList.forEach(function(itoId){
			var row=self.rosterRowList[itoId];
			self.rosterBody.append(row);
		});
	}
}