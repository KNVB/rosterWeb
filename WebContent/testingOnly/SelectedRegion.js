class SelectedRegion
{
	constructor(rosterSchedulerTable)
	{
		this.inSelectMode=false;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.firstX=-1;
		this.firstY=-1;
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
			this.firstX=-1;
			this.firstY=-1;
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
	}	
}