const UP=1,DOWN=2,RIGHT=3,LEFT=4,SAME_LEVEL=0;
class ShiftCellEventHandler
{
	constructor(table)
	{
		this.selectedCell={};
		this.table=table;
		this.inSelectMode=false;
		this.selectCurrentRowIndex;	
		this.selectCurrentCellIndex;				
		this.selectPreviousRowIndex;	
		this.selectPreviousCellIndex;
		this.selectStartRowIndex;	
		this.selectStartCellIndex;	
	}
	handleEvent(cell,event)
	{
		event.stopPropagation();
		event.preventDefault();
		//var row=cell.parentElement;
		//console.log(this,cell,event.type);
		var row=cell.parentElement;
		
		switch(event.type)
		{
			/*case "click"		:this._clickEventHandler(cell);
								 break;*/
			case "mousedown"	:this._mouseDownEventHandler(cell,row.rowIndex,cell.cellIndex);
								 break;
			case "mouseout"		:this._mouseOutEventHandler(cell,row.rowIndex,cell.cellIndex);
			  					break;		
		    case "mouseenter"	:this._mouseEnterEventHandler(cell,row.rowIndex,cell.cellIndex);
								 break;						
					
			case "mouseup"		:this._mouseUpEventHandler(cell);
								 break;
		}
	}
//===========================================================================
//		Private Method
	_mouseDownEventHandler(theCell,rowIndex,cellIndex)
	{
		var previousClickedCell;
		var tempPositionString,tempArray;
		var positionString=rowIndex+"_"+cellIndex;
		this.selectStartRowIndex=rowIndex;	
		this.selectStartCellIndex=cellIndex;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		$(theCell).addClass("selectCellBorderRight");
		$(theCell).addClass("selectCellBorderTop");
		$(theCell).addClass("selectCellBorderBottom");
		$(theCell).addClass("selectCellBorderLeft");
		console.log("mouse down event triggered.positionString="+positionString);
		for (var tempPositionString in this.selectedCell)
		{
			if (tempPositionString!=positionString)
			{
				previousClickedCell=this.selectedCell[tempPositionString];
				$(previousClickedCell).removeClass("selectCellBorderRight");
				$(previousClickedCell).removeClass("selectCellBorderTop");
				$(previousClickedCell).removeClass("selectCellBorderBottom");
				$(previousClickedCell).removeClass("selectCellBorderLeft");
				delete this.selectedCell[tempPositionString];
			}	
		}	
		this.selectedCell[positionString]=theCell;
		this.inSelectMode=true;
	}
	_mouseOutEventHandler(theCell,rowIndex,cellIndex)
	{
		var positionString=rowIndex+"_"+cellIndex;
		if (this.inSelectMode)
		{	
			console.log("mouse out event triggered.positionString="+positionString);
			this.selectPreviousRowIndex=rowIndex;	
			this.selectPreviousCellIndex=cellIndex;
		}
	}
	_mouseEnterEventHandler(theCell,rowIndex,cellIndex)
	{
		var positionString=rowIndex+"_"+cellIndex;
		var startCellHorizontalDirection,startCellVerticalDirection;
		var horizontalActionDirection,verticalActionDirection; //Expand or contract direction
		if (this.inSelectMode)
		{
			console.log("mouse enter event triggered.positionString="+positionString);
			console.log(positionString in this.selectedCell);
			var action={}
			if (rowIndex<this.selectPreviousRowIndex)
				action["verticalActionDirection"]=UP;
			else
				if (rowIndex>this.selectPreviousRowIndex)
					action["verticalActionDirection"]=DOWN;
				else
					action["verticalActionDirection"]=SAME_LEVEL;
			if (cellIndex<this.selectPreviousCellIndex)
				action["horizontalActionDirection"]=LEFT;
			else
				if (cellIndex>this.selectPreviousCellIndex)
					action["horizontalActionDirection"]=RIGHT;
				else
					action["horizontalActionDirection"]=SAME_LEVEL;
			if (this.selectStartRowIndex<rowIndex)
				action["startCellVerticalDirection"]=UP;
			else
				if (this.selectStartRowIndex>rowIndex)
					action["startCellVerticalDirection"]=DOWN;
				else
					action["startCellVerticalDirection"]=SAME_LEVEL;
				
			if (this.selectStartCellIndex<cellIndex)
				action["startCellHorizontalDirection"]=LEFT;
			else
				if (this.selectStartCellInde>cellIndex)
					action["startCellHorizontalDirection"]=RIGHT;
				else
					action["startCellHorizontalDirection"]=SAME_LEVEL;
			if (positionString in this.selectedCell)
			{
			//	this._contractSelect(theCell,rowIndex,cellIndex);
			}	
			else
			{
				this._expandSelect(action,theCell,rowIndex,cellIndex);
				/*	this._normalExpand(theCell,rowIndex,cellIndex);*/
				this.selectedCell[positionString]=theCell;
			}

		}
	}
	_expandSelect(action,theCell,rowIndex,cellIndex)
	{
		var previousPositionString=this.selectPreviousRowIndex+"_"+this.selectPreviousCellIndex;
		var previousClickedCell= this.selectedCell[previousPositionString];
		//console.log(action,theCell,rowIndex,cellIndex);
		switch(action["verticalActionDirection"])
		{
			case UP: $(theCell).addClass("selectCellBorderTop");
					 $(previousClickedCell).removeClass("selectCellBorderTop");
					 if ((action["startCellHorizontalDirection"]!=SAME_LEVEL)&& (action["startCellVerticalDirection"]!=SAME_LEVEL))
					 {
						 for (var tempPositionString in this.selectedCell)
						 {
								previousClickedCell= this.selectedCell[tempPositionString];
								$(previousClickedCell).removeClass("selectCellBorderTop");
						 }
					 }
					 break;
			case DOWN:
						$(theCell).addClass("selectCellBorderBottom");
						$(previousClickedCell).removeClass("selectCellBorderBottom");
						if ((action["startCellHorizontalDirection"]!=SAME_LEVEL)&& (action["startCellVerticalDirection"]!=SAME_LEVEL))
						{
							for (var tempPositionString in this.selectedCell)
							{
								previousClickedCell= this.selectedCell[tempPositionString];
								$(previousClickedCell).removeClass("selectCellBorderBottom");
							}
						}
						break;
			case SAME_LEVEL:
							if ((action["startCellHorizontalDirection"]!=SAME_LEVEL)&& (action["startCellVerticalDirection"]!=SAME_LEVEL))
							{
								if (action["startCellVerticalDirection"]==UP)
									$(theCell).addClass("selectCellBorderBottom");
								else
									$(theCell).addClass("selectCellBorderTop");
							}
							else
							{
								$(theCell).addClass("selectCellBorderBottom");
								$(theCell).addClass("selectCellBorderTop");
							}
							break;
		}
		switch (action["horizontalActionDirection"])
		{
			case LEFT:	$(theCell).addClass("selectCellBorderLeft");
						$(previousClickedCell).removeClass("selectCellBorderLeft");
						if ((action["startCellHorizontalDirection"]!=SAME_LEVEL)&& (action["startCellVerticalDirection"]!=SAME_LEVEL))
						{
							for (var tempPositionString in this.selectedCell)
							{
								previousClickedCell= this.selectedCell[tempPositionString];
								$(previousClickedCell).removeClass("selectCellBorderLeft");
							}
						} 
						break;
			case RIGHT:
						$(theCell).addClass("selectCellBorderRight");
						$(previousClickedCell).removeClass("selectCellBorderRight");
						if ((action["startCellHorizontalDirection"]!=SAME_LEVEL)&& (action["startCellVerticalDirection"]!=SAME_LEVEL))
						{
							for (var tempPositionString in this.selectedCell)
							{
								previousClickedCell= this.selectedCell[tempPositionString];
								$(previousClickedCell).removeClass("selectCellBorderRight");
							}
						}
						break;
						
			case SAME_LEVEL:
				if ((action["startCellHorizontalDirection"]!=SAME_LEVEL)&& (action["startCellVerticalDirection"]!=SAME_LEVEL))
				{
					if (action["startCellHorizontalDirection"]==LEFT)
						$(theCell).addClass("selectCellBorderRight");
					else
						$(theCell).addClass("selectCellBorderLeft");
				}
				else
				{
					$(theCell).addClass("selectCellBorderRight");
					$(theCell).addClass("selectCellBorderLeft");
				}
				break;			
		}
	}
/*	_contractSelect(theCell,rowIndex,cellIndex)
	{
		var previousPositionString=this.selectPreviousRowIndex+"_"+this.selectPreviousCellIndex;
		var previousClickedCell= this.selectedCell[previousPositionString];
		
		if (rowIndex<this.selectPreviousRowIndex)
		{
			$(theCell).addClass("selectCellBorderBottom");
			$(previousClickedCell).removeClass("selectCellBorderBottom");
		}
		else
		{
			if (rowIndex>this.selectPreviousRowIndex)
			{
				$(theCell).addClass("selectCellBorderTop");
				$(previousClickedCell).removeClass("selectCellBorderTop");
			}
			else
			{
				$(theCell).addClass("selectCellBorderTop");
				$(theCell).addClass("selectCellBorderBottom");
			}	
		}
		if (cellIndex<this.selectPreviousCellIndex)
		{
			$(theCell).addClass("selectCellBorderRight");
			$(previousClickedCell).removeClass("selectCellBorderRight");
		}
		else
		{
			if (cellIndex>this.selectPreviousCellIndex)
			{
				$(theCell).addClass("selectCellBorderLeft");
				$(previousClickedCell).removeClass("selectCellBorderLeft");
			}
			else
			{
				$(theCell).addClass("selectCellBorderLeft");
				$(theCell).addClass("selectCellBorderRight");
			}	
		}
		
		$(previousClickedCell).removeClass("selectCellBorderRight");
		$(previousClickedCell).removeClass("selectCellBorderTop");
		$(previousClickedCell).removeClass("selectCellBorderBottom");
		$(previousClickedCell).removeClass("selectCellBorderLeft");
		delete this.selectedCell[previousPositionString];
	}	
	
	_normalExpand(theCell,rowIndex,cellIndex)
	{
		var previousPositionString=this.selectPreviousRowIndex+"_"+this.selectPreviousCellIndex;
		var previousClickedCell= this.selectedCell[previousPositionString];
		if (rowIndex<this.selectPreviousRowIndex)
		{
			$(theCell).addClass("selectCellBorderTop");
			$(previousClickedCell).removeClass("selectCellBorderTop");
			if((this.selectStartRowIndex!=rowIndex) && (this.selectStartCellIndex!=cellIndex))
			{
				for (var tempPositionString in this.selectedCell)
				{
					previousClickedCell= this.selectedCell[tempPositionString];
					$(previousClickedCell).removeClass("selectCellBorderTop");
				}
			}	
		}
		else
		{
			if (rowIndex>this.selectPreviousRowIndex)
			{
				$(theCell).addClass("selectCellBorderBottom");
				$(previousClickedCell).removeClass("selectCellBorderBottom");
				if((this.selectStartRowIndex!=rowIndex) && (this.selectStartCellIndex!=cellIndex))
				{
					for (var tempPositionString in this.selectedCell)
					{
						previousClickedCell= this.selectedCell[tempPositionString];
						$(previousClickedCell).removeClass("selectCellBorderBottom");
					}
				}
			}
			else
			{
				if((this.selectStartRowIndex!=rowIndex) && (this.selectStartCellIndex!=cellIndex))
				{
					if (this.selectStartRowIndex<rowIndex)
						$(theCell).addClass("selectCellBorderBottom");
					else
						$(theCell).addClass("selectCellBorderTop");
				}
				else
				{
					$(theCell).addClass("selectCellBorderBottom");
					$(theCell).addClass("selectCellBorderTop");
				}
			}	
		}
		if (cellIndex<this.selectPreviousCellIndex)
		{
			$(theCell).addClass("selectCellBorderLeft");
			$(previousClickedCell).removeClass("selectCellBorderLeft");
			if((this.selectStartRowIndex!=rowIndex) && (this.selectStartCellIndex!=cellIndex))
			{
				for (var tempPositionString in this.selectedCell)
				{
					previousClickedCell= this.selectedCell[tempPositionString];
					$(previousClickedCell).removeClass("selectCellBorderLeft");
				}
			}
		}
		else
		{
			if (cellIndex>this.selectPreviousCellIndex)
			{
				$(theCell).addClass("selectCellBorderRight");
				$(previousClickedCell).removeClass("selectCellBorderRight");
				if((this.selectStartRowIndex!=rowIndex) && (this.selectStartCellIndex!=cellIndex))
				{
					for (var tempPositionString in this.selectedCell)
					{
						previousClickedCell= this.selectedCell[tempPositionString];
						$(previousClickedCell).removeClass("selectCellBorderRight");
					}
				}
			}
			else
			{
				if((this.selectStartRowIndex!=rowIndex) && (this.selectStartCellIndex!=cellIndex))
				{
					if (this.selectStartCellIndex<cellIndex)
						$(theCell).addClass("selectCellBorderRight");
					else
						$(theCell).addClass("selectCellBorderLeft");
				}
				else
				{
					$(theCell).addClass("selectCellBorderRight");
					$(theCell).addClass("selectCellBorderLeft");
				}
			}	
		}
		
	}*/
	_mouseUpEventHandler(theCell)
	{
		this.inSelectMode=false;
	}
	_getCell(rowIndex,cellIndex)
	{
		var row=this.table.rows[rowIndex];
		var cell=row.cells[cellIndex];
		return cell;
	}
	
}