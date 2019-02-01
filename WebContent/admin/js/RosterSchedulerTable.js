class RosterSchedulerTable extends RosterTable
{
	constructor(container)
	{
		super(container);
		this.cursorCells=null;
		this.errorRedBlackGroundClassName="errorRedBlackGround";
		this.itoList;
		this.preferredShiftList=null;
		this.showNoOfPrevDate=2;
		this.selectedRegion=null;
		this.utility=new AdminUtility();
		this.vacantShiftClassName="vacantShift";
		this.vacantShiftLabelClassName="vacantShiftLabel";
		this.yearlyStatisticReportDivClassName="yearlyStatisticReportDiv";
		this.yearlyStatisticTableClassName="yearlyStatisticTable";
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
		for (var itoId in this.itoList)
		{
			$("#shift_" +itoId).children("td."+this.shiftCellClassName).html("").blur();
		}
		$(this.vacantShiftRow).children("td."+this.vacantShiftClassName).html("");
	}
	clearCopiedRegion(copiedRegion)
	{
		var cell,i,j;
		for (i=copiedRegion.minY;i<=copiedRegion.maxY;i++)
		{
			for (j=copiedRegion.minX;j<=copiedRegion.maxX;j++)
			{
				cell=this.getCell(i,j);
				cell.blur();
				$(cell).removeClass("copyCellBorderTop");
				$(cell).removeClass("copyCellBorderLeft");
				$(cell).removeClass("copyCellBorderRight");
				$(cell).removeClass("copyCellBorderBottom");
			}	
		}
	}
	clearSelectedRegion(selectedRegion)
	{
		var cell,i,j;
		for (i=selectedRegion.minY;i<=selectedRegion.maxY;i++)
		{
			for (j=selectedRegion.minX;j<=selectedRegion.maxX;j++)
			{
				cell=this.getCell(i,j);
				cell.blur();
				$(cell).removeClass("selectCellBorderRight");   
				$(cell).removeClass("selectCellBorderTop");     
				$(cell).removeClass("selectCellBorderBottom");  
				$(cell).removeClass("selectCellBorderLeft");
			}	
		}
	}	
	enableEditMode(theCell)
	{
		theCell.contentEditable=true;
		theCell.focus();
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
				iTOShiftData["balance"]=0;
			else
				iTOShiftData["balance"]=self._getLastMonthBalance(itoId);
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
		var row=this.rosterTable.rows[rowIndex];
		var cell=row.cells[cellIndex];
		return cell;
	}

	getDataForCopy(selectedRegion)
	{
		var cell,cellObj;
		var dataRow=[],dataRowList=[];
		this.clearSelectedRegion(selectedRegion);
		this.setCopiedRegion(selectedRegion);
		for (var y=selectedRegion.minY;y<=selectedRegion.maxY;y++)
		{
			dataRow=[];
			for (var x=selectedRegion.minX;x<=selectedRegion.maxX;x++)
			{
				cell=this.getCell(y,x);
				cellObj={};
				if ($(cell).hasClass(this.shiftCellClassName))
					cellObj.className=this.shiftCellClassName;
				else
					cellObj.className=this.vacantShiftClassName;
				cellObj.textContent=cell.textContent;
				dataRow.push(cellObj);
			}
			dataRowList.push(dataRow);
		}
		return dataRowList;
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
			console.log(newX,newY);
			index=newX+newY*Object.keys(this.dateObjList).length;
			
			nextCell=this.cursorCells[index];
			return nextCell;
		}
	}
	getNextCellInSelectedRegion(theCell,yOffset,xOffset)
	{
		var index;
		var nextCell;
		index=$.inArray(theCell,this.selectedRegion.selectedCellList);
		console.log("before:"+index);
		index+=yOffset*this.selectedRegion.colCount;
		index+=xOffset;
		if (index<0)
			index=this.selectedRegion.selectedCellList.length-1;
		else
		{	
			if (index>=this.selectedRegion.selectedCellList.length)
			{
				index=0;
			}						
		}
		nextCell=this.selectedRegion.selectedCellList[index];
		return nextCell;
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
		return haveDuplicateShift;
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
	haveInvalidPreferredShift()
	{
		return this._haveInvalidPreferredShift(1,Object.keys(this.dateObjList).length);
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
							//cell.className="borderCell alignCenter shiftCell errorRedBlackGround";
							$(cell).addClass(self.alignCenterClassName);
							$(cell).addClass(self.borderCellClassName);
							$(cell).addClass(self.shiftCellClassName);
							$(cell).addClass(self.errorRedBlackGroundClassName);
							haveMissingShift=true;
							return
						}	
					}					
				});
			}
			this.vacantShiftRow.cells[i].textContent=essentialShift;
		}
		return haveMissingShift;
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
	pasteDataFromClipboard(selectedRegion,dataRowList)
	{
		var cell,firstCell,firstDataCell;
		var self=this,x,y;
		
		x=selectedRegion.minX;
		y=selectedRegion.minY;
		firstCell=this.getCell(y,x);
		firstDataCell=dataRowList[0][0];
		var index=$.inArray(firstCell,this.cursorCells);
		dataRowList.forEach(function(dataRow){
			dataRow.forEach(function(dataCell){
				if (index>=self.cursorCells.length)
					index=0;
				$(self.cursorCells[index]).text(dataCell.textContent).blur();
				index++;
			});
		});		
	}
	selectCell(theCell)
	{
		theCell.focus();
		$(theCell).addClass("selectCellBorderRight");
		$(theCell).addClass("selectCellBorderTop");
		$(theCell).addClass("selectCellBorderBottom");
		$(theCell).addClass("selectCellBorderLeft");
	}
	setCopiedRegion(selectedRegion)
	{
		var cell,i;
		cell=this.getCell(selectedRegion.minY,selectedRegion.minX);
		$(cell).addClass("copyCellBorderTop");
		$(cell).addClass("copyCellBorderLeft");
		
		cell=this.getCell(selectedRegion.minY,selectedRegion.maxX);
		$(cell).addClass("copyCellBorderTop");
		$(cell).addClass("copyCellBorderRight");
		
		cell=this.getCell(selectedRegion.maxY,selectedRegion.minX);
		$(cell).addClass("copyCellBorderBottom");
		$(cell).addClass("copyCellBorderLeft");

		cell=this.getCell(selectedRegion.maxY,selectedRegion.maxX);
		$(cell).addClass("copyCellBorderBottom");
		$(cell).addClass("copyCellBorderRight");
		
		for (i=selectedRegion.minY+1;i<selectedRegion.maxY;i++)
		{
			cell=this.getCell(i,selectedRegion.minX);
			$(cell).addClass("copyCellBorderLeft");

			cell=this.getCell(i,selectedRegion.maxX);
			$(cell).addClass("copyCellBorderRight");
		}
		for (i=selectedRegion.minX+1;i<selectedRegion.maxX;i++)
		{
			cell=this.getCell(selectedRegion.minY,i);
			$(cell).addClass("copyCellBorderTop");
			
			cell=this.getCell(selectedRegion.maxY,i);
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
	setScheduler(rosterScheduler)
	{
		this.rosterScheduler=rosterScheduler;
	}
	setSelectedRegion(selectedRegion)
	{
		var cell,i;
		cell=this.getCell(selectedRegion.minY,selectedRegion.minX);
		$(cell).addClass("selectCellBorderTop");
		$(cell).addClass("selectCellBorderLeft");
		
		cell=this.getCell(selectedRegion.minY,selectedRegion.maxX);
		$(cell).addClass("selectCellBorderTop");
		$(cell).addClass("selectCellBorderRight");
		
		cell=this.getCell(selectedRegion.maxY,selectedRegion.minX);
		$(cell).addClass("selectCellBorderBottom");
		$(cell).addClass("selectCellBorderLeft");

		cell=this.getCell(selectedRegion.maxY,selectedRegion.maxX);
		$(cell).addClass("selectCellBorderBottom");
		$(cell).addClass("selectCellBorderRight");
		
		for (i=selectedRegion.minY+1;i<selectedRegion.maxY;i++)
		{
			cell=this.getCell(i,selectedRegion.minX);
			$(cell).addClass("selectCellBorderLeft");

			cell=this.getCell(i,selectedRegion.maxX);
			$(cell).addClass("selectCellBorderRight");
		}
		for (i=selectedRegion.minX+1;i<selectedRegion.maxX;i++)
		{
			cell=this.getCell(selectedRegion.minY,i);
			$(cell).addClass("selectCellBorderTop");
			
			cell=this.getCell(selectedRegion.maxY,i);
			$(cell).addClass("selectCellBorderBottom");
		}
		
	}
	showGenResultTable()
	{
		this.genResultTable=document.getElementById("genResult");
		$(this.genResultTable).show();
	}
//======================================================================
	_buildITORow(itoId)
	{
		super._buildITORow(itoId);
		var i;
		var preferredShift=this.preferredShiftList[itoId];
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		var cell=row.insertCell(row.cells.length);
		row.id="preferredShift_"+itoId;
		//cell.className="borderCell alignLeft";
		$(cell).addClass(this.alignLeftClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.innerHTML="Preferred Shift";

		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
			//cell.className="alignCenter borderCell";
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		for (var i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			if (i<Object.keys(this.dateObjList).length)
			{
				//cell.className="alignCenter borderCell cursorCell";
				$(cell).addClass(this.alignCenterClassName);
				$(cell).addClass(this.borderCellClassName);
				$(cell).addClass(this.cursorCellClassName);
				if (preferredShift[i+1]!=null)
				{
					cell.textContent=preferredShift[i+1];
				}
			}
			else
			{	
				//cell.className="alignCenter borderCell";
				$(cell).addClass(this.alignCenterClassName);
				$(cell).addClass(this.borderCellClassName);
			}
		}
		cell=row.insertCell(row.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.colSpan=5;
		
		for (i=0;i<5;i++)
		{
			cell=row.insertCell(row.cells.length);
			//cell.className="alignCenter borderCell";
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
	}
	_buildRosterRows()
	{
		super._buildRosterRows();
		var aShiftData=[],bShiftData=[],cShiftData=[];
		var aShiftSD,bShiftSD,cShiftSD,avgStdDev;
		var i,self=this,shiftType;
		var row=this.rosterBody.insertRow(this.rosterBody.rows.length);
		var cell=row.insertCell(row.cells.length);
		row.id="vacantShiftRow";
		this.vacantShiftRow=row;
		cell.textContent="Vacant Shifts";
		//cell.className="vacantShiftLabel borderCell";
		$(cell).addClass(this.vacantShiftLabelClassName);
		$(cell).addClass(this.borderCellClassName);
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
			//cell.className="alignCenter borderCell";
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		Object.keys(this.dateObjList).forEach(function(date){
			var essentialShift=self.rosterRule.getEssentialShift();
			cell=row.insertCell(row.cells.length);
			//cell.className="alignCenter borderCell vacantShift";
			$(cell).addClass(self.alignCenterClassName);
			$(cell).addClass(self.borderCellClassName);
			$(cell).addClass(self.vacantShiftClassName);
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
			cell=row.insertCell(row.cells.length);
			//cell.className="alignCenter borderCell vacantShift";
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
			$(cell).addClass(this.vacantShiftClassName);
		}	

		Object.keys(self.itoList).forEach(function(itoId){
			aShiftData.push(Number(document.getElementById(itoId+"_aShiftCount").textContent));
			bShiftData.push(Number(document.getElementById(itoId+"_bxShiftCount").textContent));
			cShiftData.push(Number(document.getElementById(itoId+"_cShiftCount").textContent));
			$("#shift_"+itoId+" td.shiftCell").blur(function(){
				self._updateValue(this,itoId);
			});
		});

		cell=row.insertCell(row.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.colSpan=5;
				
		cell=row.insertCell(row.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.id="shiftAStdDev";
		
		cell=row.insertCell(row.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.id="shiftBStdDev";		
		
		cell=row.insertCell(row.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.id="shiftCStdDev";
		
		cell=row.insertCell(row.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.id="avgStdDev";		

		cell=row.insertCell(row.cells.length);
		//cell.className="alignCenter borderCell";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);

		this._updateStandardDevation(aShiftData,bShiftData,cShiftData);
		$("td."+this.cursorCellClassName).attr('contentEditable',true);
		//var shiftCellSelector=new ShiftCellSelector(this,"cursorCell");
		var firstCell=$("td."+this.cursorCellClassName)[0];
		this.selectedRegion=new SelectedRegion(this);
		$("td."+this.cursorCellClassName).focus(function (){
			console.log("td."+self.cursorCellClassName+" on focus.");
			if (self.selectedRegion.isEmpty())
			{
				self.selectedRegion.startSelect(this);
				self.selectedRegion.endSelect();
			}
		});
		this.cursorCells=$("td."+this.cursorCellClassName);
		var thisWebPageEventHandler=new ThisWebPageEventHandler(this.cursorCells,this,this.selectedRegion);
		var rosterTableEventHandler=new RosterTableEventHandler(this.cursorCells,this,this.selectedRegion);
	}
	_genYearlyStatisticReport()
	{
		var cell,i,self=this,row;
		var yearlyStatisticReportDiv=document.createElement("div");
		var yearlyStatisticTable=document.createElement("table");
		yearlyStatisticReportDiv.id="yearlyStatisticDiv";
		yearlyStatisticReportDiv.className=this.yearlyStatisticReportDivClassName;
		yearlyStatisticTable.id="yearlyStatisticTable";
		yearlyStatisticTable.className=this.yearlyStatisticTableClassName;
		row=yearlyStatisticTable.insertRow(yearlyStatisticTable.rows.length);
		
		cell=row.insertCell(row.cells.length);
		//cell.className="borderCell alignCenter";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.textContent="ITO";
		
		cell=row.insertCell(row.cells.length);
		//cell.className="borderCell alignCenter";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.textContent="a";
		
		cell=row.insertCell(row.cells.length);
		//cell.className="borderCell alignCenter";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);

		cell.textContent="bx";
		
		cell=row.insertCell(row.cells.length);
		//cell.className="borderCell alignCenter";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.textContent="c";
		
		cell=row.insertCell(row.cells.length);
		//cell.className="borderCell alignCenter";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.textContent="dx";
		
		cell=row.insertCell(row.cells.length);
		//cell.className="borderCell alignCenter";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.textContent="O";

		cell=row.insertCell(row.cells.length);
		//cell.className="borderCell alignCenter";
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
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
				//cell.className="borderCell alignCenter";
				$(cell).addClass(self.alignCenterClassName);
				$(cell).addClass(self.borderCellClassName);
				cell.textContent=self.yearlyStatistic[itoId].itoPostName;
				
				cell=row.insertCell(row.cells.length);
				//cell.className="borderCell alignCenter";
				$(cell).addClass(self.alignCenterClassName);
				$(cell).addClass(self.borderCellClassName);
				cell.textContent=aShiftTotal;

				cell=row.insertCell(row.cells.length);
				//cell.className="borderCell alignCenter";
				$(cell).addClass(self.alignCenterClassName);
				$(cell).addClass(self.borderCellClassName);				
				cell.textContent=bxShiftTotal;

				cell=row.insertCell(row.cells.length);
				//cell.className="borderCell alignCenter";
				$(cell).addClass(self.alignCenterClassName);
				$(cell).addClass(self.borderCellClassName);			
				cell.textContent=cShiftTotal;
				
				cell=row.insertCell(row.cells.length);
				//cell.className="borderCell alignCenter";
				$(cell).addClass(self.alignCenterClassName);
				$(cell).addClass(self.borderCellClassName);
				cell.textContent=dxShiftTotal;

				cell=row.insertCell(row.cells.length);
				//cell.className="borderCell alignCenter";
				$(cell).addClass(self.alignCenterClassName);
				$(cell).addClass(self.borderCellClassName);			
				cell.textContent=oShiftTotal;

				finalTotal=oShiftTotal+cShiftTotal+aShiftTotal+dxShiftTotal+bxShiftTotal;
				cell=row.insertCell(row.cells.length);
				//cell.className="borderCell alignCenter";
				$(cell).addClass(self.alignCenterClassName);
				$(cell).addClass(self.borderCellClassName);
				cell.textContent=finalTotal;
				
				for (i=0;i<itoMonthlyStatistic.length;i++)
				{
					row=yearlyStatisticTable.insertRow(yearlyStatisticTable.rows.length);
					cell=row.insertCell(row.cells.length);
					//cell.className="borderCell alignCenter";
					$(cell).addClass(self.alignCenterClassName);
					$(cell).addClass(self.borderCellClassName);
					cell.textContent=i+1;
					
					cell=row.insertCell(row.cells.length);
					//cell.className="borderCell alignCenter";
					$(cell).addClass(self.alignCenterClassName);
					$(cell).addClass(self.borderCellClassName);
					cell.textContent=itoMonthlyStatistic[i].ashiftTotal;
					
					cell=row.insertCell(row.cells.length);
					//cell.className="borderCell alignCenter";
					$(cell).addClass(self.alignCenterClassName);
					$(cell).addClass(self.borderCellClassName);				
					cell.textContent=itoMonthlyStatistic[i].bxShiftTotal;

					cell=row.insertCell(row.cells.length);
					//cell.className="borderCell alignCenter";
					$(cell).addClass(self.alignCenterClassName);
					$(cell).addClass(self.borderCellClassName);			
					cell.textContent=itoMonthlyStatistic[i].cshiftTotal;

					cell=row.insertCell(row.cells.length);
					//cell.className="borderCell alignCenter";
					$(cell).addClass(self.alignCenterClassName);
					$(cell).addClass(self.borderCellClassName);
					cell.textContent=itoMonthlyStatistic[i].dxShiftTotal;

					cell=row.insertCell(row.cells.length);
					//cell.className="borderCell alignCenter";
					$(cell).addClass(self.alignCenterClassName);
					$(cell).addClass(self.borderCellClassName);					
					cell.textContent=itoMonthlyStatistic[i].oshiftTotal;

					cell=row.insertCell(row.cells.length);
					//cell.className="borderCell alignCenter";
					$(cell).addClass(self.alignCenterClassName);
					$(cell).addClass(self.borderCellClassName);				
					cell.textContent=itoMonthlyStatistic[i].monthlyTotal;
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
			cellList=$(shiftRow).children("."+this.cursorCellClassName);
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
	_getVacantShiftData()
	{
		var cell,result=[];
		var vacancyRow=document.getElementById("vacantShiftRow");
		var cells=$(vacancyRow).children("."+this.vacantShiftClassName);
		for (var i=0;i<cells.length;i++)
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
			cells=$(preferredShiftRow).children("."+this.cursorCellClassName);
			for (var i=startDate;i<=endDate;i++)
			{
				
				cell=cells[i-1];
				if (ito.isValidPreferredShift(cell.textContent))
				{	
					$(cell).removeClass(this.errorRedBlackGroundClassName);
				}
				else	
				{
					$(cell).addClass(this.errorRedBlackGroundClassName);
					result=true;
				}	
			}	
		}
		
		return result;
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
		cell.colSpan=34;
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
	_updateValue(theCell,itoId)
	{
		var aShiftCount=0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0,balance=0.0;
		var	actualWorkingHour=0.0,thisMonthHourTotal=0.0,thisMonthBalance=0.0;
		var aShiftData=[],bShiftData=[],cShiftData=[];
		var aShiftSD,bShiftSD,cShiftSD,avgStdDev;
		var cell,i;
		var ito=this.itoList[itoId];
		var row;
		var shiftType=theCell.textContent;
		var vacantShift=this.rosterRule.getEssentialShift();
		var startIndex=this.showNoOfPrevDate+1;
		var endIndex=startIndex+Object.keys(this.dateObjList).length;
		var totalHour=Number(document.getElementById(itoId+"_totalHour").textContent);
		var balance=Number(document.getElementById(itoId+"_lastMonthBalance").textContent);

		row=theCell.parentElement;
		Object.keys(this.rosterRule.shiftHourCount).forEach(function(shiftType){
			$(theCell).removeClass(shiftType.toLowerCase()+"ShiftColor");
		});
		$(theCell).removeClass(this.errorRedBlackGroundClassName);
		
		if (ito.isValidShift(shiftType))
			$(theCell).addClass(this.utility.getShiftCssClassName(shiftType));
		
		for (i=startIndex;i<endIndex;i++)
		{
			cell=row.cells[i];
			shiftType=cell.textContent;
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
				actualWorkingHour+=this.rosterRule.shiftHourCount[shiftType];
			}
		}
		
		thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=thisMonthHourTotal+balance;
	
		this._updateShiftCount(itoId,totalHour,actualWorkingHour,balance,thisMonthHourTotal,thisMonthBalance,aShiftCount,bxShiftCount,cShiftCount,dxShiftCount);

		for (var itoId in this.itoList)
		{
			 var cell=document.getElementById("shift_"+itoId).cells[theCell.cellIndex];
			 if (cell.textContent!="")
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
		
		document.getElementById("vacantShiftRow").cells[theCell.cellIndex].textContent=vacantShift;
		this._updateStandardDevation(aShiftData,bShiftData,cShiftData);
	}
}