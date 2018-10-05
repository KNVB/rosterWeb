class Utility
{
	constructor()
	{
	}
	getShiftCssClassName(shiftType)
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
					 className="dxShiftColor";
					 break;
			case  "O":
					 className="oShiftColor";
					 break;
    	}
    	return className;
	}
	
	printPreviousMonthShiftCell(shiftType)
	{
		var className="alignCenter borderCell";
		className+=" "+utility.getShiftCssClassName(shiftType);
		if (shiftType=="null")
			document.write("<td class=\""+className+"\"></td>");
		else	
			document.write("<td class=\""+className+"\">"+shiftType+"</td>");
	}
	printShiftCell(shiftType)
	{
		var className="alignCenter borderCell cursorCell";
		className+=" "+utility.getShiftCssClassName(shiftType);
		document.write("<td class=\""+className+"\">"+shiftType+"</td>");
	}	
	roundTo(theValue,decPlace)
	{
		var result=theValue*Math.pow(10,decPlace);
		result=Math.round(result);
		result=result/Math.pow(10,decPlace);
		return result;
	}
	showAjaxErrorMessage(jqXHR, textStatus, errorThrown)
	{
		console.log(jqXHR,textStatus);
	}
}