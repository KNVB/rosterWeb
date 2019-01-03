class RosterSchedulerTable extends RosterTable
{
	constructor(container)
	{
		super(container);
		this.showNoOfPrevDate=2;
		this.utility=new AdminUtility();
		this.preferredShiftList=null;
	}
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
			alert("Failed to yearly statistic");
		});
	}
	clearAllShift()
	{
		var i,cells;
		Object.keys(this.rosterList).forEach(function (itoId){
			$("#shift_" +itoId).children("td.shiftCell").html("").blur();
		});
		$(this.vacantShiftRow).children("td.vacantShift").html("").blur();
	}
	setScheduler(rosterScheduler)
	{
		this.rosterScheduler=rosterScheduler;
	}
	updateValue(theCell)
	{
		console.log("he");
	}
	_buildITORow(itoId)
	{
		super._buildITORow(itoId);
		var i;
		var preferredShift=this.preferredShiftList[itoId];
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		var cell=row.insertCell(row.cells.length);
		row.id="preferredShift_"+itoId;
		cell.className="borderCell alignLeft";
		cell.innerHTML="Preferred Shift";

		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="alignCenter borderCell";
		}
		for (var i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			if (i<Object.keys(this.dateObjList).length)
			{
				cell.className="alignCenter borderCell cursorCell";
				if (preferredShift[i+1]!=null)
				{
					cell.textContent=preferredShift[i+1];
				}
			}
			else
				cell.className="alignCenter borderCell";
		}
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.colSpan=5;
		
		for (i=0;i<5;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="alignCenter borderCell";
		}
	}
	_buildRosterRows()
	{
		super._buildRosterRows();
		var i,self=this;
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		var shiftAStdDev=this.utility.getSD(this.aShiftData);
		var shiftBStdDev=this.utility.getSD(this.bShiftData);
		var shiftCStdDev=this.utility.getSD(this.cShiftData);
		var avgStdDev=(shiftAStdDev+shiftBStdDev+shiftCStdDev)/3;
		var cell=row.insertCell(row.cells.length);
		row.id="vacantShiftRow";
		this.vacantShiftRow=row;
		cell.textContent="Vacant Shifts";
		cell.className="vacantShiftLabel borderCell";
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="alignCenter borderCell";
		}
		Object.keys(this.dateObjList).forEach(function(date){
			var vacantShift=self.rosterRule.getEssentialShift();
			cell=row.insertCell(row.cells.length);
			cell.className="alignCenter borderCell vacantShift";
			Object.keys(self.rosterList).forEach(function(itoId){
				var rosterData=self.rosterList[itoId];
				var shiftType=rosterData.shiftList[date];
				if (shiftType=="b1")
					vacantShift=vacantShift.replace("b","");
				else
					vacantShift=vacantShift.replace(shiftType,"");
			});
			cell.textContent=vacantShift;
		});		
		for (i=Object.keys(this.dateObjList).length;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			cell.className="alignCenter borderCell";
		}
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.colSpan=5;
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.id="shiftAStdDev";
		cell.textContent=this.utility.roundTo(shiftAStdDev,2);
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.id="shiftBStdDev";
		cell.textContent=this.utility.roundTo(shiftBStdDev,2);
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.id="shiftCStdDev";
		cell.textContent=this.utility.roundTo(shiftCStdDev,2);
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		cell.id="avgStdDev";
		cell.textContent=this.utility.roundTo(avgStdDev,2);
		
		cell=row.insertCell(row.cells.length);
		cell.className="alignCenter borderCell";
		
		$("td.cursorCell").attr('contentEditable',true);
		$("td.shiftCell").on("blur",function(){
			self.updateValue(this);
		});

	}
	_genYearlyStatisticReport()
	{
		var cell,i,self=this,row;
		var yearlyStatisticReportDiv=document.createElement("div");
		var yearlyStatisticTable=document.createElement("table");
		yearlyStatisticReportDiv.id="yearlyStatisticDiv";
		yearlyStatisticReportDiv.className="yearlyStatisticReportDiv";
		yearlyStatisticTable.id="yearlyStatisticTable";
		yearlyStatisticTable.className="yearlyStatisticTable";
		row=yearlyStatisticTable.insertRow(yearlyStatisticTable.rows.length);
		
		cell=row.insertCell(row.cells.length);
		cell.className="borderCell alignCenter";
		cell.textContent="ITO";
		
		cell=row.insertCell(row.cells.length);
		cell.className="borderCell alignCenter";
		cell.textContent="a";
		
		cell=row.insertCell(row.cells.length);
		cell.className="borderCell alignCenter";
		cell.textContent="bx";
		
		cell=row.insertCell(row.cells.length);
		cell.className="borderCell alignCenter";
		cell.textContent="c";
		
		cell=row.insertCell(row.cells.length);
		cell.className="borderCell alignCenter";
		cell.textContent="dx";
		
		cell=row.insertCell(row.cells.length);
		cell.className="borderCell alignCenter";
		cell.textContent="O";

		cell=row.insertCell(row.cells.length);
		cell.className="borderCell alignCenter";
		cell.textContent="Total";

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
				cell=row.insertCell(row.cells.length);
				cell.className="borderCell alignCenter";
				cell.textContent=self.yearlyStatistic[itoId].itoPostName;
				
				cell=row.insertCell(row.cells.length);
				cell.className="borderCell alignCenter";
				cell.textContent=aShiftTotal;

				cell=row.insertCell(row.cells.length);
				cell.className="borderCell alignCenter";
				cell.textContent=bxShiftTotal;

				cell=row.insertCell(row.cells.length);
				cell.className="borderCell alignCenter";
				cell.textContent=cShiftTotal;
				
				cell=row.insertCell(row.cells.length);
				cell.className="borderCell alignCenter";
				cell.textContent=dxShiftTotal;

				cell=row.insertCell(row.cells.length);
				cell.className="borderCell alignCenter";
				cell.textContent=oShiftTotal;

				finalTotal=oShiftTotal+cShiftTotal+aShiftTotal+dxShiftTotal+bxShiftTotal;
				cell=row.insertCell(row.cells.length);
				cell.className="borderCell alignCenter";
				cell.textContent=finalTotal;
				
				for (i=0;i<itoMonthlyStatistic.length;i++)
				{
					row=yearlyStatisticTable.insertRow(yearlyStatisticTable.rows.length);
					cell=row.insertCell(row.cells.length);
					cell.className="borderCell alignCenter";
					cell.textContent=i+1;
					
					cell=row.insertCell(row.cells.length);
					cell.className="borderCell alignCenter";
					cell.textContent=itoMonthlyStatistic[i].ashiftTotal;
					
					cell=row.insertCell(row.cells.length);
					cell.className="borderCell alignCenter";
					cell.textContent=itoMonthlyStatistic[i].bxShiftTotal;

					cell=row.insertCell(row.cells.length);
					cell.className="borderCell alignCenter";
					cell.textContent=itoMonthlyStatistic[i].cshiftTotal;

					cell=row.insertCell(row.cells.length);
					cell.className="borderCell alignCenter";
					cell.textContent=itoMonthlyStatistic[i].dxShiftTotal;

					cell=row.insertCell(row.cells.length);
					cell.className="borderCell alignCenter";
					cell.textContent=itoMonthlyStatistic[i].oshiftTotal;

					cell=row.insertCell(row.cells.length);
					cell.className="borderCell alignCenter";
					cell.textContent=itoMonthlyStatistic[i].monthlyTotal;
				}
			});
		}
		yearlyStatisticReportDiv.append(yearlyStatisticTable);
		return yearlyStatisticReportDiv;
	}	
	_getData()
	{
		var self=this;
		return super._getData().then(function(){
			return new Promise((resolve, reject) =>{
				self.utility.getPreferredShiftList(self.rosterYear,self.rosterMonth)
				.done(function(preferredShiftList){
					self.preferredShiftList=preferredShiftList;
					resolve();
				})
				.fail(function(data){
					 alert("Failed to get Preferred shift list.");
					 reject();
				 });
			});
		});
	}
	_showButtons()
	{
		var autoPlannerTable,autoPlannerRow,autoPlannerCell,autoPlanStartDateSelect,autoPlanEndDateSelect;
		var autoSchedulerDiv,autoSchedulerResultDiv,autoSchedulerResultTable,autoSchedulerResultCell,autoSchedulerResultRow;
		var i,iterationCountInput,cell,select,row,buttonTable,option;
		cell=document.getElementById("autoScheduler");
		autoPlannerTable=document.createElement("table");
		//autoPlannerTable.setAttribute("border","1");
		autoPlannerRow=autoPlannerTable.insertRow(autoPlannerTable.rows.length);
		
		autoPlannerCell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		autoPlannerCell.textContent="Auto Planning Start From:";
		autoPlannerCell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		autoPlanStartDateSelect=document.createElement("select");
		autoPlanStartDateSelect.id="autoPlanStartDate";
		for (i=1;i<=Object.keys(this.dateObjList).length;i++)
		{
			option=document.createElement("option");
			option.value=i;
			option.text=i;
			autoPlanStartDateSelect.append(option);
		}
		autoPlannerCell.append(autoPlanStartDateSelect);
		$(autoPlannerCell).append("&nbsp;to&nbsp;");
		autoPlanEndDateSelect=document.createElement("select");
		autoPlanEndDateSelect.id="autoPlanEndDate";
		for (i=1;i<=Object.keys(this.dateObjList).length;i++)
		{
			option=document.createElement("option");
			option.value=i;
			option.text=i;
			autoPlanEndDateSelect.append(option);
		}	
		option.selected=true;
		autoPlannerCell.append(autoPlanEndDateSelect);
		autoPlannerCell.colSpan=2;
		
		autoPlannerRow=autoPlannerTable.insertRow(autoPlannerTable.rows.length);
		autoPlannerCell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		autoPlannerCell.textContent="Iteration Count:";
		
		autoPlannerCell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		iterationCountInput=document.createElement("input");
		iterationCountInput.id="iterationCount";
		iterationCountInput.type="number";
		iterationCountInput.value="100";
		autoPlannerCell.append(iterationCountInput);
		
		autoPlannerCell=autoPlannerRow.insertCell(autoPlannerRow.cells.length);
		autoPlannerCell.innerHTML="&nbsp;<a class=\"autoPlannerButton\">Auto Planner</a>";
		
		cell.append(autoPlannerTable);
		
		autoSchedulerResultDiv=document.createElement("div");
		autoSchedulerResultDiv.id="genResult";
		autoSchedulerResultDiv.style.paddingLeft="10px";
		autoSchedulerResultDiv.style.display="none";
		autoSchedulerResultTable=document.createElement("table");
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.colSpan=2;
		autoSchedulerResultCell.textContent="Standard Deviation:";
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="theLowestSD";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="secondLowestSD";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="thirdLowestSD";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.colSpan=2;
		autoSchedulerResultCell.innerHTML="<br>";
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.colSpan=2;
		autoSchedulerResultCell.textContent="Missing shift Count:";
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="theLowestMissingShiftCount";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="theSecondLowestMissingShiftCount";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		
		autoSchedulerResultRow=autoSchedulerResultTable.insertRow(autoSchedulerResultTable.rows.length);
		autoSchedulerResultRow.id="theThirdLowestMissingShiftCount";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		autoSchedulerResultCell=autoSchedulerResultRow.insertCell(autoSchedulerResultRow.cells.length);
		autoSchedulerResultCell.textContent="1";
		
		autoSchedulerResultDiv.append(autoSchedulerResultTable);
		cell.append(autoSchedulerResultDiv);
		
		row=this.rosterFooter.insertRow(this.rosterFooter.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=33;
		buttonTable=document.createElement("table");
		//buttonTable.setAttribute("border","1");
		buttonTable.style.width="100%";
		buttonTable.style.borderSpacing="10px";
		cell.append(buttonTable);
		row=buttonTable.insertRow(buttonTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"findMissingShiftButton\">Find Missing Shift</a>";
		
		cell=row.insertCell(row.cells.length);
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"findDuplicateShiftButton\">Find Duplicate Shift</a>";
		
		cell=row.insertCell(row.cells.length);
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"checkAllButton\">is it a valid roster?</a>";
		
		cell=row.insertCell(row.cells.length);
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"clearAllButton\">Clear All Shift Data</a>";
		
		row=buttonTable.insertRow(buttonTable.rows.length);
		cell=row.insertCell(row.cells.length);
		cell.colSpan=2;
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"exportButton\">Export to Excel File</a>";
		
		cell=row.insertCell(row.cells.length);
		cell.colSpan=2;
		cell.style.textAlign="center";
		cell.innerHTML ="<a class=\"saveRosterToDBButton\">Save all data to DB</a>";
	}
}