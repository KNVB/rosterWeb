class RosterSchedulerTable extends RosterTable
{
	constructor(utility)
	{
		super(utility);
		
		var self=this;
		this.itoList=[];
		this.rosterRule;
		this.workingDayCount;
		this.showNoOfPrevDate=2;
		this.vancantShiftRow=document.getElementById("vancantShift");
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
		var schedulerhiftCellEventHandler=new SchedulerShiftCellEventHandler(this,"shiftCell");
	}
/*=================
 * Public method  *
 *=================*/
	clearAllShift()
	{
		var i,cells;
		var itoId,shiftRow,shiftRows=this._getAllShiftRow();
		for (var itoId in shiftRows)
		{
			shiftRow=shiftRows[itoId];
			$(shiftRow).children("td.shiftCell").html("").blur();
		}
		cells=$(shiftRow).children("td.shiftCell");
		for (i=0;i<cells.length;i++)
		{
			$(this.vancantShiftRow.cells[cells[i].cellIndex]).html("");
		}
	}
	haveDuplicateShift()
	{
		
	}
	haveMissingShift()
	{
		var cells,essentialShift;
		var i,shift;
		var shiftCells;
		var shiftRow;
		var shiftRows=this._getAllShiftRow();
		cells=$("td.shiftCell");
		for (i=0;i<cells.length;i++)
		{
			shiftRow=cells[i].parentElement;
			console.log(shiftRow.id+","+cells[i].cellIndex);
		}	
		/*for (var itoId in shiftRows)
		{
			shiftRow=shiftRows[itoId];
			essentialShift=this.rosterRule.getEssentialShift();
			cells=$(shiftRow).children("td.shiftCell");
			for (i=0;i<cells.length;i++)
			{
				console.log(itoId+","+cells[i].cellIndex);
			}	
		}*/	
		
	}
/*=================
 * Private method  *
 *=================*/
	_getAllShiftRow()
	{
		var result=[];
		var shiftRow;
		for (var itoId in this.itoList)
		{
			shiftRow=document.getElementById("shift_"+itoId);
			result[itoId]=shiftRow;
		}
		return result;
	}
	_updateValue(theCell)
	{
		var shiftRow=theCell.parentElement;
		var itoId=shiftRow.id.replace("shift_","");
		var shift=theCell.textContent;
		var ito=this.itoList[itoId];
		
		if (shift=="")
		{
			theCell.className="borderCell alignCenter shiftCell";
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
					default:	
							theCell.className+=" oShiftColor";
							break;
				}
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
		var shiftCells=$(shiftRow).children("td.shiftCell");
		totalHourCell=document.getElementById(itoId+"_totalHour");
		actualHourCell=document.getElementById(itoId+"_actualHour");
		lastMonthBalanceCell=document.getElementById(itoId+"_lastMonthBalance");
		thisMonthTotalCell=document.getElementById(itoId+"_thisMonthHourTotal");
		thisMonthBalanceCell=document.getElementById(itoId+"_thisMonthBalance");
		aShiftCountCell=document.getElementById(itoId+"_aShiftCount");
		bShiftCountCell=document.getElementById(itoId+"_bxShiftCount");
		cShiftCountCell=document.getElementById(itoId+"_cShiftCount");
		dShiftCountCell=document.getElementById(itoId+"_dxShiftCount");
		noOfWorkingDayCell=document.getElementById(itoId+"_noOfWoringDay");
		
		for (i=0;i<shiftCells.length;i++)
		{
			shift=shiftCells[i].textContent;
			if (this.rosterRule.shiftHourCount[shift]!=null)
			{	
				actualHour+=this.rosterRule.shiftHourCount[shift];
				switch (shift)
				{
					case "a":
							aShiftCount++;
							break;	
					case "b":
					case "b1":
							bShiftCount++;
							break;
					case "c":
							cShiftCount++;
							break;
					case "d":
					case "d1":
					case "d2":
					case "d3":
							dShiftCount++;
							break;					
				}
			}
		}
		actualHourCell.textContent=this.utility.roundTo(actualHour,2);
		
		thisMonthTotalCell.textContent=this.utility.roundTo((parseFloat(actualHour)-parseFloat(totalHourCell.textContent)),2);
		thisMonthBalanceCell.textContent=this.utility.roundTo((parseFloat(thisMonthTotalCell.textContent)+parseFloat(lastMonthBalanceCell.textContent)),2);
		
		//update total no. of varies shift value
		aShiftCountCell.textContent=aShiftCount;
		this._updateStandardDevValue("A",aShiftCountCell.cellIndex);
		
		bShiftCountCell.textContent=bShiftCount;
		this._updateStandardDevValue("B",bShiftCountCell.cellIndex);
		
		cShiftCountCell.textContent=cShiftCount;
		this._updateStandardDevValue("C",cShiftCountCell.cellIndex);
		
		dShiftCountCell.textContent=dShiftCount;
		
		noOfWorkingDayCell.textContent=(aShiftCount+bShiftCount+cShiftCount+dShiftCount);
	}
	_updateStandardDevValue(shiftName,cellIndex)
	{
		var shiftCount=[];
		var rows=this._getAllShiftRow(),row;
		for (var itoId in rows)
		{
			row=rows[itoId];
			
			if ((row.cells[cellIndex].textContent!="") &&(row.cells[cellIndex].textContent!="N.A."))
			{	
				shiftCount.push(parseInt(row.cells[cellIndex].textContent));
			}
		}

		if (shiftCount.length>0)
		{
			var value=this.utility.getSD(shiftCount);
			//console.log(shiftCount,value);
			eval("this.shift"+shiftName+"StdDev="+value);
			document.getElementById("shift"+shiftName+"StdDev").textContent=this.utility.roundTo(value,2);
		}
		shiftCount=[];
		shiftCount.push(this.shiftAStdDev);
		shiftCount.push(this.shiftBStdDev);
		shiftCount.push(this.shiftCStdDev);
		this.averageShiftStdDev=this.utility.getMean(shiftCount);
		document.getElementById("avgStdDev").textContent=this.utility.roundTo(this.averageShiftStdDev,2);
	}
}	