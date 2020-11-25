class CursorCellSelector
{
	constructor (cursorCells,rosterSchedulerTable)
	{	
		cursorCells.unbind();
		$(document.body).unbind();
		var self=this;
		this.cursorCells=cursorCells;
		this.selectedRegion=new SelectedRegion(rosterSchedulerTable);
		this.rosterSchedulerTable=rosterSchedulerTable;
		$("body").keydown(function(event){
			event.stopPropagation();
			self._handleKeyDownEvent(event);
		});
		$(document).mouseup(function(event){
			event.preventDefault();
			self.selectedRegion.endSelect();
		});
		
		$(this.cursorCells).dblclick(function(event){
			event.preventDefault();
			var inputBox=$(this).find("input[type='text']")[0];
			$(inputBox).focus();
			inputBox.setSelectionRange(1,1);
		});
		$(this.cursorCells).mousedown(function(event){
			event.preventDefault();
			self.selectedRegion.startSelect(this);
		});
		$(this.cursorCells).mouseenter(function(event){
			self.selectedRegion.update(this);
			event.preventDefault();
		});
	}
	getNextCellInRosterTable(yOffset,xOffset)
	{
		var theCell=this.rosterSchedulerTable.getCell(this.selectedRegion.minY,this.selectedRegion.minX);
		var index;
		var maxRowCount=Object.keys(this.rosterSchedulerTable.itoList).length*2;
		var orgIndex=$.inArray(theCell,this.cursorCells);
		var nextCell;
		
		if (this.selectedRegion.isSingleCell())
		{
			var newX=orgIndex % Object.keys(this.rosterSchedulerTable.dateObjList).length;
			var newY=(orgIndex-newX)/Object.keys(this.rosterSchedulerTable.dateObjList).length;
			
			newX+=xOffset;
			if (newX>=Object.keys(this.rosterSchedulerTable.dateObjList).length)
				newX=0;
			else
				if (newX<0)
					newX=Object.keys(this.rosterSchedulerTable.dateObjList).length-1;
			newY+=yOffset;
			if (newY>=maxRowCount)
				newY=0;
			else
				if (newY<0)
					newY=maxRowCount-1;
			//console.log(newX,newY);
			index=newX+newY*Object.keys(this.rosterSchedulerTable.dateObjList).length;
			
			nextCell=this.cursorCells[index];
			return nextCell;
		}
	}
	_handleArrowKeyEvent(event,yOffset,xOffset)
	{
		console.log("Body Arrow Key");
		if (this.selectedRegion.isSingleCell())
		{
			event.preventDefault();
			var nextCell=this.getNextCellInRosterTable(yOffset,xOffset);
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
						theCell=this.getNextCellInRosterTable(1,0);
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
					console.log("Esc key event in web page.");
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
			case 67:
					if (event.ctrlKey)
					{	
						this.selectedRegion.copy(); //handle Ctrl-C event
						event.preventDefault();
					}
					break;
			case 86:
					if (event.ctrlKey)
					{	
						event.preventDefault();
						this.selectedRegion.paste(); //handle Ctrl-V event
					}
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
}
