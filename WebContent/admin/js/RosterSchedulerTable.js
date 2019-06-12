class RosterSchedulerTable extends RosterTable
{
	constructor(container)
	{
		super(container);
		this.itoList=null;
		this.preferredShiftList=null;
		this.showNoOfPrevDate=2;
		this.utility=new AdminUtility();
	}
/*==============================================================================================*
 *																				  				*
 *	Public Method																				*
 *																				  				*
 *==============================================================================================*/	
	build(year,month)
	{
		super.build(year,month);
		var self=this;
		var yearStatisticCell=document.getElementById("yearlyStat");
		$(yearStatisticCell).empty();
		this.utility.getYearlyStatistic(this.rosterYear,this.rosterMonth)
		.done(function(yearlyStatistic){
			self.yearlyStatistic=yearlyStatistic;
			yearStatisticCell.append(self._genYearlyStatisticReport());
			self._showButtons();
			self.rosterScheduler.initButton();
		})
		.fail(function(data){
			alert("Failed to get yearly statistic");
		});
	}
	clearAllShift()
	{
		var i,cells;
		$("td."+AdminCss.shiftCellClassName).text("").blur();
	}
	fillEmptyShiftWithO()
	{
		$("td."+AdminCss.shiftCellClassName).each(function(index,cell){
			if (cell.textContent=="")
				$(cell).text("O").blur();
		});
	}
	
	setScheduler(rosterScheduler)
	{
		this.rosterScheduler=rosterScheduler;
	}
	updateValue(theCell)
	{
		var cell,i;
		var ito=this.itoList[theCell.itoId];
		var row=theCell.parentElement;
		Object.keys(this.rosterRule.shiftHourCount).forEach(function(shiftType){
			$(theCell).removeClass(shiftType.toLowerCase()+"ShiftColor");
		});
		if (ito.isValidShift(theCell.textContent))
		{	
			$(theCell).addClass(this.utility.getShiftCssClassName(theCell.textContent));
		}
		this._updateShiftCountCells(row,this.rosterRule,ito);
		this._updateVacantCells(theCell.cellIndex,ito);
	}
/*==============================================================================================*
 *																				  				*
 *	Private Method																				*
 *																				  				*
 *==============================================================================================*/
	_buildITORow(rosterRowData)
	{
		super._buildITORow(rosterRowData);
		this._buildPreferredShiftRow(rosterRowData.itoId);
	}
/*==================================================================================================*
 *                                                                                                  *
 *         Generate Preferred Shift Rows                                                            *
 *                                                                                                  *
 *==================================================================================================*/
	_buildPreferredShiftRow(itoId)
	{
		var i,row;
		var cell=new BorderCell();
		var preferredShift=this.preferredShiftList[itoId];
		cell.innerHTML="Preferred Shift";
		row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		row.id="preferredShift_"+itoId;
		row.appendChild(cell);
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=new BorderCell();
			row.appendChild(cell);
		}
		for (i=1;i<32;i++)
		{
			if (i<Object.keys(this.dateObjList).length)
			{
				cell=new PreferredShiftCell(this);
				if (preferredShift[i]!=null)
					cell.textContent=preferredShift[i];
			}
			else
			{
				cell=new DateCell();
			}
			row.appendChild(cell);
		}
		cell=new BorderCell();
		cell.colSpan=5;
		row.appendChild(cell);
		
		for (i=0;i<5;i++)
		{
			cell=new BorderCell();
			row.appendChild(cell);
		}
	}	
	_buildRosterRows()
	{
		super._buildRosterRows();
		this._buildVacantShiftRow();
	}
	_buildShiftCells(rosterRowData,row)
	{
		var cell,i;
		var aShiftCount=0,actualWorkingHour=0.0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0,balance=0.0;
		var	noOfWorkingDay=0,thisMonthHourTotal=0.0,thisMonthBalance=0.0,totalHour=0.0;
		var result=[],shiftType;
		
		for (var i=0;i<31;i++)
		{
			if (i<Object.keys(this.dateObjList).length)
			{
				cell=new EditableShiftCell(this,rosterRowData.itoId);
				shiftType=rosterRowData.shiftList[i+1];
				if (shiftType!=null)
				{
					cell.setShiftType(shiftType);
					actualWorkingHour+=this.rosterRule.shiftHourCount[shiftType];
					switch (shiftType)
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
				}	
			}
			else
			{
				cell=new DateCell();
			}
			row.appendChild(cell);
		}
		totalHour=rosterRowData.itoworkingHourPerDay*this.noOfWorkingDay;
		thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=rosterRowData.lastMonthBalance+thisMonthHourTotal;
		noOfWorkingDay=aShiftCount+bxShiftCount+cShiftCount+dxShiftCount;
		result["totalHour"]=this.utility.roundTo(totalHour,2);
		result["lastMonthBalance"]=this.utility.roundTo(rosterRowData.lastMonthBalance,2);
		result["actualHour"]=this.utility.roundTo(actualWorkingHour,2);
		result["thisMonthHourTotal"]=this.utility.roundTo(thisMonthHourTotal,2);
		result["thisMonthBalance"]=this.utility.roundTo(thisMonthBalance,2);
		result["aShiftCount"]=aShiftCount;
		result["bxShiftCount"]=bxShiftCount;
		result["cShiftCount"]=cShiftCount;
		result["dxShiftCount"]=dxShiftCount;
		result["noOfWorkingDay"]=noOfWorkingDay;
		return result;
	}
