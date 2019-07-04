class SimpleCellFactory
{
	static get ActualHourCell()
	{
		var cell=this.AlignCenterCell;
		$(cell).addClass(Css.actualHourCellClassName);
		return cell;
	}
	static get AlignCenterCell()
	{
		var cell=document.createElement("td");
		$(cell).addClass(Css.alignCenterClassName);
		return cell;
	}
	static get BorderCell()
	{
		var cell=document.createElement("td");
		$(cell).addClass(Css.borderCellClassName);
		return cell;
	}
	static get BorderedAlignCenterCell()
	{
		var cell=this.BorderCell;
		$(cell).addClass(Css.alignCenterClassName);
		return cell;
	}
	static get BorderedActualHourCell()
	{
		var cell=this.ActualHourCell;
		$(cell).addClass(Css.borderCellClassName);
		$(cell).html("Last<br>Month");
		return cell;
	}
	static get BorderedLastMonthCell()
	{
		var cell=this.LastMonthCell;
		$(cell).addClass(Css.borderCellClassName);
		$(cell).html("Last<br>Month");
		return cell;
	}
	static get BorderedNameCell()
	{
		var cell=this.NameCell;
		$(cell).addClass(Css.borderCellClassName);
		return cell;
	}
	static get BorderedThisMonthCell()
	{
		var cell=this.ThisMonthCell;
		$(cell).html("This<br>Month");
		$(cell).addClass(Css.borderCellClassName);
		return cell;
	}
	static get BorderedTotalCell() 
	{
		var cell=this.TotalCell;
 		$(cell).html("Total");
 		$(cell).addClass(Css.borderCellClassName);
	 	return cell;	
	}
	static get BorderedTotalHourCell()
	{
		var cell=this.TotalHourCell;
		$(cell).addClass(Css.borderCellClassName);
		return cell;
	}
	static get CaptionCell()
	{
		var cell=this.AlignCenterCell;
		$(cell).addClass(Css.captionCellClassName);
		$(cell).addClass(Css.underlineTextClassName);
		cell.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		cell.colSpan=31;
		return cell;
	}
	static get DateCell()
	{
		var cell=this.BorderedAlignCenterCell;
		$(cell).addClass(Css.dateCellClassName);
		return cell;
	}
	static get DateNameCell()
	{
		var cell=this.BorderedNameCell;
		cell.innerHTML="Resident Support<br>Team Members";
		return cell;
	}
	static get HolidayCell()
	{
		var cell=this.NameCell;
		$(cell).addClass(Css.borderCellClassName);
		cell.textContent="Holiday";
		return cell;
	}
	static get HourOffDueCell()
	{
		var cell=this.BorderedAlignCenterCell;
		cell.colSpan=8;
		cell.innerHTML="Hour Off Due";
		return cell;
	}
	static get LastMonthCell()
	{
		var cell=this.AlignCenterCell;
		$(cell).addClass(Css.lastMonthCellClassName);
		return cell;
	}
	static get NameCell()
	{
		var cell=document.createElement("td");
		$(cell).addClass(Css.nameCellClassName);
		return cell;
	}
	static get NoOfWorkingDayCell()
	{
		var cell=this.AlignCenterCell;
		$(cell).addClass(Css.noOfWorkingDayCellClassName);
		return cell;
	}
	static get NoOfWorkingDayCountCell()
	{ 
		var cell=this.NoOfWorkingDayCell;
		$(cell).addClass(Css.borderCellClassName);
		cell.innerHTML="No. of <br>working<br>day";
		return cell;
	}
	static get PHCell()
	{
		var cell=this.DateCell;
		$(cell).addClass(Css.phCellClassName);
		return cell;
	}
	static get WeekDayNameCell() 
	{
		var cell=this.BorderedNameCell;
		cell.textContent="Days";
		return cell;
	}
	static get ShiftCountCell()
	{
		var cell=this.AlignCenterCell;
		$(cell).addClass(Css.shiftCountCellClassName);
		return cell;
	}
	static get ShiftACountCell()
	{
		var cell=this.ShiftCountCell;
		$(cell).addClass(Css.borderCellClassName);
		cell.innerHTML="Total No. of <br>A Shift";
		return cell;
	}
	static get ShiftBxCountCell()
	{
		var cell=this.ShiftCountCell;
		$(cell).addClass(Css.borderCellClassName);
		cell.innerHTML="Total No. of <br>Bx Shift";
		return cell;
	}
	static get ShiftCCountCell()
	{
		var cell=this.ShiftCountCell;
		$(cell).addClass(Css.borderCellClassName);
		cell.innerHTML="Total No. of <br>C Shift";
		return cell;
	}
	static get ShiftDxCountCell()
	{
		var cell=this.ShiftCountCell;
		$(cell).addClass(Css.borderCellClassName);
		cell.innerHTML="Total No. of <br>Dx Shift";
		return cell;
	}
	static get ThisMonthCell()
	{
		var cell=this.AlignCenterCell;
		$(cell).addClass(Css.thisMonthCellClassName);
		return cell;
	}
	static get TotalCell()
	{
		var cell=this.AlignCenterCell;
		$(cell).addClass(Css.totalCellClassName);
		return cell;
	}	
	static get TotalHourCell()
	{
		var cell=this.AlignCenterCell;
		$(cell).addClass(Css.totalHourCellClassName);
		return cell;
	}
/************************************************************************************************
 *                                                                                              * 
 *   Legend Cell                                                                                *
 *                                                                                              *  
 ***********************************************************************************************/
	static get ShiftLegendCell()
	{
		var cell=document.createElement("td");
		cell.colSpan=11;
		return cell;
	}
	static get AShiftLegendCell()
	{
		var cell=this.ShiftLegendCell;
		$(cell).addClass(Css.aShiftColorClassName);
		cell.textContent="a : 0800H - 1700H";
		return cell;
	}
	static get BShiftLegendCell()
	{
		var cell=this.ShiftLegendCell;
		$(cell).addClass(Css.bShiftColorClassName);
		cell.textContent="b : 1630H - 2215H";
		return cell;
	}
	static get B1ShiftLegendCell()
	{
		var cell=this.BShiftLegendCell;
		cell.textContent="b1 : 1500H - 2215H";
		return cell;
	}
	static get CShiftLegendCell()
	{
		var cell=this.ShiftLegendCell;
		$(cell).addClass(Css.cShiftColorClassName);
		cell.textContent="c : 2145H - 0830H (the next day)";
		return cell;
	}
	static get DShiftLegendCell()
	{
		var cell=this.ShiftLegendCell;
		$(cell).addClass(Css.dShiftColorClassName);
		cell.textContent="d : 0800H - 1800H (on weekdays)";
		return cell;
	}
	static get D1ShiftLegendCell()
	{
		var cell=this.DShiftLegendCell;
		cell.textContent="d1 : 0800H - 1700H (on weekdays)";
		return cell;
	}
	static get D2ShiftLegendCell()
	{
		var cell=this.DShiftLegendCell;
		cell.textContent="d2 : 0900H - 1800H (on weekdays)";
		return cell;
	}
	static get D3ShiftLegendCell()
	{
		var cell=this.DShiftLegendCell;
		cell.textContent="d3 : 0800H - 1648H (on weekdays)";
		return cell;
	}
	static get OShiftLegendCell()
	{
		var cell=this.ShiftLegendCell;
		$(cell).addClass(Css.oShiftColorClassName);
		cell.textContent="O : dayoff";
		return cell;
	}
	static get SickLeaveShiftLegendCell()
	{
		var cell=this.ShiftLegendCell;
		$(cell).addClass(Css.sickLeaveColorClassName);
		cell.textContent="s : sick leave standby";
		return cell;
	}
/***************************************************************************************
 *                                                                                     * 
 *  Select Roster Month Cell                                                           *
 *                                                                                     * 
 ***************************************************************************************/
	static _addCursorEventHandler(cell,rosterTable)
	{
		$(cell).addClass(Css.cursorCellClassName);
		$(cell).mouseover(function(){
			rosterTable.markCoorindate(this);
		});
		$(cell).mouseout(function(){
			rosterTable.unMarkCoorindate(this);
		});
	}
	static getCursoredShiftCell(rosterTable)
	{
		var cell=new ShiftCell(rosterTable.utility);
		this._addCursorEventHandler(cell,rosterTable);
		return cell;
	}
	static getSelectRosterMonthCell(rosterTable)
	{
		var cell=this.AlignCenterCell;
		var centerDiv=document.createElement("div");
		var div=document.createElement("div");
		var leftDiv=document.createElement("div");
		var rightDiv=document.createElement("div");
		var rosterMonthDiv=document.createElement("div");
		
		var monthPicker;
		var monthPickerDiv=document.createElement("div");
		var monthPickerOption={initYear:rosterTable.rosterYear,minValue: "01/2017"};
		
		$(cell).addClass(Css.selectRosterMonthCellClassName);
		
		cell.colSpan=31;
		
		div.style.display="flex";
		div.style.justifyContent="center";
		div.style.flexDirection="row";

		leftDiv.innerHTML="<&nbsp;&nbsp;";
		leftDiv.style.display="flex";
		$(leftDiv).addClass(Css.underlineTextClassName);
		$(leftDiv).addClass(Css.clickableClassName);
		$(leftDiv).click(function(){
			rosterTable._buildPreviousMonth();	
		});
		
		centerDiv.style.display="flex";
		centerDiv.style.flexDirection="column";
		$(centerDiv).addClass(Css.clickableClassName);

		rosterMonthDiv.style.display="flex";
		rosterMonthDiv.textContent=rosterTable.utility.monthNames[rosterTable.rosterMonth]+" "+rosterTable.rosterYear;
		centerDiv.append(rosterMonthDiv);

		monthPicker=new MonthPicker(monthPickerOption);
		monthPicker.onPick(function (year,month){
			self.rosterTable.build(year,month);
		});
		monthPickerDiv.style.display="flex";
		monthPickerDiv.append(monthPicker);
		centerDiv.append(monthPickerDiv);

		$(rosterMonthDiv).click(function(event){
			$(monthPicker).show();
			event.stopPropagation(); 
		});
		$(document).click(function(){
			$(monthPicker).hide();
		});
		$(centerDiv).addClass(Css.underlineTextClassName);

		rightDiv.innerHTML="&nbsp;&nbsp;>";
		rightDiv.style.display="flex";
		$(rightDiv).addClass(Css.underlineTextClassName);
		$(rightDiv).addClass(Css.clickableClassName);
		$(rightDiv).click(function(){
			rosterTable._buildNextMonth();	
		});

		div.appendChild(leftDiv);
		div.appendChild(centerDiv);
		div.appendChild(rightDiv);
		cell.appendChild(div);
		
		return cell;
	}	
}