class ShiftCell extends HTMLTableCellElement 
{
	constructor(utility) {
		super();
		var self=this;
		this.utility=utility;
		$(this).addClass(Css.borderCellClassName);
		$(this).addClass(Css.alignCenterClassName);
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
class WeekDayCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.dateCellClassName);
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.borderCellClassName);
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