/*==================================================================================================*
 *                                                                                                  *
 *         Generate Vacant Shift Rows                                                               *
 *                                                                                                  *
 *==================================================================================================*/
	_buildVacantShiftRow()
	{
		var aShiftData=[],bShiftData=[],cShiftData=[];
		var aShiftSD,bShiftSD,cShiftSD,avgStdDev;
		var i,self=this,shiftType,cell;
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		row.id="vacantShiftRow";
	
		this.vacantShiftRow=row;
		
		cell=new VacantShiftLabelCell();
		row.appendChild(cell);
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=new BorderCell();
			row.appendChild(cell);
		}	
		
		Object.keys(this.dateObjList).forEach(function(date){
			var essentialShift=self.rosterRule.getEssentialShift();
			cell=new VacantShiftCell();
			row.appendChild(cell);
			
			Object.keys(self.rosterList).forEach(function(itoId){
				shiftType=self.rosterList[itoId].shiftList[date];
				if (shiftType=="b1")
					essentialShift=essentialShift.replace("b","");
				else
					essentialShift=essentialShift.replace(shiftType,"");
			});
			cell.textContent=essentialShift;
		});
		
		for (i=Object.keys(this.dateObjList).length;i<31;i++)
		{
			cell=new VacantShiftCell();
			row.appendChild(cell);		
		}
		
		Object.keys(self.itoList).forEach(function(itoId){
			aShiftData.push(Number(document.getElementById(itoId+"_aShiftCount").textContent));
			bShiftData.push(Number(document.getElementById(itoId+"_bxShiftCount").textContent));
			cShiftData.push(Number(document.getElementById(itoId+"_cShiftCount").textContent));
		});
		
		cell=new BorderCell();
		cell.colSpan=5;
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id="shiftAStdDev";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id="shiftBStdDev";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id="shiftCStdDev";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.id="avgStdDev";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		row.appendChild(cell);
		
		this._updateStandardDevation(aShiftData,bShiftData,cShiftData);
	}
	_getData()
	{
		var self=this;
		return super._getData()
		.then(()=>self.utility.getITOList(self.rosterYear,self.rosterMonth))
		.then((itoList)=>self.itoList=itoList)
		.then(()=>self.utility.getPreferredShiftList(self.rosterYear,self.rosterMonth))
		.then((preferredShiftList)=>self.preferredShiftList=preferredShiftList);
	}
	_genYearlyStatisticReport()
	{
		var cell,i,self=this,row;
		var yearlyStatisticReportDiv=document.createElement("div");
		var yearlyStatisticTable=document.createElement("table");
		yearlyStatisticReportDiv.id="yearlyStatisticDiv";
		yearlyStatisticReportDiv.className=AdminCss.yearlyStatisticReportDivClassName;
		yearlyStatisticTable.id="yearlyStatisticTable";
		yearlyStatisticTable.className=AdminCss.yearlyStatisticTableClassName;
		row=yearlyStatisticTable.insertRow(yearlyStatisticTable.rows.length);
		
		cell=new BorderedAlignCenterCell();
		cell.textContent="ITO";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.textContent="a";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.textContent="bx";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.textContent="c";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.textContent="dx";
		row.appendChild(cell);
		
		cell=new BorderedAlignCenterCell();
		cell.textContent="O";
		row.appendChild(cell);

		cell=new BorderedAlignCenterCell();
		cell.textContent="Total";
		row.appendChild(cell);


		if (!$.isEmptyObject(self.yearlyStatistic))
		{
			Object.keys(self.yearlyStatistic).forEach(function(itoId){
				var aShiftTotal=0,bxShiftTotal=0,cShiftTotal=0,dxShiftTotal=0,oShiftTotal=0,finalTotal=0;
				var itoMonthlyStatistic=self.yearlyStatistic[itoId].itomonthlyStatisticList;
				var monthlyTotal;
				for (i=0;i<itoMonthlyStatistic.length;i++)
				{
					aShiftTotal+=itoMonthlyStatistic[i].ashiftTotal;
					bxShiftTotal+=itoMonthlyStatistic[i].bxShiftTotal;
					cShiftTotal+=itoMonthlyStatistic[i].cshiftTotal;
					dxShiftTotal+=itoMonthlyStatistic[i].dxShiftTotal;
					oShiftTotal+=itoMonthlyStatistic[i].oshiftTotal;
					monthlyTotal+=itoMonthlyStatistic[i].monthlyTotal;
				}
				row=yearlyStatisticTable.insertRow(yearlyStatisticTable.rows.length);
				
				cell=new BorderedAlignCenterCell();
				cell.textContent=self.yearlyStatistic[itoId].itoPostName;
				row.appendChild(cell);
				
				cell=new BorderedAlignCenterCell();
				cell.textContent=aShiftTotal;
				row.appendChild(cell);
				
				cell=new BorderedAlignCenterCell();
				cell.textContent=bxShiftTotal;
				row.appendChild(cell);
				
				cell=new BorderedAlignCenterCell();
				cell.textContent=cShiftTotal;
				row.appendChild(cell);
				
				cell=new BorderedAlignCenterCell();
				cell.textContent=dxShiftTotal;
				row.appendChild(cell);

				cell=new BorderedAlignCenterCell();		
				cell.textContent=oShiftTotal;
				row.appendChild(cell);

				finalTotal=oShiftTotal+cShiftTotal+aShiftTotal+dxShiftTotal+bxShiftTotal;
				cell=new BorderedAlignCenterCell();	
				cell.textContent=finalTotal;
				row.appendChild(cell);
				
				for (i=0;i<itoMonthlyStatistic.length;i++)
				{
					row=yearlyStatisticTable.insertRow(yearlyStatisticTable.rows.length);
					cell=new BorderedAlignCenterCell();	
					cell.textContent=i+1;
					row.appendChild(cell);
					
					cell=new BorderedAlignCenterCell();	
					cell.textContent=itoMonthlyStatistic[i].ashiftTotal;
					row.appendChild(cell);
					
					cell=new BorderedAlignCenterCell();			
					cell.textContent=itoMonthlyStatistic[i].bxShiftTotal;
					row.appendChild(cell);
					
					cell=new BorderedAlignCenterCell();		
					cell.textContent=itoMonthlyStatistic[i].cshiftTotal;
					row.appendChild(cell);
					
					cell=new BorderedAlignCenterCell();	
					cell.textContent=itoMonthlyStatistic[i].dxShiftTotal;
					row.appendChild(cell);
					
					cell=new BorderedAlignCenterCell();					
					cell.textContent=itoMonthlyStatistic[i].oshiftTotal;
					row.appendChild(cell);
					
					cell=new BorderedAlignCenterCell();				
					cell.textContent=itoMonthlyStatistic[i].monthlyTotal;
					row.appendChild(cell);
				}
			});
		}
		yearlyStatisticReportDiv.append(yearlyStatisticTable);
		return yearlyStatisticReportDiv;
	}
	_showButtons()
	{
		var autoSchedulerCell=document.getElementById("autoScheduler");
		var autoPlannerButtonCell=new AutoPlannerButtonCell();
		var autoPlannerIterationCell=new AutoPlannerIterationCell();
		var autoPlannerTable=document.createElement("table");
		var autoPlannerRow=autoPlannerTable.insertRow(autoPlannerTable.rows.length);
		var autoSchedulerResultDiv=new AutoSchedulerResultDiv();
		var buttonTable =new ButtonTable();
		var cell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		var fillEmptyShiftWithOButtonCell=new FillEmptyShiftWithOButtonCell();
		var row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell.textContent="Auto Planning Start From:";
		autoPlannerRow.appendChild(cell);
		autoPlannerRow.appendChild(new AutoPlannerSelectCell(this.dateObjList));
		
		autoPlannerRow=autoPlannerTable.insertRow(autoPlannerTable.rows.length);
		cell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		cell.textContent="Iteration Count:";
		autoPlannerRow.appendChild(cell);
		autoPlannerRow.appendChild(autoPlannerIterationCell);
		autoPlannerRow.appendChild(autoPlannerButtonCell);
		
		autoPlannerRow=autoPlannerTable.insertRow(autoPlannerTable.rows.length);
		autoPlannerRow.appendChild(fillEmptyShiftWithOButtonCell);
		
		autoSchedulerCell.append(autoPlannerTable);
		autoSchedulerResultDiv=new AutoSchedulerResultDiv();
		autoSchedulerCell.appendChild(autoSchedulerResultDiv);
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=34;
		cell.appendChild(buttonTable);
	}
	_updateShiftCountCells(row,rosterRule,ito)
	{
		var aShiftCount=0,actualWorkingHour=0.0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0,balance=0.0;
		var balance=Number(document.getElementById(ito.itoId+"_lastMonthBalance").textContent);
		var	noOfWorkingDay=0,thisMonthHourTotal=0.0,thisMonthBalance=0.0;
		var result=[],self=this,shiftType;
		var totalHour=Number(document.getElementById(ito.itoId+"_totalHour").textContent);
		$(row).children("."+Css.cursorCellClassName).each(function(){
			shiftType=this.textContent;
			if (ito.isValidShift(shiftType))
			{
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
			}
		});
		thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=thisMonthHourTotal+balance;
		noOfWorkingDay=aShiftCount+bxShiftCount+cShiftCount+dxShiftCount;
		result["totalHour"]=this.utility.roundTo(totalHour,2);
		result["lastMonthBalance"]=this.utility.roundTo(balance,2);
		result["actualHour"]=this.utility.roundTo(actualWorkingHour,2);
		result["thisMonthHourTotal"]=this.utility.roundTo(thisMonthHourTotal,2);
		result["thisMonthBalance"]=this.utility.roundTo(thisMonthBalance,2);
		result["aShiftCount"]=aShiftCount;
		result["bxShiftCount"]=bxShiftCount;
		result["cShiftCount"]=cShiftCount;
		result["dxShiftCount"]=dxShiftCount;
		result["noOfWorkingDay"]=noOfWorkingDay;
		this._updateShiftCountCellsContent(result,ito.itoId);
	}
	_updateShiftCountCellsContent(shiftCountData,itoId)
	{
		$("#"+itoId+"_totalHour").text(shiftCountData["totalHour"]);
		$("#"+itoId+"_lastMonthBalance").text(shiftCountData["lastMonthBalance"]);
		$("#"+itoId+"_actualHour").text(shiftCountData["actualHour"]);
		$("#"+itoId+"_thisMonthHourTotal").text(shiftCountData["thisMonthHourTotal"]);
		$("#"+itoId+"_thisMonthBalance").text(shiftCountData["thisMonthBalance"]);
		$("#"+itoId+"_aShiftCount").text(shiftCountData["aShiftCount"]);
		$("#"+itoId+"_bxShiftCount").text(shiftCountData["bxShiftCount"]);
		$("#"+itoId+"_cShiftCount").text(shiftCountData["cShiftCount"]);
		$("#"+itoId+"_dxShiftCount").text(shiftCountData["dxShiftCount"]);
		$("#"+itoId+"_noOfWoringDay").text(shiftCountData["noOfWorkingDay"]);
	}
	_updateStandardDevation(aShiftData,bShiftData,cShiftData)
	{
		var aShiftSD=this.utility.getSD(aShiftData);
		var bShiftSD=this.utility.getSD(bShiftData);
		var cShiftSD=this.utility.getSD(cShiftData);
		var avgStdDev=(aShiftSD+bShiftSD+cShiftSD)/3;
		
		document.getElementById("shiftAStdDev").textContent=this.utility.roundTo(aShiftSD,2);
		document.getElementById("shiftBStdDev").textContent=this.utility.roundTo(bShiftSD,2);
		document.getElementById("shiftCStdDev").textContent=this.utility.roundTo(cShiftSD,2);
		document.getElementById("avgStdDev").textContent=this.utility.roundTo(avgStdDev,2);
	}
	_updateVacantCells(cellIndex,ito)
	{
		var aShiftData=[],bShiftData=[],cShiftData=[];
		var aShiftSD,bShiftSD,cShiftSD,avgStdDev;
		var vacantShift=this.rosterRule.getEssentialShift();
		for (var itoId in this.itoList)
		{
			 var cell=document.getElementById("shift_"+itoId).cells[cellIndex];
			 if ((cell.textContent!="") && ito.isValidShift(cell.textContent))
			 {
				 if (cell.textContent=="b1")
					 vacantShift=vacantShift.replace("b","");
				 else
					 vacantShift=vacantShift.replace(cell.textContent,"");
			 } 
			 aShiftData.push(Number(document.getElementById(itoId+"_aShiftCount").textContent));
			 bShiftData.push(Number(document.getElementById(itoId+"_bxShiftCount").textContent));
			 cShiftData.push(Number(document.getElementById(itoId+"_cShiftCount").textContent));
		}
		document.getElementById("vacantShiftRow").cells[cellIndex].textContent=vacantShift;
		this._updateStandardDevation(aShiftData,bShiftData,cShiftData);
	}
}
customElements.define('roster-scheduler-table',
		RosterSchedulerTable, {
			extends: 'table'
		});