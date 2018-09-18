class ShiftCellEventHandler
{
	constructor(rosterTable,targetCellClassName)
	{
		var self=this;
		var selectionString="td."+targetCellClassName;
		this.rosterTable=rosterTable;
		$(selectionString).on("blur",function(){
			self.rosterTable.updateValue(this);
		});
		$(selectionString).mouseover(function(){
			var theCell=this;
			var row=theCell.parenetElement;
			var dateRow=this.rosterTable.dateRow; 
		});
		$(selectionString).mouseout(function(){
			var theCell=this;
			var row=theCell.parenetElement;
		});

	}
}