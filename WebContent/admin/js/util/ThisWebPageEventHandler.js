class ThisWebPageEventHandler
{
	constructor(cursorCells,rosterSchedulerTable,selectedRegion)
	{
		var self=this;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.cursorCells=cursorCells;
		this.selectedRegion=selectedRegion;
		$("body").mouseup(function(event){
			event.preventDefault();
			if (self.selectedRegion.inSelectMode)
				self.selectedRegion.endSelect();
		});
		$("body").on("copy",function(event){
			event.preventDefault();
			event.stopPropagation();
			console.log("Copy event");
			var clipboard=event.originalEvent.clipboardData;
			self.selectedRegion.copyToClipBoard(clipboard);
		});
		$("body").on("paste", function(event){
			console.log("Paste event");
			event.stopPropagation();
			event.preventDefault();
			var clipboard=event.originalEvent.clipboardData;
			self.selectedRegion.pasteFromClipBoard(clipboard);
		});
		$("body").keydown(function(event){
			event.stopPropagation();
			self._handleKeyDownEvent(event);
		});
	}
	_handleArrowKeyEvent(event,yOffset,xOffset)
	{
		console.log("Body Arrow Key");
		if (this.selectedRegion.isSingleCell())
		{
			event.preventDefault();
			var nextCell=this.rosterSchedulerTable.getNextCellInRosterTable(yOffset,xOffset);
			this.selectedRegion.startSelect(nextCell);
			this.selectedRegion.endSelect();
		}			
	}
	_handleKeyDownEvent(event)
	{
		var index,orgIndex,theCell;
		switch (event.which)
		{
			case 9://handle tab key
					this._handleTabKeyEvent(event);
					break;
			case 13://handle enter key
					if (this.selectedRegion.isSingleCell())
					{
						theCell=this.rosterSchedulerTable.getNextCellInRosterTable(1,0);
						this.selectedRegion.startSelect(theCell);
						this.selectedRegion.endSelect();
					}
					event.preventDefault();
					break;
			case 16://handle shift key
			case 17://handle Ctrl key
			case 18://handle alt key	
					break;		
			case 27://handle "Esc" key event
					this.selectedRegion.empty();
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
			default:
					if (this.selectedRegion.isSingleCell())
					{
						theCell=this.rosterSchedulerTable.getCell(this.selectedRegion.minY,this.selectedRegion.minX);
						if (!(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey))
							$(theCell).text("").focus();
					}	
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
}