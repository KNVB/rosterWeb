class RosterTableEventHandler
{
	constructor(cursorCells,rosterSchedulerTable,selectedRegion)
	{
		var self=this;
		this.cursorCells=cursorCells;
		this.selectedRegion=selectedRegion;
		this.rosterSchedulerTable=rosterSchedulerTable;
	
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
		/*cursorCells.dblclick(function(event){
			console.log("Double click");
			this.focus();			
		});*/
		cursorCells.keydown(function(event){
			self._handleKeyDownEvent(this,event);
		});
		cursorCells.click(function(event){
			console.log("On click");
			this.focus();			
		});
		
	}
	destroy()
	{
		$(this.cursorCells).unbind();
	}
	_handleKeyDownEvent(theCell,event)
	{
		var index,orgIndex;
		event.stopPropagation();
		switch (event.which)
		{
			case  9://handle tab key
					this._handleTabKeyEvent(theCell,event);
					break;		
			case 13://handle "Enter" key event
					orgIndex=$.inArray(theCell,this.cursorCells);
					if (this.selectedRegion.isSingleCell())
					{
						theCell=this.rosterSchedulerTable.getNextCellInRosterTable(1,0);
						this.selectedRegion.startSelect(theCell);
						this.selectedRegion.endSelect();
					}
					else
					{	
						var nextCell=this.rosterSchedulerTable.getNextCellInSelectedRegion(theCell,1,0);
						nextCell.focus();
					}
					event.preventDefault();
					break;
			case 27://handle "Esc" key event
					theCell.blur();
					event.stopPropagation();
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
		var index;
		var nextCell=null,newX,newY;
		var row=theCell.parentElement;
		newY=row.rowIndex;
		console.log("RosterTable Tab key");
		if (this.selectedRegion.selectedCellList.length>1)
		{
			event.preventDefault();
			if (event.shiftKey)
				nextCell=this.rosterSchedulerTable.getNextCellInSelectedRegion(theCell,0,-1);
			else
				nextCell=this.rosterSchedulerTable.getNextCellInSelectedRegion(theCell,0,1);
			nextCell.focus();
		}
		else
		{
			index=$.inArray(theCell,this.cursorCells);
			if (event.shiftKey)
				index--;
			else
				index++;
			if ((index>0) && (index<this.cursorCells.length))
			{
				event.preventDefault();
				nextCell=this.cursorCells[index];
				this.selectedRegion.startSelect(nextCell);
				this.selectedRegion.endSelect();
				nextCell.focus();
			}
			else
			{
				this.selectedRegion.empty();
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