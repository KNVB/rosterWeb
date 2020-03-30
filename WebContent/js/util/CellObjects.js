/*==============================================================================================*
 *																				  				*
 *	This is shift cell object.									                  	            *
 *	It is read only, the background color of the cell would depend on the shift type.			*
 *																								*
 *==============================================================================================*/
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
		$(this).addClass(Css.getShiftCssClassName(t));
	}
}
customElements.define('shift-cell',
		ShiftCell, {
		extends: 'td'
		}
	);
/*==============================================================================================*
 *																				  				*
 *	This is week day cell object.									                            *
 *	It is read only cell.																		*
 *																								*
 *==============================================================================================*/
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
		this.textContent=dateObj.dayOfWeek;
	}
}
customElements.define('weekday-cell',
		WeekDayCell, {
			extends: 'td'
		});