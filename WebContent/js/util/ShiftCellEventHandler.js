class ShiftCellEventHandler
{
	constructor(rosterTable,targetCellClassName)
	{
		var self=this;
		this.selectionString="td."+targetCellClassName;
		this.rosterTable=rosterTable;
		/*$(selectionString).on("blur",function(){
			self.rosterTable.updateValue(this);
		});*/
		$(this.selectionString).mouseover(function(){
			var theCell=this;
			var row=theCell.parentElement;
			var dateRow=self.rosterTable.dateRow;
			var cell=dateRow.cells[theCell.cellIndex];
			$(cell).addClass("highlight");
			
			cell=row.cells[0];
			$(cell).addClass("highlight");
		});
		$(this.selectionString).mouseout(function(){
			var theCell=this;
			var row=theCell.parentElement;
			var dateRow=self.rosterTable.dateRow;
			var cell=dateRow.cells[theCell.cellIndex];
			$(cell).removeClass("highlight");
			cell=row.cells[0];
			$(cell).removeClass("highlight");
		});

	}
}