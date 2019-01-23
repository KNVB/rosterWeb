class CursorCellSelector
{
	constructor(rosterSchedulerTable,targetCellClassName)
	{
		var self=this;
		this.selectedRegion=new SelectedRegion(rosterSchedulerTable);
		this.selectionString="td."+targetCellClassName;
		this.rosterSchedulerTable=rosterSchedulerTable;
		
		$(this.selectionString).mousedown(function(event){
			event.preventDefault();
			self.selectedRegion.select(this);
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
			if ($(cell).hasClass("cursorCell"))
			{
				event.preventDefault();
				this.selectedRegion.select(cell);
				this.selectedRegion.endSelect();
			}			
		}			
	}
	_handleDeleteKeyEvent(event)
	{
		if (!this.selectedRegion.isClear())
		{
			event.preventDefault();
			var cell,minCell,maxCell;
			var sel = window.getSelection();
			var range = document.createRange();
			for (var i=this.selectedRegion.minX;i<=this.selectedRegion.maxX;i++)
			{
				for (var j=this.selectedRegion.minY;j<=this.selectedRegion.maxY;j++)
				{
					cell=this.rosterSchedulerTable.getCell(j,i);
					if ($(cell).hasClass("cursorCell"))
					{
						//$(cell).empty().blur(); //<==this is old delete method.
						sel.removeAllRanges();
						range.selectNodeContents(cell);
						sel.addRange(range);
						document.execCommand("delete",false,null);
						$(cell).blur();
					}
					else
					{
						event.preventDefault();
					}	
				}	
			}
			//this.selectedRegion.redraw();
			//this.selectedRegion.clear();
		}					
	}
	_handleTabKeyEvent(event)
	{
		var tempX;
		if (!this.selectedRegion.isClear())
		{
			event.preventDefault();
			if (event.shiftKey)
				tempX=this.selectedRegion.minX-1;
			else
				tempX=this.selectedRegion.minX+1;
			var cell=this.rosterSchedulerTable.getCell(this.selectedRegion.minY,tempX);
			if ($(cell).hasClass("cursorCell"))
			{
				this.selectedRegion.select(cell);
				this.selectedRegion.endSelect();
			}
		}	
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
			$("td.shiftCell").blur();
		}
	}
}