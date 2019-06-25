class EditableCellHandler
{
	constructor(cell,rosterSchedulerTable)
	{
		var self=this;
		this.cell=cell;
		this.cell.contentEditable="true";
		
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.selectedRegion=rosterTable.selectedRegion;
		
		$(cell).dblclick(function(event){
			event.preventDefault();
			console.log("double click");
			self.selectedRegion.setFocusCell(this);
		});
		$(cell).keydown(function(event){
			console.log("key down");
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
		$(cell).on("copy",function(event){
			event.preventDefault();
			self.selectedRegion.copy();
		});
		$(cell).on("paste",function(event){
			event.preventDefault();
			self.selectedRegion.paste();
		});
	}
	_handleArrowKeyEvent(event,yOffset,xOffset)
	{
		console.log("Arrow Key");
		this.selectedRegion.selectNextCell(event,yOffset,xOffset);
	}
	_handleEscKeyEvent(event,theCell)
	{
		this.selectedRegion.emptyCopiedRegion();
		this.selectedRegion.reSelect();
		event.preventDefault();
	}
	_handleKeyDownEvent(theCell,event)
	{
		switch (event.which)
		{
			case  9://handle tab key
					this._handleTabKeyEvent(event,theCell);
					break;
			case 13://handle "Enter" key event
					this._handleEnterKeyEvent(theCell);
					break;
			case 27://handle "Esc" key event
					this._handleEscKeyEvent(event,theCell);
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
/*					
			case 67:
					console.log("C key pressed");
					if (event.ctrlKey)
					{
						//handle Ctrl-C event
						console.log("Ctlr C key pressed");
						event.preventDefault();
						this.selectedRegion.copy();
					}
					break;
			case 86:
					if (event.ctrlKey)
					{
						//handle Ctrl-V event
						console.log("Ctlr V key pressed");
						event.preventDefault();
						this.selectedRegion.paste();
					}
					break;
			*/		
		}	
	}
	_handleEnterKeyEvent(theCell)
	{
		this.selectedRegion.selectCell(theCell);
		var yOffset,xOffset;
		event.preventDefault();
		if (event.shiftKey)
		{
			yOffset=-1;
			xOffset=0;
		}	
		else
		{
			yOffset=1;
			xOffset=0;
		}
		this._handleArrowKeyEvent(event,yOffset,xOffset);
	}
	_handleTabKeyEvent(event,theCell)
	{
		console.log("Tab key");
		var yOffset,xOffset;
		event.preventDefault();
		if (event.shiftKey)
		{
			yOffset=0;
			xOffset=-1;
		}	
		else
		{
			yOffset=0;
			xOffset=1;
		}
		if (this.selectedRegion.isSingleCell())
		{	
			this.selectedRegion.selectCell(theCell);
			this._handleArrowKeyEvent(event,yOffset,xOffset);
		}
		else
		{
			
			this.selectedRegion.selectNextCellInSelectedRegion(theCell,yOffset,xOffset);
		}
	}	
}