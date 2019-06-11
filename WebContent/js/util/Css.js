class Css
{
	static get actualHourCellClassName()
	{
		return "actualHourCell";
	}
	static get alignCenterClassName()
	{
		return "alignCenter";
	}
	static get alignLeftClassName()
	{
		return "alignLeft";
	}
	static get aShiftColorClassName()
	{
		return "aShiftColor";
	}
	static get bShiftColorClassName()
	{
		return"bShiftColor";
	}
	static get borderCellClassName()
	{
		return "borderCell";
	}
	static get clickableClassName()
	{
	 	return "clickable";
	}
	static get cShiftColorClassName()
	{
		return "cShiftColor";
	}
	static get cursorCellClassName()
	{
		return "cursorCell";
	}	
	static get dateCellClassName()
	{
		return "dateCell";
	}
	static get dShiftColorClassName()
	{
		return "dShiftColor";
	}
	static get highlightCellClassName()
	{
	 	return "highlightCell";
	}
	static get lastMonthCellClassName()
	{
		return "lastMonthCell";
	}
	static get nameCellClassName()
	{
	 	return "nameCell";
	}
	static get noOfWorkingDayCellClassName()
	{
	 	return "noOfWorkingDayCell";
	}
	static get oShiftColorClassName()
	{
	 	return "oShiftColor";
	}
	static get phCellClassName()
	{
	 	return "phCell";
	}
	static get rosterMonthSelectCellClassName()
	{
	 	return "rosterMonthSelectCell";
	}
	static get shiftCellClassName()
	{
	 	return "shiftCell";
	}
	static get shiftCountCellClassName()
	{
	 	return "shiftCountCell";
	}
	static get sickLeaveColorClassName()
	{
	 	return "sickLeaveColor";
	}
	static get thisMonthCellClassName()
	{
	 	return "thisMonthCell";
	}
	static get titleCellClassName()
	{
	 	return "titleCell";
	}
	static get totalCellClassName()
	{
	 	return "totalCell";
	}
	static get totalHourCellClassName()
	{
	 	return "totalHourCell";
	}
	static get underlineTextClassName()
	{
	 	return "underlineText";
	}

	static getShiftCssClassName(shiftType)
	{
		var className="";
		switch (shiftType)
		{
			case "a":
					className="aShiftColor";
					break;	
			case "b":
			case "b1":
					className="bShiftColor";
					break;
			case "c":
					className="cShiftColor";
					break;
			case "d":
			case "d1":
			case "d2":
			case "d3":
					 className="dShiftColor";
					 break;
			case  "O":
					 className="oShiftColor";
					 break;
		}
		return className;
	}
}		