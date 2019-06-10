class ActualHourCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.actualHourCellClassName);
	}
}
customElements.define('actual-hour-cell',
		ActualHourCell, {
		extends: 'td'
		}
	);
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
class LastMonthCell extends HTMLTableCellElement
{	
	constructor() {
		super();
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
		$(this).addClass(Css.noOfWorkingDayCellClassName);
	}
}
customElements.define('no-of-working-day-cell', 
		NoOfWorkingDayCell,{
			extends: 'td'
		});
class RosterMonthSelectCell extends HTMLTableCellElement
{
	constructor(rosterTable,utility){
		super();
		$(this).addClass(Css.rosterMonthSelectCellClassName);
		$(this).addClass(Css.alignCenterClassName);
		this.colSpan=31;
		var span=document.createElement("span");
		span.innerHTML="<&nbsp;&nbsp;";
		//span.className="underlineText clickable";
		$(span).addClass(Css.underlineTextClassName);
		$(span).addClass(Css.clickableClassName);
		this.append(span);
		$(span).click(function(){
			rosterTable._buildPreviousMonth();	
		});
		
		span=document.createElement("span");
		span.id="rosterMonth";

		$(span).addClass(Css.underlineTextClassName);
		$(span).addClass(Css.clickableClassName);
		span.textContent=utility.monthNames[rosterTable.rosterMonth]+" "+rosterTable.rosterYear;
		this.append(span);	
	
		span=document.createElement("span");
		span.innerHTML="&nbsp;&nbsp;>";

		$(span).addClass(Css.underlineTextClassName);
		$(span).addClass(Css.clickableClassName);
		this.append(span);		
		$(span).click(function(){
			rosterTable._buildNextMonth();	
		});
	}	
}
customElements.define('roster-month-select-cell', 
		RosterMonthSelectCell,{
			extends: 'td'
		});
class ShiftCountCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.shiftCountCellClassName);
	}
}
customElements.define('shift-count-cell',
		ShiftCountCell, {
			extends: 'td'
		});
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

class ThisMonthCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.thisMonthCellClassName);
	}
}
customElements.define('this-month-cell',
		ThisMonthCell, {
			extends: 'td'
		});
class TitleCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.alignCenterClassName);
		$(this).addClass(Css.titleCellClassName);
		$(this).addClass(Css.underlineTextClassName);
		this.textContent="EMSTF Resident Support & Computer Operation Support Services Team Roster";
		this.colSpan=31;
	}
}
customElements.define('title-cell',
		TitleCell, {
			extends: 'td'
		});
class TotalCell extends HTMLTableCellElement
{
	constructor() {
		super();
		$(this).addClass(Css.totalCellClassName);
	}
}
customElements.define('total-cell',
		TotalCell, {
			extends: 'td'
		});


