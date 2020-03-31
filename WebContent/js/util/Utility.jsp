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
	calculateShiftStat(noOfWorkingDay,rosterRowData,shiftHourCount)
	{
		var aShiftCount=0,actualWorkingHour=0.0,bxShiftCount=0,cShiftCount=0,dxShiftCount=0,balance=0.0;
		var	thisMonthHourTotal=0.0,thisMonthBalance=0.0,totalHour=0.0;
		var i,result={},shiftType,shiftTypeList;
		totalHour=rosterRowData.itoworkingHourPerDay*noOfWorkingDay;
		//console.log(rosterRowData.itoworkingHourPerDay,noOfWorkingDay);
		for (i=1;i<=Object.keys(rosterRowData.shiftList).length;i++)
		{
			shiftTypeList=rosterRowData.shiftList[i].split("\+");
			shiftTypeList.forEach((shiftType) => {
				actualWorkingHour+=shiftHourCount[shiftType];
				// console.log("shiftType="+shiftType+","+shiftHourCount[shiftType]);
				switch (shiftType)
				{
					case "a":
								aShiftCount++;
								break;
					case "b":
					case "b1":
								bxShiftCount++;
								break;
					case "c":
								cShiftCount++;
								break;
					case "d":
					case "d1":
					case "d2":
					case "d3":
								dxShiftCount++;
								break;					
				}
			});
		}
		thisMonthHourTotal=actualWorkingHour-totalHour;
		thisMonthBalance=rosterRowData.lastMonthBalance+thisMonthHourTotal;
		//noOfWorkingDay=aShiftCount+bxShiftCount+cShiftCount+dxShiftCount;
		
		result.totalHour=totalHour.toFixed(2);
		result.lastMonthBalance=rosterRowData.lastMonthBalance.toFixed(2);
		result.actualHour=actualWorkingHour.toFixed(2);
		result.thisMonthHourTotal=thisMonthHourTotal.toFixed(2);
		result.thisMonthBalance=thisMonthBalance.toFixed(2);
		
		result.aShiftCount=aShiftCount;
		result.bxShiftCount=bxShiftCount;
		result.cShiftCount=cShiftCount;
		result.dxShiftCount=dxShiftCount;
		result.noOfWorkingDay=noOfWorkingDay;
		return result;
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