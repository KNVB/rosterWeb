class CellEventUtil
{
	static addCursorEventHandler(cellObj)
	{
		$(cellObj).addClass(Css.cursorCellClassName);

		$(cellObj).mouseover(function(){
			cellObj.rosterTable.markCoorindate(this);
		});
		$(cellObj).mouseout(function(){
			cellObj.rosterTable.unMarkCoorindate(this);
		});
	}
}