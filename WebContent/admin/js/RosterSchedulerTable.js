class RosterSchedulerTable extends RosterTable
{
	constructor(utility)
	{
		super(utility);
		this.rosterRule;
		var self=this;
		this.shiftStartCellIndex=3;
		
		$(".findMissingShiftButton").on("click",function(){
			self.haveMissingShift();
		});
		$(".findDuplicateShiftButton").on("click",function(){
			self.haveDuplicateShift();
		});
		$(".clearAllButton").on("click",function(){
			self.clearAllShift();
		});
		
		$(".checkAllButton").on("click",function(){
			rosterScheduler.validate();	
		});
		
		$(".autoPlannerButton").on("click",function(){
			rosterScheduler.autoAssign();
		});
		
		$(".exportButton").on("click",function(){
			rosterScheduler.exportRosterToExcel();
		});
		$(".saveRosterToDBButton").on("click",function(){
			rosterScheduler.saveAllData();
		});
		
		
		$("#theLowestSD").on("click",function(){
			rosterScheduler.loadLowestSDRoster(0);
		});
		$("#secondLowestSD").on("click",function(){
			rosterScheduler.loadLowestSDRoster(1);
		});
		$("#thirdLowestSD").on("click",function(){
			rosterScheduler.loadLowestSDRoster(2);
		});
		
		$("#theLowestMissingShiftCount").on("click",function(){
			rosterScheduler.loadMissingShiftRoster(0);
		});
		$("#theSecondLowestMissingShiftCount").on("click",function(){
			rosterScheduler.loadMissingShiftRoster(1);
		});
		$("#theThirdLowestMissingShiftCount").on("click",function(){
			rosterScheduler.loadMissingShiftRoster(2);
		});
		$(".shiftCell").on("blur",function(){
			self._updateValue(this);
		});
	}
/*=================
 * Public method  *
 *=================*/
	clearAllShift()
	{
		var shiftRows=this._getAllShiftRow();
		shiftRows.children(".shiftCell").text("").blur();
	}
/*=================
 * Private method  *
 *=================*/
	_getAllShiftRow()
	{
		return $("tr[id^='shift_']");
	}
	_updateValue(theCell)
	{
		var shiftRow=theCell.parentElement;
		var itoId=shiftRow.id.replace("shift_","");
		var shift=theCell.textContent;
		if (shift=="")
		{
			theCell.className="borderCell alignCenter";
			if (theCell.cellIndex>=this.shiftStartCellIndex)
				this._reCalculate(shiftRow,itoId);
		}
		else
		{
			var ito=this.itoList[itoId];
			if (ito.isValidShift(shift))
			{
				theCell.className="borderCell alignCenter shiftCell";
				switch (shift)
				{
					case "a":
							theCell.className+=" aShiftColor";
							break;	
					case "b":
					case "b1":
							theCell.className+=" bShiftColor";
							break;
					case "c":
							theCell.className+=" cShiftColor";
							break;
					case "d":
					case "d1":
					case "d2":
					case "d3":
							theCell.className+=" dxShiftColor";
							break;
					case "O":
							theCell.className+=" oShiftColor";
							break;
				}
				if (theCell.cellIndex>=this.shiftStartCellIndex)
					this._reCalculate(shiftRow,itoId);
			}
		}
	}
	_reCalculate(shiftRow,itoId)
	{
		var i,shift;
		var actualHour=0,shiftCount,myShiftRow;
		var aShiftCount=0,bShiftCount=0,cShiftCount=0,dShiftCount=0;
		var totalHourCell,actualHourCell,thisMonthTotalCell,thisMonthBalanceCell,lastMonthBalanceCell;
		var aShiftCountCell,bShiftCountCell,cShiftCountCell,dShiftCountCell,noOfWorkingDayCell;
		 
		totalCell=document.getElementById(itoId+"_totalHour");
		actualHourCell=document.getElementById(itoId+"_actualHour");
		lastMonthBalanceCell=document.getElementById(itoId+"_lastMonthBalance");
		thisMonthTotalCell=document.getElementById(itoId+"_thisMonthHourTotal");
		thisMonthBalanceCell=document.getElementById(itoId+"_thisMonthBalance");
		aShiftCountCell=document.getElementById(itoId+"_aShiftCount");
		bShiftCountCell=document.getElementById(itoId+"_bxShiftCount");
		cShiftCountCell=document.getElementById(itoId+"_cShiftCount");
		dShiftCountCell=document.getElementById(itoId+"_dxShiftCount");
		noOfWorkingDayCell=document.getElementById(itoId+"_noOfWoringDay");
		
	}
}	