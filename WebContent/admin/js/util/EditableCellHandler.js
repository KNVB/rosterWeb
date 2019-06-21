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
		console.log("Arrow Key");
		this.selectedRegion.selectNextCell(event,yOffset,xOffset);
	}
	
	_handleKeyDownEvent(theCell,event)
	{
		switch (event.which)
		{
			case  9://handle tab key
					this._handleTabKeyEvent(event,theCell);
					break;
			
			case 27://handle "Esc" key event
					this.selectedRegion.selectCell(theCell);
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
					this.selectedRegion.selectCell(theCell);
			case 40://handle down arrow key event
					this._handleArrowKeyEvent(event,1,0);
					break;
			case 67:
					if (event.ctrlKey)
					{
						//handle Ctrl-C event
						event.preventDefault();
						this.selectedRegion.copy();
					}
					break;
			case 86:
					if (event.ctrlKey)
					{
						//handle Ctrl-V event
						event.preventDefault();
					}
					break;
					
		}	
	}
	_handleTabKeyEvent(event,theCell)
	{
		console.log("Tab key");
		console.log(`this.firstInput=${this.firstInput}`);
		var yOffset,xOffset;
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
			this._handleArrowKeyEvent(event,yOffset,xOffset);
		else
		{
			event.preventDefault();
			this.selectedRegion.selectNextCellInSelectedRegion(theCell,yOffset,xOffset);
		}
	}	
}