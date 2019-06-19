class EditableCellHandler
{
	constructor(cell)
	{
		var self=this;
		this.cell=cell;
		this.cell.contentEditable="true";
		this.firstInput=false;
		this.rosterSchedulerTable=cell.rosterTable;
		this.selectedRegion=rosterTable.selectedRegion;
		
		$(cell).click(function(event){
			self.select();
			console.log("click");
			self.firstInput=true;
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
			self.selectedRegion.startSelect(this);
		});
		$(cell).mouseenter(function(event){
			self.selectedRegion.update(this);
			event.preventDefault();
		});
	}
	_handleArrowKeyEvent(event,yOffset,xOffset)
	{
		console.log("Body Arrow Key");
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
			case 37://handle left arrow key event
					this._handleArrowKeyEvent(event,0,-1);
					break;
			case 38://handle up arrow key event
					this._handleArrowKeyEvent(event,-1,0);
					break;
			case 39://handle right arrow key event
					this._handleArrowKeyEvent(event,0,1);
					break;
			case 40://handle down arrow key event
					this._handleArrowKeyEvent(event,1,0);
					break;		
		}	
	}
	_handleTabKeyEvent(event)
	{
		console.log("Body Tab key");
		
		if (event.shiftKey)
			this._handleArrowKeyEvent(event,0,-1);
		else
			this._handleArrowKeyEvent(event,0,1);
	}
	select()
	{
		event.preventDefault();
		var range = document.createRange();
	    range.selectNodeContents(this.cell);
	    var sel = window.getSelection();
	    sel.removeAllRanges();
	    sel.addRange(range);
	}	
}