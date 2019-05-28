class HtmlBodyEventHandler
{
	constructor(rosterSchedulerTable,selectedRegion)
	{
		var self=this;
		this.selectedRegion=selectedRegion;
		this.rosterSchedulerTable=rosterSchedulerTable;
		
		$("body").unbind();
		$("body").mouseup(function(event){
			event.preventDefault();
			self.selectedRegion.endSelect();
		});
		$(document).keydown(function(event){
			event.stopPropagation();
			self._handleKeyDownEvent(event);
		});
	}
	_handleKeyDownEvent(event)
	{
		console.log(event.target.type)
	}
}