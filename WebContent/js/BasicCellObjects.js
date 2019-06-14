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
class CursorCell extends HTMLTableCellElement
{
	constructor(rosterTable) {
		super();
		var self=this;
		
		$(this).addClass(Css.cursorCellClassName);
		$(this).mouseover(function(){
			rosterTable.markCoorindate(this);
		});
		$(this).mouseout(function(){
			rosterTable.unMarkCoorindate(this);
		});
	}
}
customElements.define('cursor-cell',
		CursorCell, {
			extends: 'td'
		});
class EditableCell extends HTMLTableCellElement
{
	constructor(rosterTable,itoId){
		super(rosterTable);
		var self=this;
		this.contentEditable="true";
		this.firstInput=false;
		this.itoId=itoId;
		this.rosterTable=rosterTable;
		this.selectedRegion=rosterTable.selectedRegion;

		$(this).click(function(event){
				this.select();
				console.log("click");
				self.firstInput=true;
			});
		$(this).dblclick(function(event){
			event.preventDefault();
			var sel = window.getSelection();
			this.focus();
			
			sel.collapse(this.firstChild, 1);
			console.log("double click");
		});
		
		$(this).focus(function(event){
			self.firstInput=false;
		});
		$(this).keydown(function(event){
			self._handleKeyDownEvent(this,event);
		});
		$(this).mousedown(function(event){
			event.preventDefault();
			self.selectedRegion.startSelect(this);
		});
		$(this).mouseenter(function(event){
			self.selectedRegion.update(this);
			event.preventDefault();
		});
	}
	_handleKeyDownEvent(theCell,event)
	{
		switch (event.which)
		{
			case  9://handle tab key
					this._handleTabKeyEvent(event);
					break;
			case 27://handle "Esc" key event
					this._handleEscKeyEvent();
					break;
			default:if (this.firstInput)
					{
						
					}
					else
					{
						
					}
					break;
		}	
	}

	select()
	{
		event.preventDefault();
		var range = document.createRange();
	    range.selectNodeContents(this);
	    var sel = window.getSelection();
	    sel.removeAllRanges();
	    sel.addRange(range);
	}
}
customElements.define('editable-cell',
		EditableCell, {
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
	constructor(rosterTable){
		super();
		$(this).addClass(Css.rosterMonthSelectCellClassName);
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
customElements.define('roster-month-select-cell', 
		RosterMonthSelectCell,{
			extends: 'td'
		});
class ShiftCell extends BorderedAlignCenterCell
{
	constructor(rosterTable) {
		super();
		var self=this;
		console.log(rosterTable);
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


