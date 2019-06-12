class ActualHourCountCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.rowSpan=2;
		this.innerHTML="Actual<br>Hour";
	}
}
customElements.define('actual-hour-count-cell',
		ActualHourCountCell, {
		extends: 'td'
		}
	);
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
class DateNameCell extends NameCell
{
	constructor()
	{
		super();
		$(this).addClass(Css.borderCellClassName);
		this.innerHTML="Resident Support<br>Team Members";
	}
}
customElements.define('date-name-cell',
		DateNameCell, {
			extends: 'td'
		}); 
class HolidayCell extends NameCell
{
	constructor()
	{
		super();
		$(this).addClass(Css.borderCellClassName);
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
class LastMonthBalanceCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.innerHTML="Last<br>Month";
	}
}
customElements.define('last-month-balance-cell',
		LastMonthBalanceCell, {
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
class NoOfWorkingDayCountCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.innerHTML="No. of <br>working<br>day";
	}
}
customElements.define('no-of-working-day-count-cell', 
		NoOfWorkingDayCountCell,{
			extends: 'td'
		});
class PreviousMonthShiftCell extends BorderedAlignCenterCell
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
customElements.define('previous-month-shift-cell',
		PreviousMonthShiftCell, {
			extends: 'td'
		});
class ReadOnlyShiftCell extends PreviousMonthShiftCell
{
	constructor(rosterTable) {
		super(rosterTable);
		var self=this;
	
		$(this).addClass(Css.cursorCellClassName);
		$(this).mouseover(function(){
			self.rosterTable.markCoorindate(this);
		});
		$(this).mouseout(function(){
			self.rosterTable.unMarkCoorindate(this);
		});
	}
	
}
customElements.define('readonly-shift-cell',
		ReadOnlyShiftCell, {
			extends: 'td'
		});

class ShiftACountCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.innerHTML="Total No. of <br>A Shift";
	}
}
customElements.define('shift-a-count-cell',
		ShiftACountCell, {
			extends: 'td'
		});
class ShiftBxCountCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.innerHTML="Total No. of <br>Bx Shift";
	}
}
customElements.define('shift-bx-count-cell',
		ShiftBxCountCell, {
			extends: 'td'
		});
class ShiftCCountCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.innerHTML="Total No. of <br>C Shift";
	}
}
customElements.define('shift-c-count-cell',
		ShiftCCountCell, {
			extends: 'td'
		});
class ShiftDxCountCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.innerHTML="Total No. of <br>Dx Shift";
	}
}
customElements.define('shift-dx-count-cell',
		ShiftDxCountCell, {
			extends: 'td'
		});
class ThisMonthBalanceCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.innerHTML="Total";
	}
}
customElements.define('this-month-balance-cell',
		ThisMonthBalanceCell, {
			extends: 'td'
		});

class ThisMonthTotalCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.innerHTML="This<br>Month";
	}
}
customElements.define('this-month-total-cell',
		ThisMonthTotalCell, {
			extends: 'td'
		});

class TotalHourCell extends BorderedAlignCenterCell
{
	constructor() {
		super();
		this.rowSpan=2;
		this.innerHTML="Total<br>Hour";
	}
}
customElements.define('total-hour-cell',
		TotalHourCell, {
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
class WeekDayNameCell extends NameCell
{
	constructor()
	{
		super();
		$(this).addClass(Css.borderCellClassName);
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
