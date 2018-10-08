class SchedulerShiftCellEventHandler extends ShiftCellEventHandler
{
	constructor(rosterSchedulerTable,targetCellClassName)
	{
		super(rosterSchedulerTable,targetCellClassName);
		var self=this;
		this.table=rosterSchedulerTable.table;
		this.borderCoordindate=null;
		this.inSelectMode=false;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		this.selectStartRowIndex=-1;	
		this.selectStartCellIndex=-1;
		$(this.selectionString).on("paste", function(){
			
			console.log(window.clipboardData);			
		});
		$(this.selectionString).dblclick(function(){
			self._handleEvent(this,event);
		});
		$(this.selectionString).mousedown(function(event){
			self._handleEvent(this,event);
		});
		$("body").mouseup(function(event){
			self._handleEvent(this,event);
		});
		$("body").keydown(function(event){
			self._handleEvent(this,event);
		});
	}
/******************************************************************************************
 * Private function																		  *
 ******************************************************************************************/
	_clearAllSelectionState()
	{
		this._clearPreviousBorder();
		this.inSelectMode=false;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		this.selectStartRowIndex=-1;	
		this.selectStartCellIndex=-1;
	}
	_clearPreviousBorder()
	{
		var cell,i,j;
		console.log("===========================================");
		console.log("startRowIndex="+this.selectStartRowIndex+",startCellIndex="+this.selectStartCellIndex);
		console.log("previousRowIndex="+this.selectPreviousRowIndex+",previousCellIndex="+this.selectPreviousCellIndex);
		if ((this.selectStartRowIndex>0) || (this.selectStartCellIndex>0))
		{
			if (this.selectPreviousRowIndex<0)
				this.selectPreviousRowIndex=this.selectStartRowIndex;
			if (this.selectPreviousCellIndex<0)
				this.selectPreviousCellIndex=this.selectStartCellIndex;
			this.borderCoordindate=this._getBorderCoordinate(this.selectPreviousRowIndex,this.selectPreviousCellIndex);
			console.log("minX="+this.borderCoordindate.minX+",minY="+this.borderCoordindate.minY+",maxX="+this.borderCoordindate.maxX+",maxY="+this.borderCoordindate.maxY+",startRowIndex="+this.selectStartRowIndex+",startCellIndex="+this.selectStartCellIndex);
			for (i=this.borderCoordindate.minY;i<=this.borderCoordindate.maxY;i++)
			{
				for (j=this.borderCoordindate.minX;j<=this.borderCoordindate.maxX;j++)
				{
					cell=this._getCell(i,j);
					this._disableEditMode(cell);
					$(cell).removeClass("selectCellBorderRight");   
					$(cell).removeClass("selectCellBorderTop");     
					$(cell).removeClass("selectCellBorderBottom");  
					$(cell).removeClass("selectCellBorderLeft");    
				}	
			}
			this.borderCoordindate=null;
		}
		console.log("===========================================");
	}
	_disableEditMode(theCell)
	{
		theCell.contentEditable=false;
		theCell.blur();
	}
	_enableEditMode(theCell)
	{
		theCell.contentEditable=true;
		theCell.focus();
	}
	_endSelection(theCell)
	{
		this.inSelectMode=false;
	}
	_getBorderCoordinate(rowIndex,cellIndex)
	{
		var result={};
		if (this.selectStartCellIndex>cellIndex)
		{
			result["minX"]=cellIndex;
			result["maxX"]=this.selectStartCellIndex;
		}
		else
		{
			if (this.selectStartCellIndex<cellIndex)
			{
				result["maxX"]=cellIndex;
				result["minX"]=this.selectStartCellIndex;
			}
			else
			{
				result["maxX"]=cellIndex;
				result["minX"]=cellIndex;
			}	
		}	
		if (this.selectStartRowIndex<rowIndex)	
		{
			result["minY"]=this.selectStartRowIndex;
			result["maxY"]=rowIndex;
		}
		else
		{
			if (this.selectStartRowIndex>rowIndex)	
			{
				result["minY"]=rowIndex;
				result["maxY"]=this.selectStartRowIndex;
			}
			else
			{
				result["maxY"]=this.selectStartRowIndex;
				result["minY"]=this.selectStartRowIndex;
			}	
		}
		return result;
	}
	_getCell(rowIndex,cellIndex)
	{
		var row=this.table.rows[rowIndex];
		var cell=row.cells[cellIndex];
		return cell;
	}
	_handleEvent(object,event)
	{
		var row;
		event.stopPropagation();
		if (object.tagName=="TD")
			row=object.parentElement;
		switch(event.type)
		{
			case "keydown"		:								
								this._keyDownHandlder(event);
								break;			
			case "mousedown"	:event.preventDefault();
								this._startSelection(object,row.rowIndex,object.cellIndex);
								break;
			case "mouseup"		:event.preventDefault();
								this._endSelection(object);
								break;
			case "dblclick"		:event.preventDefault();
								this._enableEditMode(object);
								break;		
		}
	}
	_handleArrowKeyEvent(event,yIndex,xIndex)
	{
		if (this.borderCoordindate!=null)
		{
			var cell=this._getCell(this.borderCoordindate.minY,this.borderCoordindate.minX);
			var tempY,tempX;
			if (cell!==document.activeElement)
			{
				tempY=this.borderCoordindate.minY+yIndex;
				tempX=this.borderCoordindate.minX+xIndex;
				cell=this._getCell(tempY,tempX);
				if ($(cell).hasClass("cursorCell"))
				{
					this._startSelection(cell,tempY,tempX);
				}	
			}
		}
	}
	_handleTabKeyEvent(event)
	{
		if (this.borderCoordindate!=null)
		{
			var cell=this._getCell(this.borderCoordindate.minY,this.borderCoordindate.minX);
			var tempY,tempX;
			if (event.shiftKey)
				tempX=this.borderCoordindate.minX-1;
			else
				tempX=this.borderCoordindate.minX+1;
			cell=this._getCell(this.borderCoordindate.minY,tempX);
			if ($(cell).hasClass("cursorCell"))
			{
				this._startSelection(cell,this.borderCoordindate.minY,tempX);
			}
		}
	}
	_keyDownHandlder(event)
	{
		switch (event.which)
		{
			case  9://handle tab key
					event.preventDefault();
					this._handleTabKeyEvent(event);
					break;
			case 16://handle shift key
			case 17://handle Ctrl key
			case 18://handle alt key	
					event.preventDefault();
					break;
			case 27://handle "Esc" key event
					this._clearAllSelectionState();
					break;
			case 37://handle left arrow key
					this._handleArrowKeyEvent(event,0,-1);
					break;
			case 38://handle up arrow key
					this._handleArrowKeyEvent(event,-1,0);
					break;
			case 39://handle right arrow key
					this._handleArrowKeyEvent(event,0,1);
					break;
			case 40://handle down arrow key
					this._handleArrowKeyEvent(event,1,0);
					break;		
			default:
					if (event.ctrlKey)
					{
						event.stopPropagation();
						event.preventDefault();
					}	
					else	
					{
						if (this.borderCoordindate!=null)
						{
							var cell=this._getCell(this.borderCoordindate.minY,this.borderCoordindate.minX);
							if (cell!==document.activeElement)
							{
								this._enableEditMode(cell);
								cell.textContent="";
							}
						}
					}	
					break;
		}
		
	}
	_startSelection(theCell,rowIndex,cellIndex)
	{
		this._clearPreviousBorder();
		theCell.focus();
		$(theCell).addClass("selectCellBorderRight");
		$(theCell).addClass("selectCellBorderTop");
		$(theCell).addClass("selectCellBorderBottom");
		$(theCell).addClass("selectCellBorderLeft");
		console.log("selection start="+(rowIndex+"_"+cellIndex));
		console.log("selectStartRowIndex="+this.selectStartRowIndex+",selectStartCellIndex="+this.selectStartCellIndex);
		this.selectStartRowIndex=rowIndex;	
		this.selectStartCellIndex=cellIndex;
		this.selectPreviousRowIndex=-1;
		this.selectPreviousCellIndex=-1;
		this.borderCoordindate=this._getBorderCoordinate(rowIndex,cellIndex);
		this.inSelectMode=true;
	}	
}