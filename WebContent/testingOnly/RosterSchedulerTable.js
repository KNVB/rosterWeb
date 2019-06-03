class RosterSchedulerTable extends RosterTable
{
	constructor(container)
	{
		super(container);
		this.cursorCells=null;
		this.dragSelector=null;
		this.errorRedBlackGroundClassName="errorRedBlackGround";
		this.itoList={"ITO1_1999-01-01":{"postName":"ITO1","workingHourPerDay":7.8,"joinDate":{"year":1999,"month":"JANUARY","dayOfWeek":"FRIDAY","era":"CE","dayOfYear":1,"leapYear":false,"monthValue":1,"dayOfMonth":1,"chronology":{"calendarType":"iso8601","id":"ISO"}},"leaveDate":{"year":2099,"month":"DECEMBER","dayOfWeek":"THURSDAY","era":"CE","dayOfYear":365,"leapYear":false,"monthValue":12,"dayOfMonth":31,"chronology":{"calendarType":"iso8601","id":"ISO"}},"availableShiftList":["a","b","c","d1","d2","O"],"blackListedShiftPatternList":["c,c,c","c,b","c,a","b,a"],"itoname":"TSANG Ka Shing Gary","itoid":"ITO1_1999-01-01"},"ITO3_2017-10-18":{"postName":"ITO3","workingHourPerDay":9.0,"joinDate":{"year":2017,"month":"OCTOBER","dayOfWeek":"WEDNESDAY","era":"CE","dayOfYear":291,"leapYear":false,"monthValue":10,"dayOfMonth":18,"chronology":{"calendarType":"iso8601","id":"ISO"}},"leaveDate":{"year":2099,"month":"DECEMBER","dayOfWeek":"THURSDAY","era":"CE","dayOfYear":365,"leapYear":false,"monthValue":12,"dayOfMonth":31,"chronology":{"calendarType":"iso8601","id":"ISO"}},"availableShiftList":["a","b1","c","d","O"],"blackListedShiftPatternList":["b1,a","c,c,c","c,b1","c,a"],"itoname":"YUNG Kin Shing Tommy","itoid":"ITO3_2017-10-18"},"ITO4_1999-01-01":{"postName":"ITO4","workingHourPerDay":7.8,"joinDate":{"year":1999,"month":"JANUARY","dayOfWeek":"FRIDAY","era":"CE","dayOfYear":1,"leapYear":false,"monthValue":1,"dayOfMonth":1,"chronology":{"calendarType":"iso8601","id":"ISO"}},"leaveDate":{"year":2099,"month":"DECEMBER","dayOfWeek":"THURSDAY","era":"CE","dayOfYear":365,"leapYear":false,"monthValue":12,"dayOfMonth":31,"chronology":{"calendarType":"iso8601","id":"ISO"}},"availableShiftList":["a","b","c","d1","d2","O"],"blackListedShiftPatternList":["c,c","c,b","c,a"],"itoname":"HUEN Kwai-leung Andrew","itoid":"ITO4_1999-01-01"},"ITO6_1999-01-01":{"postName":"ITO6","workingHourPerDay":7.8,"joinDate":{"year":1999,"month":"JANUARY","dayOfWeek":"FRIDAY","era":"CE","dayOfYear":1,"leapYear":false,"monthValue":1,"dayOfMonth":1,"chronology":{"calendarType":"iso8601","id":"ISO"}},"leaveDate":{"year":2099,"month":"DECEMBER","dayOfWeek":"THURSDAY","era":"CE","dayOfYear":365,"leapYear":false,"monthValue":12,"dayOfMonth":31,"chronology":{"calendarType":"iso8601","id":"ISO"}},"availableShiftList":["a","b","c","d1","d2","O"],"blackListedShiftPatternList":["c,c,c","c,b","c,a","b,a"],"itoname":"LI Chi-wai Joseph","itoid":"ITO6_1999-01-01"},"ITO8_1999-01-01":{"postName":"ITO8","workingHourPerDay":7.8,"joinDate":{"year":1999,"month":"JANUARY","dayOfWeek":"FRIDAY","era":"CE","dayOfYear":1,"leapYear":false,"monthValue":1,"dayOfMonth":1,"chronology":{"calendarType":"iso8601","id":"ISO"}},"leaveDate":{"year":2099,"month":"DECEMBER","dayOfWeek":"THURSDAY","era":"CE","dayOfYear":365,"leapYear":false,"monthValue":12,"dayOfMonth":31,"chronology":{"calendarType":"iso8601","id":"ISO"}},"availableShiftList":["a","b","c","d1","d2","O"],"blackListedShiftPatternList":["c,a","b,a","c,c,c","c,b"],"itoname":"CHAN Tai-hin Jimmy","itoid":"ITO8_1999-01-01"}};
		
		this.preferredShiftList={"ITO1_1999-01-01":{"1":"nb","2":"o","3":"o","4":"nb","5":"o","6":"o","7":"o","10":"a","11":"c","12":"c","14":"c","15":"c","23":"o","24":"o"},"ITO3_2017-10-18":{"4":"o","5":"o"},"ITO4_1999-01-01":{"2":"a","3":"b","4":"al","5":"al","7":"o","9":"a","16":"a","23":"a","24":"o","25":"o"},"ITO6_1999-01-01":{"1":"c","2":"o","3":"a","4":"al","5":"a","6":"a","7":"al","8":"c","9":"o","10":"a","11":"al","15":"c","16":"o","17":"a","22":"c","23":"o","24":"a"},"ITO8_1999-01-01":{"3":"na","6":"o","7":"o","13":"o","14":"o","16":"nc","17":"na","20":"o","21":"o","27":"al","28":"al"}};

		this.showNoOfPrevDate=2;
		this.vacantShiftClassName="vacantShift";
		this.vacantShiftLabelClassName="vacantShiftLabel";
		this.essentialShiftList=["a","b","c"];
	}
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
			$(cell).addClass(this.dateCellClassName);
		}
		for (var i=0;i<31;i++)
		{
			cell=row.insertCell(row.cells.length);
			$(cell).addClass(this.dateCellClassName);
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);

			if (i<Object.keys(this.dateObjList).length)
			{
				$(cell).addClass(this.cursorCellClassName);
				var inputBox=document.createElement("input");
				inputBox.type="text";
				$(cell).append(inputBox);
				if (preferredShift[i+1]!=null)
				{
					inputBox.value=preferredShift[i+1];
				}
			}
		}
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.colSpan=5;
		
		for (i=0;i<5;i++)
		{
			cell=row.insertCell(row.cells.length);
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
		
		$(cell).addClass(this.vacantShiftLabelClassName);
		$(cell).addClass(this.borderCellClassName);
		
		for (i=0;i<this.showNoOfPrevDate;i++)
		{
			cell=row.insertCell(row.cells.length);
					$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
		}
		Object.keys(this.dateObjList).forEach(function(date){
			var essentialShift="abc";
			cell=row.insertCell(row.cells.length);
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
			$(cell).addClass(this.alignCenterClassName);
			$(cell).addClass(this.borderCellClassName);
			$(cell).addClass(this.vacantShiftClassName);
		}	

		Object.keys(self.itoList).forEach(function(itoId){
			aShiftData.push(Number(document.getElementById(itoId+"_aShiftCount").textContent));
			bShiftData.push(Number(document.getElementById(itoId+"_bxShiftCount").textContent));
			cShiftData.push(Number(document.getElementById(itoId+"_cShiftCount").textContent));
			$("#shift_"+itoId+" td.shiftCell input[type='text']").removeAttr("readonly");
			$("#shift_"+itoId+" td.shiftCell").blur(function(){
				self._updateValue(this,itoId);
			});
		});

		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.colSpan=5;
				
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.id="shiftAStdDev";
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.id="shiftBStdDev";		
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.id="shiftCStdDev";
		
		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);
		cell.id="avgStdDev";		

		cell=row.insertCell(row.cells.length);
		$(cell).addClass(this.alignCenterClassName);
		$(cell).addClass(this.borderCellClassName);

		var m=new CursorCellSelector($("td."+this.cursorCellClassName),this);
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
				//cell.blur();
				$(cell).removeClass("selectCellBorderRight");   
				$(cell).removeClass("selectCellBorderTop");     
				$(cell).removeClass("selectCellBorderBottom");  
				$(cell).removeClass("selectCellBorderLeft");
			}	
		}
	}	
	getCell(rowIndex,cellIndex)
	{
		var row=this.rosterTable.rows[rowIndex];
		var cell=row.cells[cellIndex];
		return cell;
	}
	getDataForCopy(selectedRegion)
	{
		var cell,inputBox;
		var dataRow=[],dataRowList=[];
		this.clearSelectedRegion(selectedRegion);
		this.setCopiedRegion(selectedRegion);
		for (var y=selectedRegion.minY;y<=selectedRegion.maxY;y++)
		{
			dataRow=[];
			for (var x=selectedRegion.minX;x<=selectedRegion.maxX;x++)
			{
				cell=this.getCell(y,x);
				inputBox=$(cell).find("input[type='text']")[0];
				dataRow.push(inputBox.value);
			}
			dataRowList.push(dataRow);
		}
		return dataRowList;
	}
	pasteDataFromClipboard(selectedRegion,dataRowList)
	{
		var buffer=$("#buffer");
		var destCell=this.getCell(selectedRegion.minY,selectedRegion.minX);
		
	}
	/*
	pasteDataFromClipboard(selectedRegion,dataRowList)
	{
		var cell,destCell,dataCell,dataDx,dataDy,dataRow,destDx,destDy;
		var i,inputBox,j,k,l,x,y,xCount,yCount;
		dataRow=dataRowList[0];
		destDy=selectedRegion.maxY-selectedRegion.minY+1;
		destDx=selectedRegion.maxX-selectedRegion.minX+1;
		dataDy=dataRowList.length;
		dataDx=dataRow.length;
		
		
		if ((destDy % dataDy==0 ) && (destDx % dataDx==0)) //if the selectedRegion width and height is multiple of the copied data
		{
			yCount=destDy / dataDy;
			xCount=destDx / dataDx;
			y=selectedRegion.minY;
			x=selectedRegion.minX;
			
			//console.log(destDy,dataDy,yCount);
			
			for (l=0;l<yCount;l++)
			{	
				for (j=0;j<dataRowList.length;j++)
				{
					dataRow=dataRowList[j];
					x=selectedRegion.minX;
					for (i=0;i<xCount;i++)
					{
						for (k=0;k<dataRow.length;k++)
						{
							destCell=this.getCell(y,x++);
							dataCell=dataRow[k];
							$(destCell).find("input[type='text']").val(dataCell).blur();
							//$(destCell).text(dataCell.textContent).blur();
						}
					}
					y++;
				}
			}
		}
		else
		{
			destCell=this.getCell(selectedRegion.minY,selectedRegion.minX);
			var index=$.inArray(destCell,this.cursorCells);
			for (i=0;i<dataRowList.length;i++)
			{
				dataRow=dataRowList[i];
				for (j=0;j<dataRow.length;j++)
				{
					dataCell=dataRow[j];
					destCell=this.cursorCells[index];
					//$(destCell).text(dataCell.textContent).blur();
					$(destCell).find("input[type='text']").val(dataCell).blur();
					index++;
					if (index>=this.cursorCells.length)
					{
						index=0;
					}	
				}
				index-=j;
				index=index+Object.keys(this.dateObjList).length;
				if (index>=this.cursorCells.length)
				{
					index=0;
				}	
			}
		}	
	}
	*/	
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
	unselectCell(theCell)
	{
		$(theCell).removeClass("selectCellBorderRight");
		$(theCell).removeClass("selectCellBorderTop");
		$(theCell).removeClass("selectCellBorderBottom");
		$(theCell).removeClass("selectCellBorderLeft");
	}				
}			