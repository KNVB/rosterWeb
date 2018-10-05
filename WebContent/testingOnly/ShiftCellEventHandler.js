class ShiftCellEventHandler
{
	constructor(table,targetCellClassName)
	{
		var selectionString;
		var self=this;
		this.borderCoordindate=null;
		this.clipBoard={};
		this.inSelectMode=false;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		this.selectStartRowIndex=-1;	
		this.selectStartCellIndex=-1;
		this.table=table;
		if (targetCellClassName==null)
		{	
			this.targetCellClassName="";
			selectionString="td";
		}
		else	
		{	
			this.targetCellClassName=targetCellClassName;
			selectionString="td."+targetCellClassName;
		}
		$(selectionString).dblclick(function(){
			self._handleEvent(this,event);
		});
		$(selectionString).mousedown(function(event){
			self._handleEvent(this,event);
		});
		$(selectionString).mouseenter(function(event){
			self._handleEvent(this,event);
		});
		$(selectionString).mouseout(function(event){
			self._handleEvent(this,event);
		});
		$("body").mouseup(function(event){
			self._handleEvent(this,event);
		});
		$("body").keydown(function(event){
			self._handleEvent(this,event);
		});
		$("body").keyup(function(event){
			self._handleEvent(this,event);
		});
	}
	_handleEvent(object,event)
	{
		var row;
		event.stopPropagation();
		if (object.tagName=="TD")
			row=object.parentElement;
		switch(event.type)
		{
			case "keydown"		:this._keyDownHandlder(event);
								break;
			case "keyup"		:this._keyUpHandler(event);
								break
			case "mousedown"	:event.preventDefault();
								this._mouseDownEventHandler(object,row.rowIndex,object.cellIndex);
								break;
			case "mouseenter"	:event.preventDefault();
            					this._mouseEnterEventHandler(object,row.rowIndex,object.cellIndex);
            					break;
			case "mouseout"		:event.preventDefault();
		 						this._mouseOutEventHandler(object,row.rowIndex,object.cellIndex);
		 						break;
			case "mouseup"		:event.preventDefault();
								this._mouseUpEventHandler(object);
								break;
			case "dblclick"		:event.preventDefault();
								this._dblClickEventHandler(object);
								break;
			default				:console.log(event.type);
								break;
		}						 
	}
	_keyDownHandlder(event)
	{
 		switch (event.which)
		{
			
 			case  9://handle shift key
 					this._handleTabKeyEvent(event);
 					break;
			case 13://When Enter key is pressed
					this._handleEnterKeyEvent(event);
					break;
			
			case 16://handle shift key
			case 17://handle Ctrl key
					break;	
			case 27://handle "Esc" key event
					this.clipBoard={};
					this._clearAllSelectState();
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
			case 46://handle delete key
					this._deleteSelectedData();
					break;
			case 67://handle "C" key event
					if (event.ctrlKey)
						this._copySelectedData();
					break;
			case 86://handle "V" key event
					if (event.ctrlKey)
						this._pasteSelectedData(event);
					break;
			default:
					this._handleBodyKeyDownEvent();
					break;		
		}
	}
	_handleTabKeyEvent(event)
	{
		var object=event.target,cell,tempCell=null,row,rowIndex,cellIndex;
		switch(object.tagName)
		{
			case "TD"	:
			case "BODY"	:
						event.preventDefault();
						if ((this.selectPreviousRowIndex>-1) ||(this.selectStartRowIndex>-1))
						{
							if (this.selectPreviousRowIndex==-1)
							{
								cell=this._getCell(this.selectStartRowIndex,this.selectStartCellIndex);
							}
							else
							{
								cell=this._getCell(this.selectPreviousRowIndex,this.selectPreviousCellIndex);
							}
							row=cell.parentElement;
							rowIndex=row.rowIndex;
							cellIndex=cell.cellIndex;
							if (event.shiftKey)
							{
								if (cellIndex>0)
								{
									tempCell=this._getCell(rowIndex,cellIndex-1);
								}	
							}
							else
							{
								if (row.cells.length>(cellIndex+1))
								{
									tempCell=this._getCell(rowIndex,cellIndex+1);
								}	
							}
							if ((tempCell!=null)&& this._isTargetCell(tempCell))
							{
								if ((this.borderCoordindate.maxX==this.borderCoordindate.minX) && (this.borderCoordindate.maxY==this.borderCoordindate.minY))
									this._switchCell(cell,tempCell);
							}	
						}
						break;
									
		}
	}
	_handleArrowKeyEvent(event,yIndex,xIndex)
	{
		var object=event.target,cell,tempCell;
		switch(object.tagName)
		{
			case "BODY"	:
				        event.preventDefault();
						if ((this.selectPreviousRowIndex>-1) ||(this.selectStartRowIndex>-1))
						{
							if (this.selectPreviousRowIndex==-1)
							{
								cell=this._getCell(this.selectStartRowIndex,this.selectStartCellIndex);
							}
							else
							{
								cell=this._getCell(this.selectPreviousRowIndex,this.selectPreviousCellIndex);
							}
							if (cell.cellIndex>0)
							{
								tempCell=this._getCell(cell.parentElement.rowIndex+yIndex,cell.cellIndex+xIndex);
								if (this._isTargetCell(tempCell))
								{
									if (event.shiftKey)
										this._selectCell(cell,tempCell);
									else
										this._switchCell(cell,tempCell);
								}
							}	
						}
						break;	 
		}
	}
	_handleEnterKeyEvent(event)
	{
		var object=event.target,cell,tempCell;
		switch(object.tagName)
		{
			case "BODY"	:
						event.preventDefault();
						if (this.borderCoordindate!=null)
						{
							if ((this.borderCoordindate.maxX==this.borderCoordindate.minX) && (this.borderCoordindate.maxY==this.borderCoordindate.minY))
							{
								if (this.table.rows.length>(this.borderCoordindate.maxY+1))
								{
									cell=this._getCell(this.borderCoordindate.maxY,this.borderCoordindate.maxX);
									tempCell=this._getCell(this.borderCoordindate.maxY+1,this.borderCoordindate.maxX);
									this._switchCell(cell,tempCell);
								}	
							}
						}
						break;
			case "TD"	:
						if (this._isTargetCell(object))
						{
							cell=event.target;
							if (this.table.rows.length>(cell.parentElement.rowIndex+1))
							{
								tempCell=this._getCell(cell.parentElement.rowIndex+1,cell.cellIndex);
								this._switchCell(cell,tempCell);
							}	
						}
						break;
		}	
	}
	_handleBodyKeyDownEvent()
	{
		var cell;
		
		if (this.borderCoordindate!=null)
		{
			if ((this.borderCoordindate.maxX==this.borderCoordindate.minX) && (this.borderCoordindate.maxY==this.borderCoordindate.minY))
			{
				cell=this._getCell(this.borderCoordindate.maxY,this.borderCoordindate.maxX);
				this._dblClickEventHandler(cell);              
			}	
		}	
	}
	_keyUpHandler(event)
	{
		if (event.key=="Shift")
		{
			this.inSelectMode=false;
		}	
	}
	_dblClickEventHandler(theCell)
	{
		console.log("on dblClick event triggered.");
		theCell.contentEditable=true;
		theCell.focus();
	}
	_mouseDownEventHandler(theCell,rowIndex,cellIndex)
	{
		var previousCell;
		this._clearPreviousBorder();
		if (this.selectPreviousRowIndex>0)
		{
			previousCell=this._getCell(this.selectPreviousRowIndex,this.selectPreviousCellIndex);
			previousCell.blur();
		}
		$(theCell).addClass("selectCellBorderRight");
		$(theCell).addClass("selectCellBorderTop");
		$(theCell).addClass("selectCellBorderBottom");
		$(theCell).addClass("selectCellBorderLeft");
		console.log("mouse down event triggered.positionString="+(rowIndex+"_"+cellIndex));
		console.log("selectStartRowIndex="+this.selectStartRowIndex+",selectStartCellIndex="+this.selectStartCellIndex);
		this.selectStartRowIndex=rowIndex;	
		this.selectStartCellIndex=cellIndex;
		this.selectPreviousRowIndex=-1;
		this.selectPreviousCellIndex=-1;
		this.borderCoordindate=this._getBorderCoordinate(rowIndex,cellIndex);
		this.inSelectMode=true;
	}
	_mouseEnterEventHandler(theCell,rowIndex,cellIndex)
	{
		var cell,i;
		if (this.inSelectMode)
		{
			this._clearPreviousBorder();
			this.borderCoordindate=this._getBorderCoordinate(rowIndex,cellIndex);
			cell=this._getCell(this.borderCoordindate.minY,this.borderCoordindate.minX);
			$(cell).addClass("selectCellBorderTop");
			$(cell).addClass("selectCellBorderLeft");
			
			cell=this._getCell(this.borderCoordindate.minY,this.borderCoordindate.maxX);
			$(cell).addClass("selectCellBorderTop");
			$(cell).addClass("selectCellBorderRight");
			
			cell=this._getCell(this.borderCoordindate.maxY,this.borderCoordindate.minX);
			$(cell).addClass("selectCellBorderBottom");
			$(cell).addClass("selectCellBorderLeft");

			cell=this._getCell(this.borderCoordindate.maxY,this.borderCoordindate.maxX);
			$(cell).addClass("selectCellBorderBottom");
			$(cell).addClass("selectCellBorderRight");
			
			for (i=this.borderCoordindate.minY+1;i<this.borderCoordindate.maxY;i++)
			{
				cell=this._getCell(i,this.borderCoordindate.minX);
				$(cell).addClass("selectCellBorderLeft");

				cell=this._getCell(i,this.borderCoordindate.maxX);
				$(cell).addClass("selectCellBorderRight");
			}
			for (i=this.borderCoordindate.minX+1;i<this.borderCoordindate.maxX;i++)
			{
				cell=this._getCell(this.borderCoordindate.minY,i);
				$(cell).addClass("selectCellBorderTop");
				
				cell=this._getCell(this.borderCoordindate.maxY,i);
				$(cell).addClass("selectCellBorderBottom");
			}
			this.selectPreviousRowIndex=rowIndex;	
			this.selectPreviousCellIndex=cellIndex;		
		}
	}
	_mouseOutEventHandler(theCell,rowIndex,cellIndex)
	{
		var positionString=rowIndex+"_"+cellIndex;
		if (this.inSelectMode)
		{	
			console.log("mouse out event triggered.positionString="+positionString);
			theCell.contentEditable=false;
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
			this.borderCoordindate=this._getBorderCoordinate(this.selectPreviousRowIndex,this.selectPreviousCellIndex)
			console.log("minX="+this.borderCoordindate.minX+",minY="+this.borderCoordindate.minY+",maxX="+this.borderCoordindate.maxX+",maxY="+this.borderCoordindate.maxY+",startRowIndex="+this.selectStartRowIndex+",startCellIndex="+this.selectStartCellIndex);
			for (i=this.borderCoordindate.minY;i<=this.borderCoordindate.maxY;i++)
			{
				for (j=this.borderCoordindate.minX;j<=this.borderCoordindate.maxX;j++)
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
	_copySelectedData()
	{
		var cell,i,j,counterY=0,counterX,tempArray;
		if ((this.selectStartRowIndex>0) || (this.selectStartCellIndex>0))
		{
			if (this.selectPreviousRowIndex<0)
				this.selectPreviousRowIndex=this.selectStartRowIndex;
			if (this.selectPreviousCellIndex<0)
				this.selectPreviousCellIndex=this.selectStartCellIndex;
			this.borderCoordindate=this._getBorderCoordinate(this.selectPreviousRowIndex,this.selectPreviousCellIndex);
			this.clipBoard={};
			this.clipBoard["fromRowIndex"]=this.borderCoordindate.minY;
			this.clipBoard["fromCellIndex"]=this.borderCoordindate.minX;
			var data=[];
			for (i=this.borderCoordindate.minY;i<=this.borderCoordindate.maxY;i++)
			{
				data[counterY]=[];
				counterX=0;
				for (j=this.borderCoordindate.minX;j<=this.borderCoordindate.maxX;j++)
				{
					cell=this._getCell(i,j);
					data[counterY][counterX]=(cell.textContent);
					//this.clipBoard[counterY,counterX]=cell.textContent;
					counterX++;
				}
				counterY++;
			}
			this.clipBoard["data"]=data;
		}	
	}
	_pasteSelectedData(event)
	{
		var object=event.target,cell,tempCell;
		switch(object.tagName)
		{
			case "BODY":
						if ((this.selectStartRowIndex>0) || (this.selectStartCellIndex>0))
						{
							if((this.clipBoard["fromRowIndex"]!=this.selectStartRowIndex)||
								(this.clipBoard["fromCellIndex"]!=this.selectStartCellIndex))
							{
								var x,y,cell;
								for (y=0;y<this.clipBoard["data"].length;y++)
								{
									for (x=0;x<this.clipBoard["data"][y].length;x++)
									{
										try
										{
											cell=this._getCell(this.selectStartRowIndex+y,this.selectStartCellIndex+x);
											cell.textContent=this.clipBoard["data"][y][x];
										}
										catch (err)
										{
											
										}
									}	
								}	
							}	
						}	
						break;
			default:this.clipBoard="";
					break
		}
	}
	_deleteSelectedData()
	{
		var i,j,cell;
		if ((this.selectStartRowIndex>0) || (this.selectStartCellIndex>0))
		{
			if (this.selectPreviousRowIndex<0)
				this.selectPreviousRowIndex=this.selectStartRowIndex;
			if (this.selectPreviousCellIndex<0)
				this.selectPreviousCellIndex=this.selectStartCellIndex;
			this.borderCoordindate=this._getBorderCoordinate(this.selectPreviousRowIndex,this.selectPreviousCellIndex);
			for (i=this.borderCoordindate.minY;i<=this.borderCoordindate.maxY;i++)
			{
				for (j=this.borderCoordindate.minX;j<=this.borderCoordindate.maxX;j++)
				{
					cell=this._getCell(i,j);
					cell.textContent="";
				}	
			}
		}
	}
	_clearAllSelectState()
	{
		this._clearPreviousBorder();
		this.inSelectMode=false;
		this.selectPreviousRowIndex=-1;	
		this.selectPreviousCellIndex=-1;
		this.selectStartRowIndex=-1;	
		this.selectStartCellIndex=-1;
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
	_isTargetCell(object)
	{
		var result=false;
		if (object.tagName=="TD")
		{	
			if (this.targetCellClassName=="")
			{
				result=true;	
			}
			else
			{
				if ($(object).hasClass(this.targetCellClassName))
					result=true;
			}	
		}
		return result;
	}
	_selectCell(cell,tempCell)
	{
		this.inSelectMode=true;
		$(cell).mouseout();
		$(tempCell).mouseenter();
	}
	_switchCell(cell,tempCell)
	{
		cell.contentEditable=false;
		$(tempCell).mousedown();
		$(tempCell).mouseup();
	}
}	