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
	}
}