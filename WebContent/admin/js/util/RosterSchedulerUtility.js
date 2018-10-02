class RosterSchedulerUtility extends Utility
{
	constructor()
	{
		super();
	}
	exportRosterToExcel(rosterData)
	{
		return jQuery.ajax({"url": "exportRosterToExcel.jsp",
			data:JSON.stringify(rosterData),
			method:"POST",
			dataType: 'binary',
			xhrFields: {
		            responseType: 'blob'
		        },
			success:function(blob, status, request){
						  var fileName=(request.getResponseHeader("Content-Disposition"));
						  fileName=fileName.substr(fileName.indexOf("filename=")+"filename=".length);
					      var link=document.createElement('a');
					      link.href=window.URL.createObjectURL(blob);
					      link.download=fileName;
					      link.click();
					 },   
			error:this.showAjaxErrorMessage			 
		});
	}
	getRosterData(year,month)
	{
		var requestParameters={"year":year,"month":month}; 
		return jQuery.ajax({"url": "getRoster.jsp",
					 dataType: 'json',
					 data:requestParameters,
					 error:this.showAjaxErrorMessage
		});
	}
	getRosterRule(year,month)
	{
		var requestParameters={"year":year,"month":month}; 
		return jQuery.ajax({"url":"getRosterRule.jsp",
					 dataType: 'json',
					 data:requestParameters,
					 error:this.showAjaxErrorMessage
		});
	}
	getITOList(year,month)
	{
		var requestParameters={"year":year,"month":month}; 
		return jQuery.ajax({"url":"getITOList.jsp",
					 dataType: 'json',
					 data:requestParameters,
					 error:this.showAjaxErrorMessage
		});
	}
	printShiftCell(shiftType)
	{
		var className="alignCenter borderCell cursorCell shiftCell";
		className+=" "+utility.getShiftCssClassName(shiftType);
		document.write("<td class=\""+className+"\">"+shiftType+"</td>");
	}
	saveRosterData(rosterData)
	{
		console.log(rosterData);
		return jQuery.ajax({"url": "saveRosterData.jsp",
			 dataType: 'text',
			 data:JSON.stringify(rosterData),
			 method:"POST",
			 error:this.showAjaxErrorMessage
		});
	}
}