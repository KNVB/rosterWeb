class RosterTableEventHandler
{
	constructor(cursorCells,rosterSchedulerTable,selectedRegion)
	{
		var self=this;
		this.cursorCells=cursorCells;
		this.fromTabKey=false;
		this.selectedRegion=selectedRegion;
		this.rosterSchedulerTable=rosterSchedulerTable;
		cursorCells.focus(function(event){
			console.log("cell focus",self.fromTabKey);
			if (self.selectedRegion.isClear())
			{	
				self.selectedRegion.startSelect(this);
				self.selectedRegion.endSelect();
				this.blur();
			}				
		});
		cursorCells.mousedown(function(event){
			event.preventDefault();
		//	console.log("mouse down");
			self.selectedRegion.startSelect(this);
		});
		cursorCells.mouseenter(function(event){
		//	console.log("mouse enter");
			self.selectedRegion.update(this);
			event.preventDefault();
		});
		cursorCells.click(function(event){
		//	console.log("mouse click");
			this.focus();			
		});
		cursorCells.keydown(function(event){
			self._handleKeyDownEvent(this,event);
		});
	}
	
	_handleKeyDownEvent(theCell,event)
	{
		event.stopPropagation();
		switch (event.which)
		{
			case  9://handle tab key
					this._handleTabKeyEvent(theCell,event);
					break;
			case 27://handle "Esc" key event
					this.selectedRegion.clear();
					event.stopPropagation();
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
			case 46://handle delete key event
					this._handleDeleteKeyEvent(event);
					break;		
			case 90:
					if(event.ctrlKey)
					{
						this._handleUndoEvent(event);
					}
					break;			
		}			
	}
	_handleArrowKeyEvent(event,yOffset,xOffset)
	{
		console.log("Arrow Key");
		if (!this.selectedRegion.isClear())
		{
			var newX=this.selectedRegion.minX+xOffset;
			var newY=this.selectedRegion.minY+yOffset;
			var cell=this.rosterSchedulerTable.getCell(newY,newX);
			if ($(cell).hasClass(this.targetCellClassName))
			{
				event.preventDefault();
				this.selectedRegion.startSelect(cell);
				this.selectedRegion.endSelect();
			}			
		}			
	}
	_handleDeleteKeyEvent(event)
	{
		if (!this.selectedRegion.isSingleCell())
		{
			event.preventDefault();
			this.selectedRegion.deleteContent();
			event.stopPropagation();
		}				
	}
	_handleTabKeyEvent(theCell,event)
	{
		//event.preventDefault();
		var nextCell,index;
		var row=theCell.parentElement;
		var newX,newY=row.rowIndex;
		console.log("Tab key");
		if (this.selectedRegion.selectedCellList.length>1)
		{
			if (event.shiftKey)
				newX=theCell.cellIndex-1
			else
				newX=theCell.cellIndex+1;	
			nextCell=this.rosterSchedulerTable.getCell(newY,newX);
			if ($.inArray(nextCell,this.selectedRegion.selectedCellList)==-1)
			{
				event.preventDefault();
				index=$.inArray(theCell,this.selectedRegion.selectedCellList);
				if (event.shiftKey)
					index--;
				else
					index++;
				if (index<0)
					index=this.selectedRegion.selectedCellList.length-1;
				else
				{	
					if (index==this.selectedRegion.selectedCellList.length)
					{
						index=0;
					}						
				}
				nextCell=this.selectedRegion.selectedCellList[index];
				nextCell.focus();
			}				
		}			
	}
	_handleUndoEvent(event)
	{
		if (!this.selectedRegion.isSingleCell())
		{
			event.preventDefault();
			event.stopPropagation();
			
			document.execCommand("undo",false,null);
			
			var selection = window.getSelection();
			var node=selection.focusNode;
			
			var text=node.textContent;	// This is the trick to remove the highlight
			node.textContent="";		// from content after the undo action.
			node.textContent=text;		//
			
			$(node).blur().focus();
			
		}
	}
}