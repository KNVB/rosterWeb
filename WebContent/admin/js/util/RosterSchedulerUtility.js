class RosterSchedulerUtility extends Utility
{
	constructor(jspPath)
	{
		super(jspPath);
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
}