/*******************************************************************************************************
 *                                                                                                     *
 *    Basic cells objects                                                                              *
 *                                                                                                     *
 *******************************************************************************************************/
class BorderCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.borderCellClassName);
	}
}
customElements.define('border-cell',
		BorderCell, {
		extends: 'td'
		}
	);
class BorderedAlignCenterCell extends BorderCell
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
	}
}
customElements.define('bordered-align-center-cell',
		BorderedAlignCenterCell, {
		extends: 'td'
		}
	);
class ShiftLegendCell extends HTMLTableCellElement
{
	constructor() {
		super();
		this.colSpan=11;
	}
}
customElements.define('shift-legend-cell',
		ShiftLegendCell, {
			extends: 'td'
		});
/*******************************************************************************************************
 *                                                                                                     *
 *    Roster table header cells objects                                                                *
 *                                                                                                     *
 *******************************************************************************************************/
class ActualHourCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.actualHourCellClassName);
	}
}
customElements.define('actual-hour-cell',
		ActualHourCell, {
		extends: 'td'
		}
	);
class CaptionCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.captionCellClassName);
		$(this).addClass(Css.underlineTextClassName);
		this.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		this.colSpan=31;
	}
}
customElements.define('caption-cell',
		CaptionCell, {
			extends: 'td'
		});
class LastMonthCell extends HTMLTableCellElement
{	
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.lastMonthCellClassName);
	}
}
customElements.define('last-month-cell',
		LastMonthCell, {
			extends: 'td'
		});
class NameCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.nameCellClassName);
	}
}
customElements.define('name-cell',
		NameCell, {
		extends: 'td'
		}
	);

class NoOfWorkingDayCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.noOfWorkingDayCellClassName);
	}
}
customElements.define('no-of-working-day-cell', 
		NoOfWorkingDayCell,{
			extends: 'td'
		});
class ShiftCountCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.shiftCountCellClassName);
	}
}
customElements.define('shift-count-cell',
		ShiftCountCell, {
			extends: 'td'
		});
class ThisMonthCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.thisMonthCellClassName);
	}
}
customElements.define('this-month-cell',
		ThisMonthCell, {
			extends: 'td'
		});
class TotalCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.totalCellClassName);
	}
}
customElements.define('total-cell',
		TotalCell, {
			extends: 'td'
		});

class TotalHourCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.totalHourCellClassName);
	}
}
customElements.define('total-hour-cell',
		TotalHourCell, {
			extends: 'td'
		});