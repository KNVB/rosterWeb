class CursorCellSelector
{
	constructor(rosterSchedulerTable,targetCellClassName)
	{
		var self=this;
		this.targetCellClassName=targetCellClassName;
		this.selectedRegion=new SelectedRegion(rosterSchedulerTable);
		this.selectionString="td."+targetCellClassName;
		this.rosterSchedulerTable=rosterSchedulerTable;
		
		$(this.selectionString).mousedown(function(event){
			event.preventDefault();
			self.selectedRegion.startSelect(this);
		});
		$(this.selectionString).mouseenter(function(event){
			self.selectedRegion.update(this);
			event.preventDefault();
		});
		$(this.selectionString).dblclick(function(event){
			this.focus();			
			event.preventDefault();
		});
		$("body").mouseup(function(event){
			event.preventDefault();
			self.selectedRegion.endSelect();
		});
		$("body").keydown(function(event){
			self._handleKeyDownEvent(event);
		});
	}
	_handleKeyDownEvent(event)
	{
		event.stopPropagation();
		switch (event.which)
		{
			case  9://handle tab key
					this._handleTabKeyEvent(event);
					break;
			case 27://handle "Esc" key event
					this.selectedRegion.clear();
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
		if (this.selectedRegion.isSingleCell())
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
		}				
	}
	_handleTabKeyEvent(event)
	{
		var tempX;
		if (event.shiftKey)
			tempX=this.selectedRegion.minX-1;
		else
			tempX=this.selectedRegion.minX+1;
		var cell=this.rosterSchedulerTable.getCell(this.selectedRegion.minY,tempX);
		
		if (!this.selectedRegion.isClear())
		{
			while (!$(cell).hasClass(this.targetCellClassName))
			{
				if (tempX<this.selectedRegion.minX)
				{
					cell=this.rosterSchedulerTable.getCell(this.selectedRegion.maxY,this.selectedRegion.maxX);
				}
			}
		}
/*		
	
		
		if (!this.selectedRegion.isClear() && 
				this.selectedRegion.isSingleCell() &&
				$(cell).hasClass("cursorCell"))
				)
		{
			event.preventDefault();
			this.selectedRegion.startSelect(cell);
			this.selectedRegion.endSelect();
		}*/
			
			
	}
	_handleUndoEvent(event)
	{
		if (!this.selectedRegion.isClear())
		{
			event.preventDefault();
			
			document.execCommand("undo",false,null);
			
			var selection = window.getSelection();
			var node=selection.focusNode;
			
			var text=node.textContent;
			
			node.textContent="";
			node.textContent=text;
			
			$(node).blur().focus();
			//$("td.shiftCell").blur().focus();
		}
	}
}