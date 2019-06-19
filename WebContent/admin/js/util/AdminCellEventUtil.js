class AdminCellEventUtil extends CellEventUtil
{
	static addAutoUpdateHandler(cellObj,itoId)
	{
		$(cellObj).addClass(AdminCss.shiftCellClassName);
		$(cellObj).blur(function(event){
			cellObj.rosterTable.updateValue(this,itoId);
		});
	}
}