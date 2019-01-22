class RosterSchedulerTable
{
	constructor()
	{
		this.rosterTable=document.getElementById("rosterTable");
	}
	clearSelectedRegion(selectedRegion)
	{
		var cell,i,j;
		for (i=selectedRegion.minY;i<=selectedRegion.maxY;i++)
		{
			for (j=selectedRegion.minX;j<=selectedRegion.maxX;j++)
			{
				cell=this.getCell(i,j);
				cell.blur();
				$(cell).removeClass("selectCellBorderRight");   
				$(cell).removeClass("selectCellBorderTop");     
				$(cell).removeClass("selectCellBorderBottom");  
				$(cell).removeClass("selectCellBorderLeft");
			}	
		}
	}
	getCell(rowIndex,cellIndex)
	{
		var row=this.rosterTable.rows[rowIndex];
		var cell=row.cells[cellIndex];
		return cell;
	}
	setSelectedRegion(selectedRegion)
	{
		var cell,i;
		cell=this.getCell(selectedRegion.minY,selectedRegion.minX);
		$(cell).addClass("selectCellBorderTop");
		$(cell).addClass("selectCellBorderLeft");
		
		cell=this.getCell(selectedRegion.minY,selectedRegion.maxX);
		$(cell).addClass("selectCellBorderTop");
		$(cell).addClass("selectCellBorderRight");
		
		cell=this.getCell(selectedRegion.maxY,selectedRegion.minX);
		$(cell).addClass("selectCellBorderBottom");
		$(cell).addClass("selectCellBorderLeft");

		cell=this.getCell(selectedRegion.maxY,selectedRegion.maxX);
		$(cell).addClass("selectCellBorderBottom");
		$(cell).addClass("selectCellBorderRight");
		
		for (i=selectedRegion.minY+1;i<selectedRegion.maxY;i++)
		{
			cell=this.getCell(i,selectedRegion.minX);
			$(cell).addClass("selectCellBorderLeft");

			cell=this.getCell(i,selectedRegion.maxX);
			$(cell).addClass("selectCellBorderRight");
		}
		for (i=selectedRegion.minX+1;i<selectedRegion.maxX;i++)
		{
			cell=this.getCell(selectedRegion.minY,i);
			$(cell).addClass("selectCellBorderTop");
			
			cell=this.getCell(selectedRegion.maxY,i);
			$(cell).addClass("selectCellBorderBottom");
		}
	}
}