class SelectedRegion
{
	constructor(rosterSchedulerTable)
	{
		this.firstInput=false;
		this.inSelectMode=false;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.copiedRegion=new CopiedRegion();
		this._init();
	}
	copy()
	{
		var cell1,cell2;
		var dataRowList;
		var self=this;
		console.log("is selectedRegion Empty?="+this.isEmpty());
		if (!this.isEmpty())
		{
			console.log("is copiedRegion Empty?="+this.copiedRegion.isEmpty());
			if (!this.copiedRegion.isEmpty())
			{	
				console.log("Clear CopiedRegion");
				this.rosterSchedulerTable.clearCopiedRegion(this.copiedRegion);
			}
			this.copiedRegion.empty();
			this.selectedCellList.forEach(function(element){
				self.copiedRegion.selectedCellList.push(element);
			});
			this.copiedRegion.minX=this.minX;
			this.copiedRegion.maxX=this.maxX;
			this.copiedRegion.minY=this.minY;
			this.copiedRegion.maxY=this.maxY;
			this.rosterSchedulerTable.setCopiedRegion(this);
		}
	}
	empty()
	{
		if (!this.isEmpty())
		{
			this.rosterSchedulerTable.clearSelectedRegion(this);
			this._init();
		}
	}
	emptyCopiedRegion()
	{
		if (!this.copiedRegion.isEmpty())
		{	
			console.log("Clear CopiedRegion");
			this.rosterSchedulerTable.clearCopiedRegion(this.copiedRegion);
			this.copiedRegion.empty();
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
			cell=this.rosterSchedulerTable.getCell(this.minY,this.minX);
			var range = document.createRange();
			var sel = window.getSelection();
			range.selectNodeContents(cell);
		    sel.removeAllRanges();
		    sel.addRange(range);
			this.firstInput=true;
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
	paste()
	{
		if (!this.isEmpty() && !this.copiedRegion.isEmpty())
		{
			var destCellY=this.minY,destCellX=this.minX;
			var theCell,destCell=this.rosterSchedulerTable.getCell(destCellY,destCellX);
			
			for (var y=this.copiedRegion.minY;y<=this.copiedRegion.maxY;y++)
			{	
				var row=[];
				for (var x=this.copiedRegion.minX;x<=this.copiedRegion.maxX;x++)
				{
					theCell=this.rosterSchedulerTable.getCell(y,x);
					destCell=this.rosterSchedulerTable.getCell(destCellY,destCellX++);
					var range = document.createRange();
					var sel = window.getSelection();
				    destCell.focus();
				    range.selectNodeContents(destCell);
				    sel.removeAllRanges();
				    sel.addRange(range);
				    console.log(document.execCommand("insertText",false,theCell.textContent));
				}
				destCellY++;
				destCellX=this.minX;
			}
			this.rosterSchedulerTable.clearSelectedRegion(this);
			this.maxX=this.minX+(this.copiedRegion.maxX-this.copiedRegion.minX);
			this.maxY=destCellY-1;
			this.reSelect();
		}	
	}
	reSelect()
	{
		var theCell=this.rosterSchedulerTable.getCell(this.minY,this.minX);
		this.startSelect(theCell);
		theCell=this.rosterSchedulerTable.getCell(this.maxY,this.maxX);
		this.update(theCell);
		this.endSelect();
	}
	setFocusCell(theCell)
	{
		var sel = window.getSelection();
		theCell.focus();
		sel.collapse(theCell.firstChild, 1);
		this.firstInput=false;
	}
	selectCell(theCell)
	{
		this.empty();
		this.emptyCopiedRegion();
		this.startSelect(theCell);
		this.update(theCell);
		this.endSelect();
	}
	selectNextCell(event,yOffset,xOffset)
	{
		console.log(`this.firstInput=${this.firstInput}`);
		if (this.firstInput)
		{
			var nextCell=this.rosterSchedulerTable.getNextCellInRosterTable(yOffset,xOffset);
			this.selectCell(nextCell);
			event.preventDefault();
		}
	}
	selectNextCellInSelectedRegion(theCell,yOffset,xOffset)
	{
		var nextCell=this.rosterSchedulerTable.getNextCellInSelectedRegion(theCell,yOffset,xOffset);
		var range = document.createRange();
		var sel = window.getSelection();
		range.selectNodeContents(nextCell);
	    sel.removeAllRanges();
	    sel.addRange(range);
	    this.firstInput=true;
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
		
		/*
		if (!this.copiedRegion.isEmpty())
		{	
			this.rosterSchedulerTable.clearCopiedRegion(this.copiedRegion);
			this.copiedRegion.empty();
		}
		*/
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