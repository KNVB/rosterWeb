class MouseEventHandler
{
	constructor(cursorCells,selectedRegion)
	{
		var self=this;
		this.cursorCells=cursorCells;
		this.selectedRegion=selectedRegion;
		cursorCells.unbind();
		$(document).mouseup(function(event){
			event.preventDefault();
			self.selectedRegion.endSelect();
		});
		cursorCells.keydown(function(event){
			event.stopPropagation();
			console.log(event.target);
		});
		cursorCells.mousedown(function(event){
			event.preventDefault();
		//	console.log("mouse down");
			self.selectedRegion.startSelect(this);
		});
		cursorCells.mouseenter(function(event){
		//	console.log("mouse enter");
			self.selectedRegion.update(this);
			event.preventDefault();
		});
		/*
		cursorCells.dblclick(function(event){
			console.log("Double click");
			this.contentEditable="true";
			this.focus();			
		});
		
		cursorCells.click(function(event){
			console.log("On click");
			this.contentEditable="true";
			this.focus();			
			this.contentEditable="false";
		});
		*/
	}
}