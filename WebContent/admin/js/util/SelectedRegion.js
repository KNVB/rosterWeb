class SelectedRegion
{
	constructor(rosterSchedulerTable)
	{
		this.inSelectMode=false;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this._init();
	}
	empty()
	{
		if (!this.isEmpty())
		{
			this.rosterSchedulerTable.clearSelectedRegion(this);
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