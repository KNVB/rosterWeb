class CursorCellSelector
{
	constructor(rosterSchedulerTable,targetCellClassName)
	{
		var self=this;
		this.selectedRegion=new SelectedRegion(rosterSchedulerTable);
		this.selectionString="td."+targetCellClassName;
		this.rosterSchedulerTable=rosterSchedulerTable;
		
		$(this.selectionString).mousedown(function(event){
			event.preventDefault();
			self.selectedRegion.select(this);
		});
		$(this.selectionString).mouseenter(function(event){
			self.selectedRegion.update(this);
			event.preventDefault();
		});
		$(this.selectionString).dblclick(function(event){
			this.focus();			
			event.preventDefault();
		});
		$("body").mouseup(function(event){
			event.preventDefault();
			self.selectedRegion.endSelect();
		});

	}
}