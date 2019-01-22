class SelectedRegion
{
	constructor(rosterSchedulerTable)
	{
		this.inSelectMode=false;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this._init();
	}
	clear()
	{
//		console.log(this.isClear());
		if (!this.isClear())
		{
			this.rosterSchedulerTable.clearSelectedRegion(this);
			this._init();
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
		this.firstX=theCell.cellIndex;
		this.firstY=row.rowIndex;

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
				console.log(cellIndex,this.minX,(cellIndex<this.minX));
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
						if (cellIndex==this.firstX)
						{
							newMinX=this.firstX;
							newMaxX=this.firstX;
							isChanged=true;
						}
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
						if (rowIndex==this.firstY)
						{
							newMinY=this.firstY;
							newMaxY=this.firstY;
							isChanged=true;
						}
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
	_init()
	{
		this.firstX=-1;
		this.firstY=-1;
		this.minX=-1;
		this.minY=-1;
		this.maxX=-1;
		this.maxY=-1;
	}
}