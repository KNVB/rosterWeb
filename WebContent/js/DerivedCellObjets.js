class BorderedActualHourCell extends ActualHourCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
	}
}
customElements.define('bordered-actual-hour-cell',
		BorderedActualHourCell , {
		extends: 'td'
		}
	);
class BorderedLastMonthCell extends LastMonthCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
		$(this).html("Last<br>Month");
	}
}
customElements.define('bordered-last-month-cell',
		BorderedLastMonthCell, {
			extends: 'td'
		});
class BorderedNameCell extends NameCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
	}
}
customElements.define('bordered-name-cell',
		BorderedNameCell, {
		extends: 'td'
		}
	);
class BorderedThisMonthCell extends ThisMonthCell
{
	constructor() {
		super();
		$(this).html("This<br>Month");
		$(this).addClass(Css.borderCellClassName);
	}
}
customElements.define('bordered-this-month-cell',
		BorderedThisMonthCell, {
			extends: 'td'
		});
class BorderedTotalCell extends TotalCell
{
	constructor() {
		super();
		$(this).html("Total");
		$(this).addClass(Css.borderCellClassName);
	}
}
customElements.define('bordered-total-cell',
		BorderedTotalCell, {
			extends: 'td'
		});

class BorderedTotalHourCell extends TotalHourCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
	}
}
customElements.define('bordered-total-hour-cell',
		BorderedTotalHourCell, {
			extends: 'td'
		});
class DateCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		$(this).addClass(Css.dateCellClassName);
	}
}
customElements.define('date-cell',
		DateCell, {
			extends: 'td'
		});
class DateNameCell extends BorderedNameCell
{
	constructor()
	{
		super();
		this.innerHTML="Resident Support<br>Team Members";
	}
}
customElements.define('date-name-cell',
		DateNameCell, {
			extends: 'td'
		}); 
class HolidayCell extends BorderedNameCell
{
	constructor()
	{
		super();
		this.textContent="Holiday";
	}
}
customElements.define('holiday-cell',
		HolidayCell, {
			extends: 'td'
		});
class HourOffDueCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.colSpan=8;
		this.innerHTML="Hour Off Due";
	}
}
customElements.define('hour-off-due-cell',
		HourOffDueCell, {
			extends: 'td'
		});
class NoOfWorkingDayCountCell extends NoOfWorkingDayCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
		this.innerHTML="No. of <br>working<br>day";
	}
}
customElements.define('no-of-working-day-count-cell', 
		NoOfWorkingDayCountCell,{
			extends: 'td'
		});
class PHCell extends DateCell
{
	constructor() {
		super();
		$(this).addClass(Css.phCellClassName);
	}
}
customElements.define('ph-cell',
		PHCell, {
			extends: 'td'
		});
class SelectRosterMonthCell extends HTMLTableCellElement
{
	constructor(rosterTable){
		super();
		$(this).addClass(Css.selectRosterMonthCellClassName);
		$(this).addClass(Css.alignCenterClassName);
		this.colSpan=31;
		var centerDiv=document.createElement("div");
		var div=document.createElement("div");
		var leftDiv=document.createElement("div");
		var rightDiv=document.createElement("div");
		var rosterMonthDiv=document.createElement("div");
		var self=this;
		var monthPicker;
		var monthPickerDiv=document.createElement("div");
		var monthPickerOption={initYear:rosterTable.rosterYear,minValue: "01/2017"};

		this.rosterTable=rosterTable;
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
		this.appendChild(div);
	}
}
customElements.define('select-roster-month-cell', 
		SelectRosterMonthCell,{
			extends: 'td'
		});
class ShiftCell extends BorderedAlignCenterCell
{
	constructor(rosterTable) {
		super();
		var self=this;
		this.utility=rosterTable.utility;
		this.rosterTable=rosterTable;
	}
	setShiftType(t)
	{
		this.textContent=t;
		$(this).addClass(this.utility.getShiftCssClassName(t));
	}
}
customElements.define('shift-cell',
		ShiftCell, {
		extends: 'td'
		}
	);
class CursoredShiftCell extends ShiftCell
{
	constructor(rosterTable) {
		super(rosterTable);
		$(this).addClass(Css.cursorCellClassName);
		
		$(this).mouseover(function(){
			rosterTable.markCoorindate(this);
		});
		$(this).mouseout(function(){
			rosterTable.unMarkCoorindate(this);
		});
	}
}
customElements.define('cursored-shift-cell',
		CursoredShiftCell, {
			extends: 'td'
		});

