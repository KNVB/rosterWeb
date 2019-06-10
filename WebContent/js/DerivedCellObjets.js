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