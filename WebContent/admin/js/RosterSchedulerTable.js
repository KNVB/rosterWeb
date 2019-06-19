class RosterSchedulerTable extends RosterTable
{
	constructor(container)
	{
		super(container);
		var self=this;
		this.itoList=null;
		this.preferredShiftList=null;
		this.showNoOfPrevDate=2;
		this.utility=new AdminUtility();
		this.selectedRegion=new SelectedRegion(this);

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
		$(document).mouseup(function(){
			event.preventDefault();
			if (self.selectedRegion.inSelectMode)
				self.selectedRegion.endSelect();
		});
	}
	clearAllShift()
	{
		var i,cells;
		$("td."+AdminCss.shiftCellClassName).text("").blur();
	}
	clearSelectedRegion(selectedRegion)
	{
		var cell,i,j;
		for (i=selectedRegion.minY;i<=selectedRegion.maxY;i++)
		{
			for (j=selectedRegion.minX;j<=selectedRegion.maxX;j++)
			{
				cell=this.getCell(i,j);
				//cell.blur();
				$(cell).removeClass(AdminCss.selectCellBorderRightClassName);   
				$(cell).removeClass(AdminCss.selectCellBorderTopClassName);     
				$(cell).removeClass(AdminCss.selectCellBorderBottomClassName);  
				$(cell).removeClass(AdminCss.selectCellBorderLeftClassName);
			}	
		}
	}
	fillEmptyShiftWithO()
	{
		$("td."+AdminCss.shiftCellClassName).each(function(index,cell){
			if (cell.textContent=="")
				$(cell).text("O").blur();
		});
	}
	getCell(rowIndex,cellIndex)
	{
		var row=this.rows[rowIndex];
		var cell=row.cells[cellIndex];
		return cell;
	}
	getIterationCount()
	{
		return parseInt($("#iterationCount").val());
	}
	getNextCellInRosterTable(yOffset,xOffset)
	{
		var theCell=this.getCell(this.selectedRegion.minY,this.selectedRegion.minX);
		var index;
		var maxRowCount=Object.keys(this.itoList).length*2;
		var orgIndex=$.inArray(theCell,this.cursorCells);
		var nextCell;
		
		if (this.selectedRegion.isSingleCell())
		{
			var newX=orgIndex % Object.keys(this.dateObjList).length;
			var newY=(orgIndex-newX)/Object.keys(this.dateObjList).length;
			
			newX+=xOffset;
			if (newX>=Object.keys(this.dateObjList).length)
				newX=0;
			else
				if (newX<0)
					newX=Object.keys(this.dateObjList).length-1;
			newY+=yOffset;
			if (newY>=maxRowCount)
				newY=0;
			else
				if (newY<0)
					newY=maxRowCount-1;
			//console.log(newX,newY);
			index=newX+newY*Object.keys(this.dateObjList).length;
			
			nextCell=this.cursorCells[index];
			return nextCell;
		}
	}
	setScheduler(rosterScheduler)
	{
		this.rosterScheduler=rosterScheduler;
	}
	setSelectedRegion(selectedRegion)
	{
		var cell,i;
		cell=this.getCell(selectedRegion.minY,selectedRegion.minX);
		$(cell).addClass(AdminCss.selectCellBorderTopClassName);
		$(cell).addClass(AdminCss.selectCellBorderLeftClassName);

		cell=this.getCell(selectedRegion.minY,selectedRegion.maxX);
		$(cell).addClass(AdminCss.selectCellBorderTopClassName);
		$(cell).addClass(AdminCss.selectCellBorderRightClassName);

		cell=this.getCell(selectedRegion.maxY,selectedRegion.minX);
		$(cell).addClass(AdminCss.selectCellBorderBottomClassName);
		$(cell).addClass(AdminCss.selectCellBorderLeftClassName);

		cell=this.getCell(selectedRegion.maxY,selectedRegion.maxX);
		$(cell).addClass(AdminCss.selectCellBorderBottomClassName);
		$(cell).addClass(AdminCss.selectCellBorderRightClassName);

		for (i=selectedRegion.minY+1;i<selectedRegion.maxY;i++)
		{
			cell=this.getCell(i,selectedRegion.minX);
			$(cell).addClass(AdminCss.selectCellBorderLeftClassName);

			cell=this.getCell(i,selectedRegion.maxX);
			$(cell).addClass(AdminCss.selectCellBorderRightClassName);
		}
		for (i=selectedRegion.minX+1;i<selectedRegion.maxX;i++)
		{
			cell=this.getCell(selectedRegion.minY,i);
			$(cell).addClass(AdminCss.selectCellBorderTopClassName);

			cell=this.getCell(selectedRegion.maxY,i);
			$(cell).addClass(AdminCss.selectCellBorderBottomClassName);
		}
	}
	updateValue(theCell,itoId)
	{
		var cell,i;
		var ito=this.itoList[itoId];
		var row=theCell.parentElement;
		Object.keys(this.rosterRule.shiftHourCount).forEach(function(shiftType){
			$(theCell).removeClass(shiftType.toLowerCase()+"ShiftColor");
		});
		if (ito.isValidShift(theCell.textContent))
		{	
			$(theCell).addClass(this.utility.getShiftCssClassName(theCell.textContent));
			$(theCell).removeClass(AdminCss.errorRedBlackGroundClassName);
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
		var preferredShift=this.preferredShiftList[itoId];
		var cell=AdminCellFactory.PreferredShiftNameCell;
		
		row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		row.id="preferredShift_"+itoId;
		row.appendChild(cell);
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=AdminCellFactory.BorderCell;
			row.appendChild(cell);
		}
	}
	_buildRosterRows()
	{
		super._buildRosterRows();
		this._buildVacantShiftRow();
		this.cursorCells=$("td."+Css.cursorCellClassName);
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
				cell=AdminCellFactory.getEditableShiftCell(this,rosterRowData.itoId);
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
				cell=AdminCellFactory.DateCell;
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
	_buildVacantShiftRow()
	{
		var aShiftData=[],bShiftData=[],cShiftData=[];
		var aShiftSD,bShiftSD,cShiftSD,avgStdDev;
		var i,self=this,shiftType,cell;
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		row.id="vacantShiftRow";

		this.vacantShiftRow=row;
		cell=AdminCellFactory.VacantShiftLabelCell;
		row.appendChild(cell);
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=AdminCellFactory.BorderCell;
			row.appendChild(cell);
		}
		
		Object.keys(this.dateObjList).forEach(function(date){
			var essentialShift=self.rosterRule.getEssentialShift();
			cell=AdminCellFactory.VacantShiftCell;
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
			cell=AdminCellFactory.VacantShiftCell;
			row.appendChild(cell);		
		}

		Object.keys(self.itoList).forEach(function(itoId){
			aShiftData.push(Number(document.getElementById(itoId+"_aShiftCount").textContent));
			bShiftData.push(Number(document.getElementById(itoId+"_bxShiftCount").textContent));
			cShiftData.push(Number(document.getElementById(itoId+"_cShiftCount").textContent));
		});

		cell=AdminCellFactory.BorderedAlignCenterCell;
		cell.colSpan=5;
		row.appendChild(cell);

		cell=AdminCellFactory.BorderedAlignCenterCell;
		cell.id="shiftAStdDev";
		row.appendChild(cell);

		cell=AdminCellFactory.BorderedAlignCenterCell;
		cell.id="shiftBStdDev";
		row.appendChild(cell);

		cell=AdminCellFactory.BorderedAlignCenterCell;
		cell.id="shiftCStdDev";
		row.appendChild(cell);

		cell=AdminCellFactory.BorderedAlignCenterCell;
		cell.id="avgStdDev";
		row.appendChild(cell);

		cell=AdminCellFactory.BorderedAlignCenterCell;
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

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.textContent="ITO";
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.textContent="a";
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.textContent="bx";
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.textContent="c";
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.textContent="dx";
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
		cell.textContent="O";
		row.appendChild(cell);

		cell=SimpleCellFactory.BorderedAlignCenterCell;
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

				cell=SimpleCellFactory.BorderedAlignCenterCell;
				cell.textContent=self.yearlyStatistic[itoId].itoPostName;
				row.appendChild(cell);

				cell=SimpleCellFactory.BorderedAlignCenterCell;
				cell.textContent=aShiftTotal;
				row.appendChild(cell);

				cell=SimpleCellFactory.BorderedAlignCenterCell;
				cell.textContent=bxShiftTotal;
				row.appendChild(cell);

				cell=SimpleCellFactory.BorderedAlignCenterCell;
				cell.textContent=cShiftTotal;
				row.appendChild(cell);

				cell=SimpleCellFactory.BorderedAlignCenterCell;
				cell.textContent=dxShiftTotal;
				row.appendChild(cell);

				cell=SimpleCellFactory.BorderedAlignCenterCell;
				cell.textContent=oShiftTotal;
				row.appendChild(cell);

				finalTotal=oShiftTotal+cShiftTotal+aShiftTotal+dxShiftTotal+bxShiftTotal;
				cell=SimpleCellFactory.BorderedAlignCenterCell;
				cell.textContent=finalTotal;
				row.appendChild(cell);

				for (i=0;i<itoMonthlyStatistic.length;i++)
				{
					row=yearlyStatisticTable.insertRow(yearlyStatisticTable.rows.length);
					cell=SimpleCellFactory.BorderedAlignCenterCell;	
					cell.textContent=i+1;
					row.appendChild(cell);

					cell=SimpleCellFactory.BorderedAlignCenterCell;	
					cell.textContent=itoMonthlyStatistic[i].ashiftTotal;
					row.appendChild(cell);

					cell=SimpleCellFactory.BorderedAlignCenterCell;
					cell.textContent=itoMonthlyStatistic[i].bxShiftTotal;
					row.appendChild(cell);

					cell=SimpleCellFactory.BorderedAlignCenterCell;
					cell.textContent=itoMonthlyStatistic[i].cshiftTotal;
					row.appendChild(cell);

					cell=SimpleCellFactory.BorderedAlignCenterCell;
					cell.textContent=itoMonthlyStatistic[i].dxShiftTotal;
					row.appendChild(cell);

					cell=SimpleCellFactory.BorderedAlignCenterCell;			
					cell.textContent=itoMonthlyStatistic[i].oshiftTotal;
					row.appendChild(cell);

					cell=SimpleCellFactory.BorderedAlignCenterCell;		
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
		var autoPlannerButtonCell=AdminCellFactory.AutoPlannerButtonCell;
		var autoPlannerIterationCell=AdminCellFactory.AutoPlannerIterationCell;
		var autoPlannerTable=document.createElement("table");
		var autoPlannerRow=autoPlannerTable.insertRow(autoPlannerTable.rows.length);
		var autoSchedulerResultDiv=AdminCellFactory.AutoSchedulerResultDiv;
		var buttonTable =AdminCellFactory.ButtonTable;
		var cell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		var fillEmptyShiftWithOButtonCell=AdminCellFactory.FillEmptyShiftWithOButtonCell;
		var row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell.textContent="Auto Planning Start From:";
		autoPlannerRow.appendChild(cell);
		autoPlannerRow.appendChild(AdminCellFactory.getAutoPlannerSelectCell(this.dateObjList));

		autoPlannerRow=autoPlannerTable.insertRow(autoPlannerTable.rows.length);
		cell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		cell.textContent="Iteration Count:";
		autoPlannerRow.appendChild(cell);
		autoPlannerRow.appendChild(autoPlannerIterationCell);
		autoPlannerRow.appendChild(autoPlannerButtonCell);

		autoPlannerRow=autoPlannerTable.insertRow(autoPlannerTable.rows.length);
		autoPlannerRow.appendChild(fillEmptyShiftWithOButtonCell);

		autoSchedulerCell.append(autoPlannerTable);
		autoSchedulerResultDiv=AdminCellFactory.AutoSchedulerResultDiv;
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
		var cell,ito,shiftType;
		var vacantShift=this.rosterRule.getEssentialShift();
		for (var itoId in this.itoList)
		{
			 cell=document.getElementById("shift_"+itoId).cells[cellIndex];
			 ito=this.itoList[itoId];
			 shiftType=cell.textContent;
			 if ((shiftType!="") && ito.isValidShift(shiftType))
			 {
				 if (cell.textContent=="b1")
					 vacantShift=vacantShift.replace("b","");
				 else
					 vacantShift=vacantShift.replace(shiftType,"");
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