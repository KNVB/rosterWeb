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
		
		$("body").keydown(function(event){
			event.stopPropagation();
			self._handleKeyDownEvent(event);
		});
	}
	_handleArrowKeyEvent(event,yOffset,xOffset)
	{
		console.log("Arrow Key");
		if (!this.selectedRegion.isEmpty())
		{
			var theCell=this.rosterSchedulerTable.getCell(this.selectedRegion.minY,this.selectedRegion.minX);
			var index;
			var maxRowCount=Object.keys(this.rosterSchedulerTable.itoList).length*2;
			var orgIndex=$.inArray(theCell,this.cursorCells);
			var nextCell;
			
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
			console.log(newX,newY);
			index=newX+newY*Object.keys(this.rosterSchedulerTable.dateObjList).length;
			
			nextCell=this.cursorCells[index];
			event.preventDefault();
			this.selectedRegion.startSelect(nextCell);
			this.selectedRegion.endSelect();
		}			
	}
	_handleKeyDownEvent(event)
	{
		switch (event.which)
		{
			case 9:
					this._handleTabKeyEvent(event);
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