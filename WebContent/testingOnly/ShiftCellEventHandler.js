class ShiftCellEventHandler
{
	constructor(table)
	{
		this.table=table;
		this.inSelectMode=false;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		this.selectStartRowIndex=-1;	
		this.selectStartCellIndex=-1;
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
		this._clearPreviousBorder(rowIndex,cellIndex);
		$(theCell).addClass("selectCellBorderRight");
		$(theCell).addClass("selectCellBorderTop");
		$(theCell).addClass("selectCellBorderBottom");
		$(theCell).addClass("selectCellBorderLeft");
		console.log("mouse down event triggered.positionString="+(rowIndex+"_"+cellIndex));
		console.log("selectStartRowIndex="+this.selectStartRowIndex+",selectStartCellIndex="+this.selectStartCellIndex);
		this.selectStartRowIndex=rowIndex;	
		this.selectStartCellIndex=cellIndex;
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
		var minX,maxX,minY,maxY,cell,i;
		if (this.inSelectMode)
		{
			var positionString=rowIndex+"_"+cellIndex;
			//console.log("mouse enter event triggered.positionString="+positionString);
			
			this._clearPreviousBorder();
			if (this.selectStartCellIndex>cellIndex)
			{
				minX=cellIndex;
				maxX=this.selectStartCellIndex;
			}
			else
			{
				if (this.selectStartCellIndex<cellIndex)
				{
					maxX=cellIndex;
					minX=this.selectStartCellIndex;
				}
				else
				{
					maxX=cellIndex;
					minX=cellIndex;
				}	
			}	
			if (this.selectStartRowIndex<rowIndex)	
			{
				minY=this.selectStartRowIndex;
				maxY=rowIndex;
			}
			else
			{
				if (this.selectStartRowIndex>rowIndex)	
				{
					minY=rowIndex;
					maxY=this.selectStartRowIndex;
				}
				else
				{
					maxY=this.selectStartRowIndex;
					minY=this.selectStartRowIndex;
				}	
			}
			console.log("minX="+minX+",minY="+minY+",maxX="+maxX+",maxY="+maxY+",startRowIndex="+this.selectStartRowIndex+",startCellIndex="+this.selectStartCellIndex);
			cell=this._getCell(minY,minX);
			$(cell).addClass("selectCellBorderTop");
			$(cell).addClass("selectCellBorderLeft");
			
			cell=this._getCell(minY,maxX);
			$(cell).addClass("selectCellBorderTop");
			$(cell).addClass("selectCellBorderRight");
			
			cell=this._getCell(maxY,minX);
			$(cell).addClass("selectCellBorderBottom");
			$(cell).addClass("selectCellBorderLeft");

			cell=this._getCell(maxY,maxX);
			$(cell).addClass("selectCellBorderBottom");
			$(cell).addClass("selectCellBorderRight");
			
			for (i=minY+1;i<maxY;i++)
			{
				cell=this._getCell(i,minX);
				$(cell).addClass("selectCellBorderLeft");

				cell=this._getCell(i,maxX);
				$(cell).addClass("selectCellBorderRight");
			}
			for (i=minX+1;i<maxX;i++)
			{
				cell=this._getCell(minY,i);
				$(cell).addClass("selectCellBorderTop");
				
				cell=this._getCell(maxY,i);
				$(cell).addClass("selectCellBorderBottom");
			}	
			this.selectPreviousRowIndex=rowIndex;	
			this.selectPreviousCellIndex=cellIndex;
		}	
	}	
	_mouseUpEventHandler(theCell)
	{
		this.inSelectMode=false;
	}
	_clearPreviousBorder()
	{
		var minX,maxX,minY,maxY,cell,i,j;
		console.log("===========================================");
		console.log("startRowIndex="+this.selectStartRowIndex+",startCellIndex="+this.selectStartCellIndex);
		console.log("previousRowIndex="+this.selectPreviousRowIndex+",previousCellIndex="+this.selectPreviousCellIndex);
		if ((this.selectStartRowIndex>0) || (this.selectStartCellIndex>0))
		{
			if (this.selectPreviousRowIndex<0)
				this.selectPreviousRowIndex=this.selectStartRowIndex;
			if (this.selectPreviousCellIndex<0)
				this.selectPreviousCellIndex=this.selectStartCellIndex;
			if (this.selectStartCellIndex>this.selectPreviousCellIndex)
			{
				minX=this.selectPreviousCellIndex;
				maxX=this.selectStartCellIndex;
			}
			else
			{
				if (this.selectStartCellIndex<this.selectPreviousCellIndex)
				{
					maxX=this.selectPreviousCellIndex;
					minX=this.selectStartCellIndex;
				}
				else
				{
					maxX=this.selectStartCellIndex;
					minX=this.selectStartCellIndex;
				}	
			}	
			if (this.selectStartRowIndex<this.selectPreviousRowIndex)	
			{
				minY=this.selectStartRowIndex;
				maxY=this.selectPreviousRowIndex;
			}
			else
			{
				if (this.selectStartRowIndex>this.selectPreviousRowIndex)	
				{
					minY=this.selectPreviousRowIndex;
					maxY=this.selectStartRowIndex;
				}
				else
				{
					maxY=this.selectStartRowIndex;
					minY=this.selectStartRowIndex;
				}	
			}
			console.log("minX="+minX+",minY="+minY+",maxX="+maxX+",maxY="+maxY+",startRowIndex="+this.selectStartRowIndex+",startCellIndex="+this.selectStartCellIndex);
			for (i=minY;i<=maxY;i++)
			{
				for (j=minX;j<=maxX;j++)
				{
					cell=this._getCell(i,j);
					$(cell).removeClass("selectCellBorderRight");   
					$(cell).removeClass("selectCellBorderTop");     
					$(cell).removeClass("selectCellBorderBottom");  
					$(cell).removeClass("selectCellBorderLeft");    
				}	
			}	
		}
		console.log("===========================================");
	}
	_getCell(rowIndex,cellIndex)
	{
		var row=this.table.rows[rowIndex];
		var cell=row.cells[cellIndex];
		return cell;
	}
}