class ShiftCellHighLighter
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
			self.rosterTable.markCoorindate(this);
		});
		$(this.selectionString).mouseout(function(){
			self.rosterTable.unMarkCoorindate(this);
		});
	}
}