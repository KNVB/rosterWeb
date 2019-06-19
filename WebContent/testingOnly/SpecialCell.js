class CursoredCell extends HTMLTableCellElement
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
customElements.define('cursored-cell',
		CursoredCell, {
			extends: 'td'
		});
class EditableCell extends BorderedAlignCenterCell
{
	constructor(rosterTable){
		super();
		var self=this;
		this.contentEditable="true";
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
class EditableShiftCell extends HTMLTableCellElement
{
	constructor(rosterTable,itoId){
		super(rosterTable);
		var self=this;
		this.contentEditable="true";
		this.firstInput=false;
		this.itoId=itoId;
		this.rosterTable=rosterTable;
		this.selectedRegion=rosterTable.selectedRegion;
		$(this).addClass(AdminCss.shiftCellClassName);
		$(this).blur(function(event){
			self.rosterTable.updateValue(this);
		});
	}
}
customElements.define('editable-shift-cell',
		EditableShiftCell, {
		extends: 'td'
		}
	);
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