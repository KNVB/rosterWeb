class Utility
{
	constructor(jspPath)
	{
		this.jspPath=jspPath;
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
	//Get the mean value for the incoming array of value;
	getMean(data)
	{
		 return data.reduce(function (a, b) {
		        return Number(a) + Number(b);
		    }) / data.length;
	}	
	getRosterData(year,month)
	{
		var requestParameters={"year":year,"month":month}; 
		return jQuery.ajax({"url": this.jspPath+"getRoster.jsp",
					 dataType: 'json',
					 data:requestParameters,
					 error:this.showAjaxErrorMessage
		});
	}
	getRosterRule(year,month)
	{
		var requestParameters={"year":year,"month":month}; 
		return jQuery.ajax({"url": this.jspPath+"getRosterRule.jsp",
					 dataType: 'json',
					 data:requestParameters,
					 error:this.showAjaxErrorMessage
		});
	}	
	//Get The Standard Deviation for the incoming array of value;
	getSD(data)
	{
	    var m =this.getMean(data);
	    return Math.sqrt(data.reduce(function (sq, n) {
	            return sq + Math.pow(n - m, 2);
	        }, 0) / (data.length - 1));
	};
	printPreviousMonthShiftCell(shiftType)
	{
		var className="alignCenter borderCell";
		className+=" "+utility.getShiftCssClassName(shiftType);
		document.write("<td class=\""+className+"\">"+shiftType+"</td>");
	}
	printShiftCell(shiftType)
	{
		var className="alignCenter borderCell shiftCell";
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