class ShiftACountCell  extends ShiftCountCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
		this.innerHTML="Total No. of <br>A Shift";		
	}
}
customElements.define('shift-a-count-cell',
		ShiftACountCell, {
			extends: 'td'
		});

class ShiftBxCountCell extends ShiftCountCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
		this.innerHTML="Total No. of <br>Bx Shift";				
	}
}
customElements.define('shift-bx-count-cell',
		ShiftBxCountCell, {
			extends: 'td'
		});
class ShiftCCountCell  extends ShiftCountCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);	
		this.innerHTML="Total No. of <br>C Shift";
	}
}
customElements.define('shift-c-count-cell',
		ShiftCCountCell, {
			extends: 'td'
		});
class ShiftDxCountCell extends ShiftCountCell
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
		this.innerHTML="Total No. of <br>Dx Shift";				
	}
}
customElements.define('shift-dx-count-cell',
		ShiftDxCountCell, {
			extends: 'td'
		});
class WeekDayCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		$(this).addClass(Css.dateCellClassName);
	}
	setDateObj(dateObj)
	{
		switch (dateObj.dayOfWeek)
		{
			case "MONDAY":
						this.textContent="M";
						break;	
			case "TUESDAY":
						this.textContent="T";
						break;	
			case "WEDNESDAY":
						this.textContent="W";
						break;	
			case "THURSDAY":
						this.textContent="Th";
						break;	
			case "FRIDAY":
						this.textContent="F";
						break;	
			case "SATURDAY":
						this.textContent="S";
						break;	
			case "SUNDAY":
						this.textContent="Su";
						break;	
		}					
	}
}
customElements.define('weekday-cell',
		WeekDayCell, {
			extends: 'td'
		});
class WeekDayNameCell extends BorderedNameCell
{
	constructor()
	{
		super();
		this.textContent="Days";
	}
}
customElements.define('weekday-name-cell',
		WeekDayNameCell, {
			extends: 'td'
		});	
/*==============================================================================================*
 *																				  				*
 *	Legend Cell  																				*
 *																				  				*
 *==============================================================================================*/
class AShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.aShiftColorClassName);
		this.textContent="a : 0800H - 1700H";
	}
}
customElements.define('a-shift-legend-cell',
		AShiftLegendCell, {
		extends: 'td'
		}
	);

class BShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.bShiftColorClassName);
		this.textContent="b : 1630H - 2215H";
	}
}
customElements.define('b-shift-legend-cell',
		BShiftLegendCell, {
		extends: 'td'
		}
	);
class B1ShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.bShiftColorClassName);
		this.textContent="b1 : 1630H - 2215H";
	}
}
customElements.define('b1-shift-legend-cell',
		B1ShiftLegendCell, {
		extends: 'td'
		}
	);
class CShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.cShiftColorClassName);
		this.textContent="c : 2145H - 0830H (the next day)";
	}
}
customElements.define('c-shift-legend-cell',
		CShiftLegendCell, {
		extends: 'td'
		}
	);
class DShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.dShiftColorClassName);
		this.textContent="d : 0800H - 1800H (on weekdays)";
	}
}
customElements.define('d-shift-legend-cell',
		DShiftLegendCell, {
		extends: 'td'
		}
	);
class D1ShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.dShiftColorClassName);
		this.textContent="d1 : 0800H - 1700H (on weekdays)";
	}
}
customElements.define('d1-shift-legend-cell',
		D1ShiftLegendCell, {
		extends: 'td'
		}
	);
class D2ShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.dShiftColorClassName);
		this.textContent="d2 : 0900H - 1800H (on weekdays)";
	}
}
customElements.define('d2-shift-legend-cell',
		D2ShiftLegendCell, {
		extends: 'td'
		}
	);
class D3ShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.dShiftColorClassName);
		this.textContent="d3 : 0800H - 1648H (on weekdays)";
	}
}
customElements.define('d3-shift-legend-cell',
		D3ShiftLegendCell, {
		extends: 'td'
		}
	);
class OShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.oShiftColorClassName);
		this.textContent="O : dayoff";
	}
}
customElements.define('o-shift-legend-cell',
		OShiftLegendCell, {
		extends: 'td'
		}
	);
class SickLeaveShiftLegendCell extends ShiftLegendCell
{
	constructor() {
		super();
		$(this).addClass(Css.sickLeaveColorClassName);
		this.textContent="s : sick leave standby";
	}
}
customElements.define('sick-leave-shift-legend-cell',
		SickLeaveShiftLegendCell, {
		extends: 'td'
		}
	);