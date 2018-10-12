class RosterSchedulerTable extends RosterTable
{
	constructor()
	{
		super();
		this.genResultTable;
		this.itoList={};
		this.monthEndDate;
		this.preferredShiftList;
		this.preferredShiftRowList={};
		this.utility=new RosterSchedulerUtility();
		this.vacantShiftRow;
		this.yearlyStatistic;
		
		this.yearStatisticCell=document.getElementById("yearlyStat");
	}
/*==============================================================================================*
 *																				  				*
 *	Public Method																				*
 *																				  				*
 *==============================================================================================*/
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
			$(this.vacantShiftRow.cells[cells[i].cellIndex]).html("");
		}
	}
	clearCopiedRegion(copiedRegionCoordinate)
	{
		var cell,i,j;
		for (i=copiedRegionCoordinate.minY;i<=copiedRegionCoordinate.maxY;i++)
		{
			for (j=copiedRegionCoordinate.minX;j<=copiedRegionCoordinate.maxX;j++)
			{
				cell=this.getCell(i,j);
				this.disableEditMode(cell);
				$(cell).removeClass("copyCellBorderTop");
				$(cell).removeClass("copyCellBorderLeft");
				$(cell).removeClass("copyCellBorderRight");
				$(cell).removeClass("copyCellBorderBottom");
			}	
		}
	}
	clearSelectedRegion(selectedRegionCoordinate)
	{
		var cell,i,j;
		for (i=selectedRegionCoordinate.minY;i<=selectedRegionCoordinate.maxY;i++)
		{
			for (j=selectedRegionCoordinate.minX;j<=selectedRegionCoordinate.maxX;j++)
			{
				cell=this.getCell(i,j);
				this.disableEditMode(cell);
				$(cell).removeClass("selectCellBorderRight");   
				$(cell).removeClass("selectCellBorderTop");     
				$(cell).removeClass("selectCellBorderBottom");  
				$(cell).removeClass("selectCellBorderLeft");
			}	
		}
	}
	disableEditMode(theCell)
	{
		theCell.contentEditable=false;
		theCell.blur();
	}
	enableEditMode(theCell)
	{
		theCell.contentEditable=true;
		theCell.focus();
	}	
	getAllPreferredShiftData()
	{
		return this._getShiftRowData(this._getAllPreferredShiftRow(),1,this.monthEndDate);
	}
	getAllShiftData()
	{
		return this._getShiftRowData(this._getAllShiftRow(),1,this.monthEndDate);
	}
	getAutoPlanEndDate()
	{
		return parseInt($("#autoPlanEndDate").val());
	}
	getAutoPlanStartDate()
	{
		return parseInt($("#autoPlannStartDate").val());
	}
	getCell(rowIndex,cellIndex)
	{
		var row=this.table.rows[rowIndex];
		var cell=row.cells[cellIndex];
		return cell;
	}
	getDataForCopy(selectedRegionCoordinate)
	{
		var cell;
		var dataRow=[],dataRowList=[];
		this.clearSelectedRegion(selectedRegionCoordinate);
		this.setCopiedRegion(selectedRegionCoordinate);
		for (var y=selectedRegionCoordinate.minY;y<=selectedRegionCoordinate.maxY;y++)
		{
			dataRow=[];
			for (var x=selectedRegionCoordinate.minX;x<=selectedRegionCoordinate.maxX;x++)
			{
				cell=this.getCell(y,x);
				dataRow.push(cell.textContent);
			}
			dataRowList.push(dataRow);
		}
		return dataRowList;
	}
	getLastMonthBalance(itoId)
	{
		return parseFloat(document.getElementById(itoId +"_lastMonthBalance").textContent);
	}
	getPreferredShiftList(startDate,endDate)
	{
		return this._getShiftRowData(this._getAllPreferredShiftRow(),startDate,endDate);
	}
	getShiftList(startDate,endDate)
	{
		return this._getShiftRowData(this._getAllShiftRow(),startDate,endDate);
	}
	getThisMonthBalance(itoId)
	{
		return parseFloat(document.getElementById(itoId +"_thisMonthBalance").textContent);
	}
	getVacantShiftData()
	{
		var cell,result=[];
		var vacancyRow=document.getElementById("vacantShiftRow");
		var cells=$(vacancyRow).children(".vacantShift");
		for (var i=0;i<cells.length;i++)
		{
			cell=cells[i];
			result.push(cell.textContent);
		}
		return result;
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
			cell=$(shiftRow).children(".shiftCell:last")[0];
			lastIndex=cell.cellIndex;
			ito=this.itoList[itoId];
			
			indices=ito.getBlackListedShiftPatternIndex(this._getShiftPattern(shiftRow,lastIndex+this.showNoOfPrevDate));
			//console.log(itoId+"|"+indices.length+"|"+ito.blackListShiftPatternList+"|"+this._getShiftPattern(shiftRow,lastIndex+this.showNoOfPrevDate));
			$(shiftRow).children(".shiftCell").removeClass("errorRedBlackGround");
			
			if (indices.length>0)
			{
				for (i=0;i<indices.length;i++)
				{
					$(shiftRow.cells[indices[i]]).addClass("errorRedBlackGround");
				}
				 result=true;
			}
			else
			{
				//reset all cell style in the shift row
				$(shiftRow).children(".shiftCell").blur();  
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
		cell=$("td.shiftCell:first")[0];
		firstIndex=cell.cellIndex;
		
		cell=$("td.shiftCell:last")[0];
		lastIndex=cell.cellIndex;
		haveDuplicateShift=false;
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
											$(cell).addClass("errorRedBlackGround");
											haveDuplicateShift=true;
											break;	
										}
										else
										{	
											$(cell).blur();
											$(cell).removeClass("errorRedBlackGround");
											tempResult.push(shiftType);
										}
										break;
							case "b"	:		
							case "b1"	:
										if (($.inArray ("b1",tempResult)>-1) || ($.inArray ("b",tempResult)>-1))
										{
											alert("Duplicate Shift Found");
											$(cell).addClass("errorRedBlackGround");
											haveDuplicateShift=true;
											break;	
										}
										else
										{	
											$(cell).blur();
											$(cell).removeClass("errorRedBlackGround");
											tempResult.push(shiftType);
										}
										break;		
							}
					}
					else
					{
						alert("Invalid shift detected");
						$(cell).addClass("errorRedBlackGround");
						haveDuplicateShift=true;
						break;
					}	
				}
			}
		}
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
			cells=$(shiftRow).children(".shiftCell");
			for (i=0;i<cells.length;i++)
			{
				cell=cells[i];
				if (ito.isValidShift(cell.textContent)||(cell.textContent==""))
				{
					$(cell).removeClass("errorRedBlackGround");
				}
				else
				{
					$(cell).addClass("errorRedBlackGround");
					result=true;
				}	
			}	
		}
		return result;
	}
	haveInvalidPreferredShift(startDate,endDate)
	{
		var cell,ito,itoId,cells;
		var preferredShiftRowList=this._getAllPreferredShiftRow();
		var result=false,preferredShiftRow;
		
		for (itoId in this.itoList)
		{
			preferredShiftRow=preferredShiftRowList[itoId];
			ito=this.itoList[itoId];
			cells=$(preferredShiftRow).children(".cursorCell");
			for (var i=startDate;i<=endDate;i++)
			{
				cell=cells[i-1];
				if (ito.isValidPreferredShift(cell.textContent))
				{	
					$(cell).removeClass("errorRedBlackGround");
				}
				else	
				{
					$(cell).addClass("errorRedBlackGround");
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
		cell=$("td.shiftCell:first")[0];
		firstIndex=cell.cellIndex;
		
		cell=$("td.shiftCell:last")[0];
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
							if (shiftType=="b1")
							{
								essentialShift=essentialShift.replace("b","");
							}
						}
						else	
						{
							alert("Invalid shift");
							cell.className="borderCell alignCenter shiftCell errorRedBlackGround";
							haveMissingShift=true;
							return
						}	
					}					
				});
				if (haveMissingShift)
					break;
			}
			this.vacantShiftRow.cells[i].textContent=essentialShift;
			if (essentialShift!="")
				haveMissingShift=true;
		}
		return haveMissingShift;
	}
	hideGenResultTable()
	{
		$(this.genResultTable).hide();
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
	pasteDataFromClipboard(selectedRegionCoordinate,copiedRegionCoordinate,dataRowList)
	{
		var cell;
		var self=this,x,y;
		
		x=selectedRegionCoordinate.minX;
		y=selectedRegionCoordinate.minY;
		
		dataRowList.forEach(function(dataRow){
			x=selectedRegionCoordinate.minX;
			dataRow.forEach(function(value){
				cell=self.getCell(y,x++);
				$(cell).text(value).blur();
			});
			y++;
		});
		this.clearCopiedRegion(copiedRegionCoordinate);
	}
	selectCell(theCell)
	{
		theCell.focus();
		$(theCell).addClass("selectCellBorderRight");
		$(theCell).addClass("selectCellBorderTop");
		$(theCell).addClass("selectCellBorderBottom");
		$(theCell).addClass("selectCellBorderLeft");
	}
	setCopiedRegion(selectedRegionCoordinate)
	{
		var cell,i;
		cell=this.getCell(selectedRegionCoordinate.minY,selectedRegionCoordinate.minX);
		$(cell).addClass("copyCellBorderTop");
		$(cell).addClass("copyCellBorderLeft");
		
		cell=this.getCell(selectedRegionCoordinate.minY,selectedRegionCoordinate.maxX);
		$(cell).addClass("copyCellBorderTop");
		$(cell).addClass("copyCellBorderRight");
		
		cell=this.getCell(selectedRegionCoordinate.maxY,selectedRegionCoordinate.minX);
		$(cell).addClass("copyCellBorderBottom");
		$(cell).addClass("copyCellBorderLeft");

		cell=this.getCell(selectedRegionCoordinate.maxY,selectedRegionCoordinate.maxX);
		$(cell).addClass("copyCellBorderBottom");
		$(cell).addClass("copyCellBorderRight");
		
		for (i=selectedRegionCoordinate.minY+1;i<selectedRegionCoordinate.maxY;i++)
		{
			cell=this.getCell(i,selectedRegionCoordinate.minX);
			$(cell).addClass("copyCellBorderLeft");

			cell=this.getCell(i,selectedRegionCoordinate.maxX);
			$(cell).addClass("copyCellBorderRight");
		}
		for (i=selectedRegionCoordinate.minX+1;i<selectedRegionCoordinate.maxX;i++)
		{
			cell=this.getCell(selectedRegionCoordinate.minY,i);
			$(cell).addClass("copyCellBorderTop");
			
			cell=this.getCell(selectedRegionCoordinate.maxY,i);
			$(cell).addClass("copyCellBorderBottom");
		}
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
	setSelectedRegion(selectedRegionCoordinate)
	{
		var cell,i;
		cell=this.getCell(selectedRegionCoordinate.minY,selectedRegionCoordinate.minX);
		$(cell).addClass("selectCellBorderTop");
		$(cell).addClass("selectCellBorderLeft");
		
		cell=this.getCell(selectedRegionCoordinate.minY,selectedRegionCoordinate.maxX);
		$(cell).addClass("selectCellBorderTop");
		$(cell).addClass("selectCellBorderRight");
		
		cell=this.getCell(selectedRegionCoordinate.maxY,selectedRegionCoordinate.minX);
		$(cell).addClass("selectCellBorderBottom");
		$(cell).addClass("selectCellBorderLeft");

		cell=this.getCell(selectedRegionCoordinate.maxY,selectedRegionCoordinate.maxX);
		$(cell).addClass("selectCellBorderBottom");
		$(cell).addClass("selectCellBorderRight");
		
		for (i=selectedRegionCoordinate.minY+1;i<selectedRegionCoordinate.maxY;i++)
		{
			cell=this.getCell(i,selectedRegionCoordinate.minX);
			$(cell).addClass("selectCellBorderLeft");

			cell=this.getCell(i,selectedRegionCoordinate.maxX);
			$(cell).addClass("selectCellBorderRight");
		}
		for (i=selectedRegionCoordinate.minX+1;i<selectedRegionCoordinate.maxX;i++)
		{
			cell=this.getCell(selectedRegionCoordinate.minY,i);
			$(cell).addClass("selectCellBorderTop");
			
			cell=this.getCell(selectedRegionCoordinate.maxY,i);
			$(cell).addClass("selectCellBorderBottom");
		}
		
	}
	show()
	{
		var row,self=this;
		var yearlyStatisticReportDiv;
		super.genRosterRowList();
		self._showButtons();
		self._genPreferredShiftRowList();
		self._genVacantShiftRow();
		yearlyStatisticReportDiv=self._genYearlyStatisticReport();
		this.itoIdList.forEach(function(itoId){
			row=self.rosterRowList[itoId];
			self.rosterBody.append(row);
			row=self.preferredShiftRowList[itoId];
			self.rosterBody.append(row);
		});

		self.rosterBody.append(this.vacantShiftRow);
		self.yearStatisticCell.append(yearlyStatisticReportDiv);
		this.genResultTable=document.getElementById("genResult");
		var schedulerShiftCellEventHandler=new SchedulerShiftCellEventHandler(this,"cursorCell");
	}
	showGenResultTable()
	{
		$(this.genResultTable).show();
	}

	updateValue(theCell)
	{
		var shiftRow=theCell.parentElement;
		var itoId=shiftRow.id.replace("shift_","");
		var shift=theCell.textContent;
		var ito=this.itoList[itoId];
		
		theCell.contentEditable=false;
		if (shift=="")
		{
			theCell.className="borderCell alignCenter cursorCell shiftCell";
			this._reCalculate(shiftRow,itoId);
		}
		else
		{
			var ito=this.itoList[itoId];
			if (ito.isValidShift(shift))
			{
				theCell.className="borderCell alignCenter cursorCell shiftCell";
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
/*==============================================================================================*
 *																				  				*
 *	Private Method																				*
 *																				  				*
 *==============================================================================================*/	
	_genPreferredShiftRowList()
	{
		var cell;
		var i,itoPreferredShiftList,itoRoster;
		var row,self=this;
		
		this.itoIdList.forEach(function(itoId){
			row=document.createElement("tr");
			itoPreferredShiftList=self.preferredShiftList[itoId];

			row.id="preferredShift_"+itoId;
			cell=row.insertCell(row.cells.length);
			cell.className="alignLeft borderCell";
			cell.textContent="Preferred Shift";
			for (i=0;i<self.showNoOfPrevDate;i++)
			{
				cell=row.insertCell(row.cells.length);
				cell.className="alignCenter borderCell";
			}
			for (i=0;i<31;i++)
			{
				cell=row.insertCell(row.cells.length);
				cell.className="alignCenter borderCell cursorCell";
				if (itoPreferredShiftList[i+1]!=null)
				{
					cell.textContent=itoPreferredShiftList[i+1];
				}	
			}
			cell=row.insertCell(row.cells.length);
			cell.className="alignCenter borderCell";
			cell.colSpan=5;
			for (i=0;i<5;i++)
			{
				cell=row.insertCell(row.cells.length);
				cell.className="alignCenter borderCell";
			}	
			self.preferredShiftRowList[itoId]=row;
		});
	}
	_genVacantShiftRow()
	{
		var aShiftSD,bShiftSD,cShiftSD;
		var cell,essentialShiftList;
		var i,itoShiftList,self=this,shiftTypeList,totalSD;
		
		this.vacantShiftRow=document.createElement("tr");
		this.vacantShiftRow.id="vacantShiftRow";
		cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
		cell.className="vacantShiftLabel borderCell";
		cell.textContent="Vacant Shifts";
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
			cell.className="alignCenter borderCell";
		}	
		for (i=0;i<31;i++)
		{
			essentialShiftList=self.rosterRule.getEssentialShift();
			cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
			cell.className="alignCenter borderCell vacantShift";
			this.itoIdList.forEach(function(itoId){
				itoShiftList=self.itoRosterList[itoId].shiftList;
				
				if(itoShiftList[i+1]!=null)
				{
					shiftTypeList=itoShiftList[i+1].split("\+");
					shiftTypeList.forEach(function(shiftType){
						switch(shiftType)
						{
							case "b1"	:essentialShiftList=essentialShiftList.replace("b","");
										break;
							default		:essentialShiftList=essentialShiftList.replace(shiftType,"");
										break;
						}
					})
					cell.textContent=essentialShiftList;	
				}		
			});
		}
		aShiftSD=this.utility.getSD(this.aShiftData);
		bShiftSD=this.utility.getSD(this.bShiftData);
		cShiftSD=this.utility.getSD(this.cShiftData);
		totalSD=(aShiftSD+bShiftSD+cShiftSD)/3;
		
		cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.colSpan=5;
		
		cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.id="shiftAStdDev";
		cell.textContent=this.utility.roundTo(aShiftSD,2);
				
		cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.id="shiftBStdDev";
		cell.textContent=this.utility.roundTo(bShiftSD,2);
		
		cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.id="shiftCStdDev";
		cell.textContent=this.utility.roundTo(cShiftSD,2);
		
		cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
		cell.className="alignCenter borderCell";
		cell.id="avgStdDev";
		cell.textContent=this.utility.roundTo(totalSD,2);
		cell=this.vacantShiftRow.insertCell(this.vacantShiftRow.cells.length);
		cell.className="alignCenter borderCell";
		
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

		this.itoIdList.forEach(function(itoId){
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
		yearlyStatisticReportDiv.append(yearlyStatisticTable);
		return yearlyStatisticReportDiv;
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
	_getAllShiftRow()
	{
		var result=[];
		var shiftRow;
		this.itoIdList.forEach(function(itoId){
			shiftRow=document.getElementById("shift_"+itoId);
			result[itoId]=shiftRow;
		});
		return result;
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
			cellList=$(shiftRow).children(".cursorCell");
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
	_reCalculate(shiftRow,itoId)
	{
		var i,shiftTypeList,self=this;
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
			shiftTypeList=shiftCells[i].textContent.split("\+");
			shiftTypeList.forEach(function(shift){
				if (self.rosterRule.shiftHourCount[shift]!=null)
				{	
					actualHour+=self.rosterRule.shiftHourCount[shift];
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
			});
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
	_showButtons()
	{
		var autoSchedulerDiv,autoSchedulerResultDiv,autoSchedulerResultTable,autoSchedulerResultCell,autoSchedulerResultRow;
		var i,cell,select,row,buttonTable;
		
		autoSchedulerDiv=document.createElement("div");
		autoSchedulerDiv.style.textAlign="center";
		autoSchedulerDiv.textContent="Auto Planning Start From:";
		
		cell=document.getElementById("autoScheduler");
		select=document.createElement("select");
		select.id="autoPlannStartDate";
		for (i=1;i<=this.monthEndDate;i++)
		{
			var option=document.createElement("option");
			option.value=i;
			option.text=i;
			select.append(option);
		}	
		autoSchedulerDiv.append(select);
		$(autoSchedulerDiv).append("&nbsp;to&nbsp;");
		select=document.createElement("select");
		select.id="autoPlanEndDate";
		for (i=1;i<=this.monthEndDate;i++)
		{
			var option=document.createElement("option");
			option.value=i;
			option.text=i;
			select.append(option);
		}	
		autoSchedulerDiv.append(select);
		$(autoSchedulerDiv).append("&nbsp;<a class=\"autoPlannerButton\">Auto Planner</a>");
		option.selected=true;
		cell.append(autoSchedulerDiv);
		
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