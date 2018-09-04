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
		if (this.inSelectMode)
		{
			console.log("mouse enter event triggered.positionString="+positionString);
			console.log(positionString in this.selectedCell);
			if (positionString in this.selectedCell)
			{
				this._contractSelect(theCell,rowIndex,cellIndex);
			}	
			else
			{
				this.selectedCell[positionString]=theCell;
				this._expandSelect(theCell,rowIndex,cellIndex);
			}

		}
	}
	_contractSelect(theCell,rowIndex,cellIndex)
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
	_expandSelect(theCell,rowIndex,cellIndex)
	{
		var previousPositionString=this.selectPreviousRowIndex+"_"+this.selectPreviousCellIndex;
		var previousClickedCell= this.selectedCell[previousPositionString];
		if (rowIndex<this.selectPreviousRowIndex)
		{
			$(theCell).addClass("selectCellBorderTop");
			$(previousClickedCell).removeClass("selectCellBorderTop");
		}
		else
		{
			if (rowIndex>this.selectPreviousRowIndex)
			{
				$(theCell).addClass("selectCellBorderBottom");
				$(previousClickedCell).removeClass("selectCellBorderBottom");
			}
			else
			{
				$(theCell).addClass("selectCellBorderTop");
				$(theCell).addClass("selectCellBorderBottom");
			}	
		}
		if (cellIndex<this.selectPreviousCellIndex)
		{
			$(theCell).addClass("selectCellBorderLeft");
			$(previousClickedCell).removeClass("selectCellBorderLeft");
		}
		else
		{
			if (cellIndex>this.selectPreviousCellIndex)
			{
				$(theCell).addClass("selectCellBorderRight");
				$(previousClickedCell).removeClass("selectCellBorderRight");
			}
			else
			{
				$(theCell).addClass("selectCellBorderLeft");
				$(theCell).addClass("selectCellBorderRight");
			}	
		}
	}
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