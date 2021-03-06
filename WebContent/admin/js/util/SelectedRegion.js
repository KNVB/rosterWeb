/*==============================================================================================*
 *																				  				*
 *	It denote a Selected region                                                 	                *
 *																				  				*
 *==============================================================================================*/
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
	/*==============================================================================================*
	 *																				  				*
	 *	It perform "copy" action for the selected region		                  	                *
	 *																				  				*
	 *==============================================================================================*/
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
	/*==============================================================================================*
	 *																				  				*
	 *	It delete all content in the selected region.												*
	 *  (This action can be roll back)							                  	                *
	 *																				  				*
	 *==============================================================================================*/
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
					sel.removeAllRanges();
					range.selectNodeContents(cell);
					sel.addRange(range);
					document.execCommand("delete",false,null);
					$(cell).blur();
				}
			}	
		}
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It clear the selected region.																*
	 *																				  				*
	 *==============================================================================================*/
	empty()
	{
		if (!this.isEmpty())
		{
			this.rosterSchedulerTable.clearSelectedRegion(this);
			this._init();
		}
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It clear the selected region.																*
	 *																				  				*
	 *==============================================================================================*/
	emptyCopiedRegion()
	{
		if (!this.copiedRegion.isEmpty())
		{	
			console.log("Clear CopiedRegion");
			this.rosterSchedulerTable.clearCopiedRegion(this.copiedRegion);
			this.copiedRegion.empty();
		}
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It end the region selection.																*
	 *																				  				*
	 *==============================================================================================*/
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
			var cell=this.rosterSchedulerTable.getCell(this.minY,this.minX);
			var range = document.createRange();
			var sel = window.getSelection();
			range.selectNodeContents(cell);
		    sel.removeAllRanges();
		    sel.addRange(range);
			this.firstInput=true;			
		}
	}
	/*==============================================================================================*
	 *																				  				*
	 *	To determine whether selected region is empty.												*
	 *																				  				*
	 *==============================================================================================*/
	isEmpty()
	{
		return (this.selectedCellList.length<1)
	}
	/*==============================================================================================*
	 *																				  				*
	 *	To determine whether selected region is a single cell.										*
	 *																				  				*
	 *==============================================================================================*/
	isSingleCell()
	{
		return (this.selectedCellList.length==1);
	}
	/*==============================================================================================*
	 *																				  				*
	 *	It perform "paste" action to the selected region		                  	                *
	 *  (This action can be roll back)							                  	                *
	 *  																			  				*
	 *==============================================================================================*/
	paste()
	{
		if (!this.isEmpty() && !this.copiedRegion.isEmpty())
		{
			var destCellY=this.minY,destCellX=this.minX;
			var destWidth=this.maxX-this.minX+1;
			var destHeight=this.maxY-this.minY+1;
			var srcWidth=this.copiedRegion.maxX-this.copiedRegion.minX+1;
			var srcHeight=this.copiedRegion.maxY-this.copiedRegion.minY+1;
			
			var horizontalCopyTime=Math.floor(destWidth/srcWidth);
			var verticalCopyTime=Math.floor(destHeight/srcHeight);
			
			if (verticalCopyTime==0)
				verticalCopyTime=1;
			if (horizontalCopyTime==0)
				horizontalCopyTime=1;
			console.log(`srcWidth=${srcWidth},destWidth=${destWidth},horizontalCopyTime=${horizontalCopyTime}`);
			console.log(`srcHeight=${srcHeight},destHeight=${destHeight},verticalCopyTime=${verticalCopyTime}`);
			console.log(`this.minY=${this.minY},this.minX=${this.minX}`);
			console.log(`this.maxY=${this.maxY},this.maxX=${this.maxX}`);
			for (var j=0;j<verticalCopyTime;j++)
			{
				for (var i=0;i<horizontalCopyTime;i++)
				{
					console.log(`destCellY=${destCellY},destCellX=${destCellX}`);
					this.rosterSchedulerTable.doCopy(this.copiedRegion,destCellY,destCellX);
					destCellX+=srcWidth;
				}
				destCellX=this.minX;
				destCellY+=srcHeight;
			}	
			
			var destCell=this.rosterSchedulerTable.getCell(this.minY,this.minX);
			this.rosterSchedulerTable.clearSelectedRegion(this);
			this.startSelect(destCell);
			this.maxX=this.minX+horizontalCopyTime*srcWidth-1;
			this.maxY=destCellY-1;
			destCell=this.rosterSchedulerTable.getCell(this.maxY,this.maxX);
			this.update(destCell);
			this.endSelect();
		}	
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Set the focus to the given cell							                  	                *
	 *  																			  				*
	 *==============================================================================================*/
	setFocusCell(theCell)
	{
		var sel = window.getSelection();
		theCell.focus();
		sel.collapse(theCell.firstChild, 1);
		this.firstInput=false;
	}
	/*==============================================================================================*
	 *																				  				*
	 *	Select the given cell									                  	                *
	 *  																			  				*
	 *==============================================================================================*/
	selectCell(theCell)
	{
		this.empty();
		this.emptyCopiedRegion();
		this.startSelect(theCell);
		this.update(theCell);
		this.endSelect();
	}
	/*==============================================================================================*
	 *																				  				*
	 *	According to the given offset, select the next cell in roster table        	                *
	 *  																			  				*
	 *==============================================================================================*/
	selectNextCell(event,yOffset,xOffset)
	{
		console.log(`this.firstInput=${this.firstInput},yOffset=${yOffset},xOffset=${xOffset}`);
		if (this.firstInput)
		{
			var nextCell=this.rosterSchedulerTable.getNextCellInRosterTable(yOffset,xOffset);
			if ((event.shiftKey) && (event.which!=9) && (event.which!=13))
			{
				var firstCell=this.rosterSchedulerTable.getCell(this.firstY,this.firstX);
				this.startSelect(firstCell);
				this.update(nextCell);
			}	
			else
				this.startSelect(nextCell);
			
			this.endSelect();
			event.preventDefault();
		}
	}
	/*==============================================================================================*
	 *																				  				*
	 *	According to the given offset, select the next cell in selected region     	                *
	 *  																			  				*
	 *==============================================================================================*/
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
	/*==============================================================================================*
	 *																				  				*
	 *	Start selected region												     	                *
	 *  																			  				*
	 *==============================================================================================*/
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
	/*==============================================================================================*
	 *																				  				*
	 *	Update the selected region											     	                *
	 *  																			  				*
	 *==============================================================================================*/
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
				console.log("this.minX="+this.minX+",this.maxX="+this.maxX);
				console.log("this.minY="+this.minY+",this.maxY="+this.maxY);
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