class CursorCellEventHandler
{
	constructor(targetRegion,rosterSchedulerTable,selectedRegion)
	{
		var self=this;
		this.selectedRegion=selectedRegion;
		this.rosterSchedulerTable=rosterSchedulerTable;
		this.targetRegion=targetRegion;
		$(targetRegion).unbind();
		
		targetRegion.mousedown(function(event){
			event.preventDefault();
		//	console.log("mouse down");
			self.selectedRegion.startSelect(this);
		});
		targetRegion.mouseenter(function(event){
		//	console.log("mouse enter");
			self.selectedRegion.update(this);
			event.preventDefault();
		});
		targetRegion.dblclick(function(event){
		//	console.log("Double click");
			this.contentEditable="true";
			this.focus();			
		});
		targetRegion.click(function(event){
			//	console.log("Double click");
				this.contentEditable="false";
				this.focus();			
			});
	}	
}