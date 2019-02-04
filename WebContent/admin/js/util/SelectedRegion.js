class SelectedRegion
{
	constructor(rosterSchedulerTable)
	{
		this.inSelectMode=false;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this._init();
		this.copiedRegion=null;
	}
	copy(clipboard)
	{
		var cell1,cell2;
		var dataRowList;
		if (!this.isEmpty())
		{
			dataRowList=this.rosterSchedulerTable.getDataForCopy(this);
			if (this.copiedRegion==null)
				this.copiedRegion=new SelectedRegion(this.rosterSchedulerTable);
			else
			{	
				if (!this.copiedRegion.isEmpty())
					this.rosterSchedulerTable.clearCopiedRegion(this.copiedRegion);
			}
			this.copiedRegion.selectedCellList=this.selectedCellList;
			this.copiedRegion.minX=this.minX;
			this.copiedRegion.maxX=this.maxX;
			this.copiedRegion.minY=this.minY;
			this.copiedRegion.maxY=this.maxY;
			clipboard.clearData();
			clipboard.setData("text/plain","");
			localStorage.setItem("copiedData",JSON.stringify(dataRowList));
		}
	}
	copyToClipBoard(clipboard)
	{
		var cell1,cell2;
		var dataRowList;
		if (!this.isEmpty())
		{
			dataRowList=this.rosterSchedulerTable.getDataForCopy(this);
			if (this.copiedRegion==null)
				this.copiedRegion=new SelectedRegion(this.rosterSchedulerTable);
			else
			{	
				if (!this.copiedRegion.isEmpty())
					this.rosterSchedulerTable.clearCopiedRegion(this.copiedRegion);
			}
			this.copiedRegion.selectedCellList=this.selectedCellList;
			this.copiedRegion.minX=this.minX;
			this.copiedRegion.maxX=this.maxX;
			this.copiedRegion.minY=this.minY;
			this.copiedRegion.maxY=this.maxY;
			
			clipboard.clearData();
			clipboard.setData("application/json",JSON.stringify(dataRowList));
		}
	}
	deleteContent()
	{
		var cell,minCell,maxCell;
		var sel = window.getSelection();
		var range = document.createRange();
		for (var j=this.maxY;j>=this.minY;j--)
		{
			for (var i=this.maxX;i>=this.minX;i--)
			{
				cell=this.rosterSchedulerTable.getCell(j,i);
				if ($(cell).hasClass("cursorCell"))
				{
					//$(cell).empty().blur(); //<==this is old delete method.
					sel.removeAllRanges();
					range.selectNodeContents(cell);
					sel.addRange(range);
					document.execCommand("delete",false,null);
					$(cell).blur();
				}
			}	
		}
		cell=this.rosterSchedulerTable.getCell(this.minY,this.minX);
		cell.focus();
	}
	empty()
	{
//		console.log(this.isClear());
		if (!this.isEmpty())
		{
			this.rosterSchedulerTable.clearSelectedRegion(this);
			/*if (this.copiedRegion!=null)
			{	
				this.rosterSchedulerTable.clearCopiedRegion(this.copiedRegion);
				this.copiedRegion.empty();
			}*/
			this._init();
		}
	}
	endSelect()
	{
		var cell;
		if (this.inSelectMode)
		{	
			this.inSelectMode=false;
			this.selectedCellList=[];
			this.colCount=this.maxX-this.minX+1;
			this.rowCount=this.maxY-this.minY+1;
			for (var i=this.minY;i<=this.maxY;i++)
			{
				for (var j=this.minX;j<=this.maxX;j++)
				{
					cell=this.rosterSchedulerTable.getCell(i,j);
					this.selectedCellList.push(cell);
				}					
			}
			if (this.selectedCellList.length>1)
			{
				cell=this.rosterSchedulerTable.getCell(this.minY,this.minX);
				cell.focus();
			}
		}
	}	
	isEmpty()
	{
		return (this.selectedCellList.length<1)
	}
	isSingleCell()
	{
		return (this.selectedCellList.length==1);
	}
	paste(clipboard)
	{
		var dataRowList=JSON.parse(localStorage.getItem("copiedData"));
		var firstCell,textContent;
		if (!this.copiedRegion.isEmpty())
		{
			if (!this.isEmpty())
			{
				//console.log(this.selectedCellList.length);
				textContent=dataRowList[0][0].textContent;
			//	clipboard.clearData();
		    //	clipboard.setData("text/plain",textContent);
				firstCell=this.selectedCellList[0];
				firstCell.focus();
				
				var e = $.Event("keydown");
				e.which =textContent.charCodeAt(0);
				$(firstCell).trigger(e);
				
				
			}
		}
	}
	pasteFromClipBoard(clipboard)
	{
		if (!this.copiedRegion.isEmpty())
		{
			if (!this.isEmpty())
			{
				console.log("Do paste");
				var dataRowList=JSON.parse(clipboard.getData("application/json"));
				this.rosterSchedulerTable.pasteDataFromClipboard(this,dataRowList);
				this.rosterSchedulerTable.clearCopiedRegion(this.copiedRegion);
				this.copiedRegion.empty();				
			}	
		}	
	}
	redraw()
	{
		var cell;
		this.rosterSchedulerTable.clearSelectedRegion(this);
		this.rosterSchedulerTable.setSelectedRegion(this);
	}
	startSelect(theCell)
	{
		var row=theCell.parentElement;
		
		this.empty();
		this.firstX=theCell.cellIndex;
		this.firstY=row.rowIndex;

		this.minX=theCell.cellIndex;
		this.minY=row.rowIndex;
		this.maxX=theCell.cellIndex;
		this.maxY=row.rowIndex;
		this.rosterSchedulerTable.setSelectedRegion(this);
		this.selectedCellList.push(theCell);
		this.inSelectMode=true;

	}
	update(theCell)
	{
		if (this.inSelectMode)
		{
			var cellIndex=theCell.cellIndex;
			var isChanged=false;
			var newMaxX=this.maxX,newMinX=this.minX;
			var newMaxY=this.maxY,newMinY=this.minY;
			var row=theCell.parentElement;
			var rowIndex=row.rowIndex;
			
			if (this.inSelectMode)
			{
				//console.log(cellIndex,this.minX,(cellIndex<this.minX));
				if (cellIndex<this.firstX)
				{
					newMinX=cellIndex;
					isChanged=true;
				}
				else
				{
					if (cellIndex>this.firstX)
					{
						newMaxX=cellIndex;
						isChanged=true;
					}
					else
					{
						newMinX=this.firstX;
						newMaxX=this.firstX;
						isChanged=true;
					}	
				}
				if (rowIndex>this.firstY)
				{
					newMaxY=rowIndex;
					isChanged=true;
				}
				else
				{
					if (rowIndex<this.firstY)
					{
						newMinY=rowIndex;
						isChanged=true;
					}
					else
					{
						newMinY=this.firstY;
						newMaxY=this.firstY;
						isChanged=true;
					}	
				}
				if (isChanged)
				{
					this.rosterSchedulerTable.clearSelectedRegion(this);

					this.minX=newMinX;
					this.maxX=newMaxX;
					
					this.minY=newMinY;
					this.maxY=newMaxY;
					//console.log("this.minX="+this.minX+",this.maxX="+this.maxX);
					//console.log("this.minY="+this.minY+",this.maxY="+this.maxY);
					this.rosterSchedulerTable.setSelectedRegion(this);
				}	
			}

		}
	}	
	_init()
	{
		this.colCount=-1;
		this.firstX=-1;
		this.firstY=-1;
		this.minX=-1;
		this.minY=-1;
		this.maxX=-1;
		this.maxY=-1;
		this.rowCount=-1;
		this.selectedCellList=[];
	}
}