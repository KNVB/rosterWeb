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
				//cell=new EditableShiftCell(this,rosterRowData.itoId);
				cell=new EditableCell(this,rosterRowData.itoId);
				shiftType=rosterRowData.shiftList[i+1];
				if (shiftType!=null)
				{
					//cell.setShiftType(shiftType);
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
	_buildVacantShiftRow()
	{
		
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
}
customElements.define('roster-scheduler-table',
		RosterSchedulerTable, {
			extends: 'table'
		}); 