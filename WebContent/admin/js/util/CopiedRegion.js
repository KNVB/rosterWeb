class CopiedRegion
{
	constructor()
	{
		this._init();
	}
	empty()
	{
		if (!this.isEmpty())
		{
			this._init();
		}
	}
	isEmpty()
	{
		return (this.selectedCellList.length<1)
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