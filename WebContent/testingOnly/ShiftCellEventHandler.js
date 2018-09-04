class ShiftCellEventHandler
{
	constructor(table)
	{
		this.previousDx=0;
		this.previousDy=0;
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
		console.log("mouse down event triggered.positionString="+positionString);
		this.previousDx=0;
		this.previousDy=0;

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
		var dDx,dDy;
		var newDy=(rowIndex-this.selectPreviousRowIndex);
		var newDx=(cellIndex-this.selectPreviousCellIndex);
		var positionString=rowIndex+"_"+cellIndex;
		if (this.inSelectMode)
		{
			dDx=newDx-this.previousDx;
			dDy=newDy-this.previousDy;
			console.log("mouse enter event triggered.positionString="+positionString);
			console.log("newDx="+newDx+",newDy="+newDy+",changeX="+dDx+",changeY="+dDy);

			this.previousDy=newDy;
			this.previousDx=newDx;	
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