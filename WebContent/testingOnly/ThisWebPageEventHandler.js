class ThisWebPageEventHandler
{
	constructor(rosterSchedulerTable,targetCellClassName,selectedRegion)
	{
		var self=this;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.targetCellClassName=targetCellClassName;
		this.selectedRegion=selectedRegion;
		$("body").mouseup(function(event){
			event.preventDefault();
			self.selectedRegion.endSelect();
		});
		
		$("body").keydown(function(event){
			self._handleKeyDownEvent(event);
		});		
	}	
	_handleKeyDownEvent(event)
	{
		/*switch (event.which)
		{
			case 90:
					if(event.ctrlKey)
					{
						this._handleUndoEvent(event);
					}
					break;			
		}*/
	}		
}