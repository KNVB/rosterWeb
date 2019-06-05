class Utility
{
	constructor()
	{
		this.monthNames={1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"};
	}
	getDateList(year,month)
	{
		return jQuery.ajax({"url": "<%=request.getContextPath()%>/getDateList.jsp",
							data:{"year":year,"month":month},
							method:"POST",
							dataType:"json",
							error: function(xhr) {
							      console.log('error', xhr);
							    }
		});
	}
	getRosterList(year,month)
	{
		return jQuery.ajax({"url": "<%=request.getContextPath()%>/getRosterList.jsp",
							data:{"year":year,"month":month},
							method:"POST",
							dataType:"json",
							error: function(xhr) {
							      console.log('error', xhr);
							    }
		});
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
					 className="dShiftColor";
					 break;
			case  "O":
					 className="oShiftColor";
					 break;
    	}
    	return className;
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
		alert(jqXHR,textStatus);
	}
}