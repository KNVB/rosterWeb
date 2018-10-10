class SchedulerShiftCellEventHandler extends ShiftCellEventHandler
{
	constructor(rosterSchedulerTable,targetCellClassName)
	{
		super(rosterSchedulerTable,targetCellClassName);
		var self=this;
		
		this.borderCoordindate=null;
		this.isFirstSelect=false;
		this.inSelectMode=false;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		this.selectStartRowIndex=-1;	
		this.selectStartCellIndex=-1;
		this.table=rosterSchedulerTable.table;
		$("body").on("copy",function(){
			if (self.borderCoordindate!=null)
			{
				self.rosterTable.copyData(self.borderCoordindate);
			}
			event.stopPropagation();
			event.preventDefault();
		});
		$("body").on("paste", function(){
			//console.log("Paste event");
			console.log(window.clipboardData);
			event.stopPropagation();
			event.preventDefault();
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
		window.addEventListener("focus",function(event){
			
		});
	}
/******************************************************************************************
 * Private function																		  *
 ******************************************************************************************/
	_clearAllSelectionState()
	{
		this._clearSelectedRegion();
		this.inSelectMode=false;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		this.selectStartRowIndex=-1;	
		this.selectStartCellIndex=-1;
	}
	_clearSelectedRegion()
	{
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
			this.rosterTable.clearSelectedRegion(this.borderCoordindate);
		}
		console.log("===========================================");
	}
	_endSelection(theCell)
	{
		this.inSelectMode=false;
	}
	_getBorderCoordinate(rowIndex,cellIndex)
	{
		var result=new BorderCoordinate();
		if (this.selectStartCellIndex>cellIndex)
		{
			result.minX=cellIndex;
			result.maxX=this.selectStartCellIndex;
		}
		else
		{
			if (this.selectStartCellIndex<cellIndex)
			{
				result.maxX=cellIndex;
				result.minX=this.selectStartCellIndex;
			}
			else
			{
				result.maxX=cellIndex;
				result.minX=cellIndex;
			}	
		}	
		if (this.selectStartRowIndex<rowIndex)	
		{
			result.minY=this.selectStartRowIndex;
			result.maxY=rowIndex;
		}
		else
		{
			if (this.selectStartRowIndex>rowIndex)	
			{
				result.minY=rowIndex;
				result.maxY=this.selectStartRowIndex;
			}
			else
			{
				result.maxY=this.selectStartRowIndex;
				result.minY=this.selectStartRowIndex;
			}	
		}
		return result;
	}
	_handleArrowKeyEvent(event,yIndex,xIndex)
	{
		if (this.borderCoordindate!=null)
		{
			var cell=this.rosterTable.getCell(this.borderCoordindate.minY,this.borderCoordindate.minX);
			var tempY,tempX;
			
			//if (cell!==document.activeElement)
			if (this.isFirstSelect)
			{
				tempY=this.borderCoordindate.minY+yIndex;
				tempX=this.borderCoordindate.minX+xIndex;
				cell=this.rosterTable.getCell(tempY,tempX);
				if ($(cell).hasClass("cursorCell"))
				{
					this._selectCell(cell);
				}	
			}
		}
	}
	_handleEvent(object,event)
	{
		var row;
		event.stopPropagation();
		switch(event.type)
		{
			case "dblclick"		:
								event.preventDefault();
								this.isFirstSelect=false;
								this.rosterTable.enableEditMode(object);
								break;
			case "keydown"		:								
								this._keyDownHandlder(event);
								break;						
			case "mousedown"	:
								event.preventDefault();
								this._selectCell(object);
								break;
			case "mouseup"		:
								event.preventDefault();
								this._endSelection(object);
								break;					
		}
	}
	_handleTabKeyEvent(event)
	{
		if (this.borderCoordindate!=null)
		{
			var cell=this.rosterTable.getCell(this.borderCoordindate.minY,this.borderCoordindate.minX);
			var tempY,tempX;
			if (event.shiftKey)
				tempX=this.borderCoordindate.minX-1;
			else
				tempX=this.borderCoordindate.minX+1;
			cell=this.rosterTable.getCell(this.borderCoordindate.minY,tempX);
			if ($(cell).hasClass("cursorCell"))
			{
				this._selectCell(cell);
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
						return
					}	
					else	
					{
						if (this.borderCoordindate!=null)
						{
							var cell=this.rosterTable.getCell(this.borderCoordindate.minY,this.borderCoordindate.minX);
							if (cell!==document.activeElement)
							{
								this.rosterTable.enableEditMode(cell);
								cell.textContent="";
							}
						}
					}	
					break;
		}
		
	}
	_selectCell(theCell)
	{
		var row=theCell.parentElement;
		this._clearSelectedRegion();
		theCell.focus();
		this.selectStartRowIndex=row.rowIndex;	
		this.selectStartCellIndex=theCell.cellIndex;
		this.selectPreviousRowIndex=-1;
		this.selectPreviousCellIndex=-1;
		this.borderCoordindate=this._getBorderCoordinate(row.rowIndex,theCell.cellIndex);
		this.rosterTable.selectCell(theCell);
		this.inSelectMode=true;
		this.isFirstSelect=true;
	}
}