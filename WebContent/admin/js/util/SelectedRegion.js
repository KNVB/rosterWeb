class SelectedRegionCoordinate
{
	constructor(rosterSchedulerTable)
	{
		this.inSelectMode=false;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.minX=-1;
		this.minY=-1;
		this.maxX=-1;
		this.maxY=-1;
	}
	clear()
	{
//		console.log(this.isClear());
		if (!this.isClear())
		{
			this.rosterSchedulerTable.clearSelectedRegion(this);
			this.minX=-1;
			this.minY=-1;
			this.maxX=-1;
			this.maxY=-1;
		}
	}
	copyToClipBoard()
	{
		
	}
	isClear()
	{
		if ((this.minX==-1)||(this.minY==-1))
			return true;
		else
			return false;
	}
	isSingleCell()
	{
		if ((this.minX==-1)||(this.minY=-1))
		{
			return false;
		}
		else
		{
			if ((this.minY==this.maxY)&& (this.maxX==this.minX))
				return true;
			else 
				return false;
		}	
		
	}
	pasteFromClipBoard()
	{
		
	}
	select(theCell)
	{
		var row=theCell.parentElement;
		
		this.clear();
		this.minX=theCell.cellIndex;
		this.minY=row.rowIndex;
		this.maxX=theCell.cellIndex;
		this.maxY=row.rowIndex;
		this.rosterSchedulerTable.setSelectedRegion(this)
		this.inSelectMode=true;
	}
	endSelect()
	{
		this.inSelectMode=false;
	}
	update(theCell)
	{
		var cellIndex=theCell.cellIndex;
		var isChanged=false;
		var newMaxX=this.maxX,newMinX=this.minX;
		var newMaxY=this.maxY,newMinY=this.minY;
		var row=theCell.parentElement;
		var rowIndex=row.rowIndex;
		
		if (this.inSelectMode)
		{
			console.log(cellIndex,this.minX,(cellIndex<this.minX));
			if (cellIndex<this.minX)
			{
				newMinX=cellIndex;
				isChanged=true;
			}
			else
			{
				if (cellIndex>this.maxX)
				{
					newMaxX=cellIndex;
					isChanged=true;
				}	
			}
			if (rowIndex>this.maxY)
			{
				newMaxY=rowIndex;
				isChanged=true;
			}
			else
			{
				if (rowIndex<this.minY)
				{
					newMinY=rowIndex;
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
				console.log("this.minX="+this.minX+",this.maxX="+this.maxX);
				console.log("this.minY="+this.minY+",this.maxY="+this.maxY);
				this.rosterSchedulerTable.setSelectedRegion(this);
			}	
		}
	}
}