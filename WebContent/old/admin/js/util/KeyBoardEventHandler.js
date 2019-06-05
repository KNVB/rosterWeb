class KeyBoardEventHandler
{
	constructor(rosterSchedulerTable,selectedRegion)
	{
		var self=this;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.selectedRegion=selectedRegion;
		$("body").unbind();
		/*
		$("body").keydown(function(event){
			event.stopPropagation();
			self._handleKeyDownEvent(event);
		});
		*/
	}
	_handleKeyDownEvent(event)
	{
		var index,orgIndex,theCell;
		console.log(event.target);
	}
}