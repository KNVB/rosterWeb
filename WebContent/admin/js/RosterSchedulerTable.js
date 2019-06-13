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
	haveBlackListedShiftPattern()
	{
		var cell;
		var firstIndex;
		var i,indices,ito,lastIndex;
		var result=false;
		var shiftRow;
		var shiftRows=this._getAllShiftRow();
		for (var itoId in shiftRows)
		{
			shiftRow=shiftRows[itoId];
			cell=$(shiftRow).children("."+AdminCss.shiftCellClassName+":last")[0];
			lastIndex=cell.cellIndex;
			ito=this.itoList[itoId];
			
			indices=ito.getBlackListedShiftPatternIndex(this._getShiftPattern(shiftRow,lastIndex+this.showNoOfPrevDate));
			
			$(shiftRow).children("."+AdminCss.shiftCellClassName).removeClass(AdminCss.errorRedBlackGroundClassName);
			
			if (indices.length>0)
			{
				for (i=0;i<indices.length;i++)
				{
					$(shiftRow.cells[indices[i]]).addClass(AdminCss.errorRedBlackGroundClassName);
				}
				 result=true;
			}
			else
			{
				//reset all cell style in the shift row
				$(shiftRow).children("."+AdminCss.shiftCellClassName).blur();  
			}
		}
		return result;
	}
	haveDuplicateShift()
	{
		var cell;
		var firstIndex,haveDuplicateShift=false;
		var i,ito,lastIndex;
		var shiftRow,shiftRows,shiftType;
		var tempResult=[],temp="";

		shiftRows=this._getAllShiftRow();
		cell=$("td."+AdminCss.shiftCellClassName+":first")[0];
		firstIndex=cell.cellIndex;
		
		cell=$("td."+AdminCss.shiftCellClassName+":last")[0];
		lastIndex=cell.cellIndex;
		
		for (i=firstIndex;i<=lastIndex;i++)
		{
			tempResult=[];
			for (var itoId in shiftRows)
			{
				shiftRow=shiftRows[itoId];
				ito=this.itoList[itoId];
				cell=shiftRow.cells[i];
				shiftType=cell.textContent;
				if (shiftType!="")
				{
					if (ito.isValidShift(shiftType))
					{
						switch (shiftType)
						{
							case "a"	:
							case "c"	:
										if ($.inArray (shiftType,tempResult)>-1)
										{
											alert("Duplicate Shift Found");
											$(cell).addClass(AdminCss.errorRedBlackGroundClassName);
											haveDuplicateShift=true;
											break;	
										}
										else
										{	
											$(cell).blur();
											$(cell).removeClass(AdminCss.errorRedBlackGroundClassName);
											tempResult.push(shiftType);
										}
										break;
							case "b"	:		
							case "b1"	:
										if (($.inArray ("b1",tempResult)>-1) || ($.inArray ("b",tempResult)>-1))
										{
											alert("Duplicate Shift Found");
											$(cell).addClass(AdminCss.errorRedBlackGroundClassName);
											haveDuplicateShift=true;
											break;	
										}
										else
										{	
											$(cell).blur();
											$(cell).removeClass(AdminCss.errorRedBlackGroundClassName);
											tempResult.push(shiftType);
										}
										break;		
							}
					}
					else
					{
						alert("An invalid shift found.");
						$(cell).addClass(AdminCss.errorRedBlackGroundClassName);
						haveDuplicateShift=true;
						break;
					}
				}
			}
		}
	}
	haveInvalidPreferredShift()
	{
		return this._haveInvalidPreferredShift(1,Object.keys(this.dateObjList).length);
	}
	haveInvalidShift()
	{
		var cell,cells;
		var i,ito,itoId;
		var result=false;
		var shiftRow;
		var shiftRows=this._getAllShiftRow();
		
		for (itoId in shiftRows)
		{
			shiftRow=shiftRows[itoId];
			ito=this.itoList[itoId];
			cells=$(shiftRow).children("."+AdminCss.shiftCellClassName);
			for (i=0;i<cells.length;i++)
			{
				cell=cells[i];
				if (ito.isValidShift(cell.textContent)||(cell.textContent==""))
				{
					$(cell).removeClass(AdminCss.errorRedBlackGroundClassName);
				}
				else
				{
					$(cell).addClass(AdminCss.errorRedBlackGroundClassName);
					result=true;
				}	
			}	
		}
		return result;
	}
	haveMissingShift()
	{
		var cell,essentialShift;
		var firstIndex,haveMissingShift=false;
		var i,ito,lastIndex;
		var self=this;
		var shiftCells,shiftRow;
		var shiftRows=this._getAllShiftRow();
		var shiftTypeList;
		cell=$("td."+AdminCss.shiftCellClassName+":first")[0];
		firstIndex=cell.cellIndex;
		
		cell=$("td."+AdminCss.shiftCellClassName+":last")[0];
		lastIndex=cell.cellIndex;
		
		for (i=firstIndex;i<=lastIndex;i++)
		{
			essentialShift=this.rosterRule.getEssentialShift();
			for (var itoId in shiftRows)
			{
				shiftRow=shiftRows[itoId];
				ito=this.itoList[itoId];
				cell=shiftRow.cells[i];
				shiftTypeList=cell.textContent.split("\+");
				shiftTypeList.forEach(function(shiftType){
					if (shiftType!="")
					{
						if (ito.isValidShift(shiftType))
						{
							essentialShift=essentialShift.replace(shiftType,"");
							$(cell).removeClass(AdminCss.errorRedBlackGroundClassName);
							if (shiftType=="b1")
							{
								essentialShift=essentialShift.replace("b","");
							}
						}
						else	
						{
							alert("An invalid shift found.");
							$(cell).addClass(AdminCss.errorRedBlackGroundClassName);
							haveMissingShift=true;
							return
						}
					}	
				});
			}
			this.vacantShiftRow.cells[i].textContent=essentialShift;
			if (essentialShift!="")
				haveMissingShift=true;
		}
		alert("The missing shift checking has been completed.");
		return haveMissingShift;
	}
	getAllDataForSaveToDb()
	{
		var rosterData={},self=this;
		var iTOShiftData,preferredShiftData,iTOPreferredShiftData;
		var allITOShiftData=this._getAllShiftData();
		var allPreferredShiftData=this.getAllPreferredShiftData();
		rosterData["rosterYear"]=this.rosterYear;
		rosterData["rosterMonth"]=this.rosterMonth;
		rosterData["itorosterList"]={};
		rosterData["itopreferredShiftList"]={};
		
		for (var itoId in this.itoList)
		{
			iTOShiftData={};
			iTOShiftData["shiftList"]=allITOShiftData[itoId];
			
			 if (isNaN(self._getLastMonthBalance(itoId)))
				iTOShiftData["lastMonthBalance"]=0;
			else
				iTOShiftData["lastMonthBalance"]=self._getLastMonthBalance(itoId);
			
			if (isNaN(self._getThisMonthBalance(itoId)))
				iTOShiftData["thisMonthBalance"]=0;
			else 
				iTOShiftData["thisMonthBalance"]=self._getThisMonthBalance(itoId);
			
			rosterData["itorosterList"][itoId]=iTOShiftData;
			rosterData["itopreferredShiftList"][itoId]=allPreferredShiftData[itoId];
		}	
		return(rosterData);
	}
	getAllPreferredShiftData()
	{
		return this._getShiftRowData(this._getAllPreferredShiftRow(),1,Object.keys(this.dateObjList).length);
	}
	getAutoPlanEndDate()
	{
		return parseInt($("#autoPlanEndDate").val());
	}
	getAutoPlanStartDate()
	{
		return parseInt($("#autoPlanStartDate").val());
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
	getPreviouseShiftList(startDate)
	{
		var i,j,itoRoster;
		var result=[];
		var shiftDataList,resultList=[];
		var startIndex=startDate-this.rosterRule.maxConsecutiveWorkingDay-1;
		var allITOShiftList=this._getShiftList(1,startDate);
		for (var itoId in this.itoList)
		{
			result=[];
			shiftDataList=allITOShiftList[itoId];
			itoRoster=this.rosterList[itoId];
			if (startIndex<1)
			{
				j=startDate;
				for (i=j;i<this.rosterRule.maxConsecutiveWorkingDay;i++)
				{
					result.push(itoRoster.previousMonthShiftList[i+1]);
				}
			}
			if (shiftDataList!=null)
			{
				for (i=1;i<startDate;i++)
				{
					result.push(shiftDataList[i]);
				}	
			}	
			resultList[itoId]=result;
		}
		return resultList;
	}
	getRosterDataForExport()
	{
		var rosterData=this.getAllDataForSaveToDb();
		rosterData["vacantShiftData"]=this._getVacantShiftData();
		return(rosterData);
	}
	loadRoster(finalRoster)
	{
		var row,cell,thisITOShiftList;
		for (var itoId in finalRoster.rosterData)
		{
			row=document.getElementById("shift_"+itoId);
			thisITOShiftList=finalRoster.rosterData[itoId];
			for (var dateIndex=0;dateIndex<thisITOShiftList.length;dateIndex++)
			{
				cell=row.cells[finalRoster.startDate+this.showNoOfPrevDate+dateIndex];
				$(cell).html(thisITOShiftList[dateIndex]).blur();
			}
		}
		this.haveMissingShift();
	}
	selectCell(theCell)
	{
		$(theCell).addClass(AdminCss.selectCellBorderRightClassName);
		$(theCell).addClass(AdminCss.selectCellBorderTopClassName);
		$(theCell).addClass(AdminCss.selectCellBorderBottomClassName);
		$(theCell).addClass(AdminCss.selectCellBorderLeftClassName);
	}
	setLowestSDData(lowestSDData)
	{
		var firstRow=document.getElementById("theLowestSD");
		var cell=firstRow.cells[0];
		cell.innerHTML="SD:"+lowestSDData[0].averageShiftStdDev;
		cell=firstRow.cells[1];
		cell.innerHTML="Missing shift count:"+lowestSDData[0].missingShiftCount;
		
		
		var secondRow=document.getElementById("secondLowestSD");
		cell=secondRow.cells[0];
		if (lowestSDData.length>1)
		{
			cell.innerHTML="SD:"+lowestSDData[1].averageShiftStdDev;
			cell=secondRow.cells[1];
			cell.innerHTML="Missing shift count:"+lowestSDData[1].missingShiftCount;
		}
		else
		{
			cell.innerHTML="SD:N.A.";
			cell=secondRow.cells[1];
			cell.innerHTML="Missing shift count:N.A.";
		}
			
	
		var thirdRow=document.getElementById("thirdLowestSD");
		cell=thirdRow.cells[0];
		if (lowestSDData.length>2)
		{
			cell.innerHTML="SD:"+lowestSDData[2].averageShiftStdDev;
			cell=thirdRow.cells[1];
			cell.innerHTML="Missing shift count:"+lowestSDData[2].missingShiftCount;
		}
		else
		{
			cell.innerHTML="SD:N.A.";
			cell=thirdRow.cells[1];
			cell.innerHTML="Missing shift count:N.A.";
		}
	}
	setMissingShiftData(missingShiftData)
	{
		var firstRow=document.getElementById("theLowestMissingShiftCount");
		var cell=firstRow.cells[0];
		cell.innerHTML="Missing shift count:"+missingShiftData[0].missingShiftCount;
		cell=firstRow.cells[1];
		cell.innerHTML="SD:"+missingShiftData[0].averageShiftStdDev;
		
		var secondRow=document.getElementById("theSecondLowestMissingShiftCount");
		cell=secondRow.cells[0];
		if (missingShiftData.length>1)
		{
			cell.innerHTML="Missing shift count:"+missingShiftData[1].missingShiftCount;
			cell=secondRow.cells[1];
			cell.innerHTML="SD:"+missingShiftData[1].averageShiftStdDev;
		}
		else
		{
			cell.innerHTML="Missing shift count:N.A.";
			cell=secondRow.cells[1];
			cell.innerHTML="SD:N.A.";
		}

		var thirdRow=document.getElementById("theThirdLowestMissingShiftCount");
		cell=thirdRow.cells[0];
		if (missingShiftData.length>2)
		{
			cell.innerHTML="Missing shift count:"+missingShiftData[2].missingShiftCount;
			cell=thirdRow.cells[1];
			cell.innerHTML="SD:"+missingShiftData[2].averageShiftStdDev;
		}
		else
		{
			cell.innerHTML="Missing shift count:N.A.";
			cell=thirdRow.cells[1];
			cell.innerHTML="SD:N.A.";
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
	showGenResultTable()
	{
		this.genResultTable=document.getElementById("genResult");
		$(this.genResultTable).show();
	}
	unselectCell(theCell)
	{
		$(theCell).removeClass(AdminCss.selectCellBorderRightClassName);
		$(theCell).removeClass(AdminCss.selectCellBorderTopClassName);
		$(theCell).removeClass(AdminCss.selectCellBorderBottomClassName);
		$(theCell).removeClass(AdminCss.selectCellBorderLeftClassName);
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
			if (i<=Object.keys(this.dateObjList).length)
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
	_getAllShiftData()
	{
		return this._getShiftRowData(this._getAllShiftRow(),1,Object.keys(this.dateObjList).length);
	}
	_getAllPreferredShiftRow()
	{
		var result=[];
		var preferredShiftRow;
		for (var itoId in this.itoList)
		{
			preferredShiftRow=document.getElementById("preferredShift_"+itoId);
			result[itoId]=preferredShiftRow;
		}
		return result;
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
	_getLastMonthBalance(itoId)
	{
		return parseFloat(document.getElementById(itoId +"_lastMonthBalance").textContent);
	}
	_getShiftList(startDate,endDate)
	{
		return this._getShiftRowData(this._getAllShiftRow(),startDate,endDate);
	}
	_getShiftPattern(shiftRow,endIndex)
	{
		var shiftPattern="",cell;
		for (var i=1;i<endIndex;i++)
		{
			cell=shiftRow.cells[i];
			shiftPattern+=cell.textContent+",";
		}
		shiftPattern=shiftPattern.substring(0,shiftPattern.length-1);
		return shiftPattern;
	}
	_getShiftRowData(shiftRowList,startIndex,endIndex)
	{
		var result={};
		var cellList,counter;
		var shiftDate,shiftList;
		var shiftObj,shiftRow,shiftType;
		for (var itoId in shiftRowList)
		{
			shiftRow=shiftRowList[itoId];
			cellList=$(shiftRow).children("."+Css.cursorCellClassName);
			shiftList={};
			counter=1;
			for (var i=startIndex;i<=endIndex;i++)
			{
				shiftObj={};
				shiftType=cellList[i-1].textContent;
				shiftList[counter++]=shiftType;
			}
			result[itoId]=shiftList;
		}
		return result;
	}
	_getThisMonthBalance(itoId)
	{
		return parseFloat(document.getElementById(itoId +"_thisMonthBalance").textContent);
	}
	_getVacantShiftData()
	{
		var cell,result=[];
		var vacancyRow=document.getElementById("vacantShiftRow");
		var cells=$(vacancyRow).children("."+AdminCss.vacantShiftClassName);
		
		for (var i=0;i<Object.keys(this.dateObjList).length;i++)
		{
			cell=cells[i];
			result.push(cell.textContent);
		}
		return result;
	}
	_haveInvalidPreferredShift(startDate,endDate)
	{
		var cell,ito,itoId,cells;
		var preferredShiftRowList=this._getAllPreferredShiftRow();
		var result=false,preferredShiftRow;
		
		for (itoId in this.itoList)
		{
			preferredShiftRow=preferredShiftRowList[itoId];
			ito=this.itoList[itoId];
			cells=$(preferredShiftRow).children("."+Css.cursorCellClassName);
			for (var i=startDate;i<=endDate;i++)
			{
				cell=cells[i-1];
				if (ito.isValidPreferredShift(cell.textContent))
				{	
					$(cell).removeClass(AdminCss.errorRedBlackGroundClassName);
				}
				else	
				{
					$(cell).addClass(AdminCSs.errorRedBlackGroundClassName);
					result=true;
				}	
			}	
		}
		
		return result;
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