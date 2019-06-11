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

	
	setScheduler(rosterScheduler)
	{
		this.rosterScheduler=rosterScheduler;
	}
/*==============================================================================================*
 *																				  				*
 *	Private Method																				*
 *																				  				*
 *==============================================================================================*/
	_buildITORow(rosterRowData)
	{
		var cell=new BorderCell(),i;
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
	
		
		this.utility.buildPreviousMonthShiftCells(rosterRowData,this,row)
		for (i=0;i<rosterRowData.shiftList.length;i++)
		{
			cell=new EditableShiftCell(this);
			cell.setShiftType(rosterRowData.shiftList[i]);
			row.appendChild(cell);
		}
		for (var j=i;j<31;j++)
		{
			cell=new DateCell();
			row.appendChild(cell);
		}
		this.utility.buildShiftCountCell(rosterRowData,row);
		this._buildPreferredShift(rosterRowData.itoId);
	}
/*==================================================================================================*
 *                                                                                                  *
 *         Generate Preferred Shift Rows                                                            *
 *                                                                                                  *
 *==================================================================================================*/
	_buildPreferredShift(itoId)
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
		for (i=0;i<31;i++)
		{
			if (i<Object.keys(this.dateObjList).length)
			{
				cell=new PreferredShiftCell(this);
				if (preferredShift[i+1]!=null)
					cell.textContent=preferredShift[i+1];
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
}
customElements.define('roster-scheduler-table',
		RosterSchedulerTable, {
			extends: 'table'
		});