class RosterSchedulerUtility extends Utility
{
	constructor()
	{
		super();
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
}