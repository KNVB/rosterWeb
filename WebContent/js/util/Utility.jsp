<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType="application/javascript; charset=UTF-8" pageEncoding="UTF-8"%>
/***********************************************************************************
 *                                                                                 * 
 * This is utility object.	                                                       *
 * It is provide different type of utility function.							   *
 * 																		           * 
 ***********************************************************************************/
class Utility
{
	constructor()
	{
		this.monthNames={1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"};
	}
	/***********************************************************************************
	 *                                                                                 * 
	 * It returns the date object list for the given year and month                    *
	 * It get the date object list from server side.								   *
	 * 																		           * 
	 ***********************************************************************************/
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
	/***********************************************************************************
	 *                                                                                 * 
	 * It returns the roster data list for the given year and month                    *
	 * It get the roster data list from server side.								   *
	 * 																		           * 
	 ***********************************************************************************/
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