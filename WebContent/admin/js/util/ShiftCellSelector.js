class ShiftCellSelector
{
	constructor(rosterTable,targetCellClassName)
	{
		var self=this;
		this.selectionString="td."+targetCellClassName;
		this.rosterTable=rosterTable;
		this.window_focus=true;
		this.copiedRegionCoordinate=null;
		this.isFirstSelect=false;
		this.inSelectMode=false;
		this.selectedRegionCoordinate=null;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		this.selectStartRowIndex=-1;	
		this.selectStartCellIndex=-1;
		this.table=rosterTable;
		$("body").on("copy",function(event){
			event.preventDefault();
			event.stopPropagation();
			console.log("Copy event");
			self._copyDataToClipboard(event);
		});
		$("body").on("paste", function(event){
			console.log("Paste event");
			//console.log(window.clipboardData);
			event.stopPropagation();
			event.preventDefault();
			self._pasteDataFromClipboard(event);
		});
		$(this.selectionString).dblclick(function(event){
			self._handleMouseEvent(this,event);
		});
		$(this.selectionString).mousedown(function(event){
			self._handleMouseEvent(this,event);
		});
		$(this.selectionString).mouseenter(function(event){
			self._handleMouseEvent(this,event);
		});
		$(this.selectionString).mouseout(function(event){
			self._handleMouseEvent(this,event);
		});
		$("body").mouseup(function(event){
			self._handleMouseEvent(this,event);
		});
		$("body").keydown(function(event){
			self._handleKeyDownEvent(event);
		});
		/*
		window.addEventListener("focus",function(event){
			self.window_focus=true;
			event.stopPropagation();
			console.log("Window focus");
		});
		window.addEventListener("blur",function(event){
			self.window_focus=false;
			event.stopPropagation();
			console.log("Window Blur");
		});*/
	}
//============================================================================
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
			this.selectedRegionCoordinate=this._getSelectedRegionCoordinate(this.selectPreviousRowIndex,this.selectPreviousCellIndex);
			console.log("minX="+this.selectedRegionCoordinate.minX+",minY="+this.selectedRegionCoordinate.minY+",maxX="+this.selectedRegionCoordinate.maxX+",maxY="+this.selectedRegionCoordinate.maxY+",startRowIndex="+this.selectStartRowIndex+",startCellIndex="+this.selectStartCellIndex);
			this.rosterTable.clearSelectedRegion(this.selectedRegionCoordinate);
		}
		console.log("===========================================");
	}
	_copyDataToClipboard(event)
	{
		var clipboard=event.originalEvent.clipboardData;
		if (this.selectedRegionCoordinate!=null)
		{	
			console.log(this.copiedRegionCoordinate==null);

			if (this.copiedRegionCoordinate==null)
				this.copiedRegionCoordinate=new SelectedRegionCoordinate();
			else
				this.rosterTable.clearCopiedRegion(this.copiedRegionCoordinate);
			
			this.copiedRegionCoordinate.minX=this.selectedRegionCoordinate.minX;
			this.copiedRegionCoordinate.maxX=this.selectedRegionCoordinate.maxX;
			this.copiedRegionCoordinate.minY=this.selectedRegionCoordinate.minY;
			this.copiedRegionCoordinate.maxY=this.selectedRegionCoordinate.maxY;
			
			clipboard.clearData();
			clipboard.setData("text/plain",JSON.stringify(this.rosterTable.getDataForCopy(this.selectedRegionCoordinate)));
		}	
	}
	_endSelection(theCell)
	{
		this.inSelectMode=false;
	}
	_getSelectedRegionCoordinate(rowIndex,cellIndex)
	{
		var result=new SelectedRegionCoordinate();
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
		if (this.selectedRegionCoordinate!=null)
		{
			var cell=this.rosterTable.getCell(this.selectedRegionCoordinate.minY,this.selectedRegionCoordinate.minX);
			var tempY,tempX;
			
			//if (cell!==document.activeElement)
			if (this.isFirstSelect)
			{
				tempY=this.selectedRegionCoordinate.minY+yIndex;
				tempX=this.selectedRegionCoordinate.minX+xIndex;
				cell=this.rosterTable.getCell(tempY,tempX);
				if ($(cell).hasClass("cursorCell"))
				{
					this._selectCell(cell,tempY,tempX);
				}	
			}
		}
	}
	_handleDeleteKeyEvent(event)
	{
		if ((this.selectStartRowIndex>-1) && (this.selectStartCellIndex>-1))
		{
			var cell;
			var sel = window.getSelection();
			var range = document.createRange();
			for (var i=this.selectedRegionCoordinate.minX;i<=this.selectedRegionCoordinate.maxX;i++)
			{
				for (var j=this.selectedRegionCoordinate.minY;j<=this.selectedRegionCoordinate.maxY;j++)
				{
					cell=this.rosterTable.getCell(j,i);
					if ($(cell).hasClass("cursorCell"))
					{
						//$(cell).empty().blur();
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
			
			this._clearAllSelectionState();
		}
	}
	_handleKeyDownEvent(event)
	{
		event.stopPropagation();
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
			case 46:
					this._handleDeleteKeyEvent(event);
					break;
			default:
					if (event.ctrlKey)
					{
						return
					}	
					else	
					{
						if (this.selectedRegionCoordinate!=null)
						{
							var cell=this.rosterTable.getCell(this.selectedRegionCoordinate.minY,this.selectedRegionCoordinate.minX);
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
	_handleMouseEvent(object,event)
	{
		var row;
		event.stopPropagation();
		if (object.tagName=="TD")
			row=object.parentElement;
		switch(event.type)
		{
			case "dblclick"		:
								event.preventDefault();
								this.isFirstSelect=false;
								this.rosterTable.enableEditMode(object);
								break;
			case "mousedown"	:
								event.preventDefault();
								this.inSelectMode=true;
								this._selectCell(object,row.rowIndex,object.cellIndex);
								break;
			case "mouseenter"	:event.preventDefault();
								this._updateSelectedRegion(object,row.rowIndex,object.cellIndex);
								break;
			case "mouseout"		:
								event.preventDefault();
								this._updatePreviousSelectedCoordinate(object,row.rowIndex,object.cellIndex);
								break;
			case "mouseup"		:
								event.preventDefault();
								this._endSelection(object);
								break;					
		}
	}
	_handleTabKeyEvent(event)
	{
		if (this.selectedRegionCoordinate!=null)
		{
			console.log(this.selectedRegionCoordinate.minY,this.selectedRegionCoordinate.minX);
			var tempY,tempX;
			if (event.shiftKey)
				tempX=this.selectedRegionCoordinate.minX-1;
			else
				tempX=this.selectedRegionCoordinate.minX+1;
			var cell=this.rosterTable.getCell(this.selectedRegionCoordinate.minY,tempX);
			if ($(cell).hasClass("cursorCell"))
			{
				this._selectCell(cell,this.selectedRegionCoordinate.minY,tempX);
			}
		}
	}
	_pasteDataFromClipboard(event)
	{
		var cell;
		var clipboard=event.originalEvent.clipboardData;
		var dataRowList=JSON.parse(clipboard.getData("text/plain"));
		
		if ((this.selectedRegionCoordinate!=null) && (this.copiedRegionCoordinate!=null))
		{	
			this.rosterTable.pasteDataFromClipboard(this.selectedRegionCoordinate,this.copiedRegionCoordinate,dataRowList);
		}
	}
	_selectCell(theCell,rowIndex,cellIndex)
	{
		var row=theCell.parentElement;
		this._clearSelectedRegion();
		theCell.focus();
		this.selectStartRowIndex=rowIndex;	
		this.selectStartCellIndex=cellIndex;
		this.selectPreviousRowIndex=-1;
		this.selectPreviousCellIndex=-1;
		this.selectedRegionCoordinate=this._getSelectedRegionCoordinate(rowIndex,cellIndex);
		this.rosterTable.selectCell(theCell);
		this.isFirstSelect=true;
	}
	_updatePreviousSelectedCoordinate(theCell,rowIndex,cellIndex)
	{
		if (this.inSelectMode)
		{
			//theCell.contentEditable=false;
			this.selectPreviousRowIndex=rowIndex;	
			this.selectPreviousCellIndex=cellIndex;
		}
	}
	_updateSelectedRegion(theCell,rowIndex,cellIndex)
	{
		if (this.inSelectMode)
		{
			this._clearSelectedRegion();
			this.selectedRegionCoordinate=this._getSelectedRegionCoordinate(rowIndex,cellIndex);
			this.rosterTable.setSelectedRegion(this.selectedRegionCoordinate);
			this.selectPreviousRowIndex=rowIndex;	
			this.selectPreviousCellIndex=cellIndex;	
		}		
	}	
}