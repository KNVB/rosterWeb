class RosterTableEventHandler
{
	constructor(cursorCells,rosterSchedulerTable,selectedRegion)
	{
		var self=this;
		this.cursorCells=cursorCells;
		this.fromDblClick=false;
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
		cursorCells.dblclick(function(event){
			console.log("Double click="+$(this).is(":focus")+","+self.fromDblClick);
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
		var nextCell,index;
		var row=theCell.parentElement;
		var newX,newY=row.rowIndex;
		console.log("RosterTable Tab key");
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
				this.selectedRegion.startSelect(theCell);
				this.selectedRegion.endSelect();
			}
			else
			{
				this.selectedRegion.clear();
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