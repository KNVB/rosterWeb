class EditableCellHandler
{
	constructor(cell,rosterSchedulerTable)
	{
		var self=this;
		this.cell=cell;
		this.cell.contentEditable="true";
		this.firstInput=false;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.selectedRegion=rosterTable.selectedRegion;
		
		$(cell).click(function(event){
			self.select();
			console.log("click");
		});
		$(cell).dblclick(function(event){
			event.preventDefault();
			var sel = window.getSelection();
			this.focus();
	
			sel.collapse(this.firstChild, 1);
			console.log("double click");
			self.firstInput=false;
		});
	
		$(cell).keydown(function(event){
			self._handleKeyDownEvent(this,event);
		});
		$(cell).mousedown(function(event){
			event.preventDefault();
			console.log("mouse down");
			self.selectedRegion.startSelect(this);
		});
		$(cell).mouseenter(function(event){
			self.selectedRegion.update(this);
			console.log("mouse enter");
			event.preventDefault();
		});
	}
	_handleArrowKeyEvent(event,yOffset,xOffset)
	{
		console.log("Arrow Key");
		console.log(`this.firstInput=${this.firstInput}`);
		
		if (this.firstInput)
		{	
			event.preventDefault();
			var nextCell=this.rosterSchedulerTable.getNextCellInRosterTable(yOffset,xOffset);
			this.selectedRegion.startSelect(nextCell);
			this.selectedRegion.endSelect();
			nextCell.click();
		}
	}
	_handleEscKeyEvent(theCell)
	{
		this.select();
	}
	_handleKeyDownEvent(theCell,event)
	{
		switch (event.which)
		{
			case  9://handle tab key
					this._handleTabKeyEvent(event);
					break;
			case 27://handle "Esc" key event
					this._handleEscKeyEvent(theCell);
					break;
			case 37://handle left arrow key event
					this._handleArrowKeyEvent(event,0,-1);
					break;
			case 38://handle up arrow key event
					this._handleArrowKeyEvent(event,-1,0);
					break;
			case 39://handle right arrow key event
					this._handleArrowKeyEvent(event,0,1);
					break;

			case 13://handle "Enter" key event	
					this.select();
			case 40://handle down arrow key event
					this._handleArrowKeyEvent(event,1,0);
					break;		
		}	
	}
	_handleTabKeyEvent(event)
	{
		console.log("Tab key");
		console.log(`this.firstInput=${this.firstInput}`);
		if (event.shiftKey)
			this._handleArrowKeyEvent(event,0,-1);
		else
			this._handleArrowKeyEvent(event,0,1);
	}
	select()
	{
		console.log("select Method called");
		console.log(`this.firstInput=${this.firstInput}`);
		event.preventDefault();
		var range = document.createRange();
		var sel = window.getSelection();
		range.selectNodeContents(this.cell);
	    sel.removeAllRanges();
	    sel.addRange(range);
	    this.firstInput=true;
	}	
}